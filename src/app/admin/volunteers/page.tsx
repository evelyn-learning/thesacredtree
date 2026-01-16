import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { connectDB, isDBConfigured } from '@/lib/db';
import { VolunteerSubmission } from '@/models';
import { ArrowLeft, Heart, Mail } from 'lucide-react';
import { format } from 'date-fns';

async function getVolunteers() {
  if (!isDBConfigured()) return [];
  try {
    await connectDB();
    return await VolunteerSubmission.find().sort({ createdAt: -1 }).lean();
  } catch {
    return [];
  }
}

export default async function AdminVolunteers() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const volunteers = await getVolunteers();

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-primary-500">Volunteer Submissions</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {volunteers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteer submissions yet</h3>
            <p className="text-gray-500">Volunteer signups will appear here when submitted.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {volunteers.map((volunteer: any) => (
                  <tr key={volunteer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{volunteer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a href={`mailto:${volunteer.email}`} className="text-primary-600 hover:underline">
                        {volunteer.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {volunteer.totalVolunteerHours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[volunteer.status]}`}>
                        {volunteer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(volunteer.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href={`mailto:${volunteer.email}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Mail className="w-4 h-4 inline" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {volunteers.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Details</h3>
            <div className="space-y-4">
              {volunteers.slice(0, 5).map((volunteer: any) => (
                <div key={volunteer._id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium text-gray-900">{volunteer.name}</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${statusColors[volunteer.status]}`}>
                        {volunteer.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(volunteer.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{volunteer.communityServiceActivities}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
