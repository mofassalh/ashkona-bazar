'use client'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 py-8 border-b border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-400 mb-1">
          <Link href="/" className="hover:text-gray-700">Home</Link> → <span className="text-gray-700">Terms of Service</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Terms of <span style={{ color: '#1a6b5e' }}>Service</span></h1>
        <p className="text-gray-400 text-sm mt-1">Last updated: January 2026</p>
      </div>
      <div className="px-4 md:px-8 py-10 max-w-3xl">
        <div className="prose prose-sm text-gray-600 leading-relaxed space-y-6">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using AshkonaBazar, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Products and Orders</h2>
            <p>All products are subject to availability. We reserve the right to limit quantities and to refuse service. Prices are subject to change without notice.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Payment</h2>
            <p>We accept bKash, Nagad, credit/debit cards, and cash on delivery. Payment must be received before order processing, except for cash on delivery orders.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Shipping and Delivery</h2>
            <p>We deliver across Bangladesh. Free shipping on orders over ৳999. Delivery times vary by location, typically 1-3 business days for Dhaka and 3-7 days for other areas.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Returns and Refunds</h2>
            <p>We accept returns within 7 days of delivery for unused items in original condition. Refunds will be processed within 5-7 business days after we receive the returned item.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Contact Us</h2>
            <p>For any questions regarding these Terms of Service, please contact us at info@ashkonabazar.com or call +880 1800-555-8899.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
