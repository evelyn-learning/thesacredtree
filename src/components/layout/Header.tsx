'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Menu, X, Heart, Settings, ChevronDown } from 'lucide-react';

type NavItem = {
  name: string;
  href?: string;
  children?: { name: string; href: string }[];
};

const navigation: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Team', href: '/team' },
  { name: 'Our Mission', href: '/mission' },
  { name: 'Donation Drives', href: '/donation-drives' },
  { name: 'Volunteer', href: '/volunteer' },
  {
    name: 'Resources',
    children: [
      { name: 'Blog', href: '/blog' },
      { name: 'Press', href: '/press' },
    ],
  },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: session } = useSession();

  const openResources = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setResourcesOpen(true);
  };

  const scheduleCloseResources = () => {
    closeTimeout.current = setTimeout(() => setResourcesOpen(false), 150);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Sacred Tree Foundation"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-bold text-primary-500 font-heading">
              Sacred Tree
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) =>
              item.children ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={openResources}
                  onMouseLeave={scheduleCloseResources}
                >
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors"
                    aria-expanded={resourcesOpen}
                    onClick={() => setResourcesOpen((open) => !open)}
                  >
                    {item.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {resourcesOpen && (
                    <div className="absolute top-full left-0 pt-3 w-40">
                      <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50 transition-colors"
                            onClick={() => setResourcesOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href!}
                  className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {session && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            )}
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Heart className="w-4 h-4" />
              Donate
            </Link>
            <Link href="/volunteer" className="btn-primary">
              Join Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              {navigation.map((item) =>
                item.children ? (
                  <div key={item.name} className="flex flex-col gap-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {item.name}
                    </span>
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="pl-2 text-base font-medium text-gray-600 hover:text-primary-500 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href!}
                    className="text-base font-medium text-gray-600 hover:text-primary-500 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
              {session && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 text-base font-medium text-gray-600 hover:text-primary-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
              )}
              <div className="flex flex-col gap-3 mt-4">
                <Link
                  href="/donate"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="w-4 h-4" />
                  Donate
                </Link>
                <Link
                  href="/volunteer"
                  className="btn-primary text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
