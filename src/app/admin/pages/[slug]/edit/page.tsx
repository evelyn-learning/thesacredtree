'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface PageSection {
  id: string;
  type: 'hero' | 'content' | 'cta' | 'features';
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
}

const pageInfo: Record<string, { title: string; path: string }> = {
  home: { title: 'Home', path: '/' },
  about: { title: 'About', path: '/about' },
  mission: { title: 'Our Mission', path: '/mission' },
};

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const info = pageInfo[slug] || { title: slug, path: `/${slug}` };

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: info.title,
    description: '',
    isPublished: true,
    sections: [] as PageSection[],
  });

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch(`/api/admin/pages/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.title || info.title,
            description: data.description || '',
            isPublished: data.isPublished !== false,
            sections: data.sections || [],
          });
        }
      } catch {
        // Page doesn't exist yet, use defaults
      } finally {
        setFetching(false);
      }
    }
    fetchPage();
  }, [slug, info.title]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, ...formData }),
      });

      if (!res.ok) {
        // If page doesn't exist, create it
        const createRes = await fetch('/api/admin/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, ...formData }),
        });

        if (!createRes.ok) {
          const result = await createRes.json();
          throw new Error(result.error || 'Failed to save page');
        }
      }

      router.push('/admin/pages');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function addSection(type: PageSection['type']) {
    const newSection: PageSection = {
      id: generateId(),
      type,
      title: '',
      content: '',
    };
    setFormData({
      ...formData,
      sections: [...formData.sections, newSection],
    });
  }

  function updateSection(id: string, updates: Partial<PageSection>) {
    setFormData({
      ...formData,
      sections: formData.sections.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    });
  }

  function removeSection(id: string) {
    setFormData({
      ...formData,
      sections: formData.sections.filter((s) => s.id !== id),
    });
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/pages" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-primary-500">Edit: {info.title}</h1>
            </div>
            <a
              href={info.path}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:underline"
            >
              View Page
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
          )}

          {/* Page Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Page Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description (SEO)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                  Use custom content (override default page)
                </label>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Content Sections</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addSection('hero')}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  + Hero
                </button>
                <button
                  type="button"
                  onClick={() => addSection('content')}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  + Content
                </button>
                <button
                  type="button"
                  onClick={() => addSection('cta')}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  + CTA
                </button>
              </div>
            </div>

            {formData.sections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No custom sections yet. Add sections above or the default page content will be used.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500 uppercase">
                          {section.type} Section
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSection(section.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={section.title || ''}
                          onChange={(e) => updateSection(section.id, { title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      {section.type === 'hero' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            value={section.subtitle || ''}
                            onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content
                        </label>
                        <textarea
                          value={section.content || ''}
                          onChange={(e) => updateSection(section.id, { content: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <ImageUpload
                        value={section.image || ''}
                        onChange={(image) => updateSection(section.id, { image })}
                        folder="pages"
                        label="Section Image"
                      />

                      {(section.type === 'hero' || section.type === 'cta') && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Button Text
                            </label>
                            <input
                              type="text"
                              value={section.buttonText || ''}
                              onChange={(e) => updateSection(section.id, { buttonText: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Button Link
                            </label>
                            <input
                              type="text"
                              value={section.buttonLink || ''}
                              onChange={(e) => updateSection(section.id, { buttonLink: e.target.value })}
                              placeholder="/volunteer"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/pages"
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Page'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
