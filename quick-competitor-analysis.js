#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs').promises;

async function quickCompetitorAnalysis() {
  const auth = Buffer.from(
    `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
  ).toString('base64');

  console.log('🚀 Running Quick Competitor Analysis for Fearnbell Marketing\n');
  console.log('=' .repeat(60));

  const keywords = [
    'marketing agency london',
    'fair pricing marketing agency',
    'transparent marketing services',
    'affordable seo london'
  ];

  const competitors = new Map();
  const report = {
    date: new Date().toISOString(),
    keywords_analyzed: [],
    top_competitors: [],
    opportunities: []
  };

  for (const keyword of keywords) {
    console.log(`\n📊 Analyzing: "${keyword}"`);
    
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://api.dataforseo.com/v3/serp/google/organic/live/advanced',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify([{
          keyword: keyword,
          location_code: 2826, // UK
          language_code: 'en',
          device: 'desktop',
          depth: 20
        }])
      });

      if (response.data.status_code === 20000) {
        const results = response.data.tasks[0].result[0];
        
        // Store keyword data
        const keywordData = {
          keyword: keyword,
          total_results: results.se_results_count,
          top_domains: []
        };

        // Process organic results
        if (results.items) {
          results.items.forEach((item, index) => {
            // Skip paid results, people also ask, etc
            if (item.type === 'organic') {
              const domain = item.domain;
              
              // Track domain frequency
              const count = competitors.get(domain) || 0;
              competitors.set(domain, count + 1);
              
              // Store top 5 for this keyword
              if (index < 5) {
                keywordData.top_domains.push({
                  position: item.rank_group,
                  domain: domain,
                  url: item.url,
                  title: item.title,
                  description: item.description
                });
              }
            }
          });
        }

        report.keywords_analyzed.push(keywordData);
        console.log(`  ✅ Found ${keywordData.top_domains.length} competitors`);
      }
      
      // Small delay to be respectful to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }

  // Get top competitors by frequency
  report.top_competitors = Array.from(competitors.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([domain, count]) => ({ domain, appearances: count }));

  // Print summary
  console.log('\n' + '=' .repeat(60));
  console.log('📈 COMPETITOR ANALYSIS SUMMARY');
  console.log('=' .repeat(60));
  
  console.log('\n🏆 Top Competitors (by frequency across keywords):');
  report.top_competitors.forEach((comp, i) => {
    console.log(`${i + 1}. ${comp.domain} - Appears ${comp.appearances} times`);
  });

  console.log('\n💡 Key Insights:');
  console.log('- Focus on competing with:', report.top_competitors.slice(0, 3).map(c => c.domain).join(', '));
  console.log('- Target keywords with lower competition for quick wins');
  console.log('- Emphasize "fair pricing" and "transparency" as differentiators');

  // Save report
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `quick-analysis-${timestamp}.json`;
  await fs.writeFile(filename, JSON.stringify(report, null, 2));
  console.log(`\n✅ Report saved to: ${filename}`);

  return report;
}

quickCompetitorAnalysis().catch(console.error);