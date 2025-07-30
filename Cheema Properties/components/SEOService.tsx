import React, { useEffect } from 'react';
import { useGoogleAnalytics } from './GoogleAnalytics';

// SEO metadata interface
interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: any;
}

// Property-specific SEO data
interface PropertySEO {
  propertyId: string;
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  images: string[];
}

export class SEOService {
  private static instance: SEOService;

  private constructor() {}

  public static getInstance(): SEOService {
    if (!SEOService.instance) {
      SEOService.instance = new SEOService();
    }
    return SEOService.instance;
  }

  // Set page metadata
  public setPageSEO(seoData: SEOData): void {
    // Update document title
    document.title = seoData.title;

    // Update or create meta tags
    this.updateMetaTag('description', seoData.description);
    this.updateMetaTag('keywords', seoData.keywords.join(', '));

    // Open Graph tags
    this.updateMetaTag('og:title', seoData.ogTitle || seoData.title, 'property');
    this.updateMetaTag('og:description', seoData.ogDescription || seoData.description, 'property');
    this.updateMetaTag('og:type', seoData.ogType || 'website', 'property');
    this.updateMetaTag('og:url', seoData.canonicalUrl || window.location.href, 'property');
    
    if (seoData.ogImage) {
      this.updateMetaTag('og:image', seoData.ogImage, 'property');
      this.updateMetaTag('og:image:width', '1200', 'property');
      this.updateMetaTag('og:image:height', '630', 'property');
    }

    // Twitter Card tags
    this.updateMetaTag('twitter:card', seoData.twitterCard || 'summary_large_image', 'name');
    this.updateMetaTag('twitter:title', seoData.twitterTitle || seoData.title, 'name');
    this.updateMetaTag('twitter:description', seoData.twitterDescription || seoData.description, 'name');
    
    if (seoData.twitterImage) {
      this.updateMetaTag('twitter:image', seoData.twitterImage, 'name');
    }

    // Canonical URL
    if (seoData.canonicalUrl) {
      this.updateLinkTag('canonical', seoData.canonicalUrl);
    }

    // Structured data
    if (seoData.structuredData) {
      this.updateStructuredData(seoData.structuredData);
    }

    console.log('🔍 SEO metadata updated for:', seoData.title);
  }

  // Update or create meta tag
  private updateMetaTag(name: string, content: string, attribute: string = 'name'): void {
    let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  }

  // Update or create link tag
  private updateLinkTag(rel: string, href: string): void {
    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    
    element.setAttribute('href', href);
  }

  // Update structured data
  private updateStructuredData(data: any): void {
    let element = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    
    if (!element) {
      element = document.createElement('script');
      element.setAttribute('type', 'application/ld+json');
      document.head.appendChild(element);
    }
    
    element.textContent = JSON.stringify(data);
  }

  // Generate homepage SEO
  public setHomepageSEO(): void {
    const seoData: SEOData = {
      title: 'CHEEMA PROPERTIES - Premier Real Estate in Punjab | Ludhiana & Chandigarh Properties',
      description: 'Find your dream property in Punjab with CHEEMA PROPERTIES. Premium apartments, houses, villas and commercial properties in Ludhiana and Chandigarh. Trusted since 2016.',
      keywords: [
        'real estate Punjab',
        'properties Ludhiana',
        'properties Chandigarh',
        'apartments Ludhiana',
        'houses Chandigarh',
        'CHEEMA PROPERTIES',
        'real estate agent Punjab',
        'property dealer Ludhiana',
        'buy property Chandigarh',
        'rent property Punjab'
      ],
      ogTitle: 'CHEEMA PROPERTIES - Punjab\'s Premier Real Estate',
      ogDescription: 'Discover premium properties in Ludhiana & Chandigarh. Expert real estate services since 2016.',
      ogType: 'website',
      ogImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        name: 'CHEEMA PROPERTIES',
        description: 'Premier real estate services in Punjab',
        url: window.location.origin,
        telephone: ['+91-9056330000', '+91-9056361000'],
        email: 'balvircheema2016@gmail.com',
        address: {
          '@type': 'PostalAddress',
          addressRegion: 'Punjab',
          addressCountry: 'IN'
        },
        areaServed: ['Ludhiana', 'Chandigarh'],
        foundingDate: '2016',
        sameAs: [
          'https://wa.me/919056330000',
          'https://wa.me/919056361000'
        ]
      }
    };

