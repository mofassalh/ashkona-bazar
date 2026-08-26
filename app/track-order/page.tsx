'use client'
import Link from 'next/link'

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 py-8 border-b border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-400 mb-1">
          <Link href="/" className="hover:text-gray-700">Home</Link> → <span className="text-gray-700">Track Order</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Track <span style={{ color: '#1a6b5e' }}>Order</span></h1>
      </div>
      <div className="px-4 md:px-8 py-10 max-w-3xl">
        
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#1a6b5e15" }}>
          <span className="text-2xl">🚚</span>
        </div>
        <h2 className="font-bold text-xl text-gray-900 mb-2">Track Your Order</h2>
        <p className="text-gray-400 text-sm mb-6">Enter your order ID to see real-time delivery status.</p>
        <div className="max-w-md mx-auto flex gap-2">
          <input type="text" placeholder="Enter your Order ID" className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400" />
          <button className="px-6 py-2.5 text-white text-sm font-bold rounded-lg" style={{ background: "#1a6b5e" }}>Track</button>
        </div>
      </div>
    
      </div>
    </div>
  )
}
