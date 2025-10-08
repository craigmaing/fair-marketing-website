// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Pricing Calculator Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Scroll to calculator section using h2 heading specifically
    await page.locator('h2:has-text("Calculate Your Exact Cost")').scrollIntoViewIfNeeded();
  });

  test('calculator displays initial values correctly', async ({ page }) => {
    // Check initial values
    await expect(page.locator('#totalPrice')).toHaveText('2000');
    await expect(page.locator('#pageCount')).toHaveText('5');
    await expect(page.locator('#payment1')).toHaveText('500');
    await expect(page.locator('#payment2')).toHaveText('500');
    await expect(page.locator('#payment3')).toHaveText('500');
    await expect(page.locator('#payment4')).toHaveText('500');
  });

  test('service type changes affect pricing', async ({ page }) => {
    const serviceSelect = page.locator('#serviceType');
    const totalPrice = page.locator('#totalPrice');
    
    // Test Starter package (default)
    await expect(totalPrice).toHaveText('2000');
    
    // Test Business package
    await serviceSelect.selectOption('business');
    await expect(totalPrice).toHaveText('4000');
    
    // Test Premium package  
    await serviceSelect.selectOption('premium');
    await expect(totalPrice).toHaveText('8000');
    
    // Test Custom solution
    await serviceSelect.selectOption('custom');
    await expect(totalPrice).toHaveText('12000');
  });

  test('page slider affects pricing', async ({ page }) => {
    const pagesSlider = page.locator('#pages');
    const pageCount = page.locator('#pageCount');
    const totalPrice = page.locator('#totalPrice');
    
    // Test minimum pages (3)
    await pagesSlider.fill('3');
    await expect(pageCount).toHaveText('3');
    // Should be base price minus 2 pages * £150 = £1700
    await expect(totalPrice).toHaveText('1700');
    
    // Test more pages (10)
    await pagesSlider.fill('10');
    await expect(pageCount).toHaveText('10');
    // Should be base price plus 5 extra pages * £150 = £2750
    await expect(totalPrice).toHaveText('2750');
  });

  test('SEO options affect pricing', async ({ page }) => {
    const totalPrice = page.locator('#totalPrice');
    
    // Test Advanced SEO
    await page.locator('input[name="seo"][value="advanced"]').check();
    await expect(totalPrice).toHaveText('2500'); // £2000 + £500
    
    // Test Premium SEO
    await page.locator('input[name="seo"][value="premium"]').check();
    await expect(totalPrice).toHaveText('3000'); // £2000 + £1000
    
    // Back to Basic SEO
    await page.locator('input[name="seo"][value="basic"]').check();
    await expect(totalPrice).toHaveText('2000'); // £2000 + £0
  });

  test('additional services checkboxes work', async ({ page }) => {
    const totalPrice = page.locator('#totalPrice');
    
    // Initial price
    await expect(totalPrice).toHaveText('2000');
    
    // Add competitor analysis
    await page.locator('#competitors').check();
    await expect(totalPrice).toHaveText('2300'); // +£300
    
    // Add content creation
    await page.locator('#content').check();
    await expect(totalPrice).toHaveText('2700'); // +£400 more
    
    // Add social media setup
    await page.locator('#social').check();
    await expect(totalPrice).toHaveText('2950'); // +£250 more
    
    // Add analytics dashboard
    await page.locator('#analytics').check();
    await expect(totalPrice).toHaveText('3150'); // +£200 more
    
    // Remove one service
    await page.locator('#competitors').uncheck();
    await expect(totalPrice).toHaveText('2850'); // -£300
  });

  test('payment breakdown updates correctly', async ({ page }) => {
    const serviceSelect = page.locator('#serviceType');
    
    // Switch to business package (£4000)
    await serviceSelect.selectOption('business');
    
    // Check that all payments are £1000 (quarter of £4000)
    await expect(page.locator('#payment1')).toHaveText('1000');
    await expect(page.locator('#payment2')).toHaveText('1000');
    await expect(page.locator('#payment3')).toHaveText('1000');
    await expect(page.locator('#payment4')).toHaveText('1000');
  });

  test('complex calculation works correctly', async ({ page }) => {
    const serviceSelect = page.locator('#serviceType');
    const pagesSlider = page.locator('#pages');
    const totalPrice = page.locator('#totalPrice');
    
    // Business package + 15 pages + Premium SEO + All extras
    await serviceSelect.selectOption('business'); // £4000 base
    await pagesSlider.fill('15'); // +£1500 (10 extra pages * £150)
    await page.locator('input[name="seo"][value="premium"]').check(); // +£1000
    await page.locator('#competitors').check(); // +£300
    await page.locator('#content').check(); // +£400
    await page.locator('#social').check(); // +£250
    await page.locator('#analytics').check(); // +£200
    
    // Total should be £7650 (4000+1500+1000+300+400+250+200)
    await expect(totalPrice).toHaveText('7650');
    
    // Check payment breakdown (£1913 each, rounded)
    await expect(page.locator('#payment1')).toHaveText('1913');
    await expect(page.locator('#payment2')).toHaveText('1913');
    await expect(page.locator('#payment3')).toHaveText('1913');
    await expect(page.locator('#payment4')).toHaveText('1913'); // All payments are equal
  });

  test('included features update based on service type', async ({ page }) => {
    const serviceSelect = page.locator('#serviceType');
    const featuresContainer = page.locator('#includedFeatures');
    
    // Starter features
    await serviceSelect.selectOption('starter');
    await expect(featuresContainer).toContainText('Responsive Website Design');
    await expect(featuresContainer).toContainText('Basic SEO Setup');
    await expect(featuresContainer).toContainText('30-day Support Period');
    
    // Business features
    await serviceSelect.selectOption('business');
    await expect(featuresContainer).toContainText('Professional Website Design');
    await expect(featuresContainer).toContainText('Advanced SEO Strategy');
    await expect(featuresContainer).toContainText('90-day Support Period');
    await expect(featuresContainer).toContainText('Monthly Reports');
    
    // Premium features
    await serviceSelect.selectOption('premium');
    await expect(featuresContainer).toContainText('Custom Website Design');
    await expect(featuresContainer).toContainText('Premium SEO Campaign');
    await expect(featuresContainer).toContainText('6-month Support Period');
    await expect(featuresContainer).toContainText('Dedicated Account Manager');
  });

  test('get quote button works', async ({ page }) => {
    // Mock navigation or check that button exists and is clickable
    const quoteButton = page.locator('button:has-text("Get Your Quote")');
    await expect(quoteButton).toBeVisible();
    await expect(quoteButton).toBeEnabled();
    
    // Test click (would normally navigate to contact form)
    await quoteButton.click();
    // In a real scenario, this might navigate to /contact?calculator=true
  });

  test('calculator works on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Scroll to calculator
    await page.locator('h2:has-text("Calculate Your Exact Cost")').scrollIntoViewIfNeeded();
    
    // Test that calculator is still functional on mobile
    const serviceSelect = page.locator('#serviceType');
    const totalPrice = page.locator('#totalPrice');
    
    await serviceSelect.selectOption('business');
    await expect(totalPrice).toHaveText('4000');
    
    // Test that slider works on mobile
    const pagesSlider = page.locator('#pages');
    await pagesSlider.fill('8');
    await expect(page.locator('#pageCount')).toHaveText('8');
  });
});