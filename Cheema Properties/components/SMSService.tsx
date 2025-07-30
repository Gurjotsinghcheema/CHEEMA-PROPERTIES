import { toast } from 'sonner@2.0.3';

// SMS Service configuration (using free Twilio trial or similar)
const SMS_SERVICE_CONFIG = {
  accountSid: 'your_twilio_account_sid',
  authToken: 'your_twilio_auth_token',
  fromNumber: '+1234567890', // Your Twilio phone number
  adminNumbers: ['+919056330000', '+919056361000']
};

interface SMSData {
  to: string;
  message: string;
  type: 'notification' | 'alert' | 'reminder';
}

interface PropertyInquiryData {
  customerName: string;
  customerPhone: string;
  propertyTitle?: string;
  propertyDescription?: string;
  inquiryType: 'property' | 'general' | 'contact';
}

export class SMSService {
  private static instance: SMSService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  // Initialize SMS service
  public async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Mock SMS service initialization
      console.log('📱 SMS Service initialized for CHEEMA PROPERTIES');
      console.log('📱 Admin numbers:', SMS_SERVICE_CONFIG.adminNumbers);
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ SMS Service initialization failed:', error);
      return false;
    }
  }

  // Send SMS notification to admin about new inquiry
  public async sendInquiryNotification(data: PropertyInquiryData): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const message = this.generateInquiryNotificationSMS(data);
      
      // Send to both admin numbers
      for (const adminNumber of SMS_SERVICE_CONFIG.adminNumbers) {
        await this.sendSMS({
          to: adminNumber,
          message: message,
          type: 'notification'
        });
      }
      
      console.log('✅ Inquiry notification SMS sent to admin numbers');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send inquiry notification SMS:', error);
      return false;
    }
  }

  // Send SMS confirmation to customer
  public async sendCustomerConfirmation(data: PropertyInquiryData): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const message = this.generateCustomerConfirmationSMS(data);
      
      await this.sendSMS({
        to: data.customerPhone,
        message: message,
        type: 'notification'
      });
      
      console.log('✅ Customer confirmation SMS sent');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send customer confirmation SMS:', error);
      return false;
    }
  }

  // Send follow-up SMS
  public async sendFollowUpSMS(customerPhone: string, customerName: string, propertyTitle: string): Promise<boolean> {
    try {
      const message = this.generateFollowUpSMS(customerName, propertyTitle);
      
      await this.sendSMS({
        to: customerPhone,
        message: message,
        type: 'reminder'
      });
      
      console.log('✅ Follow-up SMS sent to customer');
      toast.success('Follow-up SMS sent!');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send follow-up SMS:', error);
      toast.error('Failed to send follow-up SMS.');
      return false;
    }
  }

  // Send appointment reminder
  public async sendAppointmentReminder(customerPhone: string, customerName: string, appointmentDate: string): Promise<boolean> {
    try {
      const message = `Hi ${customerName}, this is a reminder about your property visit appointment on ${appointmentDate}. Looking forward to showing you our properties! - CHEEMA PROPERTIES (+91 9056330000)`;
      
      await this.sendSMS({
        to: customerPhone,
        message: message,
        type: 'reminder'
      });
      
      console.log('✅ Appointment reminder SMS sent');
      toast.success('Appointment reminder sent!');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send appointment reminder:', error);
      toast.error('Failed to send appointment reminder.');
      return false;
    }
  }

  // Core SMS sending function
  private async sendSMS(data: SMSData): Promise<boolean> {
    try {
      // Mock SMS sending using Twilio API
      console.log('📱 Sending SMS to:', data.to);
      console.log('📱 Message:', data.message);
      console.log('📱 Type:', data.type);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store SMS in localStorage for tracking
      const sentSMS = JSON.parse(localStorage.getItem('sent_sms') || '[]');
      sentSMS.push({
        id: Date.now().toString(),
        to: data.to,
        message: data.message,
        type: data.type,
        sentAt: new Date().toISOString(),
        status: 'sent'
      });
      localStorage.setItem('sent_sms', JSON.stringify(sentSMS));
      
      console.log('✅ SMS sent successfully');
      return true;
      
    } catch (error) {
      console.error('❌ SMS sending failed:', error);
      
      // Store failed SMS for retry
      const failedSMS = JSON.parse(localStorage.getItem('failed_sms') || '[]');
      failedSMS.push({
        id: Date.now().toString(),
        ...data,
        failedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      localStorage.setItem('failed_sms', JSON.stringify(failedSMS));
      
      return false;
    }
  }

  // Generate inquiry notification SMS for admin
  private generateInquiryNotificationSMS(data: PropertyInquiryData): string {
    const baseMessage = `🏠 New ${data.inquiryType} inquiry - ${data.customerName} (${data.customerPhone})`;
    
    if (data.propertyTitle) {
      return `${baseMessage}. Property: ${data.propertyTitle}. Contact ASAP! - CHEEMA PROPERTIES`;
    }
    
    return `${baseMessage}. ${data.propertyDescription || 'General inquiry'}. Contact ASAP! - CHEEMA PROPERTIES`;
  }

  // Generate customer confirmation SMS
  private generateCustomerConfirmationSMS(data: PropertyInquiryData): string {
    return `Hi ${data.customerName}, thank you for your inquiry with CHEEMA PROPERTIES! Our team will contact you within 24 hours. ${data.propertyTitle ? `Regarding: ${data.propertyTitle}` : ''}. For urgent queries: +91 9056330000`;
  }

  // Generate follow-up SMS
  private generateFollowUpSMS(customerName: string, propertyTitle: string): string {
    return `Hi ${customerName}, following up on your inquiry about ${propertyTitle}. Would you like to schedule a property visit? We have some great options for you! - Balvir Cheema, CHEEMA PROPERTIES (+91 9056330000)`;
  }

  // Bulk SMS for property updates
  public async sendBulkPropertyUpdate(customerPhones: string[], propertyTitle: string, propertyPrice: string): Promise<boolean> {
    try {
      const message = `🏠 New Property Alert: ${propertyTitle} at ${propertyPrice}. Interested? Contact us: +91 9056330000. - CHEEMA PROPERTIES`;
      
      for (const phone of customerPhones) {
        await this.sendSMS({
          to: phone,
          message: message,
          type: 'alert'
        });
        
        // Add delay between messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log(`✅ Bulk SMS sent to ${customerPhones.length} customers`);
      toast.success(`Property alert sent to ${customerPhones.length} customers`);
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send bulk SMS:', error);
      toast.error('Failed to send bulk property alert.');
      return false;
    }
  }

  // Get SMS statistics
  public getSMSStats(): { sent: number; pending: number; failed: number } {
    const sentSMS = JSON.parse(localStorage.getItem('sent_sms') || '[]');
    const failedSMS = JSON.parse(localStorage.getItem('failed_sms') || '[]');
    
    return {
      sent: sentSMS.length,
      pending: 0,
      failed: failedSMS.length
    };
  }

  // Get all sent SMS
  public getSentSMS(): any[] {
    return JSON.parse(localStorage.getItem('sent_sms') || '[]');
  }

  // Get failed SMS for retry
  public getFailedSMS(): any[] {
    return JSON.parse(localStorage.getItem('failed_sms') || '[]');
  }

  // Retry failed SMS
  public async retryFailedSMS(smsId: string): Promise<boolean> {
    try {
      const failedSMS = JSON.parse(localStorage.getItem('failed_sms') || '[]');
      const sms = failedSMS.find((s: any) => s.id === smsId);
      
      if (!sms) return false;
      
      const success = await this.sendSMS({
        to: sms.to,
        message: sms.message,
        type: sms.type
      });
      
      if (success) {
        // Remove from failed list
        const updatedFailedSMS = failedSMS.filter((s: any) => s.id !== smsId);
        localStorage.setItem('failed_sms', JSON.stringify(updatedFailedSMS));
        
        toast.success('SMS retry successful!');
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Failed to retry SMS:', error);
      toast.error('SMS retry failed.');
      return false;
    }
  }
}

// Export singleton instance
export const smsService = SMSService.getInstance();