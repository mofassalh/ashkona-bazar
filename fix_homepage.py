import os

base = '/Users/mofassalhossain/arbrogreen-website/ashkona-bazar'

page = open(base + '/app/page.tsx', 'w')
page.write("""'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, RotateCcw, ZoomIn, ArrowRight, Send } from 'lucide-react'

const TEAL = '#1a6b5e'

const slides = [
  { tag: 'Fashion', title: 'New Collection', subtitle: 'Starting at', price: '\\u09f3999', btn1: { text: 'Shop Now', href: '/products?category=womens-fashion' }, btn2: { text: 'Learn more', href: '/products' }, bg: '#f0ece4', emoji: '\\ud83d\\udc57' },
  { tag: 'Kitchen', title: 'Premium Tools', subtitle: 'Starting at', price: '\\u09f3499', btn1: { text: 'Shop Now', href: '/products?category=kitchen-tools' }, btn2: { text: 'Learn more', href: '/products' }, bg: '#e8f0ee', emoji: '\\ud83c\\udf73' },
  { tag: 'Sale', title: 'Up to 50% Off', subtitle: 'Limited time', price: 'Today Only', btn1: { text: 'Shop Sale', href: '/products?badge=Sale' }, btn2: { text: 'View All', href: '/products' }, bg: '#ede8f0', emoji: '\\u2728' },
]

const features = [
  { icon: '\\ud83d\\ude9a', title: 'Fast Shipping', desc: 'Free delivery on orders over \\u09f3500' },
  { icon: '\\ud83d\\udee1\\ufe0f', title: 'Secure Shopping', desc: '100% secure payment guaranteed' },
  { icon: '\\u21a9\\ufe0f', title: 'Easy Return', desc: '30-day hassle free return policy' },
  { icon: '\\ud83c\\udfa7', title: '24h Service', desc: 'Dedicated support around the clock' },
]

const partners = ['ACI', 'Pran', 'Square', 'Walton', 'Apex', 'Bata', 'Arong', 'Aarong', 'Cats Eye']

const testimonials = [
  { text: 'Amazing quality products! The delivery was super fast and packaging was excellent.', author: 'Rafiqul Islam' },
  { text: 'Best online shopping experience in Bangladesh. Fashion and kitchen products are top notch.', author: 'Nusrat Jahan' },
  { text: 'Great prices and genuine products. Customer service is very responsive.', author: 'Kamal Hossain' },
  { text: 'From fashion to kitchen, everything is premium quality. My go-to store!', author: 'Sultana Begum' },
]

const blogs = [
  { date: '12', month: 'Dec', title: 'Top Fashion Trends 2024', desc: 'Discover the latest fashion trends taking the world by storm...', comments: 3, views: 1672, emoji: '\\ud83d\\udc57' },
  { date: '09', month: 'Sep', title: 'Best Kitchen Tools for Home Chefs', desc: 'Transform your cooking with these must-have kitchen gadgets...', comments: 0, views: 5899, emoji: '\\ud83c\\udf73' },
  { date: '02', month: 'Aug', title: 'Style Guide for Every Occasion', desc: 'Whether casual or formal, dress perfectly for any occasion...', comments: 0, views: 4496, emoji: '\\ud83d\\udc54' },
  { date: '30', month: 'Jul', title: 'Kitchen Essentials You Need', desc: 'Stock your kitchen with tools every home cook should have...', comments: 2, views: 12735, emoji: '\\ud83d\\udd2a' },
]

const catEmojis = { 'womens-fashion': '\\ud83d\\udc57', 'mens-wear': '\\ud83d\\udc54', 'kitchen-tools': '\\ud83d\\udd2a', 'accessories': '\\ud83d\\udc52', 'cookware': '\\ud83c\\udf73' }

function CountdownTimer() {
  const [cd, setCd] = useState({ d: 7, h: 12, m: 30, s: 0 })
  const [mounted, setMounted] = useState(false)
  const pad = n => String(n).padStart(2, '0')
  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => {
      setCd(prev => {
        let { d, h, m, s } = prev
        s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) { h = 23; d-- }
        if (d < 0) d = 0
        return { d, h, m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])
  const vals = mounted
    ? [['d', cd.d, 'Days'], ['h', cd.h, 'Hours'], ['m', cd.m, 'Min'], ['s', cd.s, 'Sec']]
    : [['d', 7, 'Days'], ['h', 12, 'Hours'], ['m', 30, 'Min'], ['s', 0, 'Sec']]
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {vals.map(([key, val, label]) => (
        <div key={key} className="bg-white/10 border border-white/20 py-2 px-1 rounded-sm text-center">
          <span className="text-white font-bold text-xl block leading-none">{pad(val)}</span>
          <span className="text-white/60 text-[10px] uppercase tracking-wider mt-1 block">{label}</span>
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState([])
  const [weeklyDeals, setWeeklyDeals] = useState([])
  const [categories, setCategories] = useState([])
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [email, setEmail] = useState('')
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    setMounted(true)
    const s = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000)
    return () => clearInterval(s)
  }, [])

  useEffect(() => {
    supabase.from('products').select('*, categories(name,slug)').eq('featured', true).limit(8).then(({ data }) => setProducts(data || []))
    supabase.from('products').select('*, categories(name,slug)').not('sale_price', 'is', null).limit(6).then(({ data }) => setWeeklyDeals(data || []))
    supabase.from('categories').select('*').then(({ data }) => setCategories(data || []))
  }, [])

  if (!mounted) return <div className="min-h-screen bg-white" />

  return (
    <div className="overflow-x-hidden bg-white">

      <section className="relative overflow-hidden" style={{ minHeight: '75vh' }}>
        {slides.map((slide, i) => (
          <div key={i} className={"absolute inset-0 transition-opacity duration-1000 " + (i === current ? 'opacity-100 z-10' : 'opacity-0 z-0')} style={{ background: slide.bg }}>
            <div className="max-w-7xl mx-auto px-6 md:px-16 min-h-[75vh] grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-16">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold" style={{ color: TEAL }}>{slide.tag}</span>
                  <div className="h-px w-10" style={{ background: TEAL }}></div>
                </div>
                <h1 className="font-bold text-4xl md:text-6xl text-gray-900 mb-4 leading-tight">{slide.title}</h1>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-gray-500 text-lg">{slide.subtitle}</span>
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">{slide.price}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={slide.btn1.href} className="px-7 py-3 text-white text-sm font-semibold rounded-full hover:opacity-90 transition-all" style={{ background: TEAL }}>{slide.btn1.text}</Link>
                  <Link href={slide.btn2.href} className="px-7 py-3 text-gray-800 text-sm font-semibold rounded-full border border-gray-300 hover:border-gray-800 transition-all bg-white">{slide.btn2.text}</Link>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="w-full h-80 rounded-2xl flex items-center justify-center relative" style={{ background: 'rgba(255,255,255,0.4)' }}>
                  <span className="text-[160px] opacity-20">{slide.emoji}</span>
                  <button className="absolute top-1/3 left-1/3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center font-bold text-lg hover:scale-110 transition-transform">+</button>
                  <button className="absolute bottom-1/3 right-1/3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center font-bold text-lg hover:scale-110 transition-transform">+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => setCurrent(c => (c - 1 + slides.length) % slides.length)} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center"><ChevronLeft size={16} /></button>
        <button onClick={() => setCurrent(c => (c + 1) % slides.length)} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center"><ChevronRight size={16} /></button>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i === current ? 28 : 8, background: i === current ? TEAL : '#ccc' }} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/products?category=womens-fashion" className="relative overflow-hidden rounded-sm group col-span-1 md:row-span-2" style={{ background: '#e8e0d8', height: 180 }}>
            <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500"><span className="text-7xl opacity-20">\\ud83d\\udc57</span></div>
            <span className="absolute top-3 left-3 bg-white text-xs font-bold tracking-widest px-2.5 py-1">FASHION</span>
          </Link>
          <Link href="/products?category=kitchen-tools" className="relative overflow-hidden rounded-sm group col-span-1 md:row-span-2" style={{ background: '#d8e8e0', height: 180 }}>
            <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500"><span className="text-7xl opacity-20">\\ud83d\\udd2a</span></div>
            <span className="absolute top-3 left-3 bg-white text-xs font-bold tracking-widest px-2.5 py-1">KITCHEN</span>
          </Link>
          <Link href="/products?category=mens-wear" className="relative overflow-hidden rounded-sm group" style={{ background: '#d8e0e8', height: 180 }}>
            <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500"><span className="text-7xl opacity-20">\\ud83d\\udc54</span></div>
            <span className="absolute top-3 left-3 bg-white text-xs font-bold tracking-widest px-2.5 py-1">MEN'S WEAR</span>
          </Link>
          <Link href="/products?category=accessories" className="relative overflow-hidden rounded-sm group" style={{ background: '#e8d8e8', height: 180 }}>
            <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500"><span className="text-7xl opacity-20">\\ud83d\\udc52</span></div>
            <span className="absolute top-3 left-3 bg-white text-xs font-bold tracking-widest px-2.5 py-1">ACCESSORIES</span>
          </Link>
          <Link href="/products?badge=Sale" className="relative overflow-hidden rounded-sm flex items-center justify-center flex-col" style={{ background: TEAL, height: 180 }}>
            <span className="absolute top-3 left-3 bg-white text-xs font-bold px-2.5 py-1" style={{ color: TEAL }}>SALE</span>
            <div className="text-white text-center"><div className="text-sm">up to</div><div className="font-bold text-5xl leading-none">-50<span className="text-2xl">%</span></div></div>
          </Link>
          <Link href="/products?category=cookware" className="relative overflow-hidden rounded-sm group" style={{ background: '#f0e8d8', height: 180 }}>
            <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500"><span className="text-7xl opacity-20">\\ud83c\\udf73</span></div>
            <span className="absolute top-3 left-3 bg-white text-xs font-bold tracking-widest px-2.5 py-1">COOKWARE</span>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">New Arrivals</h2>
            <p className="text-gray-500 text-sm mt-1 hidden md:block">Just added, shop our latest products before they're gone.</p>
          </div>
          <Link href="/products" className="text-sm font-semibold flex items-center gap-1 hover:opacity-70" style={{ color: TEAL }}>Shop all <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {products.slice(0, 4).map(product => (
            <div key={product.id} className="group cursor-pointer" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
              <div className="relative overflow-hidden bg-gray-50 aspect-square mb-3 rounded-sm">
                <div className="w-full h-full flex items-center justify-center text-5xl md:text-7xl group-hover:scale-105 transition-transform duration-500">{catEmojis[product.categories?.slug] || '\\ud83d\\udecd\\ufe0f'}</div>
                {product.badge && <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5" style={{ background: product.badge === 'Sale' ? '#e53e3e' : product.badge === 'Hot' ? TEAL : '#111' }}>{product.badge}</span>}
                <div className="absolute bottom-0 left-0 right-0 py-2 px-2 flex items-center justify-between bg-white/95 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button onClick={() => { addItem(product); toast.success('Added!') }} className="flex items-center gap-1 text-xs font-semibold" style={{ color: TEAL }}><ShoppingCart size={12} /> Add to Cart</button>
                  <div className="flex gap-1.5 text-gray-400"><button className="hover:text-red-500"><Heart size={12} /></button><button><RotateCcw size={12} /></button></div>
                </div>
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">ASHKONA BAZAR</div>
              <div className="text-[10px] font-medium mb-1" style={{ color: TEAL }}>In Stock</div>
              <Link href={"/products/" + product.slug} className="font-semibold text-sm text-gray-900 hover:underline block mb-1">{product.name}</Link>
              <div className="text-sm">
                {product.sale_price ? <><span className="font-semibold">\\u09f3{product.sale_price}</span><span className="text-gray-400 line-through ml-2 text-xs">\\u09f3{product.price}</span></> : <span className="font-semibold">\\u09f3{product.price}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8 px-4 md:px-6" style={{ background: TEAL }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="flex items-center gap-3 md:gap-4">
              <span className="text-2xl md:text-3xl">{f.icon}</span>
              <div><div className="text-white font-semibold text-xs md:text-sm">{f.title}</div><div className="text-white/60 text-xs mt-0.5 hidden md:block">{f.desc}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-500 text-sm mt-1 hidden md:block">Browse our wide range of product categories.</p>
          </div>
          <Link href="/products" className="text-sm font-semibold flex items-center gap-1 hover:opacity-70" style={{ color: TEAL }}>All Departments <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link key={cat.id} href={"/products?category=" + cat.slug} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-sm bg-gray-50 aspect-square mb-3 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                <span className="text-5xl md:text-7xl opacity-40 group-hover:scale-110 transition-transform duration-300">{catEmojis[cat.slug] || '\\ud83d\\udecd\\ufe0f'}</span>
              </div>
              <div className="font-semibold text-sm text-gray-900">{cat.name} <span className="text-gray-400 font-normal text-xs">24</span></div>
              <p className="text-gray-400 text-xs mt-0.5 hidden md:block">Browse our {cat.name.toLowerCase()} collection.</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12 px-4 md:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-52 flex-shrink-0 rounded-sm flex flex-col items-center justify-center py-8 px-6 text-center" style={{ background: TEAL }}>
            <span className="text-4xl mb-3">\\ud83c\\udff7\\ufe0f</span>
            <h3 className="text-white font-bold text-lg mb-1">Deals of the Week</h3>
            <p className="text-white/70 text-xs mb-6">Save up to 70% on select offers</p>
            <CountdownTimer />
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Weekly Deals</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {weeklyDeals.slice(0, 3).map(product => (
                <div key={product.id} className="group cursor-pointer bg-white rounded-sm p-3" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
                  <div className="relative overflow-hidden bg-gray-50 aspect-square mb-3 rounded-sm">
                    <div className="w-full h-full flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500">{catEmojis[product.categories?.slug] || '\\ud83d\\udecd\\ufe0f'}</div>
                    {product.sale_price && <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5" style={{ background: '#e53e3e' }}>-{Math.round((1 - product.sale_price / product.price) * 100)}%</span>}
                    {hoveredProduct === product.id && (
                      <div className="absolute bottom-0 left-0 right-0 py-2 px-2 flex items-center justify-between bg-white/95">
                        <button onClick={() => { addItem(product); toast.success('Added!') }} className="flex items-center gap-1 text-xs font-semibold" style={{ color: TEAL }}><ShoppingCart size={12} /> Add</button>
                        <button className="text-gray-400 hover:text-red-500"><Heart size={12} /></button>
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">ASHKONA BAZAR</div>
                  <Link href={"/products/" + product.slug} className="font-semibold text-xs text-gray-900 hover:underline block mb-1">{product.name}</Link>
                  <div className="text-xs flex items-center gap-2">
                    <span className="font-semibold">\\u09f3{product.sale_price}</span>
                    <span className="text-gray-400 line-through">\\u09f3{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 border-t border-gray-100">
        <div className="flex items-end justify-between mb-8">
          <div><h2 className="text-xl md:text-2xl font-bold text-gray-900">Our Partners</h2><p className="text-gray-500 text-sm mt-1 hidden md:block">Shop from our extensive brand catalog</p></div>
          <Link href="#" className="text-sm font-semibold flex items-center gap-1 hover:opacity-70" style={{ color: TEAL }}>See all brands <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
          {partners.map(p => (
            <div key={p} className="border border-gray-200 rounded-sm aspect-square flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors group">
              <span className="text-xs font-bold text-gray-400 group-hover:text-gray-700 transition-colors text-center px-1">{p}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 px-4 md:px-6" style={{ background: '#1a1a1a' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-white">What are people saying about us</h2>
            <p className="text-gray-400 text-sm mt-1">4.9 star rating from over 3000 reviews (98% satisfaction rate).</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-sm hover:bg-white/10 transition-all">
                <div className="text-gray-500 text-2xl font-serif mb-3">"</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">{t.text}</p>
                <div className="text-gray-500 text-xs font-semibold">- {t.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex items-center gap-6 mb-8 border-b border-gray-200">
          <button className="text-base font-bold pb-3 border-b-2 text-gray-900" style={{ borderColor: TEAL }}>Latest Articles</button>
          <button className="text-base font-medium pb-3 text-gray-400 border-b-2 border-transparent">Most Read</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {blogs.map((b, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-sm mb-3 bg-gray-100 aspect-video">
                <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform duration-500">{b.emoji}</div>
                <div className="absolute top-2 left-2 text-white text-center px-2 py-1 rounded-sm" style={{ background: TEAL }}>
                  <div className="text-sm font-bold leading-none">{b.date}</div>
                  <div className="text-[10px] uppercase">{b.month}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5">
                <span>\\ud83d\\udc64 admin</span><span>\\ud83d\\udcac {b.comments}</span><span>\\ud83d\\udc41 {b.views.toLocaleString()}</span>
              </div>
              <h3 className="font-semibold text-xs md:text-sm text-gray-900 mb-1 group-hover:underline line-clamp-2">{b.title}</h3>
              <button className="text-xs font-semibold flex items-center gap-1 hover:opacity-70" style={{ color: TEAL }}>Continue reading <ArrowRight size={11} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8 px-4 md:px-6" style={{ background: '#f0ece4' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <Send size={20} className="text-gray-600" />
            <span className="text-base md:text-lg font-bold text-gray-900">Sign up now & get 15% Off</span>
          </div>
          <div className="flex items-center gap-0">
            <span className="border border-gray-300 px-3 py-2.5 text-gray-400 bg-white text-sm">@</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" className="border border-l-0 border-gray-300 px-4 py-2.5 text-sm outline-none w-52 md:w-64 bg-white" />
            <button className="px-5 py-2.5 text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90" style={{ background: TEAL }}><Send size={13} /> Sign Up</button>
          </div>
        </div>
      </section>

    </div>
  )
}
""")
page.close()
print("page.tsx fixed!")
