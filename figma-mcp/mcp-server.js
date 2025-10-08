#!/usr/bin/env node
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

const FIGMA_API = "https://api.figma.com/v1";
const TOKEN = process.env.FIGMA_TOKEN;

if (!TOKEN) {
  console.error("Error: FIGMA_TOKEN not provided");
  console.error("Please set FIGMA_TOKEN environment variable");
  process.exit(1);
}

async function figmaFetch(path) {
  const response = await fetch(FIGMA_API + path, {
    headers: {
      "X-Figma-Token": TOKEN
    }
  });
  
  if (!response.ok) {
    throw new Error(`Figma API error ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

async function main() {
  // Create MCP server
  const server = new Server(
    {
      name: "figma",
      version: "1.0.0"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  // Register tools/list handler
  server.setRequestHandler("tools/list", async () => {
    return {
      tools: [
        {
          name: "get_file",
          description: "Fetch a Figma file by key",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key"
              }
            },
            required: ["file_key"]
          }
        },
        {
          name: "get_file_images",
          description: "Export images from a Figma file",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key"
              },
              node_ids: {
                type: "array",
                items: { type: "string" },
                description: "Array of node IDs to export (optional, exports all if not provided)"
              },
              format: {
                type: "string",
                enum: ["jpg", "png", "svg", "pdf"],
                description: "Image format (default: png)"
              },
              scale: {
                type: "number",
                description: "Scale factor (0.01 to 4, default: 1)"
              }
            },
            required: ["file_key"]
          }
        },
        {
          name: "get_file_nodes",
          description: "Get specific nodes from a Figma file",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key"
              },
              node_ids: {
                type: "array",
                items: { type: "string" },
                description: "Array of node IDs to retrieve"
              }
            },
            required: ["file_key", "node_ids"]
          }
        },
        {
          name: "get_team_projects",
          description: "List all projects for a team",
          inputSchema: {
            type: "object",
            properties: {
              team_id: {
                type: "string",
                description: "The team ID"
              }
            },
            required: ["team_id"]
          }
        },
        {
          name: "get_project_files",
          description: "List all files in a project",
          inputSchema: {
            type: "object",
            properties: {
              project_id: {
                type: "string",
                description: "The project ID"
              }
            },
            required: ["project_id"]
          }
        }
      ]
    };
  });

  // Register tools/call handler
  server.setRequestHandler("tools/call", async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      let result;
      
      switch (name) {
        case "get_file":
          result = await figmaFetch(`/files/${encodeURIComponent(args.file_key)}`);
          break;
          
        case "get_file_images":
          const imageParams = new URLSearchParams();
          if (args.node_ids && args.node_ids.length > 0) {
            imageParams.append("ids", args.node_ids.join(","));
          }
          if (args.format) {
            imageParams.append("format", args.format);
          }
          if (args.scale) {
            imageParams.append("scale", args.scale.toString());
          }
          result = await figmaFetch(`/images/${encodeURIComponent(args.file_key)}?${imageParams}`);
          break;
          
        case "get_file_nodes":
          const nodeParams = new URLSearchParams();
          nodeParams.append("ids", args.node_ids.join(","));
          result = await figmaFetch(`/files/${encodeURIComponent(args.file_key)}/nodes?${nodeParams}`);
          break;
          
        case "get_team_projects":
          result = await figmaFetch(`/teams/${encodeURIComponent(args.team_id)}/projects`);
          break;
          
        case "get_project_files":
          result = await figmaFetch(`/projects/${encodeURIComponent(args.project_id)}/files`);
          break;
          
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
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
              tool: name,
              args: args
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("Figma MCP Server started");
}

main().catch((error) => {
  console.error("Error in Figma MCP Server:", error);
  process.exit(1);
});