#!/usr/bin/env node
// Playwright audit: visit key pages, capture screenshots and a tiny SEO report
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const outDir = path.resolve('site-snapshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const ports = [8081, 8080, 5173];
  const paths = [
    '/',
    '/about/',
    '/services/',
    '/services/website-development/',
    '/services/seo-optimization/'
  ];

  // Pick first responsive base URL
  let base = null;
  for (const p of ports) {
    try {
      const res = await fetch(`http://localhost:${p}/`, { method: 'GET' });
      if (res.ok) { base = `http://localhost:${p}`; break; }
    } catch (_) {}
  }
  if (!base) {
    console.error('No local server detected on ports:', ports.join(', '));
    process.exit(1);
  }
  console.log('Auditing base:', base);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();

  const report = [];
  for (const p of paths) {
    const url = base + p;
    try {
      const resp = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      if (!resp || !resp.ok()) throw new Error(`HTTP ${resp && resp.status()}`);

      await page.waitForTimeout(250);
      const title = await page.title();
      const h1 = await page.locator('h1').first().textContent().catch(() => '');
      const metaDesc = await page.locator('meta[name="description"]').getAttribute('content').catch(() => '');
      const navLinks = await page.locator('header a').count();

      const fileSafe = p === '/' ? 'home' : p.replace(/^\//, '').replace(/\/$/, '').replace(/\W+/g, '-');
      const shotPath = path.join(outDir, `${fileSafe || 'home'}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });

      report.push({ path: p, url, title, h1: (h1 || '').trim(), metaDescription: metaDesc || '', navLinks, screenshot: shotPath });
      console.log(`Captured ${p} -> ${shotPath}`);
    } catch (err) {
      console.error(`Error auditing ${url}:`, err.message || err);
      report.push({ path: p, url, error: String(err && err.message || err) });
    }
  }

  await browser.close();
  const reportPath = path.join(outDir, 'report.json');
  await fsp.writeFile(reportPath, JSON.stringify({ base, generatedAt: new Date().toISOString(), pages: report }, null, 2));
  console.log('Audit complete. Report:', reportPath);
})();

