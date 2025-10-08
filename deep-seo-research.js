#!/usr/bin/env node

/**
 * Deep SEO & Competitor Research for Fearnbell Marketing
 * Comprehensive analysis covering SERP, keywords, backlinks, content gaps
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class DeepSEOResearch {
  constructor() {
    this.auth = Buffer.from(
      `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
    ).toString('base64');
    this.baseURL = 'https://api.dataforseo.com/v3';
    this.results = {
      timestamp: new Date().toISOString(),
      brand: 'Fearnbell Marketing',
      executive_summary: {},
      serp_analysis: {},
      competitor_profiles: {},
      keyword_opportunities: {},
      content_gaps: {},
      backlink_analysis: {},
      technical_seo: {},
      strategic_recommendations: {}
    };
  }

  async apiCall(endpoint, data) {
    try {
      const response = await axios({
        method: 'POST',
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
      });
      
      if (response.data.status_code === 20000) {
        return response.data.tasks[0]?.result || null;
      }
      return null;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error.message);
      return null;
    }
  }

  // 1. COMPREHENSIVE KEYWORD RESEARCH
  async keywordResearch() {
    console.log('\n📊 PHASE 1: COMPREHENSIVE KEYWORD RESEARCH');
    console.log('=' .repeat(60));

    const seedKeywords = [
      // Core business terms
      'marketing agency',
      'digital marketing',
      'seo services',
      'website development',
      
      // Location modifiers
      'marketing agency london',
      'marketing agency uk',
      'seo london',
      'web design london',
      
      // USP keywords
      'fair pricing marketing',
      'transparent marketing agency',
      'ethical marketing services',
      'affordable marketing agency',
      'honest marketing company',
      
      // Service-specific
      'small business marketing',
      'startup marketing agency',
      'b2b marketing services',
      'content marketing agency',
      'social media marketing'
    ];

    const keywordData = {
      primary_keywords: [],
      long_tail: [],
      questions: [],
      local_keywords: []
    };

    for (const keyword of seedKeywords) {
      console.log(`  Analyzing: "${keyword}"`);
      
      // Get search volume and difficulty
      const volumeData = await this.apiCall('/keywords_data/google/search_volume/live', [{
        keywords: [keyword],
        location_code: 2826, // UK
        language_code: 'en'
      }]);

      if (volumeData && volumeData[0]?.keyword_data) {
        const kd = volumeData[0].keyword_data[keyword];
        keywordData.primary_keywords.push({
          keyword: keyword,
          search_volume: kd?.search_volume || 0,
          competition: kd?.competition || 0,
          cpc: kd?.cpc || 0,
          competition_level: kd?.competition_level || 'unknown'
        });
      }

      // Get related keywords and questions
      const suggestions = await this.apiCall('/keywords_data/google/related_keywords/live', [{
        keyword: keyword,
        location_code: 2826,
        language_code: 'en',
        limit: 20,
        include_seed_keyword: false
      }]);

      if (suggestions && suggestions[0]?.items) {
        suggestions[0].items.forEach(item => {
          if (item.keyword_data.keyword.includes('?')) {
            keywordData.questions.push({
              question: item.keyword_data.keyword,
              search_volume: item.keyword_data.keyword_info?.search_volume || 0
            });
          } else if (item.keyword_data.keyword.split(' ').length > 4) {
            keywordData.long_tail.push({
              keyword: item.keyword_data.keyword,
              search_volume: item.keyword_data.keyword_info?.search_volume || 0,
              difficulty: item.keyword_data.keyword_info?.competition || 0
            });
          }
        });
      }

      await this.sleep(1000); // Rate limiting
    }

    // Sort and filter results
    keywordData.primary_keywords.sort((a, b) => b.search_volume - a.search_volume);
    keywordData.long_tail = [...new Set(keywordData.long_tail.map(k => JSON.stringify(k)))]
      .map(k => JSON.parse(k))
      .sort((a, b) => b.search_volume - a.search_volume)
      .slice(0, 50);
    
    this.results.keyword_opportunities = keywordData;
    console.log(`  ✅ Found ${keywordData.primary_keywords.length} primary keywords`);
    console.log(`  ✅ Found ${keywordData.long_tail.length} long-tail opportunities`);
    console.log(`  ✅ Found ${keywordData.questions.length} question keywords`);
  }

  // 2. COMPETITOR IDENTIFICATION & ANALYSIS
  async competitorAnalysis() {
    console.log('\n🎯 PHASE 2: COMPETITOR IDENTIFICATION & ANALYSIS');
    console.log('=' .repeat(60));

    const competitorDomains = new Map();
    const targetKeywords = [
      'marketing agency london',
      'digital marketing uk',
      'seo services london',
      'fair pricing marketing',
      'transparent marketing agency'
    ];

    // Find competitors from SERP
    for (const keyword of targetKeywords) {
      console.log(`  Scanning SERP for: "${keyword}"`);
      
      const serpData = await this.apiCall('/serp/google/organic/live/advanced', [{
        keyword: keyword,
        location_code: 2826,
        language_code: 'en',
        device: 'desktop',
        depth: 30,
        load_serp_screenshot: false
      }]);

      if (serpData && serpData[0]?.items) {
        serpData[0].items.forEach(item => {
          if (item.type === 'organic') {
            const domain = item.domain;
            if (!competitorDomains.has(domain)) {
              competitorDomains.set(domain, {
                domain: domain,
                appearances: 0,
                positions: [],
                urls: [],
                avg_position: 0
              });
            }
            
            const comp = competitorDomains.get(domain);
            comp.appearances++;
            comp.positions.push(item.rank_group);
            comp.urls.push(item.url);
          }
        });
      }

      await this.sleep(1000);
    }

    // Calculate average positions and sort
    const topCompetitors = Array.from(competitorDomains.values())
      .map(comp => {
        comp.avg_position = comp.positions.reduce((a, b) => a + b, 0) / comp.positions.length;
        return comp;
      })
      .sort((a, b) => b.appearances - a.appearances)
      .slice(0, 10);

    console.log(`\n  🏆 Top 10 Competitors Identified:`);
    topCompetitors.forEach((comp, i) => {
      console.log(`    ${i + 1}. ${comp.domain} - Appears ${comp.appearances}x, Avg Pos: ${comp.avg_position.toFixed(1)}`);
    });

    // Deep dive into top 5 competitors
    console.log(`\n  🔍 Performing Deep Analysis on Top 5 Competitors...`);
    
    for (const competitor of topCompetitors.slice(0, 5)) {
      console.log(`\n  Analyzing: ${competitor.domain}`);
      
      // Get domain metrics
      const domainMetrics = await this.apiCall('/domain_analytics/overview/live', [{
        target: competitor.domain,
        location_code: 2826,
        language_code: 'en',
        load_resources: ['organic', 'paid']
      }]);

      // Get competitor keywords
      const competitorKeywords = await this.apiCall('/dataforseo_labs/google/ranked_keywords/live', [{
        target: competitor.domain,
        location_code: 2826,
        language_code: 'en',
        limit: 100,
        order_by: ["keyword_data.keyword_info.search_volume,desc"]
      }]);

      // Get backlink profile
      const backlinks = await this.apiCall('/backlinks/summary/live', [{
        target: competitor.domain,
        internal_list_limit: 10,
        external_links_attributes_limit: 10
      }]);

      // Get page insights
      const pageInsights = await this.apiCall('/dataforseo_labs/google/page_metrics/live', [{
        target: competitor.domain,
        location_code: 2826,
        language_code: 'en'
      }]);

      competitor.detailed_metrics = {
        domain_metrics: domainMetrics?.[0] || {},
        top_keywords: competitorKeywords?.[0]?.items?.slice(0, 20) || [],
        backlink_profile: backlinks?.[0] || {},
        page_metrics: pageInsights?.[0] || {},
        estimated_traffic: domainMetrics?.[0]?.organic?.etv || 0,
        total_keywords: domainMetrics?.[0]?.organic?.count || 0
      };

      await this.sleep(2000);
    }

    this.results.competitor_profiles = topCompetitors;
    console.log(`\n  ✅ Competitor analysis complete`);
  }

  // 3. CONTENT GAP ANALYSIS
  async contentGapAnalysis() {
    console.log('\n📝 PHASE 3: CONTENT GAP ANALYSIS');
    console.log('=' .repeat(60));

    const topCompetitors = this.results.competitor_profiles.slice(0, 3).map(c => c.domain);
    const contentGaps = {
      missing_keywords: [],
      content_opportunities: [],
      competitor_top_pages: []
    };

    console.log(`  Comparing against: ${topCompetitors.join(', ')}`);

    for (const competitor of topCompetitors) {
      console.log(`\n  Finding gaps with: ${competitor}`);
      
      // Get keywords competitor ranks for that we don't
      const keywordGaps = await this.apiCall('/dataforseo_labs/google/competitor_keywords/live', [{
        target_1: 'fearnbellmarketing.com', // Our future domain
        target_2: competitor,
        location_code: 2826,
        language_code: 'en',
        limit: 50,
        filters: [
          ["keyword_data.keyword_info.search_volume", ">", 100],
          ["first_target_serp_element.rank_group", "=", null]
        ]
      }]);

      if (keywordGaps?.[0]?.items) {
        keywordGaps[0].items.forEach(item => {
          contentGaps.missing_keywords.push({
            keyword: item.keyword_data.keyword,
            search_volume: item.keyword_data.keyword_info?.search_volume || 0,
            difficulty: item.keyword_data.keyword_info?.competition || 0,
            competitor: competitor,
            competitor_rank: item.second_target_serp_element?.rank_group || 0
          });
        });
      }

      // Get competitor's top performing pages
      const topPages = await this.apiCall('/dataforseo_labs/google/ranked_keywords/live', [{
        target: competitor,
        location_code: 2826,
        language_code: 'en',
        limit: 10,
        filters: [["ranked_serp_element.serp_item.rank_group", "<=", 3]]
      }]);

      if (topPages?.[0]?.items) {
        contentGaps.competitor_top_pages.push({
          competitor: competitor,
          top_pages: topPages[0].items.map(item => ({
            url: item.ranked_serp_element?.serp_item?.url || '',
            keyword: item.keyword_data.keyword,
            position: item.ranked_serp_element?.serp_item?.rank_group || 0,
            search_volume: item.keyword_data.keyword_info?.search_volume || 0
          }))
        });
      }

      await this.sleep(1500);
    }

    // Identify content themes
    const keywordThemes = {};
    contentGaps.missing_keywords.forEach(kw => {
      const words = kw.keyword.split(' ');
      words.forEach(word => {
        if (word.length > 3 && !['with', 'from', 'that', 'this', 'what', 'when', 'where', 'which'].includes(word)) {
          keywordThemes[word] = (keywordThemes[word] || 0) + 1;
        }
      });
    });

    contentGaps.content_opportunities = Object.entries(keywordThemes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([theme, count]) => ({ theme, mentions: count }));

    this.results.content_gaps = contentGaps;
    console.log(`\n  ✅ Found ${contentGaps.missing_keywords.length} keyword gaps`);
    console.log(`  ✅ Identified ${contentGaps.content_opportunities.length} content themes`);
  }

  // 4. BACKLINK OPPORTUNITY ANALYSIS
  async backlinkAnalysis() {
    console.log('\n🔗 PHASE 4: BACKLINK OPPORTUNITY ANALYSIS');
    console.log('=' .repeat(60));

    const topCompetitors = this.results.competitor_profiles.slice(0, 3);
    const backlinkData = {
      competitor_profiles: [],
      link_opportunities: [],
      common_referring_domains: []
    };

    for (const competitor of topCompetitors) {
      console.log(`\n  Analyzing backlinks for: ${competitor.domain}`);
      
      // Get detailed backlink data
      const backlinks = await this.apiCall('/backlinks/anchors/live', [{
        target: competitor.domain,
        limit: 50,
        order_by: ["backlinks,desc"]
      }]);

      // Get referring domains
      const referringDomains = await this.apiCall('/backlinks/referring_domains/live', [{
        target: competitor.domain,
        limit: 50,
        order_by: ["backlinks,desc"]
      }]);

      if (referringDomains?.[0]?.items) {
        const profile = {
          domain: competitor.domain,
          total_backlinks: referringDomains[0].total_count || 0,
          referring_domains: referringDomains[0].items.map(item => ({
            domain: item.domain,
            backlinks: item.backlinks || 0,
            first_seen: item.first_seen,
            domain_rank: item.rank || 0
          })),
          anchor_texts: backlinks?.[0]?.items?.slice(0, 10) || []
        };
        
        backlinkData.competitor_profiles.push(profile);
        
        // Track common referring domains
        profile.referring_domains.forEach(rd => {
          const existing = backlinkData.common_referring_domains.find(d => d.domain === rd.domain);
          if (existing) {
            existing.count++;
            existing.competitors.push(competitor.domain);
          } else {
            backlinkData.common_referring_domains.push({
              domain: rd.domain,
              count: 1,
              competitors: [competitor.domain],
              domain_rank: rd.domain_rank
            });
          }
        });
      }

      await this.sleep(1500);
    }

    // Sort common referring domains by frequency
    backlinkData.common_referring_domains.sort((a, b) => b.count - a.count);
    backlinkData.link_opportunities = backlinkData.common_referring_domains
      .filter(d => d.count >= 2)
      .slice(0, 20);

    this.results.backlink_analysis = backlinkData;
    console.log(`\n  ✅ Analyzed ${backlinkData.competitor_profiles.length} competitor backlink profiles`);
    console.log(`  ✅ Found ${backlinkData.link_opportunities.length} link opportunities`);
  }

  // 5. TECHNICAL SEO ANALYSIS
  async technicalSEOAnalysis() {
    console.log('\n⚙️ PHASE 5: TECHNICAL SEO COMPETITOR ANALYSIS');
    console.log('=' .repeat(60));

    const techData = {
      page_speed: [],
      mobile_optimization: [],
      schema_usage: []
    };

    const topDomains = this.results.competitor_profiles.slice(0, 5).map(c => c.domain);

    for (const domain of topDomains) {
      console.log(`\n  Technical analysis for: ${domain}`);
      
      // Get on-page data
      const onPageData = await this.apiCall('/on_page/instant_pages', [{
        url: `https://${domain}`,
        load_resources: true,
        enable_javascript: true,
        check_spell: false
      }]);

      if (onPageData?.[0]) {
        techData.page_speed.push({
          domain: domain,
          load_time: onPageData[0].fetch_time || 0,
          page_size: onPageData[0].size || 0,
          requests: onPageData[0].resources?.total || 0
        });
      }

      await this.sleep(1000);
    }

    this.results.technical_seo = techData;
    console.log(`\n  ✅ Technical SEO analysis complete`);
  }

  // 6. GENERATE STRATEGIC RECOMMENDATIONS
  generateRecommendations() {
    console.log('\n💡 PHASE 6: GENERATING STRATEGIC RECOMMENDATIONS');
    console.log('=' .repeat(60));

    const recommendations = {
      immediate_actions: [],
      keyword_strategy: [],
      content_strategy: [],
      link_building: [],
      technical_improvements: []
    };

    // Keyword recommendations
    const lowCompetitionKeywords = this.results.keyword_opportunities.primary_keywords
      .filter(k => k.competition < 0.5 && k.search_volume > 100)
      .slice(0, 10);

    recommendations.keyword_strategy.push({
      title: 'Target Low-Competition Keywords First',
      keywords: lowCompetitionKeywords.map(k => k.keyword),
      rationale: 'Quick wins to build domain authority'
    });

    // Content recommendations
    const topContentThemes = this.results.content_gaps.content_opportunities.slice(0, 5);
    recommendations.content_strategy.push({
      title: 'Priority Content Themes',
      themes: topContentThemes.map(t => t.theme),
      rationale: 'Most frequently appearing topics in competitor rankings'
    });

    // Link building recommendations
    const linkTargets = this.results.backlink_analysis.link_opportunities?.slice(0, 10) || [];
    recommendations.link_building.push({
      title: 'Priority Link Targets',
      domains: linkTargets.map(t => t.domain),
      rationale: 'Domains linking to multiple competitors'
    });

    // Immediate actions based on findings
    recommendations.immediate_actions = [
      {
        action: 'Create cornerstone content for "fair pricing marketing"',
        priority: 'HIGH',
        impact: 'Differentiation from competitors'
      },
      {
        action: 'Optimize for local London searches',
        priority: 'HIGH',
        impact: 'Capture local market share'
      },
      {
        action: 'Build comparison pages vs top 3 competitors',
        priority: 'MEDIUM',
        impact: 'Capture competitor brand searches'
      },
      {
        action: 'Implement transparent pricing calculator',
        priority: 'HIGH',
        impact: 'Unique value proposition'
      },
      {
        action: 'Create case studies showcasing ROI',
        priority: 'MEDIUM',
        impact: 'Build trust and authority'
      }
    ];

    this.results.strategic_recommendations = recommendations;
    console.log(`  ✅ Generated ${recommendations.immediate_actions.length} immediate action items`);
  }

  // Utility functions
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async saveResults() {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `deep-seo-research-${timestamp}.json`;
    const summaryFilename = `seo-strategy-summary-${timestamp}.md`;

    // Save full JSON report
    await fs.writeFile(filename, JSON.stringify(this.results, null, 2));
    console.log(`\n📁 Full report saved to: ${filename}`);

    // Generate and save markdown summary
    const summary = this.generateMarkdownSummary();
    await fs.writeFile(summaryFilename, summary);
    console.log(`📄 Summary saved to: ${summaryFilename}`);

    return { filename, summaryFilename };
  }

  generateMarkdownSummary() {
    let md = `# Fearnbell Marketing - Deep SEO Research Report\n\n`;
    md += `Generated: ${this.results.timestamp}\n\n`;
    
    md += `## Executive Summary\n\n`;
    
    // Top competitors
    md += `### Top Competitors\n`;
    this.results.competitor_profiles.slice(0, 5).forEach((comp, i) => {
      md += `${i + 1}. **${comp.domain}**\n`;
      md += `   - Appearances: ${comp.appearances}\n`;
      md += `   - Avg Position: ${comp.avg_position.toFixed(1)}\n`;
      md += `   - Est. Traffic: ${comp.detailed_metrics?.estimated_traffic?.toLocaleString() || 'N/A'}\n`;
      md += `   - Total Keywords: ${comp.detailed_metrics?.total_keywords?.toLocaleString() || 'N/A'}\n\n`;
    });

    // Keyword opportunities
    md += `### Keyword Opportunities\n\n`;
    md += `- **Primary Keywords Analyzed:** ${this.results.keyword_opportunities.primary_keywords?.length || 0}\n`;
    md += `- **Long-tail Opportunities:** ${this.results.keyword_opportunities.long_tail?.length || 0}\n`;
    md += `- **Question Keywords:** ${this.results.keyword_opportunities.questions?.length || 0}\n\n`;

    md += `#### Top Keywords by Volume:\n`;
    this.results.keyword_opportunities.primary_keywords?.slice(0, 10).forEach(kw => {
      md += `- ${kw.keyword}: ${kw.search_volume?.toLocaleString()} searches/month\n`;
    });

    // Content gaps
    md += `\n### Content Gap Analysis\n\n`;
    md += `**Missing Keywords:** ${this.results.content_gaps.missing_keywords?.length || 0} opportunities found\n\n`;
    md += `**Top Content Themes to Target:**\n`;
    this.results.content_gaps.content_opportunities?.slice(0, 10).forEach(theme => {
      md += `- ${theme.theme} (${theme.mentions} mentions)\n`;
    });

    // Backlink opportunities
    md += `\n### Link Building Opportunities\n\n`;
    md += `**Common Referring Domains** (linking to multiple competitors):\n`;
    this.results.backlink_analysis.link_opportunities?.slice(0, 10).forEach(opp => {
      md += `- ${opp.domain} (links to ${opp.count} competitors)\n`;
    });

    // Strategic recommendations
    md += `\n## Strategic Recommendations\n\n`;
    md += `### Immediate Actions\n`;
    this.results.strategic_recommendations.immediate_actions?.forEach(action => {
      md += `- **[${action.priority}]** ${action.action}\n`;
      md += `  - Impact: ${action.impact}\n`;
    });

    md += `\n### Keyword Strategy\n`;
    this.results.strategic_recommendations.keyword_strategy?.forEach(strategy => {
      md += `**${strategy.title}**\n`;
      md += `- Keywords: ${strategy.keywords?.join(', ')}\n`;
      md += `- Rationale: ${strategy.rationale}\n\n`;
    });

    return md;
  }

  // Main execution
  async run() {
    console.log('\n🚀 STARTING DEEP SEO RESEARCH FOR FEARNBELL MARKETING');
    console.log('=' .repeat(60));
    console.log('This comprehensive analysis will take 5-10 minutes...\n');

    try {
      await this.keywordResearch();
      await this.competitorAnalysis();
      await this.contentGapAnalysis();
      await this.backlinkAnalysis();
      await this.technicalSEOAnalysis();
      this.generateRecommendations();

      const { filename, summaryFilename } = await this.saveResults();

      console.log('\n' + '=' .repeat(60));
      console.log('✅ DEEP SEO RESEARCH COMPLETE!');
      console.log('=' .repeat(60));

      // Print quick summary
      console.log('\n📊 QUICK STATS:');
      console.log(`- Keywords Analyzed: ${this.results.keyword_opportunities.primary_keywords?.length || 0}`);
      console.log(`- Competitors Identified: ${this.results.competitor_profiles?.length || 0}`);
      console.log(`- Content Gaps Found: ${this.results.content_gaps.missing_keywords?.length || 0}`);
      console.log(`- Link Opportunities: ${this.results.backlink_analysis.link_opportunities?.length || 0}`);
      console.log(`- Action Items: ${this.results.strategic_recommendations.immediate_actions?.length || 0}`);

      return this.results;
    } catch (error) {
      console.error('\n❌ Error during research:', error);
      throw error;
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const research = new DeepSEOResearch();
  research.run().catch(console.error);
}

module.exports = DeepSEOResearch;