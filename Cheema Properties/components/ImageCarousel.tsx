import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Crown, Star, MapPin } from 'lucide-react';

const carouselData = [
  {
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    title: "Luxury Estates in Punjab",
    subtitle: "Premium properties in Ludhiana & Chandigarh's most prestigious locations",
    badge: "Ultra Premium",
    icon: Crown
  },
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    title: "Custom Construction",
    subtitle: "Bespoke homes built by Punjab's most trusted builders",
    badge: "Custom Built",
    icon: Star
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    title: "Prime Investment Locations",
    subtitle: "Strategic properties in Ludhiana & Chandigarh's growth corridors",
    badge: "Investment Grade",
    icon: MapPin
  }
];

export function ImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentData = carouselData[currentSlide];
  const IconComponent = currentData.icon;

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background Images */}
      {carouselData.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1500 ease-in-out ${
            index === currentSlide ? 'opacity-40 scale-105' : 'opacity-0 scale-100'
          }`}
        >
          <ImageWithFallback
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Premium Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
      
      {/* Luxury Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, #334155 2px, transparent 2px)`,
        backgroundSize: '50px 50px'
      }} />
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-8 max-w-2xl">
          {/* Company Brand */}
          <div className="mb-8">
            <h3 className="text-2xl tracking-widest bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              CHEEMA PROPERTIES
            </h3>
            <p className="text-sm tracking-widest text-gray-300 uppercase">
              Punjab's Trusted Real Estate Partner
            </p>
          </div>

          {/* Premium Badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 text-white backdrop-blur-sm border border-slate-500/30">
            <IconComponent className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">
              {currentData.badge}
            </span>
          </div>
          
          {/* Main Content */}
          <div className="transition-all duration-1000 ease-in-out transform space-y-6">
            <h1 className="text-white tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {currentData.title}
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed font-light max-w-lg mx-auto">
              {currentData.subtitle}
            </p>
          </div>

          {/* Location Badge */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 text-slate-200 backdrop-blur-sm border border-slate-600/30">
            <MapPin className="w-4 h-4" />
            <span className="text-sm tracking-wide">Ludhiana & Chandigarh, Punjab</span>
          </div>
          
          {/* Slide Indicators */}
          <div className="flex justify-center mt-12 space-x-3">
            {carouselData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-500 rounded-full ${
                  index === currentSlide 
                    ? 'w-12 h-3 bg-gradient-to-r from-slate-400 to-slate-500' 
                    : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-slate-400/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-tl from-slate-400/10 to-transparent rounded-full blur-3xl" />
        </div>
      </div>
      
      {/* Premium Border */}
      <div className="absolute inset-0 border border-gradient-to-r from-transparent via-slate-400/20 to-transparent pointer-events-none" />
    </div>
  );
}