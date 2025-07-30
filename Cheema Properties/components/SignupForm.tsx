import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { ArrowLeft, ArrowRight, Mail, FileText, User, CheckCircle, Crown, Shield, MapPin, Phone, MessageCircle } from 'lucide-react';

interface SignupFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  onFormComplete: (formData: any) => void;
  onFormReset: () => void;
}

export function SignupForm({ currentStep, setCurrentStep, totalSteps, onFormComplete, onFormReset }: SignupFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyDescription: '',
    submittedAt: ''
  });
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Prepare form data with timestamp
    const completeFormData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      id: Date.now().toString() // Mock ID generation
    };

    // Mock database storage and email sending
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock database storage
      console.log('Storing in database:', completeFormData);
      
      // Mock email sending to updated Gmail
      console.log('Sending email to balvircheema2016@gmail.com:', {
        to: 'balvircheema2016@gmail.com',
        subject: 'New Property Inquiry from CHEEMA PROPERTIES Website',
        body: `
          Dear Mr. Cheema,

          New inquiry received from your website:
          
          Customer Details:
          Name: ${completeFormData.firstName} ${completeFormData.lastName}
          Email: ${completeFormData.email}
          Phone: ${completeFormData.phone}
          
          Property Requirements:
          ${completeFormData.propertyDescription}
          
          Inquiry Submitted: ${new Date(completeFormData.submittedAt).toLocaleString()}
          
          Please contact the customer as early as possible.
          
          Best regards,
          CHEEMA PROPERTIES Website System
        `
      });

      // Call parent callback
      onFormComplete(completeFormData);
      setIsCompleted(true);
    } catch (error) {
      console.error('Submission error:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleWhatsAppContact = (phoneNumber: string) => {
    const message = encodeURIComponent("Hello, I'm interested in properties in Ludhiana/Chandigarh. Please share available options.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handlePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleNewInquiry = () => {
    // Reset all form state
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      propertyDescription: '',
      submittedAt: ''
    });
    setIsCompleted(false);
    setIsSubmitting(false);
    setCurrentStep(1);
    onFormReset();
  };

  if (isCompleted) {
    return (
      <Card className="w-full border-2 border-slate-400/20 bg-gradient-to-br from-white to-slate-50/30 shadow-2xl">
        <CardContent className="pt-8">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="bg-gradient-to-r from-zinc-800 to-zinc-600 bg-clip-text text-transparent">
                Thank You!
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your inquiry has been successfully submitted to CHEEMA PROPERTIES.
              </p>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-700 font-medium mb-2">
                  We will contact you as early as possible
                </p>
                <p className="text-sm text-slate-600 mb-3">
                  Our property experts in Ludhiana & Chandigarh will review your requirements and get back to you within 24 hours.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>For urgent inquiries:</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-sm text-slate-600">
                    <span>+91 9056330000</span>
                    <span>+91 9056361000</span>
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">Serving Ludhiana & Chandigarh, Punjab</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  onClick={() => handleWhatsAppContact('919056330000')}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp +91 9056330000
                </Button>
                <Button 
                  onClick={() => handleWhatsAppContact('919056361000')}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp +91 9056361000
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handlePhoneCall('+919056330000')}
                  className="w-full h-10 border-2 hover:bg-slate-50"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call (1st)
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handlePhoneCall('+919056361000')}
                  className="w-full h-10 border-2 hover:bg-slate-50"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call (2nd)
                </Button>
              </div>
              <Button 
                variant="outline" 
                className="w-full h-10" 
                onClick={handleNewInquiry}
              >
                Submit Another Inquiry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Premium Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-slate-600/10 to-slate-700/10 border border-slate-400/20">
          <Shield className="w-4 h-4 text-slate-600" />
          <span className="text-sm text-slate-700 tracking-wide">Trusted Since 2016</span>
        </div>
        <h1 className="bg-gradient-to-r from-zinc-800 to-zinc-600 bg-clip-text text-transparent">
          Join CHEEMA PROPERTIES
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Connect with Punjab's most trusted property dealers
        </p>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200">
            <MapPin className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-700">Exclusively serving Ludhiana & Chandigarh</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">WhatsApp: +91 9056330000</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">WhatsApp: +91 9056361000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground tracking-wide">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm px-3 py-1 rounded-full bg-slate-600/10 text-slate-700 border border-slate-400/20">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="relative">
          <Progress value={progress} className="h-3 bg-gray-100" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full opacity-20" 
               style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Premium Form Card */}
      <Card className="border-2 border-slate-400/10 bg-gradient-to-br from-white to-slate-50/20 shadow-xl">
        <CardContent className="pt-8 space-y-6">
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-zinc-700">First name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-slate-600 transition-colors" />
                    <Input
                      id="firstName"
                      placeholder="Rajesh"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="pl-10 h-12 border-2 focus:border-slate-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-zinc-700">Last name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-slate-600 transition-colors" />
                    <Input
                      id="lastName"
                      placeholder="Singh"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="pl-10 h-12 border-2 focus:border-slate-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-zinc-700">Email address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-slate-600 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="rajesh@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 h-12 border-2 focus:border-slate-400 transition-all duration-200"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-zinc-700">Phone number</Label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-slate-600 transition-colors" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10 h-12 border-2 focus:border-slate-400 transition-all duration-200"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">We'll contact you on this number for property updates</p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="propertyDescription" className="text-zinc-700">Property Requirements</Label>
                <div className="relative group">
                  <FileText className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-slate-600 transition-colors" />
                  <Textarea
                    id="propertyDescription"
                    placeholder="Describe your ideal property... (e.g., 3BHK apartment in Ludhiana, budget 50-70 lakhs, near IT park or shopping mall)"
                    value={formData.propertyDescription}
                    onChange={(e) => handleInputChange('propertyDescription', e.target.value)}
                    className="pl-10 pt-3 min-h-24 border-2 focus:border-slate-400 transition-all duration-200 resize-none"
                    rows={4}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">Help us understand your preferences for properties in Ludhiana & Chandigarh</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Premium Navigation */}
      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 1 || isSubmitting}
          className="flex items-center h-12 px-6 border-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex items-center h-12 px-8 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Submitting...
            </>
          ) : currentStep === totalSteps ? (
            <>
              <Crown className="w-4 h-4 mr-2" />
              Submit Inquiry
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Contact Information & Terms */}
      <div className="text-center pt-4 border-t border-slate-400/10 space-y-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleWhatsAppContact('919056330000')}
              className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp: +91 9056330000
            </Button>
            <Button
              variant="outline"
              onClick={() => handleWhatsAppContact('919056361000')}
              className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp: +91 9056361000
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePhoneCall('+919056330000')}
              className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Phone className="w-4 h-4" />
              Call +91 9056330000
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePhoneCall('+919056361000')}
              className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Phone className="w-4 h-4" />
              Call +91 9056361000
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          By submitting, you agree to our{' '}
          <a href="#" className="text-slate-600 hover:text-slate-700 underline transition-colors">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-slate-600 hover:text-slate-700 underline transition-colors">Privacy Policy</a>
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3 h-3" />
          <span>Verified dealers • Premium listings • Punjab focused • Since 2016</span>
        </div>
      </div>
    </div>
  );
}