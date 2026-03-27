import type { MetadataRoute } from 'next';
import { videos, cars, categories } from './lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoflix-alpha.vercel.app';

  const videoUrls = videos.map((video) => ({
    url: `${baseUrl}/video/${video.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const carUrls = cars.map((car) => ({
    url: `${baseUrl}/cars/${car.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/search?q=${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Generate dynamic compare routes
  const compareUrls = [];
  for (let i = 0; i < cars.length; i++) {
    for (let j = i + 1; j < cars.length; j++) {
      compareUrls.push({
        url: `${baseUrl}/compare/${cars[i].id}-vs-${cars[j].id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      });
    }
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/cars`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...carUrls,
    ...videoUrls,
    ...compareUrls,
    ...categoryUrls,
  ];
}
