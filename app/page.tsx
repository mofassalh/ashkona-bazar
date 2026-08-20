'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { ShoppingCart, Heart, RotateCcw, ArrowRight, Send } from 'lucide-react'

function useScrollAnimation(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold }
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
        <div key={key} className="bg-white/10 border border-white/20 py-2 px-1 rounded-lg text-center">
          <span className="text-white font-bold text-xl block leading-none">{pad(val)}</span>
          <span className="text-white/60 text-[10px] uppercase tracking-wider mt-1 block">{label}</span>
        </div>
      ))}
    </div>
  )
}

function CategorySection({ categories, TEAL, settings }) {
  const { ref, visible } = useScrollAnimation()
  return (
    <section ref={ref} className="w-full px-4 md:px-8 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by <span style={{ color: TEAL }}>Category</span></h2>
          <p className="text-gray-400 text-sm mt-1">{settings.shop_by_category_subtitle || 'Browse our collections'}</p>
        </div>
        <Link href="/products" className="text-sm font-semibold flex items-center gap-1 hover:opacity-70" style={{ color: TEAL }}>All Categories <ArrowRight size={14} /></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.slice(0, 2).map((cat, i) => (
          <a
            key={cat.id}
            href={"/products?category=" + cat.slug}
            className="group block rounded-2xl overflow-hidden"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : (i === 0 ? 'translateX(-80px)' : 'translateX(80px)'),
              transition: 'opacity 0.8s ease ' + (i * 0.1) + 's, transform 0.8s ease ' + (i * 0.1) + 's'
            }}
          >
            <div className="relative overflow-hidden" style={{ height: 280 }}>
              {cat.image_url
                ? <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: 'top' }} />
                : <div className="w-full h-full flex items-center justify-center text-8xl bg-gray-100">🛍️</div>
              }
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-white font-bold text-2xl mb-1">{cat.name}</div>
                <div className="text-white/70 text-sm mb-4">{cat.description || ''}</div>
                <span className="inline-block text-xs font-bold px-5 py-2 rounded-full transition-all duration-300 group-hover:px-7" style={{ background: 'white', color: TEAL }}>Shop Now →</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border border-t-0 border-gray-100 rounded-b-2xl bg-white">
              <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
              <span className="text-xs text-gray-400">Browse collection →</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product, TEAL, settings, addItem, index }) {
  const { ref, visible } = useScrollAnimation()
  const catEmojis = { 'womens-fashion': '👗', 'mens-wear': '👔', 'kitchen-tools': '🔪', 'accessories': '👒', 'cookware': '🍳' }
  return (
    <div
      ref={ref}
      className="group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'opacity 0.6s ease ' + (index * 0.1) + 's, transform 0.6s ease ' + (index * 0.1) + 's'
      }}
    >
      <div className="relative overflow-hidden bg-gray-50 rounded-xl mb-3" style={{ aspectRatio: '3/4', cursor: 'pointer' }} onClick={() => window.location.href='/products/'+product.slug}>
        <div className="w-full h-full group-hover:scale-105 transition-transform duration-700">
          {product.image_url
            ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-6xl">{catEmojis[product.categories?.slug] || '🛍️'}</div>
          }
        </div>
        {product.badge && (
          <span className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: product.badge === 'Sale' ? '#e53e3e' : product.badge === 'Hot' ? '#dd6b20' : TEAL }}>{product.badge}</span>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-sm">
          <Heart size={14} className="text-gray-500" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 py-3 px-4 flex items-center justify-between translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-b-xl" style={{ background: TEAL }}>
          <button onClick={(e) => { e.stopPropagation(); addItem(product); toast.success('Added to cart!') }} className="flex items-center gap-2 text-xs font-semibold text-white">
            <ShoppingCart size={13} /> Add to Cart
          </button>
          <button className="text-white/70 hover:text-white"><RotateCcw size={13} /></button>
        </div>
      </div>
      <div className="px-1">
        <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">{settings.brand_name || 'ASHKONABAZAR'}</div>
        <Link href={'/products/' + product.slug} className="font-semibold text-sm text-gray-900 hover:text-gray-600 block mb-1 leading-snug">{product.name}</Link>
        <div className="flex items-center gap-1 mb-1">
          <span className="text-yellow-400 text-xs">★★★★★</span>
        </div>
        <div className="flex items-baseline gap-2">
          {product.sale_price
            ? <><span className="font-bold text-sm" style={{ color: TEAL }}>৳{product.sale_price}</span><span className="text-gray-300 line-through text-xs">৳{product.price}</span></>
            : <span className="font-bold text-sm" style={{ color: TEAL }}>৳{product.price}</span>
          }
        </div>
      </div>
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
  const [email, setEmail] = useState('')
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    setMounted(true)
    const s = setInterval(() => setCurrent(c => (c + 1) % Math.max(slides.length, 1)), 5000)
    return () => clearInterval(s)
  }, [slides.length])

  useEffect(() => {
    supabase.from('settings').select('*').then(({ data }) => {
      const obj = {}
      data?.forEach(s => obj[s.key] = s.value)
      setSettings(obj)
    })
    supabase.from('hero_slides').select('*').eq('is_active', true).order('sort_order').then(({ data }) => {
      if (data && data.length > 0) {
        setSlides(data.map(s => ({
          tag: s.tag, title: s.title, subtitle: s.subtitle, price: s.price,
          image: s.image_url || '', bg: s.bg_color || '#0f2420',
          btn1: { text: s.btn1_text || 'Shop Sale', href: s.btn1_href || '/products' },
          btn2: { text: s.btn2_text || 'View All', href: s.btn2_href || '/products' }
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
  }, [])

  const TEAL = settings.primary_color || '#1a6b5e'
  if (!mounted) return <div suppressHydrationWarning className="min-h-screen bg-white" />

  return (
    <div className="overflow-x-hidden bg-white">

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ minHeight: '80vh' }}>

        {slides.map((slide, i) => (
          <div key={i} className={"absolute inset-0 transition-opacity duration-1000 " + (i === current ? 'opacity-100 z-10' : 'opacity-0 z-0')}>
            {slide.image && <img src={slide.image} alt={slide.title} className={"absolute inset-0 w-full h-full object-cover transition-transform duration-[8000ms] ease-out " + (i === current ? "scale-110" : "scale-100")} />}
            {!slide.image && <div className="absolute inset-0" style={{ background: slide.bg || '#0f2420' }}></div>}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)' }}></div>
            <div className="relative z-10 px-8 md:px-16 min-h-[80vh] flex items-center">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs tracking-widest uppercase text-white/70">{slide.tag}</span>
                  <div className="h-px w-10 bg-white/40"></div>
                </div>
                <h1 className="font-bold text-4xl md:text-6xl mb-4 leading-tight text-white">{slide.title}</h1>
                <p className="text-white/60 text-sm mb-8">{slide.subtitle} {slide.price && <span className="text-white font-bold text-2xl ml-2">{slide.price}</span>}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href={slide.btn1.href} className="px-8 py-3 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-all" style={{ background: TEAL }}>{slide.btn1.text}</Link>
                  <Link href={slide.btn2.href} className="px-8 py-3 text-sm font-medium rounded-lg border border-white/30 text-white hover:bg-white/10 transition-all">{slide.btn2.text}</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i === current ? 28 : 8, background: i === current ? 'white' : 'rgba(255,255,255,0.3)' }} />
          ))}
        </div>
      </section>


      {/* CATEGORIES */}
      <CategorySection categories={categories} TEAL={TEAL} settings={settings} />

      {/* NEW ARRIVALS */}
      <section className="w-full px-4 md:px-8 py-10 bg-gray-50">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{settings.new_arrivals_title || 'New'} <span style={{ color: TEAL }}>Arrivals</span></h2>
            <p className="text-gray-400 text-sm mt-1">{settings.new_arrivals_subtitle || 'Just added — shop before they are gone'}</p>
          </div>
          <Link href="/products" className="text-sm font-semibold flex items-center gap-1 hover:opacity-70" style={{ color: TEAL }}>Shop all <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product, i) => (
            <ProductCard key={product.id} product={product} TEAL={TEAL} settings={settings} addItem={addItem} index={i} />
          ))}
        </div>
      </section>






    </div>
  )
}
