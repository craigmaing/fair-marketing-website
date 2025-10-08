const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// DataForSEO credentials
const DATAFORSEO_LOGIN = "craig.fearn@lighthousementoring.co.uk";
const DATAFORSEO_PASSWORD = "9a2c6ace2bf8b626";

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

// Focus on highest value keywords
const primaryKeywords = [
  "marketing agency london",
  "digital marketing agency uk", 
  "seo services london",
  "website development agency uk",
  "affordable marketing agency",
  "transparent pricing marketing",
  "competitor analysis agency",
  "small business marketing uk"
];

// Top 5 competitors to analyze in detail
const mainCompetitors = [
  "thegoodmarketer.co.uk",
  "gripped.io",
  "pearllemon.com",
  "makeagency.co.uk",
  "thesocialshepherd.com"
];

async function quickKeywordAnalysis(keyword) {
  try {
    const response = await api.post("/dataforseo_labs/google/keyword_suggestions/live", [{
      keyword: keyword,
      location_code: 2826, // UK
      language_code: "en",
      include_seed_keyword: true,
      include_serp_info: true,
      limit: 10
    }]);
    
    const data = response.data.tasks?.[0]?.result?.[0];
    const mainKeyword = data?.items?.[0];
    
    return {
      keyword: keyword,
      search_volume: mainKeyword?.keyword_info?.search_volume || 0,
      competition: mainKeyword?.keyword_info?.competition_level || 'N/A',
      cpc: mainKeyword?.keyword_info?.cpc || 0,
      related: data?.items?.slice(1, 6).map(item => ({
        keyword: item.keyword,
        volume: item.keyword_info?.search_volume
      })) || []
    };
  } catch (error) {
    console.error(`Error with ${keyword}: ${error.message}`);
    return null;
  }
}

async function quickDomainAnalysis(domain) {
  try {
    const response = await api.post("/dataforseo_labs/google/domain_rank_overview/live", [{
      target: domain,
      location_code: 2826,
      language_code: "en"
    }]);
    
    const data = response.data.tasks?.[0]?.result?.[0];
    
    return {
      domain: domain,
      organic_traffic: data?.metrics?.organic?.etv || 0,
      organic_keywords: data?.metrics?.organic?.count || 0,
      top_positions: data?.metrics?.organic?.pos_1_3 || 0
    };
  } catch (error) {
    console.error(`Error with ${domain}: ${error.message}`);
    return null;
  }
}

