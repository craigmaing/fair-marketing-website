const { exec, spawn } = require('child_process');

const username = 'craig.fearn@lighthousementoring.co.uk';
const password = '9a2c6ace2bf8b626';

const serpRequest = {
  type: 'dataforseo_serp',
  keyword: 'artificial intelligence',
  location_code: 2840,
  language_code: 'en',
  device: 'desktop',
  os: 'windows'
};

const keywordsDataRequest = {
  type: 'dataforseo_keywords_data',
  keywords: ["seo", "search engine optimization"],
  location_code: 2840,
  language_code: 'en'
};

const backlinksRequest = {
  type: 'dataforseo_backlinks',
  target: 'example.com',
  limit: 100
 };
 
 const onpageRequest = {
   type: 'dataforseo_onpage',
   url: "https://example.com",
   check_spell: true,
   enable_javascript: true
 };
 
 const domainAnalyticsRequest = {
   type: 'dataforseo_domain_analytics',
   domain: "example.com"
 };
 
 const appDataRequest = {
   type: 'dataforseo_app_data',
   app_id: "com.example.app"
 };
 
 const businessDataRequest = {
   type: 'dataforseo_business_data',
   keyword: "pizza delivery",
   location_code: 2840,
   language_code: "en"
 };
 
 async function sendRequest(taskConfig) {
  // Ensure the config JSON is properly escaped for the command line
  const escapedConfig = JSON.stringify({ username, password }).replace(/"/g, '\\"');
  const command = `mcp-dataforseo --config "${escapedConfig}"`;

  // Use spawn for better process management
  const serverProcess = spawn('npx', [
    'mcp-dataforseo', // Assuming this is the correct command, not '@skobyn/mcp-dataforseo' from user example
    '--config',
    escapedConfig
  ]);

  // Handle stdout
  serverProcess.stdout.on('data', (data) => {
    try {
      const response = JSON.parse(data.toString());
      console.log('Response:', response);
    } catch (e) {
      console.error('Failed to parse JSON response:', data.toString());
    }
  });

  // Handle stderr
  serverProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Handle process exit
  serverProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`MCP process exited with code ${code}`);
    }
  });

  // Send the request to stdin
  serverProcess.stdin.write(JSON.stringify(taskConfig) + '\n');
  serverProcess.stdin.end();
}

sendRequest(serpRequest);
sendRequest(keywordsDataRequest);
sendRequest(backlinksRequest);
sendRequest(onpageRequest);
sendRequest(domainAnalyticsRequest);
sendRequest(appDataRequest);
sendRequest(businessDataRequest);