'use client'
import { useState } from 'react'
import { useCartStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    payment: 'cod',
  })

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 500 ? 0 : 60
  const total = subtotal + shipping

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.address || !form.city) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.from('orders').insert({
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      customer_address: `${form.address}, ${form.city}`,
      items: items,
      total: total,
      status: 'pending',
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

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h2 className="font-serif text-4xl font-light">Your cart is empty</h2>
        <Link href="/products" className="text-white px-10 py-4 text-xs tracking-widest uppercase font-bold hover:opacity-90 transition-all duration-300" style={{ background: '#1a6b5e' }}>Shop Now</Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <CheckCircle size={72} className="text-green-500" />
        <h2 className="font-serif text-5xl font-light">Order Placed!</h2>
        <p className="text-gray-500 text-sm max-w-md leading-relaxed">
          Thank you for your order! Your order has been placed successfully. We'll contact you shortly to confirm delivery.
        </p>
        <div className="bg-gray-50 px-8 py-4 rounded-sm">
          <span className="text-xs tracking-widest uppercase text-gray-400 block mb-1">Order ID</span>
          <span className="font-mono text-sm font-semibold">{orderId.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex gap-4 mt-4">
          <Link href="/" className="bg-black text-white px-8 py-4 text-xs tracking-widest uppercase font-bold hover:bg-amber-600 transition-all duration-300">Back to Home</Link>
          <Link href="/products" className="border border-black text-black px-8 py-4 text-xs tracking-widest uppercase font-bold hover:bg-black hover:text-white transition-all duration-300">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="py-10 px-6 text-center border-b border-gray-100" style={{ background: '#f5f2ee' }}>
        <span className="text-amber-600 text-xs tracking-widest uppercase font-semibold block mb-2">Almost There</span>
        <h1 className="font-serif text-5xl font-light">Check<em className="italic">out</em></h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link href="/cart" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold text-gray-500 hover:text-black transition-colors mb-10">
          <ArrowLeft size={14} /> Back to Cart
        </Link>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 flex flex-col gap-10">

              <div>
                <h3 className="font-bold text-xl mb-6 pb-3 border-b border-gray-100 text-gray-900">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs tracking-widest uppercase font-semibold text-gray-500 block mb-2">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-700 transition-colors rounded-sm" />
                  </div>
                  <div>
                    <label className="text-xs tracking-widest uppercase font-semibold text-gray-500 block mb-2">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-700 transition-colors rounded-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs tracking-widest uppercase font-semibold text-gray-500 block mb-2">Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+880 1XXX XXXXXX" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-700 transition-colors rounded-sm" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-6 pb-3 border-b border-gray-100 text-gray-900">Delivery Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs tracking-widest uppercase font-semibold text-gray-500 block mb-2">Street Address *</label>
                    <input name="address" value={form.address} onChange={handleChange} placeholder="House no, Road no, Area" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-700 transition-colors rounded-sm" />
                  </div>
                  <div>
                    <label className="text-xs tracking-widest uppercase font-semibold text-gray-500 block mb-2">City *</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="Dhaka" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-700 transition-colors rounded-sm" />
                  </div>
                  <div>
                    <label className="text-xs tracking-widest uppercase font-semibold text-gray-500 block mb-2">Order Notes</label>
                    <input name="notes" value={form.notes} onChange={handleChange} placeholder="Any special instructions" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-700 transition-colors rounded-sm" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-6 pb-3 border-b border-gray-100 text-gray-900">Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
                    { value: 'bkash', label: 'bKash', icon: '📱' },
                    { value: 'nagad', label: 'Nagad', icon: '💳' },
                  ].map(p => (
                    <label key={p.value} className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${form.payment === p.value ? 'text-white' : 'border-gray-200'}`} style={{ borderColor: form.payment === p.value ? '#1a6b5e' : '', background: form.payment === p.value ? '#1a6b5e' : '' }}>
                      <input type="radio" name="payment" value={p.value} checked={form.payment === p.value} onChange={handleChange} className="hidden" />
                      <span className="text-xl">{p.icon}</span>
                      <span className="text-xs tracking-widest uppercase font-semibold">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-8 rounded-sm sticky top-24">
                <h3 className="font-serif text-2xl font-light mb-6">Order Summary</h3>
                <div className="flex flex-col gap-3 mb-6 max-h-48 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-gray-200 rounded-sm flex items-center justify-center text-xs">{item.quantity}</span>
                        <span className="text-gray-600 truncate max-w-[140px]">{item.name}</span>
                      </div>
                      <span className="font-medium flex-shrink-0">৳{((item.sale_price || item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 flex flex-col gap-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-500 font-medium' : ''}>{shipping === 0 ? 'FREE' : `৳${shipping}`}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-serif text-2xl font-light">৳{total.toFixed(2)}</span>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 text-xs tracking-widest uppercase font-bold hover:bg-amber-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>Place Order — ৳{total.toFixed(2)}</>
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center mt-4">🔒 Your information is secure and encrypted</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
