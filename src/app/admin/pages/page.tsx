import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { connectDB, isDBConfigured } from '@/lib/db';
import { Page } from '@/models';
import { ArrowLeft, FileText, Edit, Eye, EyeOff } from 'lucide-react';

// Define the pages that can be edited
const editablePages = [
  { slug: 'home', title: 'Home', path: '/' },
  { slug: 'about', title: 'About', path: '/about' },
  { slug: 'mission', title: 'Our Mission', path: '/mission' },
];

async function getPages() {
  if (!isDBConfigured()) return [];
  try {
    await connectDB();
    return await Page.find().lean();
  } catch {
    return [];
  }
}

export default async function AdminPages() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const savedPages = await getPages();
  const savedPageMap = new Map(savedPages.map((p: any) => [p.slug, p]));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-primary-500">Website Pages</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {editablePages.map((page) => {
                const savedPage = savedPageMap.get(page.slug) as any;
                return (
                  <tr key={page.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{page.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.path}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {savedPage ? (
                        savedPage.isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            <Eye className="w-3 h-3" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                            <EyeOff className="w-3 h-3" />
                            Draft
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                          Default
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {savedPage?.updatedAt
                        ? new Date(savedPage.updatedAt).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/pages/${page.slug}/edit`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="w-4 h-4 inline" />
                        <span className="ml-1">Edit</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Page Editor</h3>
          <p className="text-blue-700">
            Edit the content sections of your main website pages. Changes are saved to the database
            and will override the default page content.
          </p>
        </div>
      </main>
    </div>
  );
}
