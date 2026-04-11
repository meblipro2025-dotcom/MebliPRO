import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.meblipro.pp.ua';

  const serviceSlugs = [
    'kukhni', 'shafi', 'lizhka-transformery', 'pidvisni-stoly', 
    'dityachi-kimnaty', 'ofisni-mebli', 'mebli-dlya-vannikh', 
    'vitalni', 'restoration'
  ];

  const serviceUrls = serviceSlugs.map(slug => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const { data: projects } = await supabase
    .from('projects')
    .select('slug, updated_at')
    .eq('is_published', true);

  const { data: blogs } = await supabase
    .from('blog')
    .select('slug, updated_at');

  const projectUrls = (projects || []).map((p) => ({
    url: `${baseUrl}/portfolio/${p.slug}`,
    lastModified: p.updated_at || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const blogUrls = (blogs || []).map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: b.updated_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const staticRoutes = ['', '/portfolio', '/about', '/#calculator'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  return [...staticRoutes, ...serviceUrls, ...projectUrls, ...blogUrls];
}
