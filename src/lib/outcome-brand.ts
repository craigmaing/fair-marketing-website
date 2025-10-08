// Outcome Digital Marketing Ltd Brand Configuration

export const brand = {
  name: 'Outcome Digital Marketing Ltd',
  shortName: 'Outcome Digital',
  tagline: 'Results-Driven Digital Marketing',
  valueProposition: 'Delivering measurable outcomes through strategic digital marketing',

  colors: {
    // Professional and modern color scheme for Outcome Digital
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
      primary: '#111827',
      secondary: '#4b5563',
      light: '#9ca3af',
      inverse: '#ffffff'
    }
  },

  typography: {
    heading: 'Poppins, Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    accent: 'Poppins, sans-serif'
  },

  logo: {
    text: 'OUTCOME',
    subtitle: 'Digital Marketing Ltd',
    // Logo concept: Modern, clean design with emphasis on results/outcomes
    // Icon could be an upward arrow, target, or growth chart integrated with 'O'
    concepts: [
      {
        name: 'Growth Arrow',
        description: 'Letter O with integrated upward arrow showing growth/positive outcomes',
        colors: ['primary', 'accent']
      },
      {
        name: 'Target Achievement',
        description: 'Circular target with center dot forming the O, representing achieving outcomes',
        colors: ['primary', 'secondary']
      },
      {
        name: 'Digital Flow',
        description: 'Abstract flowing lines forming O shape, representing digital transformation',
        colors: ['primary', 'accent', 'secondary']
      }
    ]
  },

  messaging: {
    headlines: {
      main: 'Transform Your Digital Presence Into Measurable Business Outcomes',
      sub: 'Strategic Marketing That Delivers Real Results',
      cta: 'Get Your Free Strategy Call'
    },

    benefits: [
      'Results-Focused - Every campaign designed for measurable outcomes',
      'Data-Driven Strategy - Decisions backed by analytics and insights',
      'Full-Service Digital - Complete marketing solutions under one roof',
      'Transparent Reporting - Real-time dashboards and clear metrics',
      'ROI Guaranteed - Performance-based partnerships available',
      'Industry Expertise - Specialized knowledge across sectors'
    ],

    services: {
      'digital-strategy': {
        title: 'Digital Strategy',
        description: 'Comprehensive digital roadmaps that align with your business outcomes',
        keywords: ['digital marketing strategy', 'business outcomes', 'strategic planning']
      },
      'web-development': {
        title: 'Web Development',
        description: 'High-performance websites engineered for conversion and growth',
        keywords: ['web development', 'website design', 'conversion optimization']
      },
      'seo-services': {
        title: 'SEO Services',
        description: 'Organic growth strategies that deliver lasting results',
        keywords: ['SEO services', 'search engine optimization', 'organic growth']
      },
      'paid-advertising': {
        title: 'Paid Advertising',
        description: 'ROI-focused campaigns across Google, Meta, and LinkedIn',
        keywords: ['PPC management', 'paid advertising', 'Google Ads', 'Facebook Ads']
      },
      'content-marketing': {
        title: 'Content Marketing',
        description: 'Strategic content that engages audiences and drives conversions',
        keywords: ['content marketing', 'content strategy', 'brand storytelling']
      },
      'analytics-reporting': {
        title: 'Analytics & Reporting',
        description: 'Deep insights and actionable intelligence for continuous improvement',
        keywords: ['marketing analytics', 'data analysis', 'performance reporting']
      }
    }
  },

  contact: {
    email: 'hello@outcomedigital.co.uk',
    phone: '+44 20 1234 5678',
    address: 'London, United Kingdom',
    companyNumber: '12345678', // Update with actual company number
    vatNumber: 'GB123456789', // Update with actual VAT number
    social: {
      twitter: '@outcomedigital',
      linkedin: 'outcome-digital-marketing',
      instagram: '@outcomedigital',
      facebook: 'outcomedigitalmarketing'
    }
  }
}

export const seoDefaults = {
  titleTemplate: '%s | Outcome Digital Marketing',
  defaultTitle: 'Outcome Digital Marketing - Results-Driven Digital Marketing Agency',
  defaultDescription: 'Transform your digital presence into measurable business outcomes. Strategic marketing, web development, SEO, and paid advertising that delivers real results.',
  defaultKeywords: [
    'outcome digital marketing',
    'digital marketing agency',
    'results-driven marketing',
    'business outcomes',
    'digital strategy',
    'web development',
    'SEO services',
    'PPC management',
    'content marketing',
    'marketing analytics',
    'London digital agency',
    'UK marketing agency'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Outcome Digital Marketing',
    image: '/og-image.jpg'
  },
  twitter: {
    handle: '@outcomedigital',
    site: '@outcomedigital',
    cardType: 'summary_large_image'
  }
}

export const companyInfo = {
  legalName: 'Outcome Digital Marketing Ltd',
  registeredAddress: {
    street: '', // Add actual address
    city: 'London',
    postcode: '',
    country: 'United Kingdom'
  },
  registration: {
    companyNumber: '', // Add Companies House number
    vatNumber: '', // Add VAT number if applicable
    incorporationDate: '2024' // Update with actual date
  }
}