'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react'
import ImageUpload from '@/components/ui/ImageUpload'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', sale_price: '', cost_price: '',
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

  const fetchVariants = async (productId) => {
    const { data } = await supabase.from('product_variants').select('*').eq('product_id', productId).order('sort_order')
    setVariants(data || [])
  }

  const openAdd = () => {
    setEditProduct(null)
    setVariants([])
    setForm({ name: '', slug: '', description: '', price: '', sale_price: '', cost_price: '', category_id: '', stock: '', badge: '', featured: false, image_url: '' })
    setShowModal(true)
  }

  const openEdit = (product) => {
    setEditProduct(product)
    setForm({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      price: product.price || '',
      sale_price: product.sale_price || '',
      cost_price: product.cost_price || '',
      category_id: product.category_id || '',
      stock: product.stock || '',
      badge: product.badge || '',
      featured: product.featured || false,
      image_url: product.image_url || '',
    })
    fetchVariants(product.id)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const data = {
      name: form.name, slug, description: form.description,
      price: parseFloat(form.price),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      cost_price: form.cost_price ? parseFloat(form.cost_price) : null,
      category_id: form.category_id || null,
      stock: parseInt(form.stock) || 0,
      badge: form.badge || null,
      featured: form.featured,
      image_url: form.image_url || null,
      images: (form.images || []).filter(img => img)
    }
    let productId = editProduct?.id
    if (editProduct) {
      const { error } = await supabase.from('products').update(data).eq('id', editProduct.id)
      if (error) { toast.error('Error updating product'); return }
    } else {
      const { data: newProduct, error } = await supabase.from('products').insert(data).select().single()
      if (error) { toast.error('Error adding product'); return }
      productId = newProduct.id
    }
    // Save variants
    for (const v of variants) {
      if (v.id && !v.isNew) {
        await supabase.from('product_variants').update({
          color: v.color, color_hex: v.color_hex, image_url: v.image_url,
          images: (v.images || []).filter(img => img),
          price: v.price ? parseFloat(v.price) : null,
          sale_price: v.sale_price ? parseFloat(v.sale_price) : null,
          stock: parseInt(v.stock) || 0, sort_order: v.sort_order || 0
        }).eq('id', v.id)
      } else if (v.isNew) {
        await supabase.from('product_variants').insert({
          product_id: productId, color: v.color, color_hex: v.color_hex,
          image_url: v.image_url,
          images: (v.images || []).filter(img => img),
          price: v.price ? parseFloat(v.price) : null,
          sale_price: v.sale_price ? parseFloat(v.sale_price) : null,
          stock: parseInt(v.stock) || 0, sort_order: v.sort_order || 0
        })
      }
    }
    toast.success(editProduct ? 'Product updated!' : 'Product added!')
    setShowModal(false)
    fetchProducts()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    toast.success('Deleted!')
    fetchProducts()
  }

  const deleteVariant = async (variant) => {
    if (variant.id && !variant.isNew) {
      await supabase.from('product_variants').delete().eq('id', variant.id)
    }
    setVariants(variants.filter(v => v !== variant))
  }

  const addVariant = () => {
    setVariants([...variants, { isNew: true, color: '', color_hex: '#000000', image_url: '', price: '', sale_price: '', stock: '10', sort_order: variants.length }])
  }

  const updateVariant = (index, field, value) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
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
            ) : filtered.map(product => (
              <tr key={product.id} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center overflow-hidden">
                      {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : <span className="text-xl">🛍️</span>}
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
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.stock}</span>
                </td>
                <td className="px-6 py-4">
                  {product.badge && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{product.badge}</span>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(product)} className="w-8 h-8 border border-gray-200 flex items-center justify-center rounded-sm hover:bg-gray-50 text-gray-600">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="w-8 h-8 border border-red-200 flex items-center justify-center rounded-sm hover:bg-red-50 text-red-500">
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
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm resize-none" placeholder="Product description" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Price *</label>
                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Sale Price</label>
                <input type="number" value={form.sale_price} onChange={e => setForm({...form, sale_price: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Stock</label>
                <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Category</label>
                <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm">
                  <option value="">Select category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
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
                <ImageUpload value={form.image_url} onChange={(url) => setForm({...form, image_url: url})} label="Main Product Image" />
              </div>

              {/* ADDITIONAL IMAGES */}
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase text-gray-500">Additional Images</label>
                  <button type="button" onClick={() => setForm({...form, images: [...(form.images || []), '']})} className="flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded-lg" style={{ background: '#1a6b5e' }}>
                    <Plus size={11} /> Add Image
                  </button>
                </div>
                {(!form.images || form.images.length === 0) && (
                  <p className="text-xs text-gray-400 text-center py-3 border border-dashed border-gray-200 rounded-lg">No additional images yet.</p>
                )}
                {(form.images || []).map((img, i) => (
                  <div key={i} className="mb-2">
                    <ImageUpload
                      value={img}
                      onChange={url => {
                        const updated = [...(form.images || [])]
                        updated[i] = url
                        setForm({...form, images: updated})
                      }}
                      label={'Image ' + (i + 2)}
                    />
                    <button type="button" onClick={() => {
                      const updated = (form.images || []).filter((_, idx) => idx !== i)
                      setForm({...form, images: updated})
                    }} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-1">
                      <Trash2 size={10} /> Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* COLOR VARIANTS */}
              <div className="col-span-2 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-gray-900">Additional Images</h4>
                  <button type="button" onClick={() => setForm({...form, images: [...(form.images || []), '']})} className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-lg" style={{ background: '#1a6b5e' }}>
                    <Plus size={12} /> Add Image
                  </button>
                </div>
                {(!form.images || form.images.length === 0) && (
                  <p className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">No additional images. Click Add Image to upload more.</p>
                )}
                {(form.images || []).map((img, i) => (
                  <div key={i} className="mb-3 relative">
                    <ImageUpload
                      value={img}
                      onChange={url => {
                        const updated = [...(form.images || [])]
                        updated[i] = url
                        setForm({...form, images: updated})
                      }}
                      label={'Image ' + (i + 2)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (form.images || []).filter((_, idx) => idx !== i)
                        setForm({...form, images: updated})
                      }}
                      className="mt-1 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={11} /> Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="accent-teal-700" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured product (show on homepage)</label>
              </div>

              {/* VARIANTS */}
              <div className="col-span-2 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-gray-900">Color Variants</h4>
                  <button onClick={addVariant} className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-lg" style={{ background: '#1a6b5e' }}>
                    <Plus size={12} /> Add Color
                  </button>
                </div>
                {variants.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">No variants yet. Add a color variant above.</p>
                )}
                {variants.map((v, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4 mb-3">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Color Name</label>
                        <input value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="e.g. Red, Blue" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Color Hex</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={v.color_hex || '#000000'} onChange={e => updateVariant(i, 'color_hex', e.target.value)} className="w-10 h-9 border border-gray-200 rounded-lg cursor-pointer" />
                          <input value={v.color_hex} onChange={e => updateVariant(i, 'color_hex', e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="#000000" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Price (optional)</label>
                        <input type="number" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="Leave blank = main price" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Stock</label>
                        <input type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="0" />
                      </div>
                    </div>
                    <div className="mb-2">
                      <ImageUpload value={v.image_url} onChange={url => updateVariant(i, 'image_url', url)} label={"Main Image — " + (v.color || 'Variant ' + (i+1))} />
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500">Additional Images</span>
                        <button type="button" onClick={() => {
                          const updated = [...variants]
                          updated[i] = { ...updated[i], images: [...(updated[i].images || []), ''] }
                          setVariants(updated)
                        }} className="text-xs font-bold text-white px-2 py-1 rounded-lg flex items-center gap-1" style={{ background: '#1a6b5e' }}>
                          <Plus size={10} /> Add
                        </button>
                      </div>
                      {(v.images || []).map((img, j) => (
                        <div key={j} className="mb-2">
                          <ImageUpload
                            value={img}
                            onChange={url => {
                              const updated = [...variants]
                              const imgs = [...(updated[i].images || [])]
                              imgs[j] = url
                              updated[i] = { ...updated[i], images: imgs }
                              setVariants(updated)
                            }}
                            label={'Image ' + (j + 2)}
                          />
                          <button type="button" onClick={() => {
                            const updated = [...variants]
                            const imgs = (updated[i].images || []).filter((_, idx) => idx !== j)
                            updated[i] = { ...updated[i], images: imgs }
                            setVariants(updated)
                          }} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-1">
                            <Trash2 size={10} /> Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => deleteVariant(v)} className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                      <Trash2 size={11} /> Remove variant
                    </button>
                  </div>
                ))}
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
