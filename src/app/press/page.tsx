import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Press & Media',
  description:
    'Media coverage of the Sacred Tree Foundation, the student-led nonprofit fighting food waste and hunger in Brentwood, CA.',
};

const pressMentions = [
  {
    outlet: 'The Press (Brentwood)',
    date: 'July 3, 2026',
    headline: "High school senior's non-profit helps those in need",
    summary:
      "The Press covered founder Vanshika Tyagi and how Sacred Tree collects surplus fruits and vegetables from local backyards and farms, donating them to food banks, churches, and family support organizations across Brentwood and Antioch.",
    image: '/images/press-clipping-the-press.jpeg',
    articleUrl:
      'https://www.thepress.net/features/high-school-senior-s-non-profit-helps-those-in-need/article_0235d982-4972-48bb-bc15-44f0a6d840c8.html',
    videoId: 'JRERKSziXgE',
    blogSlug: 'sacred-tree-featured-in-the-press',
  },
];

export default function PressPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="heading-1 text-gray-900 mb-6">Press &amp; Media</h1>
            <p className="text-xl text-gray-600">
              See what local media is saying about our mission to rescue surplus produce
              and fight hunger in Brentwood and Antioch.
            </p>
          </div>
        </div>
      </section>

      {/* Press Mentions */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto flex flex-col gap-16">
            {pressMentions.map((mention) => (
              <article key={mention.articleUrl} className="flex flex-col gap-6">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Newspaper className="w-4 h-4 text-primary-500" />
                  <span className="font-medium text-gray-900">{mention.outlet}</span>
                  <span>&middot;</span>
                  <span>{mention.date}</span>
                </div>

                <h2 className="heading-2 text-gray-900">{mention.headline}</h2>
                <p className="text-lg text-gray-600">{mention.summary}</p>

                <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-gray-100">
                  <Image
                    src={mention.image}
                    alt={`${mention.outlet} clipping: ${mention.headline}`}
                    width={1800}
                    height={1392}
                    className="w-full h-auto"
                  />
                </div>

                {mention.videoId && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${mention.videoId}`}
                      title={`${mention.outlet} video interview`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-6">
                  <a
                    href={mention.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Read the full article <ArrowRight className="w-4 h-4" />
                  </a>
                  {mention.blogSlug && (
                    <Link
                      href={`/blog/${mention.blogSlug}`}
                      className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
                    >
                      Read our story <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Media Inquiries CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container-wide text-center">
          <h2 className="heading-3 text-gray-900 mb-4">Media Inquiries</h2>
          <p className="text-gray-600 mb-6">
            Working on a story about food waste, hunger, or student-led nonprofits?
            We&apos;d love to talk.
          </p>
          <a
            href="mailto:info@thesacredtree.org"
            className="inline-flex items-center gap-2 btn-primary"
          >
            <Mail className="w-4 h-4" />
            info@thesacredtree.org
          </a>
        </div>
      </section>
    </>
  );
}
