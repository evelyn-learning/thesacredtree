import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Sacred Tree Foundation | Fighting Food Waste & Hunger',
    template: '%s | Sacred Tree Foundation',
  },
  description:
    'A non-profit organization dedicated to combating food waste and hunger in our community by collecting surplus fruits and donating them to food banks.',
  keywords: [
    'food bank',
    'food rescue',
    'volunteer',
    'non-profit',
    'food waste',
    'hunger',
    'California',
    'donation',
  ],
  authors: [{ name: 'Sacred Tree Foundation' }],
  openGraph: {
    title: 'Sacred Tree Foundation',
    description:
      'Combating food waste and hunger in our community through food rescue and donation.',
    url: 'https://thesacredtree.org',
    siteName: 'Sacred Tree Foundation',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sacred Tree Foundation',
    description: 'Combating food waste and hunger in our community.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
