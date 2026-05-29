'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminFeatures() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState({ icon: '', title: '', description: '', sort_order: 0, is_active: true })

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase.from('features').select('*').order('sort_order')
    setItems(data || [])
    setLoading(false)
  }

  const openAdd = () => {
    setEditItem(null)
    setForm({ icon: '', title: '', description: '', sort_order: 0, is_active: true })
    setShowModal(true)
  }

  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({ icon: item.icon || '', title: item.title || '', description: item.description || '', sort_order: item.sort_order || 0, is_active: item.is_active !== false })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.title) { toast.error('Title is required'); return }
    const data = { icon: form.icon, title: form.title, description: form.description, sort_order: parseInt(form.sort_order) || 0, is_active: form.is_active }
    if (editItem) {
      const { error } = await supabase.from('features').update(data).eq('id', editItem.id)
      if (error) { toast.error('Error updating'); return }
      toast.success('Updated!')
    } else {
      const { error } = await supabase.from('features').insert(data)
      if (error) { toast.error('Error adding'); return }
      toast.success('Added!')
    }
    setShowModal(false)
    fetchItems()
  }

  const handleDelete = async (id: any) => {
    if (!confirm('Delete this feature?')) return
    await supabase.from('features').delete().eq('id', id)
    toast.success('Deleted!')
    fetchItems()
  }

  const toggleActive = async (item: any) => {
    await supabase.from('features').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchItems()
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openAdd} className="flex items-center gap-2 text-white px-4 py-2.5 text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90" style={{ background: '#1a6b5e' }}>
          <Plus size={14} /> Add Feature
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-gray-400">No features yet</div>
        ) : items.map((item: any) => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-sm p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Order: {item.sort_order}</div>
                </div>
              </div>
              <button onClick={() => toggleActive(item)} className="text-xs px-2.5 py-1 rounded-sm font-semibold" style={{ background: item.is_active ? '#d1fae5' : '#fee2e2', color: item.is_active ? '#065f46' : '#991b1b' }}>
                {item.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{item.description}</p>
            <div className="flex gap-2">
              <button onClick={() => openEdit(item)} className="w-8 h-8 border border-gray-200 flex items-center justify-center rounded-sm hover:bg-gray-50 text-gray-600"><Pencil size={13} /></button>
              <button onClick={() => handleDelete(item.id)} className="w-8 h-8 border border-red-200 flex items-center justify-center rounded-sm hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-lg">{editItem ? 'Edit Feature' : 'Add Feature'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Icon (emoji)</label>
                <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="🚚" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="Free Shipping" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" rows={3} placeholder="On all orders over ৳500" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" />
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
