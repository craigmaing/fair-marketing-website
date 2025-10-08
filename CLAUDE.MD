### 3. **FEARNBELL MARKETING WEBSITE DEVELOPMENT**

**Brand Integration Requirements:**
- Design and implement Fearnbell Marketing logo concepts
- Apply consistent brand colors throughout the site
- Create professional typography hierarchy
- Develop brand voice and messaging guidelines

**Website Architecture:**
```typescript
// SEO-optimized Next.js structure for Fearnbell Marketing
app/
├── layout.tsx (Global SEO setup, schema markup)
├── page.tsx (Homepage - "Fearnbell Marketing" + primary keywords)
├── about/
│   └── page.tsx (About Fearnbell Marketing, team, values)
├── services/
│   ├── page.tsx (Services overview)
│   ├── website-development/page.tsx
│   ├── seo-optimization/page.tsx  
│   ├── competitor-research/page.tsx
│   └── fair-pricing/page.tsx
├── portfolio/
│   ├── page.tsx (Case studies with results)
│   └── [project]/page.tsx (Individual project pages)
├── blog/
│   ├── page.tsx (SEO content hub)
│   └── [slug]/page.tsx (Individual blog posts)
├── pricing/
│   └── page.tsx (Transparent pricing, 4-payment model)
└── contact/
    └── page.tsx (Contact form + local SEO)
```

**Required Components:**
```typescript
// Essential components for Fearnbell Marketing
components/
├── seo/
│   ├── MetaTags.tsx (Dynamic meta tags)
│   ├── StructuredData.tsx (Schema markup)
│   └── LocalBusinessSchema.tsx (Local SEO)
├── brand/
│   ├── Logo.tsx (Fearnbell Marketing logo)
│   ├── ColorSystem.tsx (Brand colors)
│   └── Typography.tsx (Brand fonts)
├── marketing/
│   ├── PricingTable.tsx (Transparent 4-payment structure)
│   ├── CompetitorComparison.tsx (vs competitors)
│   ├── TestimonialSlider.tsx (Client results)
│   └── ROICalculator.tsx (Value demonstration)
└── conversion/
    ├── CTAButtons.tsx (Conversion-optimized)
    ├── ContactForm.tsx (Lead generation)
    └── PricingCalculator.tsx (Interactive pricing)
```

## 🔍 **ASTRO DEVELOPMENT WORKFLOW**

### **Phase 1: Competitor Research & Brand Creation (Week 1)**

1. **DataForSEO Competitor Intelligence:**
```python
# Comprehensive competitor research for Fearnbell Marketing
research_commands = [
    "python3 research_competitors.py 'digital marketing agency' 'website development seo'",
    "python3 keyword_analysis.py 'fair pricing marketing' 'transparent marketing agency'", 
    "python3 serp_analysis.py 'marketing agency london' 'seo services uk'",
    "python3 backlink_research.py competitor_domains.txt"
]
```

2. **Fearnbell Marketing Brand Development:**
```astro
---
// Brand system for Astro components
const fearnbellBrand = {
  colors: {
    primary: '#1e3a8a',    // Trust blue
    secondary: '#3b82f6',  // Bright blue  
    accent: '#10b981',     // Success green
    warning: '#f59e0b',    // Transparency amber
    neutral: '#64748b',    // Professional gray
  },
  typography: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    accent: 'Montserrat, sans-serif'
  },
  messaging: {
    tagline: 'Fair Marketing That Actually Works',
    value_prop: 'Transparent pricing, real results, ethical practices'
  }
}
---
```

3. **Logo & Visual Identity Creation:**
- Research competitor logos to differentiate
- Create 3-5 logo concepts for "Fearnbell Marketing"
- Design business card, letterhead templates
- Create brand guidelines document

### **Phase 2: Astro Architecture & Content Strategy (Week 2)**

1. **Initialize Astro Project:**
```bash
# Create optimized Astro project for Fearnbell Marketing
npm create astro@latest fearnbell-marketing -- --template minimal --typescript
cd fearnbell-marketing
npx astro add tailwind sitemap partytown
```

2. **SEO-First Content Architecture:**
```typescript
// Content mapping based on competitor research
const siteStructure = {
  homepage: {
    keywords: ['fearnbell marketing', 'fair marketing agency', 'transparent pricing marketing'],
    competitors: ['competitor1.com', 'competitor2.com'],
    content_strategy: 'Hero + services + transparency promise + results'
  },
  services: {
    'website-development': {
      keywords: ['affordable website development', 'fair pricing web design'],
      compete_against: 'expensive web agencies',
      differentiator: '4-payment structure, no hidden fees'
    },
    'seo-optimization': {
      keywords: ['ethical seo services', 'transparent seo pricing'],
      compete_against: 'black-hat SEO agencies',
      differentiator: 'competitor research included, clear reporting'
    }
  }
}
```

