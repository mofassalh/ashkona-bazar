'use client'
import Link from 'next/link'

export default function ReturnsAndRefundsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 py-8 border-b border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-400 mb-1">
          <Link href="/" className="hover:text-gray-700">Home</Link> → <span className="text-gray-700">Returns & Refunds</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Returns <span style={{ color: '#1a6b5e' }}>& Refunds</span></h1>
      </div>
      <div className="px-4 md:px-8 py-10 max-w-3xl">
        
      <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Return Policy</h2>
          <p>We accept returns within 7 days of delivery. Items must be unused, unwashed, and in original packaging with all tags attached.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">How to Return</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Contact us at info@ashkonabazar.com or call +880 1800-555-8899</li>
            <li>Provide your order ID and reason for return</li>
            <li>We will arrange pickup or provide drop-off instructions</li>
            <li>Refund will be processed within 5-7 business days</li>
          </ol>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Non-Returnable Items</h2>
          <p>Items that are used, washed, damaged by the customer, or missing original packaging cannot be returned.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Refund Methods</h2>
          <p>Refunds are processed via bKash, Nagad, or bank transfer depending on your original payment method.</p>
        </section>
      </div>
    
      </div>
    </div>
  )
}
