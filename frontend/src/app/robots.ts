import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/checkout/', '/order-success/', '/dashboard/'],
    },
    sitemap: 'https://kavon.lk/sitemap.xml',
  };
}