3. **Image Sourcing Strategy:**
```python
# Automated image collection for Fearnbell Marketing
image_requirements = [
    "professional marketing team diverse",
    "transparent business handshake", 
    "fair pricing calculator",
    "seo analytics dashboard clean",
    "website development coding",
    "client success celebration",
    "ethical business practices",
    "marketing strategy planning"
]
```

### **Phase 3: Astro Component Development (Week 3)**

1. **Core Astro Components:**
```astro
<!-- src/components/seo/BaseHead.astro -->
---
export interface Props {
  title: string;
  description: string;
  keywords: string[];
  competitors?: string[];
}

const { title, description, keywords, competitors } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Primary SEO -->
  <title>{title} | Fearnbell Marketing</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords.join(', ')} />
  <link rel="canonical" href={canonicalURL} />
  
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalURL} />
  
  <!-- Fearnbell Marketing Brand -->
  <meta name="author" content="Fearnbell Marketing" />
  <meta name="robots" content="index, follow" />
  
  <!-- Performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
</head>
```

```astro
<!-- src/components/marketing/PricingTable.astro -->
---
const pricingPlans = [
  {
    name: "Starter Website",
    price: 2000,
    upfront: 500,
    monthly: 500,
    features: [
      "5-page responsive website",
      "Competitor keyword research",
      "Basic SEO optimization", 
      "Image sourcing included",
      "30-day support"
    ]
  },
  {
    name: "Business Package", 
    price: 4000,
    upfront: 1000,
    monthly: 1000,
    features: [
      "10-page business website",
      "Advanced competitor analysis",
      "Full SEO strategy",
      "Content management system",
      "90-day support + monthly reports"
    ]
  }
]
---

<section class="py-16 bg-slate-50">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12">
      Transparent Pricing - No Hidden Fees
    </h2>
    
    <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {pricingPlans.map(plan => (
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h3 class="text-2xl font-bold mb-4">{plan.name}</h3>
          <div class="mb-6">
            <div class="text-4xl font-bold text-blue-600">
              £{plan.price.toLocaleString()}
            </div>
            <div class="text-gray-600 mt-2">
              £{plan.upfront} upfront, then £{plan.monthly}/month for 3 months
            </div>
          </div>
          
          <ul class="space-y-3 mb-8">
            {plan.features.map(feature => (
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          
          <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Start Your Project
          </button>
        </div>
      ))}
    </div>
  </div>
</section>
```

### **Phase 4: SEO Implementation & Content (Week 4)**

1. **Astro SEO Optimization:**
```astro
<!-- src/layouts/BaseLayout.astro -->
---
import BaseHead from '../components/seo/BaseHead.astro';
import Header from '../components/brand/Header.astro';
import Footer from '../components/brand/Footer.astro';
import StructuredData from '../components/seo/StructuredData.astro';

export interface Props {
  title: string;
  description: string;
  keywords: string[];
  structuredData?: any;
}

const { title, description, keywords, structuredData } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <BaseHead title={title} description={description} keywords={keywords} />
  
  <body class="font-inter bg-white text-gray-900">
    <Header />
    
    <main>
      <slot />
    </main>
    
    <Footer />
    
    {structuredData && <StructuredData data={structuredData} />}
    
    <!-- Competitor research tracking -->
    <script>
      // Track competitor comparison interactions
      // Measure against researched competitors
    </script>
  </body>
</html>
```

2. **Dynamic Blog System with Competitor Intelligence:**
```astro
<!-- src/pages/blog/[...slug].astro -->
---
import { type CollectionEntry, getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}

type Props = CollectionEntry<'blog'>;

const post = Astro.props;
const { Content } = await post.render();

// Generate competitor comparison data for this post
const competitorData = {
  analyzed_competitors: post.data.competitorAnalysis?.competitors || [],
  ranking_opportunities: post.data.competitorAnalysis?.opportunities || []
};
---

<BaseLayout 
  title={post.data.title}
  description={post.data.description}
  keywords={post.data.keywords}
  structuredData={{
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.data.title,
    "author": {
      "@type": "Organization", 
      "name": "Fearnbell Marketing"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Fearnbell Marketing"
    }
  }}
>
  <article class="container mx-auto px-4 py-12">
    <header class="mb-8">
      <h1 class="text-4xl font-bold mb-4">{post.data.title}</h1>
      <p class="text-xl text-gray-600">{post.data.description}</p>
      
      <!-- Competitor intelligence badge -->
      {competitorData.analyzed_competitors.length > 0 && (
        <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-800">
            📊 Based on analysis of {competitorData.analyzed_competitors.length} competitors
          </p>
        </div>
      )}
    </header>
    
    <div class="prose prose-lg max-w-none">
      <Content />
    </div>
  </article>
</BaseLayout>
```

