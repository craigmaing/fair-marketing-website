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

// Comprehensive keyword list
const comprehensiveKeywords = [
  // Primary keywords
  "marketing agency london",
  "digital marketing agency uk",
  "seo services london",
  "website development agency uk",
  "web design agency london",
  
  // Fair pricing keywords
  "affordable marketing agency uk",
  "fair pricing marketing agency",
  "transparent marketing agency",
  "fixed price marketing services",
  "no hidden fees marketing",
  
  // Service-specific keywords
  "competitor analysis agency",
  "seo competitor research",
  "website speed optimization uk",
  "conversion rate optimization agency",
  "content marketing agency london",
  "ppc management london",
  "social media marketing uk",
  "email marketing agency",
  "brand strategy agency london",
  
  // Local variations
  "marketing agency near me",
  "best marketing agency london",
  "top digital agencies uk",
  "marketing consultants london",
  "digital transformation agency uk",
  
  // Industry-specific
  "b2b marketing agency uk",
  "saas marketing agency",
  "ecommerce marketing agency",
  "startup marketing agency london",
  "small business marketing uk",
  
  // Long-tail keywords
  "marketing agency with payment plans",
  "marketing agency transparent pricing uk",
  "website development under 5000 pounds",
  "seo services with guaranteed results",
  "fast website development london",
  "marketing agency for small businesses uk",
  "affordable seo services london",
  "website redesign agency london",
  
  // Competitor comparison keywords
  "best alternative to expensive agencies",
  "marketing agency vs freelancer",
  "how much does marketing agency cost uk",
  "average marketing agency prices london",
  
  // Problem-solving keywords
  "fix slow website speed",
  "improve google rankings uk",
  "increase website conversions",
  "reduce marketing costs",
  "beat competitors online"
];

// Top UK marketing agencies to analyze
const topCompetitors = [
  "gripped.io",
  "thesocialshepherd.com",
  "pearllemon.com",
  "found.co.uk",
  "m3agency.com",
  "thegoodmarketer.co.uk",
  "makeagency.co.uk",
  "londonmarketingcompany.co.uk",
  "sisterlondon.com",
  "loftydigitalmarketing.uk",
  "thisisbliss.com",
  "pndigital.co.uk",
  "atomicdigitalmarketing.co.uk",
  "inbeatagency.com",
  "verbbrands.com"
];

async function getDetailedKeywordData(keyword) {
  try {
    console.log(`Analyzing: ${keyword}`);
    
    const [serpResponse, keywordResponse] = await Promise.all([
      api.post("/serp/google/organic/live/advanced", [{
        keyword: keyword,
        location_code: 2826, // UK
        language_code: "en",
        device: "desktop",
        depth: 30,
        calculate_rectangles: false
      }]),
      api.post("/dataforseo_labs/google/keyword_suggestions/live", [{
        keyword: keyword,
        location_code: 2826,
        language_code: "en",
        include_seed_keyword: true,
        include_serp_info: true,
        include_clickstream_data: true,
        limit: 20
      }])
    ]);
    
    const serpData = serpResponse.data.tasks?.[0]?.result?.[0];
    const keywordData = keywordResponse.data.tasks?.[0]?.result?.[0];
    
    return {
      keyword: keyword,
      metrics: {
        search_volume: keywordData?.items?.[0]?.keyword_info?.search_volume || 0,
        competition: keywordData?.items?.[0]?.keyword_info?.competition || 0,
        competition_level: keywordData?.items?.[0]?.keyword_info?.competition_level || 'N/A',
        cpc: keywordData?.items?.[0]?.keyword_info?.cpc || 0,
        trend: keywordData?.items?.[0]?.keyword_info?.monthly_searches || []
      },
      serp_features: {
        total_results: serpData?.se_results_count || 0,
        featured_snippet: serpData?.featured_snippet ? 'Yes' : 'No',
        people_also_ask: serpData?.people_also_ask?.length || 0,
        related_searches: serpData?.related_searches?.length || 0
      },
      top_10_results: serpData?.items?.slice(0, 10).map(item => ({
        position: item.rank_group,
        domain: item.domain,
        url: item.url,
        title: item.title,
        description: item.description
      })) || [],
      related_keywords: keywordData?.items?.slice(1, 11).map(item => ({
        keyword: item.keyword,
        volume: item.keyword_info?.search_volume,
        difficulty: item.keyword_info?.competition
      })) || []
    };
  } catch (error) {
    console.error(`Error with ${keyword}: ${error.message}`);
    return null;
  }
}

