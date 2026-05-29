'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Package, ShoppingCart, Tag, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0, pending: 0, completed: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const [products, orders, categories] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('*'),
        supabase.from('categories').select('id', { count: 'exact' }),
      ])
      
      const allOrders = orders.data || []
      const pending = allOrders.filter(o => o.status === 'pending').length
      const completed = allOrders.filter(o => o.status === 'completed').length
      const revenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0)

      setStats({
        products: products.count || 0,
        orders: allOrders.length,
        categories: categories.count || 0,
        pending,
        completed,
        revenue
      })
      setRecentOrders(allOrders.slice(0, 5))
      setLoading(false)
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: '#1a6b5e', href: '/admin/products' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: '#3b82f6', href: '/admin/orders' },
    { label: 'Categories', value: stats.categories, icon: Tag, color: '#8b5cf6', href: '/admin/categories' },
    { label: 'Total Revenue', value: '৳' + stats.revenue.toFixed(2), icon: TrendingUp, color: '#f59e0b', href: '/admin/orders' },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(card => {
          const Icon = card.icon
          return (
            <Link key={card.label} href={card.href} className="bg-white p-6 rounded-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-500">{card.label}</span>
                <div className="w-10 h-10 rounded-sm flex items-center justify-center text-white" style={{ background: card.color }}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="font-bold text-2xl text-gray-900">{loading ? '...' : card.value}</div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ background: '#f59e0b' }}>
            <Clock size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-sm text-gray-500">Pending Orders</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ background: '#10b981' }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-sm text-gray-500">Completed Orders</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ background: '#e53e3e' }}>
            <XCircle size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.orders - stats.pending - stats.completed}</div>
            <div className="text-sm text-gray-500">Other Orders</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold hover:underline" style={{ color: '#1a6b5e' }}>View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No orders yet</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0,8).toUpperCase()}</td>
                  <td className="px-6 py-4 font-medium">{order.customer_name}</td>
                  <td className="px-6 py-4 font-bold">৳{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
