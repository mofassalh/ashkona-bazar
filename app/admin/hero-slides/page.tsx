'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ui/ImageUpload'

export default function AdminHeroSlides() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({ tag: '', title: '', subtitle: '', price: '', btn1_text: 'Shop Now', btn1_href: '/products', btn2_text: 'Learn more', btn2_href: '/products', image_url: '', bg_color: '#f0ece4', sort_order: 0, is_active: true })

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase.from('hero_slides').select('*').order('sort_order')
    setItems(data || [])
    setLoading(false)
  }

  const openAdd = () => {
    setEditItem(null)
    setForm({ tag: '', title: '', subtitle: '', price: '', btn1_text: 'Shop Now', btn1_href: '/products', btn2_text: 'Learn more', btn2_href: '/products', image_url: '', bg_color: '#f0ece4', sort_order: 0, is_active: true })
    setShowModal(true)
  }

  const openEdit = (item) => {
    setEditItem(item)
    setForm({ tag: item.tag || '', title: item.title || '', subtitle: item.subtitle || '', price: item.price || '', btn1_text: item.btn1_text || 'Shop Now', btn1_href: item.btn1_href || '/products', btn2_text: item.btn2_text || 'Learn more', btn2_href: item.btn2_href || '/products', image_url: item.image_url || '', bg_color: item.bg_color || '#f0ece4', sort_order: item.sort_order || 0, is_active: item.is_active !== false })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.title) { toast.error('Title is required'); return }
    const data = { tag: form.tag, title: form.title, subtitle: form.subtitle, price: form.price, btn1_text: form.btn1_text, btn1_href: form.btn1_href, btn2_text: form.btn2_text, btn2_href: form.btn2_href, image_url: form.image_url || null, bg_color: form.bg_color, sort_order: parseInt(form.sort_order) || 0, is_active: form.is_active }
    if (editItem) {
      const { error } = await supabase.from('hero_slides').update(data).eq('id', editItem.id)
      if (error) { toast.error('Error updating'); return }
      toast.success('Updated!')
    } else {
      const { error } = await supabase.from('hero_slides').insert(data)
      if (error) { toast.error('Error adding'); return }
      toast.success('Added!')
    }
    setShowModal(false)
    fetchItems()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this slide?')) return
    await supabase.from('hero_slides').delete().eq('id', id)
    toast.success('Deleted!')
    fetchItems()
  }

  const toggleActive = async (item) => {
    await supabase.from('hero_slides').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchItems()
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openAdd} className="flex items-center gap-2 text-white px-4 py-2.5 text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90" style={{ background: '#1a6b5e' }}>
          <Plus size={14} /> Add Slide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-10 text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="col-span-2 text-center py-10 text-gray-400">No slides yet</div>
        ) : items.map(item => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-sm transition-shadow">
            <div className="h-32 relative overflow-hidden" style={{ background: item.bg_color || '#f0ece4' }}>
              {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />}
              <div className="absolute top-2 left-2 flex gap-2">
                <span className="text-xs font-bold px-2 py-1 bg-white rounded-sm text-gray-700">{item.tag}</span>
                <button onClick={() => toggleActive(item)} className="text-xs px-2 py-1 rounded-sm font-semibold" style={{ background: item.is_active ? '#d1fae5' : '#fee2e2', color: item.is_active ? '#065f46' : '#991b1b' }}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="font-bold text-gray-900 mb-1">{item.title}</div>
              <div className="text-xs text-gray-500 mb-3">{item.subtitle} {item.price}</div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="w-8 h-8 border border-gray-200 flex items-center justify-center rounded-sm hover:bg-gray-50 text-gray-600"><Pencil size={13} /></button>
                <button onClick={() => handleDelete(item.id)} className="w-8 h-8 border border-red-200 flex items-center justify-center rounded-sm hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-sm w-full max-w-lg my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-lg">{editItem ? 'Edit Slide' : 'Add Slide'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Tag</label>
                  <input value={form.tag} onChange={e => setForm({...form, tag: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="Fashion" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Title *</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="New Collection" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Subtitle</label>
                  <input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="Starting at" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Price</label>
                  <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="৳999" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Button 1 Text</label>
                  <input value={form.btn1_text} onChange={e => setForm({...form, btn1_text: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="Shop Now" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Button 1 Link</label>
                  <input value={form.btn1_href} onChange={e => setForm({...form, btn1_href: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="/products" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Button 2 Text</label>
                  <input value={form.btn2_text} onChange={e => setForm({...form, btn2_text: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="Learn more" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Button 2 Link</label>
                  <input value={form.btn2_href} onChange={e => setForm({...form, btn2_href: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="/products" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.bg_color} onChange={e => setForm({...form, bg_color: e.target.value})} className="w-10 h-10 border border-gray-200 rounded-sm cursor-pointer" />
                    <input value={form.bg_color} onChange={e => setForm({...form, bg_color: e.target.value})} className="flex-1 border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-sm cursor-pointer" onClick={() => setForm({...form, is_active: !form.is_active})}>
                <div className="w-10 h-6 rounded-full relative transition-colors" style={{ background: form.is_active ? '#1a6b5e' : '#e5e7eb' }}>
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all" style={{ left: form.is_active ? '22px' : '2px' }}></div>
                </div>
                <span className="text-sm font-semibold">Active</span>
              </div>
              <ImageUpload value={form.image_url} onChange={(url) => setForm({...form, image_url: url})} label="Slide Image" />
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
