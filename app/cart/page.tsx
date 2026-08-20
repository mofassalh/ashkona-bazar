'use client'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const [couponCode, setCouponCode] = useState('')
  const [settings, setSettings] = useState({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    supabase.from('settings').select('*').then(({ data }) => {
      if (data) {
        const obj = {}
        data.forEach(s => obj[s.key] = s.value)
        setSettings(obj)
      }
    })
  }, [])

  if (!mounted) return null

  const TEAL = settings.primary_color || '#1a6b5e'
  const subtotal = getTotalPrice()
  const shipping = subtotal >= 999 ? 0 : 60
  const total = subtotal + shipping

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: TEAL + '15' }}>
        <ShoppingBag size={36} style={{ color: TEAL }} />
      </div>
      <h2 className="font-bold text-2xl text-gray-900">Your Cart is Empty</h2>
      <p className="text-gray-400 text-sm text-center max-w-xs">Looks like you have not added anything yet.</p>
      <Link href="/products" className="text-white px-8 py-3 text-sm font-bold rounded-lg hover:opacity-90 transition-opacity" style={{ background: TEAL }}>
        Start Shopping →
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <div className="px-4 md:px-8 py-5 border-b border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-400 flex items-center gap-2 mb-1">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>→</span>
          <span style={{ color: TEAL }}>Shopping Cart</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Shopping <span style={{ color: TEAL }}>Cart</span>
          <span className="text-base font-normal text-gray-400 ml-2">({items.length} items)</span>
        </h1>
      </div>

      <div className="px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT - CART ITEMS */}
          <div className="flex-1">
            {/* TABLE HEADER */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* ITEMS */}
            <div className="flex flex-col divide-y divide-gray-100">
              {items.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-4 py-5 px-2 items-center hover:bg-gray-50 transition-colors rounded-xl">
                  {/* IMAGE + NAME */}
                  <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image_url
                        ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">{settings.brand_name || 'AshkonaBazar'}</div>
                      <Link href={'/products/' + item.slug} className="font-semibold text-sm text-gray-900 hover:text-gray-600 line-clamp-2 leading-snug">{item.name}</Link>
                      <div className="text-xs mt-1" style={{ color: item.stock > 0 ? '#22c55e' : '#e53e3e' }}>
                        {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="col-span-4 md:col-span-2 text-center">
                    <div className="font-semibold text-sm" style={{ color: TEAL }}>৳{item.sale_price || item.price}</div>
                    {item.sale_price && <div className="text-xs text-gray-300 line-through">৳{item.price}</div>}
                  </div>

                  {/* QUANTITY */}
                  <div className="col-span-5 md:col-span-3 flex items-center justify-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500">
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500">
                        <Plus size={12} />
                      </button>
                    </div>
                    <button onClick={() => { removeItem(item.id); toast.success('Removed!') }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors text-gray-300">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* TOTAL */}
                  <div className="col-span-3 md:col-span-2 text-right">
                    <div className="font-bold text-sm text-gray-900">৳{((item.sale_price || item.price) * item.quantity).toFixed(0)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CART ACTIONS */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <Link href="/products" className="text-sm font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-2 transition-colors">
                ← Continue Shopping
              </Link>
              <button onClick={() => { clearCart(); toast.success('Cart cleared!') }} className="text-sm font-semibold text-red-400 hover:text-red-600 transition-colors">
                Clear Cart
              </button>
            </div>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900">Order Summary</h3>
              </div>

              <div className="px-5 py-4">
                {/* PROMO CODE */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
                    />
                    <button className="px-4 py-2 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity" style={{ background: TEAL }}>
                      Apply
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-500">Subtotal ({items.length} items)</span>
                    <span className="font-semibold">৳{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-500">Delivery</span>
                    <span className="font-semibold" style={{ color: shipping === 0 ? '#22c55e' : 'inherit' }}>
                      {shipping === 0 ? 'Free' : '৳' + shipping}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <div className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3">
                      Add ৳{(999 - subtotal).toFixed(0)} more for free delivery!
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span style={{ color: TEAL }}>৳{total.toFixed(0)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full text-white py-3 text-sm font-bold flex items-center justify-center rounded-lg hover:opacity-90 transition-opacity mb-3" style={{ background: TEAL }}>
                  Proceed to Checkout →
                </Link>

                {/* PAYMENT ICONS */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  {['bKash', 'Nagad', 'VISA', 'COD'].map(p => (
                    <div key={p} className="border border-gray-100 rounded-lg px-2 py-1 text-[10px] font-bold text-gray-400">{p}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
