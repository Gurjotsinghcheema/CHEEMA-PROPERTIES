import { useEffect } from 'react';

// Google Analytics configuration
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your Google Analytics ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export class GoogleAnalyticsService {
  private static instance: GoogleAnalyticsService;
  private isInitialized = false;
  private measurementId: string;
  private isDevelopment = false;

  private constructor(measurementId: string = GA_MEASUREMENT_ID) {
    this.measurementId = measurementId;
    this.isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname.includes('figma') ||
                        window.location.hostname.includes('preview');
  }

  public static getInstance(measurementId?: string): GoogleAnalyticsService {
    if (!GoogleAnalyticsService.instance) {
      GoogleAnalyticsService.instance = new GoogleAnalyticsService(measurementId);
    }
    return GoogleAnalyticsService.instance;
  }

  // Initialize Google Analytics
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Skip GA initialization in development/figma environment
      if (this.isDevelopment) {
        console.log('📊 Google Analytics skipped in development environment');
        this.isInitialized = true;
        return true;
      }

      // Initialize gtag function
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };

      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      
      // Handle script loading
      script.onload = () => {
        window.gtag('js', new Date());
        window.gtag('config', this.measurementId, {
          page_title: 'CHEEMA PROPERTIES - Punjab Real Estate',
          page_location: window.location.href,
          send_page_view: true
        });
        console.log('✅ Google Analytics initialized');
      };

      script.onerror = () => {
        console.warn('⚠️ Google Analytics script failed to load');
      };

      document.head.appendChild(script);

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Analytics:', error);
      // Don't throw error, just log it
      this.isInitialized = true; // Mark as initialized to prevent retries
      return false;
    }
  }

  // Safe gtag function that won't fail if GA isn't loaded
  private safeGtag(command: string, ...args: any[]): void {
    try {
      if (this.isDevelopment) {
        console.log(`📊 GA Event (dev):`, command, ...args);
        return;
      }

      if (typeof window.gtag === 'function') {
        window.gtag(command, ...args);
      } else {
        console.warn('⚠️ Google Analytics not loaded yet');
      }
    } catch (error) {
      console.error('❌ Google Analytics error:', error);
    }
  }

  // Track page views
  public trackPageView(pagePath: string, pageTitle: string): void {
    if (!this.isInitialized) return;

    this.safeGtag('config', this.measurementId, {
      page_path: pagePath,
      page_title: pageTitle,
    });

    console.log(`📊 Page view tracked: ${pageTitle} (${pagePath})`);
  }

  // Track custom events
  public trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) return;

    this.safeGtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters
    });

    console.log(`📊 Event tracked:`, event);
  }

  // Business-specific tracking methods
  public trackPropertyView(propertyId: string, propertyTitle: string, propertyPrice: number): void {
    this.trackEvent({
      action: 'view_property',
      category: 'Property',
      label: propertyTitle,
      value: propertyPrice,
      custom_parameters: {
        property_id: propertyId,
        property_title: propertyTitle,
        property_price: propertyPrice
      }
    });
  }

  public trackPropertyInquiry(propertyId: string, customerName: string, inquiryType: string): void {
    this.trackEvent({
      action: 'property_inquiry',
      category: 'Lead Generation',
      label: inquiryType,
      custom_parameters: {
        property_id: propertyId,
        customer_name: customerName,
        inquiry_type: inquiryType,
        lead_source: 'website'
      }
    });
  }

  public trackFormSubmission(formType: string, customerEmail: string): void {
    this.trackEvent({
      action: 'form_submission',
      category: 'Lead Generation',
      label: formType,
      custom_parameters: {
        form_type: formType,
        customer_email: customerEmail
      }
    });
  }

  public trackPhoneCall(phoneNumber: string, customerName?: string): void {
    this.trackEvent({
      action: 'phone_call',
      category: 'Contact',
      label: phoneNumber,
      custom_parameters: {
        phone_number: phoneNumber,
        customer_name: customerName,
        contact_method: 'phone'
      }
    });
  }

  public trackWhatsAppContact(phoneNumber: string, customerName?: string): void {
    this.trackEvent({
      action: 'whatsapp_contact',
      category: 'Contact',
      label: phoneNumber,
      custom_parameters: {
        phone_number: phoneNumber,
        customer_name: customerName,
        contact_method: 'whatsapp'
      }
    });
  }

  public trackEmailSent(emailType: string, recipientEmail: string): void {
    this.trackEvent({
      action: 'email_sent',
      category: 'Communication',
      label: emailType,
      custom_parameters: {
        email_type: emailType,
        recipient_email: recipientEmail
      }
    });
  }

  public trackSearchQuery(searchTerm: string, resultsCount: number): void {
    this.trackEvent({
      action: 'property_search',
      category: 'Search',
      label: searchTerm,
      value: resultsCount,
      custom_parameters: {
        search_term: searchTerm,
        results_count: resultsCount
      }
    });
  }

  public trackFilterUsage(filterType: string, filterValue: string): void {
    this.trackEvent({
      action: 'filter_usage',
      category: 'Search',
      label: `${filterType}: ${filterValue}`,
      custom_parameters: {
        filter_type: filterType,
        filter_value: filterValue
      }
    });
  }

  public trackUserEngagement(action: string, elementId?: string): void {
    this.trackEvent({
      action: 'user_engagement',
      category: 'Engagement',
      label: action,
      custom_parameters: {
        engagement_action: action,
        element_id: elementId
      }
    });
  }

  // FIXED: Add the missing trackPropertyLead method
  public trackPropertyLead(propertyId: string, propertyPrice: number, leadQuality: 'hot' | 'warm' | 'cold'): void {
    this.trackEvent({
      action: 'generate_lead',
      category: 'Lead Generation',
      label: leadQuality,
      value: propertyPrice,
      custom_parameters: {
        currency: 'INR',
        property_id: propertyId,
        lead_quality: leadQuality,
        transaction_id: `lead_${Date.now()}`,
        property_price: propertyPrice
      }
    });
  }

  // Enhanced lead tracking with more details
  public trackDetailedPropertyLead(leadData: {
    propertyId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    propertyPrice: number;
    leadQuality: 'hot' | 'warm' | 'cold';
    leadScore: number;
    propertyType?: string;
    location?: string;
  }): void {
    this.trackEvent({
      action: 'detailed_lead_generated',
      category: 'Lead Generation',
      label: `${leadData.leadQuality}_lead`,
      value: leadData.propertyPrice,
      custom_parameters: {
        currency: 'INR',
        property_id: leadData.propertyId,
        customer_name: leadData.customerName,
        customer_email: leadData.customerEmail,
        customer_phone: leadData.customerPhone,
        lead_quality: leadData.leadQuality,
        lead_score: leadData.leadScore,
        property_type: leadData.propertyType,
        location: leadData.location,
        transaction_id: `detailed_lead_${Date.now()}`,
        event_timestamp: new Date().toISOString()
      }
    });
  }

  // Conversion tracking
  public trackConversion(conversionType: string, conversionValue?: number): void {
    this.trackEvent({
      action: 'conversion',
      category: 'Conversions',
      label: conversionType,
      value: conversionValue,
      custom_parameters: {
        conversion_type: conversionType,
        conversion_time: new Date().toISOString()
      }
    });
  }

  // Lead status tracking
  public trackLeadStatusChange(leadId: string, oldStatus: string, newStatus: string, leadScore?: number): void {
    this.trackEvent({
      action: 'lead_status_change',
      category: 'Lead Management',
      label: `${oldStatus}_to_${newStatus}`,
      custom_parameters: {
        lead_id: leadId,
        old_status: oldStatus,
        new_status: newStatus,
        lead_score: leadScore,
        change_timestamp: new Date().toISOString()
      }
    });
  }

  // Customer interaction tracking
  public trackCustomerInteraction(interactionType: string, customerData: any): void {
    this.trackEvent({
      action: 'customer_interaction',
      category: 'Customer Service',
      label: interactionType,
      custom_parameters: {
        interaction_type: interactionType,
        customer_id: customerData.id,
        customer_name: customerData.name,
        interaction_timestamp: new Date().toISOString()
      }
    });
  }

  // User timing tracking
  public trackTiming(category: string, variable: string, value: number, label?: string): void {
    if (!this.isInitialized) return;

    this.safeGtag('event', 'timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label
    });
  }

  // Exception tracking
  public trackException(description: string, fatal: boolean = false): void {
    if (!this.isInitialized) return;

    this.safeGtag('event', 'exception', {
      description: description,
      fatal: fatal
    });
  }

  // Set user properties
  public setUserProperties(properties: Record<string, any>): void {
    if (!this.isInitialized) return;

    this.safeGtag('config', this.measurementId, {
      custom_map: properties
    });
  }

  // Track user demographics (if available)
  public setUserDemographics(city: string, state: string, country: string = 'India'): void {
    this.setUserProperties({
      city: city,
      state: state,
      country: country
    });
  }

  // Business performance tracking
  public trackBusinessMetrics(metrics: {
    totalLeads: number;
    hotLeads: number;
    conversionRate: number;
    avgResponseTime?: number;
  }): void {
    this.trackEvent({
      action: 'business_metrics',
      category: 'Business Intelligence',
      label: 'daily_metrics',
      custom_parameters: {
        total_leads: metrics.totalLeads,
        hot_leads: metrics.hotLeads,
        conversion_rate: metrics.conversionRate,
        avg_response_time: metrics.avgResponseTime,
        metrics_date: new Date().toISOString().split('T')[0]
      }
    });
  }

  // Get initialization status
  public getInitializationStatus(): { 
    isInitialized: boolean; 
    isDevelopment: boolean; 
    measurementId: string;
  } {
    return {
      isInitialized: this.isInitialized,
      isDevelopment: this.isDevelopment,
      measurementId: this.measurementId
    };
  }

  // Test if analytics is working
  public testAnalytics(): void {
    this.trackEvent({
      action: 'analytics_test',
      category: 'System',
      label: 'test_successful',
      custom_parameters: {
        test_timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        page_url: window.location.href
      }
    });
    console.log('📊 Analytics test event sent');
  }
}

