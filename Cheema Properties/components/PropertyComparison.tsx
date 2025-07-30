import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  X, 
  Plus, 
  ArrowLeftRight, 
  Home, 
  MapPin, 
  IndianRupee, 
  Bed, 
  Bath, 
  Car,
  Calendar,
  Star,
  Building,
  Ruler,
  Wifi,
  Shield,
  Zap,
  Trees
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
  features: string[];
  yearBuilt?: number;
  furnished?: boolean;
  floor?: number;
  totalFloors?: number;
  agent: {
    name: string;
    phone: string;
    verified: boolean;
  };
}

interface PropertyComparisonProps {
  availableProperties: Property[];
  onClose: () => void;
}

const formatPrice = (price: number): string => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} L`;
  } else {
    return `₹${price.toLocaleString()}`;
  }
};

const getFeatureIcon = (feature: string) => {
  const featureIcons: { [key: string]: React.ReactNode } = {
    'gym': <Building className="w-4 h-4" />,
    'swimming pool': <Trees className="w-4 h-4" />,
    'security': <Shield className="w-4 h-4" />,
    'power backup': <Zap className="w-4 h-4" />,
    'parking': <Car className="w-4 h-4" />,
    'wifi': <Wifi className="w-4 h-4" />,
    'garden': <Trees className="w-4 h-4" />,
    'terrace': <Building className="w-4 h-4" />
  };
  
  return featureIcons[feature.toLowerCase()] || <Star className="w-4 h-4" />;
};

export function PropertyComparison({ availableProperties, onClose }: PropertyComparisonProps) {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [showAddProperty, setShowAddProperty] = useState(false);

  const addProperty = (property: Property) => {
    if (selectedProperties.length < 3 && !selectedProperties.find(p => p.id === property.id)) {
      setSelectedProperties([...selectedProperties, property]);
      setShowAddProperty(false);
    }
  };

  const removeProperty = (propertyId: string) => {
    setSelectedProperties(selectedProperties.filter(p => p.id !== propertyId));
  };

  const getComparisonValue = (property: Property, criterion: string): any => {
    switch (criterion) {
      case 'price': return property.price;
      case 'area': return property.area;
      case 'bedrooms': return property.bedrooms;
      case 'bathrooms': return property.bathrooms;
      case 'yearBuilt': return property.yearBuilt || 0;
      case 'floor': return property.floor || 0;
      default: return 0;
    }
  };

  const getBestInCategory = (criterion: string, higher = true): string | null => {
    if (selectedProperties.length === 0) return null;
    
    const values = selectedProperties.map(p => ({
      id: p.id,
      value: getComparisonValue(p, criterion)
    }));
    
    const best = values.reduce((prev, current) => {
      if (higher) {
        return current.value > prev.value ? current : prev;
      } else {
        return current.value < prev.value ? current : prev;
      }
    });
    
    return best.id;
  };

  const renderComparisonRow = (
    label: string, 
    icon: React.ReactNode, 
    criterion: string, 
    formatter?: (value: any) => string,
    higherIsBetter = true
  ) => {
    const bestPropertyId = getBestInCategory(criterion, higherIsBetter);
    
    return (
      <div className="grid grid-cols-4 gap-4 py-3 border-b">
        <div className="flex items-center gap-2 font-medium text-gray-700">
          {icon}
          <span>{label}</span>
        </div>
        {selectedProperties.map(property => {
          const value = getComparisonValue(property, criterion);
          const isBest = property.id === bestPropertyId && selectedProperties.length > 1;
          
          return (
            <div key={property.id} className={`text-center ${isBest ? 'font-bold text-green-600' : ''}`}>
              {formatter ? formatter(value) : value || 'N/A'}
              {isBest && selectedProperties.length > 1 && (
                <Star className="w-4 h-4 inline ml-1 text-green-600 fill-green-600" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5" />
                  Property Comparison
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Compare up to 3 properties side by side to make the best decision
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Selected Properties Header */}
              <div className="grid grid-cols-4 gap-4">
                <div className="font-medium text-gray-900">Properties</div>
                {selectedProperties.map(property => (
                  <div key={property.id} className="relative">
                    <Card className="border-2">
                      <CardContent className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProperty(property.id)}
                          className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        
                        <div className="aspect-video rounded-lg overflow-hidden mb-3">
                          <ImageWithFallback
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                          {property.title}
                        </h3>
                        
                        <p className="text-lg font-bold text-slate-700 mb-2">
                          {formatPrice(property.price)}
                        </p>
                        
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{property.location}</span>
                        </div>
                        
                        <Badge variant="outline" className="text-xs">
                          {property.type}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                ))}
                
                {/* Add Property Slot */}
                {selectedProperties.length < 3 && (
                  <div>
                    {showAddProperty ? (
                      <Card className="border-2 border-dashed max-h-96 overflow-y-auto">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-sm">Select Property</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowAddProperty(false)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            {availableProperties
                              .filter(p => !selectedProperties.find(sp => sp.id === p.id))
                              .slice(0, 5)
                              .map(property => (
                                <button
                                  key={property.id}
                                  onClick={() => addProperty(property)}
                                  className="w-full text-left p-2 rounded hover:bg-gray-50 border"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                      <ImageWithFallback
                                        src={property.images[0]}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">
                                        {property.title}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {formatPrice(property.price)}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="border-2 border-dashed">
                        <CardContent className="p-8 text-center">
                          <Button
                            onClick={() => setShowAddProperty(true)}
                            variant="ghost"
                            className="h-auto p-4 border-0 text-gray-500 hover:text-gray-700"
                          >
                            <div className="space-y-2">
                              <Plus className="w-8 h-8 mx-auto" />
                              <p className="text-sm">Add Property</p>
                            </div>
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>

              {/* Comparison Table */}
              {selectedProperties.length > 0 && (
                <div className="space-y-0 border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="font-semibold text-gray-900">Detailed Comparison</h3>
                  </div>
                  
                  <div className="divide-y">
                    {/* Basic Information */}
                    <div className="p-4 bg-gray-25">
                      <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                      
                      {renderComparisonRow(
                        'Price',
                        <IndianRupee className="w-4 h-4" />,
                        'price',
                        formatPrice,
                        false
                      )}
                      
                      {renderComparisonRow(
                        'Area (sq ft)',
                        <Ruler className="w-4 h-4" />,
                        'area',
                        (value) => `${value} sq ft`
                      )}
                      
                      {renderComparisonRow(
                        'Price per sq ft',
                        <IndianRupee className="w-4 h-4" />,
                        'pricePerSqFt',
                        (value) => {
                          const property = selectedProperties.find(p => 
                            Math.round(p.price / p.area) === Math.round(value)
                          );
                          return property ? `₹${Math.round(property.price / property.area)}` : 'N/A';
                        },
                        false
                      )}
                      
                      <div className="grid grid-cols-4 gap-4 py-3 border-b">
                        <div className="flex items-center gap-2 font-medium text-gray-700">
                          <Building className="w-4 h-4" />
                          <span>Type</span>
                        </div>
                        {selectedProperties.map(property => (
                          <div key={property.id} className="text-center">
                            {property.type}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 py-3 border-b">
                        <div className="flex items-center gap-2 font-medium text-gray-700">
                          <MapPin className="w-4 h-4" />
                          <span>Location</span>
                        </div>
                        {selectedProperties.map(property => (
                          <div key={property.id} className="text-center text-sm">
                            {property.location}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Property Details</h4>
                      
                      {renderComparisonRow(
                        'Bedrooms',
                        <Bed className="w-4 h-4" />,
                        'bedrooms'
                      )}
                      
                      {renderComparisonRow(
                        'Bathrooms',
                        <Bath className="w-4 h-4" />,
                        'bathrooms'
                      )}
                      
                      {renderComparisonRow(
                        'Year Built',
                        <Calendar className="w-4 h-4" />,
                        'yearBuilt'
                      )}
                      
                      <div className="grid grid-cols-4 gap-4 py-3 border-b">
                        <div className="flex items-center gap-2 font-medium text-gray-700">
                          <Car className="w-4 h-4" />
                          <span>Parking</span>
                        </div>
                        {selectedProperties.map(property => (
                          <div key={property.id} className="text-center">
                            {property.parking ? (
                              <Badge className="bg-green-100 text-green-800">Available</Badge>
                            ) : (
                              <Badge variant="outline">Not Available</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 py-3 border-b">
                        <div className="flex items-center gap-2 font-medium text-gray-700">
                          <Home className="w-4 h-4" />
                          <span>Furnished</span>
                        </div>
                        {selectedProperties.map(property => (
                          <div key={property.id} className="text-center">
                            {property.furnished === undefined ? 'N/A' : 
                             property.furnished ? (
                               <Badge className="bg-blue-100 text-blue-800">Yes</Badge>
                             ) : (
                               <Badge variant="outline">No</Badge>
                             )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features Comparison */}
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Features & Amenities</h4>
                      
                      {/* Get all unique features */}
                      {Array.from(new Set(selectedProperties.flatMap(p => p.features))).map(feature => (
                        <div key={feature} className="grid grid-cols-4 gap-4 py-2 border-b last:border-b-0">
                          <div className="flex items-center gap-2 font-medium text-gray-700">
                            {getFeatureIcon(feature)}
                            <span className="capitalize">{feature}</span>
                          </div>
                          {selectedProperties.map(property => (
                            <div key={property.id} className="text-center">
                              {property.features.includes(feature) ? (
                                <Badge className="bg-green-100 text-green-800">✓</Badge>
                              ) : (
                                <Badge variant="outline">✗</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Contact Information */}
                    <div className="p-4 bg-gray-25">
                      <h4 className="font-medium text-gray-900 mb-3">Contact Agent</h4>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div className="font-medium text-gray-700">Actions</div>
                        {selectedProperties.map(property => (
                          <div key={property.id} className="space-y-2">
                            <Button
                              size="sm"
                              className="w-full bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => {
                                const message = encodeURIComponent(`Hi! I'm interested in ${property.title}. Please share more details.`);
                                window.open(`https://wa.me/${property.agent.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
                              }}
                            >
                              WhatsApp
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              onClick={() => window.open(`tel:${property.agent.phone}`, '_self')}
                            >
                              Call
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* No Properties Selected */}
              {selectedProperties.length === 0 && (
                <div className="text-center py-12">
                  <ArrowLeftRight className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Start Your Property Comparison
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add properties to compare their features, prices, and amenities side by side
                  </p>
                  <Button onClick={() => setShowAddProperty(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Property
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}