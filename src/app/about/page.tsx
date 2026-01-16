import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Users, Leaf, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the Sacred Tree Foundation, our story, and our commitment to fighting food waste and hunger.',
};

const values = [
  {
    icon: Heart,
    title: 'Compassion',
    description: 'We believe in serving our community with empathy and care.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Together, we can achieve more than we ever could alone.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'Reducing food waste is key to a healthier planet.',
  },
  {
    icon: Target,
    title: 'Impact',
    description: 'Every small action contributes to meaningful change.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="heading-1 text-gray-900 mb-6">About Us</h1>
            <p className="text-xl text-gray-600">
              The Sacred Tree Foundation is a non-profit organization dedicated to combating
              food waste and hunger in our community.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-2 text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg text-gray-600">
              <p>
                The Sacred Tree Foundation was born from a simple observation: while many families
                struggle with food insecurity, perfectly good produce often goes to waste in
                backyards and farmers&apos; markets across our community.
              </p>
              <p>
                Founded by Vanshika Tyagi, our organization brings together volunteers—primarily
                middle and high school students—to collect surplus fruits and vegetables and
                donate them to local food banks, shelters, and charitable organizations.
              </p>
              <p>
                What started as a small initiative has grown into a movement that has supported
                over 1,000 people and impacted more than 100 shelters. Our weekly donation drives
                continue to make a difference, one bag of produce at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <h2 className="heading-2 text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-500 mb-4">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-500">
        <div className="container-wide text-center">
          <h2 className="heading-2 text-white mb-6">Join Our Mission</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Be part of something bigger. Together, we can make a lasting impact in our community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/volunteer"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-500 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              Become a Volunteer
            </Link>
            <Link
              href="/team"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Meet Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
