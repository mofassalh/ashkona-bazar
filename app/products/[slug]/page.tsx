'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { ShoppingCart, Heart, ChevronDown, ChevronUp, Truck, RefreshCw, Shield, Headphones } from 'lucide-react'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [related, setRelated] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({})
  const [activeImage, setActiveImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [shippingOpen, setShippingOpen] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    supabase.from('settings').select('*').then(({ data }) => {
      if (data) {
        const obj = {}
        data.forEach(s => obj[s.key] = s.value)
        setSettings(obj)
      }
    })
    supabase.from('products').select('*, categories(name, slug)').eq('slug', slug).single().then(({ data }) => {
      setProduct(data)
      setLoading(false)
      if (data?.id) {
        supabase.from('product_variants').select('*').eq('product_id', data.id).order('sort_order').then(({ data: vars }) => {
          setVariants(vars || [])
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
      <h2 className="font-bold text-2xl">Product Not Found</h2>
      <Link href="/products" className="text-sm font-semibold" style={{ color: TEAL }}>← Back to Products</Link>
    </div>
  )

  const TEAL = settings.primary_color || '#1a6b5e'
  const brandName = settings.brand_name || 'AshkonaBazar'

  // Build image list based on selected variant
  const allImages = selectedVariant
    ? [
        ...(selectedVariant.image_url ? [{ url: selectedVariant.image_url, label: selectedVariant.color }] : []),
        ...((selectedVariant.images || []).filter(img => img).map((img, i) => ({ url: img, label: selectedVariant.color + ' ' + (i + 2) })))
      ]
    : [
        ...(product.image_url ? [{ url: product.image_url, label: 'Main' }] : []),
        ...((product.images || []).filter(img => img).map((img, i) => ({ url: img, label: 'Image ' + (i + 2) })))
      ]

  const currentImage = allImages.length > 0 ? allImages[activeImage]?.url : product.image_url

  const handleVariantSelect = (variant) => {
    if (selectedVariant?.id === variant.id) {
      setSelectedVariant(null)
      setActiveImage(0)
    } else {
      setSelectedVariant(variant)
      setActiveImage(0)
    }
  }

  const currentPrice = selectedVariant?.price || product.price
  const currentSalePrice = selectedVariant?.sale_price || product.sale_price
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock

  return (
    <div className="min-h-screen bg-white">

      {/* BREADCRUMB */}
      <div className="px-4 md:px-8 py-3 border-b border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-400 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>→</span>
          <Link href={'/products?category=' + product.categories?.slug} className="hover:text-gray-700">{product.categories?.name}</Link>
          <span>→</span>
          <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">

          {/* LEFT - IMAGES */}
          <div className="flex gap-3">
            {/* THUMBNAILS */}
            {allImages.length > 1 && (
              <div className="flex flex-col gap-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0"
                    style={{ borderColor: activeImage === i ? TEAL : '#e5e7eb' }}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* MAIN IMAGE */}
            <div className="flex-1 relative bg-gray-50 rounded-2xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">🛍️</div>
              )}
              {product.badge && (
                <span className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: product.badge === 'Sale' ? '#e53e3e' : product.badge === 'Hot' ? '#dd6b20' : TEAL }}>
                  {product.badge}
                </span>
              )}
              <button
                onClick={() => {
                  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
                  const exists = wishlist.find(w => w.id === product.id)
                  if (exists) { toast.error('Already in wishlist!'); return }
                  wishlist.push(product)
                  localStorage.setItem('wishlist', JSON.stringify(wishlist))
                  toast.success('Added to wishlist!')
                }}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
              >
                <Heart size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* RIGHT - DETAILS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">{brandName}</span>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400">{product.categories?.name}</span>
            </div>

            <h1 className="font-bold text-2xl md:text-3xl text-gray-900 leading-tight mb-4">{product.name}</h1>

            <div className="flex items-center gap-2 mb-5">
              <span className="text-yellow-400 text-sm">★★★★★</span>
              <span className="text-xs text-gray-400">4.8 (120 reviews)</span>
            </div>

            {/* PRICE */}
            <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-gray-100">
              {currentSalePrice ? (
                <>
                  <span className="font-bold text-3xl" style={{ color: TEAL }}>৳{(currentSalePrice * quantity).toFixed(0)}</span>
                  <span className="text-lg text-gray-300 line-through">৳{(currentPrice * quantity).toFixed(0)}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: '#fef3f3', color: '#e53e3e' }}>
                    Save ৳{((currentPrice - currentSalePrice) * quantity).toFixed(0)}
                  </span>
                </>
              ) : (
                <span className="font-bold text-3xl" style={{ color: TEAL }}>৳{(currentPrice * quantity).toFixed(0)}</span>
              )}
            </div>

            {/* DESCRIPTION */}
            {product.description && (
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>
            )}

            {/* COLOR VARIANTS */}
            {variants.length > 0 && (
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Color: <span className="text-gray-900">{selectedVariant?.color || 'Select a color'}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handleVariantSelect(v)}
                      title={v.color}
                      className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                      style={{
                        background: v.color_hex || '#ccc',
                        borderColor: selectedVariant?.id === v.id ? TEAL : 'transparent',
                        outline: selectedVariant?.id === v.id ? '2px solid ' + TEAL : '2px solid transparent',
                        outlineOffset: '2px'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* STOCK */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full" style={{ background: currentStock > 0 ? '#22c55e' : '#e53e3e' }}></div>
              <span className="text-sm font-semibold" style={{ color: currentStock > 0 ? '#22c55e' : '#e53e3e' }}>
                {currentStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              {currentStock > 0 && <span className="text-xs text-gray-400">({currentStock} available)</span>}
            </div>

            {/* QUANTITY + BUTTONS */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 text-lg font-light text-gray-600">−</button>
                <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(currentStock, q + 1))} className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 text-lg font-light text-gray-600">+</button>
              </div>
              <button
                onClick={() => {
                  const item = { ...product, ...(selectedVariant ? { price: selectedVariant.price || product.price, sale_price: selectedVariant.sale_price || product.sale_price, image_url: selectedVariant.image_url || product.image_url } : {}) }
                  for(let i = 0; i < quantity; i++) addItem(item)
                  toast.success(quantity + ' item(s) added!')
                }}
                disabled={currentStock === 0}
                className="flex-1 text-white py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: TEAL }}
              >
                <ShoppingCart size={15} /> Add to Cart
              </button>
            </div>

            <button
              onClick={() => { addItem(product); router.push('/checkout') }}
              className="w-full py-3 text-sm font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors mb-6"
            >
              ⚡ Buy Now
            </button>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 border border-gray-100 rounded-xl p-3">
                <Truck size={16} style={{ color: TEAL }} />
                <div><div className="text-xs font-semibold">Free Delivery</div><div className="text-[10px] text-gray-400">Orders over ৳999</div></div>
              </div>
              <div className="flex items-center gap-2 border border-gray-100 rounded-xl p-3">
                <RefreshCw size={16} style={{ color: TEAL }} />
                <div><div className="text-xs font-semibold">7-Day Returns</div><div className="text-[10px] text-gray-400">Easy returns</div></div>
              </div>
              <div className="flex items-center gap-2 border border-gray-100 rounded-xl p-3">
                <Shield size={16} style={{ color: TEAL }} />
                <div><div className="text-xs font-semibold">Authentic</div><div className="text-[10px] text-gray-400">100% genuine</div></div>
              </div>
              <div className="flex items-center gap-2 border border-gray-100 rounded-xl p-3">
                <Headphones size={16} style={{ color: TEAL }} />
                <div><div className="text-xs font-semibold">24/7 Support</div><div className="text-[10px] text-gray-400">Always here</div></div>
              </div>
            </div>

            {/* SHIPPING ACCORDION */}
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <button onClick={() => setShippingOpen(!shippingOpen)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold hover:bg-gray-50">
                Shipping & Returns
                {shippingOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {shippingOpen && (
                <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100">
                  {settings.shipping_returns || 'Free shipping on orders over ৳999. Easy 7-day returns. No questions asked.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="border-t border-gray-100 pt-10">
            <h2 className="text-xl font-bold mb-6">Related <span style={{ color: TEAL }}>Products</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => (
                <div key={p.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden bg-gray-50 rounded-xl mb-3" style={{ aspectRatio: '3/4' }} onClick={() => window.location.href = '/products/' + p.slug}>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      : <div className="w-full h-full flex items-center justify-center text-5xl">🛍️</div>
                    }
                    {p.badge && <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: p.badge === 'Sale' ? '#e53e3e' : TEAL }}>{p.badge}</span>}
                    <div className="absolute bottom-0 left-0 right-0 py-2.5 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-b-xl" style={{ background: TEAL }}>
                      <button onClick={e => { e.stopPropagation(); addItem(p); toast.success('Added!') }} className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <ShoppingCart size={12} /> Add to Cart
                      </button>
                    </div>
                  </div>
                  <Link href={'/products/' + p.slug} className="font-semibold text-sm text-gray-900 hover:text-gray-600 block mb-1 line-clamp-2">{p.name}</Link>
                  <div className="flex items-baseline gap-2">
                    {p.sale_price
                      ? <><span className="font-bold text-sm" style={{ color: TEAL }}>৳{p.sale_price}</span><span className="text-gray-300 line-through text-xs">৳{p.price}</span></>
                      : <span className="font-bold text-sm" style={{ color: TEAL }}>৳{p.price}</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
