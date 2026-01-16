import { Metadata } from 'next';
import Link from 'next/link';
import { Target, Leaf, Users, BookOpen, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Mission',
  description: 'Learn about the Sacred Tree Foundation mission to combat food waste and hunger in our communities.',
};

const goals = [
  {
    icon: HeartHandshake,
    title: 'Food Distribution',
    description: 'Deliver fresh produce to communities in need through our network of food banks and shelters.',
  },
  {
    icon: Users,
    title: 'Community Mobilization',
    description: 'Engage volunteers, especially students, in donation drives that make a real difference.',
  },
  {
    icon: BookOpen,
    title: 'Education & Wellness',
    description: 'Provide educational resources and health awareness programs to underserved communities.',
  },
  {
    icon: Leaf,
    title: 'Waste Reduction',
    description: 'Rescue surplus produce that would otherwise go to waste, promoting sustainability.',
  },
];

const priorities = [
  'Build and expand our volunteer network across California and beyond',
  'Partner with local farms, businesses, and community organizations',
  'Increase the frequency and reach of our donation drives',
  'Develop educational programs on nutrition and food sustainability',
  'Create measurable impact in reducing food insecurity',
];

export default function MissionPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="heading-1 text-gray-900 mb-6">Our Mission</h1>
            <p className="text-xl text-gray-600">
              Dedicated to alleviating food insecurity, reducing food waste, and supporting
              underserved communities through collective action.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center">
            <Target className="w-16 h-16 text-primary-500 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 italic">
              &ldquo;Small acts of kindness can create lasting impact.&rdquo;
            </blockquote>
            <p className="text-lg text-gray-600 mt-6">
              We believe that by mobilizing our community—one backyard, one farm, one volunteer
              at a time—we can make a meaningful difference in the fight against hunger and
              food waste.
            </p>
          </div>
        </div>
      </section>

      {/* Core Goals */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <h2 className="heading-2 text-gray-900 text-center mb-12">Our Core Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {goals.map((goal) => (
              <div key={goal.title} className="bg-white rounded-xl p-8 shadow-sm">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-500 mb-4">
                  <goal.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{goal.title}</h3>
                <p className="text-gray-600">{goal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Priorities */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-2 text-gray-900 text-center mb-8">Strategic Priorities</h2>
            <p className="text-lg text-gray-600 text-center mb-10">
              Our roadmap for creating sustainable change in our communities:
            </p>
            <ul className="space-y-4">
              {priorities.map((priority, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 pt-1">{priority}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-500">
        <div className="container-wide text-center">
          <h2 className="heading-2 text-white mb-6">Be Part of Our Mission</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Every volunteer, every donation drive, every bag of produce makes a difference.
            Join us today.
          </p>
          <Link
            href="/volunteer"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-500 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            Get Involved
          </Link>
        </div>
      </section>
    </>
  );
}
