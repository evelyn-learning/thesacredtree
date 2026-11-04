import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/Providers';

const siteUrl = 'https://thesacredtree.org';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'Sacred Tree Foundation',
  alternateName: 'The Sacred Tree',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    'A student-led 501(c)(3) nonprofit that rescues surplus fruits and vegetables from backyards and farms and donates them to food banks, churches, and family support organizations in Brentwood and Antioch, CA.',
  foundingDate: '2024-01',
  sameAs: ['https://www.instagram.com/sacredtreefoundation/'],
  email: 'info@thesacredtree.org',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>
          <Header />
          <main className="grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
