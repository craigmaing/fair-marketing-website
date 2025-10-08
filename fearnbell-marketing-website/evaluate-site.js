// @ts-check
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function evaluateSite() {
  console.log('🎭 Starting Fearnbell Marketing Website Evaluation...\n');
  
  // Create screenshots directory
  const screenshotDir = 'screenshots';
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Go to homepage
    console.log('📱 Loading homepage...');
    await page.goto('http://localhost:4321');
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    console.log('📸 Taking full page screenshot...');
    await page.screenshot({ 
      path: `${screenshotDir}/homepage-full.png`, 
      fullPage: true 
    });
    
    // Take hero section screenshot
    console.log('🎯 Capturing hero section...');
    const heroSection = page.locator('section').first();
    await heroSection.screenshot({ path: `${screenshotDir}/hero-section.png` });
    
    // Take services section screenshot
    console.log('🛠️ Capturing services section...');
    const servicesSection = page.locator('text=Marketing Services That Actually Make Sense').locator('..').locator('..');
    await servicesSection.screenshot({ path: `${screenshotDir}/services-section.png` });
    
    // Take calculator screenshot
    console.log('🧮 Capturing pricing calculator...');
    const calculatorSection = page.locator('text=Calculate Your Exact Cost').locator('..').locator('..');
    await calculatorSection.screenshot({ path: `${screenshotDir}/calculator-section.png` });
    
    // Test calculator functionality
    console.log('⚙️ Testing calculator functionality...');
    
    // Get initial price
    const initialPrice = await page.locator('#totalPrice').textContent();
    console.log(`   Initial price: £${initialPrice}`);
    
    // Change service type
    await page.locator('#serviceType').selectOption('business');
    const businessPrice = await page.locator('#totalPrice').textContent();
    console.log(`   Business package price: £${businessPrice}`);
    
    // Change pages
    await page.locator('#pages').fill('10');
    const pagesPrice = await page.locator('#totalPrice').textContent();
    console.log(`   With 10 pages: £${pagesPrice}`);
    
    // Add SEO option
    await page.locator('input[name="seo"][value="premium"]').check();
    const seoPrice = await page.locator('#totalPrice').textContent();
    console.log(`   With premium SEO: £${seoPrice}`);
    
    // Take calculator with changes screenshot
    await calculatorSection.screenshot({ path: `${screenshotDir}/calculator-configured.png` });
    
    // Test mobile view
    console.log('📱 Testing mobile responsiveness...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ 
      path: `${screenshotDir}/mobile-homepage.png`, 
      fullPage: true 
    });
    
    // Check key elements exist
    console.log('✅ Checking key elements...');
    
    const elements = {
      'Logo': 'header svg, header [class*="logo"]',
      'Main headline': 'h1',
      'Transparent pricing badge': 'text=100% Transparent Pricing',
      'Calculator': '#serviceType',
      'Services section': 'text=Website Development',
      'Testimonials': 'text=What Clients Say',
      'Footer': 'footer'
    };
    
    for (const [name, selector] of Object.entries(elements)) {
      try {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible();
        console.log(`   ${isVisible ? '✅' : '❌'} ${name}: ${isVisible ? 'Found' : 'Missing'}`);
      } catch (error) {
        console.log(`   ❌ ${name}: Error checking - ${error.message}`);
      }
    }
    
    // Evaluate loading performance
    console.log('⚡ Performance check...');
    const startTime = Date.now();
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    console.log(`   Load time: ${loadTime}ms`);
    
    // Check for errors in console
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('❌ Console errors found:');
      errors.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('✅ No console errors found');
    }
    
    console.log('\n🎨 VISUAL EVALUATION:');
    console.log('Screenshots saved to ./screenshots/');
    console.log('   - homepage-full.png (complete homepage)');
    console.log('   - hero-section.png (hero area)');
    console.log('   - services-section.png (services grid)');
    console.log('   - calculator-section.png (pricing calculator)');
    console.log('   - calculator-configured.png (calculator with options)');
    console.log('   - mobile-homepage.png (mobile view)');
    
  } catch (error) {
    console.error('❌ Error during evaluation:', error);
  } finally {
    await browser.close();
  }
}

// Run the evaluation
evaluateSite().then(() => {
  console.log('\n✅ Website evaluation complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Evaluation failed:', error);
  process.exit(1);
});