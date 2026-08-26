'use client'
import Link from 'next/link'

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 py-8 border-b border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-400 mb-1">
          <Link href="/" className="hover:text-gray-700">Home</Link> → <span className="text-gray-700">Shipping Info</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Shipping <span style={{ color: '#1a6b5e' }}>Info</span></h1>
      </div>
      <div className="px-4 md:px-8 py-10 max-w-3xl">
        
      <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Delivery Areas</h2>
          <p>We deliver across all 64 districts of Bangladesh. Same-day delivery available in Dhaka for orders placed before 12 PM.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Delivery Time</h2>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="grid grid-cols-2 bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 uppercase">
              <span>Location</span><span>Delivery Time</span>
            </div>
            <div className="grid grid-cols-2 px-4 py-3 border-t border-gray-100">
              <span>Dhaka City</span><span className="font-semibold">1-2 Business Days</span>
            </div>
            <div className="grid grid-cols-2 px-4 py-3 border-t border-gray-100">
              <span>Other Cities</span><span className="font-semibold">3-5 Business Days</span>
            </div>
            <div className="grid grid-cols-2 px-4 py-3 border-t border-gray-100">
              <span>Remote Areas</span><span className="font-semibold">5-7 Business Days</span>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Shipping Charges</h2>
          <p>Free shipping on orders over ৳999. For orders below ৳999, a flat delivery charge of ৳60 applies.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Order Tracking</h2>
          <p>Once your order is shipped, you will receive an SMS with tracking details. You can also track your order on our Track Order page.</p>
        </section>
      </div>
    
      </div>
    </div>
  )
}
