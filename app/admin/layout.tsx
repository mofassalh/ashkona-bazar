'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, Package, ShoppingCart,
  Settings, Tag, LogOut, Menu, X, ChevronRight, ChevronDown,
  MessageSquare, Star, Handshake, Newspaper, Megaphone, Image, Sliders
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  {
    label: 'Settings', icon: Settings, isGroup: true,
    children: [
      { href: '/admin/settings', label: 'General', icon: Sliders },
      { href: '/admin/hero-slides', label: 'Hero Slides', icon: Image },
      { href: '/admin/marquee', label: 'Marquee', icon: Megaphone },
      { href: '/admin/features', label: 'Features', icon: Star },
      { href: '/admin/partners', label: 'Partners', icon: Handshake },
      { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
      { href: '/admin/blogs', label: 'Blogs', icon: Newspaper },
    ]
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isAdmin = localStorage.getItem('admin_logged_in')
    if (!isAdmin && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [pathname])

  if (!mounted) return null
  if (pathname === '/admin/login') return <>{children}</>

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in')
    router.push('/admin/login')
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 text-white flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {sidebarOpen && <span className="font-bold text-lg" style={{ color: '#1a6b5e' }}>AshkonaBazar</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition-colors">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            if (item.isGroup) {
              const groupActive = item.children?.some((c: any) => pathname === c.href)
              return (
                <div key={item.label}>
                  <div className={`flex items-center gap-3 px-4 py-3 text-sm text-gray-400 ${groupActive ? 'text-white' : ''}`}>
                    <Icon size={18} className="flex-shrink-0" />
                    {sidebarOpen && <span className="font-semibold">{item.label}</span>}
                    {sidebarOpen && <ChevronDown size={14} className="ml-auto" />}
                  </div>
                  {sidebarOpen && item.children?.map((child: any) => {
                    const ChildIcon = child.icon
                    const active = pathname === child.href
                    return (
                      <Link key={child.href} href={child.href}
                        className={`flex items-center gap-3 pl-10 pr-4 py-2.5 text-sm transition-all ${active ? 'bg-teal-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <ChildIcon size={15} className="flex-shrink-0" />
                        <span>{child.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )
            }
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all ${active ? 'bg-teal-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
                {sidebarOpen && active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm w-full">
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="font-bold text-gray-900 text-lg">
            {(() => {
              for (const item of navItems) {
                if (item.href === pathname) return item.label
                if (item.children) {
                  const child = item.children.find((c: any) => c.href === pathname)
                  if (child) return child.label
                }
              }
              return 'Admin Panel'
            })()}
          </h1>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-sm transition-colors">View Site →</Link>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1a6b5e' }}>A</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
