#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from 'axios';

const API_KEY = process.env.DATAFORSEO_API_KEY; // provided by MCP config

if (!API_KEY) {
  throw new Error('DATAFORSEO_API_KEY environment variable is required');
}

// Create an MCP server
const server = new McpServer({
  name: "dataforseo-keyword-server",
  version: "0.1.0"
});

// Add a tool for getting keyword data
server.tool(
  "get_keyword_data",
  {
    keywords: z.array(z.string()).min(1).describe("Array of keywords to search for"),
    location: z.string().optional().describe("Location for keyword research (e.g., 'United States' or 'New York')"),
    language: z.string().optional().describe("Language for keyword research (e.g., 'en')"),
  },
  async ({ keywords, location, language }) => {
    try {
      // DataForSEO API endpoint for keyword data
      const endpoint = 'https://api.dataforseo.com/v3/keywords_data/relevant';

      const response = await axios.post(endpoint, {
        keywords: keywords,
        location: location,
        language: language,
      }, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });

      // Assuming the response structure contains relevant keyword data
      // You might need to adjust this based on the actual DataForSEO API response
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          content: [
            {
              type: "text",
              text: `DataForSEO API error: ${error.response?.data?.error?.message ?? error.message}`,
            },
          ],
          isError: true,
        };
      }
      throw error;
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('DataForSEO Keyword MCP server running on stdio');