#!/usr/bin/env node

const axios = require('axios');

async function testDataForSEO() {
  const auth = Buffer.from(
    `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
  ).toString('base64');

  console.log('Testing DataForSEO Connection...\n');
  console.log(`Account: ${process.env.DATAFORSEO_LOGIN}`);
  
  try {
    // Test with a simple SERP request for Fearnbell Marketing keywords
    const response = await axios({
      method: 'POST',
      url: 'https://api.dataforseo.com/v3/serp/google/organic/live/advanced',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify([{
        keyword: 'marketing agency london',
        location_code: 2826, // UK
        language_code: 'en',
        device: 'desktop',
        depth: 10
      }])
    });

    if (response.data.status_code === 20000) {
      console.log('✅ DataForSEO Connection Successful!\n');
      
      const results = response.data.tasks[0].result[0];
      console.log(`Keyword: "${results.keyword}"`);
      console.log(`Total Results: ${results.se_results_count.toLocaleString()}`);
      console.log(`\nTop 5 Competitors:`);
      
      results.items.slice(0, 5).forEach((item, i) => {
        console.log(`${i + 1}. ${item.domain} - ${item.title}`);
      });
      
      return true;
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data?.status_message || error.message);
    return false;
  }
}

testDataForSEO();