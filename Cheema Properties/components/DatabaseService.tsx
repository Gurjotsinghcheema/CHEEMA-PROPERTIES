// LocalStorage Database Service - Free alternative to paid databases
export class DatabaseService {
  private static instance: DatabaseService;
  private dbName = 'cheema_properties_db';
  private version = 1;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Initialize database
  public async initialize(): Promise<boolean> {
    try {
      // Check if localStorage is available
      if (typeof Storage === 'undefined') {
        console.error('❌ LocalStorage not supported');
        return false;
      }

      // Initialize database structure
      const dbStructure = {
        customers: [],
        properties: [],
        inquiries: [],
        emails: [],
        sms: [],
        appointments: [],
        settings: {
          initialized: true,
          version: this.version,
          lastUpdated: new Date().toISOString()
        }
      };

      // Check if database exists
      const existingDb = localStorage.getItem(this.dbName);
      if (!existingDb) {
        localStorage.setItem(this.dbName, JSON.stringify(dbStructure));
        console.log('✅ Database initialized');
      } else {
        console.log('✅ Database loaded from localStorage');
      }

      return true;
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      return false;
    }
  }

  // Generic CRUD operations
  public async create(collection: string, data: any): Promise<string> {
    try {
      const db = this.getDatabase();
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      const record = {
        id,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (!db[collection]) {
        db[collection] = [];
      }

      db[collection].push(record);
      db.settings.lastUpdated = new Date().toISOString();
      
      this.saveDatabase(db);
      return id;
    } catch (error) {
      console.error(`❌ Failed to create record in ${collection}:`, error);
      throw error;
    }
  }

  public async read(collection: string, id?: string): Promise<any> {
    try {
      const db = this.getDatabase();
      
      if (!db[collection]) {
        return id ? null : [];
      }

      if (id) {
        return db[collection].find((item: any) => item.id === id) || null;
      }

      return db[collection] || [];
    } catch (error) {
      console.error(`❌ Failed to read from ${collection}:`, error);
      throw error;
    }
  }

  public async update(collection: string, id: string, data: any): Promise<boolean> {
    try {
      const db = this.getDatabase();
      
      if (!db[collection]) {
        return false;
      }

      const index = db[collection].findIndex((item: any) => item.id === id);
      if (index === -1) {
        return false;
      }

      db[collection][index] = {
        ...db[collection][index],
        ...data,
        updatedAt: new Date().toISOString()
      };

      db.settings.lastUpdated = new Date().toISOString();
      this.saveDatabase(db);
      
      return true;
    } catch (error) {
      console.error(`❌ Failed to update record in ${collection}:`, error);
      throw error;
    }
  }

  public async delete(collection: string, id: string): Promise<boolean> {
    try {
      const db = this.getDatabase();
      
      if (!db[collection]) {
        return false;
      }

      const index = db[collection].findIndex((item: any) => item.id === id);
      if (index === -1) {
        return false;
      }

      db[collection].splice(index, 1);
      db.settings.lastUpdated = new Date().toISOString();
      this.saveDatabase(db);
      
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete record from ${collection}:`, error);
      throw error;
    }
  }

  // Query operations
  public async query(collection: string, filters: any = {}): Promise<any[]> {
    try {
      const db = this.getDatabase();
      
      if (!db[collection]) {
        return [];
      }

      let results = db[collection];

      // Apply filters
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value !== undefined && value !== null) {
          results = results.filter((item: any) => {
            if (typeof value === 'string') {
              return item[key] && item[key].toString().toLowerCase().includes(value.toLowerCase());
            }
            return item[key] === value;
          });
        }
      });

      return results;
    } catch (error) {
      console.error(`❌ Failed to query ${collection}:`, error);
      throw error;
    }
  }

  // Specific business logic methods
  public async saveCustomer(customerData: any): Promise<string> {
    return await this.create('customers', customerData);
  }

  public async getCustomers(filters: any = {}): Promise<any[]> {
    return await this.query('customers', filters);
  }

  public async updateCustomerStatus(id: string, status: string): Promise<boolean> {
    return await this.update('customers', id, { status });
  }

  public async saveProperty(propertyData: any): Promise<string> {
    return await this.create('properties', propertyData);
  }

  public async getProperties(filters: any = {}): Promise<any[]> {
    return await this.query('properties', filters);
  }

  public async saveInquiry(inquiryData: any): Promise<string> {
    return await this.create('inquiries', inquiryData);
  }

  public async getInquiries(filters: any = {}): Promise<any[]> {
    return await this.query('inquiries', filters);
  }

  public async saveEmail(emailData: any): Promise<string> {
    return await this.create('emails', emailData);
  }

  public async getEmails(filters: any = {}): Promise<any[]> {
    return await this.query('emails', filters);
  }

  public async saveSMS(smsData: any): Promise<string> {
    return await this.create('sms', smsData);
  }

  public async getSMS(filters: any = {}): Promise<any[]> {
    return await this.query('sms', filters);
  }

  public async saveAppointment(appointmentData: any): Promise<string> {
    return await this.create('appointments', appointmentData);
  }

  public async getAppointments(filters: any = {}): Promise<any[]> {
    return await this.query('appointments', filters);
  }

  // Analytics and reporting
  public async getStats(): Promise<any> {
    try {
      const customers = await this.getCustomers();
      const properties = await this.getProperties();
      const inquiries = await this.getInquiries();
      const emails = await this.getEmails();
      const sms = await this.getSMS();
      const appointments = await this.getAppointments();

      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().slice(0, 7);

      return {
        customers: {
          total: customers.length,
          today: customers.filter(c => c.createdAt.includes(today)).length,
          thisMonth: customers.filter(c => c.createdAt.includes(thisMonth)).length,
          byStatus: {
            new: customers.filter(c => c.status === 'new').length,
            contacted: customers.filter(c => c.status === 'contacted').length,
            viewed: customers.filter(c => c.status === 'viewed').length,
            closed: customers.filter(c => c.status === 'closed').length
          }
        },
        properties: {
          total: properties.length,
          available: properties.filter(p => p.status === 'available').length,
          sold: properties.filter(p => p.status === 'sold').length,
          rented: properties.filter(p => p.status === 'rented').length
        },
        inquiries: {
          total: inquiries.length,
          today: inquiries.filter(i => i.createdAt.includes(today)).length,
          thisMonth: inquiries.filter(i => i.createdAt.includes(thisMonth)).length
        },
        communications: {
          emails: {
            total: emails.length,
            sent: emails.filter(e => e.status === 'sent').length,
            failed: emails.filter(e => e.status === 'failed').length
          },
          sms: {
            total: sms.length,
            sent: sms.filter(s => s.status === 'sent').length,
            failed: sms.filter(s => s.status === 'failed').length
          }
        },
        appointments: {
          total: appointments.length,
          upcoming: appointments.filter(a => new Date(a.scheduledDate) > new Date()).length,
          completed: appointments.filter(a => a.status === 'completed').length
        }
      };
    } catch (error) {
      console.error('❌ Failed to get stats:', error);
      throw error;
    }
  }

  // Backup and restore
  public async exportDatabase(): Promise<string> {
    try {
      const db = this.getDatabase();
      return JSON.stringify(db, null, 2);
    } catch (error) {
      console.error('❌ Failed to export database:', error);
      throw error;
    }
  }

  public async importDatabase(data: string): Promise<boolean> {
    try {
      const db = JSON.parse(data);
      this.saveDatabase(db);
      return true;
    } catch (error) {
      console.error('❌ Failed to import database:', error);
      return false;
    }
  }

  // Cleanup and maintenance
  public async cleanup(daysOld: number = 30): Promise<void> {
    try {
      const db = this.getDatabase();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      // Clean up old records
      ['emails', 'sms', 'inquiries'].forEach(collection => {
        if (db[collection]) {
          db[collection] = db[collection].filter((item: any) => 
            new Date(item.createdAt) > cutoffDate
          );
        }
      });

      db.settings.lastUpdated = new Date().toISOString();
      this.saveDatabase(db);
      
      console.log(`✅ Database cleaned up - removed records older than ${daysOld} days`);
    } catch (error) {
      console.error('❌ Failed to cleanup database:', error);
      throw error;
    }
  }

  // Private helper methods
  private getDatabase(): any {
    try {
      const dbString = localStorage.getItem(this.dbName);
      return dbString ? JSON.parse(dbString) : {};
    } catch (error) {
      console.error('❌ Failed to parse database:', error);
      return {};
    }
  }

  private saveDatabase(db: any): void {
    try {
      localStorage.setItem(this.dbName, JSON.stringify(db));
    } catch (error) {
      console.error('❌ Failed to save database:', error);
      throw error;
    }
  }

  // Get database size
  public getDatabaseSize(): { used: number; limit: number; percentage: number } {
    try {
      const dbString = localStorage.getItem(this.dbName) || '';
      const used = new Blob([dbString]).size;
      const limit = 5 * 1024 * 1024; // 5MB typical localStorage limit
      const percentage = (used / limit) * 100;

      return {
        used,
        limit,
        percentage
      };
    } catch (error) {
      console.error('❌ Failed to get database size:', error);
      return { used: 0, limit: 0, percentage: 0 };
    }
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance();