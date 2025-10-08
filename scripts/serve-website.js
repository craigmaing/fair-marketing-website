#!/usr/bin/env node
// Simple static server for /website with minimal SSI-style includes
// Usage: node scripts/serve-website.js [--port 5173]

const http = require('http');
const fs = require('fs/promises');
const fssync = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const rootDir = path.resolve(projectRoot, 'website');
const args = process.argv.slice(2);
const portArgIndex = args.indexOf('--port');
const port = portArgIndex >= 0 ? Number(args[portArgIndex + 1]) : Number(process.env.PORT || 5173);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
};

function safeJoin(base, target) {
  const targetPath = path.posix.normalize(target).replace(/^\/+/, '');
  const full = path.resolve(base, targetPath);
  if (!full.startsWith(base)) throw new Error('Path traversal blocked');
  return full;
}

async function renderHtml(filePath, depth = 0) {
  if (depth > 8) return await fs.readFile(filePath, 'utf8');
  let html = await fs.readFile(filePath, 'utf8');
  const includeRE = /<!--#include\s+file=\"([^\"]+)\"\s*-->/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = includeRE.exec(html)) !== null) {
    const before = html.slice(lastIndex, match.index);
    parts.push(before);
    const inc = match[1];
    try {
      const incPath = safeJoin(rootDir, inc);
      if (fssync.existsSync(incPath) && fssync.statSync(incPath).isFile()) {
        const rendered = await renderHtml(incPath, depth + 1);
        parts.push(rendered);
      } else {
        parts.push(`<!-- include not found: ${inc} -->`);
      }
    } catch (e) {
      parts.push(`<!-- include error: ${(e && e.message) || 'unknown'} -->`);
    }
    lastIndex = match.index + match[0].length;
  }
  parts.push(html.slice(lastIndex));
  return parts.join('');
}

const server = http.createServer(async (req, res) => {
  try {
    const parsed = new URL(req.url || '/', `http://${req.headers.host}`);
    let reqPath = decodeURIComponent(parsed.pathname);

    // default to index.html for roots and directories
    let filePath = safeJoin(rootDir, reqPath);
    let stat;
    if (fssync.existsSync(filePath)) stat = fssync.statSync(filePath);

    if (!stat) {
      // try with .html
      if (!path.extname(filePath)) {
        const withHtml = `${filePath}.html`;
        if (fssync.existsSync(withHtml)) {
          filePath = withHtml;
          stat = fssync.statSync(filePath);
        }
      }
    }

    if (stat && stat.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      if (fssync.existsSync(indexPath)) {
        filePath = indexPath;
      } else {
        res.writeHead(403);
        res.end('Directory listing is disabled');
        return;
      }
    }

    if (!fssync.existsSync(filePath)) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';

    if (ext === '.html') {
      const body = await renderHtml(filePath);
      res.writeHead(200, { 'content-type': type });
      res.end(body);
      return;
    }

    const stream = fssync.createReadStream(filePath);
    res.writeHead(200, { 'content-type': type });
    stream.pipe(res);
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(`Server error: ${(err && err.message) || err}`);
  }
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Serving website from ${rootDir} on http://localhost:${port}`);
});
