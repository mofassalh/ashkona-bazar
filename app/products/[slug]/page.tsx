'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { ShoppingCart, Heart, RotateCcw, ChevronDown, ChevronUp, Play, HelpCircle } from 'lucide-react'

const TEAL = '#1a6b5e'
const catEmojis = { 'womens-fashion': '👗', 'mens-wear': '👔', 'kitchen-tools': '🔪', 'accessories': '👒', 'cookware': '🍳' }

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [shippingOpen, setShippingOpen] = useState(false)
  const [pageSettings, setPageSettings] = useState<any>({})
  const [infoOpen, setInfoOpen] = useState(false)
  const [activeThumb, setActiveThumb] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const router = useRouter()
  const addItem = useCartStore(s => s.addItem)

  const thumbs = ['👗', '👗', '👗', '👗']

  useEffect(() => {
    supabase.from('settings').select('*').then(({ data }) => {
      const obj: any = {}
      data?.forEach((s: any) => obj[s.key] = s.value)
      setPageSettings(obj)
    })
    supabase.from('products').select('*, categories(name, slug)').eq('slug', slug).single().then(({ data }) => {
      setProduct(data)
      setLoading(false)
      if (data?.category_id) {
        supabase.from('settings').select('*').then(({ data }) => {
      const obj: any = {}
      data?.forEach((s: any) => obj[s.key] = s.value)
      setPageSettings(obj)
    })
    supabase.from('products').select('*, categories(name,slug)').eq('category_id', data.category_id).neq('slug', slug).limit(4).then(({ data: rel }) => setRelated(rel || []))
      }
    })
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-gray-400 text-sm animate-pulse">Loading...</span>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="text-6xl">😕</span>
      <h2 className="font-bold text-3xl">Product Not Found</h2>
      <Link href="/products" className="text-sm font-semibold underline hover:text-teal-700">Back to Products</Link>
    </div>
  )

  const emoji = catEmojis[product.categories?.slug] || '🛍️'
  const allImages = product.image_url 
    ? [product.image_url, ...(product.images || []).filter((img: string) => img !== product.image_url)]
    : [emoji]
  const thumbEmojis = allImages

  return (
    <div className="min-h-screen bg-white">
      {/* BREADCRUMB */}
      <div className="py-4 px-6 border-b border-gray-100" style={{ background: '#f5f2ee' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-800">Home</Link>
          <span>/</span>
          <Link href={"/products?category=" + product.categories?.slug} className="hover:text-gray-800">{product.categories?.name}</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">

          {/* LEFT - IMAGES */}
          <div className="flex gap-3">
            {/* THUMBNAILS */}
            <div className="flex flex-col gap-2">
              {thumbEmojis.map((e, i) => (
                <button key={i} onClick={() => setActiveThumb(i)}
                  className="w-16 h-16 border-2 flex items-center justify-center bg-gray-50 rounded-sm overflow-hidden transition-all"
                  style={{ borderColor: activeThumb === i ? TEAL : '#e5e7eb' }}>
                  {product.image_url ? (
                    <img src={e} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{e}</span>
                  )}
                </button>
              ))}
            </div>
            {/* MAIN IMAGE */}
            <div className="flex-1 relative bg-gray-50 rounded-sm flex items-center justify-center aspect-square overflow-hidden group/zoom">
              {product.image_url ? (
                <img src={allImages[activeThumb] || product.image_url} alt={product.name} className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover/zoom:scale-110" onClick={() => setLightboxOpen(true)} />
              ) : (
                <span className="main-product-img" style={{ fontSize: 180, opacity: 0.25, display: "block", cursor: "zoom-in" }} onClick={() => setLightboxOpen(true)}>{thumbEmojis[activeThumb]}</span>
              )}
              {product.badge && (
                <span className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-sm"
                  style={{ background: product.badge === 'Sale' ? '#e53e3e' : product.badge === 'Hot' ? TEAL : '#111' }}>
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT - DETAILS */}
          <div>
            {/* REVIEWS */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex text-gray-300 text-sm">{'★★★★★'.split('').map((s,i) => <span key={i}>★</span>)}</div>
              <span className="text-sm text-gray-400">0 reviews</span>
              <span className="text-gray-300">·</span>
              <button className="text-sm font-semibold hover:underline" style={{ color: TEAL }}>Write a review</button>
            </div>

            {/* LABELS */}
            <div className="flex gap-2 mb-4">
              <span className="text-xs font-semibold px-3 py-1 border border-gray-200 rounded-sm text-gray-600">New Arrival</span>
              {product.badge && <span className="text-xs font-semibold px-3 py-1 border rounded-sm text-white" style={{ background: TEAL }}>{product.badge} 👍</span>}
            </div>

            <h1 className="font-bold text-2xl md:text-3xl text-gray-900 mb-4">{product.name}</h1>

            {/* PRICE */}
            <div className="mb-4">
              <span className="text-xs text-gray-400 block mb-1">from</span>
              {product.sale_price ? (
                <div className="flex items-baseline gap-3">
                  <span className="font-bold text-3xl" style={{ color: TEAL }}>৳{product.sale_price}</span>
                  <span className="text-lg text-gray-400 line-through">৳{product.price}</span>
                </div>
              ) : (
                <span className="font-bold text-3xl" style={{ color: TEAL }}>৳{product.price}</span>
              )}
              {product.sale_price && (
                <div className="text-xs text-gray-400 mt-1">Ex Tax: ৳{product.sale_price}</div>
              )}
            </div>

            {/* STOCK INFO */}
            <div className="bg-gray-50 rounded-sm p-4 mb-6 text-sm">
              <div className="flex flex-col gap-1">
                <div><span className="text-gray-500">• Stock: </span><span className="font-semibold" style={{ color: product.stock > 0 ? TEAL : '#e53e3e' }}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></div>
                <div><span className="text-gray-500">• Brand: </span><span className="font-semibold hover:underline cursor-pointer" style={{ color: TEAL }}>AshkonaBazar</span></div>
                <div><span className="text-gray-500">• Model: </span><span className="font-semibold text-gray-700">{product.slug}</span></div>
              </div>
            </div>

            {/* QUANTITY + BUTTONS */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-gray-200 rounded-sm">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 text-xl font-light">−</button>
                <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 text-xl font-light">+</button>
              </div>
              <button
                onClick={() => { for(let i = 0; i < quantity; i++) addItem(product); toast.success(quantity + ' item(s) added!') }}
                disabled={product.stock === 0}
                className="flex-1 text-white py-3 text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 disabled:opacity-50 rounded-sm hover:opacity-90 transition-opacity"
                style={{ background: TEAL }}
              >
                <ShoppingCart size={15} /> Add to Cart
              </button>
              <button onClick={() => { addItem(product); router.push('/checkout') }} className="border border-gray-200 px-4 py-3 text-xs tracking-widest uppercase font-bold rounded-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                <ShoppingCart size={14} /> Buy Now
              </button>
            </div>

            {/* WISHLIST + COMPARE */}
            <div className="flex items-center gap-4 text-sm mb-6">
              <button onClick={() => {
                const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
                const exists = wishlist.find(w => w.id === product.id)
                if (exists) { toast.error('Already in wishlist!'); return }
                wishlist.push(product)
                localStorage.setItem('wishlist', JSON.stringify(wishlist))
                toast.success('Added to wishlist!')
              }} className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors">
                <Heart size={15} /> Add to Wish List
              </button>
              <button onClick={() => {
                const compare = JSON.parse(localStorage.getItem('compare') || '[]')
                if (compare.length >= 4) { toast.error('Max 4 products to compare!'); return }
                const exists = compare.find(w => w.id === product.id)
                if (exists) { toast.error('Already in compare list!'); return }
                compare.push(product)
                localStorage.setItem('compare', JSON.stringify(compare))
                toast.success('Added to compare!')
              }} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors">
                <RotateCcw size={15} /> Compare this Product
              </button>
            </div>

            {/* SHIPPING ACCORDION */}
            <div className="border border-gray-100 rounded-sm mb-2">
              <button onClick={() => setShippingOpen(!shippingOpen)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold hover:bg-gray-50">
                Shipping & Returns
                {shippingOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {shippingOpen && (
                <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100">
                  {pageSettings.shipping_returns || 'Free shipping on orders over ৳500. Easy 30-day returns. No questions asked.'}
                </div>
              )}
            </div>

            {/* ADDITIONAL INFO ACCORDION */}
            <div className="border border-gray-100 rounded-sm">
              <button onClick={() => setInfoOpen(!infoOpen)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold hover:bg-gray-50">
                Additional Product Info
                {infoOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {infoOpen && (
                <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100">
                  {pageSettings.additional_product_info || product.description || 'Premium quality product from AshkonaBazar. Carefully crafted for everyday use.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FROM SAME CATEGORY */}
        {related.length > 0 && (
          <div className="border-t border-gray-100 pt-10">
            <div className="flex items-center gap-6 mb-6 border-b border-gray-100">
              <button className="text-sm font-bold pb-3 border-b-2" style={{ borderColor: TEAL, color: TEAL }}>From Same Category</button>
              <button className="text-sm font-medium pb-3 text-gray-400 border-b-2 border-transparent">Same Brand</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => (
                <div key={p.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden bg-gray-50 aspect-square mb-3 rounded-sm flex items-center justify-center">
                    {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span style={{ fontSize: 70, opacity: 0.25 }}>{catEmojis[p.categories?.slug] || '🛍️'}</span>
                  )}
                    {p.badge && <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm" style={{ background: p.badge === 'Sale' ? '#e53e3e' : TEAL }}>{p.badge}</span>}
                    <div className="absolute bottom-0 left-0 right-0 py-2 px-2 flex items-center justify-between bg-white/95 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button onClick={() => { addItem(p); toast.success('Added!') }} className="flex items-center gap-1 text-xs font-semibold text-white"><ShoppingCart size={11} /> Add</button>
                      <div className="flex gap-1.5 text-gray-400">
                        <button className="hover:text-red-500"><Heart size={11} /></button>
                        <button className="hover:text-gray-700"><RotateCcw size={11} /></button>
                      </div>
                    </div>
                  </div>
                  <Link href={'/products/' + p.slug} className="font-semibold text-xs text-gray-900 hover:underline block mb-1 line-clamp-2">{p.name}</Link>
                  <div className="text-xs font-bold">
                    {p.sale_price ? <><span style={{ color: TEAL }}>৳{p.sale_price}</span><span className="text-gray-400 line-through ml-1">৳{p.price}</span></> : <span>৳{p.price}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM LINKS */}
        <div className="flex items-center gap-6 mt-10 pt-6 border-t border-gray-100">
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <Play size={14} /> Product Video
          </button>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <HelpCircle size={14} /> Have additional questions?
          </button>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>✕</button>
            {product.image_url ? (
              <img src={allImages[activeThumb] || product.image_url} alt={product.name} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: 280, opacity: 0.3 }}>{thumbEmojis[activeThumb]}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
