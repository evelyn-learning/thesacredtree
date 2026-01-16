import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { Mail, MapPin, Instagram } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Sacred Tree Foundation. We\'d love to hear from you.',
};

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'info@thesacredtree.org',
    href: 'mailto:info@thesacredtree.org',
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'California, USA',
    href: null,
  },
  {
    icon: Instagram,
    title: 'Instagram',
    value: '@sacredtreefoundation',
    href: 'https://www.instagram.com/sacredtreefoundation/',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="heading-1 text-gray-900 mb-6">Contact Us</h1>
            <p className="text-xl text-gray-600">
              Have questions or want to get involved? We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="heading-3 text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8">
                Whether you have questions about volunteering, donation drives, or partnerships,
                we&apos;re here to help.
              </p>
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-primary-500 hover:text-primary-600"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-600">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-xl p-8">
                <h2 className="heading-3 text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
