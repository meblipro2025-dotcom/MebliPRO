import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mebli-pro.com.ua';

  // Fetch projects
  const { data: projects } = await supabase
    .from('projects')
    .select('slug, updated_at')
    .eq('is_published', true);

  // Fetch blog posts
  const { data: blogs } = await supabase
    .from('blog')
    .select('slug, updated_at');

  const projectUrls = (projects || []).map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
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

  const routes = ['', '/services', '/about', '/#calculator'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  return [...routes, ...projectUrls, ...blogUrls];
}
