import React from 'react';

// Meta tags component for Google publishing readiness
export function MetaTags() {
  return (
    <>
      {/* Primary Meta Tags */}
      <title>CHEEMA PROPERTIES - Punjab's Premier Real Estate | Luxury Properties in Ludhiana & Chandigarh</title>
      <meta name="title" content="CHEEMA PROPERTIES - Punjab's Premier Real Estate | Luxury Properties in Ludhiana & Chandigarh" />
      <meta name="description" content="Discover exclusive luxury properties in Punjab with CHEEMA PROPERTIES. Premium apartments, villas, and commercial properties in Ludhiana & Chandigarh. Trusted since 2016 with 500+ satisfied clients." />
      <meta name="keywords" content="real estate Punjab, luxury properties Ludhiana, premium apartments Chandigarh, CHEEMA PROPERTIES, property dealer Punjab, buy property Ludhiana, rent property Chandigarh, commercial properties Punjab, villas Ludhiana, real estate agent Chandigarh" />
      <meta name="author" content="CHEEMA PROPERTIES - Balvir Singh Cheema" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="CHEEMA PROPERTIES" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="CHEEMA PROPERTIES" />
      <meta property="og:title" content="CHEEMA PROPERTIES - Punjab's Premier Real Estate" />
      <meta property="og:description" content="Discover exclusive luxury properties in Punjab. Premium apartments, villas, and commercial properties in Ludhiana & Chandigarh. Trusted since 2016." />
      <meta property="og:image" content="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="CHEEMA PROPERTIES - Luxury Real Estate in Punjab" />
      <meta property="og:url" content="https://cheemaproperties.com" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cheemaproperties" />
      <meta name="twitter:creator" content="@cheemaproperties" />
      <meta name="twitter:title" content="CHEEMA PROPERTIES - Punjab's Premier Real Estate" />
      <meta name="twitter:description" content="Discover exclusive luxury properties in Punjab. Premium apartments, villas, and commercial properties in Ludhiana & Chandigarh." />
      <meta name="twitter:image" content="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80" />
      <meta name="twitter:image:alt" content="CHEEMA PROPERTIES - Luxury Real Estate in Punjab" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#d4af37" />
      <meta name="msapplication-TileColor" content="#d4af37" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://cheemaproperties.com" />
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#d4af37" />
      
      {/* PWA Manifest */}
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://api.web3forms.com" />
      
      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//wa.me" />
      
      {/* Local Business Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "CHEEMA PROPERTIES",
            "description": "Punjab's premier real estate agency specializing in luxury properties in Ludhiana and Chandigarh",
            "url": "https://cheemaproperties.com",
            "logo": "https://cheemaproperties.com/logo.png",
            "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80",
            "telephone": ["+91-9056330000", "+91-9056361000"],
            "email": "balvircheema2016@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "Punjab",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "30.9009",
              "longitude": "75.8573"
            },
            "areaServed": [
              {
                "@type": "City",
                "name": "Ludhiana",
                "addressRegion": "Punjab",
                "addressCountry": "IN"
              },
              {
                "@type": "City", 
                "name": "Chandigarh",
                "addressRegion": "Punjab",
                "addressCountry": "IN"
              }
            ],
            "serviceType": ["Residential Real Estate", "Commercial Real Estate", "Property Investment", "Real Estate Consultation"],
            "foundingDate": "2016",
            "founder": {
              "@type": "Person",
              "name": "Balvir Singh Cheema"
            },
            "sameAs": [
              "https://wa.me/919056330000",
              "https://wa.me/919056361000"
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Premium Properties in Punjab",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Luxury Apartments in Ludhiana",
                    "description": "Premium residential apartments with modern amenities"
                  }
                },
                {
                  "@type": "Offer", 
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Villas in Chandigarh",
                    "description": "Exclusive villas and independent houses"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product", 
                    "name": "Commercial Properties",
                    "description": "Prime commercial real estate for business investment"
                  }
                }
              ]
            },
            "priceRange": "₹₹₹₹",
            "paymentAccepted": ["Cash", "Bank Transfer", "Cheque"],
            "currenciesAccepted": "INR",
            "openingHours": "Mo-Su 00:00-23:59",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "500",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "CHEEMA PROPERTIES",
            "alternateName": "Cheema Properties Punjab",
            "description": "Punjab's most trusted real estate agency since 2016, specializing in premium properties in Ludhiana and Chandigarh",
            "url": "https://cheemaproperties.com",
            "logo": "https://cheemaproperties.com/logo.png",
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+91-9056330000",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi", "Punjabi"],
                "contactOption": "TollFree"
              },
              {
                "@type": "ContactPoint",
                "telephone": "+91-9056361000", 
                "contactType": "sales",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi", "Punjabi"]
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "Punjab",
              "addressCountry": "IN"
            },
            "sameAs": [
              "https://wa.me/919056330000",
              "https://wa.me/919056361000"
            ],
            "foundingDate": "2016-01-01",
            "numberOfEmployees": "10-50",
            "industry": "Real Estate",
            "knowsAbout": ["Real Estate", "Property Investment", "Residential Properties", "Commercial Properties", "Punjab Real Estate Market"],
            "memberOf": {
              "@type": "Organization",
              "name": "Punjab Real Estate Association"
            }
          })
        }}
      />

      {/* WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "CHEEMA PROPERTIES",
            "description": "Punjab's premier real estate website for luxury properties in Ludhiana and Chandigarh",
            "url": "https://cheemaproperties.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://cheemaproperties.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "CHEEMA PROPERTIES",
              "logo": "https://cheemaproperties.com/logo.png"
            },
            "inLanguage": "en-IN",
            "copyrightYear": "2016",
            "copyrightHolder": {
              "@type": "Organization",
              "name": "CHEEMA PROPERTIES"
            }
          })
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What areas does CHEEMA PROPERTIES serve?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "CHEEMA PROPERTIES serves Ludhiana and Chandigarh in Punjab, India. We specialize in premium residential and commercial properties in these prime locations with over 8 years of market expertise."
                }
              },
              {
                "@type": "Question",
                "name": "How can I contact CHEEMA PROPERTIES for property consultation?",
                "acceptedAnswer": {
                  "@type": "Answer", 
                  "text": "You can reach us at +91-9056330000 or +91-9056361000, via WhatsApp for instant response, or email us at balvircheema2016@gmail.com. We provide 24/7 support for urgent property requirements."
                }
              },
              {
                "@type": "Question",
                "name": "What types of properties does CHEEMA PROPERTIES deal with?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We specialize in luxury apartments, independent houses, villas, commercial properties, and investment plots in Ludhiana and Chandigarh. Our portfolio includes both ready-to-move and under-construction premium properties."
                }
              },
              {
                "@type": "Question", 
                "name": "How long has CHEEMA PROPERTIES been in business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "CHEEMA PROPERTIES has been serving Punjab's real estate market since 2016, with over 8 years of experience and 500+ satisfied clients. We are known for our transparency, expertise, and premium service quality."
                }
              },
              {
                "@type": "Question",
                "name": "Does CHEEMA PROPERTIES provide property investment guidance?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we provide comprehensive property investment consultation including market analysis, ROI calculations, legal documentation support, and financing assistance. Our expertise helps clients make informed investment decisions."
                }
              }
            ]
          })
        }}
      />
    </>
  );
}