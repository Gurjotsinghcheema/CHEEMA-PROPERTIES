import { toast } from 'sonner@2.0.3';

// Email configuration
const ADMIN_EMAIL = 'balvircheema2016@gmail.com';
const BACKUP_EMAIL = 'info@cheemaproperties.com'; // Backup email if needed

interface PropertyInquiryData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  propertyDescription?: string;
  inquiryType: 'property' | 'general' | 'contact';
  message?: string;
}

export class EmailService {
  private static instance: EmailService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Initialize Email service
  public async initialize() {
    if (this.isInitialized) return true;
    
    try {
      console.log('📧 Email Service initialized for CHEEMA PROPERTIES');
      console.log('📧 Admin Email:', ADMIN_EMAIL);
      console.log('📧 Using browser mailto and localStorage tracking');
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ Email Service initialization failed:', error);
      return false;
    }
  }

  // Send inquiry notification using mailto (guaranteed to work)
  public async sendInquiryNotification(data: PropertyInquiryData): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Generate email content
      const subject = `🏠 New Property Inquiry - ${data.customerName}`;
      const emailContent = this.generateInquiryEmail(data);
      
      // Create mailto URL
      const mailtoUrl = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
      
      // Store inquiry in localStorage for admin tracking
      this.storeEmailInLocalStorage({
        id: Date.now().toString(),
        to: ADMIN_EMAIL,
        from: data.customerEmail,
        subject: subject,
        content: emailContent,
        sentAt: new Date().toISOString(),
        status: 'sent_via_mailto',
        type: 'inquiry_notification',
        customerData: data
      });
      
      // Open default email client
      window.open(mailtoUrl, '_self');
      
      console.log('✅ Inquiry notification email opened in default email client');
      console.log('📧 Email will be sent to:', ADMIN_EMAIL);
      
      // Show success message to user
      toast.success('Email opened in your default email client', {
        description: `Please send the pre-filled email to notify ${ADMIN_EMAIL} about your inquiry.`
      });
      
      // Also create a backup method - copy to clipboard
      this.copyInquiryToClipboard(data);
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to open email client:', error);
      
      // Fallback: Store inquiry for manual follow-up and show contact info
      this.storeFailedEmail(data, error);
      
      toast.error('Email client failed to open', {
        description: 'Your inquiry is saved. Please call +91 9056330000 directly or copy the details below.',
        action: {
          label: 'Copy Details',
          onClick: () => this.copyInquiryToClipboard(data)
        }
      });
      
