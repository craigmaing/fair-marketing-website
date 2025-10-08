import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DataForSeoClient } from "./client.js";

/**
 * Base helper function to register an MCP tool for DataForSEO API
 */
export function registerTool(
  server: McpServer,
  name: string,
  schema: z.ZodTypeAny | Record<string, any>,
  handler: (params: any, client: DataForSeoClient) => Promise<any>
) {
  // Normalize to ZodRawShape for the MCP SDK (expects a shape, not a ZodObject)
  const shape: z.ZodRawShape = (() => {
    const anySchema = schema as any;
    // ZodObject exposes shape via _def.shape() in Zod v3
    if (anySchema?._def?.shape && typeof anySchema._def.shape === "function") {
      return anySchema._def.shape();
    }
    // Some builds expose .shape directly
    if (anySchema?.shape && typeof anySchema.shape === "object") {
      return anySchema.shape as z.ZodRawShape;
    }
    // Assume raw shape was provided
    return schema as z.ZodRawShape;
  })();

  server.tool(
    name,
    shape,
    async (params: any, _context: any) => {
      try {
        // Retrieve the API client attached to the server instance
        const client = (server as unknown as { apiClient?: DataForSeoClient }).apiClient;
        if (!client) {
          throw new Error("DataForSEO API client not initialized on server");
        }

        const result = await handler(params, client);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error(`Error in ${name} tool:`, error);
        
        if (error instanceof Error) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  error: error.message,
                  stack: error.stack
                }, null, 2)
              }
            ]
          };
        }
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "Unknown error occurred",
                details: error
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}

/**
 * Helper for registering a task-based tool (POST, READY, GET pattern)
 */
export function registerTaskTool(
  server: McpServer,
  baseName: string,
  postSchema: z.ZodTypeAny | Record<string, any>,
  postHandler: (params: any, client: DataForSeoClient) => Promise<any>,
  readyHandler: (client: DataForSeoClient) => Promise<any>,
  getHandler: (id: string, client: DataForSeoClient) => Promise<any>
) {
  // Register POST tool
  registerTool(
    server,
    `${baseName}_post`,
    postSchema,
    postHandler
  );
  
  // Register READY tool
  registerTool(
    server,
    `${baseName}_ready`,
    z.object({}),
    (_params, client) => readyHandler(client)
  );
  
  // Register GET tool
  registerTool(
    server,
    `${baseName}_get`,
    z.object({ id: z.string() }),
    (params, client) => getHandler(params.id, client)
  );
}
