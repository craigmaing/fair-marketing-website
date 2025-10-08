#!/usr/bin/env node
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
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
  const server = new McpServer({
    name: "dataforseo-simple",
    version: "1.0.0"
  });

  // Register tools
  server.tool(
    "keyword_suggestions",
    "Get keyword suggestions from DataForSEO",
    {
      keyword: {
        type: "string",
        description: "The seed keyword to get suggestions for",
        required: true
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
    async (args) => {
      try {
        const result = await api.post("/dataforseo_labs/google/keyword_suggestions/live", [{
          keyword: args.keyword,
          location_code: args.location_code || 2840,
          language_code: args.language_code || "en",
          include_seed_keyword: true,
          include_serp_info: true,
          limit: 20
        }]);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error: ${error.message}\n${error.response?.data ? JSON.stringify(error.response.data, null, 2) : ''}`
          }],
          isError: true
        };
      }
    }
  );

  server.tool(
    "serp_google",
    "Get Google SERP results",
    {
      keyword: {
        type: "string",
        description: "The keyword to search",
        required: true
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
    async (args) => {
      try {
        const result = await api.post("/serp/google/organic/live/advanced", [{
          keyword: args.keyword,
          location_code: args.location_code || 2840,
          language_code: args.language_code || "en",
          device: "desktop",
          depth: 10
        }]);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error: ${error.message}\n${error.response?.data ? JSON.stringify(error.response.data, null, 2) : ''}`
          }],
          isError: true
        };
      }
    }
  );

  server.tool(
    "domain_overview",
    "Get domain analytics overview",
    {
      target: {
        type: "string",
        description: "Domain to analyze (e.g., 'example.com')",
        required: true
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
    async (args) => {
      try {
        const result = await api.post("/dataforseo_labs/google/domain_metrics_by_categories/live", [{
          target: args.target,
          location_code: args.location_code || 2840,
          language_code: args.language_code || "en",
          include_clickstream_data: true
        }]);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error: ${error.message}\n${error.response?.data ? JSON.stringify(error.response.data, null, 2) : ''}`
          }],
          isError: true
        };
      }
    }
  );

  server.tool(
    "competitor_domains",
    "Find competitor domains",
    {
      target: {
        type: "string",
        description: "Domain to find competitors for",
        required: true
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
    async (args) => {
      try {
        const result = await api.post("/dataforseo_labs/google/competitors_domain/live", [{
          target: args.target,
          location_code: args.location_code || 2840,
          language_code: args.language_code || "en",
          limit: 10
        }]);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error: ${error.message}\n${error.response?.data ? JSON.stringify(error.response.data, null, 2) : ''}`
          }],
          isError: true
        };
      }
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("DataForSEO Simple MCP Server started successfully");
}

main().catch(error => {
  console.error("Failed to start DataForSEO server:", error);
  process.exit(1);
});