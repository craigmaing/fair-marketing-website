#!/usr/bin/env node

/**
 * DataForSEO Competitor Research Script for Fearnbell Marketing
 * This script performs comprehensive competitor analysis using DataForSEO API
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
  login: process.env.DATAFORSEO_LOGIN,
  password: process.env.DATAFORSEO_PASSWORD,
  baseURL: 'https://api.dataforseo.com/v3'
};

// Target keywords for Fearnbell Marketing
const TARGET_KEYWORDS = [
  'marketing agency london',
  'fair pricing marketing',
  'transparent marketing agency',
  'website development seo',
  'ethical marketing services',
  'affordable marketing agency',
  'seo services uk',
  'digital marketing transparency'
];

// DataForSEO API Client
class DataForSEOResearch {
  constructor(login, password) {
    this.auth = Buffer.from(`${login}:${password}`).toString('base64');
  }

  async apiRequest(endpoint, data) {
    try {
      const response = await axios({
        method: 'POST',
        url: `${config.baseURL}${endpoint}`,
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
      });
      return response.data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error.message);
      return null;
    }
  }

  // Get SERP competitors for a keyword
  async getSERPCompetitors(keyword) {
    console.log(`\n📊 Analyzing SERP for: "${keyword}"`);
    
    const result = await this.apiRequest('/serp/google/organic/live/advanced', [{
      keyword: keyword,
      location_code: 2826, // UK
      language_code: 'en',
      device: 'desktop',
      depth: 20 // Get top 20 results
    }]);

    if (!result?.tasks?.[0]?.result?.[0]?.items) {
      return { keyword, competitors: [] };
    }

    const items = result.tasks[0].result[0].items;
    const competitors = items.map(item => ({
      position: item.rank_group,
      domain: item.domain,
      url: item.url,
      title: item.title,
      description: item.description,
      breadcrumb: item.breadcrumb,
      is_featured: item.type === 'featured_snippet',
      has_sitelinks: item.sitelinks ? true : false
    }));

    return {
      keyword,
      search_volume: result.tasks[0].result[0].keyword_info?.search_volume || 0,
      competition: result.tasks[0].result[0].keyword_info?.competition || 0,
      total_results: result.tasks[0].result[0].se_results_count,
      competitors: competitors.slice(0, 10) // Top 10 competitors
    };
  }

  // Analyze competitor domain
  async analyzeCompetitorDomain(domain) {
    console.log(`\n🔍 Analyzing domain: ${domain}`);
    
    // Get domain overview
    const overview = await this.apiRequest('/domain_analytics/overview/live', [{
      target: domain,
      location_code: 2826, // UK
      language_code: 'en'
    }]);

    // Get top keywords for domain
    const keywords = await this.apiRequest('/dataforseo_labs/google/ranked_keywords/live', [{
      target: domain,
      location_code: 2826,
      language_code: 'en',
      limit: 50
    }]);

    // Get backlinks summary
    const backlinks = await this.apiRequest('/backlinks/summary/live', [{
      target: domain
    }]);

    return {
      domain,
      metrics: {
        organic_traffic: overview?.tasks?.[0]?.result?.[0]?.organic?.traffic || 0,
        organic_keywords: overview?.tasks?.[0]?.result?.[0]?.organic?.keywords || 0,
        domain_rank: overview?.tasks?.[0]?.result?.[0]?.domain_rank || 0,
        backlinks: backlinks?.tasks?.[0]?.result?.[0]?.backlinks || 0,
        referring_domains: backlinks?.tasks?.[0]?.result?.[0]?.referring_domains || 0
      },
      top_keywords: keywords?.tasks?.[0]?.result?.[0]?.items?.slice(0, 10) || []
    };
  }

  // Find keyword opportunities (keywords competitors rank for but we don't)
  async findKeywordOpportunities(competitorDomains) {
    console.log(`\n💡 Finding keyword opportunities from ${competitorDomains.length} competitors`);
    
    const opportunities = [];
    
    for (const domain of competitorDomains) {
      const result = await this.apiRequest('/dataforseo_labs/google/competitor_keywords/live', [{
        target_1: 'fearnbellmarketing.com', // Our domain (when launched)
        target_2: domain,
        location_code: 2826,
        language_code: 'en',
        limit: 30,
        filters: [
          ["keyword_data.keyword_info.search_volume", ">", 100]
        ]
      }]);

      if (result?.tasks?.[0]?.result?.[0]?.items) {
        opportunities.push({
          competitor: domain,
          keywords: result.tasks[0].result[0].items.map(item => ({
            keyword: item.keyword_data.keyword,
            search_volume: item.keyword_data.keyword_info.search_volume,
            difficulty: item.keyword_data.keyword_info.competition,
            competitor_position: item.second_target_serp_element?.rank_group || 999
          }))
        });
      }
    }

    return opportunities;
  }

  // Get content ideas based on competitor analysis
  async getContentIdeas(keywords) {
    console.log(`\n📝 Generating content ideas for ${keywords.length} keywords`);
    
    const ideas = [];
    
    for (const keyword of keywords.slice(0, 5)) { // Limit to 5 for cost efficiency
      const result = await this.apiRequest('/dataforseo_labs/google/related_keywords/live', [{
        keyword: keyword,
        location_code: 2826,
        language_code: 'en',
        limit: 20
      }]);

      if (result?.tasks?.[0]?.result?.[0]?.items) {
        const relatedKeywords = result.tasks[0].result[0].items;
        ideas.push({
          main_keyword: keyword,
          content_clusters: relatedKeywords.map(item => ({
            keyword: item.keyword_data.keyword,
            search_volume: item.keyword_data.keyword_info.search_volume,
            trend: item.keyword_data.keyword_info.trend
          }))
        });
      }
    }

    return ideas;
  }

  // Generate comprehensive competitor report
  async generateCompetitorReport() {
    console.log('\n🚀 Starting Comprehensive Competitor Research for Fearnbell Marketing\n');
    console.log('=' .repeat(60));

    const report = {
      generated_date: new Date().toISOString(),
      brand: 'Fearnbell Marketing',
      target_keywords: TARGET_KEYWORDS,
      serp_analysis: [],
      top_competitors: new Map(),
      domain_analysis: [],
      keyword_opportunities: [],
      content_ideas: []
    };

    // Step 1: Analyze SERP for each target keyword
    for (const keyword of TARGET_KEYWORDS) {
      const serpData = await this.getSERPCompetitors(keyword);
      report.serp_analysis.push(serpData);

      // Track competitor frequency
      serpData.competitors.forEach(comp => {
        const count = report.top_competitors.get(comp.domain) || 0;
        report.top_competitors.set(comp.domain, count + 1);
      });

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Get top 5 most frequent competitors
    const topCompetitorDomains = Array.from(report.top_competitors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain]) => domain);

    console.log('\n📊 Top Competitors Identified:', topCompetitorDomains);

    // Step 2: Deep dive into top competitors
    for (const domain of topCompetitorDomains) {
      const analysis = await this.analyzeCompetitorDomain(domain);
      report.domain_analysis.push(analysis);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Step 3: Find keyword opportunities
    report.keyword_opportunities = await this.findKeywordOpportunities(topCompetitorDomains);

    // Step 4: Generate content ideas
    report.content_ideas = await this.getContentIdeas(TARGET_KEYWORDS);

    return report;
  }

  // Save report to file
  async saveReport(report) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `fearnbell-competitor-report-${timestamp}.json`;
    const filepath = path.join(process.cwd(), 'data', filename);

    // Ensure data directory exists
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });

    // Convert Map to array for JSON serialization
    const reportToSave = {
      ...report,
      top_competitors: Array.from(report.top_competitors.entries())
    };

    await fs.writeFile(filepath, JSON.stringify(reportToSave, null, 2));
    console.log(`\n✅ Report saved to: ${filepath}`);

    // Also create a summary markdown file
    await this.createMarkdownSummary(report, timestamp);
  }

  // Create readable markdown summary
  async createMarkdownSummary(report, timestamp) {
    const summaryPath = path.join(process.cwd(), 'data', `competitor-summary-${timestamp}.md`);
    
    let markdown = `# Fearnbell Marketing Competitor Analysis Report\n\n`;
    markdown += `Generated: ${report.generated_date}\n\n`;
    
    markdown += `## Executive Summary\n\n`;
    markdown += `- Analyzed ${report.target_keywords.length} target keywords\n`;
    markdown += `- Identified ${report.top_competitors.size} unique competitors\n`;
    markdown += `- Found ${report.keyword_opportunities.reduce((acc, opp) => acc + opp.keywords.length, 0)} keyword opportunities\n\n`;

    markdown += `## Top Competitors\n\n`;
    const topCompetitors = Array.from(report.top_competitors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    topCompetitors.forEach(([domain, count]) => {
      markdown += `- **${domain}**: Appears ${count} times in top results\n`;
    });

    markdown += `\n## Domain Analysis\n\n`;
    report.domain_analysis.forEach(domain => {
      markdown += `### ${domain.domain}\n`;
      markdown += `- Organic Traffic: ${domain.metrics.organic_traffic.toLocaleString()}\n`;
      markdown += `- Organic Keywords: ${domain.metrics.organic_keywords.toLocaleString()}\n`;
      markdown += `- Backlinks: ${domain.metrics.backlinks.toLocaleString()}\n`;
      markdown += `- Referring Domains: ${domain.metrics.referring_domains.toLocaleString()}\n\n`;
    });

    markdown += `## Keyword Opportunities\n\n`;
    report.keyword_opportunities.forEach(opp => {
      markdown += `### Opportunities from ${opp.competitor}\n`;
      opp.keywords.slice(0, 5).forEach(kw => {
        markdown += `- **${kw.keyword}**: ${kw.search_volume} searches/month\n`;
      });
      markdown += `\n`;
    });

    markdown += `## Content Strategy Recommendations\n\n`;
    report.content_ideas.forEach(idea => {
      markdown += `### Topic Cluster: ${idea.main_keyword}\n`;
      idea.content_clusters.slice(0, 5).forEach(cluster => {
        markdown += `- ${cluster.keyword} (${cluster.search_volume} searches)\n`;
      });
      markdown += `\n`;
    });

    await fs.writeFile(summaryPath, markdown);
    console.log(`📄 Summary saved to: ${summaryPath}`);
  }
}

// Main execution
async function main() {
  // Check credentials
  if (!config.login || !config.password) {
    console.error('\n❌ Error: DataForSEO credentials not found!');
    console.error('Please set environment variables:');
    console.error('  set DATAFORSEO_LOGIN=your_email@example.com');
    console.error('  set DATAFORSEO_PASSWORD=your_password\n');
    process.exit(1);
  }

  console.log('\n🚀 Fearnbell Marketing - Competitor Research Tool');
  console.log('=' .repeat(60));
  console.log('Using DataForSEO API for comprehensive competitor analysis');
  console.log('=' .repeat(60));

  const researcher = new DataForSEOResearch(config.login, config.password);
  
  try {
    const report = await researcher.generateCompetitorReport();
    await researcher.saveReport(report);

    console.log('\n' + '=' .repeat(60));
    console.log('✅ Competitor research completed successfully!');
    console.log('=' .repeat(60));
    
    // Print summary stats
    console.log('\n📈 Quick Stats:');
    console.log(`- Top Competitor: ${Array.from(report.top_competitors.entries())[0]?.[0] || 'N/A'}`);
    console.log(`- Total Competitors Found: ${report.top_competitors.size}`);
    console.log(`- Keyword Opportunities: ${report.keyword_opportunities.reduce((acc, opp) => acc + opp.keywords.length, 0)}`);

  } catch (error) {
    console.error('\n❌ Error during competitor research:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { DataForSEOResearch, TARGET_KEYWORDS };