async function getComprehensiveDomainAnalysis(domain) {
  try {
    console.log(`Deep analysis of: ${domain}`);
    
    const [overviewResponse, backlinksResponse, pagesResponse, competitorsResponse, keywordsResponse] = await Promise.all([
      // Domain overview
      api.post("/dataforseo_labs/google/domain_rank_overview/live", [{
        target: domain,
        location_code: 2826,
        language_code: "en"
      }]),
      // Backlinks summary
      api.post("/backlinks/summary/live", [{
        target: domain,
        internal_list_limit: 10,
        external_links_attributes_limit: 10,
        backlinks_status_type: "all",
        include_subdomains: true
      }]),
      // Top pages
      api.post("/dataforseo_labs/google/top_searches/live", [{
        target: domain,
        location_code: 2826,
        language_code: "en",
        limit: 10
      }]),
      // Competitor domains
      api.post("/dataforseo_labs/google/competitors_domain/live", [{
        target: domain,
        location_code: 2826,
        language_code: "en",
        limit: 10
      }]),
      // Ranked keywords
      api.post("/dataforseo_labs/google/ranked_keywords/live", [{
        target: domain,
        location_code: 2826,
        language_code: "en",
        limit: 50
      }])
    ]);
    
    const overview = overviewResponse.data.tasks?.[0]?.result?.[0];
    const backlinks = backlinksResponse.data.tasks?.[0]?.result?.[0];
    const pages = pagesResponse.data.tasks?.[0]?.result?.[0];
    const competitors = competitorsResponse.data.tasks?.[0]?.result?.[0];
    const keywords = keywordsResponse.data.tasks?.[0]?.result?.[0];
    
    return {
      domain: domain,
      overview: {
        organic_traffic: overview?.metrics?.organic?.etv || 0,
        organic_keywords: overview?.metrics?.organic?.count || 0,
        paid_traffic: overview?.metrics?.paid?.etv || 0,
        paid_keywords: overview?.metrics?.paid?.count || 0,
        positions_1_3: overview?.metrics?.organic?.pos_1_3 || 0,
        positions_4_10: overview?.metrics?.organic?.pos_4_10 || 0,
        positions_11_20: overview?.metrics?.organic?.pos_11_20 || 0
      },
      backlink_profile: {
        total_backlinks: backlinks?.backlinks || 0,
        referring_domains: backlinks?.referring_domains || 0,
        referring_ips: backlinks?.referring_ips || 0,
        referring_subnets: backlinks?.referring_subnets || 0,
        rank: backlinks?.rank || 0,
        trust_rank: backlinks?.external_links_attributes?.[0]?.trust || 0
      },
      top_pages: pages?.items?.slice(0, 10).map(item => ({
        keyword: item.keyword_data?.keyword,
        url: item.keyword_data?.keyword_info?.serp_info?.url,
        traffic: item.keyword_data?.keyword_info?.monthly_searches?.[0]?.search_volume || 0
      })) || [],
      main_competitors: competitors?.items?.slice(0, 10).map(item => ({
        domain: item.domain,
        avg_position: item.avg_position,
        common_keywords: item.intersections,
        se_keywords: item.se_keywords?.se_keywords_count || 0
      })) || [],
      top_keywords: keywords?.items?.slice(0, 20).map(item => ({
        keyword: item.keyword_data?.keyword,
        position: item.keyword_data?.keyword_info?.serp_info?.rank_group,
        search_volume: item.keyword_data?.keyword_info?.search_volume,
        traffic_potential: item.keyword_data?.keyword_info?.monthly_searches?.[0]?.search_volume || 0
      })) || []
    };
  } catch (error) {
    console.error(`Error analyzing ${domain}: ${error.message}`);
    return null;
  }
}

