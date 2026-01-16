'use client';

import dynamic from 'next/dynamic';

const SettingsContent = dynamic(() => import('./SettingsContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  ),
});

export default function AdminSettings() {
  return <SettingsContent />;
}