// React Hook for Google Analytics
export function useGoogleAnalytics() {
  const analytics = GoogleAnalyticsService.getInstance();

  useEffect(() => {
    analytics.initialize().catch(error => {
      console.error('Google Analytics initialization failed:', error);
    });
  }, []);

  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPropertyView: analytics.trackPropertyView.bind(analytics),
    trackPropertyInquiry: analytics.trackPropertyInquiry.bind(analytics),
    trackFormSubmission: analytics.trackFormSubmission.bind(analytics),
    trackPhoneCall: analytics.trackPhoneCall.bind(analytics),
    trackWhatsAppContact: analytics.trackWhatsAppContact.bind(analytics),
    trackSearchQuery: analytics.trackSearchQuery.bind(analytics),
    trackFilterUsage: analytics.trackFilterUsage.bind(analytics),
    trackUserEngagement: analytics.trackUserEngagement.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
    trackPropertyLead: analytics.trackPropertyLead.bind(analytics), // FIXED: Added missing method
    trackDetailedPropertyLead: analytics.trackDetailedPropertyLead.bind(analytics),
    trackLeadStatusChange: analytics.trackLeadStatusChange.bind(analytics),
    trackCustomerInteraction: analytics.trackCustomerInteraction.bind(analytics),
    trackBusinessMetrics: analytics.trackBusinessMetrics.bind(analytics),
    setUserDemographics: analytics.setUserDemographics.bind(analytics),
    getStatus: analytics.getInitializationStatus.bind(analytics),
    testAnalytics: analytics.testAnalytics.bind(analytics)
  };
}

// Export singleton instance
export const googleAnalytics = GoogleAnalyticsService.getInstance();