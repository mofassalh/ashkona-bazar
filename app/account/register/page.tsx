'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          phone: form.phone,
        }
      }
    })
    if (error) {
      toast.error(error.message || 'Registration failed')
      setLoading(false)
      return
    }
    toast.success('Account created! Please check your email to confirm.')
    router.push('/account/login')
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://ashkonabazar.com/account/profile'
      }
    })
    if (error) {
      toast.error('Google login failed')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#f8f6f2' }}>
      <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-md p-8">

        {/* LOGO */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-baseline">
            <span className="font-black text-2xl tracking-tight text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Ashkona</span>
            <span className="font-black text-2xl tracking-tight" style={{ color: '#1a6b5e', fontFamily: 'Georgia, serif' }}>Bazar</span>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Create your account</p>
        </div>

        {/* GOOGLE */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors mb-4 disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-xs text-gray-400 font-medium">or</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5 tracking-wider">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5 tracking-wider">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5 tracking-wider">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
              placeholder="+880 1XXX-XXXXXX"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5 tracking-wider">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
              placeholder="Min. 6 characters"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5 tracking-wider">Confirm Password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={e => setForm({...form, confirm: e.target.value})}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
              placeholder="Re-enter password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity mt-1"
            style={{ background: '#1a6b5e' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy-policy" className="underline">Privacy Policy</Link>
        </p>

        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{' '}
          <Link href="/account/login" className="font-semibold hover:underline" style={{ color: '#1a6b5e' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
