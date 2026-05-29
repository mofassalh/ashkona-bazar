'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (email === 'admin@ashkonabazar.com' && password === 'admin123') {
      localStorage.setItem('admin_logged_in', 'true')
      router.push('/admin')
    } else {
      setError('Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-sm shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4" style={{ background: '#1a6b5e' }}>A</div>
          <h1 className="font-bold text-2xl text-gray-900">AshkonaBazar</h1>
          <p className="text-gray-500 text-sm mt-1">Admin Panel Login</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold tracking-widest uppercase text-gray-500 block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@ashkonabazar.com"
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-700 transition-colors rounded-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold tracking-widest uppercase text-gray-500 block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-700 transition-colors rounded-sm"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 text-xs tracking-widest uppercase font-bold rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            style={{ background: '#1a6b5e' }}
          >
            {loading ? 'Logging in...' : 'Login to Admin'}
          </button>
        </form>
        <div className="mt-6 p-4 bg-gray-50 rounded-sm text-xs text-gray-500 text-center">
          Default: admin@ashkonabazar.com / admin123
        </div>
      </div>
    </div>
  )
}
