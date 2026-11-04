import { MetadataRoute } from 'next';
import { connectDB, isDBConfigured } from '@/lib/db';
import BlogPost from '@/models/BlogPost';

// Not a NEXT_PUBLIC_ var on purpose: this file is server-only, and NEXT_PUBLIC_ values
// get inlined at build time (i.e. with whatever .env.local happens to be on the build
// machine), which breaks this when building locally and deploying to a different domain.
export const dynamic = 'force-dynamic';

const baseUrl = 'https://thesacredtree.org';

const staticRoutes = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/team', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/mission', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/donation-drives', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/volunteer', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/press', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/donate', priority: 0.6, changeFrequency: 'yearly' as const },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' as const },
];

async function getPublishedBlogPosts() {
  if (!isDBConfigured()) {
    return [];
  }
  try {
    await connectDB();
    const posts = await BlogPost.find({ status: 'published' }, 'slug updatedAt publishedAt').lean();
    return JSON.parse(JSON.stringify(posts));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedBlogPosts();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map(
    (post: { slug: string; updatedAt?: string; publishedAt?: string }) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || Date.now()),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })
  );

  return [...staticEntries, ...blogEntries];
}
