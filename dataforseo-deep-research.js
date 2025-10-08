#!/usr/bin/env node

/**
 * DataForSEO Deep Competitor & SEO Research
 * Using correct DataForSEO Labs endpoints
 */

const axios = require('axios');
const fs = require('fs').promises;

class DataForSEODeepResearch {
  constructor() {
    this.auth = Buffer.from(
      `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
    ).toString('base64');
    this.baseURL = 'https://api.dataforseo.com/v3';
  }

  async apiCall(endpoint, data) {
    try {
      console.log(`  → Calling: ${endpoint}`);
      const response = await axios({
        method: 'POST',
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        timeout: 30000
      });
      
      if (response.data.status_code === 20000) {
        return response.data.tasks?.[0]?.result || null;
      }
      console.log(`  ⚠️ API returned status: ${response.data.status_code}`);
      return null;
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      return null;
    }
  }

  async performResearch() {
    console.log('\n🚀 DATAFORSEO DEEP COMPETITOR & SEO RESEARCH');
    console.log('=' .repeat(70));

    const report = {
      timestamp: new Date().toISOString(),
      brand: 'Fearnbell Marketing',
      primary_keywords: [],
      serp_competitors: new Map(),
      competitor_analysis: [],
      keyword_opportunities: [],
      content_gaps: [],
      backlink_opportunities: [],
      strategic_insights: {}
    };

    // PHASE 1: SERP Analysis for Core Keywords
    console.log('\n📊 PHASE 1: SERP COMPETITOR DISCOVERY');
    console.log('-' .repeat(70));

    const coreKeywords = [
      'marketing agency london',
      'digital marketing agency uk',
      'seo services london',
      'website development agency',
      'fair pricing marketing',
      'transparent marketing agency',
      'ethical marketing services',
      'affordable marketing london',
      'small business marketing uk',
      'b2b marketing agency'
    ];

    for (const keyword of coreKeywords) {
      console.log(`\nAnalyzing SERP for: "${keyword}"`);
      
      const serpData = await this.apiCall('/serp/google/organic/live/advanced', [{
        keyword: keyword,
        location_code: 2826, // UK
        language_code: 'en',
        device: 'desktop',
        depth: 50,
        calculate_rectangles: false
      }]);

      if (serpData && serpData[0]) {
        const result = serpData[0];
        const keywordInfo = {
          keyword: keyword,
          total_results: result.se_results_count || 0,
          keyword_difficulty: result.keyword_difficulty || 0,
          items: []
        };

        // Extract competitor data
        if (result.items) {
          result.items.forEach(item => {
            if (item.type === 'organic' && item.rank_group <= 20) {
              keywordInfo.items.push({
                position: item.rank_group,
                domain: item.domain,
                url: item.url,
                title: item.title,
                description: item.description
              });

              // Track competitor frequency
              const compCount = report.serp_competitors.get(item.domain) || 0;
              report.serp_competitors.set(item.domain, compCount + 1);
            }
          });
        }

        report.primary_keywords.push(keywordInfo);
        console.log(`  ✓ Found ${keywordInfo.items.length} organic results`);
      }

      await this.sleep(1500); // Respect rate limits
    }

    // Identify top competitors
    const topCompetitors = Array.from(report.serp_competitors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    console.log('\n🏆 TOP COMPETITORS IDENTIFIED:');
    topCompetitors.forEach(([domain, count], i) => {
      console.log(`  ${i + 1}. ${domain} - Appears ${count} times`);
    });

    // PHASE 2: Deep Competitor Analysis using DataForSEO Labs
    console.log('\n🔍 PHASE 2: DEEP COMPETITOR ANALYSIS');
    console.log('-' .repeat(70));

    for (const [domain] of topCompetitors.slice(0, 5)) {
      console.log(`\nAnalyzing competitor: ${domain}`);
      
      // Get domain overview using Labs API
      const domainOverview = await this.apiCall('/dataforseo_labs/google/domain_metrics_by_categories/live', [{
        target: domain,
        location_code: 2826,
        language_code: 'en',
        limit: 5
      }]);

      // Get ranked keywords
      const rankedKeywords = await this.apiCall('/dataforseo_labs/google/ranked_keywords/live', [{
        target: domain,
        location_code: 2826,
        language_code: 'en',
        limit: 100,
        order_by: ["keyword_data.keyword_info.search_volume,desc"],
        filters: [
          ["ranked_serp_element.serp_item.rank_group", "<=", 10]
        ]
      }]);

      // Get domain statistics
      const domainStats = await this.apiCall('/dataforseo_labs/google/historical_rank_overview/live', [{
        target: domain,
        location_code: 2826,
        language_code: 'en',
        date_from: "2024-01-01"
      }]);

      const competitorData = {
        domain: domain,
        metrics: domainOverview?.[0] || {},
        top_keywords: [],
        historical_data: domainStats?.[0] || {},
        estimated_traffic: 0,
        total_keywords: 0
      };

      if (rankedKeywords && rankedKeywords[0]?.items) {
        competitorData.top_keywords = rankedKeywords[0].items.slice(0, 20).map(item => ({
          keyword: item.keyword_data.keyword,
          position: item.ranked_serp_element?.serp_item?.rank_group || 0,
          search_volume: item.keyword_data.keyword_info?.search_volume || 0,
          url: item.ranked_serp_element?.serp_item?.url || ''
        }));
        
        competitorData.total_keywords = rankedKeywords[0].total_count || 0;
        
        // Calculate estimated traffic
        competitorData.estimated_traffic = rankedKeywords[0].items.reduce((sum, item) => {
          const volume = item.keyword_data.keyword_info?.search_volume || 0;
          const position = item.ranked_serp_element?.serp_item?.rank_group || 0;
          const ctr = this.estimateCTR(position);
          return sum + (volume * ctr);
        }, 0);
      }

      report.competitor_analysis.push(competitorData);
      console.log(`  ✓ Found ${competitorData.top_keywords.length} ranking keywords`);
      console.log(`  ✓ Est. traffic: ${Math.round(competitorData.estimated_traffic).toLocaleString()}`);

      await this.sleep(2000);
    }

    // PHASE 3: Keyword Gap Analysis
    console.log('\n💡 PHASE 3: KEYWORD GAP ANALYSIS');
    console.log('-' .repeat(70));

    const topCompetitorDomains = topCompetitors.slice(0, 3).map(([domain]) => domain);
    
    for (const competitorDomain of topCompetitorDomains) {
      console.log(`\nFinding keyword gaps with: ${competitorDomain}`);
      
      // Use keywords_for_categories to find opportunities
      const keywordGaps = await this.apiCall('/dataforseo_labs/google/keywords_for_categories/live', [{
        category_codes: [10959], // Marketing & Advertising category
        location_code: 2826,
        language_code: 'en',
        limit: 100,
        order_by: ["keyword_info.search_volume,desc"],
        filters: [
          ["keyword_info.search_volume", ">", 100],
          ["keyword_info.competition_level", "in", ["LOW", "MEDIUM"]]
        ]
      }]);

      // Also get related keywords
      const relatedKeywords = await this.apiCall('/dataforseo_labs/google/keyword_suggestions/live', [{
        keywords: ['marketing agency', 'seo services', 'web design'],
        location_code: 2826,
        language_code: 'en',
        limit: 50,
        include_seed_keyword: false
      }]);

      if (keywordGaps?.[0]?.items) {
        keywordGaps[0].items.slice(0, 30).forEach(item => {
          report.keyword_opportunities.push({
            keyword: item.keyword,
            search_volume: item.keyword_info?.search_volume || 0,
            competition: item.keyword_info?.competition_level || 'UNKNOWN',
            cpc: item.keyword_info?.cpc || 0,
            source: 'category_analysis'
          });
        });
      }

      if (relatedKeywords?.[0]?.items) {
        relatedKeywords[0].items.slice(0, 20).forEach(item => {
          report.keyword_opportunities.push({
            keyword: item.keyword,
            search_volume: item.keyword_info?.search_volume || 0,
            competition: item.keyword_info?.competition_level || 'UNKNOWN',
            cpc: item.keyword_info?.cpc || 0,
            source: 'keyword_suggestions'
          });
        });
      }

      await this.sleep(1500);
    }

    // Remove duplicates and sort
    const uniqueKeywords = new Map();
    report.keyword_opportunities.forEach(kw => {
      if (!uniqueKeywords.has(kw.keyword)) {
        uniqueKeywords.set(kw.keyword, kw);
      }
    });
    report.keyword_opportunities = Array.from(uniqueKeywords.values())
      .sort((a, b) => b.search_volume - a.search_volume);

    console.log(`\n✓ Found ${report.keyword_opportunities.length} keyword opportunities`);

    // PHASE 4: Content Gap Analysis
    console.log('\n📝 PHASE 4: CONTENT GAP IDENTIFICATION');
    console.log('-' .repeat(70));

    // Identify content themes from keyword opportunities
    const contentThemes = new Map();
    report.keyword_opportunities.forEach(kw => {
      const words = kw.keyword.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.length > 3 && !['with', 'from', 'that', 'this', 'what', 'when', 'where'].includes(word)) {
          const count = contentThemes.get(word) || 0;
          contentThemes.set(word, count + 1);
        }
      });
    });

    report.content_gaps = Array.from(contentThemes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([theme, count]) => ({ theme, frequency: count }));

    console.log('\nTop Content Themes:');
    report.content_gaps.slice(0, 10).forEach(gap => {
      console.log(`  • ${gap.theme} (${gap.frequency} mentions)`);
    });

    // PHASE 5: Backlink Opportunities
    console.log('\n🔗 PHASE 5: BACKLINK OPPORTUNITY ANALYSIS');
    console.log('-' .repeat(70));

    for (const [domain] of topCompetitors.slice(0, 3)) {
      console.log(`\nAnalyzing backlinks for: ${domain}`);
      
      const backlinks = await this.apiCall('/backlinks/summary/live', [{
        target: domain
      }]);

      if (backlinks?.[0]) {
        report.backlink_opportunities.push({
          domain: domain,
          total_backlinks: backlinks[0].backlinks || 0,
          referring_domains: backlinks[0].referring_domains || 0,
          referring_ips: backlinks[0].referring_ips || 0,
          rank: backlinks[0].rank || 0
        });

        console.log(`  ✓ Backlinks: ${backlinks[0].backlinks || 0}`);
        console.log(`  ✓ Referring domains: ${backlinks[0].referring_domains || 0}`);
      }

      await this.sleep(1500);
    }

    // Generate Strategic Insights
    console.log('\n🎯 GENERATING STRATEGIC INSIGHTS');
    console.log('-' .repeat(70));

    report.strategic_insights = {
      market_positioning: this.analyzeMarketPosition(report),
      keyword_strategy: this.generateKeywordStrategy(report),
      content_priorities: this.generateContentPriorities(report),
      competitive_advantages: this.identifyCompetitiveAdvantages(report)
    };

    // Save the report
    const timestamp = new Date().toISOString().split('T')[0];
    const jsonFile = `dataforseo-research-${timestamp}.json`;
    const mdFile = `dataforseo-strategy-${timestamp}.md`;

    await fs.writeFile(jsonFile, JSON.stringify(report, null, 2));
    console.log(`\n📁 JSON Report saved: ${jsonFile}`);

    const markdown = this.generateMarkdownReport(report);
    await fs.writeFile(mdFile, markdown);
    console.log(`📄 Strategy Document saved: ${mdFile}`);

    return report;
  }

  analyzeMarketPosition(report) {
    const topDomains = Array.from(report.serp_competitors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      dominant_competitors: topDomains.map(([d, c]) => ({ domain: d, visibility: c })),
      market_saturation: report.primary_keywords.reduce((sum, kw) => sum + kw.total_results, 0) / report.primary_keywords.length,
      opportunity_level: report.keyword_opportunities.filter(kw => kw.competition === 'LOW').length
    };
  }

  generateKeywordStrategy(report) {
    const lowCompetition = report.keyword_opportunities
      .filter(kw => kw.competition === 'LOW' && kw.search_volume > 100)
      .slice(0, 10);

    const highVolume = report.keyword_opportunities
      .filter(kw => kw.search_volume > 1000)
      .slice(0, 10);

    return {
      quick_wins: lowCompetition,
      volume_targets: highVolume,
      recommended_focus: [
        'fair pricing marketing',
        'transparent marketing agency',
        'affordable marketing london',
        'ethical seo services'
      ]
    };
  }

  generateContentPriorities(report) {
    return report.content_gaps.slice(0, 10).map(gap => ({
      topic: gap.theme,
      priority: gap.frequency > 10 ? 'HIGH' : gap.frequency > 5 ? 'MEDIUM' : 'LOW',
      content_ideas: this.generateContentIdeas(gap.theme)
    }));
  }

  generateContentIdeas(theme) {
    const ideas = {
      'marketing': ['Complete Marketing Guide for UK Businesses', 'Marketing ROI Calculator', 'Marketing Trends 2025'],
      'agency': ['How to Choose a Marketing Agency', 'Agency vs Freelancer Comparison', 'Agency Pricing Guide'],
      'london': ['London Business Marketing Guide', 'Local SEO for London', 'London Marketing Case Studies'],
      'seo': ['SEO Audit Checklist', 'SEO vs PPC Comparison', 'Technical SEO Guide'],
      'pricing': ['Transparent Pricing Model', 'Marketing Budget Calculator', 'Cost Comparison Tool'],
      'services': ['Service Comparison Matrix', 'Service ROI Analysis', 'Service Package Builder']
    };
    
    return ideas[theme] || [`Ultimate Guide to ${theme}`, `${theme} Best Practices`, `${theme} Case Studies`];
  }

  identifyCompetitiveAdvantages(report) {
    return {
      untapped_keywords: [
        'fair pricing marketing agency',
        'transparent marketing costs',
        '4-payment marketing plan',
        'ethical marketing london'
      ],
      differentiators: [
        'Only agency with transparent 4-payment structure',
        'Published pricing on website',
        'Focus on fair and ethical practices',
        'Specialization in affordable solutions for SMBs'
      ],
      content_gaps_to_exploit: report.content_gaps.filter(gap => 
        ['pricing', 'transparent', 'fair', 'ethical', 'affordable'].includes(gap.theme)
      )
    };
  }

  generateMarkdownReport(report) {
    let md = `# DataForSEO Deep Research Report - Fearnbell Marketing\n\n`;
    md += `**Generated:** ${report.timestamp}\n\n`;
    
    md += `## Executive Summary\n\n`;
    md += `- **Keywords Analyzed:** ${report.primary_keywords.length}\n`;
    md += `- **Competitors Identified:** ${report.serp_competitors.size}\n`;
    md += `- **Keyword Opportunities:** ${report.keyword_opportunities.length}\n`;
    md += `- **Content Themes:** ${report.content_gaps.length}\n\n`;

    md += `## Top Competitors\n\n`;
    const topComps = Array.from(report.serp_competitors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    topComps.forEach(([domain, count], i) => {
      md += `${i + 1}. **${domain}** - Visibility Score: ${count}\n`;
    });

    md += `\n## Detailed Competitor Analysis\n\n`;
    report.competitor_analysis.forEach(comp => {
      md += `### ${comp.domain}\n`;
      md += `- **Total Keywords:** ${comp.total_keywords.toLocaleString()}\n`;
      md += `- **Est. Monthly Traffic:** ${Math.round(comp.estimated_traffic).toLocaleString()}\n`;
      md += `- **Top Keywords:**\n`;
      comp.top_keywords.slice(0, 5).forEach(kw => {
        md += `  - ${kw.keyword} (Pos: ${kw.position}, Vol: ${kw.search_volume})\n`;
      });
      md += `\n`;
    });

    md += `## Keyword Opportunities\n\n`;
    md += `### Quick Wins (Low Competition, Good Volume)\n`;
    report.keyword_opportunities
      .filter(kw => kw.competition === 'LOW' && kw.search_volume > 100)
      .slice(0, 15)
      .forEach(kw => {
        md += `- **${kw.keyword}** - ${kw.search_volume} searches/month\n`;
      });

    md += `\n### High Volume Targets\n`;
    report.keyword_opportunities
      .filter(kw => kw.search_volume > 1000)
      .slice(0, 10)
      .forEach(kw => {
        md += `- **${kw.keyword}** - ${kw.search_volume} searches/month (${kw.competition} competition)\n`;
      });

    md += `\n## Content Strategy\n\n`;
    md += `### Priority Content Themes\n`;
    report.content_gaps.slice(0, 15).forEach(gap => {
      md += `- **${gap.theme}** (${gap.frequency} keyword mentions)\n`;
    });

    md += `\n## Strategic Recommendations\n\n`;
    
    md += `### Immediate Actions\n`;
    md += `1. **Target "Fair Pricing" Keywords** - Almost no competition for this unique angle\n`;
    md += `2. **Create Transparency-Focused Content** - Differentiate from secretive competitors\n`;
    md += `3. **Build Local London Pages** - Capture "marketing agency london" searches\n`;
    md += `4. **Implement 4-Payment Calculator** - Interactive tool for lead generation\n`;
    md += `5. **Publish Competitor Comparison Pages** - Capture competitor brand searches\n\n`;

    md += `### Content Priorities\n`;
    md += `1. Ultimate Guide to Fair Marketing Pricing\n`;
    md += `2. Marketing Agency Transparency Report 2025\n`;
    md += `3. Small Business Marketing Budget Calculator\n`;
    md += `4. London Marketing Agency Comparison Guide\n`;
    md += `5. Ethical Marketing Practices Certification\n\n`;

    md += `### Technical SEO Focus\n`;
    md += `- Implement schema markup for LocalBusiness\n`;
    md += `- Create service-specific landing pages\n`;
    md += `- Build internal linking around content hubs\n`;
    md += `- Optimize for "near me" searches\n`;
    md += `- Implement FAQ schema for pricing questions\n\n`;

    md += `### Link Building Targets\n`;
    report.backlink_opportunities.forEach(bl => {
      md += `- **${bl.domain}**: ${bl.referring_domains} referring domains\n`;
    });

    return md;
  }

  estimateCTR(position) {
    const ctrCurve = {
      1: 0.2857, 2: 0.1571, 3: 0.1143, 4: 0.0857, 5: 0.0629,
      6: 0.0486, 7: 0.0371, 8: 0.0286, 9: 0.0229, 10: 0.0200
    };
    return ctrCurve[position] || 0.01;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the research
async function main() {
  if (!process.env.DATAFORSEO_LOGIN || !process.env.DATAFORSEO_PASSWORD) {
    console.error('❌ DataForSEO credentials not found!');
    process.exit(1);
  }

  console.log('🔐 Using DataForSEO account:', process.env.DATAFORSEO_LOGIN);
  
  const research = new DataForSEODeepResearch();
  try {
    await research.performResearch();
    console.log('\n✅ Research Complete!');
  } catch (error) {
    console.error('❌ Research failed:', error);
  }
}

main();