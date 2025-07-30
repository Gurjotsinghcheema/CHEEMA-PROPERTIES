import React, { useEffect } from 'react';
import { Toaster, toast } from 'sonner@2.0.3';

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export class NotificationSystem {
  private static instance: NotificationSystem;
  private notifications: NotificationData[] = [];
  private listeners: ((notifications: NotificationData[]) => void)[] = [];

  private constructor() {
    this.loadNotifications();
  }

  public static getInstance(): NotificationSystem {
    if (!NotificationSystem.instance) {
      NotificationSystem.instance = new NotificationSystem();
    }
    return NotificationSystem.instance;
  }

  // Show different types of notifications
  public showSuccess(title: string, message: string, action?: { label: string; onClick: () => void }): void {
    const notification: NotificationData = {
      id: Date.now().toString(),
      type: 'success',
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      action
    };

    this.addNotification(notification);
    
    toast.success(title, {
      description: message,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined
    });
  }

  public showError(title: string, message: string, action?: { label: string; onClick: () => void }): void {
    const notification: NotificationData = {
      id: Date.now().toString(),
      type: 'error',
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      actionRequired: true,
      action
    };

    this.addNotification(notification);
    
    toast.error(title, {
      description: message,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined
    });
  }

  public showInfo(title: string, message: string, action?: { label: string; onClick: () => void }): void {
    const notification: NotificationData = {
      id: Date.now().toString(),
      type: 'info',
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      action
    };

    this.addNotification(notification);
    
    toast.info(title, {
      description: message,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined
    });
  }

  public showWarning(title: string, message: string, action?: { label: string; onClick: () => void }): void {
    const notification: NotificationData = {
      id: Date.now().toString(),
      type: 'warning',
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      actionRequired: true,
      action
    };

    this.addNotification(notification);
    
    toast.warning(title, {
      description: message,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined
    });
  }

  // Business-specific notifications
  public notifyNewInquiry(customerName: string, propertyType: string): void {
    this.showSuccess(
      'New Property Inquiry',
      `${customerName} is interested in ${propertyType}`,
      {
        label: 'View Details',
        onClick: () => {
          // Navigate to admin panel
          console.log('Navigating to admin panel...');
        }
      }
    );
  }

  public notifyEmailSent(recipientName: string, emailType: string): void {
    this.showSuccess(
      'Email Sent',
      `${emailType} sent to ${recipientName}`,
      {
        label: 'View Email',
        onClick: () => {
          console.log('Opening email details...');
        }
      }
    );
  }

  public notifyEmailFailed(recipientName: string, error: string): void {
    this.showError(
      'Email Failed',
      `Failed to send email to ${recipientName}: ${error}`,
      {
        label: 'Retry',
        onClick: () => {
          console.log('Retrying email...');
        }
      }
    );
  }

  public notifySMSSent(recipientName: string, smsType: string): void {
    this.showSuccess(
      'SMS Sent',
      `${smsType} sent to ${recipientName}`,
      {
        label: 'View SMS',
        onClick: () => {
          console.log('Opening SMS details...');
        }
      }
    );
  }

  public notifySMSFailed(recipientName: string, error: string): void {
    this.showError(
      'SMS Failed',
      `Failed to send SMS to ${recipientName}: ${error}`,
      {
        label: 'Retry',
        onClick: () => {
          console.log('Retrying SMS...');
        }
      }
    );
  }

  public notifyPropertyAdded(propertyTitle: string): void {
    this.showSuccess(
      'Property Added',
      `${propertyTitle} has been added to listings`,
      {
        label: 'View Property',
        onClick: () => {
          console.log('Opening property details...');
        }
      }
    );
  }

  public notifyAppointmentScheduled(customerName: string, date: string): void {
    this.showInfo(
      'Appointment Scheduled',
      `Property visit scheduled with ${customerName} on ${date}`,
      {
        label: 'View Calendar',
        onClick: () => {
          console.log('Opening calendar...');
        }
      }
    );
  }

  public notifySystemUpdate(version: string): void {
    this.showInfo(
      'System Update',
      `CHEEMA PROPERTIES system updated to version ${version}`,
      {
        label: 'View Changes',
        onClick: () => {
          console.log('Opening changelog...');
        }
      }
    );
  }

  public notifyLowStorage(): void {
    this.showWarning(
      'Low Storage',
      'Local storage is running low. Consider exporting data.',
      {
        label: 'Export Data',
        onClick: () => {
          console.log('Exporting database...');
        }
      }
    );
  }

  public notifyServiceOnline(serviceName: string): void {
    this.showSuccess(
      'Service Online',
      `${serviceName} is now online and ready`,
      {
        label: 'View Status',
        onClick: () => {
          console.log('Opening service status...');
        }
      }
    );
  }

  public notifyServiceOffline(serviceName: string): void {
    this.showError(
      'Service Offline',
      `${serviceName} is currently offline`,
      {
        label: 'Retry Connection',
        onClick: () => {
          console.log('Retrying service connection...');
        }
      }
    );
  }

  // Notification management
  private addNotification(notification: NotificationData): void {
    this.notifications.unshift(notification);
    
    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }
    
    this.saveNotifications();
    this.notifyListeners();
  }

  public markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  public markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.notifyListeners();
  }

  public deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
    this.notifyListeners();
  }

  public clearAllNotifications(): void {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  public getNotifications(): NotificationData[] {
    return this.notifications;
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  public getNotificationsByType(type: NotificationData['type']): NotificationData[] {
    return this.notifications.filter(n => n.type === type);
  }

  // Subscription management
  public subscribe(listener: (notifications: NotificationData[]) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // Persistence
  private loadNotifications(): void {
    try {
      const saved = localStorage.getItem('cheema_notifications');
      if (saved) {
        this.notifications = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      this.notifications = [];
    }
  }

  private saveNotifications(): void {
    try {
      localStorage.setItem('cheema_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  // Cleanup old notifications
  public cleanupOldNotifications(daysOld: number = 7): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    this.notifications = this.notifications.filter(n => 
      new Date(n.timestamp) > cutoffDate
    );
    
    this.saveNotifications();
    this.notifyListeners();
  }

  // Auto-cleanup setup
  public startAutoCleanup(): void {
    // Clean up old notifications every hour
    setInterval(() => {
      this.cleanupOldNotifications(7);
    }, 60 * 60 * 1000);
  }
}

// React component for notifications
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const notificationSystem = NotificationSystem.getInstance();

  useEffect(() => {
    // Start auto-cleanup
    notificationSystem.startAutoCleanup();

    // Example: Show system online notification
    notificationSystem.notifyServiceOnline('CHEEMA PROPERTIES System');

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          },
        }}
        expand={true}
        richColors
      />
    </>
  );
}

// Export singleton instance
export const notificationSystem = NotificationSystem.getInstance();