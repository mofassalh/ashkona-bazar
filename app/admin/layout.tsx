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
  { href: '/admin/subcategories', label: 'Subcategories', icon: Tag },
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
  const [settingsOpen, setSettingsOpen] = useState(true)
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
      <div
        className="fixed left-0 top-0 h-full z-50 bg-white text-gray-800 flex flex-col transition-all duration-300 border-r border-gray-100 shadow-lg"
        style={{ width: sidebarOpen ? '256px' : '0px', overflow: 'hidden', minWidth: sidebarOpen ? '256px' : '0px' }}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 min-w-max">
          <span className="font-bold text-lg" style={{ color: '#1a6b5e' }}>AshkonaBazar</span>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            if (item.isGroup) {
              const groupActive = item.children?.some((c: any) => pathname === c.href)
              return (
                <div key={item.label}>
                  <div onClick={() => setSettingsOpen(!settingsOpen)} className={`flex items-center gap-3 px-4 py-3 text-sm cursor-pointer ${groupActive ? 'text-teal-700 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
                    <Icon size={18} className="flex-shrink-0" />
                    <span className="font-semibold">{item.label}</span>
                    {<ChevronDown size={14} className={`ml-auto transition-transform duration-300 ${settingsOpen ? 'rotate-180' : ''}`} />}
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${settingsOpen ? 'max-h-96' : 'max-h-0'}`}>
                  {item.children?.map((child: any) => {
                    const ChildIcon = child.icon
                    const active = pathname === child.href
                    return (
                      <Link key={child.href} href={child.href}
                        className={`flex items-center gap-3 pl-10 pr-4 py-2.5 text-sm transition-all ${active ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                        <ChildIcon size={15} className="flex-shrink-0" />
                        <span>{child.label}</span>
                      </Link>
                    )
                  })}
                  </div>
                </div>
              )
            }
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all ${active ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
                {sidebarOpen && active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 text-gray-500 hover:text-red-500 transition-colors text-sm w-full">
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
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