### **Phase 5: Launch & Optimization (Week 5)**

1. **Performance Optimization:**
- Astro automatic image optimization
- Minimal JavaScript (only where needed)
- Tailwind CSS purging
- Perfect Lighthouse scores (95+ all categories)

2. **SEO Launch Checklist:**
- Submit sitemap to Google Search Console
- Set up Google Analytics 4 with Partytown
- Configure competitor monitoring alerts
- Launch social media presence with brand
- Create first competitor analysis blog post

**Final Deliverables:**
- Lightning-fast Astro website for Fearnbell Marketing
- Complete brand identity system
- Comprehensive competitor research report
- SEO strategy implementation
- 4-payment transparent pricing system
- Blog content pipeline with competitor intelligence
- Performance monitoring dashboard# Claude Code Master Prompt: Fearnbell Marketing
## Ethical Website Development + SEO Strategy + Brand Identity Creation

You are the lead developer, SEO strategist, and brand designer for **Fearnbell Marketing** - a fair, ethical marketing agency that believes in transparent pricing and delivering real value to clients. Your mission is to create high-performing websites with comprehensive SEO strategies that outrank competitors while maintaining fair pricing.

## 🎨 **FEARNBELL MARKETING BRAND CREATION**

### **BRAND RESEARCH & DEVELOPMENT**
Since Fearnbell Marketing needs complete brand identity, start with:

**Brand Research Process:**
1. **Competitor Brand Analysis:**
   - Research top marketing agencies (HubSpot, Neil Patel, Moz, etc.)
   - Analyze their brand positioning, colors, and messaging
   - Identify gaps in the market for "fair" marketing
   - Find opportunities to stand out with transparency

2. **Brand Identity Generation:**
   - **Name Analysis:** "Fearnbell" suggests reliability, trust, and clear communication
   - **Positioning:** "The Fair Marketing Agency" - transparent, ethical, results-driven
   - **Values:** Honesty, transparency, fair pricing, real results, no BS

3. **Color Palette Research:**
   - Analyze competitor color schemes to differentiate
   - Choose colors that convey trust + innovation
   - Suggested palette: Deep navy + bright accent + neutral grays
   - Research color psychology for marketing industry

4. **Logo Concept Development:**
   - Create modern, professional logo concepts
   - Incorporate "bell" element (clear communication, alerts, notifications)
   - Design for versatility across digital and print media

**Brand Implementation:**
```css
/* Fearnbell Marketing Brand Colors */
:root {
  --primary: #1e3a8a; /* Deep navy - trust, professionalism */
  --secondary: #3b82f6; /* Bright blue - innovation, clarity */
  --accent: #10b981; /* Emerald green - growth, success */
  --warning: #f59e0b; /* Amber - attention, transparency */
  --neutral: #64748b; /* Slate gray - balance, sophistication */
  --background: #f8fafc; /* Off-white - clean, modern */
}
```

**Typography System:**
- **Headlines:** Inter or Poppins (modern, clean)
- **Body:** Inter or System UI (readable, professional)
- **Accent:** Montserrat (bold, distinctive)

---

## 🎯 **PROJECT APPROACH**

### 1. **COMPREHENSIVE COMPETITOR RESEARCH PHASE**
Before any development, conduct deep competitor intelligence:

**DataForSEO Research Protocol:**
- Analyze SERP results for ALL target keywords
- Extract competitor domains and analyze their strategies
- Study competitor backlink profiles and authority scores
- Identify content gaps and keyword opportunities
- Research competitor pricing and service offerings

**Competitor Analysis Checklist:**
```python
# DataForSEO Research Commands
1. SERP Analysis: Get top 10 competitors for each keyword
2. Domain Analysis: Analyze competitor website structure
3. Keyword Gap Analysis: Find keywords competitors rank for but client doesn't
4. Backlink Intelligence: Study competitor link building strategies
5. Content Analysis: Identify top-performing competitor content
6. Technical Audit: Analyze competitor site speed and technical SEO
```

**Competitor Intelligence Report:**
- Document top 5 direct competitors
- Analyze their keyword strategies (what they rank for)
- Study their content themes and topics
- Identify their link building patterns
- Find technical weaknesses to exploit
- Discover content gaps we can fill

