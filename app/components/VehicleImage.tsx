"use client";

import React, { useState, useEffect } from "react";

interface VehicleImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export default function VehicleImage({ src, alt, className = "", aspectRatio = "aspect-video" }: VehicleImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isFallback, setIsFallback] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  // High-availability stable assets
  const primaryFallback = `https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800`;
  const secondaryFallback = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800`;

  useEffect(() => {
    setImgSrc(src);
    setIsFallback(false);
    setIsFailed(false);
  }, [src]);

  const handleError = () => {
    if (!isFallback) {
      setImgSrc(primaryFallback);
      setIsFallback(true);
    } else if (!isFailed) {
      setImgSrc(secondaryFallback);
      setIsFailed(true);
    }
  };

  return (
    <div className={`relative ${aspectRatio} bg-[#0a0a0a] overflow-hidden ${className}`}>
      {/* Neural Scan Overlay for Loading/Error */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(229,9,20,0.05),transparent)] animate-pulse" />
      
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-700 ${isFailed ? 'grayscale opacity-30 scale-110' : ''}`}
      />

      {/* Extreme Fallback UI if everything fails */}
      {isFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md border border-accent/20">
           <div className="w-12 h-12 rounded-full border border-accent/40 flex items-center justify-center mb-2 animate-pulse">
              <span className="text-accent text-xs font-black">AI</span>
           </div>
           <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Scanning Fleet...</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
    </div>
  );
}
