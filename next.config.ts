import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.thesacredtree.org',
      },
      {
        protocol: 'https',
        hostname: 'thesacredtree.org',
      },
    ],
  },
};

export default nextConfig;
