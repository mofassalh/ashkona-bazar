'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, RotateCcw, ArrowRight, Send } from 'lucide-react'

const catEmojis = { 'womens-fashion': '👗', 'mens-wear': '👔', 'kitchen-tools': '🔪', 'accessories': '👒', 'cookware': '🍳' }
const bgColors = ['#e8e0d8','#d8e8e0','#d8e0e8','#e8d8e8','#f0e8d8']
const slideBgs = ['#f0ece4', '#e8f0ee', '#ede8f0']
const slideEmojis = ['👗', '🍳', '✨']


function useScrollAnimation() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

function CountdownTimer() {
  const [cd, setCd] = useState({ d: 7, h: 12, m: 30, s: 0 })
  const [mounted, setMounted] = useState(false)
  const pad = n => String(n).padStart(2, '0')
  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => {
      setCd(prev => {
        let { d, h, m, s } = prev
        s--; if (s < 0) { s = 59; m-- } if (m < 0) { m = 59; h-- } if (h < 0) { h = 23; d-- } if (d < 0) d = 0
        return { d, h, m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])
  const vals = mounted ? [['d', cd.d, 'Days'], ['h', cd.h, 'Hours'], ['m', cd.m, 'Min'], ['s', cd.s, 'Sec']] : [['d', 7, 'Days'], ['h', 12, 'Hours'], ['m', 30, 'Min'], ['s', 0, 'Sec']]
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


function CategorySection({ categories, TEAL, bgColors, catEmojis }) {
  const { ref, visible } = useScrollAnimation()
  return (
    <section ref={ref} className="w-full px-4 md:px-6 py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Shop by <span style={{ color: TEAL }}>Category</span></h2>
          <p className="text-gray-400 text-sm mt-1">Browse our collections</p>
        </div>
        <a href="/products" className="text-sm font-semibold flex items-center gap-1 hover:opacity-70" style={{ color: TEAL }}>All Categories →</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {categories.slice(0, 2).map((cat, i) => (
          
            key={cat.id}
            href={"/products?category=" + cat.slug}
            className="group block rounded-xl overflow-hidden border border-gray-100"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : (i === 0 ? 'translateX(-60px)' : 'translateX(60px)'),
              transition: 'opacity 0.7s ease ' + (i * 0.15) + 's, transform 0.7s ease ' + (i * 0.15) + 's'
            }}
          >
            <div className="relative overflow-hidden" style={{ height: 260 }}>
              {cat.image_url
                ? <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                : <div className="w-full h-full flex items-center justify-center text-8xl" style={{ background: bgColors[i] }}>{catEmojis[cat.slug] || '🛍️'}</div>
              }
              <div className="absolute inset-0 group-hover:bg-black/10 transition-all duration-300" />
              <div className="absolute inset-0 flex items-end p-0">
                <div className="w-full p-5" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)' }}>
                  <div className="text-white font-bold text-xl mb-1">{cat.name}</div>
                  <div className="text-white/70 text-xs mb-3">{cat.name === 'Fashion' ? "Men's & Women's Collection" : 'Cookware, Utensils & More'}</div>
                  <span className="inline-block bg-white text-xs font-bold px-4 py-1.5 rounded-full group-hover:bg-opacity-90 transition-all" style={{ color: TEAL }}>Shop Now →</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

function ProductsGrid({ products, TEAL, catEmojis, settings, addItem }) {
  const { ref, visible } = useScrollAnimation()
  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="group"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.6s ease ' + (i * 0.12) + 's, transform 0.6s ease ' + (i * 0.12) + 's'
          }}
        >
          <div className="relative overflow-hidden bg-gray-50 aspect-square mb-3 rounded-sm" onClick={() => window.location.href='/products/'+product.slug} style={{ cursor: 'pointer' }}>
            <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
              {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl md:text-7xl">{catEmojis[product.categories?.slug] || '🛍️'}</div>}
            </div>
            {product.badge && <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5" style={{ background: product.badge === 'Sale' ? '#e53e3e' : product.badge === 'Hot' ? TEAL : '#111' }}>{product.badge}</span>}
            <div className="absolute bottom-0 left-0 right-0 py-2.5 px-3 flex items-center justify-between translate-y-full group-hover:translate-y-0 transition-transform duration-300" style={{ background: TEAL }}>
              <button onClick={(e) => { e.stopPropagation(); addItem(product); toast.success('Added!') }} className="flex items-center gap-1 text-xs font-semibold text-white"><ShoppingCart size={12} /> Add to Cart</button>
              <div className="flex gap-1.5"><button className="text-white hover:text-red-200"><Heart size={12} /></button><button className="text-white hover:text-gray-200"><RotateCcw size={12} /></button></div>
            </div>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">{settings.brand_name || 'ASHKONA BAZAR'}</div>
          <div className="text-[10px] font-medium mb-1" style={{ color: product.stock > 0 ? TEAL : '#999' }}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</div>
          <a href={'/products/' + product.slug} className="font-semibold text-sm text-gray-900 hover:underline block mb-1">{product.name}</a>
          <div className="text-sm">
            {product.sale_price ? <><span className="font-semibold">৳{product.sale_price}</span><span className="text-gray-400 line-through ml-2 text-xs">৳{product.price}</span></> : <span className="font-semibold">৳{product.price}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState({})
  const [slides, setSlides] = useState([])
  const [products, setProducts] = useState([])
  const [weeklyDeals, setWeeklyDeals] = useState([])
  const [categories, setCategories] = useState([])
  const [marqueeItems, setMarqueeItems] = useState([])
  const [features, setFeatures] = useState([])
  const [partners, setPartners] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [blogs, setBlogs] = useState([])
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [email, setEmail] = useState('')
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    setMounted(true)
    const s = setInterval(() => setCurrent(c => (c + 1) % Math.max(slides.length, 1)), 5000)
    return () => clearInterval(s)
  }, [slides.length])

  useEffect(() => {
    // Fetch settings
    supabase.from('settings').select('*').then(({ data }) => {
      const obj = {}
      data?.forEach(s => obj[s.key] = s.value)
      setSettings(obj)
      // Build slides from settings
      // slides loaded separately from hero_slides table
    })
    supabase.from('hero_slides').select('*').eq('is_active', true).order('sort_order').then(({ data }) => {
      if (data && data.length > 0) {
        setSlides(data.map(s => ({
          tag: s.tag, title: s.title, subtitle: s.subtitle, price: s.price,
          image: s.image_url || '', bg: s.bg_color || '#f0ece4', emoji: '✨',
          btn1: { text: s.btn1_text || 'Shop Now', href: s.btn1_href || '/products' },
          btn2: { text: s.btn2_text || 'Learn more', href: s.btn2_href || '/products' }
        })))
      }
    })
    supabase.from('products').select('*, categories(name,slug)').eq('featured', true).limit(8).then(({ data }) => setProducts(data || []))
    supabase.from('products').select('*, categories(name,slug)').not('sale_price', 'is', null).limit(6).then(({ data }) => setWeeklyDeals(data || []))
    supabase.from('categories').select('*').order('sort_order', { ascending: true }).then(({ data }) => setCategories(data || []))
    supabase.from('marquee_items').select('*').eq('is_active', true).order('sort_order').then(({ data }) => setMarqueeItems(data || []))
    supabase.from('features').select('*').eq('is_active', true).order('sort_order').then(({ data }) => setFeatures(data || []))
    supabase.from('partners').select('*').eq('is_active', true).order('sort_order').then(({ data }) => setPartners(data || []))
    supabase.from('testimonials').select('*').eq('is_active', true).order('sort_order').then(({ data }) => setTestimonials(data || []))
    supabase.from('blogs').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(4).then(({ data }) => setBlogs(data || []))
  }, [])

  const TEAL = settings.primary_color || '#1a6b5e'

  if (!mounted) return <div suppressHydrationWarning className="min-h-screen bg-white" />

  return (
    <div className="overflow-x-hidden bg-white">

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ minHeight: '75vh' }}>
        {slides.map((slide, i) => (
          <div key={i} className={"absolute inset-0 transition-opacity duration-1000 " + (i === current ? 'opacity-100 z-10' : 'opacity-0 z-0')}>
            {/* BACKGROUND IMAGE */}
            {slide.image && <img src={slide.image} alt={slide.title} className={"absolute inset-0 w-full h-full object-cover transition-transform duration-[8000ms] ease-out " + (i === current ? "scale-110" : "scale-100")} />}
            {!slide.image && <div className="absolute inset-0" style={{ background: slide.bg }}></div>}
            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0" style={{ background: slide.image ? 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.05) 100%)' : 'transparent' }}></div>
            {/* CONTENT */}
            <div className="relative z-10 max-w-full px-6 md:px-16 min-h-[75vh] flex items-center py-16">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold" style={{ color: slide.image ? '#fff' : TEAL }}>{slide.tag}</span>
                  <div className="h-px w-10" style={{ background: slide.image ? '#fff' : TEAL }}></div>
                </div>
                <h1 className="font-bold text-4xl md:text-6xl mb-4 leading-tight" style={{ color: slide.image ? '#fff' : '#111' }}>{slide.title}</h1>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-lg" style={{ color: slide.image ? 'rgba(255,255,255,0.8)' : '#666' }}>{slide.subtitle}</span>
                  <span className="text-3xl md:text-4xl font-bold" style={{ color: slide.image ? '#fff' : '#111' }}>{slide.price}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={slide.btn1.href} className="px-7 py-3 text-white text-sm font-semibold rounded-full hover:opacity-90 transition-all" style={{ background: TEAL }}>{slide.btn1.text}</Link>
                  <Link href={slide.btn2.href} className="px-7 py-3 text-sm font-semibold rounded-full border hover:opacity-90 transition-all" style={{ color: slide.image ? '#fff' : '#333', borderColor: slide.image ? 'rgba(255,255,255,0.6)' : '#ccc', background: slide.image ? 'rgba(255,255,255,0.15)' : '#fff' }}>{slide.btn2.text}</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i === current ? 28 : 8, background: i === current ? TEAL : '#ccc' }} />
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div className="py-3.5 overflow-hidden" style={{ background: '#111' }}>
        <div className="flex animate-marquee w-max">
          {[...Array(2)].map((_, ri) => (
            <div key={ri} className="flex">
              {marqueeItems.map(item => (
                <span key={item.id} className="text-white text-xs tracking-widest uppercase font-medium px-10 whitespace-nowrap">
                  {item.text} <span style={{ color: '#f59e0b' }} className="mx-2">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY BANNERS */}
      <CategorySection categories={categories} TEAL={TEAL} bgColors={bgColors} catEmojis={catEmojis} />

      {/* NEW ARRIVALS */}
      <section className="w-full px-6 md:px-10 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{settings.new_arrivals_title || 'New Arrivals'}</h2>
            <p className="text-gray-500 text-sm mt-1 hidden md:block">{settings.new_arrivals_subtitle || 'Just added, shop our latest products before they are gone.'}</p>
          </div>
          <Link href="/products" className="text-sm font-semibold flex items-center gap-1 hover:opacity-70" style={{ color: TEAL }}>Shop all <ArrowRight size={14} /></Link>
        </div>
        <ProductsGrid products={products.slice(0, 4)} TEAL={TEAL} catEmojis={catEmojis} settings={settings} addItem={addItem} />
      </section>

      {/* FEATURES BAR */}
      <section className="py-8 px-4 md:px-6" style={{ background: TEAL }}>
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.id} className="flex items-center gap-3 md:gap-4">
              <span className="text-2xl md:text-3xl">{f.icon}</span>
              <div>
                <div className="text-white font-semibold text-xs md:text-sm">{f.title}</div>
                <div className="text-white/60 text-xs mt-0.5 hidden md:block">{f.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="w-full px-6 md:px-10 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{settings.shop_by_category_title || 'Shop by Category'}</h2>
            <p className="text-gray-500 text-sm mt-1 hidden md:block">{settings.shop_by_category_subtitle || 'Browse our wide range of product categories.'}</p>
          </div>
          <Link href="/products" className="text-sm font-semibold flex items-center gap-1 hover:opacity-70" style={{ color: TEAL }}>All Departments <ArrowRight size={14} /></Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <Link key={cat.id} href={"/products?category=" + cat.slug} className="group cursor-pointer flex-shrink-0" style={{ width: 'calc(25% - 12px)', minWidth: 200 }}>
              <div className="relative overflow-hidden rounded-sm bg-gray-50 aspect-square mb-3 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                {cat.image_url ? <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <span className="text-5xl md:text-7xl opacity-40 group-hover:scale-110 transition-transform duration-300">{catEmojis[cat.slug] || '🛍️'}</span>}
              </div>
              <div className="font-semibold text-sm text-gray-900">{cat.name} <span className="text-gray-400 font-normal text-xs">24</span></div>
              <p className="text-gray-400 text-xs mt-0.5 hidden md:block">Browse our {cat.name.toLowerCase()} collection.</p>
            </Link>
          ))}
        </div>
      </section>

{settings.show_weekly_deals !== 'false' && (
      <section className="py-12 px-4 md:px-6 bg-gray-50">
        <div className="w-full flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-52 flex-shrink-0 rounded-sm flex flex-col items-center justify-center py-8 px-6 text-center" style={{ background: TEAL }}>
            <span className="text-4xl mb-3">🏷️</span>
            <h3 className="text-white font-bold text-lg mb-1">{settings.deals_title || 'Deals of the Week'}</h3>
            <p className="text-white/70 text-xs mb-6">{settings.deals_subtitle || 'Save up to 70% on select offers'}</p>
            <CountdownTimer />
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{settings.weekly_deals_title || 'Weekly Deals'}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {weeklyDeals.slice(0, 3).map(product => (
                <div key={product.id} className="group cursor-pointer bg-white rounded-sm p-3" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
                  <div className="relative overflow-hidden bg-gray-50 aspect-square mb-3 rounded-sm" onClick={() => window.location.href='/products/'+product.slug}>
                    <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
                      {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl">{catEmojis[product.categories?.slug] || '🛍️'}</div>}
                    </div>
                    {product.sale_price && <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5" style={{ background: '#e53e3e' }}>-{Math.round((1 - product.sale_price / product.price) * 100)}%</span>}
                    {hoveredProduct === product.id && (
                      <div className="absolute bottom-0 left-0 right-0 py-2 px-2 flex items-center justify-between" style={{ background: TEAL }}>
                        <button onClick={(e) => { e.stopPropagation(); addItem(product); toast.success('Added!') }} className="flex items-center gap-1 text-xs font-semibold text-white"><ShoppingCart size={12} /> Add</button>
                        <button className="text-white hover:text-red-200"><Heart size={12} /></button>
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">{settings.brand_name || 'ASHKONA BAZAR'}</div>
                  <Link href={'/products/' + product.slug} className="font-semibold text-xs text-gray-900 hover:underline block mb-1">{product.name}</Link>
                  <div className="text-xs flex items-center gap-2">
                    <span className="font-semibold">৳{product.sale_price}</span>
                    <span className="text-gray-400 line-through">৳{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
)}
{settings.show_partners !== 'false' && (
      <section className="w-full px-6 md:px-10 py-10 border-t border-gray-100">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{settings.partners_title || 'Our Partners'}</h2>
            <p className="text-gray-500 text-sm mt-1 hidden md:block">{settings.partners_subtitle || 'Shop from our extensive brand catalog'}</p>
          </div>
          <Link href="#" className="text-sm font-semibold flex items-center gap-1 hover:opacity-70" style={{ color: TEAL }}>See all brands <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
          {partners.map(p => (
            <div key={p.id} className="border border-gray-200 rounded-sm aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors group p-2">
              {p.logo_url ? <img src={p.logo_url} alt={p.name} className="w-full h-full object-contain" /> : <span className="text-xs font-bold text-gray-400 group-hover:text-gray-700 transition-colors text-center leading-tight">{p.name}</span>}
            </div>
          ))}
        </div>
      </section>
)}
{settings.show_testimonials !== 'false' && (
      <section className="py-14 px-4 md:px-6" style={{ background: '#1a1a1a' }}>
        <div className="w-full">
          <div className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-white">{settings.testimonials_title || 'What are people saying about us'}</h2>
            <p className="text-gray-400 text-sm mt-1">{settings.testimonials_subtitle || '4.9 star rating from over 3000 reviews (98% satisfaction rate).'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {testimonials.map(t => (
              <div key={t.id} className="bg-white/5 border border-white/10 p-5 rounded-sm hover:bg-white/10 transition-all">
                <div className="text-gray-500 text-2xl font-serif mb-3">"</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">{t.text}</p>
                <div className="text-gray-500 text-xs font-semibold">- {t.author}</div>
                {t.role && <div className="text-gray-600 text-xs">{t.role}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
)}

      {/* LATEST ARTICLES */}

      {/* NEWSLETTER */}
      <section className="py-8 px-4 md:px-6" style={{ background: '#f0ece4' }}>
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <Send size={20} className="text-gray-600" />
            <span className="text-base md:text-lg font-bold text-gray-900">{settings.newsletter_text || 'Sign up now & get 15% Off'}</span>
          </div>
          <div className="flex items-center gap-0">
            <span className="border border-gray-300 px-3 py-2.5 text-gray-400 bg-white text-sm">@</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={settings.newsletter_placeholder || 'Enter email'} className="border border-l-0 border-gray-300 px-4 py-2.5 text-sm outline-none w-52 md:w-64 bg-white" />
            <button className="px-5 py-2.5 text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90" style={{ background: TEAL }}><Send size={13} /> {settings.newsletter_btn || 'Sign Up'}</button>
          </div>
        </div>
      </section>

    </div>
  )
}
