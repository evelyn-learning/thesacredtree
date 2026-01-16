import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { connectDB, isDBConfigured } from '@/lib/db';
import { ContactSubmission } from '@/models';
import { ArrowLeft, Mail, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

async function getContacts() {
  if (!isDBConfigured()) return [];
  try {
    await connectDB();
    return await ContactSubmission.find().sort({ createdAt: -1 }).lean();
  } catch {
    return [];
  }
}

export default async function AdminContacts() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const contacts = await getContacts();

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    read: 'bg-yellow-100 text-yellow-800',
    responded: 'bg-green-100 text-green-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-primary-500">Contact Messages</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {contacts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contact messages yet</h3>
            <p className="text-gray-500">Messages from the contact form will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact: any) => (
              <div key={contact._id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[contact.status]}`}>
                      {contact.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(contact.createdAt), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                </div>

                {contact.subject && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700">Subject: </span>
                    <span className="text-sm text-gray-600">{contact.subject}</span>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    href={`mailto:${contact.email}?subject=Re: ${contact.subject || 'Your message to Sacred Tree Foundation'}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600"
                  >
                    <Mail className="w-4 h-4" />
                    Reply
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