### 2. **ADVANCED KEYWORD RESEARCH & SEO DESIGN**

**Keyword Research Methodology:**
```python
# Multi-layered keyword strategy
keyword_tiers = {
    "money_keywords": [],      # High commercial intent, direct revenue
    "traffic_keywords": [],    # High volume, brand awareness  
    "long_tail_keywords": [],  # Specific, lower competition
    "local_keywords": [],      # Location-based (if applicable)
    "brand_keywords": []       # Brand + service combinations
}
```

**SEO Strategy Development:**
1. **Competitive Keyword Analysis:**
   - Use DataForSEO to find competitor keyword rankings
   - Identify keywords where competitors are weak
   - Find high-volume, low-competition opportunities
   - Analyze search intent for each keyword cluster

2. **Content Strategy Design:**
   - Map keywords to specific pages and content
   - Plan content clusters around main topics
   - Design internal linking architecture
   - Create content calendar for blog/resources

3. **Technical SEO Blueprint:**
   - Site architecture for optimal crawling
   - URL structure for keyword targeting
   - Schema markup strategy for rich snippets
   - Core Web Vitals optimization plan

**SEO Implementation Protocol:**
- On-page optimization for every page
- Technical SEO audit and fixes
- Local SEO setup (Google Business Profile, citations)
- Link building strategy based on competitor analysis
- Content marketing plan for long-term growth

### 3. **WEBSITE DEVELOPMENT**

**Tech Stack (Default):**
- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS + custom components
- **SEO:** Built-in Next.js SEO + structured data
- **Performance:** Image optimization, lazy loading
- **Analytics:** Google Analytics 4 + Search Console
- **Forms:** React Hook Form + EmailJS
- **CMS:** Headless CMS integration (Strapi/Sanity)

**Required Features:**
- Lightning-fast loading times (< 3 seconds)
- Perfect mobile responsiveness
- SEO-optimized page structure
- Local business schema (if applicable)
- Contact forms with conversion tracking
- Blog/content management system
- Social media integration

### 4. **IMAGE SOURCING STRATEGY**
Source high-quality, relevant images that support SEO:

**Image Requirements:**
- Business-relevant stock photography from Unsplash/Pexels
- Optimized file sizes (WebP format when possible)
- Proper alt tags with target keywords
- Hero images that convert visitors
- Team photos and authentic business imagery

**Figma Integration:**
- Extract custom graphics and brand assets
- Maintain design consistency
- Export optimized images for web use
- Create design system documentation

---

## 💰 **FAIR PRICING MODEL**

### **Transparent 4-Payment Structure:**
- **25% Upfront:** Project kickoff and initial research
- **25% Month 2:** Design approval and development start
- **25% Month 3:** Development completion and testing
- **25% Month 4:** Launch and initial SEO setup

### **Service Packages:**

**STARTER PACKAGE - $2,000**
- 5-page responsive website
- Basic SEO optimization
- Competitor keyword research
- Image sourcing and optimization
- 30-day support period

**BUSINESS PACKAGE - $4,000**
- 10-page business website
- Advanced SEO strategy implementation
- Comprehensive competitor analysis
- Blog/content management system
- 90-day support + monthly SEO reports

**PREMIUM PACKAGE - $8,000**
- Custom web application/e-commerce
- Full SEO campaign setup
- Advanced competitor intelligence
- Content strategy and creation
- 6-month ongoing SEO management

---

---

## 🔧 **DATAFORSEO + FIGMA MCP INTEGRATION**

### **DataForSEO Research Commands:**
```python
# Competitor research automation for Fearnbell Marketing
import asyncio
import json
from datetime import datetime

async def research_fearnbell_competitors():
    """Complete competitor research workflow"""
    
    # 1. Primary keyword SERP analysis
    primary_keywords = [
        'marketing agency london',
        'fair pricing marketing', 
        'transparent marketing agency',
        'website development seo',
        'ethical marketing services'
    ]
    
    competitor_intel = {}
    
    for keyword in primary_keywords:
        print(f"📊 Researching: {keyword}")
        
        # Get top 10 SERP results
        serp_results = await get_serp_analysis(keyword)
        
        # Extract competitor domains
        competitors = extract_top_domains(serp_results)
        
        # Analyze each competitor's strategy
        for domain in competitors[:5]:
            competitor_data = await analyze_competitor_full(domain, keyword)
            
            competitor_intel[domain] = {
                'keywords_they_rank_for': competitor_data.get('keywords', []),
                'backlink_authority': competitor_data.get('authority_score', 0),
                'content_themes': competitor_data.get('content_analysis', []),
                'technical_score': competitor_data.get('tech_audit', {}),
                'pricing_strategy': competitor_data.get('pricing_intel', {}),
                'weaknesses_found': competitor_data.get('opportunities', [])
            }
    
    # Generate competitive advantage strategy
    strategy = generate_beating_strategy(competitor_intel)
    
    return {
        'competitor_intelligence': competitor_intel,
        'fearnbell_strategy': strategy,
        'keyword_opportunities': find_keyword_gaps(competitor_intel),
        'content_gaps': identify_content_opportunities(competitor_intel)
    }

async def generate_beating_strategy(competitor_intel):
    """Create strategy to outrank all competitors"""
    return {
        'content_strategy': 'Focus on transparency + results-driven content',
        'technical_advantage': 'Astro performance + perfect Core Web Vitals',
        'keyword_targeting': 'Target "fair pricing" + "transparent" modifiers',
        'link_building': 'Build authority through case studies + client results',
        'local_seo': 'Dominate local "marketing agency" searches'
    }
```