async function generateComprehensiveReport(keywordResults, domainResults) {
  const timestamp = new Date().toISOString();
  const date = timestamp.split('T')[0];
  
  let report = `================================================================================
                    FEARNBELL MARKETING - COMPREHENSIVE COMPETITOR ANALYSIS
                           Generated: ${timestamp}
================================================================================

EXECUTIVE SUMMARY
=================
Total Keywords Analyzed: ${keywordResults.filter(k => k !== null).length}
Total Competitors Analyzed: ${domainResults.filter(d => d !== null).length}
Report Date: ${date}
Market: United Kingdom (UK)

================================================================================
SECTION 1: KEYWORD OPPORTUNITY ANALYSIS
================================================================================

`;

  // Group keywords by search volume
  const highVolume = keywordResults.filter(k => k && k.metrics.search_volume > 5000);
  const mediumVolume = keywordResults.filter(k => k && k.metrics.search_volume >= 1000 && k.metrics.search_volume <= 5000);
  const lowVolume = keywordResults.filter(k => k && k.metrics.search_volume < 1000 && k.metrics.search_volume > 0);
  
  report += `HIGH VOLUME KEYWORDS (>5000 searches/month)\n`;
  report += `=============================================\n\n`;
  
  highVolume.forEach(k => {
    report += `Keyword: "${k.keyword}"\n`;
    report += `  - Search Volume: ${k.metrics.search_volume.toLocaleString()}\n`;
    report += `  - Competition: ${k.metrics.competition_level} (${k.metrics.competition})\n`;
    report += `  - CPC: £${k.metrics.cpc}\n`;
    report += `  - Total Results: ${k.serp_features.total_results?.toLocaleString()}\n`;
    report += `  - Top 3 Competitors:\n`;
    k.top_10_results.slice(0, 3).forEach(r => {
      report += `    ${r.position}. ${r.domain} - ${r.title}\n`;
    });
    report += `\n`;
  });
  
  report += `\nMEDIUM VOLUME KEYWORDS (1000-5000 searches/month)\n`;
  report += `==================================================\n\n`;
  
  mediumVolume.forEach(k => {
    report += `Keyword: "${k.keyword}"\n`;
    report += `  - Search Volume: ${k.metrics.search_volume.toLocaleString()}\n`;
    report += `  - Competition: ${k.metrics.competition_level}\n`;
    report += `  - CPC: £${k.metrics.cpc}\n`;
    report += `  - Top Competitor: ${k.top_10_results[0]?.domain || 'N/A'}\n`;
    report += `\n`;
  });
  
  report += `\nLOW COMPETITION KEYWORDS (<1000 searches/month)\n`;
  report += `================================================\n\n`;
  
  lowVolume.forEach(k => {
    report += `"${k.keyword}" - Volume: ${k.metrics.search_volume}, Competition: ${k.metrics.competition_level}, CPC: £${k.metrics.cpc}\n`;
  });
  
  report += `\n\n================================================================================
SECTION 2: COMPETITOR DOMAIN ANALYSIS
================================================================================\n\n`;
  
  // Sort competitors by organic traffic
  const sortedCompetitors = domainResults
    .filter(d => d !== null)
    .sort((a, b) => b.overview.organic_traffic - a.overview.organic_traffic);
  
  sortedCompetitors.forEach((competitor, index) => {
    report += `${index + 1}. ${competitor.domain.toUpperCase()}\n`;
    report += `${'='.repeat(50)}\n\n`;
    
    report += `TRAFFIC METRICS:\n`;
    report += `  - Organic Traffic: ${competitor.overview.organic_traffic.toLocaleString()} visits/month\n`;
    report += `  - Organic Keywords: ${competitor.overview.organic_keywords.toLocaleString()}\n`;
    report += `  - Paid Traffic: ${competitor.overview.paid_traffic.toLocaleString()} visits/month\n`;
    report += `  - Paid Keywords: ${competitor.overview.paid_keywords.toLocaleString()}\n`;
    report += `\n`;
    
    report += `RANKING DISTRIBUTION:\n`;
    report += `  - Positions 1-3: ${competitor.overview.positions_1_3} keywords\n`;
    report += `  - Positions 4-10: ${competitor.overview.positions_4_10} keywords\n`;
    report += `  - Positions 11-20: ${competitor.overview.positions_11_20} keywords\n`;
    report += `\n`;
    
    report += `BACKLINK PROFILE:\n`;
    report += `  - Total Backlinks: ${competitor.backlink_profile.total_backlinks.toLocaleString()}\n`;
    report += `  - Referring Domains: ${competitor.backlink_profile.referring_domains.toLocaleString()}\n`;
    report += `  - Domain Rank: ${competitor.backlink_profile.rank}\n`;
    report += `  - Trust Rank: ${competitor.backlink_profile.trust_rank}\n`;
    report += `\n`;
    
    report += `TOP PERFORMING KEYWORDS:\n`;
    competitor.top_keywords.slice(0, 5).forEach(kw => {
      report += `  - "${kw.keyword}" - Position: ${kw.position}, Volume: ${kw.search_volume}\n`;
    });
    report += `\n`;
    
    report += `MAIN COMPETITORS:\n`;
    competitor.main_competitors.slice(0, 3).forEach(comp => {
      report += `  - ${comp.domain} (${comp.common_keywords} common keywords)\n`;
    });
    report += `\n\n`;
  });
  
  report += `================================================================================
SECTION 3: MARKET OPPORTUNITIES & GAPS
================================================================================\n\n`;
  
  // Find keyword gaps
  const allCompetitorKeywords = new Set();
  sortedCompetitors.forEach(comp => {
    comp.top_keywords.forEach(kw => {
      allCompetitorKeywords.add(kw.keyword);
    });
  });
  
  report += `UNTAPPED KEYWORDS (Low competition, good volume):\n`;
  report += `=================================================\n`;
  
  const untapped = keywordResults.filter(k => 
    k && 
    k.metrics.search_volume > 500 && 
    k.metrics.competition < 0.5 &&
    k.top_10_results.filter(r => topCompetitors.includes(r.domain)).length < 3
  );
  
  untapped.forEach(k => {
    report += `  - "${k.keyword}" - Volume: ${k.metrics.search_volume}, Competition: ${k.metrics.competition_level}\n`;
  });
  
  report += `\n\nCONTENT GAPS TO EXPLOIT:\n`;
  report += `========================\n`;
  
  // Identify content themes
  const contentThemes = {
    'Pricing/Cost': keywordResults.filter(k => k && (k.keyword.includes('price') || k.keyword.includes('cost') || k.keyword.includes('affordable'))),
    'Local/Location': keywordResults.filter(k => k && (k.keyword.includes('london') || k.keyword.includes('uk') || k.keyword.includes('near me'))),
    'Service-Specific': keywordResults.filter(k => k && (k.keyword.includes('seo') || k.keyword.includes('ppc') || k.keyword.includes('social media'))),
    'Business Type': keywordResults.filter(k => k && (k.keyword.includes('small business') || k.keyword.includes('startup') || k.keyword.includes('b2b')))
  };
  
  Object.entries(contentThemes).forEach(([theme, keywords]) => {
    const avgVolume = keywords.reduce((sum, k) => sum + k.metrics.search_volume, 0) / keywords.length;
    report += `\n${theme}:\n`;
    report += `  - Keywords Found: ${keywords.length}\n`;
    report += `  - Average Volume: ${Math.round(avgVolume).toLocaleString()}\n`;
    report += `  - Top Opportunity: "${keywords[0]?.keyword || 'N/A'}"\n`;
  });
  
  report += `\n\n================================================================================
SECTION 4: COMPETITIVE STRATEGY RECOMMENDATIONS
================================================================================\n\n`;
  
  report += `IMMEDIATE ACTION ITEMS:\n`;
  report += `=======================\n\n`;
  
  report += `1. TARGET LOW-HANGING FRUIT KEYWORDS:\n`;
  untapped.slice(0, 10).forEach(k => {
    report += `   - Create content for: "${k.keyword}"\n`;
  });
  
  report += `\n2. OUTPERFORM WEAK COMPETITORS:\n`;
  const weakCompetitors = sortedCompetitors
    .filter(c => c.backlink_profile.referring_domains < 100)
    .slice(0, 3);
  weakCompetitors.forEach(c => {
    report += `   - Target keywords where ${c.domain} ranks but has weak authority\n`;
  });
  
  report += `\n3. CONTENT STRATEGY PRIORITIES:\n`;
  report += `   - Focus on "fair pricing" and "transparent" angle (low competition)\n`;
  report += `   - Create comparison content vs. top competitors\n`;
  report += `   - Develop local SEO content for London/UK market\n`;
  report += `   - Build service-specific landing pages\n`;
  
  report += `\n4. LINK BUILDING TARGETS:\n`;
  const avgBacklinks = sortedCompetitors.reduce((sum, c) => sum + c.backlink_profile.referring_domains, 0) / sortedCompetitors.length;
  report += `   - Industry Average: ${Math.round(avgBacklinks).toLocaleString()} referring domains\n`;
  report += `   - Minimum Target: 100 referring domains in 6 months\n`;
  report += `   - Focus on: Local directories, industry publications, client testimonials\n`;
  
  report += `\n\n================================================================================
SECTION 5: PRICING INTELLIGENCE
================================================================================\n\n`;
  
  report += `KEYWORD CPC ANALYSIS (for budget planning):\n`;
  report += `===========================================\n\n`;
  
  const avgCPC = keywordResults
    .filter(k => k && k.metrics.cpc > 0)
    .reduce((sum, k) => sum + k.metrics.cpc, 0) / keywordResults.filter(k => k && k.metrics.cpc > 0).length;
  
  report += `Average CPC across all keywords: £${avgCPC.toFixed(2)}\n`;
  report += `\nMost Expensive Keywords (PPC Competition):\n`;
  
  keywordResults
    .filter(k => k && k.metrics.cpc > 0)
    .sort((a, b) => b.metrics.cpc - a.metrics.cpc)
    .slice(0, 10)
    .forEach(k => {
      report += `  - "${k.keyword}" - CPC: £${k.metrics.cpc.toFixed(2)}\n`;
    });
  
  report += `\n\n================================================================================
SECTION 6: TECHNICAL SEO INSIGHTS
================================================================================\n\n`;
  
  report += `SITE SPEED COMPARISON:\n`;
  report += `=====================\n`;
  report += `Note: Run PageSpeed Insights for detailed analysis\n\n`;
  
  report += `Competitors to benchmark against:\n`;
  sortedCompetitors.slice(0, 5).forEach(c => {
    report += `  - ${c.domain}\n`;
  });
  
  report += `\n\n================================================================================
CONCLUSION & NEXT STEPS
================================================================================\n\n`;
  
  report += `KEY FINDINGS:\n`;
  report += `=============\n\n`;
  
  report += `1. Market is competitive but has clear gaps in:\n`;
  report += `   - Transparent pricing content\n`;
  report += `   - Fair/affordable positioning\n`;
  report += `   - Local UK focus with quality\n\n`;
  
  report += `2. Top competitors are vulnerable in:\n`;
  report += `   - Long-tail keywords\n`;
  report += `   - Specific service combinations\n`;
  report += `   - Trust/transparency messaging\n\n`;
  
  report += `3. Immediate opportunities exist for:\n`;
  report += `   - ${untapped.length} low-competition keywords\n`;
  report += `   - ${weakCompetitors.length} competitors to overtake\n`;
  report += `   - Multiple content gaps to fill\n\n`;
  
  report += `RECOMMENDED 90-DAY PLAN:\n`;
  report += `========================\n\n`;
  
  report += `Month 1: Foundation\n`;
  report += `  - Optimize for top 10 low-competition keywords\n`;
  report += `  - Create 5 comparison pages vs. competitors\n`;
  report += `  - Implement technical SEO improvements\n\n`;
  
  report += `Month 2: Content Offensive\n`;
  report += `  - Publish 20 blog posts targeting gaps\n`;
  report += `  - Create service-specific landing pages\n`;
  report += `  - Build local SEO presence\n\n`;
  
  report += `Month 3: Authority Building\n`;
  report += `  - Launch link building campaign\n`;
  report += `  - Create linkable assets (tools/guides)\n`;
  report += `  - Establish thought leadership content\n\n`;
  
  report += `================================================================================
                                   END OF REPORT
================================================================================\n`;
  
  return report;
}

