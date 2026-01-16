import Image from 'next/image';
import { Heart, Smartphone, Building2, Mail } from 'lucide-react';

export const metadata = {
  title: 'Donate',
  description: 'Support Sacred Tree Foundation in our mission to combat food waste and hunger.',
};

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Support Our Mission
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Your donation helps us rescue food and fight hunger in our community.
            Every dollar makes a difference.
          </p>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Donate via Zelle
                </h2>
                <p className="text-gray-600 max-w-xl mx-auto">
                  We accept donations through Zelle for a quick and secure transfer.
                  Scan the QR code below with your banking app or search for us by name.
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-8">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                  <Image
                    src="/images/zelle-qr-code.png"
                    alt="Zelle QR Code for The Sacred Tree Foundation"
                    width={300}
                    height={350}
                    className="mx-auto"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  How to Donate with Zelle
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Smartphone className="w-6 h-6 text-primary-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Step 1</h4>
                    <p className="text-sm text-gray-600">
                      Open your banking app and find Zelle
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building2 className="w-6 h-6 text-primary-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Step 2</h4>
                    <p className="text-sm text-gray-600">
                      Scan the QR code or search for &quot;The Sacred Tree Foundation&quot;
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-6 h-6 text-primary-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Step 3</h4>
                    <p className="text-sm text-gray-600">
                      Enter your donation amount and send
                    </p>
                  </div>
                </div>
              </div>

              {/* Tax Info */}
              <div className="text-center text-gray-600 text-sm">
                <p>
                  The Sacred Tree Foundation is a 501(c)(3) nonprofit organization.
                  <br />
                  Your donation may be tax-deductible to the extent allowed by law.
                </p>
              </div>
            </div>
          </div>

          {/* Other Ways to Help */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Other Ways to Support Us
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/volunteer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-colors"
              >
                <Heart className="w-5 h-5" />
                Volunteer With Us
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
