"use client";

import { useState, useEffect } from "react";
import { fetchRealCarImage, getCarThumbnailUrl, getCarPlaceholderDataUri } from "@/app/lib/car-images";

interface Props {
  make: string;
  model: string;
  year?: number;
  existingUrl?: string;
  className?: string;
  alt?: string;
}

/**
 * Car image component that tries:
 * 1. Provided existing URL (e.g. from Supabase DB — often a real photo)
 * 2. Wikipedia real photograph
 * 3. imagin.studio 3D render
 * 4. SVG placeholder
 */
export default function RealCarImage({ make, model, year = 2026, existingUrl, className = "", alt }: Props) {
  const [src, setSrc] = useState(existingUrl || getCarThumbnailUrl(make, model));
  const [tried, setTried] = useState<Set<string>>(new Set());

  useEffect(() => {
    // If we have an existing URL that seems like a real photo, use it
    if (existingUrl && !existingUrl.includes("imagin.studio") && !existingUrl.startsWith("data:")) {
      setSrc(existingUrl);
      return;
    }

    // Try to fetch a real photo from Wikipedia
    let cancelled = false;
    fetchRealCarImage(make, model, year).then((url) => {
      if (!cancelled && url) {
        setSrc(url);
      }
    });
    return () => { cancelled = true; };
  }, [make, model, year, existingUrl]);

  const handleError = () => {
    const newTried = new Set(tried);
    newTried.add(src);
    setTried(newTried);

    // Fallback chain
    const fallbacks = [
      existingUrl,
      getCarThumbnailUrl(make, model),
      getCarPlaceholderDataUri(make, model, year),
    ].filter((url): url is string => !!url && !newTried.has(url));

    if (fallbacks.length > 0) {
      setSrc(fallbacks[0]);
    }
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || `${year} ${make} ${model}`}
      className={className}
      onError={handleError}
    />
  );
}
