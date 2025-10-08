// High-quality image URLs from Unsplash for Fearnbell Marketing website
export const images = {
  hero: {
    home: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop', // Team collaboration
    services: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop', // Marketing analytics
    about: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&h=1080&fit=crop', // Business meeting
    pricing: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&h=1080&fit=crop', // Calculator and planning
    contact: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=1080&fit=crop', // Contact/communication
    blog: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&h=1080&fit=crop', // Laptop and coffee
  },
  services: {
    webDevelopment: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop', // Coding laptop
    seo: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&h=600&fit=crop', // SEO graphs
    competitorResearch: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop', // Data charts
    fairPricing: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop', // Business handshake
    contentMarketing: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', // Team planning
    analytics: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop', // Office team
  },
  features: {
    speed: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop', // Technology/speed
    mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop', // Mobile devices
    search: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=600&h=400&fit=crop', // Search/SEO
    results: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop', // Success graphs
    team: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop', // Professional team
    support: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop', // Customer support
  },
  testimonials: {
    avatar1: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces', // Male professional
    avatar2: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces', // Female professional
    avatar3: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces', // Male professional 2
    avatar4: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces', // Female professional 2
  },
  blog: {
    seo: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=450&fit=crop', // SEO/marketing
    webDev: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=450&fit=crop', // Web development
    marketing: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=450&fit=crop', // Marketing strategy
    business: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop', // Business planning
  },
  icons: {
    logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop', // Abstract logo shape
  }
};

// Helper function to preload critical images
export const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};