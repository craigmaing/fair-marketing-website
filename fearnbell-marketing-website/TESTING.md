# Playwright Testing Guide for Fearnbell Marketing

## 🎭 **PLAYWRIGHT TESTING SETUP COMPLETE**

Playwright is now installed and configured for comprehensive testing of the Fearnbell Marketing website.

---

## **🚀 RUNNING TESTS**

### **Basic Test Commands**
```bash
# Run all tests in headless mode
npm test

# Run tests with browser visible (headed mode)
npm run test:headed

# Run tests with interactive UI
npm run test:ui

# Show test report after running
npm run test:report
```

### **Playwright CLI Commands**
```bash
# Run specific test file
npx playwright test tests/homepage.spec.js

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests with debug mode
npx playwright test --debug

# Generate test code interactively
npx playwright codegen localhost:4321
```

---

## **📋 TEST COVERAGE**

### **Homepage Tests (`tests/homepage.spec.js`)**
- ✅ **SEO & Meta Tags** - Title, description, canonical URLs
- ✅ **Logo & Navigation** - Header elements and links
- ✅ **Hero Section** - Key messaging and CTAs
- ✅ **Services Section** - Transparent pricing display
- ✅ **Calculator Visibility** - Interactive elements present
- ✅ **Transparency Section** - Differentiator messaging
- ✅ **Testimonials** - Social proof elements
- ✅ **Footer** - Complete information and branding
- ✅ **Mobile Responsiveness** - Mobile viewport testing
- ✅ **Accessibility** - Alt tags and semantic structure
- ✅ **Structured Data** - JSON-LD schema markup

### **Pricing Calculator Tests (`tests/pricing-calculator.spec.js`)**
- ✅ **Initial Values** - Default pricing and payment breakdown
- ✅ **Service Type Changes** - Starter/Business/Premium/Custom pricing
- ✅ **Page Slider** - Dynamic page count and pricing adjustments
- ✅ **SEO Options** - Basic/Advanced/Premium SEO pricing
- ✅ **Additional Services** - Checkbox functionality and pricing
- ✅ **Payment Breakdown** - 4-payment calculation accuracy
- ✅ **Complex Calculations** - Multiple option combinations
- ✅ **Feature Updates** - Dynamic included features list
- ✅ **Mobile Functionality** - Calculator works on mobile devices
- ✅ **CTA Buttons** - Quote button functionality

---

## **🎯 TEST CONFIGURATION**

### **Browser Coverage**
- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: Chrome (Pixel 5), Safari (iPhone 12)

### **Test Environment**
- **Base URL**: `http://localhost:4321`
- **Dev Server**: Auto-starts before tests
- **Retries**: 2 retries on CI, 0 locally
- **Parallel**: Full parallel execution
- **Trace**: On first retry for debugging

---

## **🔧 DEBUGGING TESTS**

### **Debug Failed Tests**
```bash
# Run with debug mode
npx playwright test --debug

# Run specific test with debug
npx playwright test tests/homepage.spec.js --debug

# Show trace for failed tests
npx playwright show-trace
```

### **Visual Testing**
```bash
# Update screenshots (if using visual regression)
npx playwright test --update-snapshots

# Compare visual differences
npx playwright test --reporter=html
```

---

## **📊 TEST SCENARIOS COVERED**

### **Core Functionality**
1. **Homepage Loading** - All sections render correctly
2. **Navigation** - Links work and are accessible
3. **Pricing Calculator** - Interactive calculations are accurate
4. **Responsive Design** - Mobile and desktop layouts
5. **SEO Elements** - Meta tags, structured data, accessibility

### **Business Logic**
1. **Transparent Pricing** - All prices display correctly
2. **Payment Calculations** - 4-payment breakdown is accurate
3. **Service Combinations** - Complex pricing scenarios work
4. **Trust Elements** - Transparency messaging is prominent

### **User Experience**
1. **Mobile Usability** - Touch-friendly interactions
2. **Loading Performance** - Pages load quickly
3. **Visual Hierarchy** - Content is properly structured
4. **Call-to-Actions** - CTAs are visible and functional

---

## **🚦 CONTINUOUS INTEGRATION**

### **CI/CD Integration**
```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npm test
```

### **Pre-deployment Testing**
```bash
# Build and test production version
npm run build
npm run preview &
npx playwright test --config=playwright.prod.config.js
```

---

## **📈 TEST REPORTING**

### **HTML Report**
- Comprehensive test results with screenshots
- Failed test traces and debugging info
- Browser coverage summary
- Performance metrics

### **Test Artifacts**
- Screenshots of failed tests
- Video recordings of test runs
- Network activity logs
- Console output capture

---

## **🎪 ADVANCED TESTING**

### **Visual Regression Testing**
```bash
# Add to tests for visual comparison
await expect(page).toHaveScreenshot('homepage.png');
```

### **Performance Testing**
```bash
# Add performance assertions
const response = await page.goto('/');
expect(response.status()).toBe(200);
```

### **Accessibility Testing**
```bash
# Test with axe-core (requires additional setup)
await page.goto('/');
const results = await page.accessibility.snapshot();
```

---

## **✅ READY FOR AUTOMATED TESTING**

The Fearnbell Marketing website now has comprehensive test coverage ensuring:

- **Functionality**: All interactive elements work correctly
- **Accuracy**: Pricing calculations are mathematically correct  
- **Responsiveness**: Mobile and desktop experiences are tested
- **SEO**: Meta tags and structured data are validated
- **Accessibility**: Basic accessibility standards are checked
- **Brand Consistency**: Key messaging and elements are verified

Run `npm test` to validate the entire website before deployment to Netlify!