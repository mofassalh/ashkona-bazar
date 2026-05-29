'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ui/ImageUpload'

export default function AdminBlogs() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState({ title: '', slug: '', description: '', image_url: '', date: '', month: '', comments: '0', views: '0', is_active: true })

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const openAdd = () => {
    setEditItem(null)
    setForm({ title: '', slug: '', description: '', image_url: '', date: '', month: '', comments: '0', views: '0', is_active: true })
    setShowModal(true)
  }

  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({
      title: item.title || '', slug: item.slug || '', description: item.description || '',
      image_url: item.image_url || '', date: item.date || '', month: item.month || '',
      comments: String(item.comments || 0), views: String(item.views || 0), is_active: item.is_active !== false
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.title) { toast.error('Title is required'); return }
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const data = {
      title: form.title, slug, description: form.description, image_url: form.image_url || null,
      date: form.date, month: form.month, comments: parseInt(form.comments) || 0,
      views: parseInt(form.views) || 0, is_active: form.is_active
    }
    if (editItem) {
      const { error } = await supabase.from('blogs').update(data).eq('id', editItem.id)
      if (error) { toast.error('Error updating'); return }
      toast.success('Updated!')
    } else {
      const { error } = await supabase.from('blogs').insert(data)
      if (error) { toast.error('Error adding'); return }
      toast.success('Added!')
    }
    setShowModal(false)
    fetchItems()
  }

  const handleDelete = async (id: any) => {
    if (!confirm('Delete this blog?')) return
    await supabase.from('blogs').delete().eq('id', id)
    toast.success('Deleted!')
    fetchItems()
  }

  const toggleActive = async (item: any) => {
    await supabase.from('blogs').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchItems()
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openAdd} className="flex items-center gap-2 text-white px-4 py-2.5 text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90" style={{ background: '#1a6b5e' }}>
          <Plus size={14} /> Add Blog
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No blogs yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-gray-400">Blog</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-gray-400">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-gray-400">Views</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase text-gray-400">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                        {item.image_url ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📝</div>}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 line-clamp-1">{item.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{item.date} {item.month}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{item.views || 0}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleActive(item)} className="text-xs px-2.5 py-1 rounded-sm font-semibold" style={{ background: item.is_active ? '#d1fae5' : '#fee2e2', color: item.is_active ? '#065f46' : '#991b1b' }}>
                      {item.is_active ? 'Active' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(item)} className="w-8 h-8 border border-gray-200 flex items-center justify-center rounded-sm hover:bg-gray-50 text-gray-600"><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(item.id)} className="w-8 h-8 border border-red-200 flex items-center justify-center rounded-sm hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-sm w-full max-w-lg my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-lg">{editItem ? 'Edit Blog' : 'Add Blog'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="Blog title" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Slug</label>
                <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="blog-slug" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" rows={4} placeholder="Blog content or excerpt..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Date</label>
                  <input value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="15" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Month</label>
                  <input value={form.month} onChange={e => setForm({...form, month: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="January" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Comments</label>
                  <input type="number" value={form.comments} onChange={e => setForm({...form, comments: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Views</label>
                  <input type="number" value={form.views} onChange={e => setForm({...form, views: e.target.value})} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-sm cursor-pointer" onClick={() => setForm({...form, is_active: !form.is_active})}>
                <div className="w-10 h-6 rounded-full relative transition-colors" style={{ background: form.is_active ? '#1a6b5e' : '#e5e7eb' }}>
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all" style={{ left: form.is_active ? '22px' : '2px' }}></div>
                </div>
                <span className="text-sm font-semibold">Published</span>
              </div>
              <div>
                <ImageUpload
                  value={form.image_url}
                  onChange={(url) => setForm({...form, image_url: url})}
                  label="Blog Image"
                />
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
