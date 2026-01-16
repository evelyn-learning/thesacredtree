'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Save, Eye, EyeOff } from 'lucide-react';

export default function SettingsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Redirecting...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: "New passwords don't match" });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage your account settings</p>
        </div>

        {/* Password Change Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="label">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  id="currentPassword"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="input pr-10"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="label">
                New Password
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="input"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm New Password
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPasswords ? 'Hide passwords' : 'Show passwords'}
              </button>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Account Info */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="text-gray-900">{session.user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <span className="text-gray-900">{session.user?.name || 'Admin'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
