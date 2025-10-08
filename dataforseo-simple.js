#!/usr/bin/env node
const { Server } = require("@modelcontextprotocol/sdk/server");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const axios = require("axios");

// DataForSEO credentials from environment
const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN || "craig.fearn@lighthousementoring.co.uk";
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD || "9a2c6ace2bf8b626";

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

async function main() {
  const server = new Server(
    {
      name: "dataforseo-simple",
      version: "1.0.0"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  // Register tools
  server.setRequestHandler("tools/list", async () => {
    return {
      tools: [
        {
          name: "keyword_suggestions",
          description: "Get keyword suggestions from DataForSEO",
          inputSchema: {
            type: "object",
            properties: {
              keyword: {
                type: "string",
                description: "The seed keyword to get suggestions for"
              },
              location_code: {
                type: "number",
                description: "Location code (e.g., 2840 for USA, 2826 for UK)",
                default: 2840
              },
              language_code: {
                type: "string",
                description: "Language code (e.g., 'en')",
                default: "en"
              }
            },
            required: ["keyword"]
          }
        },
        {
          name: "serp_google",
          description: "Get Google SERP results",
          inputSchema: {
            type: "object",
            properties: {
              keyword: {
                type: "string",
                description: "The keyword to search"
              },
              location_code: {
                type: "number",
                description: "Location code (e.g., 2840 for USA)",
                default: 2840
              },
              language_code: {
                type: "string",
                description: "Language code",
                default: "en"
              }
            },
            required: ["keyword"]
          }
        },
        {
          name: "domain_overview",
          description: "Get domain analytics overview",
          inputSchema: {
            type: "object",
            properties: {
              target: {
                type: "string",
                description: "Domain to analyze (e.g., 'example.com')"
              },
              location_code: {
                type: "number",
                description: "Location code",
                default: 2840
              },
              language_code: {
                type: "string",
                description: "Language code",
                default: "en"
              }
            },
            required: ["target"]
          }
        },
        {
          name: "competitor_domains",
          description: "Find competitor domains",
          inputSchema: {
            type: "object",
            properties: {
              target: {
                type: "string",
                description: "Domain to find competitors for"
              },
              location_code: {
                type: "number",
                description: "Location code",
                default: 2840
              },
              language_code: {
                type: "string",
                description: "Language code",
                default: "en"
              }
            },
            required: ["target"]
          }
        }
      ]
    };
  });

  server.setRequestHandler("tools/call", async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      let result;
      
      switch (name) {
        case "keyword_suggestions":
          result = await api.post("/dataforseo_labs/google/keyword_suggestions/live", [{
            keyword: args.keyword,
            location_code: args.location_code || 2840,
            language_code: args.language_code || "en",
            include_seed_keyword: true,
            include_serp_info: true,
            limit: 20
          }]);
          break;
          
        case "serp_google":
          result = await api.post("/serp/google/organic/live/advanced", [{
            keyword: args.keyword,
            location_code: args.location_code || 2840,
            language_code: args.language_code || "en",
            device: "desktop",
            depth: 10
          }]);
          break;
          
        case "domain_overview":
          result = await api.post("/dataforseo_labs/google/domain_metrics_by_categories/live", [{
            target: args.target,
            location_code: args.location_code || 2840,
            language_code: args.language_code || "en",
            include_clickstream_data: true
          }]);
          break;
          
        case "competitor_domains":
          result = await api.post("/dataforseo_labs/google/competitors_domain/live", [{
            target: args.target,
            location_code: args.location_code || 2840,
            language_code: args.language_code || "en",
            limit: 10
          }]);
          break;
          
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result.data, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error.message,
              response: error.response?.data,
              tool: name,
              args: args
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("DataForSEO Simple MCP Server started");
}

main().catch(console.error);