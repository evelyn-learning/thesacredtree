import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { connectDB, isDBConfigured } from '@/lib/db';
import {
  DonationDrive,
  TeamMember,
  BlogPost,
  VolunteerSubmission,
  ContactSubmission,
} from '@/models';
import {
  Calendar,
  Users,
  FileText,
  Heart,
  Mail,
  Plus,
  LogOut,
  Settings,
} from 'lucide-react';

async function getStats() {
  if (!isDBConfigured()) {
    return {
      drives: 0,
      team: 0,
      posts: 0,
      volunteers: 0,
      contacts: 0,
    };
  }

  try {
    await connectDB();
    const [drives, team, posts, volunteers, contacts] = await Promise.all([
      DonationDrive.countDocuments(),
      TeamMember.countDocuments(),
      BlogPost.countDocuments(),
      VolunteerSubmission.countDocuments({ status: 'new' }),
      ContactSubmission.countDocuments({ status: 'new' }),
    ]);
    return { drives, team, posts, volunteers, contacts };
  } catch {
    return { drives: 0, team: 0, posts: 0, volunteers: 0, contacts: 0 };
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  const stats = await getStats();

  const statCards = [
    { label: 'Donation Drives', value: stats.drives, icon: Calendar, href: '/admin/donation-drives' },
    { label: 'Team Members', value: stats.team, icon: Users, href: '/admin/team' },
    { label: 'Blog Posts', value: stats.posts, icon: FileText, href: '/admin/blog' },
    { label: 'New Volunteers', value: stats.volunteers, icon: Heart, href: '/admin/volunteers', highlight: stats.volunteers > 0 },
    { label: 'New Messages', value: stats.contacts, icon: Mail, href: '/admin/contacts', highlight: stats.contacts > 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-primary-500">Sacred Tree Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user?.email}
              </span>
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <Link
                href="/api/auth/signout"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Welcome back! Here&apos;s an overview of your site.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${
                stat.highlight ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.highlight ? 'text-primary-500' : 'text-gray-400'}`} />
                {stat.highlight && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded">
                    New
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/donation-drives/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Donation Drive
            </Link>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Blog Post
            </Link>
            <Link
              href="/admin/team/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Team Member
            </Link>
          </div>
        </div>

        {/* Note about admin features */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Admin Panel</h3>
          <p className="text-yellow-700">
            The admin panel is set up with basic functionality. You can view stats and access
            the main sections. For full CRUD operations, additional pages can be added as needed.
          </p>
        </div>
      </main>
    </div>
  );
}
