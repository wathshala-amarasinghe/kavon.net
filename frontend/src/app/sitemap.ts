import { MetadataRoute } from 'next';
import { getProducts } from "@/lib/api";
import { CatalogProduct } from '@/types/product';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kavon.lk';

  // Base routes
  const routes = [
    '',
    '/shop',
    '/collections',
    '/about',
    '/contact',
    '/policies',
    '/faq',
    '/size-guide',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Product routes
  try {
    // Note: This fetch will run during build time if using SSG or at request time for dynamic sitemaps
    const response = await getProducts();
    const products = response.products || [];
    
    const productRoutes = products.map((product: CatalogProduct) => ({
      url: `${baseUrl}/products/${product._id || product.id}`,
      lastModified: new Date(product.updatedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return routes;
  }
}
