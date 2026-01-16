import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { connectDB, isDBConfigured } from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { formatDate } from '@/lib/utils';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  if (!isDBConfigured()) {
    return null;
  }
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug, status: 'published' }).lean();
    return post ? JSON.parse(JSON.stringify(post)) : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* Back Link */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-wide py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </section>

      {/* Article */}
      <article className="section-padding bg-white">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} min read
                </span>
                {post.category && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-600 rounded text-xs font-medium">
                    {post.category}
                  </span>
                )}
              </div>
              <h1 className="heading-1 text-gray-900 mb-4">{post.title}</h1>
              <p className="text-xl text-gray-600">{post.excerpt}</p>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose-custom"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Author */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-500">
                Written by <span className="font-medium text-gray-900">{post.author}</span>
              </p>
            </footer>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container-wide text-center">
          <h2 className="heading-3 text-gray-900 mb-4">Want to Get Involved?</h2>
          <p className="text-gray-600 mb-6">
            Join us in our mission to fight food waste and hunger.
          </p>
          <Link href="/volunteer" className="btn-primary">
            Become a Volunteer
          </Link>
        </div>
      </section>
    </>
  );
}
