import Link from 'next/link';
import Image from 'next/image';
import { Heart, Users, Building, Calendar, ArrowRight } from 'lucide-react';
import { connectDB, isDBConfigured } from '@/lib/db';
import DonationDrive from '@/models/DonationDrive';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const stats = [
  { label: 'People Supported', value: '1,000+', icon: Users },
  { label: 'Shelters Impacted', value: '100+', icon: Building },
  { label: 'Donation Drives', value: '50+', icon: Calendar },
  { label: 'Community Partners', value: '20+', icon: Heart },
];

async function getRecentDrives() {
  if (!isDBConfigured()) {
    return [];
  }
  try {
    await connectDB();
    const drives = await DonationDrive.find({ status: 'completed' })
      .sort({ date: -1 })
      .limit(6)
      .lean();
    return JSON.parse(JSON.stringify(drives));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const recentDrives = await getRecentDrives();

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 overflow-hidden">
        <div className="container-wide py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="heading-1 text-gray-900 mb-6">
              Fighting <span className="text-primary-500">Food Waste</span> &{' '}
              <span className="text-primary-500">Hunger</span> Together
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We collect surplus fruits from neighborhood backyards and farmers&apos; markets,
              donating them to food banks to support families in need. Join us in making a difference.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/volunteer" className="btn-primary">
                Become a Volunteer
              </Link>
              <Link href="/donation-drives" className="btn-secondary">
                View Our Drives
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-100/50 to-transparent -z-10" />
      </section>

      {/* Impact Stats */}
      <section className="bg-white py-16">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-500 mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              The Sacred Tree Foundation is dedicated to alleviating food insecurity, reducing food waste,
              and supporting underserved communities. We believe that small acts of kindness can create
              lasting impact in our neighborhoods.
            </p>
            <Link
              href="/mission"
              className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
            >
              Learn more about our mission <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Donation Drives */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="flex justify-between items-center mb-10">
            <h2 className="heading-2 text-gray-900">Recent Donation Drives</h2>
            <Link
              href="/donation-drives"
              className="hidden md:inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
            >
              View all drives <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentDrives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentDrives.map((drive: { _id: string; title: string; date: string; venue: string; quantity: string; images: string[] }) => (
                <div key={drive._id} className="card">
                  {drive.images?.[0] && (
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={drive.images[0]}
                        alt={drive.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-sm text-primary-500 font-medium mb-2">
                      {formatDate(drive.date)}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {drive.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{drive.venue}</span>
                      {drive.quantity && <span>• {drive.quantity}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No donation drives yet. Check back soon for updates!
              </p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/donation-drives" className="btn-secondary">
              View All Drives
            </Link>
          </div>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="section-padding bg-primary-500">
        <div className="container-wide text-center">
          <h2 className="heading-2 text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our community of volunteers and help us fight food waste while supporting
            families in need. Every helping hand matters.
          </p>
          <Link
            href="/volunteer"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-500 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            Become a Volunteer
          </Link>
        </div>
      </section>
    </>
  );
}
