'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { ShoppingCart, Heart, RotateCcw, User, Search, Menu, X, ChevronDown } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bqfrwitqsllkptyqsbsd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZnJ3aXRxc2xsa3B0eXFzYnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTg5NDgsImV4cCI6MjA5NTQ3NDk0OH0.ahxSmyNXZ9Js6tlj91CvyFcDgOZwx28_-LIUevamWGo'
)

const DEFAULT_TEAL = '#1a6b5e'

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [brandName, setBrandName] = useState('ASHKONABAZAR')
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_TEAL)
  const [settings, setSettings] = useState({})
  const [customer, setCustomer] = useState(null)
  const [wishlistCount, setWishlistCount] = useState(0)

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
    const wishlist = localStorage.getItem('wishlist')
    if (wishlist) setWishlistCount(JSON.parse(wishlist).length)
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*').single()
      if (data) {
        if (data.brand_name) setBrandName(data.brand_name)
        if (data.primary_color) setPrimaryColor(data.primary_color)
        setSettings(data)
      }
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Build nav links from settings
  const navLinks = [
    { label: settings.nav_link_1 || 'Shop', href: '/products', hasArrow: true },
    { label: settings.nav_link_2 || 'Fashion', href: '/products?category=womens-fashion', hasArrow: true },
    { label: settings.nav_link_3 || 'Kitchen', href: '/products?category=kitchen-tools', hasArrow: true },
    { label: settings.nav_link_4 || 'About Us', href: '#' },
    { label: settings.nav_link_5 || 'FAQ', href: '#' },
    { label: settings.nav_link_6 || 'Contact', href: '#' },
    { label: settings.nav_link_7 || 'Blog', href: '#' },
  ].filter(item => item.label)

  // Split brand name: everything except last word = first part, last word = colored part
  const nameParts = brandName.trim().split(' ')
  const firstPart = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0].slice(0, -5) || nameParts[0]
  const secondPart = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0].slice(-5)

  return (
    <div className="sticky top-0 z-50 bg-white">
      {/* TOP BAR */}
      <div className="hidden md:flex items-center justify-between px-8 py-2 text-xs text-gray-500 border-b border-gray-100">
        <div className="flex items-center gap-4">
          {settings.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-800 cursor-pointer transition-colors"><span>📘</span><span>Facebook</span></a>}
          {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-800 cursor-pointer transition-colors"><span>📸</span><span>Instagram</span></a>}
          {settings.twitter_url && <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-800 cursor-pointer transition-colors"><span>✖</span><span>Twitter</span></a>}
          {settings.tiktok_url && <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-800 cursor-pointer transition-colors"><span>🎵</span><span>TikTok</span></a>}
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 cursor-pointer hover:text-gray-800">🇧🇩 English</span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-gray-800">৳ BDT</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-gray-800 transition-colors">My Orders</Link>
          <Link href="#" className="hover:text-gray-800 transition-colors">Shipping Info</Link>
        </div>
      </div>

      {/* MIDDLE HEADER */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 border-b border-gray-100">
        <Link href="/" className="flex items-baseline gap-0.5 flex-shrink-0">
          <span className="font-black text-xl md:text-3xl tracking-tight text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            <span className="border-b-4 border-gray-900">{firstPart.charAt(0)}</span>{firstPart.slice(1)}
          </span>
          <span className="font-black text-xl md:text-3xl tracking-tight" style={{ color: primaryColor, fontFamily: 'Georgia, serif' }}>{secondPart}</span>
        </Link>
        <div className="flex md:hidden items-center gap-2 ml-auto">
          <Link href="/cart" className="relative flex items-center justify-center w-10 h-10 text-white rounded-sm" style={{ background: primaryColor }}>
            <ShoppingCart size={18} />
            {displayItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">{displayItems}</span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="hidden md:block flex-1 max-w-2xl mx-8">
          <div className="flex border border-gray-200 rounded-sm overflow-hidden hover:border-gray-400 transition-colors">
            <select className="px-3 py-3 text-xs font-semibold text-gray-600 border-r border-gray-200 bg-gray-50 outline-none cursor-pointer">
              <option>All</option>
              <option>Fashion</option>
              <option>Kitchen</option>
              <option>Sale</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search here..."
              className="flex-1 px-4 py-3 text-sm outline-none text-gray-700 placeholder-gray-400"
            />
            <button className="px-5 flex items-center justify-center text-white transition-opacity hover:opacity-90" style={{ background: primaryColor }}>
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link href={customer ? '/account/profile' : '/account/login'} className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group">
            <User size={22} className="group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="text-xs font-semibold leading-none">{customer ? customer.name?.split(' ')[0] : 'Account'}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{customer ? 'My Profile' : 'Login / Register'}</div>
            </div>
          </Link>
          <Link href="/wishlist" className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group">
            <div className="relative">
              <Heart size={22} className="group-hover:scale-110 transition-transform" />
              {mounted && wishlistCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{wishlistCount}</span>}
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold leading-none">Wishlist</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Your wishlist</div>
            </div>
          </Link>
          <Link href="#" className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group">
            <RotateCcw size={22} className="group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="text-xs font-semibold leading-none">Compare</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Product Compare</div>
            </div>
          </Link>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className={`transition-all duration-300 ${scrolled ? 'shadow-md' : ''} bg-white border-b border-gray-100`}>
        <div className="flex items-center justify-between px-8 h-12">
          {/* LEFT NAV */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-0.5 px-3 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                {item.label}
                {item.hasArrow && <ChevronDown size={13} className="text-gray-400" />}
              </Link>
            ))}
            <Link
              href="/products?badge=Sale"
              className="flex items-center gap-2 px-3 py-3 text-sm font-bold transition-colors"
              style={{ color: '#e53e3e' }}
            >
              SALE
              <span className="text-[10px] font-black text-white px-1.5 py-0.5 rounded-sm" style={{ background: '#e53e3e' }}>-75%</span>
            </Link>
          </nav>

          {/* RIGHT — CART */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="hidden md:block text-sm font-semibold text-gray-500">{displayItems} item(s) — ৳{displayPrice.toFixed(2)}</span>
            <div className="relative hidden md:block" onMouseEnter={() => setCartOpen(true)} onMouseLeave={() => setCartOpen(false)}>
              <Link href="/cart" className="relative flex items-center justify-center w-10 h-10 text-white rounded-sm transition-opacity hover:opacity-90" style={{ background: primaryColor }}>
                <ShoppingCart size={18} />
                {mounted && displayItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">{displayItems}</span>
                )}
              </Link>
              {cartOpen && mounted && (
                <div className="absolute right-0 top-10 w-80 bg-white shadow-2xl rounded-sm z-50 border border-gray-100">
                  <div className="p-4 max-h-64 overflow-y-auto">
                    {cartItems.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-4">Your cart is empty</p>
                    ) : (
                      cartItems.map(item => (
                        <div key={item.id} className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100 last:border-0">
                          <div className="w-16 h-16 bg-gray-50 rounded-sm flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                            {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : '🛍️'}
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-gray-900 line-clamp-1">{item.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">x {item.quantity}</div>
                          </div>
                          <div className="text-xs font-bold">৳{((item.sale_price || item.price) * item.quantity).toFixed(2)}</div>
                          <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors ml-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  {cartItems.length > 0 && (
                    <div className="border-t border-gray-100 p-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Sub-Total</span>
                        <span className="font-semibold">৳{displayPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-4">
                        <span className="font-bold">Total</span>
                        <span className="font-bold">৳{displayPrice.toFixed(2)}</span>
                      </div>
                      <Link href="/cart" className="block w-full text-center border border-gray-300 py-2.5 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-gray-50 mb-2 transition-colors">View Cart</Link>
                      <Link href="/checkout" className="block w-full text-center text-white py-2.5 text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity" style={{ background: primaryColor }}>Checkout</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button className="hidden" onClick={() => setMobileOpen(!mobileOpen)}></button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3 text-sm font-semibold">
            <Link href="/" onClick={() => setMobileOpen(false)} className="hover:text-teal-700 py-1">Home</Link>
            <Link href="/products" onClick={() => setMobileOpen(false)} className="hover:text-teal-700 py-1">Shop</Link>
            <Link href="/products?category=womens-fashion" onClick={() => setMobileOpen(false)} className="hover:text-teal-700 py-1">Fashion</Link>
            <Link href="/products?category=kitchen-tools" onClick={() => setMobileOpen(false)} className="hover:text-teal-700 py-1">Kitchen</Link>
            <Link href="/products?badge=Sale" onClick={() => setMobileOpen(false)} className="py-1" style={{ color: '#e53e3e' }}>Sale</Link>
            <Link href="/cart" onClick={() => setMobileOpen(false)} className="hover:text-teal-700 py-1">Cart ({displayItems})</Link>
          </div>
        )}
      </div>
    </div>
  )
}
