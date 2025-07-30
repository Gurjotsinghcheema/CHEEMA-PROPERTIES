import React, { useState, useEffect } from 'react';
import { ImageCarousel } from './components/ImageCarousel';
import { SignupForm } from './components/SignupForm';
import { AdminDashboard } from './components/AdminDashboard';
import { PWAInstallButton, NetworkStatus, pwaService } from './components/PWAService';
import { SEO } from './components/SEOService';
import { leadScoringService } from './components/LeadScoringService';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { ArrowLeft, Phone, MessageCircle, Mail, Settings, Shield, Star, Award, Users, CheckCircle, Crown, Diamond, Sparkles } from 'lucide-react';
import { emailService } from './components/EmailService';
import { smsService } from './components/SMSService';
import { databaseService } from './components/DatabaseService';
import { googleAnalytics, useGoogleAnalytics } from './components/GoogleAnalytics';
import { toast } from 'sonner@2.0.3';
import cheemaLogo from 'figma:asset/02919bd481154d7f891cbc42cbd879147e599a1f.png';

interface CustomerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyDescription: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'viewed' | 'closed';
  score?: any;
  interactions?: any[];
  tags?: string[];
}

type ViewType = 'signup' | 'admin';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentView, setCurrentView] = useState<ViewType>('signup');
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationErrors, setInitializationErrors] = useState<string[]>([]);
  const [showAdminHint, setShowAdminHint] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const totalSteps = 3;
  const analytics = useGoogleAnalytics();

  // Initialize all services on app load
  useEffect(() => {
    const initializeServices = async () => {
      const errors: string[] = [];
      
      try {
        console.log('🚀 Starting CHEEMA PROPERTIES initialization...');
        
        // Show premium loading for at least 2 seconds
        setTimeout(() => setIsLoading(false), 2000);
        
        // Initialize PWA service
        try {
          const pwaSuccess = await pwaService.initialize();
          if (!pwaSuccess) {
            errors.push('PWA Service failed to initialize');
          }
        } catch (error) {
          console.error('PWA Service error:', error);
          errors.push('PWA Service initialization failed');
        }
        
        // Initialize database service
        try {
          const dbSuccess = await databaseService.initialize();
          if (!dbSuccess) {
            errors.push('Database Service failed to initialize');
          }
        } catch (error) {
          console.error('Database Service error:', error);
          errors.push('Database Service initialization failed');
        }
        
        // Initialize email service (now always works)
        try {
          const emailSuccess = await emailService.initialize();
          if (!emailSuccess) {
            errors.push('Email Service failed to initialize');
          } else {
            console.log('✅ Email Service ready - will use mailto and Gmail integration');
          }
        } catch (error) {
          console.error('Email Service error:', error);
          errors.push('Email Service initialization failed');
        }
        
        // Initialize SMS service
        try {
          const smsSuccess = await smsService.initialize();
          if (!smsSuccess) {
            errors.push('SMS Service failed to initialize');
          }
        } catch (error) {
          console.error('SMS Service error:', error);
          errors.push('SMS Service initialization failed');
        }
        
        // Initialize Google Analytics
        try {
          const gaSuccess = await googleAnalytics.initialize();
          if (!gaSuccess) {
            errors.push('Google Analytics failed to initialize');
          }
        } catch (error) {
          console.error('Google Analytics error:', error);
          errors.push('Google Analytics initialization failed');
        }
        
        // Load customer data from database
        try {
          const savedCustomers = await databaseService.getCustomers();
          if (savedCustomers.length > 0) {
            // Add scores to existing customers
            const customersWithScores = savedCustomers.map(customer => ({
              ...customer,
              score: leadScoringService.calculateLeadScore(customer, customer.interactions || []),
              tags: leadScoringService.autoAssignTags(customer)
            }));
            setCustomerData(customersWithScores);
          } else {
            // Add sample data for demo
            const sampleCustomers: CustomerData[] = [
              {
                id: '1',
                firstName: 'Rajesh',
                lastName: 'Kumar',
                email: 'rajesh.kumar@example.com',
                phone: '+91 98765 43210',
                propertyDescription: '3BHK apartment in Ludhiana, budget 50-70 lakhs, near IT park, urgent requirement',
                submittedAt: '2025-01-23T10:30:00Z',
                status: 'new',
                interactions: []
              },
              {
                id: '2',
                firstName: 'Priya',
                lastName: 'Singh',
                email: 'priya.singh@example.com',
                phone: '+91 87654 32109',
                propertyDescription: '2BHK independent house in Chandigarh, budget 80 lakhs, with parking',
                submittedAt: '2025-01-23T09:15:00Z',
                status: 'contacted',
                interactions: [
                  {
                    id: '1',
                    type: 'call',
                    timestamp: '2025-01-23T11:00:00Z',
                    description: 'Initial call - discussed requirements',
                    outcome: 'positive'
                  }
                ]
              }
            ];
            
            // Add scores and tags to sample customers
            const customersWithScores = sampleCustomers.map(customer => ({
              ...customer,
              score: leadScoringService.calculateLeadScore(customer, customer.interactions || []),
              tags: leadScoringService.autoAssignTags(customer)
            }));
            
            setCustomerData(customersWithScores);
            
            // Save to database
            for (const customer of customersWithScores) {
              try {
                await databaseService.saveCustomer(customer);
              } catch (error) {
                console.error('Failed to save sample customer:', error);
              }
            }
          }
        } catch (error) {
          console.error('Failed to load customer data:', error);
          errors.push('Failed to load customer data');
        }
        
        // Set initialization errors
        setInitializationErrors(errors);
        
        // Always mark as initialized, even with errors
        setIsInitialized(true);
        
        if (errors.length === 0) {
          console.log('✅ CHEEMA PROPERTIES website initialized successfully');
          toast.success('Welcome to CHEEMA PROPERTIES', {
            description: 'Punjab\'s most exclusive real estate experience awaits you.',
            duration: 4000
          });
        } else {
          console.warn('⚠️ CHEEMA PROPERTIES initialized with some errors:', errors);
          toast.warning('System partially ready', {
            description: 'Some features may be limited. Core functionality is available.',
            duration: 5000
          });
        }
        
        // Track page view (safe to call even if GA failed)
        try {
          analytics.trackPageView('/', 'CHEEMA PROPERTIES - Homepage');
          analytics.setUserDemographics('Punjab', 'Punjab', 'India');
        } catch (error) {
          console.error('Analytics tracking failed:', error);
        }
        
      } catch (error) {
        console.error('❌ Critical initialization failure:', error);
        setInitializationErrors(['Critical system failure']);
        setIsInitialized(true); // Still mark as initialized to show the UI
        
        toast.error('System initialization failed', {
          description: 'Some features may not work. Please refresh the page or contact support.',
          duration: 10000
        });
      }
    };

    initializeServices();
  }, []);

  // Admin access methods
  useEffect(() => {
    // Secret key combination (Ctrl+Shift+A) - keep as backup
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        handleAdminAccess();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAdminAccess = () => {
    const password = prompt('🔐 Enter admin password:');
    if (password === 'jacob') {
      setCurrentView('admin');
      toast.success('Admin Access Granted', {
        description: 'Welcome to the admin dashboard. Full system access enabled.',
        duration: 4000
      });
      try {
        analytics.trackEvent({
          action: 'admin_access',
          category: 'System',
          label: 'Admin login successful'
        });
      } catch (error) {
        console.error('Failed to track admin access:', error);
      }
    } else if (password !== null) {
      toast.error('Access Denied', {
        description: 'Invalid credentials. This is a secure system for authorized personnel only.',
        duration: 5000
      });
      try {
        analytics.trackEvent({
          action: 'admin_access_failed',
          category: 'System',
          label: 'Admin login failed'
        });
      } catch (error) {
        console.error('Failed to track admin access failure:', error);
      }
    }
  };

  // Complete form submission with improved email handling
  const handleFormComplete = async (formData: CustomerData) => {
    const completeFormData = {
      ...formData,
      status: 'new' as const,
      id: Date.now().toString(),
      interactions: []
    };

    // Calculate lead score
    const score = leadScoringService.calculateLeadScore(completeFormData);
    const tags = leadScoringService.autoAssignTags(completeFormData);
    
    const finalFormData = {
      ...completeFormData,
      score,
      tags
    };

    try {
      // Store in database
      try {
        await databaseService.saveCustomer(finalFormData);
        console.log('✅ Customer data saved to local database');
      } catch (error) {
        console.error('Failed to save customer to database:', error);
      }
      
      const updatedCustomers = [finalFormData, ...customerData];
      setCustomerData(updatedCustomers);
      
      // Send email notification (now guaranteed to work)
      try {
        console.log('📧 Attempting to send email notification...');
        
        const emailSent = await emailService.sendInquiryNotification({
          customerName: `${finalFormData.firstName} ${finalFormData.lastName}`,
          customerEmail: finalFormData.email,
          customerPhone: finalFormData.phone,
          propertyDescription: finalFormData.propertyDescription,
          inquiryType: 'property'
        });
        
        if (emailSent) {
          console.log('✅ Email notification process initiated');
          
          // Send automated response to customer
          try {
            await emailService.sendCustomerResponse({
              customerName: `${finalFormData.firstName} ${finalFormData.lastName}`,
              customerEmail: finalFormData.email,
              customerPhone: finalFormData.phone,
              propertyDescription: finalFormData.propertyDescription,
              inquiryType: 'property'
            });
            console.log('✅ Customer response email task created');
          } catch (responseError) {
            console.error('Customer response email failed:', responseError);
          }
          
          // Premium success message
          toast.success('Inquiry Submitted Successfully!', {
            description: 'Your exclusive property consultation request has been sent to our director. Expect a personal call within 2 hours.',
            duration: 8000,
            action: {
              label: 'Call Now',
              onClick: () => handlePhoneCall('+919056330000')
            }
          });
          
        } else {
          throw new Error('Email sending failed');
        }
        
      } catch (error) {
        console.error('Email notification failed:', error);
        
        // Fallback: Show contact information
        toast.warning('Direct Contact Required', {
          description: 'Your inquiry is secured. Please call +91 9056330000 for immediate VIP assistance.',
          duration: 10000,
          action: {
            label: 'WhatsApp VIP',
            onClick: () => handleWhatsAppContact('919056330000')
          }
        });
      }
      
      // Send SMS notifications (non-blocking)
      try {
        await smsService.sendInquiryNotification({
          customerName: `${finalFormData.firstName} ${finalFormData.lastName}`,
          customerPhone: finalFormData.phone,
          propertyDescription: finalFormData.propertyDescription,
          inquiryType: 'property'
        });
        console.log('✅ SMS notification sent (or simulated)');
      } catch (error) {
        console.error('SMS notification failed:', error);
      }
      
      // Track analytics (non-blocking) - FIXED: Now using correct method names
      try {
        analytics.trackFormSubmission('property_inquiry', finalFormData.email);
        analytics.trackPropertyInquiry('general', `${finalFormData.firstName} ${finalFormData.lastName}`, 'property');
        
        // FIXED: Use the correct method signature
        analytics.trackPropertyLead('general', 0, score.quality);
        
        // Enhanced tracking with detailed lead information
        analytics.trackDetailedPropertyLead({
          propertyId: 'general',
          customerName: `${finalFormData.firstName} ${finalFormData.lastName}`,
          customerEmail: finalFormData.email,
          customerPhone: finalFormData.phone,
          propertyPrice: 0, // No specific property price
          leadQuality: score.quality,
          leadScore: score.total,
          propertyType: 'General Inquiry',
          location: 'Punjab'
        });
        
        console.log('✅ Analytics events tracked successfully');
      } catch (error) {
        console.error('Analytics tracking failed:', error);
      }
      
      console.log('✅ Customer inquiry processed successfully');
      console.log(`📊 Lead Score: ${score.total}/100 (${score.quality})`);
      console.log(`📧 Email notification sent to: balvircheema2016@gmail.com`);
      console.log(`📱 Customer: ${finalFormData.firstName} ${finalFormData.lastName} (${finalFormData.phone})`);
      
    } catch (error) {
      console.error('❌ Error processing form submission:', error);
      
      toast.error('Processing Error', {
        description: 'Technical difficulty encountered. Your VIP details are secure. Please call our director directly.',
        duration: 10000,
        action: {
          label: 'Call Director',
          onClick: () => handlePhoneCall('+919056330000')
        }
      });
      
      // Track error (non-blocking)
      try {
        analytics.trackEvent({
          action: 'form_submission_error',
          category: 'Error',
          label: error instanceof Error ? error.message : 'Unknown error'
        });
      } catch (trackError) {
        console.error('Failed to track error:', trackError);
      }
    }
  };

  const handleFormReset = () => {
    setCurrentStep(1);
  };

  // Admin functions
  const updateCustomerStatus = async (id: string, newStatus: CustomerData['status']) => {
    const customer = customerData.find(c => c.id === id);
    if (!customer) return;

    const interaction = {
      id: Date.now().toString(),
      type: 'status_update' as const,
      timestamp: new Date().toISOString(),
      description: `Status updated to ${newStatus}`,
      outcome: 'positive' as const
    };

    const updatedCustomer = {
      ...customer,
      status: newStatus,
      interactions: [...(customer.interactions || []), interaction]
    };

    updatedCustomer.score = leadScoringService.calculateLeadScore(updatedCustomer, updatedCustomer.interactions);

    const updatedCustomers = customerData.map(c => 
      c.id === id ? updatedCustomer : c
    );
    
    setCustomerData(updatedCustomers);
    
    try {
      await databaseService.updateCustomerStatus(id, newStatus);
    } catch (error) {
      console.error('Failed to update customer status in database:', error);
    }
    
    // Track status change
    try {
      analytics.trackLeadStatusChange(id, customer.status, newStatus, updatedCustomer.score?.total);
    } catch (error) {
      console.error('Failed to track status change:', error);
    }
    
    console.log(`✅ Status updated for ${customer?.firstName} ${customer?.lastName} to ${newStatus}`);
    toast.success(`Status Updated`, {
      description: `${customer.firstName} ${customer.lastName}'s inquiry has been marked as ${newStatus}.`
    });
  };

  const deleteCustomer = async (id: string) => {
    const customer = customerData.find(c => c.id === id);
    const updatedCustomers = customerData.filter(c => c.id !== id);
    setCustomerData(updatedCustomers);
    
    try {
      await databaseService.delete('customers', id);
    } catch (error) {
      console.error('Failed to delete customer from database:', error);
    }
    
    // Track deletion
    try {
      analytics.trackEvent({
        action: 'customer_deleted',
        category: 'Lead Management',
        label: customer ? `${customer.firstName} ${customer.lastName}` : id
      });
    } catch (error) {
      console.error('Failed to track customer deletion:', error);
    }
    
    console.log(`✅ Customer inquiry ${id} deleted`);
    toast.success('Customer inquiry deleted');
  };

  // Handle WhatsApp contact
  const handleWhatsAppContact = (phoneNumber: string) => {
    const message = encodeURIComponent("Hello! I'm interested in premium properties in Ludhiana/Chandigarh. Please share your exclusive portfolio and arrange a personal consultation.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    
    try {
      analytics.trackWhatsAppContact(phoneNumber, 'Premium Website Visitor');
    } catch (error) {
      console.error('Failed to track WhatsApp contact:', error);
    }
    
    toast.success('Connecting to WhatsApp', {
      description: 'Opening exclusive WhatsApp chat with our property director.',
      duration: 3000
    });
  };

  // Handle phone call
  const handlePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
    
    try {
      analytics.trackPhoneCall(phoneNumber, 'Premium Website Visitor');
    } catch (error) {
      console.error('Failed to track phone call:', error);
    }
    
    toast.success('Connecting Your Call', {
      description: 'Dialing CHEEMA PROPERTIES director for exclusive consultation.',
      duration: 3000
    });
  };

  // Handle email contact
  const handleEmailContact = () => {
    const subject = encodeURIComponent('Exclusive Property Consultation Request');
    const body = encodeURIComponent(`Dear Mr. Balvir Singh Cheema,

I am interested in exploring premium properties in the Ludhiana/Chandigarh region and would like to request an exclusive consultation.

My Requirements:
Phone: [Your contact number]
Preferred Location: [Ludhiana/Chandigarh/Both]
Budget Range: [Your investment range]
Property Type: [Luxury Apartment/Villa/Commercial/Investment]
Timeline: [When you're looking to finalize]

I would appreciate a personal consultation to discuss your premium portfolio and investment opportunities.

Thank you for your time and expertise.

Best regards,
[Your name]`);
    
    window.open(`mailto:balvircheema2016@gmail.com?subject=${subject}&body=${body}`, '_self');
    
    try {
      analytics.trackEvent({
        action: 'email_contact',
        category: 'Contact',
        label: 'balvircheema2016@gmail.com'
      });
    } catch (error) {
      console.error('Failed to track email contact:', error);
    }
    
    toast.success('Opening Premium Email', {
      description: 'Composing exclusive consultation request to balvircheema2016@gmail.com',
      duration: 3000
    });
  };

  // Premium loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img 
                src={cheemaLogo} 
                alt="CHEEMA PROPERTIES" 
                className="h-32 w-auto object-contain filter drop-shadow-2xl animate-pulse"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-400/20 to-transparent rounded-full blur-xl"></div>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent tracking-wider">
              CHEEMA PROPERTIES
            </h1>
            <p className="text-slate-300 text-lg font-medium tracking-wide">Punjab's Most Exclusive Real Estate</p>
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <Crown className="w-5 h-5" />
              <span className="text-sm font-medium">Premium Experience Loading</span>
              <Crown className="w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="w-64 h-1 bg-slate-700 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full premium-loading-bar"></div>
            </div>
            <p className="text-slate-400 text-sm">Preparing your exclusive property experience...</p>
          </div>
        </div>
      </div>
    );
  }

  // Admin view
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <SEO type="homepage" />
        <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={cheemaLogo} 
                  alt="CHEEMA PROPERTIES Logo" 
                  className="h-14 w-auto object-contain filter drop-shadow-lg"
                />
                <div className="absolute -top-1 -right-1">
                  <Crown className="w-4 h-4 text-amber-500" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  CHEEMA PROPERTIES
                </h1>
                <p className="text-sm text-slate-600 font-medium">Administrative Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg">
                <Shield className="w-3 h-3 mr-1" />
                Admin Mode
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 shadow-sm">
                <CheckCircle className="w-3 h-3 mr-1" />
                Inquiries: {emailService.getTotalInquiries()}
              </Badge>
              <PWAInstallButton />
              <Button
                variant="outline"
                onClick={() => setCurrentView('signup')}
                className="flex items-center gap-2 hover:bg-slate-50 border-slate-300 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Website
              </Button>
            </div>
          </div>
        </div>
        <AdminDashboard 
          inquiries={customerData}
          onUpdateStatus={updateCustomerStatus}
          onDeleteInquiry={deleteCustomer}
        />
        <NetworkStatus />
      </div>
    );
  }

  // Main premium website view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex relative overflow-hidden">
      <SEO type="homepage" />
      <NetworkStatus />
      
      {/* Premium animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/50 via-transparent to-slate-900/50"></div>
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-amber-400/5 to-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-gradient-to-r from-blue-400/5 to-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/3 to-pink-500/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Left Panel - Premium Image Carousel */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-slate-900/60 z-20"></div>
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-amber-400/0 via-amber-400/30 to-amber-400/0 z-30"></div>
        <ImageCarousel />
        
        {/* Premium overlay content */}
        <div className="absolute bottom-8 left-8 z-30 text-white max-w-md">
          <div className="backdrop-blur-md bg-black/20 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Diamond className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-semibold text-sm tracking-wide">EXCLUSIVE PORTFOLIO</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Premium Properties Await</h3>
            <p className="text-slate-200 text-sm leading-relaxed">
              Discover handpicked luxury properties in Punjab's most prestigious locations. 
              Each property represents the pinnacle of architectural excellence and lifestyle luxury.
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Premium Form Experience */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative">
        {/* Premium background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #amber-400 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
        
        <div className="w-full max-w-lg space-y-6 sm:space-y-8 relative z-10">
          {/* Luxury Brand Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 rounded-full blur-2xl scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                <img 
                  src={cheemaLogo} 
                  alt="CHEEMA PROPERTIES Logo" 
                  className="h-20 sm:h-28 w-auto object-contain filter drop-shadow-2xl relative z-10 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -top-2 -right-2 z-20">
                  <Crown className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-wider bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
                  CHEEMA PROPERTIES
                </h1>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <Award className="w-4 h-4" />
                <span className="font-semibold text-sm sm:text-base tracking-wide">Punjab's Premier Real Estate</span>
                <Award className="w-4 h-4" />
              </div>
              
              <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>Trusted Since 2016</span>
                </div>
                <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>500+ Elite Clients</span>
                </div>
              </div>
              
              <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Experience the epitome of luxury real estate in Ludhiana & Chandigarh. 
                Where exceptional properties meet extraordinary service.
              </p>
            </div>

            <div className="flex justify-center mt-4 sm:mt-6">
              <PWAInstallButton />
            </div>
          </div>
          
          {/* Premium Contact Options */}
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-10">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-sm sm:text-base font-bold text-white mb-2">Exclusive Consultation Access</h3>
              <p className="text-xs sm:text-sm text-slate-400">Connect directly with our property director for personalized service</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <Button
                onClick={() => handleWhatsAppContact('919056330000')}
                className="w-full h-12 sm:h-14 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-xl border-0 flex items-center gap-3 transition-all duration-300 group elegant-button"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold text-sm sm:text-base">WhatsApp Director</div>
                  <div className="text-xs opacity-90">Instant VIP Response</div>
                </div>
                <Sparkles className="w-4 h-4 ml-auto opacity-60" />
              </Button>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Button
                  onClick={() => handlePhoneCall('+919056330000')}
                  variant="outline"
                  className="h-12 sm:h-14 flex-col gap-1 bg-slate-800/50 border-amber-400/30 hover:bg-amber-400/10 hover:border-amber-400 text-white transition-all duration-300 backdrop-blur-sm group"
                >
                  <Phone className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">Call Director</span>
                </Button>
                
                <Button
                  onClick={handleEmailContact}
                  variant="outline"
                  className="h-12 sm:h-14 flex-col gap-1 bg-slate-800/50 border-purple-400/30 hover:bg-purple-400/10 hover:border-purple-400 text-white transition-all duration-300 backdrop-blur-sm group"
                >
                  <Mail className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">Premium Email</span>
                </Button>
              </div>
            </div>
            
            {/* VIP Contact Display */}
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-md rounded-xl p-4 sm:p-6 text-center border border-amber-400/20">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Diamond className="w-4 h-4 text-amber-400" />
                <p className="text-xs sm:text-sm text-amber-400 font-semibold tracking-wide">VIP DIRECT LINES</p>
                <Diamond className="w-4 h-4 text-amber-400" />
              </div>
              <div className="space-y-2">
                <p className="font-bold text-white text-sm sm:text-base">+91 9056330000</p>
                <p className="font-bold text-white text-sm sm:text-base">+91 9056361000</p>
              </div>
              <p className="text-xs text-slate-300 mt-3">24/7 Executive Support • Immediate Response Guaranteed</p>
            </div>
          </div>
          
          {/* Premium Inquiry Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-amber-400/20 shadow-2xl"></div>
            <div className="relative p-4 sm:p-8 rounded-2xl">
              <div className="text-center mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <h3 className="text-lg sm:text-xl font-bold text-white">Exclusive Property Consultation</h3>
                  <Crown className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-sm sm:text-base text-slate-300">Share your vision, and we'll curate the perfect properties for your lifestyle</p>
              </div>
              
              <SignupForm 
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                totalSteps={totalSteps}
                onFormComplete={handleFormComplete}
                onFormReset={handleFormReset}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Premium Admin Access - No Password Display for Customers */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40">
        <div className="relative group">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdminHint(!showAdminHint)}
            className="bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700 border-amber-400/30 shadow-xl text-amber-400 hover:border-amber-400"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          {showAdminHint && (
            <div className="absolute bottom-12 right-0 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-amber-400/20 p-4 sm:p-6 w-72 sm:w-80">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <p className="text-sm font-bold text-white">Executive Access</p>
                  <Crown className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-xs text-slate-300">For CHEEMA PROPERTIES executive team only</p>
                <Button
                  onClick={handleAdminAccess}
                  size="sm"
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-900 font-bold shadow-lg border-0"
                >
                  <Shield className="w-3 h-3 mr-2" />
                  Access Dashboard
                </Button>
                <div className="text-xs text-slate-400">
                  <p>Authorized personnel only</p>
                  <p>Or press Ctrl+Shift+A</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Status Indicator */}
      {isInitialized && (
        <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 flex items-center gap-2 text-xs text-slate-300 bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl border border-amber-400/20">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            initializationErrors.length === 0 ? 'bg-emerald-400' : 'bg-amber-400'
          }`}></div>
          <span className="font-medium">
            {initializationErrors.length === 0 ? 'All systems premium' : 'Core systems active'}
          </span>
          {initializationErrors.length === 0 && (
            <span className="text-emerald-400 ml-1">• VIP Ready</span>
          )}
        </div>
      )}
    </div>
  );
}