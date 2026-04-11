import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = 86400; // Revalidate once per day

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.meblipro.pp.ua';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
