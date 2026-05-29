'use client'
import { useState } from 'react'
import { useCartStore } from '@/lib/store'
import Link from 'next/link'
import { Trash2, Plus, Minus, RefreshCw, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

const TEAL = '#1a6b5e'
const catEmojis = { 'womens-fashion': '👗', 'mens-wear': '👔', 'kitchen-tools': '🔪', 'accessories': '👒', 'cookware': '🍳' }

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const [couponOpen, setCouponOpen] = useState(false)
  const [shippingOpen, setShippingOpen] = useState(false)
  const [giftOpen, setGiftOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 500 ? 0 : 60
  const total = subtotal + shipping
  const totalWeight = items.reduce((sum, i) => sum + i.quantity * 0.5, 0)

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <ShoppingBag size={64} className="text-gray-200" />
      <h2 className="font-bold text-3xl">Your Cart is Empty</h2>
      <p className="text-gray-400 text-sm text-center max-w-sm">Looks like you haven't added anything yet.</p>
      <Link href="/products" className="text-white px-10 py-3 text-xs tracking-widest uppercase font-bold hover:opacity-90 transition-opacity rounded-sm" style={{ background: TEAL }}>
        Start Shopping
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <div className="py-10 px-6 text-center border-b border-gray-100" style={{ background: '#f5f2ee' }}>
        <h1 className="font-bold text-2xl text-gray-900 mb-2">Shopping Cart ({totalWeight.toFixed(2)}kg)</h1>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-700">Shopping Cart</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT - CART TABLE */}
          <div className="flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Image</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Product Name</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Model</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Quantity</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Unit Price</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      {/* IMAGE */}
                      <td className="py-4 px-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-sm flex items-center justify-center text-2xl border border-gray-100 overflow-hidden">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{catEmojis[item.categories?.slug] || '🛍️'}</span>
                          )}
                        </div>
                      </td>
                      {/* NAME */}
                      <td className="py-4 px-3">
                        <Link href={'/products/' + item.slug} className="font-semibold text-gray-900 hover:underline" style={{ color: TEAL }}>{item.name}</Link>
                      </td>
                      {/* MODEL */}
                      <td className="py-4 px-3 text-gray-500 hidden md:table-cell">{item.categories?.name || 'General'}</td>
                      {/* QUANTITY */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 border border-gray-200 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                            <Minus size={10} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 border border-gray-200 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                            <Plus size={10} />
                          </button>
                          <button className="w-7 h-7 border border-gray-200 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors ml-1">
                            <RefreshCw size={10} />
                          </button>
                          <button onClick={() => { removeItem(item.id); toast.success('Item removed') }} className="w-7 h-7 border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 rounded-full transition-colors ml-1">
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </td>
                      {/* UNIT PRICE */}
                      <td className="py-4 px-3 text-gray-700 hidden md:table-cell">৳{(item.sale_price || item.price)}</td>
                      {/* TOTAL */}
                      <td className="py-4 px-3 font-bold text-gray-900">৳{((item.sale_price || item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT - SUMMARY */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="border border-gray-200 rounded-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-base text-gray-900">What would you like to do next?</h3>
              </div>

              {/* COUPON */}
              <div className="border-b border-gray-100">
                <button onClick={() => setCouponOpen(!couponOpen)} className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Use Coupon Code
                  {couponOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {couponOpen && (
                  <div className="px-5 pb-4">
                    <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Enter coupon code" className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 rounded-sm mb-2" />
                    <button className="w-full text-white py-2 text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90" style={{ background: TEAL }}>Apply Coupon</button>
                  </div>
                )}
              </div>

              {/* SHIPPING ESTIMATE */}
              <div className="border-b border-gray-100">
                <button onClick={() => setShippingOpen(!shippingOpen)} className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Estimate Shipping & Taxes
                  {shippingOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {shippingOpen && (
                  <div className="px-5 pb-4 text-sm text-gray-500">
                    <p className="mb-2">Free shipping on orders over ৳500!</p>
                    {shipping > 0 && <p className="text-amber-600 font-medium">Add ৳{(500 - subtotal).toFixed(2)} more for free shipping.</p>}
                    {shipping === 0 && <p className="text-green-600 font-medium">✓ You qualify for free shipping!</p>}
                  </div>
                )}
              </div>

              {/* GIFT CERTIFICATE */}
              <div className="border-b border-gray-100">
                <button onClick={() => setGiftOpen(!giftOpen)} className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Use Gift Certificate
                  {giftOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {giftOpen && (
                  <div className="px-5 pb-4">
                    <input type="text" placeholder="Enter gift certificate code" className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 rounded-sm mb-2" />
                    <button className="w-full text-white py-2 text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90" style={{ background: TEAL }}>Apply Gift Certificate</button>
                  </div>
                )}
              </div>

              {/* TOTALS */}
              <div className="px-5 py-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Sub-Total:</span>
                  <span className="font-semibold">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-4 pb-4 border-b border-gray-100">
                  <span className="text-gray-500">Total:</span>
                  <span className="font-bold text-lg">৳{total.toFixed(2)}</span>
                </div>
                <Link href="/checkout" className="w-full text-white py-3 text-xs tracking-widest uppercase font-bold flex items-center justify-center rounded-sm hover:opacity-90 transition-opacity mb-2" style={{ background: TEAL }}>
                  Checkout
                </Link>
                <Link href="/products" className="w-full border border-gray-200 text-gray-700 py-3 text-xs tracking-widest uppercase font-semibold flex items-center justify-center rounded-sm hover:bg-gray-50 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
