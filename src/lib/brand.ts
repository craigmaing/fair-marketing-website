// Outcome Digital Marketing Ltd Brand Configuration

export const brand = {
  name: 'Outcome Digital Marketing Ltd',
  shortName: 'Outcome Digital',
  tagline: 'Marketing That Delivers Results',
  valueProposition: 'Transparent pricing, real results, ethical practices',
  
  colors: {
    primary: '#2563eb',    // Vibrant blue - trust, digital, professional
    secondary: '#7c3aed',  // Purple accent - innovation, creativity
    accent: '#06b6d4',     // Cyan - modern, tech-forward
    success: '#10b981',    // Green - results, growth
    warning: '#f59e0b',    // Amber - attention
    neutral: '#6b7280',    // Gray - balance
    dark: '#111827',       // Near black - sophistication
    light: '#f9fafb',      // Off-white - clean
    background: '#ffffff', // Pure white
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      light: '#94a3b8'
    }
  },
  
  typography: {
    heading: 'Poppins, Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    accent: 'Poppins, sans-serif'
  },
  
  messaging: {
    headlines: {
      main: 'Transform Your Digital Presence Into Measurable Business Outcomes',
      sub: 'Strategic Marketing That Delivers Real Results',
      cta: 'Get Your Free Strategy Call'
    },
    
    benefits: [
      'Full Transparency - Public pricing, competitor research included',
      'Research-Driven - Every decision backed by data intelligence',
      'Performance Focus - Lightning-fast websites that convert',
      'Fair Payment Terms - 4-payment structure, no surprises',
      'Ethical Practices - No black-hat SEO, no overcharging',
      'Real Results - Case studies with measurable outcomes'
    ],
    
    services: {
      'website-development': {
        title: 'Website Development',
        description: 'Lightning-fast, SEO-optimized websites that outperform your competitors',
        keywords: ['affordable website development', 'fair pricing web design', 'transparent web development']
      },
      'seo-optimization': {
        title: 'SEO Optimization',
        description: 'Ethical SEO that delivers real rankings without the BS',
        keywords: ['ethical seo services', 'transparent seo pricing', 'competitor seo analysis']
      },
      'competitor-research': {
        title: 'Competitor Research',
        description: 'Deep intelligence on what your competitors are doing and how to beat them',
        keywords: ['competitor analysis', 'market research', 'competitive intelligence']
      },
      'fair-pricing': {
        title: 'Fair Pricing Promise',
        description: 'Transparent pricing with no hidden fees - pay in 4 easy installments',
        keywords: ['transparent pricing marketing', 'fair marketing agency', 'ethical pricing']
      }
    }
  },
  
  contact: {
    email: 'hello@outcomedigital.co.uk',
    phone: '+44 20 1234 5678',
    address: 'London, United Kingdom',
    social: {
      twitter: '@outcomedigital',
      linkedin: 'outcome-digital-marketing',
      github: 'outcome-digital'
    }
  }
}

export const seoDefaults = {
  titleTemplate: '%s | Outcome Digital Marketing',
  defaultTitle: 'Outcome Digital Marketing - Marketing That Delivers Results',
  defaultDescription: 'Transform your digital presence into measurable business outcomes. Transparent pricing, real results, ethical practices.',
  defaultKeywords: [
    'outcome digital marketing',
    'digital marketing agency',
    'transparent pricing marketing',
    'ethical seo services',
    'website development agency',
    'competitor research',
    'affordable marketing',
    'london marketing agency'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Outcome Digital Marketing'
  },
  twitter: {
    handle: '@outcomedigital',
    site: '@outcomedigital',
    cardType: 'summary_large_image'
  }
}