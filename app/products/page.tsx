'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { ShoppingCart, Heart, RotateCcw, ZoomIn, ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react'

const TEAL = '#1a6b5e'
const catEmojis = { 'womens-fashion': '👗', 'mens-wear': '👔', 'kitchen-tools': '🔪', 'accessories': '👒', 'cookware': '🍳' }

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get('category')
  const badgeFilter = searchParams.get('badge')
  const subcategoryFilter = searchParams.get('subcategory')
  const subcategoryFilter = searchParams.get('subcategory')

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryFilter || '')
  const [subcategories, setSubcategories] = useState([])
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryFilter || '')
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '')
  const [selectedBadge, setSelectedBadge] = useState(badgeFilter || '')
  const [sortBy, setSortBy] = useState('created_at')
  const [priceOpen, setPriceOpen] = useState(true)
  const [availOpen, setAvailOpen] = useState(true)
  const [catOpen, setCatOpen] = useState(true)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [lightboxProduct, setLightboxProduct] = useState(null)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => setCategories(data || []))
    supabase.from('subcategories').select('*').eq('is_active', true).order('sort_order').then(({ data }) => setSubcategories(data || []))
    supabase.from('subcategories').select('*').eq('is_active', true).order('sort_order').then(({ data }) => setSubcategories(data || []))
  }, [])

  useEffect(() => {
    setLoading(true)
    let query = supabase.from('products').select('*, categories(name, slug), subcategories(name, slug)')
    if (selectedBadge) query = query.eq('badge', selectedBadge)
    query.order(sortBy, { ascending: sortBy === 'price' }).then(({ data }) => {
      let filtered = data || []
      if (selectedCategory) filtered = filtered.filter(p => p.categories?.slug === selectedCategory)
      if (selectedSubcategory) filtered = filtered.filter(p => p.subcategories?.slug === selectedSubcategory)
      setProducts(filtered)
      setLoading(false)
    })
  }, [selectedCategory, selectedBadge, sortBy, selectedSubcategory])

  const FilterSidebar = () => (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Filter</h3>
        <button onClick={() => { setSelectedCategory(''); setSelectedBadge('') }} className="text-xs font-semibold px-3 py-1 rounded-full text-white flex items-center gap-1" style={{ background: TEAL }}>
          <X size={10} /> Reset
        </button>
      </div>

      {/* CATEGORIES */}
      <div className="border-t border-gray-100 py-4">
        <button onClick={() => setCatOpen(!catOpen)} className="flex items-center justify-between w-full font-semibold text-sm mb-3">
          Categories {catOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {catOpen && (
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="cat" checked={selectedCategory === ''} onChange={() => setSelectedCategory('')} className="accent-teal-700" />
              <span className="text-sm text-gray-600">All Categories</span>
            </label>
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="cat" checked={selectedCategory === cat.slug} onChange={() => setSelectedCategory(cat.slug)} className="accent-teal-700" />
                <span className="text-sm text-gray-600">{catEmojis[cat.slug]} {cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* AVAILABILITY */}
      <div className="border-t border-gray-100 py-4">
        <button onClick={() => setAvailOpen(!availOpen)} className="flex items-center justify-between w-full font-semibold text-sm mb-3">
          Availability {availOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {availOpen && (
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-teal-700" />
              <span className="text-sm text-gray-600">In Stock ({products.filter(p => p.stock > 0).length})</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-teal-700" />
              <span className="text-sm text-gray-600">Out of Stock ({products.filter(p => p.stock === 0).length})</span>
            </label>
          </div>
        )}
      </div>

      {/* BADGE FILTER */}
      <div className="border-t border-gray-100 py-4">
        <div className="font-semibold text-sm mb-3">Special Offers</div>
        <div className="flex flex-col gap-2">
          {['New', 'Hot', 'Sale'].map(badge => (
            <label key={badge} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="badge" checked={selectedBadge === badge} onChange={() => setSelectedBadge(selectedBadge === badge ? '' : badge)} className="accent-teal-700" />
              <span className="text-sm text-gray-600">{badge}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* PAGE HEADER */}
      <div className="py-10 px-6 text-center border-b border-gray-100" style={{ background: '#f5f2ee' }}>
        <h1 className="font-bold text-3xl text-gray-900 mb-2">
          {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name || 'Products' : 'All Products'}
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-700">{selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name || 'Products' : 'All Products'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* MOBILE FILTER BUTTON */}
        <div className="flex md:hidden items-center justify-between mb-4">
          <button onClick={() => setShowMobileFilter(true)} className="flex items-center gap-2 border border-gray-200 px-4 py-2 text-sm font-semibold rounded-sm">
            <SlidersHorizontal size={14} /> Filter
          </button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border border-gray-200 px-3 py-2 text-xs font-semibold outline-none rounded-sm">
            <option value="created_at">Latest</option>
            <option value="price">Price: Low to High</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* MOBILE FILTER OVERLAY */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 bg-black/50 flex">
            <div className="bg-white w-72 h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filter</h3>
                <button onClick={() => setShowMobileFilter(false)}><X size={20} /></button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* SIDEBAR - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1">
            {/* SORT BAR */}
            <div className="hidden md:flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <span className="text-sm text-gray-500">{products.length} products found</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border border-gray-200 px-4 py-2 text-xs font-semibold outline-none hover:border-gray-800 transition-colors cursor-pointer rounded-sm">
                <option value="created_at">Latest</option>
                <option value="price">Price: Low to High</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-100 aspect-square rounded-sm mb-3"></div>
                    <div className="bg-gray-100 h-4 rounded mb-2"></div>
                    <div className="bg-gray-100 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <span className="text-6xl block mb-4">🛍️</span>
                <h3 className="font-bold text-2xl mb-2">No Products Found</h3>
                <p className="text-gray-500 text-sm">Try a different category or filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {products.map(product => (
                  <div key={product.id} className="group cursor-pointer" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
                    <div className="relative overflow-hidden bg-gray-50 aspect-square mb-3 rounded-sm" onClick={() => window.location.href='/products/'+product.slug} style={{ cursor: "pointer" }}>
                      <div className="w-full h-full" style={{ transition: "transform 0.5s ease", transform: hoveredProduct === product.id ? "scale(1.08)" : "scale(1)", pointerEvents: "none" }}>
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">{catEmojis[product.categories?.slug] || '🛍️'}</div>
                        )}
                      </div>
                      {product.badge && (
                        <span className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-0.5" style={{ background: product.badge === 'Sale' ? '#e53e3e' : product.badge === 'Hot' ? TEAL : '#111' }}>{product.badge}</span>
                      )}
                      <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={() => setLightboxProduct(product)} className="w-8 h-8 bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 rounded-sm"><ZoomIn size={13} /></button>
                        <button className="w-8 h-8 bg-white flex items-center justify-center shadow-sm hover:bg-red-50 rounded-sm"><Heart size={13} /></button>
                        <button className="w-8 h-8 bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 rounded-sm"><RotateCcw size={13} /></button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 py-2.5 px-3 flex items-center justify-between translate-y-full group-hover:translate-y-0 transition-transform duration-300" style={{ background: '#1a6b5e' }}>
                        <button onClick={() => { addItem(product); toast.success('Added to cart!') }} className="flex items-center gap-1.5 text-xs font-semibold text-white">
                          <ShoppingCart size={13} /> Add to Cart
                        </button>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">ASHKONA BAZAR</div>
                    <div className="text-[10px] font-medium mb-1" style={{ color: product.stock > 0 ? TEAL : '#999' }}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</div>
                    <Link href={'/products/' + product.slug} className="font-semibold text-sm text-gray-900 hover:underline block mb-1 line-clamp-2">{product.name}</Link>
                    <div className="text-sm font-medium">
                      {product.sale_price ? (
                        <><span className="font-bold">৳{product.sale_price}</span><span className="text-gray-400 line-through ml-2 text-xs">৳{product.price}</span></>
                      ) : (
                        <span className="font-bold">৳{product.price}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* LIGHTBOX */}
      {lightboxProduct && (
        <div className="lightbox-overlay" onClick={() => setLightboxProduct(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxProduct(null)}>✕</button>
            <div className="text-center">
              <span style={{ fontSize: 200, opacity: 0.3, display: "block" }}>{catEmojis[lightboxProduct.categories?.slug] || '🛍️'}</span>
              <div className="mt-4 font-bold text-lg">{lightboxProduct.name}</div>
              <div className="text-teal-700 font-bold mt-1">৳{lightboxProduct.sale_price || lightboxProduct.price}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-gray-400 text-sm tracking-widest uppercase">Loading...</span></div>}>
      <ProductsContent />
    </Suspense>
  )
}
