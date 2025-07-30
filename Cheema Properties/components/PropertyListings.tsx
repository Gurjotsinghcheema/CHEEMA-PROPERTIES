import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Search, 
  Filter, 
  MapPin, 
  Home, 
  Car, 
  Bed, 
  Bath, 
  Phone, 
  MessageCircle, 
  Heart,
  Share2,
  ArrowLeft,
  IndianRupee,
  Calendar,
  User,
  Building,
  Star,
  Verified
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  city: 'Ludhiana' | 'Chandigarh';
  type: 'Apartment' | 'House' | 'Villa' | 'Plot' | 'Commercial';
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking: boolean;
  description: string;
  images: string[];
  agent: {
    name: string;
    phone: string;
    verified: boolean;
  };
  features: string[];
  postedDate: string;
  status: 'Available' | 'Sold' | 'Rented';
  yearBuilt?: number;
  furnished?: boolean;
  floor?: number;
  totalFloors?: number;
}

interface PropertyListingsProps {
  onBack: () => void;
}

const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 3BHK Apartment in IT Park Area',
    price: 6500000,
    location: 'IT Park, Ludhiana',
    city: 'Ludhiana',
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    parking: true,
    description: 'Spacious 3BHK apartment with modern amenities, close to IT companies and shopping centers. Perfect for families.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    agent: {
      name: 'Balvir Singh Cheema',
      phone: '+91 9056330000',
      verified: true
    },
    features: ['Gym', 'Swimming Pool', 'Security', 'Power Backup', 'Parking'],
    postedDate: '2025-01-20',
    status: 'Available',
    yearBuilt: 2020,
    furnished: true,
    floor: 5,
    totalFloors: 12
  },
  {
    id: '2',
    title: 'Luxury 4BHK Villa in Sector 17',
    price: 12000000,
    location: 'Sector 17, Chandigarh',
    city: 'Chandigarh',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    parking: true,
    description: 'Premium villa with garden, perfect for luxury living in the heart of Chandigarh.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    agent: {
      name: 'Balvir Singh Cheema',
      phone: '+91 9056361000',
      verified: true
    },
    features: ['Garden', 'Security', 'Power Backup', 'Parking', 'Terrace'],
    postedDate: '2025-01-18',
    status: 'Available',
    yearBuilt: 2019,
    furnished: false,
    floor: 1,
    totalFloors: 2
  },
  {
    id: '3',
    title: '2BHK Independent House in Model Town',
    price: 4500000,
    location: 'Model Town, Ludhiana',
    city: 'Ludhiana',
    type: 'House',
    bedrooms: 2,
    bathrooms: 2,
    area: 900,
    parking: true,
    description: 'Cozy independent house in peaceful locality with all modern amenities.',
    images: [
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    agent: {
      name: 'Balvir Singh Cheema',
      phone: '+91 9056330000',
      verified: true
    },
    features: ['Parking', 'Security', 'Power Backup', 'Garden'],
    postedDate: '2025-01-15',
    status: 'Available',
    yearBuilt: 2018,
    furnished: true,
    floor: 1,
    totalFloors: 1
  },
  {
    id: '4',
    title: 'Commercial Plot in Industrial Area',
    price: 8000000,
    location: 'Industrial Area, Ludhiana',
    city: 'Ludhiana',
    type: 'Plot',
    bedrooms: 0,
    bathrooms: 0,
    area: 500,
    parking: false,
    description: 'Prime commercial plot perfect for industrial or commercial development.',
    images: [
      'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    agent: {
      name: 'Balvir Singh Cheema',
      phone: '+91 9056361000',
      verified: true
    },
    features: ['Commercial Zone', 'Road Access', 'Electricity', 'Water Supply'],
    postedDate: '2025-01-12',
    status: 'Available',
    yearBuilt: undefined,
    furnished: false
  }
];

