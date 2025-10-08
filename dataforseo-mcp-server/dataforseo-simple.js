#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const axios = require('axios');

// DataForSEO API client setup
class DataForSEOClient {
  constructor(login, password) {
    this.auth = Buffer.from(`${login}:${password}`).toString('base64');
    this.baseURL = 'https://api.dataforseo.com/v3';
  }

  async request(endpoint, method = 'POST', data = null) {
    try {
      const response = await axios({
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json'
        },
        data: data ? JSON.stringify(data) : null
      });
      return response.data;
    } catch (error) {
      console.error(`DataForSEO API Error: ${error.message}`);
      throw error;
    }
  }
}

async function main() {
  // Get credentials from environment
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    console.error('Error: DataForSEO credentials not found!');
    console.error('Please set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD environment variables');
    process.exit(1);
  }

  const client = new DataForSEOClient(login, password);
  
  // Create MCP server
  const server = new Server(
    {
      name: 'dataforseo-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register SERP Analysis Tool
  server.setRequestHandler('tools/list', async () => ({
    tools: [
      {
        name: 'serp_google_analysis',
        description: 'Analyze Google SERP results for a keyword to understand competition',
        inputSchema: {
          type: 'object',
          properties: {
            keyword: {
              type: 'string',
              description: 'Search keyword or phrase'
            },
            location_code: {
              type: 'number',
              description: 'Location code (2840 for USA)',
              default: 2840
            },
            language_code: {
              type: 'string',
              description: 'Language code (en for English)',
              default: 'en'
            }
          },
          required: ['keyword']
        }
      },
      {
        name: 'keyword_research',
        description: 'Get keyword suggestions and search volume data',
        inputSchema: {
          type: 'object',
          properties: {
            keywords: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of seed keywords'
            },
            location_code: {
              type: 'number',
              description: 'Location code (2840 for USA)',
              default: 2840
            },
            language_code: {
              type: 'string',
              description: 'Language code',
              default: 'en'
            }
          },
          required: ['keywords']
        }
      },
      {
        name: 'competitor_domain_analysis',
        description: 'Analyze a competitor domain for SEO metrics and keywords',
        inputSchema: {
          type: 'object',
          properties: {
            domain: {
              type: 'string',
              description: 'Domain to analyze (e.g., example.com)'
            },
            location_code: {
              type: 'number',
              description: 'Location code',
              default: 2840
            }
          },
          required: ['domain']
        }
      },
      {
        name: 'keyword_difficulty',
        description: 'Check keyword difficulty and competition metrics',
        inputSchema: {
          type: 'object',
          properties: {
            keyword: {
              type: 'string',
              description: 'Keyword to analyze'
            },
            location_code: {
              type: 'number',
              description: 'Location code',
              default: 2840
            }
          },
          required: ['keyword']
        }
      }
    ]
  }));

  // Handle tool calls
  server.setRequestHandler('tools/call', async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result;

      switch (name) {
        case 'serp_google_analysis':
          result = await client.request('/serp/google/organic/live/advanced', 'POST', [{
            keyword: args.keyword,
            location_code: args.location_code || 2840,
            language_code: args.language_code || 'en',
            device: 'desktop',
            depth: 10
          }]);
          
          // Extract useful competition data
          if (result.tasks && result.tasks[0] && result.tasks[0].result) {
            const items = result.tasks[0].result[0].items || [];
            const competitorData = items.slice(0, 10).map(item => ({
              position: item.rank_group,
              url: item.url,
              title: item.title,
              domain: item.domain,
              description: item.description
            }));
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    keyword: args.keyword,
                    total_results: result.tasks[0].result[0].se_results_count,
                    top_competitors: competitorData
                  }, null, 2)
                }
              ]
            };
          }
          break;

        case 'keyword_research':
          result = await client.request('/keywords_data/google/search_volume/live', 'POST', [{
            keywords: args.keywords,
            location_code: args.location_code || 2840,
            language_code: args.language_code || 'en'
          }]);
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };

        case 'competitor_domain_analysis':
          result = await client.request('/domain_analytics/overview/live', 'POST', [{
            target: args.domain,
            location_code: args.location_code || 2840,
            language_code: 'en'
          }]);
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };

        case 'keyword_difficulty':
          result = await client.request('/keywords_data/google/keyword_performance/live', 'POST', [{
            keyword: args.keyword,
            location_code: args.location_code || 2840,
            language_code: 'en'
          }]);
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };

    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`
          }
        ],
        isError: true
      };
    }
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('DataForSEO MCP Server started successfully!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});