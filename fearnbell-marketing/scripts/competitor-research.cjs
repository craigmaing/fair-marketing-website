const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// DataForSEO credentials
const DATAFORSEO_LOGIN = "craig.fearn@lighthousementoring.co.uk";
const DATAFORSEO_PASSWORD = "9a2c6ace2bf8b626";

// Create axios instance with auth
const api = axios.create({
  baseURL: "https://api.dataforseo.com/v3",
  auth: {
    username: DATAFORSEO_LOGIN,
    password: DATAFORSEO_PASSWORD
  },
  headers: {
    "Content-Type": "application/json"
  }
});

// Keywords to research
const targetKeywords = [
  "marketing agency london",
  "digital marketing agency uk",
  "seo services london",
  "website development agency uk",
  "fair pricing marketing agency",
  "transparent marketing agency",
  "competitor analysis agency"
];

// Competitor domains to analyze
const competitorDomains = [
  "gripped.io",
  "thesocialshepherd.com",
  "pearllemon.com",
  "found.co.uk",
  "m3agency.com"
];

async function getKeywordData(keyword) {
  try {
    console.log(`\nAnalyzing keyword: ${keyword}`);
    
    // Get SERP data
    const serpResponse = await api.post("/serp/google/organic/live/advanced", [{
      keyword: keyword,
      location_code: 2826, // UK
      language_code: "en",
      device: "desktop",
      depth: 20
    }]);
    
    // Get keyword suggestions
    const suggestionsResponse = await api.post("/dataforseo_labs/google/keyword_suggestions/live", [{
      keyword: keyword,
      location_code: 2826, // UK
      language_code: "en",
      include_seed_keyword: true,
      include_serp_info: true,
      limit: 10
    }]);
    
    const serpData = serpResponse.data.tasks?.[0]?.result?.[0];
    const suggestionsData = suggestionsResponse.data.tasks?.[0]?.result?.[0];
    
    return {
      keyword: keyword,
      search_volume: suggestionsData?.items?.[0]?.keyword_info?.search_volume || 'N/A',
      competition: suggestionsData?.items?.[0]?.keyword_info?.competition || 'N/A',
      cpc: suggestionsData?.items?.[0]?.keyword_info?.cpc || 'N/A',
      top_competitors: serpData?.items?.slice(0, 5).map(item => ({
        domain: item.domain,
        url: item.url,
        title: item.title,
        description: item.description,
        position: item.rank_group
      })) || [],
      related_keywords: suggestionsData?.items?.slice(1, 6).map(item => ({
        keyword: item.keyword,
        search_volume: item.keyword_info?.search_volume,
        competition: item.keyword_info?.competition
      })) || []
    };
  } catch (error) {
    console.error(`Error analyzing keyword ${keyword}:`, error.message);
    return null;
  }
}

async function getDomainAnalysis(domain) {
  try {
    console.log(`\nAnalyzing domain: ${domain}`);
    
    // Get domain overview
    const overviewResponse = await api.post("/dataforseo_labs/google/domain_rank_overview/live", [{
      target: domain,
      location_code: 2826, // UK
      language_code: "en"
    }]);
    
    // Get competitor domains
    const competitorsResponse = await api.post("/dataforseo_labs/google/competitors_domain/live", [{
      target: domain,
      location_code: 2826, // UK
      language_code: "en",
      limit: 5
    }]);
    
    // Get top keywords
    const keywordsResponse = await api.post("/dataforseo_labs/google/ranked_keywords/live", [{
      target: domain,
      location_code: 2826, // UK
      language_code: "en",
      limit: 10
    }]);
    
    const overviewData = overviewResponse.data.tasks?.[0]?.result?.[0];
    const competitorsData = competitorsResponse.data.tasks?.[0]?.result?.[0];
    const keywordsData = keywordsResponse.data.tasks?.[0]?.result?.[0];
    
    return {
      domain: domain,
      metrics: {
        organic_traffic: overviewData?.metrics?.organic?.etv || 'N/A',
        keywords_count: overviewData?.metrics?.organic?.count || 'N/A',
        domain_rank: overviewData?.metrics?.organic?.pos_1 || 'N/A',
      },
      top_competitors: competitorsData?.items?.slice(0, 5).map(item => ({
        domain: item.domain,
        avg_position: item.avg_position,
        intersections: item.intersections
      })) || [],
      top_keywords: keywordsData?.items?.slice(0, 10).map(item => ({
        keyword: item.keyword_data?.keyword,
        position: item.keyword_data?.keyword_info?.serp_info?.rank_group,
        search_volume: item.keyword_data?.keyword_info?.search_volume,
        url: item.keyword_data?.keyword_info?.serp_info?.url
      })) || []
    };
  } catch (error) {
    console.error(`Error analyzing domain ${domain}:`, error.message);
    return null;
  }
}

