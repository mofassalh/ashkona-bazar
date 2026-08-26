'use client'
import Link from 'next/link'

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 py-8 border-b border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-400 mb-1">
          <Link href="/" className="hover:text-gray-700">Home</Link> → <span className="text-gray-700">FAQs</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">FAQs <span style={{ color: '#1a6b5e' }}></span></h1>
      </div>
      <div className="px-4 md:px-8 py-10 max-w-3xl">
        
      <div className="space-y-4">
        {[
          { q: "How do I place an order?", a: "Browse our products, add items to your cart, and proceed to checkout. Fill in your delivery details and choose your payment method." },
          { q: "What payment methods do you accept?", a: "We accept bKash, Nagad, credit/debit cards, and cash on delivery." },
          { q: "Can I cancel my order?", a: "You can cancel your order within 2 hours of placing it by contacting us at info@ashkonabazar.com or calling +880 1800-555-8899." },
          { q: "How long does delivery take?", a: "Dhaka: 1-2 business days. Other cities: 3-5 business days. Remote areas: 5-7 business days." },
          { q: "Is cash on delivery available?", a: "Yes, cash on delivery is available across Bangladesh." },
          { q: "How do I return a product?", a: "Contact us within 7 days of delivery. Items must be unused and in original packaging." },
          { q: "Are your products authentic?", a: "Yes, all our products are 100% authentic and quality checked before shipping." },
          { q: "Do you offer gift wrapping?", a: "Yes, we offer gift wrapping service. Please mention it in the order notes during checkout." },
        ].map((faq, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-5">
            <h3 className="font-semibold text-sm text-gray-900 mb-2">{faq.q}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    
      </div>
    </div>
  )
}
