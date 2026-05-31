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
  const [expanded, setExpanded] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
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

  const getTitle = () => {
    for (const item of navItems) {
      if ('href' in item && item.href === pathname) return item.label
      if (item.isGroup && item.children) {
        const child = item.children.find((c: any) => c.href === pathname)
        if (child) return child.label
      }
    }
    return 'Admin Panel'
  }

  const SidebarContent = ({ showLabels }: { showLabels: boolean }) => (
    <nav className="flex-1 py-4 overflow-y-auto">
      {navItems.map((item: any) => {
        if (item.isGroup) {
          const groupActive = item.children?.some((c: any) => pathname === c.href)
          return (
            <div key={item.label}>
              <div
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={"flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors " + (groupActive ? "text-teal-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")}
              >
                <item.icon size={18} className="flex-shrink-0" />
                {showLabels && <>
                  <span className="font-semibold">{item.label}</span>
                  <ChevronDown size={14} className={\`ml-auto transition-transform duration-300 \${settingsOpen ? 'rotate-180' : ''}\`} />
                </>}
              </div>
              {showLabels && (
                <div className={\`overflow-hidden transition-all duration-300 \${settingsOpen ? 'max-h-96' : 'max-h-0'}\`}>
                  {item.children?.map((child: any) => {
                    const active = pathname === child.href
                    return (
                      <Link key={child.href} href={child.href}
                        className={\`flex items-center gap-3 pl-10 pr-4 py-2.5 text-sm transition-all \${active ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}\`}>
                        <child.icon size={15} className="flex-shrink-0" />
                        <span>{child.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        }
        const active = pathname === item.href
        return (
          <Link key={item.href} href={item.href}
            className={\`flex items-center gap-3 px-4 py-3 text-sm transition-all \${active ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}\`}>
            <item.icon size={18} className="flex-shrink-0" />
            {showLabels && <span>{item.label}</span>}
            {showLabels && active && <ChevronRight size={14} className="ml-auto" />}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* DESKTOP SIDEBAR - icon strip + hover expand */}
      <div
        className="hidden md:flex flex-col bg-white border-r border-gray-100 transition-all duration-300 flex-shrink-0 z-50"
        style={{ width: expanded ? '256px' : '56px' }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-100 h-14 overflow-hidden">
          {expanded ? (
            <span className="font-bold text-base whitespace-nowrap" style={{ color: '#1a6b5e' }}>AshkonaBazar</span>
          ) : (
            <span className="font-bold text-base" style={{ color: '#1a6b5e' }}>A</span>
          )}
        </div>
        <SidebarContent showLabels={expanded} />
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 text-gray-500 hover:text-red-500 transition-colors text-sm w-full">
            <LogOut size={18} />
            {expanded && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <span className="font-bold text-base" style={{ color: '#1a6b5e' }}>AshkonaBazar</span>
              <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
            </div>
            <SidebarContent showLabels={true} />
            <div className="p-4 border-t border-gray-100">
              <button onClick={handleLogout} className="flex items-center gap-3 text-gray-500 hover:text-red-500 transition-colors text-sm w-full">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-1.5 rounded-sm hover:bg-gray-100">
              <Menu size={20} className="text-gray-600" />
            </button>
            <h1 className="font-bold text-gray-900 text-lg">{getTitle()}</h1>
          </div>
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
