'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const TEAL = '#1a6b5e'

  const handleTrack = async () => {
    if (!orderId) return
    setLoading(true)
    setSearched(true)
    const { data } = await supabase.from('orders').select('*').ilike('id', orderId + '%').single()
    setOrder(data || null)
    setLoading(false)
  }

  const steps = [
    { label: 'Order Placed', status: 'pending' },
    { label: 'Processing', status: 'processing' },
    { label: 'Shipped', status: 'shipped' },
    { label: 'Delivered', status: 'delivered' },
  ]

  const getStepIndex = (status) => steps.findIndex(s => s.status === status)

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 py-8 border-b border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-400 mb-1 text-center">
          <Link href="/" className="hover:text-gray-700">Home</Link> → <span className="text-gray-700">Track Order</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center">Track <span style={{ color: TEAL }}>Order</span></h1>
      </div>
      <div className="px-4 md:px-8 py-10 max-w-2xl mx-auto">
        <div className="border border-gray-100 rounded-2xl p-6 mb-8">
          <p className="text-sm text-gray-500 text-center mb-4">Enter your Order ID to track your delivery</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g. A1B2C3D4)"
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400"
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
            />
            <button onClick={handleTrack} disabled={loading} className="px-6 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 disabled:opacity-50" style={{ background: TEAL }}>
              {loading ? '...' : 'Track'}
            </button>
          </div>
        </div>

        {searched && !loading && !order && (
          <div className="text-center py-10">
            <span className="text-4xl block mb-3">🔍</span>
            <p className="text-gray-400 text-sm">No order found with this ID.</p>
          </div>
        )}

        {order && (
          <div className="border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Order ID</div>
                <div className="font-mono font-bold">#{order.id.slice(0, 8).toUpperCase()}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 mb-0.5">Total</div>
                <div className="font-bold" style={{ color: TEAL }}>৳{order.total}</div>
              </div>
            </div>

            {/* STATUS TIMELINE */}
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, i) => {
                const currentIndex = getStepIndex(order.status)
                const isDone = i <= currentIndex
                return (
                  <div key={step.status} className="flex flex-col items-center flex-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mb-1" style={{ background: isDone ? TEAL : '#e5e7eb' }}>
                      {isDone ? '✓' : i + 1}
                    </div>
                    <div className="text-[10px] text-center font-semibold" style={{ color: isDone ? TEAL : '#9ca3af' }}>{step.label}</div>
                    {i < steps.length - 1 && (
                      <div className="absolute" style={{ display: 'none' }}></div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Customer</span>
                <span className="font-semibold">{order.customer_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phone</span>
                <span className="font-semibold">{order.customer_phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Address</span>
                <span className="font-semibold text-right max-w-48">{order.customer_address}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order Date</span>
                <span className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
