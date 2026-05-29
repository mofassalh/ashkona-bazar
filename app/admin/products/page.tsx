'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react'
import ImageUpload from '@/components/ui/ImageUpload'
import toast from 'react-hot-toast'

const catEmojis = { 'womens-fashion': '👗', 'mens-wear': '👔', 'kitchen-tools': '🔪', 'accessories': '👒', 'cookware': '🍳' }

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<any>(null)
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', sale_price: '',
    category_id: '', stock: '', badge: '', featured: false, image_url: ''
  })

  useEffect(() => {
    fetchProducts()
    supabase.from('categories').select('*').then(({ data }) => setCategories(data || []))
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*, categories(name,slug)').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  const openAdd = () => {
    setEditProduct(null)
    setForm({ name: '', slug: '', description: '', price: '', sale_price: '', category_id: '', stock: '', badge: '', featured: false, image_url: '' })
    setShowModal(true)
  }

  const openEdit = (product: any) => {
    setEditProduct(product)
    setForm({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      price: product.price || '',
      sale_price: product.sale_price || '',
      category_id: product.category_id || '',
      stock: product.stock || '',
      badge: product.badge || '',
      featured: product.featured || false,
      image_url: product.image_url || ''
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error('Name and price are required')
      return
    }
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const data = {
      name: form.name,
      slug,
      description: form.description,
      price: parseFloat(form.price),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      category_id: form.category_id || null,
      stock: parseInt(form.stock) || 0,
      badge: form.badge || null,
      featured: form.featured,
      image_url: form.image_url || null
    }
    if (editProduct) {
      const { error } = await supabase.from('products').update(data).eq('id', editProduct.id)
      if (error) { toast.error('Error updating product'); return }
      toast.success('Product updated!')
    } else {
      const { error } = await supabase.from('products').insert(data)
      if (error) { toast.error('Error adding product'); return }
      toast.success('Product added!')
    }
    setShowModal(false)
    fetchProducts()
  }

  const handleDelete = async (id: any) => {
    if (!confirm('Delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { toast.error('Error deleting'); return }
    toast.success('Deleted!')
    fetchProducts()
  }

  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-9 pr-4 py-2.5 border border-gray-200 text-sm outline-none focus:border-teal-700 rounded-sm w-64" />
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 text-white px-4 py-2.5 text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90" style={{ background: '#1a6b5e' }}>
          <Plus size={14} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Badge</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No products found</td></tr>
            ) : filtered.map((product: any) => (
              <tr key={product.id} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center text-xl overflow-hidden">
                      {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : catEmojis[product.categories?.slug] || '🛍️'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-400">{product.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.categories?.name || '-'}</td>
                <td className="px-6 py-4">
                  <div className="font-bold">৳{product.price}</div>
                  {product.sale_price && <div className="text-xs text-red-500">Sale: ৳{product.sale_price}</div>}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {product.badge && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{product.badge}</span>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(product)} className="w-8 h-8 border border-gray-200 flex items-center justify-center rounded-sm hover:bg-gray-50 text-gray-600 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="w-8 h-8 border border-red-200 flex items-center justify-center rounded-sm hover:bg-red-50 text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-lg">{editProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Product Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="Product name" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Slug</label>
                <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="product-slug" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm resize-none" placeholder="Product description" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Price *</label>
                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Sale Price</label>
                <input type="number" value={form.sale_price} onChange={e => setForm({...form, sale_price: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Category</label>
                <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm">
                  <option value="">Select category</option>
                  {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Stock</label>
                <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Badge</label>
                <select value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm">
                  <option value="">No badge</option>
                  <option value="New">New</option>
                  <option value="Hot">Hot</option>
                  <option value="Sale">Sale</option>
                </select>
              </div>
              <div className="col-span-2">
                <ImageUpload
                  value={form.image_url}
                  onChange={(url) => setForm({...form, image_url: url})}
                  label="Product Image"
                />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="accent-teal-700" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured product (show on homepage)</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-gray-200 text-sm font-semibold rounded-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2.5 text-white text-sm font-bold rounded-sm hover:opacity-90" style={{ background: '#1a6b5e' }}>
                {editProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
