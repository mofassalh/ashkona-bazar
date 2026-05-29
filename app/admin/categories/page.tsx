'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import ImageUpload from '@/components/ui/ImageUpload'
import toast from 'react-hot-toast'

const catEmojis = { 'womens-fashion': '👗', 'mens-wear': '👔', 'kitchen-tools': '🔪', 'accessories': '👒', 'cookware': '🍳' }

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editCat, setEditCat] = useState<any>(null)
  const [form, setForm] = useState({ name: '', slug: '', image_url: '', sort_order: 0, is_tall: false })

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('created_at')
    setCategories(data || [])
    setLoading(false)
  }

  const openAdd = () => {
    setEditCat(null)
    setForm({ name: '', slug: '', image_url: '', sort_order: 0, is_tall: false })
    setShowModal(true)
  }

  const openEdit = (cat: any) => {
    setEditCat(cat)
    setForm({ name: cat.name, slug: cat.slug, image_url: cat.image_url || '', sort_order: cat.sort_order || 0, is_tall: cat.is_tall || false })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name) { toast.error('Name is required'); return }
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const data = { name: form.name, slug, image_url: form.image_url || null, sort_order: parseInt(form.sort_order) || 0, is_tall: form.is_tall }

    if (editCat) {
      const { error } = await supabase.from('categories').update(data).eq('id', editCat.id)
      if (error) { toast.error('Error updating'); return }
      toast.success('Category updated!')
    } else {
      const { error } = await supabase.from('categories').insert(data)
      if (error) { toast.error('Error adding'); return }
      toast.success('Category added!')
    }
    setShowModal(false)
    fetchCategories()
  }

  const handleDelete = async (id: any) => {
    if (!confirm('Delete this category?')) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) { toast.error('Error deleting'); return }
    toast.success('Deleted!')
    fetchCategories()
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openAdd} className="flex items-center gap-2 text-white px-4 py-2.5 text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90" style={{ background: '#1a6b5e' }}>
          <Plus size={14} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-gray-400">Loading...</div>
        ) : categories.map((cat: any) => (
          <div key={cat.id} className="bg-white border border-gray-100 rounded-sm p-5 flex items-center justify-between hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-sm flex items-center justify-center text-2xl bg-gray-50 overflow-hidden">
                {cat.image_url ? <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" /> : catEmojis[cat.slug] || '🛍️'}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{cat.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{cat.slug}</div>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Order: {cat.sort_order || 0}</span>
                  {cat.is_tall && <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded">Tall</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(cat)} className="w-8 h-8 border border-gray-200 flex items-center justify-center rounded-sm hover:bg-gray-50 text-gray-600">
                <Pencil size={13} />
              </button>
              <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 border border-red-200 flex items-center justify-center rounded-sm hover:bg-red-50 text-red-500">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-lg">{editCat ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="Category name" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Slug</label>
                <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="category-slug" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="1" />
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-sm cursor-pointer" onClick={() => setForm({...form, is_tall: !form.is_tall})}>
                <div className="w-10 h-6 rounded-full relative transition-colors" style={{ background: form.is_tall ? '#1a6b5e' : '#e5e7eb' }}>
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all" style={{ left: form.is_tall ? '22px' : '2px' }}></div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Tall Category</div>
                  <div className="text-xs text-gray-400">Show as tall banner (position 1 & 2)</div>
                </div>
              </div>
              <div>
                <ImageUpload
                  value={form.image_url}
                  onChange={(url) => setForm({...form, image_url: url})}
                  label="Category Image"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-gray-200 text-sm font-semibold rounded-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2.5 text-white text-sm font-bold rounded-sm hover:opacity-90" style={{ background: '#1a6b5e' }}>
                {editCat ? 'Update' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
