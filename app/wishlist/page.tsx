'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([])
  const [mounted, setMounted] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('wishlist')
    if (stored) setWishlist(JSON.parse(stored))
  }, [])

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item.id !== id)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
    toast.success('Removed from wishlist')
  }

  const moveToCart = (item) => {
    addItem(item)
    removeFromWishlist(item.id)
    toast.success('Moved to cart!')
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={24} style={{ color: '#1a6b5e' }} />
          <h1 className="font-bold text-2xl text-gray-900">My Wishlist</h1>
          <span className="text-sm text-gray-400">({wishlist.length} items)</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-sm p-16 text-center">
            <Heart size={48} className="mx-auto mb-4 text-gray-200" />
            <h2 className="font-bold text-lg text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 text-sm mb-6">Save items you love to your wishlist</p>
            <Link href="/products" className="px-6 py-3 text-white text-sm font-bold rounded-sm hover:opacity-90" style={{ background: '#1a6b5e' }}>Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map(item => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-sm transition-shadow group">
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🛍️</div>
                  )}
                  <button onClick={() => removeFromWishlist(item.id)} className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="p-4">
                  <Link href={'/products/' + item.slug} className="font-semibold text-sm text-gray-900 hover:underline line-clamp-2 block mb-2">{item.name}</Link>
                  <div className="flex items-center justify-between">
                    <div>
                      {item.sale_price ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">৳{item.sale_price}</span>
                          <span className="text-xs text-gray-400 line-through">৳{item.price}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-900">৳{item.price}</span>
                      )}
                    </div>
                    <button onClick={() => moveToCart(item)} className="flex items-center gap-1.5 px-3 py-2 text-white text-xs font-bold rounded-sm hover:opacity-90 transition-opacity" style={{ background: '#1a6b5e' }}>
                      <ShoppingCart size={12} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
