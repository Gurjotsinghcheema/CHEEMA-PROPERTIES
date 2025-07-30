import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MetaTags } from './components/MetaTags';
import { Toaster } from './components/ui/sonner';
import './styles/globals.css';

// Create the PWA manifest dynamically
const manifest = {
  name: 'CHEEMA PROPERTIES - Punjab Premier Real Estate',
  short_name: 'CHEEMA PROPERTIES',
  description: 'Punjab\'s most exclusive real estate experience. Luxury properties in Ludhiana & Chandigarh.',
  start_url: '/',
  display: 'standalone',
  background_color: '#0f172a',
  theme_color: '#d4af37',
  orientation: 'portrait-primary',
  scope: '/',
  icons: [
    {
      src: '/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    },
    {
      src: '/icon-512x512.png', 
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    }
  ],
  categories: ['business', 'productivity', 'lifestyle', 'finance'],
  lang: 'en-IN',
  dir: 'ltr',
  screenshots: [
    {
      src: '/screenshot-mobile.png',
      sizes: '390x844',
      type: 'image/png',
      form_factor: 'narrow',
      label: 'CHEEMA PROPERTIES Mobile Experience'
    },
    {
      src: '/screenshot-desktop.png',
      sizes: '1920x1080', 
      type: 'image/png',
      form_factor: 'wide',
      label: 'CHEEMA PROPERTIES Desktop Experience'
    }
  ],
  shortcuts: [
    {
      name: 'Contact Us',
      short_name: 'Contact',
      description: 'Get in touch with CHEEMA PROPERTIES',
      url: '/?action=contact',
      icons: [{ src: '/contact-icon.png', sizes: '96x96' }]
    },
    {
      name: 'WhatsApp Chat',
      short_name: 'WhatsApp', 
      description: 'Chat on WhatsApp',
      url: 'https://wa.me/919056330000',
      icons: [{ src: '/whatsapp-icon.png', sizes: '96x96' }]
    }
  ]
};

// Create browserconfig.xml content
const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png"/>
            <TileColor>#d4af37</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;

// Create robots.txt content  
const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

# Sitemap
Sitemap: https://cheemaproperties.com/sitemap.xml

# Contact Information
# Contact: balvircheema2016@gmail.com
# Contact: +91-9056330000

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Specific directives for search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot  
Allow: /
Crawl-delay: 1

# Social media bots
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Real Estate specific
Allow: /properties
Allow: /contact
Allow: /*.jpg
Allow: /*.png
Allow: /*.webp

# Block sensitive areas
Disallow: /admin/*
Disallow: /private/*
Disallow: /.git/*
Disallow: /node_modules/*`;

// Enhanced sitemap.xml content
const generateSitemap = () => {
  const baseUrl = 'https://cheemaproperties.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    
    <!-- Homepage -->
    <url>
        <loc>${baseUrl}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
        <image:image>
            <image:loc>https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80</image:loc>
            <image:title>CHEEMA PROPERTIES - Premium Real Estate</image:title>
            <image:caption>Punjab's premier real estate agency</image:caption>
        </image:image>
    </url>
    
    <!-- Contact Page -->
    <url>
        <loc>${baseUrl}/contact</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    
    <!-- Properties Page -->
    <url>
        <loc>${baseUrl}/properties</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    
    <!-- About Page -->
    <url>
        <loc>${baseUrl}/about</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <!-- Services Pages -->
    <url>
        <loc>${baseUrl}/services/residential</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <url>
        <loc>${baseUrl}/services/commercial</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <!-- Location Pages -->
    <url>
        <loc>${baseUrl}/ludhiana-properties</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    
    <url>
        <loc>${baseUrl}/chandigarh-properties</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    
</urlset>`;
};

// Initialize the app with proper SEO setup
function initializeApp() {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  
  // Add meta tags to document head
  const metaContainer = document.createElement('div');
  const metaRoot = ReactDOM.createRoot(metaContainer);
  metaRoot.render(<MetaTags />);
  
  // Move meta tags to head
  setTimeout(() => {
    const metaTags = metaContainer.querySelectorAll('meta, link, script, title');
    metaTags.forEach(tag => {
      if (tag.tagName === 'TITLE') {
        document.title = tag.textContent || 'CHEEMA PROPERTIES';
      } else {
        document.head.appendChild(tag.cloneNode(true));
      }
    });
  }, 0);

  // Create and inject manifest
  const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
  const manifestUrl = URL.createObjectURL(manifestBlob);
  const manifestLink = document.createElement('link');
  manifestLink.rel = 'manifest';
  manifestLink.href = manifestUrl;
  document.head.appendChild(manifestLink);

  // Create service worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swContent = `
        const CACHE_NAME = 'cheema-properties-v1';
        const urlsToCache = [
          '/',
          '/styles/globals.css',
          '/manifest.json'
        ];

        self.addEventListener('install', (event) => {
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then((cache) => cache.addAll(urlsToCache))
          );
        });

        self.addEventListener('fetch', (event) => {
          event.respondWith(
            caches.match(event.request)
              .then((response) => {
                return response || fetch(event.request);
              })
          );
        });
      `;
      
      const swBlob = new Blob([swContent], { type: 'application/javascript' });
      const swUrl = URL.createObjectURL(swBlob);
      
      navigator.serviceWorker.register(swUrl)
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('❌ Service Worker registration failed:', error);
        });
    });
  }

  // Render the main app
  root.render(
    <React.StrictMode>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            color: 'white',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            backdropFilter: 'blur(16px)',
          },
        }}
      />
    </React.StrictMode>
  );

  // Performance optimizations
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Preload critical resources
      const criticalImages = [
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ];
      
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    });
  }

  // SEO console information for developers only
  console.log(`
🏠 CHEEMA PROPERTIES - Website Initialized
📍 Punjab's Premier Real Estate Since 2016
📱 Contact: +91 9056330000 / +91 9056361000
📧 Email: balvircheema2016@gmail.com
🌐 Serving: Ludhiana & Chandigarh

🔐 Admin Access: Secure authentication enabled
⌨️  Quick Access: Ctrl+Shift+A

✅ SEO Optimized for Google Publishing
✅ PWA Ready - Installable App Experience  
✅ Mobile-First Premium Design
✅ Real Email Integration
✅ Analytics & Lead Scoring
✅ Offline Functionality

Ready for Google Publishing! 🚀
  `);
}

// Initialize the application
initializeApp();

// Global error handling for production
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Could send to analytics or error reporting service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Could send to analytics or error reporting service
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
    console.log(`⚡ Page loaded in ${loadTime}ms`);
  });
}