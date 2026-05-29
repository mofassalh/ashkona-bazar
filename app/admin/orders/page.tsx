'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Eye, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) { toast.error('Error updating'); return }
    toast.success('Status updated!')
    fetchOrders()
    if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status })
  }

  const filtered = orders.filter(o => {
    const matchSearch = o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search)
    const matchStatus = statusFilter ? o.status === statusFilter : true
    return matchSearch && matchStatus
  })

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="pl-9 pr-4 py-2.5 border border-gray-200 text-sm outline-none focus:border-teal-700 rounded-sm w-64" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div className="ml-auto text-sm text-gray-500">{filtered.length} orders</div>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No orders found</td></tr>
            ) : filtered.map((order: any) => (
              <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-xs font-bold">{order.id.slice(0,8).toUpperCase()}</td>
                <td className="px-6 py-4 font-medium">{order.customer_name}</td>
                <td className="px-6 py-4 text-gray-500">{order.customer_phone}</td>
                <td className="px-6 py-4 font-bold">৳{order.total}</td>
                <td className="px-6 py-4">
                  <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => setSelectedOrder(order)} className="w-8 h-8 border border-gray-200 flex items-center justify-center rounded-sm hover:bg-gray-50 text-gray-600">
                    <Eye size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-lg">Order #{selectedOrder.id.slice(0,8).toUpperCase()}</h3>
              <button onClick={() => setSelectedOrder(null)}><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Customer</div>
                  <div className="font-semibold">{selectedOrder.customer_name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Email</div>
                  <div>{selectedOrder.customer_email}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Phone</div>
                  <div>{selectedOrder.customer_phone}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Address</div>
                  <div>{selectedOrder.customer_address}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[selectedOrder.status] || 'bg-gray-100 text-gray-700'}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Date</div>
                  <div>{new Date(selectedOrder.created_at).toLocaleString()}</div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="text-xs text-gray-500 uppercase font-semibold mb-3">Order Items</div>
                {(selectedOrder.items || []).map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-400">x{item.quantity}</div>
                    </div>
                    <div className="font-bold">৳{((item.sale_price || item.price) * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 font-bold text-lg">
                  <span>Total</span>
                  <span>৳{selectedOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
