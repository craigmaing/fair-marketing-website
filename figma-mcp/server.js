const http = require("http");
const url = require("url");

const FIGMA_API = "https://api.figma.com/v1";
const TOKEN = process.env.FIGMA_TOKEN;
if (!TOKEN) { console.error("Missing FIGMA_TOKEN"); process.exit(1); }

function figmaFetch(path) {
  return fetch(FIGMA_API + path, { headers: { "X-Figma-Token": TOKEN } })
    .then(res => { if (!res.ok) throw new Error("Figma API error " + res.status); return res.json(); });
}

// ----- one simple tool: get_file -----
const tools = {
  get_file: {
    description: "Fetch a Figma file by key",
    input_schema: {
      type: "object",
      properties: { file_key: { type: "string" } },
      required: ["file_key"]
    },
    handler: function (input) {
      return figmaFetch("/files/" + encodeURIComponent(input.file_key))
        .then(data => ({ content: [{ type: "json", text: JSON.stringify(data) }] }));
    }
  }
};

function sse(res, data) { res.write("data: " + JSON.stringify(data) + "\n\n"); }

const server = http.createServer(function (req, res) {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  if (pathname === "/sse") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });
    sse(res, { type: "mcp/tools", tools: Object.keys(tools).map(function (name) {
      const t = tools[name];
      return { name: name, description: t.description, input_schema: t.input_schema };
    })});
    req.on("close", function () { try { res.end(); } catch (_) {} });
    return;
  }

  if (pathname === "/invoke" && req.method === "POST") {
    var body = "";
    req.on("data", function (chunk) { body += chunk; });
    req.on("end", function () {
      try {
        var msg = JSON.parse(body || "{}");
        var tool = tools[msg.tool];
        if (!tool) throw new Error("Unknown tool: " + msg.tool);
        Promise.resolve(tool.handler(msg.input || {}))
          .then(function (result) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true, result: result }));
          })
          .catch(function (e) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: String(e) }));
          });
      } catch (e) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: String(e) }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end("not found");
});

const PORT = process.env.PORT || 4242;
server.listen(PORT, function () {
  console.log("MCP server at http://127.0.0.1:" + PORT + "/sse");
});
