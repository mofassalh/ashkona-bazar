'use client'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 py-8 border-b border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-400 mb-1">
          <Link href="/" className="hover:text-gray-700">Home</Link> → <span className="text-gray-700">Privacy Policy</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Privacy <span style={{ color: '#1a6b5e' }}>Policy</span></h1>
        <p className="text-gray-400 text-sm mt-1">Last updated: January 2026</p>
      </div>
      <div className="px-4 md:px-8 py-10 max-w-3xl">
        <div className="prose prose-sm text-gray-600 leading-relaxed space-y-6">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as your name, email address, phone number, and delivery address when you place an order or create an account.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to process your orders, send order confirmations, provide customer support, and improve our services. We do not sell your personal information to third parties.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Information Sharing</h2>
            <p>We may share your information with delivery partners to fulfill your orders. We require all third parties to respect the security of your personal data and to treat it in accordance with the law.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information. To exercise these rights, please contact us at info@ashkonabazar.com.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at info@ashkonabazar.com or call us at +880 1800-555-8899.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
