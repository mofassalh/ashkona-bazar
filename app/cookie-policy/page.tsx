'use client'
import Link from 'next/link'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 py-8 border-b border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-400 mb-1">
          <Link href="/" className="hover:text-gray-700">Home</Link> → <span className="text-gray-700">Cookie Policy</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Cookie <span style={{ color: '#1a6b5e' }}>Policy</span></h1>
        <p className="text-gray-400 text-sm mt-1">Last updated: January 2026</p>
      </div>
      <div className="px-4 md:px-8 py-10 max-w-3xl">
        <div className="prose prose-sm text-gray-600 leading-relaxed space-y-6">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. What Are Cookies</h2>
            <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and shopping cart.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. How We Use Cookies</h2>
            <p>We use cookies to keep your shopping cart items saved, remember your preferences, analyze site traffic, and improve our website performance.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Types of Cookies We Use</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly, including shopping cart functionality.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences for a better experience.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Managing Cookies</h2>
            <p>You can control and manage cookies through your browser settings. Please note that disabling cookies may affect the functionality of our website, including your shopping cart.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Contact Us</h2>
            <p>If you have any questions about our Cookie Policy, please contact us at info@ashkonabazar.com.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
