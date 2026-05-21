'use client';

import React from 'react';
import {
  Zap,
  Droplet,
  Wind,
  Sparkles,
  BookOpen,
  Hammer,
  Paintbrush,
  Laptop,
  GlassWater,
  Eye
} from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  className?: string;
}

export default function CategoryIcon({ iconName, className = "w-6 h-6 text-blue-600" }: CategoryIconProps) {
  switch (iconName) {
    case 'Zap': return <Zap className={className} />;
    case 'Droplet': return <Droplet className={className} />;
    case 'Wind': return <Wind className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'BookOpen': return <BookOpen className={className} />;
    case 'Hammer': return <Hammer className={className} />;
    case 'Paintbrush': return <Paintbrush className={className} />;
    case 'Laptop': return <Laptop className={className} />;
    case 'GlassWater': return <GlassWater className={className} />;
    case 'Eye': return <Eye className={className} />;
    default: return <Sparkles className={className} />;
  }
}
