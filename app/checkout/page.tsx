'use client'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { CheckCircle, ShoppingBag } from 'lucide-react'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [settings, setSettings] = useState({})
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', area: '', notes: '', payment: 'cod'
  })

  useEffect(() => {
    setMounted(true)
    supabase.from('settings').select('*').then(({ data }) => {
      if (data) {
        const obj = {}
        data.forEach(s => obj[s.key] = s.value)
        setSettings(obj)
      }
    })
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/account/login')
        return
      }
      const meta = session.user.user_metadata
      setForm(f => ({
        ...f,
        name: meta.full_name || '',
        email: session.user.email || '',
        phone: meta.phone || '',
        address: meta.address || '',
        city: meta.city || '',
      }))
    })
  }, [])

  if (!mounted) return <div className="min-h-screen flex items-center justify-center"><span className="text-gray-400 text-sm animate-pulse">Loading...</span></div>

  const TEAL = settings.primary_color || '#1a6b5e'
  const subtotal = getTotalPrice()
  const shipping = subtotal >= 999 ? 0 : 60
  const total = subtotal + shipping

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address || !form.city) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.from('orders').insert({
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      customer_address: form.address + ', ' + form.area + ', ' + form.city,
      items: items,
      total: total,
      status: 'pending',
      notes: form.notes,
      payment_method: form.payment,
    }).select().single()

    if (error) {
      toast.error('Something went wrong. Please try again.')
      setLoading(false)
      return
    }
    clearCart()
    setOrderId(data.id)
    setSuccess(true)
    setLoading(false)
  }

  if (items.length === 0 && !success) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: TEAL + '15' }}>
        <ShoppingBag size={36} style={{ color: TEAL }} />
      </div>
      <h2 className="font-bold text-2xl">Your cart is empty</h2>
      <Link href="/products" className="text-white px-8 py-3 text-sm font-bold rounded-lg hover:opacity-90" style={{ background: TEAL }}>Shop Now →</Link>
    </div>
  )

  if (success) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h2 className="font-bold text-2xl text-gray-900">Order Placed!</h2>
      <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
        Thank you for your order! We will contact you shortly to confirm delivery.
      </p>
      <div className="border border-gray-100 rounded-xl px-8 py-4 bg-gray-50">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order ID</div>
        <div className="font-mono font-bold text-sm">{orderId.slice(0, 8).toUpperCase()}</div>
      </div>
      <div className="flex gap-3 mt-2">
        <Link href="/" className="px-6 py-3 text-white text-sm font-bold rounded-lg hover:opacity-90" style={{ background: TEAL }}>Back to Home</Link>
        <Link href="/products" className="px-6 py-3 border border-gray-200 text-sm font-bold rounded-lg hover:bg-gray-50 text-gray-700">Continue Shopping</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <div className="px-4 md:px-8 py-5 border-b border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-400 flex items-center gap-2 mb-1">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>→</span>
          <Link href="/cart" className="hover:text-gray-700">Cart</Link>
          <span>→</span>
          <span style={{ color: TEAL }}>Checkout</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Check<span style={{ color: TEAL }}>out</span></h1>
      </div>

      {/* STEP INDICATOR */}
      <div className="px-4 md:px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 max-w-md">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: TEAL }}>✓</div>
            <span className="text-xs font-semibold text-gray-400">Cart</span>
          </div>
          <div className="flex-1 h-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: TEAL }}>2</div>
            <span className="text-xs font-semibold" style={{ color: TEAL }}>Delivery</span>
          </div>
          <div className="flex-1 h-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-200">3</div>
            <span className="text-xs font-semibold text-gray-400">Confirm</span>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">

            {/* LEFT - FORM */}
            <div className="flex-1 flex flex-col gap-6">

              {/* CONTACT INFO */}
              <div className="border border-gray-100 rounded-2xl p-6">
                <h3 className="font-bold text-base mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: TEAL }}>1</span>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+880 1XXX-XXXXXX" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors" />
                  </div>
                </div>
              </div>

              {/* DELIVERY ADDRESS */}
              <div className="border border-gray-100 rounded-2xl p-6">
                <h3 className="font-bold text-base mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: TEAL }}>2</span>
                  Delivery Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Street Address *</label>
                    <input name="address" value={form.address} onChange={handleChange} placeholder="House no, Road no, Area" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">City *</label>
                    <select name="city" value={form.city} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors bg-white">
                      <option value="">Select City</option>
                      <option>Dhaka</option>
                      <option>Chittagong</option>
                      <option>Sylhet</option>
                      <option>Rajshahi</option>
                      <option>Khulna</option>
                      <option>Barisal</option>
                      <option>Rangpur</option>
                      <option>Mymensingh</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Area</label>
                    <input name="area" value={form.area} onChange={handleChange} placeholder="Mirpur, Gulshan, Dhanmondi..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Order Notes</label>
                    <input name="notes" value={form.notes} onChange={handleChange} placeholder="Any special instructions..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors" />
                  </div>
                </div>
              </div>

              {/* PAYMENT */}
              <div className="border border-gray-100 rounded-2xl p-6">
                <h3 className="font-bold text-base mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: TEAL }}>3</span>
                  Payment Method
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                    { value: 'bkash', label: 'bKash', desc: 'Pay with bKash mobile banking', icon: '📱' },
                    { value: 'nagad', label: 'Nagad', desc: 'Pay with Nagad mobile banking', icon: '💳' },
                    { value: 'card', label: 'Credit / Debit Card', desc: 'VISA, Mastercard, AMEX', icon: '🏦' },
                  ].map(p => (
                    <label key={p.value} className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all"
                      style={{ borderColor: form.payment === p.value ? TEAL : '#e5e7eb', background: form.payment === p.value ? TEAL + '08' : 'white' }}>
                      <input type="radio" name="payment" value={p.value} checked={form.payment === p.value} onChange={handleChange} className="hidden" />
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: form.payment === p.value ? TEAL : '#d1d5db' }}>
                        {form.payment === p.value && <div className="w-2 h-2 rounded-full" style={{ background: TEAL }}></div>}
                      </div>
                      <span className="text-lg">{p.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{p.label}</div>
                        <div className="text-xs text-gray-400">{p.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT - ORDER SUMMARY */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="border border-gray-100 rounded-2xl overflow-hidden sticky top-24">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-base">Order Items</h3>
                </div>
                <div className="px-5 py-4 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-50 last:border-0 last:mb-0 last:pb-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.image_url
                          ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-lg">🛍️</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">{item.name}</div>
                        <div className="text-xs text-gray-400">x {item.quantity}</div>
                      </div>
                      <div className="text-xs font-bold flex-shrink-0" style={{ color: TEAL }}>৳{((item.sale_price || item.price) * item.quantity).toFixed(0)}</div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold">৳{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-500">Delivery</span>
                    <span className="font-semibold" style={{ color: shipping === 0 ? '#22c55e' : 'inherit' }}>
                      {shipping === 0 ? 'Free' : '৳' + shipping}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-200 mb-4">
                    <span>Total</span>
                    <span style={{ color: TEAL }}>৳{total.toFixed(0)}</span>
                  </div>
                  <button type="submit" disabled={loading} className="w-full text-white py-3 text-sm font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: TEAL }}>
                    {loading ? <span className="animate-pulse">Processing...</span> : 'Place Order →'}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-3">🔒 Secure & encrypted checkout</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
