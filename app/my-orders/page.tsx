'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function MyOrdersPage() {
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const TEAL = '#1a6b5e'

  const handleSearch = async () => {
    if (!phone) return
    setLoading(true)
    setSearched(true)
    const { data } = await supabase.from('orders').select('*').eq('customer_phone', phone).order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const statusColor = (status) => {
    if (status === 'delivered') return '#22c55e'
    if (status === 'shipped') return '#3b82f6'
    if (status === 'processing') return '#f59e0b'
    return '#6b7280'
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 py-8 border-b border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-400 mb-1 text-center">
          <Link href="/" className="hover:text-gray-700">Home</Link> → <span className="text-gray-700">My Orders</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center">My <span style={{ color: TEAL }}>Orders</span></h1>
      </div>
      <div className="px-4 md:px-8 py-10 max-w-2xl mx-auto">
        <div className="border border-gray-100 rounded-2xl p-6 mb-8">
          <p className="text-sm text-gray-500 text-center mb-4">Enter your phone number to see your orders</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+880 1XXX-XXXXXX"
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400"
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} disabled={loading} className="px-6 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 disabled:opacity-50" style={{ background: TEAL }}>
              {loading ? '...' : 'Search'}
            </button>
          </div>
        </div>

        {searched && !loading && orders.length === 0 && (
          <div className="text-center py-10">
            <span className="text-4xl block mb-3">📦</span>
            <p className="text-gray-400 text-sm">No orders found for this phone number.</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Order ID</div>
                  <div className="font-mono font-bold text-sm">#{order.id.slice(0, 8).toUpperCase()}</div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: statusColor(order.status) }}>
                  {order.status?.toUpperCase()}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold" style={{ color: TEAL }}>৳{order.total}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Items</span>
                  <span className="font-semibold">{order.items?.length || 0} items</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
