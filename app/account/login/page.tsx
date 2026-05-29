'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.from('customers').select('*').eq('email', form.email).single()
    if (error || !data) { toast.error('Email not found'); setLoading(false); return }
    // Simple password check (in production use proper hashing)
    if (data.password_hash !== btoa(form.password)) { toast.error('Wrong password'); setLoading(false); return }
    localStorage.setItem('customer', JSON.stringify(data))
    toast.success('Welcome back, ' + data.name + '!')
    router.push('/account/profile')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-sm border border-gray-100 shadow-sm w-full max-w-md p-8">
        <h1 className="font-bold text-2xl text-gray-900 mb-2">Login</h1>
        <p className="text-gray-500 text-sm mb-6">Welcome back! Please login to your account.</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="your@email.com" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 text-white text-sm font-bold tracking-widest uppercase rounded-sm hover:opacity-90 disabled:opacity-50 transition-opacity" style={{ background: '#1a6b5e' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-6">
          Don't have an account? <Link href="/account/register" className="font-semibold hover:underline" style={{ color: '#1a6b5e' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}
