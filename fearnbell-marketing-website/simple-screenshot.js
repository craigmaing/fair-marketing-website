import { chromium } from '@playwright/test';

async function takeScreenshot() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('📱 Loading homepage...');
    await page.goto('http://localhost:4321');
    await page.waitForLoadState('networkidle');
    
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'homepage-actual.png', 
      fullPage: true 
    });
    
    console.log('🔍 Checking what elements actually exist...');
    
    // Check if main sections are there
    const sections = await page.$$('section');
    console.log(`Found ${sections.length} sections`);
    
    // Check for header
    const header = await page.$('header');
    console.log(`Header exists: ${!!header}`);
    
    // Check for main content
    const main = await page.$('main');
    console.log(`Main element exists: ${!!main}`);
    
    // Check page title
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Check for key text elements
    const keyTexts = [
      'Fearnbell Marketing',
      'London',
      'Transparent Pricing',
      'Website Development',
      'Calculate Your'
    ];
    
    for (const text of keyTexts) {
      const found = await page.locator(`text=${text}`).count();
      console.log(`"${text}" found ${found} times`);
    }
    
    // Get page content preview
    const bodyText = await page.locator('body').textContent();
    const preview = bodyText.substring(0, 200).replace(/\s+/g, ' ').trim();
    console.log(`\nPage content preview: ${preview}...`);
    
    console.log('\n✅ Screenshot saved as homepage-actual.png');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshot();