'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { X, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ComparePage() {
  const [compareList, setCompareList] = useState([])
  const [mounted, setMounted] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('compare')
    if (stored) setCompareList(JSON.parse(stored))
  }, [])

  const removeFromCompare = (id) => {
    const updated = compareList.filter(item => item.id !== id)
    setCompareList(updated)
    localStorage.setItem('compare', JSON.stringify(updated))
    toast.success('Removed from compare')
  }

  const clearAll = () => {
    setCompareList([])
    localStorage.setItem('compare', JSON.stringify([]))
    toast.success('Compare list cleared')
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-bold text-2xl text-gray-900">Compare Products ({compareList.length})</h1>
          {compareList.length > 0 && (
            <button onClick={clearAll} className="text-sm text-red-500 hover:underline">Clear All</button>
          )}
        </div>

        {compareList.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-sm p-16 text-center">
            <div className="text-5xl mb-4">⚖️</div>
            <h2 className="font-bold text-lg text-gray-700 mb-2">No products to compare</h2>
            <p className="text-gray-400 text-sm mb-6">Add products to compare them side by side</p>
            <Link href="/products" className="px-6 py-3 text-white text-sm font-bold rounded-sm hover:opacity-90" style={{ background: '#1a6b5e' }}>Browse Products</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-100 rounded-sm">
              <thead>
                <tr>
                  <td className="p-4 border-b border-gray-100 w-32 font-semibold text-gray-500 text-sm">Product</td>
                  {compareList.map(item => (
                    <td key={item.id} className="p-4 border-b border-gray-100 text-center">
                      <div className="relative">
                        <button onClick={() => removeFromCompare(item.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                          <X size={12} />
                        </button>
                        <div className="w-24 h-24 mx-auto mb-2 rounded-sm overflow-hidden bg-gray-50">
                          {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🛍️</div>}
                        </div>
                        <Link href={'/products/' + item.slug} className="font-semibold text-sm text-gray-900 hover:underline line-clamp-2 block">{item.name}</Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Price', render: item => <span className="font-bold">৳{item.sale_price || item.price}</span> },
                  { label: 'Original Price', render: item => item.sale_price ? <span className="line-through text-gray-400">৳{item.price}</span> : '-' },
                  { label: 'Category', render: item => item.categories?.name || '-' },
                  { label: 'Stock', render: item => <span style={{ color: item.stock > 0 ? '#1a6b5e' : '#e53e3e' }}>{item.stock > 0 ? 'In Stock' : 'Out of Stock'}</span> },
                  { label: 'Badge', render: item => item.badge || '-' },
                ].map(row => (
                  <tr key={row.label} className="border-b border-gray-50">
                    <td className="p-4 font-semibold text-gray-500 text-sm">{row.label}</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-4 text-center text-sm text-gray-700">{row.render(item)}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-4"></td>
                  {compareList.map(item => (
                    <td key={item.id} className="p-4 text-center">
                      <button onClick={() => { addItem(item); toast.success('Added to cart!') }} className="flex items-center gap-1.5 px-4 py-2 text-white text-xs font-bold rounded-sm hover:opacity-90 mx-auto" style={{ background: '#1a6b5e' }}>
                        <ShoppingCart size={12} /> Add to Cart
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
