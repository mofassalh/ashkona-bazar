'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { User, ShoppingBag, LogOut, Edit } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [customer, setCustomer] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '' })

  useEffect(() => {
    const stored = localStorage.getItem('customer')
    if (!stored) { router.push('/account/login'); return }
    const c = JSON.parse(stored)
    setCustomer(c)
    setForm({ name: c.name, phone: c.phone || '', address: c.address || '', city: c.city || '' })
    supabase.from('orders').select('*').eq('customer_email', c.email).order('created_at', { ascending: false }).then(({ data }) => {
      setOrders(data || [])
      setLoading(false)
    })
  }, [])

  const handleUpdate = async () => {
    const { data, error } = await supabase.from('customers').update(form).eq('id', customer.id).select().single()
    if (error) { toast.error('Update failed'); return }
    localStorage.setItem('customer', JSON.stringify({...customer, ...form}))
    setCustomer({...customer, ...form})
    toast.success('Profile updated!')
    setEditing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('customer')
    router.push('/')
    toast.success('Logged out!')
  }

  if (!customer) return null

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SIDEBAR */}
          <div className="bg-white border border-gray-100 rounded-sm p-6 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: '#1a6b5e' }}>
                {customer.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-gray-900">{customer.name}</div>
                <div className="text-xs text-gray-400">{customer.email}</div>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-teal-700 bg-teal-50 rounded-sm">
                <User size={15} /> My Profile
              </button>
              <button className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-sm">
                <ShoppingBag size={15} /> My Orders
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-sm mt-4">
                <LogOut size={15} /> Logout
              </button>
            </nav>
          </div>

          {/* MAIN */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* PROFILE INFO */}
            <div className="bg-white border border-gray-100 rounded-sm p-6">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                <h2 className="font-bold text-lg">Profile Information</h2>
                <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-sm hover:bg-gray-50">
                  <Edit size={12} /> {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {editing ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Full Name</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Phone</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Address</label>
                    <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">City</label>
                    <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" />
                  </div>
                  <button onClick={handleUpdate} className="px-6 py-2.5 text-white text-sm font-bold rounded-sm hover:opacity-90" style={{ background: '#1a6b5e' }}>Save Changes</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[['Name', customer.name], ['Email', customer.email], ['Phone', customer.phone || 'Not set'], ['Address', customer.address || 'Not set'], ['City', customer.city || 'Not set']].map(([label, value]) => (
                    <div key={label}>
                      <div className="text-xs font-semibold uppercase text-gray-400 mb-1">{label}</div>
                      <div className="text-sm text-gray-800">{value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ORDERS */}
            <div className="bg-white border border-gray-100 rounded-sm p-6">
              <h2 className="font-bold text-lg mb-5 pb-3 border-b border-gray-100">My Orders</h2>
              {loading ? <div className="text-gray-400 text-sm">Loading...</div> :
              orders.length === 0 ? <div className="text-gray-400 text-sm text-center py-6">No orders yet</div> :
              <div className="flex flex-col gap-3">
                {orders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-sm">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">#{order.id?.slice(0,8).toUpperCase()}</div>
                      <div className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">৳{order.total}</div>
                      <span className="text-xs px-2 py-0.5 rounded-sm font-semibold" style={{ background: order.status === 'completed' ? '#d1fae5' : '#fef9c3', color: order.status === 'completed' ? '#065f46' : '#854d0e' }}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
