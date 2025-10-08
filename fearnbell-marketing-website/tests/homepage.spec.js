// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Fearnbell Marketing Homepage', () => {
  test('has correct title and meta description', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Fair Pricing Marketing Agency London/);
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toContain('100% transparent pricing');
    expect(metaDescription).toContain('No hidden fees');
  });

  test('displays logo and navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check logo is visible
    await expect(page.locator('header')).toBeVisible();
    
    // Check main navigation items (desktop or mobile)
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 1024) {
      // Desktop navigation
      await expect(page.locator('nav a[href="/services"]')).toBeVisible();
      await expect(page.locator('nav a[href="/pricing"]')).toBeVisible(); 
      await expect(page.locator('nav a[href="/about"]')).toBeVisible();
    } else {
      // Mobile navigation button
      await expect(page.locator('[aria-label="Toggle mobile menu"]')).toBeVisible();
    }
  });

  test('hero section displays key messaging', async ({ page }) => {
    await page.goto('/');
    
    // Check main headline (use more specific selector to avoid strict mode violations)
    await expect(page.locator('main h1, section h1').first()).toContainText('London\'s Only');
    await expect(page.locator('main h1, section h1').first()).toContainText('100% Honest');
    await expect(page.locator('main h1, section h1').first()).toContainText('Marketing Agency');
    
    // Check trust badges (use first occurrence to avoid strict mode violations)
    await expect(page.locator('text=100% Transparent Pricing').first()).toBeVisible();
    await expect(page.locator('text=Fair 4-Payment Plan').first()).toBeVisible();
    
    // Check CTAs (use more specific selectors)
    await expect(page.locator('a[href="/calculator"]:has-text("Calculate Your Fair Price")')).toBeVisible();
    await expect(page.locator('a[href="/pricing"]:has-text("View All Prices")')).toBeVisible();
  });

  test('services section shows transparent pricing', async ({ page }) => {
    await page.goto('/');
    
    // Check services section is visible
    await expect(page.locator('text=Marketing Services That Actually Make Sense')).toBeVisible();
    
    // Check at least one service card is visible
    await expect(page.locator('h3:has-text("Website Development")').first()).toBeVisible();
    await expect(page.locator('text=£2,000').first()).toBeVisible();
    await expect(page.locator('text=£4,000').first()).toBeVisible();
    
    // Check transparent pricing messaging
    await expect(page.locator('text=Transparent Fixed Pricing')).toBeVisible();
  });

  test('pricing calculator is interactive', async ({ page }) => {
    await page.goto('/');
    
    // Check calculator section
    await expect(page.locator('h2:has-text("Calculate Your Exact Cost")')).toBeVisible();
    
    // Test service type dropdown
    const serviceSelect = page.locator('#serviceType');
    await expect(serviceSelect).toBeVisible();
    
    // Test pages slider
    const pagesSlider = page.locator('#pages');
    await expect(pagesSlider).toBeVisible();
    
    // Check initial price display
    await expect(page.locator('#totalPrice')).toBeVisible();
    
    // Test calculator interaction
    await serviceSelect.selectOption('business');
    await expect(page.locator('#totalPrice')).not.toHaveText('2000');
  });

  test('transparency section highlights differentiators', async ({ page }) => {
    await page.goto('/');
    
    // Check transparency comparison
    await expect(page.locator('text=How We\'re Different From Other Agencies')).toBeVisible();
    await expect(page.locator('text=What Other Agencies Do')).toBeVisible();
    await expect(page.locator('text=What Fearnbell Marketing Does')).toBeVisible();
    
    // Check guarantees section  
    await expect(page.locator('text=Our Transparency Guarantees')).toBeVisible();
    await expect(page.locator('text=Price Lock Promise')).toBeVisible();
    await expect(page.locator('h4:has-text("No Hidden Fees")')).toBeVisible();
  });

  test('testimonials section shows social proof', async ({ page }) => {
    await page.goto('/');
    
    // Check testimonials section
    await expect(page.locator('text=What Clients Say About Our Fair Pricing')).toBeVisible();
    
    // Check at least one testimonial
    await expect(page.locator('text=Finally, an agency that doesn\'t play games with pricing')).toBeVisible();
    
    // Check trust statistics
    await expect(page.locator('text=100% Price Accuracy')).toBeVisible();
    await expect(page.locator('text=0 Hidden Fees').first()).toBeVisible();
  });

  test('footer contains complete information', async ({ page }) => {
    await page.goto('/');
    
    // Check footer is visible
    await expect(page.locator('footer')).toBeVisible();
    
    // Check company name and branding
    await expect(page.locator('footer:has-text("Fearnbell Marketing")')).toBeVisible();
    await expect(page.locator('footer:has-text("Fair Pricing Agency")')).toBeVisible();
    
    // Check transparency promise
    await expect(page.locator('text=Our Transparency Promise')).toBeVisible();
    await expect(page.locator('footer:has-text("Every price published. Every fee explained. Every promise kept.")')).toBeVisible();
  });

  test('mobile responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('/');
    
    // Check mobile navigation button is visible
    await expect(page.locator('[aria-label="Toggle mobile menu"]')).toBeVisible();
    
    // Check hero section on mobile
    await expect(page.locator('main h1, section h1').first()).toBeVisible();
    await expect(page.locator('text=100% Transparent Pricing').first()).toBeVisible();
    
    // Open mobile menu to access navigation
    await page.locator('[aria-label="Toggle mobile menu"]').click();
    
    // Check that mobile menu navigation is accessible
    await expect(page.locator('#mobile-menu a[href="/calculator"]')).toBeVisible();
  });

  test('performance and accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Check that images have alt attributes
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy(); // All images should have alt attributes
    }
    
    // Check that main landmarks exist
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});

test.describe('SEO and Meta Tags', () => {
  test('has proper meta tags for SEO', async ({ page }) => {
    await page.goto('/');
    
    // Check canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
    
    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain('Fearnbell Marketing');
    
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDescription).toContain('transparent pricing');
    
    // Check Twitter Card tags
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');
  });

  test('has structured data', async ({ page }) => {
    await page.goto('/');
    
    // Check for JSON-LD structured data
    const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
    expect(structuredData).toContain('LocalBusiness');
    expect(structuredData).toContain('Fearnbell Marketing');
    expect(structuredData).toContain('London');
  });
});