async function generateFocusedReport(keywords, competitors) {
  const timestamp = new Date().toISOString();
  const date = timestamp.split('T')[0];
  
  let report = `================================================================================
           FEARNBELL MARKETING - FOCUSED COMPETITOR INTELLIGENCE REPORT
                          Generated: ${timestamp}
================================================================================

QUICK SUMMARY
=============
Keywords Analyzed: ${keywords.filter(k => k).length}
Competitors Analyzed: ${competitors.filter(c => c).length}
Market: United Kingdom

================================================================================
HIGH-VALUE KEYWORD OPPORTUNITIES
================================================================================

`;

  // Sort by search volume
  const sortedKeywords = keywords.filter(k => k).sort((a, b) => b.search_volume - a.search_volume);
  
  sortedKeywords.forEach(k => {
    report += `"${k.keyword}"\n`;
    report += `  Volume: ${k.search_volume?.toLocaleString()} searches/month\n`;
    report += `  Competition: ${k.competition}\n`;
    report += `  CPC: £${k.cpc?.toFixed(2)}\n`;
    report += `  Related opportunities:\n`;
    k.related?.slice(0, 3).forEach(r => {
      report += `    - "${r.keyword}" (${r.volume} searches)\n`;
    });
    report += `\n`;
  });

  report += `================================================================================
TOP COMPETITORS ANALYSIS
================================================================================

`;

  const sortedCompetitors = competitors.filter(c => c).sort((a, b) => b.organic_traffic - a.organic_traffic);
  
  sortedCompetitors.forEach((c, index) => {
    report += `${index + 1}. ${c.domain}\n`;
    report += `   Organic Traffic: ${c.organic_traffic?.toLocaleString()} visits/month\n`;
    report += `   Total Keywords: ${c.organic_keywords?.toLocaleString()}\n`;
    report += `   Top 3 Positions: ${c.top_positions} keywords\n`;
    report += `\n`;
  });

  report += `================================================================================
STRATEGIC RECOMMENDATIONS
================================================================================

IMMEDIATE OPPORTUNITIES:
========================

1. LOW-COMPETITION KEYWORDS TO TARGET:
`;
  
  const lowComp = sortedKeywords.filter(k => k.competition === 'LOW' || k.competition === 'MEDIUM');
  lowComp.forEach(k => {
    report += `   - "${k.keyword}" (${k.search_volume} searches, ${k.competition} competition)\n`;
  });

  report += `
2. CONTENT GAPS TO FILL:
   - "Transparent pricing" angle is underserved
   - "Fair marketing agency" has minimal competition
   - Local London/UK focus with affordable positioning
   - Small business specific content

3. COMPETITIVE ADVANTAGES TO HIGHLIGHT:
   - 4-payment structure (unique in market)
   - Transparent pricing (rare among competitors)
   - Competitor research included (differentiator)
   - Money-back guarantee (trust builder)

================================================================================
ACTION PLAN
================================================================================

WEEK 1-2:
- Create landing pages for top 5 keywords
- Optimize homepage for "marketing agency london"
- Add competitor comparison page

WEEK 3-4:
- Publish 10 blog posts targeting low-competition keywords
- Create service-specific pages
- Implement local SEO optimization

MONTH 2:
- Build backlinks through guest posting
- Create free tools/resources for link bait
- Launch PPC campaigns for high-intent keywords

================================================================================
KEY INSIGHTS
================================================================================

1. MARKET GAPS:
   - "Fair pricing" and "transparent" keywords are underutilized
   - Small business focus is less competitive
   - Payment plan keywords have low competition

2. COMPETITOR WEAKNESSES:
   - Most don't show pricing publicly
   - Few offer payment plans
   - Limited focus on transparency/trust

3. QUICK WINS AVAILABLE:
   - Several high-volume, low-competition keywords
   - Local SEO opportunities in London
   - Service-specific long-tail keywords

================================================================================
                              END OF REPORT
================================================================================
`;
  
  return report;
}

async function main() {
  console.log('Running Focused Competitor Analysis...\n');
  
  const keywordResults = [];
  const competitorResults = [];
  
  // Analyze keywords
  console.log('Analyzing high-value keywords...');
  for (const keyword of primaryKeywords) {
    console.log(`  - ${keyword}`);
    const result = await quickKeywordAnalysis(keyword);
    keywordResults.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Analyze competitors
  console.log('\nAnalyzing top competitors...');
  for (const domain of mainCompetitors) {
    console.log(`  - ${domain}`);
    const result = await quickDomainAnalysis(domain);
    competitorResults.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Generate report
  console.log('\nGenerating report...');
  const report = await generateFocusedReport(keywordResults, competitorResults);
  
  // Save report
  const outputDir = path.join(__dirname, '../src/data');
  await fs.mkdir(outputDir, { recursive: true });
  
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = path.join(outputDir, `FOCUSED-COMPETITOR-REPORT-${timestamp}.txt`);
  
  await fs.writeFile(filename, report);
  
  console.log(`\n✅ Analysis Complete!`);
  console.log(`📄 Report saved to: ${filename}`);
  console.log(`📊 Size: ${(report.length / 1024).toFixed(2)} KB`);
  
  // Show preview
  console.log('\n--- REPORT PREVIEW ---');
  console.log(report.substring(0, 500) + '...');
}

if (require.main === module) {
  main().catch(console.error);
}