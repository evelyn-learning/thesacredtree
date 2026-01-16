import { Metadata } from 'next';
import VolunteerForm from '@/components/VolunteerForm';
import { Heart, Calendar, Users, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Volunteer',
  description: 'Join the Sacred Tree Foundation as a volunteer and help us fight food waste and hunger in our community.',
};

const benefits = [
  {
    icon: Heart,
    title: 'Make a Difference',
    description: 'Directly impact families facing food insecurity in your community.',
  },
  {
    icon: Calendar,
    title: 'Flexible Schedule',
    description: 'Join donation drives that fit your availability.',
  },
  {
    icon: Users,
    title: 'Community Connection',
    description: 'Meet like-minded individuals passionate about social change.',
  },
  {
    icon: Award,
    title: 'Service Hours',
    description: 'Earn community service hours for school or personal goals.',
  },
];

export default function VolunteerPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="heading-1 text-gray-900 mb-6">Become a Volunteer</h1>
            <p className="text-xl text-gray-600">
              Join our community of volunteers and help us fight food waste while supporting
              families in need. Every helping hand matters.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-500 mb-4">
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="heading-3 text-gray-900 mb-2">Volunteer Application</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we&apos;ll be in touch about upcoming volunteer
                opportunities.
              </p>
              <VolunteerForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