async function saveResults(data) {
  const outputDir = path.join(__dirname, '../src/data');
  await fs.mkdir(outputDir, { recursive: true });
  
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = path.join(outputDir, `competitor-research-${timestamp}.json`);
  
  await fs.writeFile(filename, JSON.stringify(data, null, 2));
  console.log(`\nResults saved to: ${filename}`);
  
  // Also save a summary for the website
  const summary = {
    date: timestamp,
    total_keywords_analyzed: data.keywords.length,
    total_competitors_analyzed: data.domains.length,
    top_ranking_competitors: data.keywords.flatMap(k => 
      k?.top_competitors?.map(c => c.domain) || []
    ).filter((v, i, a) => a.indexOf(v) === i).slice(0, 10),
    average_search_volume: Math.round(
      data.keywords.reduce((sum, k) => sum + (parseInt(k?.search_volume) || 0), 0) / 
      data.keywords.filter(k => k?.search_volume).length
    ),
    key_insights: generateInsights(data)
  };
  
  const summaryFilename = path.join(outputDir, 'competitor-summary.json');
  await fs.writeFile(summaryFilename, JSON.stringify(summary, null, 2));
  console.log(`Summary saved to: ${summaryFilename}`);
}

function generateInsights(data) {
  const insights = [];
  
  // Find most competitive keywords
  const highVolumeKeywords = data.keywords
    .filter(k => k && parseInt(k.search_volume) > 1000)
    .map(k => k.keyword);
  
  if (highVolumeKeywords.length > 0) {
    insights.push(`High opportunity keywords: ${highVolumeKeywords.join(', ')}`);
  }
  
  // Find common competitors
  const allCompetitors = {};
  data.keywords.forEach(k => {
    k?.top_competitors?.forEach(c => {
      allCompetitors[c.domain] = (allCompetitors[c.domain] || 0) + 1;
    });
  });
  
  const topCompetitors = Object.entries(allCompetitors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([domain]) => domain);
  
  insights.push(`Main competitors to beat: ${topCompetitors.join(', ')}`);
  
  // Traffic analysis
  const avgTraffic = data.domains
    .filter(d => d && d.metrics.organic_traffic !== 'N/A')
    .reduce((sum, d) => sum + parseInt(d.metrics.organic_traffic), 0) / data.domains.length;
  
  insights.push(`Average competitor organic traffic: ${Math.round(avgTraffic)} visitors/month`);
  
  return insights;
}

async function main() {
  console.log('Starting Fearnbell Marketing Competitor Research...');
  console.log('=====================================\n');
  
  const results = {
    keywords: [],
    domains: [],
    timestamp: new Date().toISOString()
  };
  
  // Analyze keywords
  console.log('Phase 1: Keyword Analysis');
  console.log('-------------------------');
  for (const keyword of targetKeywords) {
    const data = await getKeywordData(keyword);
    if (data) results.keywords.push(data);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Analyze competitor domains
  console.log('\nPhase 2: Domain Analysis');
  console.log('------------------------');
  for (const domain of competitorDomains) {
    const data = await getDomainAnalysis(domain);
    if (data) results.domains.push(data);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save results
  await saveResults(results);
  
  console.log('\n=====================================');
  console.log('Research completed successfully!');
  
  // Print summary
  console.log('\n📊 Quick Summary:');
  console.log(`- Analyzed ${results.keywords.length} keywords`);
  console.log(`- Analyzed ${results.domains.length} competitor domains`);
  
  const topCompetitor = results.domains
    .filter(d => d && d.metrics.organic_traffic !== 'N/A')
    .sort((a, b) => parseInt(b.metrics.organic_traffic) - parseInt(a.metrics.organic_traffic))[0];
  
  if (topCompetitor) {
    console.log(`- Top competitor by traffic: ${topCompetitor.domain} (${topCompetitor.metrics.organic_traffic} organic traffic)`);
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

module.exports = { getKeywordData, getDomainAnalysis };