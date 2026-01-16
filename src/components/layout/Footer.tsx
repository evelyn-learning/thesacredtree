import Link from 'next/link';
import Image from 'next/image';
import { Mail, Instagram, Heart } from 'lucide-react';

const footerLinks = {
  organization: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Mission', href: '/mission' },
    { name: 'Team', href: '/team' },
    { name: 'Blog', href: '/blog' },
  ],
  getInvolved: [
    { name: 'Volunteer', href: '/volunteer' },
    { name: 'Donation Drives', href: '/donation-drives' },
    { name: 'Contact', href: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="Sacred Tree Foundation"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-primary-400 font-heading">
                Sacred Tree
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              A non-profit organization dedicated to combating food waste and hunger in our community.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/sacredtreefoundation/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@thesacredtree.org"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Organization Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Organization
            </h3>
            <ul className="space-y-3">
              {footerLinks.organization.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Get Involved
            </h3>
            <ul className="space-y-3">
              {footerLinks.getInvolved.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a
                  href="mailto:info@thesacredtree.org"
                  className="hover:text-white transition-colors"
                >
                  info@thesacredtree.org
                </a>
              </li>
              <li>California, USA</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Sacred Tree Foundation. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-primary-500" /> for our community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
