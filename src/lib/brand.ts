// Fearnbell Marketing Brand Configuration

export const brand = {
  name: 'Fair Marketing',
  tagline: 'Fair Marketing That Actually Works',
  valueProposition: 'Transparent pricing, real results, ethical practices',
  
  colors: {
    primary: '#1e3a8a',    // Trust blue
    secondary: '#3b82f6',  // Bright blue  
    accent: '#10b981',     // Success green
    warning: '#f59e0b',    // Transparency amber
    neutral: '#64748b',    // Professional gray
    background: '#f8fafc', // Off-white
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      light: '#94a3b8'
    }
  },
  
  typography: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    accent: 'Montserrat, sans-serif'
  },
  
  messaging: {
    headlines: {
      main: 'The Only Marketing Agency That Shows You Exactly How We\'ll Beat Your Competitors',
      sub: 'And Charges Fairly For It',
      cta: 'Start Your Project Today'
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
    email: 'hello@fairmarketing.com',
    phone: '+44 20 1234 5678',
    address: 'London, United Kingdom',
    social: {
      twitter: '@fairmarketinguk',
      linkedin: 'fair-marketing',
      github: 'fair-marketing'
    }
  }
}

export const seoDefaults = {
  titleTemplate: '%s | Fair Marketing',
  defaultTitle: 'Fair Marketing - Fair Marketing That Actually Works',
  defaultDescription: 'The only marketing agency that shows you exactly how we\'ll beat your competitors - and charges fairly for it. Transparent pricing, real results, ethical practices.',
  defaultKeywords: [
    'fair marketing',
    'fair marketing agency',
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
    siteName: 'Fair Marketing'
  },
  twitter: {
    handle: '@fairmarketinguk',
    site: '@fairmarketinguk',
    cardType: 'summary_large_image'
  }
}