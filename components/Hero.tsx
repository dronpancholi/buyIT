import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

const SLIDES = [
  {
    id: 1,
    title: "Fresh from the farm",
    subtitle: "Get 20% off on all organic vegetables this weekend.",
    bg: "bg-green-100",
    text: "text-green-900",
    accent: "text-green-700",
    image: "https://picsum.photos/seed/veg/800/400"
  },
  {
    id: 2,
    title: "Midnight cravings?",
    subtitle: "Instant delivery for snacks & beverages. 24/7.",
    bg: "bg-indigo-100",
    text: "text-indigo-900",
    accent: "text-indigo-700",
    image: "https://picsum.photos/seed/snack/800/400"
  },
  {
    id: 3,
    title: "Bakery Specials",
    subtitle: "Freshly baked sourdough and croissants arrived.",
    bg: "bg-orange-100",
    text: "text-orange-900",
    accent: "text-orange-700",
    image: "https://picsum.photos/seed/bake/800/400"
  }
];

export const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <section className="container mx-auto px-4 md:px-6 mb-8 mt-2">
      <div className={`relative overflow-hidden rounded-3xl ${slide.bg} transition-colors duration-700 h-[300px] md:h-[400px] flex items-center`}>
        <div className="relative z-10 w-full md:w-1/2 px-8 md:px-16 flex flex-col items-start gap-4">
          <span className={`px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-xs font-bold uppercase tracking-wider ${slide.accent}`}>
            Featured Promo
          </span>
          <h1 className={`text-4xl md:text-6xl font-black tracking-tight leading-none ${slide.text}`}>
            {slide.title}
          </h1>
          <p className={`text-lg md:text-xl font-medium opacity-80 max-w-sm ${slide.text}`}>
            {slide.subtitle}
          </p>
          <Button size="lg" className="mt-2 shadow-xl group">
            Shop Now <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-full h-full md:w-2/3 pointer-events-none opacity-20 md:opacity-100 mask-image-gradient">
           <img 
            src={slide.image} 
            alt="Banner" 
            className="w-full h-full object-cover mix-blend-overlay md:mix-blend-normal mask-image-left"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} to-transparent md:via-transparent`} />
        </div>
        
        {/* Dots */}
        <div className="absolute bottom-6 left-8 md:left-16 flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                idx === current ? 'bg-secondary w-6 md:w-8' : 'bg-secondary/20 hover:bg-secondary/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};