export function PropertyListings({ onBack }: PropertyListingsProps) {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sampleProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [bedroomsFilter, setBedroomsFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Load properties from localStorage on component mount
  useEffect(() => {
    const savedProperties = localStorage.getItem('cheema_properties');
    if (savedProperties) {
      try {
        const parsed = JSON.parse(savedProperties);
        setProperties([...sampleProperties, ...parsed]);
        setFilteredProperties([...sampleProperties, ...parsed]);
      } catch (error) {
        console.error('Error loading properties from localStorage:', error);
      }
    }
  }, []);

  // Filter properties based on search and filters
  useEffect(() => {
    let filtered = properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = selectedCity === 'all' || property.city === selectedCity;
      const matchesType = selectedType === 'all' || property.type === selectedType;
      const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
      const matchesBedrooms = bedroomsFilter === 'all' || 
                             (bedroomsFilter === '4+' && property.bedrooms >= 4) ||
                             property.bedrooms.toString() === bedroomsFilter;
      
      return matchesSearch && matchesCity && matchesType && matchesPrice && matchesBedrooms && property.status === 'Available';
    });

    setFilteredProperties(filtered);
  }, [searchTerm, selectedCity, selectedType, priceRange, bedroomsFilter, properties]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const handleWhatsAppContact = (phone: string, propertyTitle: string) => {
    const message = encodeURIComponent(`Hi! I'm interested in the property: ${propertyTitle}. Please share more details.`);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handlePhoneCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handlePropertyInquiry = (property: Property) => {
    // Store inquiry in localStorage
    const inquiries = JSON.parse(localStorage.getItem('property_inquiries') || '[]');
    const newInquiry = {
      id: Date.now().toString(),
      propertyId: property.id,
      propertyTitle: property.title,
      inquiredAt: new Date().toISOString(),
      status: 'new'
    };
    inquiries.push(newInquiry);
    localStorage.setItem('property_inquiries', JSON.stringify(inquiries));
    
    // Send automated email notification
    console.log('✅ Property inquiry sent for:', property.title);
    alert('Your inquiry has been sent! Our team will contact you soon.');
  };

  if (selectedProperty) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedProperty(null)}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Property Images */}
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={selectedProperty.images[0]}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {selectedProperty.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {selectedProperty.images.slice(1).map((image, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={image}
                        alt={`${selectedProperty.title} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{selectedProperty.title}</h1>
                  <Badge className="bg-green-100 text-green-800">
                    {selectedProperty.status}
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-slate-700 mb-2">
                  {formatPrice(selectedProperty.price)}
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedProperty.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-gray-500" />
                  <span>{selectedProperty.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-gray-500" />
                  <span>{selectedProperty.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-500" />
                  <span>{selectedProperty.area} sq ft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span>{selectedProperty.parking ? 'Parking' : 'No Parking'}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedProperty.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProperty.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="bg-slate-50">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Property Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-2 font-medium">{selectedProperty.type}</span>
                  </div>
                  {selectedProperty.yearBuilt && (
                    <div>
                      <span className="text-gray-500">Year Built:</span>
                      <span className="ml-2 font-medium">{selectedProperty.yearBuilt}</span>
                    </div>
                  )}
                  {selectedProperty.furnished !== undefined && (
                    <div>
                      <span className="text-gray-500">Furnished:</span>
                      <span className="ml-2 font-medium">{selectedProperty.furnished ? 'Yes' : 'No'}</span>
                    </div>
                  )}
                  {selectedProperty.floor && (
                    <div>
                      <span className="text-gray-500">Floor:</span>
                      <span className="ml-2 font-medium">{selectedProperty.floor}/{selectedProperty.totalFloors}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Agent Contact */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{selectedProperty.agent.name}</h4>
                      {selectedProperty.agent.verified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Verified className="w-4 h-4" />
                          <span className="text-xs">Verified</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">CHEEMA PROPERTIES</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleWhatsAppContact(selectedProperty.agent.phone, selectedProperty.title)}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePhoneCall(selectedProperty.agent.phone)}
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                </div>
                <Button
                  onClick={() => handlePropertyInquiry(selectedProperty)}
                  className="w-full mt-2 bg-slate-600 hover:bg-slate-700 text-white"
                >
                  Send Inquiry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Properties in Punjab</h1>
              <p className="text-gray-600">Find your dream property in Ludhiana & Chandigarh</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-700">{filteredProperties.length}</div>
            <div className="text-sm text-gray-500">Properties Available</div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties by title, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
                <span className="text-sm text-gray-500">
                  {filteredProperties.length} of {properties.length} properties
                </span>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Cities</option>
                      <option value="Ludhiana">Ludhiana</option>
                      <option value="Chandigarh">Chandigarh</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Types</option>
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="Plot">Plot</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <select
                      value={bedroomsFilter}
                      onChange={(e) => setBedroomsFilter(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">Any</option>
                      <option value="1">1 BHK</option>
                      <option value="2">2 BHK</option>
                      <option value="3">3 BHK</option>
                      <option value="4+">4+ BHK</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Price Range</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full p-2 border rounded-md text-xs"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full p-2 border rounded-md text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div onClick={() => setSelectedProperty(property)}>
                <div className="aspect-video rounded-t-lg overflow-hidden">
                  <ImageWithFallback
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {property.status}
                    </Badge>
                  </div>
                  
                  <p className="text-xl font-bold text-slate-700 mb-2">
                    {formatPrice(property.price)}
                  </p>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-3 h-3" />
                        <span>{property.bedrooms} Bed</span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-3 h-3" />
                        <span>{property.bathrooms} Bath</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      <span>{property.area} sq ft</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {property.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {property.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{property.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Posted {new Date(property.postedDate).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1">
                      <Verified className="w-3 h-3 text-green-600" />
                      <span>Verified</span>
                    </div>
                  </div>
                </CardContent>
              </div>
              
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleWhatsAppContact(property.agent.phone, property.title)}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <MessageCircle className="w-3 h-3" />
                    WhatsApp
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePhoneCall(property.agent.phone)}
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-3 h-3" />
                    Call
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCity('all');
              setSelectedType('all');
              setBedroomsFilter('all');
              setPriceRange([0, 50000000]);
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}