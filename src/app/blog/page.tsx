import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { connectDB, isDBConfigured } from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { formatDate } from '@/lib/utils';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News, updates, and stories from the Sacred Tree Foundation.',
};

async function getBlogPosts() {
  if (!isDBConfigured()) {
    return [];
  }
  try {
    await connectDB();
    const posts = await BlogPost.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch {
    return [];
  }
}

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
  readingTime: number;
  category: string;
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="heading-1 text-gray-900 mb-6">Blog</h1>
            <p className="text-xl text-gray-600">
              News, updates, and stories from our mission to fight food waste and hunger.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: Post) => (
                <article key={post._id} className="card group">
                  {post.featuredImage && (
                    <Link href={`/blog/${post.slug}`} className="block relative h-48 bg-gray-100 overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readingTime} min read
                      </span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium text-sm"
                    >
                      Read more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Blog Posts Yet</h2>
              <p className="text-gray-500">
                Check back soon for updates and stories from our mission.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