async function main() {
  console.log('Starting DEEP Competitor Analysis for Fearnbell Marketing...');
  console.log('This will take several minutes due to API rate limits...\n');
  
  const keywordResults = [];
  const domainResults = [];
  
  // Analyze keywords in batches
  console.log(`\nPhase 1: Analyzing ${comprehensiveKeywords.length} keywords...`);
  console.log('================================================\n');
  
  for (let i = 0; i < comprehensiveKeywords.length; i++) {
    const keyword = comprehensiveKeywords[i];
    const result = await getDetailedKeywordData(keyword);
    keywordResults.push(result);
    
    // Progress indicator
    if ((i + 1) % 5 === 0) {
      console.log(`Progress: ${i + 1}/${comprehensiveKeywords.length} keywords analyzed`);
    }
    
    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  // Analyze competitor domains
  console.log(`\nPhase 2: Deep analysis of ${topCompetitors.length} competitor domains...`);
  console.log('=======================================================\n');
  
  for (let i = 0; i < topCompetitors.length; i++) {
    const domain = topCompetitors[i];
    const result = await getComprehensiveDomainAnalysis(domain);
    domainResults.push(result);
    
    // Progress indicator
    if ((i + 1) % 3 === 0) {
      console.log(`Progress: ${i + 1}/${topCompetitors.length} domains analyzed`);
    }
    
    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Generate comprehensive report
  console.log('\nPhase 3: Generating comprehensive report...');
  console.log('=========================================\n');
  
  const report = await generateComprehensiveReport(keywordResults, domainResults);
  
  // Save report
  const outputDir = path.join(__dirname, '../src/data');
  await fs.mkdir(outputDir, { recursive: true });
  
  const timestamp = new Date().toISOString().split('T')[0];
  const reportFilename = path.join(outputDir, `COMPETITOR-ANALYSIS-REPORT-${timestamp}.txt`);
  
  await fs.writeFile(reportFilename, report);
  
  console.log(`\n✅ COMPLETE!`);
  console.log(`============\n`);
  console.log(`📄 Full report saved to: ${reportFilename}`);
  console.log(`📊 Total keywords analyzed: ${keywordResults.filter(k => k !== null).length}`);
  console.log(`🏢 Total competitors analyzed: ${domainResults.filter(d => d !== null).length}`);
  console.log(`📈 Report size: ${(report.length / 1024).toFixed(2)} KB`);
  
  // Also save JSON data for website integration
  const jsonData = {
    timestamp: new Date().toISOString(),
    keywords: keywordResults.filter(k => k !== null),
    competitors: domainResults.filter(d => d !== null)
  };
  
  const jsonFilename = path.join(outputDir, `competitor-data-${timestamp}.json`);
  await fs.writeFile(jsonFilename, JSON.stringify(jsonData, null, 2));
  console.log(`📁 JSON data saved to: ${jsonFilename}`);
}

// Run the analysis
if (require.main === module) {
  main().catch(error => {
    console.error('Analysis failed:', error);
    process.exit(1);
  });
}

module.exports = { getDetailedKeywordData, getComprehensiveDomainAnalysis };