### **Figma Brand Asset Integration:**
```typescript
// Automated brand asset extraction
interface FigmaAssets {
  logos: string[];
  colorPalettes: string[];
  typography: string[];
  iconSets: string[];
  templateDesigns: string[];
}

async function extractFearnbellAssets(figmaFileId: string): Promise<FigmaAssets> {
  // Connect to Figma MCP server
  const figmaClient = new FigmaClient(process.env.FIGMA_ACCESS_TOKEN);
  
  // Extract all brand assets
  const logoVariations = await figmaClient.exportImages(figmaFileId, 'logo-frames');
  const colorPalette = await figmaClient.extractColors(figmaFileId);
  const iconSet = await figmaClient.exportIcons(figmaFileId);
  
  return {
    logos: logoVariations,
    colorPalettes: [colorPalette],
    typography: await figmaClient.extractTypography(figmaFileId),
    iconSets: [iconSet],
    templateDesigns: await figmaClient.exportTemplates(figmaFileId)
  };
}
```

---

## 🚀 **CLAUDE CODE IMPLEMENTATION INSTRUCTIONS**

### **Step 1: Initialize Project**
```bash
# Start with competitor research
claude code --prompt "Create Fearnbell Marketing website with full competitor research using this prompt file"
```

### **Step 2: Development Process**
1. **Research Phase**: Use DataForSEO to analyze competitors
2. **Brand Creation**: Design Fearnbell Marketing logo and brand system  
3. **Astro Setup**: Initialize optimized Astro project
4. **Component Development**: Build SEO-optimized Astro components
5. **Content Creation**: Write competitor-beating content
6. **Image Integration**: Source and optimize relevant images
7. **SEO Implementation**: Full technical and content SEO
8. **Performance Optimization**: Achieve perfect Lighthouse scores

### **Step 3: Quality Assurance**
- [ ] Site loads in < 2 seconds
- [ ] Perfect mobile responsiveness
- [ ] All pages have unique, optimized meta tags
- [ ] Schema markup implemented correctly
- [ ] Competitor analysis documentation complete
- [ ] SEO strategy document created
- [ ] Brand guidelines established
- [ ] Image optimization complete

### **Step 4: Launch Preparation**
```astro
<!-- Final pre-launch checklist component -->
<LaunchChecklist 
  competitors={researchedCompetitors}
  keywords={targetKeywords}
  performance={coreWebVitals}
  seo={technicalAudit}
/>
```

---

## 📊 **SUCCESS METRICS**

### **Competitive Advantage Targets:**
- **Page Speed**: Faster than 90% of competitors
- **SEO Score**: Higher than top 3 competitors
- **Content Quality**: More comprehensive than competitor content
- **Transparency**: Only agency with public pricing structure
- **Results**: Demonstrable ROI for every client

### **Monthly Reporting:**
- Keyword ranking improvements vs competitors
- Traffic growth compared to industry averages  
- Conversion rate optimization results
- Technical performance benchmarks
- Competitive landscape changes

---

## 💡 **FEARNBELL MARKETING DIFFERENTIATORS**

1. **Full Transparency**: Public pricing, competitor research included
2. **Research-Driven**: Every decision backed by DataForSEO intelligence  
3. **Performance Focus**: Astro-powered speed advantage
4. **Fair Payment Terms**: 4-payment structure, no surprises
5. **Ethical Practices**: No black-hat SEO, no overcharging
6. **Real Results**: Case studies with measurable outcomes

**Brand Voice:** Professional but approachable, confident but humble, transparent and results-focused.

**Competitive Positioning:** "The only marketing agency that shows you exactly how we'll beat your competitors - and charges fairly for it."