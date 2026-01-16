import { Metadata } from 'next';
import Image from 'next/image';
import { connectDB, isDBConfigured } from '@/lib/db';
import DonationDrive from '@/models/DonationDrive';
import { formatDate } from '@/lib/utils';
import { Calendar, MapPin, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Donation Drives',
  description: 'View our past and upcoming food donation drives. Join us in fighting food waste and hunger.',
};

async function getDrives() {
  if (!isDBConfigured()) {
    return { upcoming: [], completed: [] };
  }
  try {
    await connectDB();
    const [upcoming, completed] = await Promise.all([
      DonationDrive.find({ status: 'upcoming' }).sort({ date: 1 }).lean(),
      DonationDrive.find({ status: 'completed' }).sort({ date: -1 }).lean(),
    ]);
    return {
      upcoming: JSON.parse(JSON.stringify(upcoming)),
      completed: JSON.parse(JSON.stringify(completed)),
    };
  } catch {
    return { upcoming: [], completed: [] };
  }
}

type Drive = {
  _id: string;
  title: string;
  date: string;
  location: string;
  venue: string;
  quantity: string;
  description: string;
  images: string[];
};

export default async function DonationDrivesPage() {
  const { upcoming, completed } = await getDrives();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="heading-1 text-gray-900 mb-6">Donation Drives</h1>
            <p className="text-xl text-gray-600">
              Every week, our volunteers come together to collect and donate surplus produce
              to those in need. See our past and upcoming drives below.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Drives */}
      {upcoming.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-wide">
            <h2 className="heading-2 text-gray-900 mb-8">Upcoming Drives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((drive: Drive) => (
                <div key={drive._id} className="card border-2 border-primary-200 bg-primary-50/50">
                  <div className="p-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500 text-white text-xs font-medium mb-4">
                      Upcoming
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{drive.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        {formatDate(drive.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        {drive.venue}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Completed Drives */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <h2 className="heading-2 text-gray-900 mb-8">Past Drives</h2>
          {completed.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completed.map((drive: Drive) => (
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{drive.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {drive.venue}
                      </div>
                      {drive.quantity && (
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          {drive.quantity} collected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No donation drives recorded yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-500">
        <div className="container-wide text-center">
          <h2 className="heading-2 text-white mb-6">Want to Help?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join us at our next donation drive or sign up to become a volunteer.
          </p>
          <a
            href="/volunteer"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-500 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            Become a Volunteer
          </a>
        </div>
      </section>
    </>
  );
}
