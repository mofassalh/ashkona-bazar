'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm_password: '' })
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    const { data: existing } = await supabase.from('customers').select('id').eq('email', form.email).single()
    if (existing) { toast.error('Email already registered'); setLoading(false); return }
    const { data, error } = await supabase.from('customers').insert({
      name: form.name, email: form.email, password_hash: btoa(form.password)
    }).select().single()
    if (error) { toast.error('Registration failed'); setLoading(false); return }
    localStorage.setItem('customer', JSON.stringify(data))
    toast.success('Account created! Welcome, ' + form.name + '!')
    router.push('/account/profile')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-sm border border-gray-100 shadow-sm w-full max-w-md p-8">
        <h1 className="font-bold text-2xl text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-500 text-sm mb-6">Join us today! Create your account below.</p>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Full Name</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="Your full name" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="your@email.com" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="Min 6 characters" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Confirm Password</label>
            <input type="password" value={form.confirm_password} onChange={e => setForm({...form, confirm_password: e.target.value})} required className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="Repeat password" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 text-white text-sm font-bold tracking-widest uppercase rounded-sm hover:opacity-90 disabled:opacity-50 transition-opacity" style={{ background: '#1a6b5e' }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account? <Link href="/account/login" className="font-semibold hover:underline" style={{ color: '#1a6b5e' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
