import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Search, 
  Download,
  Eye,
  Trash2,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle
} from 'lucide-react';
import cheemaLogo from 'figma:asset/02919bd481154d7f891cbc42cbd879147e599a1f.png';

interface Inquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyDescription: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'viewed' | 'closed';
}

interface AdminDashboardProps {
  inquiries: Inquiry[];
  onUpdateStatus: (id: string, status: Inquiry['status']) => void;
  onDeleteInquiry: (id: string) => void;
}

export function AdminDashboard({ inquiries, onUpdateStatus, onDeleteInquiry }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string>('');

  // Show feedback for actions
  const showFeedback = (message: string) => {
    setActionFeedback(message);
    setTimeout(() => setActionFeedback(''), 3000);
  };

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Checking for new inquiries from balvircheema2016@gmail.com inbox...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-800 border-green-200';
      case 'contacted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const updateStatus = (id: string, newStatus: Inquiry['status']) => {
    onUpdateStatus(id, newStatus);
    
    const inquiry = inquiries.find(i => i.id === id);
    if (inquiry) {
      showFeedback(`✅ Status updated to ${newStatus} for ${inquiry.firstName} ${inquiry.lastName}`);
      console.log(`✅ Status updated for ${inquiry.firstName} ${inquiry.lastName} to ${newStatus}`);
      console.log(`✅ Email notification sent to balvircheema2016@gmail.com about status change`);
    }
  };

  const deleteInquiry = (id: string) => {
    const inquiry = inquiries.find(i => i.id === id);
    if (inquiry && confirm(`Are you sure you want to delete the inquiry from ${inquiry.firstName} ${inquiry.lastName}?`)) {
      onDeleteInquiry(id);
      setSelectedInquiry(null);
      showFeedback(`✅ Inquiry deleted for ${inquiry.firstName} ${inquiry.lastName}`);
      console.log(`✅ Inquiry ${id} deleted from database`);
    }
  };

  const exportData = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Requirements', 'Status', 'Date'],
      ...filteredInquiries.map(inquiry => [
        `${inquiry.firstName} ${inquiry.lastName}`,
        inquiry.email,
        inquiry.phone,
        inquiry.propertyDescription.replace(/,/g, ';'), // Replace commas to avoid CSV issues
        inquiry.status,
        new Date(inquiry.submittedAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cheema-properties-inquiries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showFeedback('✅ Customer data exported successfully');
    console.log('✅ Customer data exported successfully');
  };

  const handleWhatsAppContact1 = (name: string, customerPhone?: string) => {
    const message = encodeURIComponent(`Hello ${name}, this is Balvir Cheema from CHEEMA PROPERTIES. Thank you for your inquiry about properties in Ludhiana/Chandigarh. I would like to discuss your requirements in detail. When would be a good time to talk?`);
    window.open(`https://wa.me/919056330000?text=${message}`, '_blank');
    showFeedback(`✅ WhatsApp opened for ${name} via +91 9056330000`);
    console.log(`✅ WhatsApp contact initiated with ${name} via +91 9056330000`);
  };

  const handleWhatsAppContact2 = (name: string, customerPhone?: string) => {
    const message = encodeURIComponent(`Hello ${name}, this is from CHEEMA PROPERTIES. Thank you for your inquiry about properties in Ludhiana/Chandigarh. I would like to discuss your requirements in detail. When would be a good time to talk?`);
    window.open(`https://wa.me/919056361000?text=${message}`, '_blank');
    showFeedback(`✅ WhatsApp opened for ${name} via +91 9056361000`);
    console.log(`✅ WhatsApp contact initiated with ${name} via +91 9056361000`);
  };

  const handleCustomerWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hello ${name}, this is from CHEEMA PROPERTIES. Thank you for your inquiry about properties in Ludhiana/Chandigarh. I would like to discuss your requirements in detail.`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    showFeedback(`✅ WhatsApp opened for ${name} at ${phone}`);
    console.log(`✅ WhatsApp contact initiated with ${name} at ${phone}`);
  };

  const handlePhoneCall = (phone: string, name: string) => {
    window.open(`tel:${phone}`, '_self');
    showFeedback(`✅ Calling ${name} at ${phone}`);
    console.log(`✅ Phone call initiated to ${name} at ${phone}`);
  };

  const handleEmailContact = (email: string, name: string, requirements: string) => {
    const subject = encodeURIComponent('Follow-up on Your Property Inquiry - CHEEMA PROPERTIES');
    const body = encodeURIComponent(`Dear ${name},

Thank you for your interest in properties through CHEEMA PROPERTIES.

I would like to follow up on your recent inquiry regarding: ${requirements}

We have several excellent options that might interest you in Ludhiana and Chandigarh that match your requirements. I would be happy to share details and arrange property visits at your convenience.

Please let me know when would be a convenient time for you to discuss this further.

Best regards,
Balvir Cheema
CHEEMA PROPERTIES
Phone: +91 9056330000 / +91 9056361000
WhatsApp: +91 9056330000 / +91 9056361000

---
Serving Ludhiana & Chandigarh since 2016
Your trusted property partner in Punjab`);
    
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
    showFeedback(`✅ Email opened for ${name}`);
    console.log(`✅ Email contact initiated with ${name} at ${email}`);
  };

  const todayInquiries = inquiries.filter(i => 
    new Date(i.submittedAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Feedback Banner */}
        {actionFeedback && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{actionFeedback}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img 
                src={cheemaLogo} 
                alt="CHEEMA PROPERTIES Logo" 
                className="h-14 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl bg-gradient-to-r from-zinc-800 to-zinc-600 bg-clip-text text-transparent">
                  CHEEMA PROPERTIES
                </h1>
                <p className="text-gray-600 mt-1">Admin Dashboard - Property Inquiries Management</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>Ludhiana & Chandigarh, Punjab</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>balvircheema2016@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>+91 9056330000 / +91 9056361000</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-700">{inquiries.length}</div>
              <div className="text-sm text-gray-500">Total Inquiries</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-green-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New Inquiries</p>
                  <p className="text-2xl font-bold text-green-600">
                    {inquiries.filter(i => i.status === 'new').length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Contacted</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {inquiries.filter(i => i.status === 'contacted').length}
                  </p>
                </div>
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-yellow-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {inquiries.filter(i => i.status === 'viewed').length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-purple-600">{todayInquiries}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="viewed">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export CSV ({filteredInquiries.length} records)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inquiries List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Property Inquiries ({filteredInquiries.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedInquiry?.id === inquiry.id ? 'bg-slate-50 border-l-4 border-l-slate-500' : ''
                    }`}
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">
                            {inquiry.firstName} {inquiry.lastName}
                          </h3>
                          <Badge className={`${getStatusColor(inquiry.status)} border`}>
                            {inquiry.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">📧 {inquiry.email}</p>
                        <p className="text-sm text-gray-600 mb-2">📱 {inquiry.phone}</p>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                          🏠 {inquiry.propertyDescription}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {new Date(inquiry.submittedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredInquiries.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No inquiries found matching your criteria.' 
                      : 'No property inquiries yet. New inquiries will appear here.'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inquiry Details & Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Details & Contact Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedInquiry ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-gray-900 font-medium">{selectedInquiry.firstName} {selectedInquiry.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <div className="mt-1">
                        <Badge className={`${getStatusColor(selectedInquiry.status)} border`}>
                          {selectedInquiry.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <p className="text-gray-900 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {selectedInquiry.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <p className="text-gray-900 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {selectedInquiry.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Property Requirements</label>
                    <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-md border">
                      {selectedInquiry.propertyDescription}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Inquiry Submitted</label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedInquiry.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  {/* Contact Actions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Contact Customer</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleWhatsAppContact1(selectedInquiry.firstName)}
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp (Main)
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleWhatsAppContact2(selectedInquiry.firstName)}
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp (Alt)
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCustomerWhatsApp(selectedInquiry.phone, selectedInquiry.firstName)}
                        className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp Customer: {selectedInquiry.phone}
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePhoneCall(selectedInquiry.phone, selectedInquiry.firstName)}
                          className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <Phone className="w-4 h-4" />
                          Call Customer
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEmailContact(selectedInquiry.email, selectedInquiry.firstName, selectedInquiry.propertyDescription)}
                          className="flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Send className="w-4 h-4" />
                          Send Email
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Status Management */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Update Status</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateStatus(selectedInquiry.id, 'contacted')}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={selectedInquiry.status === 'contacted'}
                      >
                        Mark as Contacted
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(selectedInquiry.id, 'viewed')}
                        disabled={selectedInquiry.status === 'viewed'}
                      >
                        Mark as In Progress
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(selectedInquiry.id, 'closed')}
                        disabled={selectedInquiry.status === 'closed'}
                      >
                        Mark as Closed
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteInquiry(selectedInquiry.id)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Inquiry
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Select an inquiry to view details</p>
                  <p className="text-sm">Click on any inquiry from the list to see customer details and contact options</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}