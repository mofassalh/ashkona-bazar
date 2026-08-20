'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { ShoppingCart, Heart, SlidersHorizontal, X, ChevronDown, ChevronUp, Search } from 'lucide-react'

function useScrollAnimation() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

function ProductCard({ product, TEAL, brandName, index }) {
  const { ref, visible } = useScrollAnimation()
  const addItem = useCartStore(s => s.addItem)
  return (
    <div
      ref={ref}
      className="group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.5s ease ' + (index % 3 * 0.08) + 's, transform 0.5s ease ' + (index % 3 * 0.08) + 's'
      }}
    >
      <div
        className="relative overflow-hidden bg-gray-50 rounded-xl mb-3"
        style={{ aspectRatio: '3/4', cursor: 'pointer' }}
        onClick={() => window.location.href = '/products/' + product.slug}
      >
        <div className="w-full h-full group-hover:scale-105 transition-transform duration-700">
          {product.image_url
            ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-6xl bg-gray-100">🛍️</div>
          }
        </div>
        {product.badge && (
          <span className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: product.badge === 'Sale' ? '#e53e3e' : product.badge === 'Hot' ? '#dd6b20' : TEAL }}>
            {product.badge}
          </span>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm hover:scale-110">
          <Heart size={14} className="text-gray-400" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 py-3 px-4 flex items-center justify-between translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-b-xl"
          style={{ background: TEAL }}>
          <button
            onClick={e => { e.stopPropagation(); addItem(product); toast.success('Added to cart!') }}
            className="flex items-center gap-2 text-xs font-semibold text-white"
          >
            <ShoppingCart size={13} /> Add to Cart
          </button>
        </div>
      </div>
      <div className="px-1">
        <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">{brandName}</div>
        <Link href={'/products/' + product.slug} className="font-semibold text-sm text-gray-900 hover:text-gray-600 block mb-1 line-clamp-2 leading-snug">{product.name}</Link>
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

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get('category')
  const badgeFilter = searchParams.get('badge')

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '')
  const [selectedBadge, setSelectedBadge] = useState(badgeFilter || '')
  const [sortBy, setSortBy] = useState('created_at')
  const [catOpen, setCatOpen] = useState(true)
  const [badgeOpen, setBadgeOpen] = useState(true)
  const [availOpen, setAvailOpen] = useState(true)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => setCategories(data || []))
    supabase.from('settings').select('*').then(({ data }) => {
      if (data) {
        const obj = {}
        data.forEach(s => obj[s.key] = s.value)
        setSettings(obj)
      }
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    let query = supabase.from('products').select('*, categories(name, slug)')
    if (selectedBadge) query = query.eq('badge', selectedBadge)
    query.order(sortBy, { ascending: sortBy === 'price' }).then(({ data }) => {
      let filtered = data || []
      if (selectedCategory) filtered = filtered.filter(p => p.categories?.slug === selectedCategory)
      if (searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setProducts(filtered)
      setLoading(false)
    })
  }, [selectedCategory, selectedBadge, sortBy, searchQuery])

  const TEAL = settings.primary_color || '#1a6b5e'
  const brandName = settings.brand_name || 'AshkonaBazar'
  const currentCat = categories.find(c => c.slug === selectedCategory)

  const FilterSidebar = () => (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-base">Filters</h3>
        <button
          onClick={() => { setSelectedCategory(''); setSelectedBadge('') }}
          className="text-xs font-semibold px-3 py-1 rounded-full text-white"
          style={{ background: TEAL }}
        >
          Reset
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-3 py-2 text-xs outline-none text-gray-700 placeholder-gray-300"
          />
          <div className="px-3 flex items-center text-gray-400"><Search size={13} /></div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="border-t border-gray-100 py-4">
        <button onClick={() => setCatOpen(!catOpen)} className="flex items-center justify-between w-full font-semibold text-sm mb-3">
          Category {catOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        {catOpen && (
          <div className="flex flex-col gap-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="cat" checked={selectedCategory === ''} onChange={() => setSelectedCategory('')} className="accent-teal-700" />
              <span className="text-sm text-gray-600">All Categories</span>
            </label>
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="cat" checked={selectedCategory === cat.slug} onChange={() => setSelectedCategory(cat.slug)} className="accent-teal-700" />
                <span className="text-sm text-gray-600">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* AVAILABILITY */}
      <div className="border-t border-gray-100 py-4">
        <button onClick={() => setAvailOpen(!availOpen)} className="flex items-center justify-between w-full font-semibold text-sm mb-3">
          Availability {availOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        {availOpen && (
          <div className="flex flex-col gap-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-teal-700" />
              <span className="text-sm text-gray-600">In Stock ({products.filter(p => p.stock > 0).length})</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-teal-700" />
              <span className="text-sm text-gray-600">On Sale ({products.filter(p => p.sale_price).length})</span>
            </label>
          </div>
        )}
      </div>

      {/* BADGE */}
      <div className="border-t border-gray-100 py-4">
        <button onClick={() => setBadgeOpen(!badgeOpen)} className="flex items-center justify-between w-full font-semibold text-sm mb-3">
          Special Offers {badgeOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        {badgeOpen && (
          <div className="flex flex-col gap-2.5">
            {['New', 'Hot', 'Sale'].map(badge => (
              <label key={badge} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="badge" checked={selectedBadge === badge} onChange={() => setSelectedBadge(selectedBadge === badge ? '' : badge)} className="accent-teal-700" />
                <span className="text-sm text-gray-600">{badge}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">

      {/* PAGE HEADER */}
      <div className="px-4 md:px-8 py-6 border-b border-gray-100" style={{ background: '#f8f6f2' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 mb-1">
              <Link href="/" className="hover:text-gray-700">Home</Link>
              <span className="mx-2">→</span>
              <span style={{ color: TEAL }}>{currentCat?.name || 'All Products'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {currentCat?.name || 'All'} <span style={{ color: TEAL }}>Products</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">{products.length} products found</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none hover:border-gray-400 transition-colors cursor-pointer"
            >
              <option value="created_at">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-8">

        {/* MOBILE TOOLBAR */}
        <div className="flex md:hidden items-center justify-between mb-5">
          <button onClick={() => setShowMobileFilter(true)} className="flex items-center gap-2 border border-gray-200 px-4 py-2 text-sm font-semibold rounded-lg">
            <SlidersHorizontal size={14} /> Filters
          </button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border border-gray-200 px-3 py-2 text-xs rounded-lg outline-none">
            <option value="created_at">Newest</option>
            <option value="price">Price ↑</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* MOBILE FILTER OVERLAY */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 bg-black/50 flex">
            <div className="bg-white w-72 h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={() => setShowMobileFilter(false)}><X size={20} /></button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* SIDEBAR */}
          <div className="hidden md:block w-56 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* PRODUCTS */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-100 rounded-xl mb-3" style={{ aspectRatio: '3/4' }}></div>
                    <div className="bg-gray-100 h-3 rounded mb-2"></div>
                    <div className="bg-gray-100 h-3 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <span className="text-6xl block mb-4">🛍️</span>
                <h3 className="font-bold text-2xl mb-2">No Products Found</h3>
                <p className="text-gray-400 text-sm">Try a different category or filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} TEAL={TEAL} brandName={brandName} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-gray-400 text-sm">Loading...</span></div>}>
      <ProductsContent />
    </Suspense>
  )
}
