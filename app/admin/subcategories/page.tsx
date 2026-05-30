'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSubcategories() {
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState({ name: '', slug: '', category_id: '', sort_order: 0, is_active: true })

  useEffect(() => { fetchItems(); fetchCategories() }, [])

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase.from('subcategories').select('*, categories(name)').order('sort_order')
    setItems(data || [])
    setLoading(false)
  }

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
  }

  const openAdd = () => {
    setEditItem(null)
    setForm({ name: '', slug: '', category_id: '', sort_order: 0, is_active: true })
    setShowModal(true)
  }

  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({ name: item.name, slug: item.slug, category_id: item.category_id, sort_order: item.sort_order || 0, is_active: item.is_active !== false })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.category_id) { toast.error('Name and category are required'); return }
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const data = { name: form.name, slug, category_id: form.category_id, sort_order: parseInt(String(form.sort_order)) || 0, is_active: form.is_active }
    if (editItem) {
      const { error } = await supabase.from('subcategories').update(data).eq('id', editItem.id)
      if (error) { toast.error('Error updating'); return }
      toast.success('Updated!')
    } else {
      const { error } = await supabase.from('subcategories').insert(data)
      if (error) { toast.error('Error adding'); return }
      toast.success('Added!')
    }
    setShowModal(false)
    fetchItems()
  }

  const handleDelete = async (id: any) => {
    if (!confirm('Delete this subcategory?')) return
    await supabase.from('subcategories').delete().eq('id', id)
    toast.success('Deleted!')
    fetchItems()
  }

  const toggleActive = async (item: any) => {
    await supabase.from('subcategories').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchItems()
  }

  // Group by category
  const grouped = categories.map(cat => ({
    ...cat,
    subcats: items.filter(i => i.category_id === cat.id)
  })).filter(cat => cat.subcats.length > 0 || true)

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openAdd} className="flex items-center gap-2 text-white px-4 py-2.5 text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90" style={{ background: '#1a6b5e' }}>
          <Plus size={14} /> Add Subcategory
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : categories.map(cat => {
          const subcats = items.filter(i => i.category_id === cat.id)
          if (subcats.length === 0) return null
          return (
            <div key={cat.id} className="bg-white border border-gray-100 rounded-sm overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">{cat.name}</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left px-5 py-2 text-xs font-semibold uppercase text-gray-400">Name</th>
                    <th className="text-left px-5 py-2 text-xs font-semibold uppercase text-gray-400">Slug</th>
                    <th className="text-left px-5 py-2 text-xs font-semibold uppercase text-gray-400">Order</th>
                    <th className="text-left px-5 py-2 text-xs font-semibold uppercase text-gray-400">Status</th>
                    <th className="px-5 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {subcats.map((item: any) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-400">{item.slug}</td>
                      <td className="px-5 py-3 text-sm text-gray-400">{item.sort_order}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => toggleActive(item)} className="text-xs px-2 py-0.5 rounded-sm font-semibold" style={{ background: item.is_active ? '#d1fae5' : '#fee2e2', color: item.is_active ? '#065f46' : '#991b1b' }}>
                          {item.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => openEdit(item)} className="w-8 h-8 border border-gray-200 flex items-center justify-center rounded-sm hover:bg-gray-50 text-gray-600"><Pencil size={13} /></button>
                          <button onClick={() => handleDelete(item.id)} className="w-8 h-8 border border-red-200 flex items-center justify-center rounded-sm hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        })}
        {items.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-400 bg-white border border-gray-100 rounded-sm">No subcategories yet. Add one!</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-lg">{editItem ? 'Edit Subcategory' : 'Add Subcategory'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Parent Category *</label>
                <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm">
                  <option value="">Select category</option>
                  {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="e.g. Kurti" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Slug</label>
                <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="kurti" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value)})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" />
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-sm cursor-pointer" onClick={() => setForm({...form, is_active: !form.is_active})}>
                <div className="w-10 h-6 rounded-full relative transition-colors" style={{ background: form.is_active ? '#1a6b5e' : '#e5e7eb' }}>
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all" style={{ left: form.is_active ? '22px' : '2px' }}></div>
                </div>
                <span className="text-sm font-semibold">Active</span>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-gray-200 text-sm font-semibold rounded-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2.5 text-white text-sm font-bold rounded-sm hover:opacity-90" style={{ background: '#1a6b5e' }}>
                {editItem ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