    this.setPageSEO(seoData);
  }

  // Generate property listing SEO
  public setPropertyListingSEO(filters: any): void {
    const city = filters.city || 'Punjab';
    const type = filters.type || 'Properties';
    
    const seoData: SEOData = {
      title: `${type} in ${city} - CHEEMA PROPERTIES | Best Real Estate Deals`,
      description: `Browse premium ${type.toLowerCase()} in ${city}. Find your perfect property with CHEEMA PROPERTIES. Expert guidance, verified properties, competitive prices.`,
      keywords: [
        `${type.toLowerCase()} ${city}`,
        `buy ${type.toLowerCase()} ${city}`,
        `rent ${type.toLowerCase()} ${city}`,
        `real estate ${city}`,
        'CHEEMA PROPERTIES',
        'property dealer',
        'verified properties'
      ],
      ogTitle: `${type} in ${city} - Premium Real Estate`,
      ogDescription: `Discover the best ${type.toLowerCase()} in ${city} with CHEEMA PROPERTIES`,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${type} in ${city}`,
        description: `Premium ${type.toLowerCase()} available in ${city}`,
        provider: {
          '@type': 'RealEstateAgent',
          name: 'CHEEMA PROPERTIES'
        }
      }
    };

    this.setPageSEO(seoData);
  }

  // Generate individual property SEO
  public setPropertySEO(property: PropertySEO): void {
    const priceText = this.formatPrice(property.price);
    
    const seoData: SEOData = {
      title: `${property.title} - ${priceText} | CHEEMA PROPERTIES`,
      description: `${property.description} Located in ${property.location}. ${property.area} sq ft ${property.propertyType.toLowerCase()}${property.bedrooms ? ` with ${property.bedrooms} bedrooms` : ''}. Contact CHEEMA PROPERTIES for viewing.`,
      keywords: [
        property.title,
        property.location,
        property.propertyType,
        `${property.bedrooms}BHK`,
        'CHEEMA PROPERTIES',
        `property ${property.location}`,
        `${property.propertyType} ${property.location}`
      ],
      ogTitle: property.title,
      ogDescription: `${property.propertyType} in ${property.location} - ${priceText}`,
      ogType: 'article',
      ogImage: property.images[0],
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: property.title,
        description: property.description,
        url: `${window.location.origin}/property/${property.propertyId}`,
        image: property.images,
        offers: {
          '@type': 'Offer',
          price: property.price,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock'
        },
        floorSize: {
          '@type': 'QuantitativeValue',
          value: property.area,
          unitText: 'SQF'
        },
        numberOfRooms: property.bedrooms,
        numberOfBathroomsTotal: property.bathrooms,
        address: {
          '@type': 'PostalAddress',
          addressLocality: property.location,
          addressRegion: 'Punjab',
          addressCountry: 'IN'
        },
        realEstateAgent: {
          '@type': 'RealEstateAgent',
          name: 'CHEEMA PROPERTIES',
          telephone: '+91-9056330000'
        }
      }
    };

    this.setPageSEO(seoData);
  }

  // Format price for display
  private formatPrice(price: number): string {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  }

  // Generate XML sitemap
  public generateSitemap(properties: any[]): string {
    const baseUrl = window.location.origin;
    const currentDate = new Date().toISOString().split('T')[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/properties</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

    // Add property URLs
    properties.forEach(property => {
      sitemap += `
  <url>
    <loc>${baseUrl}/property/${property.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    sitemap += '\n</urlset>';
    return sitemap;
  }

  // Generate robots.txt
  public generateRobotsTxt(): string {
    const baseUrl = window.location.origin;
    
    return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${baseUrl}/sitemap.xml

# Real Estate specific
Allow: /properties
Allow: /property/*

# Contact information
# Contact: balvircheema2016@gmail.com
# Contact: +91-9056330000`;
  }

  // Add JSON-LD structured data for organization
  public addOrganizationStructuredData(): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'CHEEMA PROPERTIES',
      description: 'Premier real estate services in Punjab',
      url: window.location.origin,
      logo: `${window.location.origin}/logo.png`,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+91-9056330000',
          contactType: 'customer service',
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi', 'Punjabi']
        },
        {
          '@type': 'ContactPoint',
          telephone: '+91-9056361000',
          contactType: 'sales',
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi', 'Punjabi']
        }
      ],
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'Punjab',
        addressCountry: 'IN'
      },
      sameAs: [
        'https://wa.me/919056330000',
        'https://wa.me/919056361000'
      ],
      foundingDate: '2016',
      areaServed: {
        '@type': 'Place',
        name: ['Ludhiana', 'Chandigarh', 'Punjab']
      }
    };

    this.updateStructuredData(structuredData);
  }

  // Add FAQ structured data
  public addFAQStructuredData(): void {
    const faqData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What areas does CHEEMA PROPERTIES serve?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'CHEEMA PROPERTIES serves Ludhiana and Chandigarh in Punjab, India. We specialize in residential and commercial properties in these prime locations.'
          }
        },
        {
          '@type': 'Question',
          name: 'How can I contact CHEEMA PROPERTIES?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can contact us at +91-9056330000 or +91-9056361000, via WhatsApp, or email us at balvircheema2016@gmail.com.'
          }
        },
        {
          '@type': 'Question',
          name: 'What types of properties do you deal with?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We deal with apartments, independent houses, villas, commercial properties, and plots in Ludhiana and Chandigarh.'
          }
        }
      ]
    };

    this.updateStructuredData(faqData);
  }
}

// React component for SEO management
interface SEOProps {
  type: 'homepage' | 'properties' | 'property';
  data?: any;
}

export function SEO({ type, data }: SEOProps) {
  const seoService = SEOService.getInstance();
  const analytics = useGoogleAnalytics();

  useEffect(() => {
    switch (type) {
      case 'homepage':
        seoService.setHomepageSEO();
        analytics.trackPageView('/', 'CHEEMA PROPERTIES - Homepage');
        break;
      case 'properties':
        seoService.setPropertyListingSEO(data || {});
        analytics.trackPageView('/properties', 'Property Listings');
        break;
      case 'property':
        if (data) {
          seoService.setPropertySEO(data);
          analytics.trackPageView(`/property/${data.propertyId}`, data.title);
          analytics.trackPropertyView(data.propertyId, data.title, data.price);
        }
        break;
    }

    // Add organization structured data on first load
    seoService.addOrganizationStructuredData();
  }, [type, data]);

  return null;
}

// Export singleton instance
export const seoService = SEOService.getInstance();