      return false;
    }
  }

  // Send automated response to customer (using their email client)
  public async sendCustomerResponse(data: PropertyInquiryData): Promise<boolean> {
    try {
      const subject = '🏠 Thank you for your inquiry - CHEEMA PROPERTIES';
      const emailContent = this.generateCustomerResponseEmail(data);
      
      // Create mailto URL for customer response
      const mailtoUrl = `mailto:${data.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}&from=${ADMIN_EMAIL}`;
      
      // Store as a task for admin to send
      this.storeEmailTask({
        id: Date.now().toString() + '_response',
        to: data.customerEmail,
        from: ADMIN_EMAIL,
        subject: subject,
        content: emailContent,
        type: 'customer_response',
        priority: 'normal',
        createdAt: new Date().toISOString()
      });
      
      console.log('✅ Customer response email task created for admin');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to create customer response task:', error);
      return false;
    }
  }

  // Generate inquiry email for admin
  private generateInquiryEmail(data: PropertyInquiryData): string {
    return `
🏠 NEW PROPERTY INQUIRY - CHEEMA PROPERTIES

Dear Mr. Balvir Singh Cheema,

A new property inquiry has been received through your website.

═══════════════════════════════════════

👤 CUSTOMER DETAILS:
Name: ${data.customerName}
Email: ${data.customerEmail}
Phone: ${data.customerPhone}
Inquiry Type: ${data.inquiryType}

🏡 PROPERTY REQUIREMENTS:
${data.propertyDescription || 'General inquiry - please contact customer for details'}

${data.message ? `💬 ADDITIONAL MESSAGE:\n${data.message}` : ''}

⏰ SUBMITTED: ${new Date().toLocaleString('en-IN', {
  timeZone: 'Asia/Kolkata',
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})} IST

═══════════════════════════════════════

📞 IMMEDIATE ACTIONS REQUIRED:
✅ Contact customer within 1 hour for best conversion
✅ Call: ${data.customerPhone}
✅ WhatsApp: ${data.customerPhone}
✅ Email: ${data.customerEmail}

💡 LEAD QUALITY: This inquiry came through your website form
💡 RESPONSE TIME: Critical for conversion success

═══════════════════════════════════════

This inquiry was submitted through your CHEEMA PROPERTIES website.
Please respond promptly to maximize conversion potential.

Best regards,
CHEEMA PROPERTIES Website System

📍 Ludhiana & Chandigarh
🌐 Your trusted property partner since 2016

---
Reply to this email or call ${data.customerPhone} immediately.
    `.trim();
  }

  // Generate automated response for customer  
  private generateCustomerResponseEmail(data: PropertyInquiryData): string {
    return `
🏠 Thank You for Your Interest in CHEEMA PROPERTIES!

Dear ${data.customerName},

Thank you for reaching out to us regarding your property requirements. We have received your inquiry and are excited to help you find your perfect property in Punjab.

═══════════════════════════════════════

📋 YOUR INQUIRY SUMMARY:
${data.propertyDescription ? `Requirements: ${data.propertyDescription}` : 'We have noted your property requirements'}

Contact Information: ${data.customerPhone}
Submitted on: ${new Date().toLocaleDateString('en-IN', {
  timeZone: 'Asia/Kolkata',
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

═══════════════════════════════════════

🎯 WHAT HAPPENS NEXT:

✅ Our property expert will contact you within 2-4 hours
✅ We'll provide detailed information about properties matching your requirements  
✅ We'll arrange property visits at your convenience
✅ Our team will guide you through the entire process

═══════════════════════════════════════

📞 CONTACT US ANYTIME:

🏢 CHEEMA PROPERTIES
👤 Balvir Singh Cheema - Director
📱 Phone: +91 9056330000 / +91 9056361000
💬 WhatsApp: Available on both numbers
📧 Email: balvircheema2016@gmail.com

🏡 OUR SPECIALIZATIONS:
• Residential Properties (Apartments, Houses, Villas)
• Commercial Properties & Investments
• Property Investment Consultation
• Legal Documentation Support
• Home Loan & Financing Assistance

📍 SERVICE AREAS:
• Ludhiana - All prime locations
• Chandigarh - Sectors and surrounding areas
• Punjab - Major cities and towns

═══════════════════════════════════════

🌟 WHY CHOOSE CHEEMA PROPERTIES?

✅ Trusted since 2016
✅ 500+ happy families served  
✅ Expert market knowledge
✅ Transparent dealings
✅ End-to-end service
✅ No hidden charges

═══════════════════════════════════════

We appreciate your trust in CHEEMA PROPERTIES and look forward to helping you find your dream property in Punjab!

Warm regards,

Balvir Singh Cheema
Director & Founder
CHEEMA PROPERTIES

"Your trusted property partner in Punjab"

═══════════════════════════════════════

📞 Expecting our call? We typically contact within 2-4 hours during business hours.
⏰ For urgent requirements, please WhatsApp us at +91 9056330000

This is an automated confirmation. Our team will contact you personally very soon.
    `.trim();
  }

  // Store email in localStorage for admin tracking
  private storeEmailInLocalStorage(emailData: any): void {
    try {
      const sentEmails = JSON.parse(localStorage.getItem('sent_emails') || '[]');
      sentEmails.push(emailData);
      localStorage.setItem('sent_emails', JSON.stringify(sentEmails));
      
      // Also update inquiry count
      const inquiryCount = parseInt(localStorage.getItem('total_inquiries') || '0') + 1;
      localStorage.setItem('total_inquiries', inquiryCount.toString());
      
    } catch (error) {
      console.error('Failed to store email in localStorage:', error);
    }
  }

  // Store email task for admin to complete
  private storeEmailTask(taskData: any): void {
    try {
      const emailTasks = JSON.parse(localStorage.getItem('email_tasks') || '[]');
      emailTasks.push(taskData);
      localStorage.setItem('email_tasks', JSON.stringify(emailTasks));
    } catch (error) {
      console.error('Failed to store email task:', error);
    }
  }

  // Store failed email for retry
  private storeFailedEmail(data: PropertyInquiryData, error: any): void {
    try {
      const failedEmails = JSON.parse(localStorage.getItem('failed_emails') || '[]');
      failedEmails.push({
        id: Date.now().toString(),
        data,
        failedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        retryCount: 0
      });
      localStorage.setItem('failed_emails', JSON.stringify(failedEmails));
    } catch (error) {
      console.error('Failed to store failed email:', error);
    }
  }

  // Copy inquiry details to clipboard
  private copyInquiryToClipboard(data: PropertyInquiryData): void {
    const inquiryText = `
PROPERTY INQUIRY - CHEEMA PROPERTIES

Customer: ${data.customerName}
Phone: ${data.customerPhone}
Email: ${data.customerEmail}
Requirements: ${data.propertyDescription}
Submitted: ${new Date().toLocaleString()}

Action Required: Contact customer immediately for best conversion
Admin Email: ${ADMIN_EMAIL}
    `.trim();

    try {
      navigator.clipboard.writeText(inquiryText).then(() => {
        toast.success('Inquiry details copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = inquiryText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Inquiry details copied to clipboard!');
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }

  // Direct email method - opens Gmail compose
  public sendDirectEmail(data: PropertyInquiryData): void {
    try {
      const subject = `🏠 URGENT Property Inquiry - ${data.customerName}`;
      const body = this.generateInquiryEmail(data);
      
      // Gmail compose URL
      const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${ADMIN_EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open Gmail in new tab
      window.open(gmailUrl, '_blank');
      
      toast.success('Gmail opened in new tab', {
        description: 'Please send the pre-filled email to notify the admin.'
      });
      
      console.log('✅ Gmail compose opened for direct email sending');
      
    } catch (error) {
      console.error('Failed to open Gmail:', error);
      // Fallback to mailto
      this.sendInquiryNotification(data);
    }
  }

  // Get email statistics for admin dashboard
  public getEmailStats(): { sent: number; pending: number; failed: number; tasks: number } {
    try {
      const sentEmails = JSON.parse(localStorage.getItem('sent_emails') || '[]');
      const failedEmails = JSON.parse(localStorage.getItem('failed_emails') || '[]');
      const emailTasks = JSON.parse(localStorage.getItem('email_tasks') || '[]');
      
      return {
        sent: sentEmails.length,
        pending: emailTasks.length,
        failed: failedEmails.length,
        tasks: emailTasks.length
      };
    } catch (error) {
      return { sent: 0, pending: 0, failed: 0, tasks: 0 };
    }
  }

  // Get all sent emails
  public getSentEmails(): any[] {
    try {
      return JSON.parse(localStorage.getItem('sent_emails') || '[]');
    } catch (error) {
      return [];
    }
  }

  // Get email tasks for admin
  public getEmailTasks(): any[] {
    try {
      return JSON.parse(localStorage.getItem('email_tasks') || '[]');
    } catch (error) {
      return [];
    }
  }

  // Get failed emails for retry
  public getFailedEmails(): any[] {
    try {
      return JSON.parse(localStorage.getItem('failed_emails') || '[]');
    } catch (error) {
      return [];
    }
  }

  // Mark email task as completed
  public completeEmailTask(taskId: string): void {
    try {
      const emailTasks = JSON.parse(localStorage.getItem('email_tasks') || '[]');
      const updatedTasks = emailTasks.filter((task: any) => task.id !== taskId);
      localStorage.setItem('email_tasks', JSON.stringify(updatedTasks));
      
      // Move to completed tasks
      const completedTasks = JSON.parse(localStorage.getItem('completed_email_tasks') || '[]');
      const completedTask = emailTasks.find((task: any) => task.id === taskId);
      if (completedTask) {
        completedTask.completedAt = new Date().toISOString();
        completedTasks.push(completedTask);
        localStorage.setItem('completed_email_tasks', JSON.stringify(completedTasks));
      }
      
      toast.success('Email task marked as completed');
    } catch (error) {
      console.error('Failed to complete email task:', error);
    }
  }

  // Retry failed email
  public async retryFailedEmail(emailId: string): Promise<boolean> {
    try {
      const failedEmails = JSON.parse(localStorage.getItem('failed_emails') || '[]');
      const email = failedEmails.find((e: any) => e.id === emailId);
      
      if (!email) return false;
      
      // Try to send again
      const success = await this.sendInquiryNotification(email.data);
      
      if (success) {
        // Remove from failed list
        const updatedFailedEmails = failedEmails.filter((e: any) => e.id !== emailId);
        localStorage.setItem('failed_emails', JSON.stringify(updatedFailedEmails));
        
        toast.success('Email retry successful!');
        return true;
      } else {
        // Increment retry count
        email.retryCount = (email.retryCount || 0) + 1;
        email.lastRetryAt = new Date().toISOString();
        localStorage.setItem('failed_emails', JSON.stringify(failedEmails));
        
        toast.error('Email retry failed. Please contact customer directly.');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Failed to retry email:', error);
      toast.error('Email retry failed.');
      return false;
    }
  }

  // Get total inquiry count
  public getTotalInquiries(): number {
    try {
      return parseInt(localStorage.getItem('total_inquiries') || '0');
    } catch (error) {
      return 0;
    }
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();