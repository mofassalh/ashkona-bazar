'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronDown } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bqfrwitqsllkptyqsbsd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZnJ3aXRxc2xsa3B0eXFzYnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTg5NDgsImV4cCI6MjA5NTQ3NDk0OH0.ahxSmyNXZ9Js6tlj91CvyFcDgOZwx28_-LIUevamWGo'
)

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [settings, setSettings] = useState({})
  const [customer, setCustomer] = useState(null)

  const totalItems = useCartStore(s => s.getTotalItems())
  const cartItems = useCartStore(s => s.items)
  const removeItem = useCartStore(s => s.removeItem)
  const getTotalPrice = useCartStore(s => s.getTotalPrice)
  const displayItems = mounted ? totalItems : 0
  const displayPrice = mounted ? getTotalPrice() : 0

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('customer')
    if (stored) setCustomer(JSON.parse(stored))
    supabase.from('settings').select('*').then(({ data }) => {
      if (data) {
        const obj = {}
        data.forEach(s => obj[s.key] = s.value)
        setSettings(obj)
      }
    })
  }, [])

  const TEAL = settings.primary_color || '#1a6b5e'
  const brandName = settings.brand_name || 'AshkonaBazar'
  const brandParts = brandName.trim().split(' ')
  const brandFirst = brandParts.length > 1 ? brandParts.slice(0, -1).join(' ') : brandName.slice(0, -5) || brandName
  const brandSecond = brandParts.length > 1 ? brandParts[brandParts.length - 1] : brandName.slice(-5)

  const navLinks = [
    { label: settings.nav_link_1 || 'Shop', href: '/products' },
    { label: settings.nav_link_2 || 'Fashion', href: '/products?category=fashion' },
    { label: settings.nav_link_3 || 'Kitchen', href: '/products?category=kitchen-item' },
    { label: settings.nav_link_4 || 'About', href: '/about' },
  ]

  return (
    <div className="sticky top-0 z-50 bg-white">

      {/* TOP BAR */}
      <div className="hidden md:flex items-center justify-between px-8 py-1.5 text-xs text-gray-400 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-4">
          {settings.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">Facebook</a>}
          {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">Instagram</a>}
          {settings.twitter_url && <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">Twitter</a>}
          {settings.tiktok_url && <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">TikTok</a>}
        </div>
        <div className="flex items-center gap-5">
          <span className="cursor-pointer hover:text-gray-700">🇧🇩 English</span>
          <span className="cursor-pointer hover:text-gray-700">৳ BDT</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="#" className="hover:text-gray-700 transition-colors">My Orders</Link>
          <Link href="#" className="hover:text-gray-700 transition-colors">Shipping Info</Link>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="flex items-center gap-4 px-4 md:px-8 py-3 border-b border-gray-100 bg-white">

        {/* LOGO */}
        <Link href="/" className="flex items-baseline flex-shrink-0">
          <span className="font-black text-xl md:text-2xl tracking-tight text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            {brandFirst}
          </span>
          <span className="font-black text-xl md:text-2xl tracking-tight" style={{ color: TEAL, fontFamily: 'Georgia, serif' }}>
            {brandSecond}
          </span>
        </Link>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1 border border-gray-200 rounded-lg overflow-hidden hover:border-gray-400 transition-colors">
          <select className="px-3 py-2.5 text-xs font-medium text-gray-500 border-r border-gray-200 bg-gray-50 outline-none cursor-pointer">
            <option>All</option>
            <option>Fashion</option>
            <option>Kitchen</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-4 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-300 bg-white"
          />
          <button className="px-5 flex items-center justify-center text-white hover:opacity-90 transition-opacity" style={{ background: TEAL }}>
            <Search size={16} />
          </button>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-3 md:gap-5 ml-auto md:ml-0">
          <Link href={customer ? '/account/profile' : '/account/login'} className="hidden md:flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group">
            <User size={20} />
            <div>
              <div className="text-xs font-semibold leading-none">{customer ? customer.name?.split(' ')[0] : 'Account'}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{customer ? 'My Profile' : 'Login / Register'}</div>
            </div>
          </Link>

          <Link href="/wishlist" className="hidden md:flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group">
            <Heart size={20} />
            <div>
              <div className="text-xs font-semibold leading-none">Wishlist</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Your wishlist</div>
            </div>
          </Link>

          {/* CART PILL */}
          <div className="relative" onMouseEnter={() => setCartOpen(true)} onMouseLeave={() => setCartOpen(false)}>
            <Link href="/cart" className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" style={{ background: TEAL }}>
              <ShoppingCart size={16} />
              <span className="hidden md:inline">{displayItems} item(s) — ৳{displayPrice.toFixed(0)}</span>
              {displayItems > 0 && <span className="md:hidden w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">{displayItems}</span>}
            </Link>

            {/* CART DROPDOWN */}
            {cartOpen && mounted && (
              <div className="absolute right-0 top-12 w-80 bg-white shadow-2xl rounded-xl z-50 border border-gray-100 overflow-hidden">
                <div className="p-4 max-h-64 overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-6">Your cart is empty</p>
                  ) : (
                    cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-50 last:border-0">
                        <div className="w-14 h-14 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                          {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-900 truncate">{item.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">x {item.quantity}</div>
                        </div>
                        <div className="text-xs font-bold" style={{ color: TEAL }}>৳{((item.sale_price || item.price) * item.quantity).toFixed(0)}</div>
                        <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                {cartItems.length > 0 && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="flex justify-between text-sm font-bold mb-3">
                      <span>Total</span>
                      <span style={{ color: TEAL }}>৳{displayPrice.toFixed(0)}</span>
                    </div>
                    <Link href="/cart" className="block w-full text-center border border-gray-300 py-2 text-xs font-bold rounded-lg hover:bg-gray-100 mb-2 transition-colors">View Cart</Link>
                    <Link href="/checkout" className="block w-full text-center text-white py-2 text-xs font-bold rounded-lg hover:opacity-90 transition-opacity" style={{ background: TEAL }}>Checkout →</Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="hidden md:flex items-center justify-between px-8 h-11 border-b border-gray-100 bg-white">
        <nav className="flex items-center">
          {navLinks.map(item => (
            <Link key={item.label} href={item.href} className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">
              {item.label}
              <ChevronDown size={12} className="text-gray-400" />
            </Link>
          ))}
          <Link href="/products?badge=Sale" className="flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors" style={{ color: '#e53e3e' }}>
            SALE
            <span className="text-[10px] font-black text-white px-1.5 py-0.5 rounded-sm" style={{ background: '#e53e3e' }}>
              {settings.sale_badge || '-75%'}
            </span>
          </Link>
        </nav>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3 text-sm font-semibold shadow-lg">
          <Link href="/" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-gray-900 py-1">Home</Link>
          {navLinks.map(item => (
            <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-gray-900 py-1">{item.label}</Link>
          ))}
          <Link href="/products?badge=Sale" onClick={() => setMobileOpen(false)} className="py-1 font-bold" style={{ color: '#e53e3e' }}>Sale</Link>
          <Link href="/cart" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-gray-900 py-1">Cart ({displayItems})</Link>
        </div>
      )}

    </div>
  )
}
