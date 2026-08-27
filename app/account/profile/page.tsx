'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { User, ShoppingBag, Heart, MapPin, Lock, LogOut, Edit2 } from 'lucide-react'

const TEAL = '#1a6b5e'

function getTier(orderCount) {
  if (orderCount >= 20) return { name: 'Platinum', color: '#6B7CFF', bg: '#EEF0FF' }
  if (orderCount >= 10) return { name: 'Gold', color: '#B8860B', bg: '#FFF8DC' }
  if (orderCount >= 5) return { name: 'Silver', color: '#708090', bg: '#F0F4F8' }
  return { name: 'Normal', color: '#1a6b5e', bg: '#E8F5F0' }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', city: '' })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/account/login'); return }
      setUser(session.user)
      const meta = session.user.user_metadata
      setForm({
        full_name: meta.full_name || '',
        phone: meta.phone || '',
        address: meta.address || '',
        city: meta.city || '',
      })
      supabase.from('orders').select('*').eq('customer_email', session.user.email).order('created_at', { ascending: false }).then(({ data }) => {
        setOrders(data || [])
        setLoading(false)
      })
    })
  }, [])

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({ data: form })
    if (error) { toast.error('Update failed'); return }
    toast.success('Profile updated!')
    setEditing(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    toast.success('Logged out!')
  }

  if (!user) return null

  const tier = getTier(orders.length)
  const initials = (form.full_name || user.email || '?').charAt(0).toUpperCase()
  const statusColor = (status) => {
    if (status === 'delivered') return { bg: '#d1fae5', color: '#065f46' }
    if (status === 'shipped') return { bg: '#dbeafe', color: '#1e40af' }
    if (status === 'processing') return { bg: '#fef9c3', color: '#854d0e' }
    return { bg: '#f3f4f6', color: '#374151' }
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8f6f2' }}>
      <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* SIDEBAR */}
          <div className="md:col-span-1">
            {/* AVATAR CARD */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3" style={{ background: TEAL }}>
                {initials}
              </div>
              <div className="font-bold text-gray-900 text-sm mb-0.5">{form.full_name || 'Customer'}</div>
              <div className="text-xs text-gray-400 mb-3">{user.email}</div>
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full" style={{ background: tier.bg, color: tier.color }}>
                {tier.name} Member
              </span>
              <div className="text-xs text-gray-400 mt-2">{orders.length} orders</div>
            </div>

            {/* NAV */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'orders', label: 'My Orders', icon: ShoppingBag },
                { id: 'wishlist', label: 'Wishlist', icon: Heart },
                { id: 'address', label: 'Addresses', icon: MapPin },
                { id: 'password', label: 'Change Password', icon: Lock },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-gray-50 last:border-0 transition-colors"
                  style={{ background: activeTab === item.id ? TEAL + '10' : 'white', color: activeTab === item.id ? TEAL : '#6b7280' }}
                >
                  <item.icon size={15} />
                  {item.label}
                </button>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={15} /> Logout
              </button>
            </div>
          </div>

          {/* MAIN */}
          <div className="md:col-span-3">

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg text-gray-900">Personal <span style={{ color: TEAL }}>Information</span></h2>
                  <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Edit2 size={12} /> {editing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {editing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-xs font-semibold uppercase text-gray-400 block mb-1.5 tracking-wider">Full Name</label>
                      <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase text-gray-400 block mb-1.5 tracking-wider">Phone</label>
                      <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400" placeholder="+880 1XXX-XXXXXX" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase text-gray-400 block mb-1.5 tracking-wider">City</label>
                      <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400" placeholder="Dhaka" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold uppercase text-gray-400 block mb-1.5 tracking-wider">Address</label>
                      <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400" placeholder="House, Road, Area" />
                    </div>
                    <div className="col-span-2">
                      <button onClick={handleUpdate} className="px-8 py-2.5 text-white text-sm font-bold rounded-xl hover:opacity-90" style={{ background: TEAL }}>Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-5">
                    {[
                      ['Full Name', form.full_name || 'Not set'],
                      ['Email', user.email],
                      ['Phone', form.phone || 'Not set'],
                      ['City', form.city || 'Not set'],
                      ['Address', form.address || 'Not set'],
                      ['Member Since', new Date(user.created_at).toLocaleDateString()],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-1">{label}</div>
                        <div className="text-sm text-gray-800 font-medium">{value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h2 className="font-bold text-lg text-gray-900 mb-6">My <span style={{ color: TEAL }}>Orders</span></h2>
                {loading ? (
                  <div className="text-gray-400 text-sm text-center py-10">Loading...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag size={40} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-gray-400 text-sm">No orders yet</p>
                    <Link href="/products" className="inline-block mt-4 text-sm font-bold px-6 py-2 text-white rounded-xl" style={{ background: TEAL }}>Start Shopping</Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {orders.map(order => (
                      <div key={order.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <div className="font-mono font-bold text-sm text-gray-900">#{order.id?.slice(0,8).toUpperCase()}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString()} · {order.items?.length || 0} items</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm mb-1" style={{ color: TEAL }}>৳{order.total}</div>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={statusColor(order.status)}>
                            {order.status?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h2 className="font-bold text-lg text-gray-900 mb-6">My <span style={{ color: TEAL }}>Wishlist</span></h2>
                <div className="text-center py-16">
                  <Heart size={40} className="mx-auto mb-3 text-gray-200" />
                  <p className="text-gray-400 text-sm">Your wishlist is empty</p>
                  <Link href="/products" className="inline-block mt-4 text-sm font-bold px-6 py-2 text-white rounded-xl" style={{ background: TEAL }}>Browse Products</Link>
                </div>
              </div>
            )}

            {/* ADDRESS TAB */}
            {activeTab === 'address' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h2 className="font-bold text-lg text-gray-900 mb-6">My <span style={{ color: TEAL }}>Addresses</span></h2>
                <div className="border border-gray-100 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: TEAL }}>Primary</span>
                    <button className="text-xs text-gray-400 hover:text-gray-700">Edit</button>
                  </div>
                  <div className="text-sm text-gray-700">{form.address || 'No address set'}</div>
                  <div className="text-sm text-gray-500">{form.city || ''}</div>
                </div>
                <button onClick={() => setActiveTab('profile')} className="text-sm font-semibold" style={{ color: TEAL }}>+ Add New Address</button>
              </div>
            )}

            {/* PASSWORD TAB */}
            {activeTab === 'password' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h2 className="font-bold text-lg text-gray-900 mb-6">Change <span style={{ color: TEAL }}>Password</span></h2>
                <div className="flex flex-col gap-4 max-w-md">
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-400 block mb-1.5 tracking-wider">New Password</label>
                    <input type="password" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400" placeholder="Min. 6 characters" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-400 block mb-1.5 tracking-wider">Confirm New Password</label>
                    <input type="password" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400" placeholder="Re-enter password" />
                  </div>
                  <button className="px-8 py-2.5 text-white text-sm font-bold rounded-xl hover:opacity-90 w-fit" style={{ background: TEAL }}>Update Password</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
