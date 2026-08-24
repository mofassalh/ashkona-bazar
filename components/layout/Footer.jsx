'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { Mail, Phone, MapPin } from 'lucide-react'

const supabase = createClient(
  'https://bqfrwitqsllkptyqsbsd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZnJ3aXRxc2xsa3B0eXFzYnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTg5NDgsImV4cCI6MjA5NTQ3NDk0OH0.ahxSmyNXZ9Js6tlj91CvyFcDgOZwx28_-LIUevamWGo'
)

export default function Footer() {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    supabase.from('settings').select('*').then(({ data }) => {
      if (data) {
        const obj = {}
        data.forEach(s => obj[s.key] = s.value)
        setSettings(obj)
      }
    })
  }, [])

  const TEAL = settings.primary_color || '#1a6b5e'
  const brandName = settings.brand_name || 'AshkonaBazar'
  const brandParts = brandName.trim().split(' ')
  const brandFirst = brandParts.length > 1 ? brandParts.slice(0, -1).join(' ') : brandName.slice(0, -5) || brandName
  const brandSecond = brandParts.length > 1 ? brandParts[brandParts.length - 1] : brandName.slice(-5)

  const socials = [
    { url: settings.facebook_url, label: 'f' },
    { url: settings.instagram_url, label: 'in' },
    { url: settings.twitter_url, label: 'x' },
    { url: settings.tiktok_url, label: 'tt' },
    { url: settings.youtube_url, label: 'yt' },
  ].filter(s => s.url)

  const shopLinks = [
    { label: "Men's Wear", href: '/products?category=fashion' },
    { label: "Women's Fashion", href: '/products?category=fashion' },
    { label: 'Kitchen', href: '/products?category=kitchen-item-' },
    { label: 'New Arrivals', href: '/products?badge=New' },
    { label: 'Sale Items', href: '/products?badge=Sale' },
  ]

  const helpLinks = [
    { label: 'My Orders', href: '#' },
    { label: 'Track Order', href: '#' },
    { label: 'Returns & Refunds', href: '#' },
    { label: 'Shipping Info', href: '#' },
    { label: 'FAQs', href: '#' },
  ]

  return (
    <footer>
      {/* MAIN FOOTER */}
      <div className="px-4 md:px-8 py-12" style={{ background: '#0f2420' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* BRAND + CONTACT */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-baseline gap-0 mb-4 inline-flex">
              <span className="font-black text-xl tracking-tight text-white" style={{ fontFamily: 'Georgia, serif' }}>
                {brandFirst}
              </span>
              <span className="font-black text-xl tracking-tight" style={{ color: TEAL, fontFamily: 'Georgia, serif' }}>
                {brandSecond}
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed mb-5">
              {settings.footer_description || 'Your one-stop destination for fashion and kitchen essentials in Bangladesh. Quality products, fast delivery.'}
            </p>
            <div className="flex flex-col gap-3">
              {settings.footer_address && (
                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <MapPin size={13} className="flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                  <span>{settings.footer_address}</span>
                </div>
              )}
              {settings.footer_phone && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Phone size={13} style={{ color: TEAL }} />
                  <a href={"tel:" + settings.footer_phone} className="hover:text-white transition-colors">{settings.footer_phone}</a>
                </div>
              )}
              {settings.footer_email && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Mail size={13} style={{ color: TEAL }} />
                  <a href={"mailto:" + settings.footer_email} className="hover:text-white transition-colors">{settings.footer_email}</a>
                </div>
              )}
            </div>
          </div>

          {/* SHOP LINKS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Shop</h4>
            <ul className="flex flex-col gap-2.5">
              {shopLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* HELP LINKS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Help</h4>
            <ul className="flex flex-col gap-2.5">
              {helpLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* FOLLOW US */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Follow Us</h4>
            {socials.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = TEAL; e.currentTarget.style.color = 'white' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '' }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600">No social links added yet.</p>
            )}

            {/* PAYMENT METHODS */}
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mt-8 mb-4">We Accept</h4>
            <div className="flex gap-2 flex-wrap">
              {['bKash', 'Nagad', 'VISA', 'COD'].map(p => (
                <div key={p} className="border border-white/10 rounded-lg px-2.5 py-1 text-[10px] font-bold text-gray-400">{p}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="px-4 md:px-8 py-4 border-t border-white/5" style={{ background: '#081412' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-gray-500">
            {settings.footer_copyright || ('© ' + new Date().getFullYear() + ' ' + brandName + '. All Rights Reserved.')}
          </span>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <span className="text-gray-700">·</span>
            <Link href="/cookie-policy" className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors">Cookie Policy</Link>
            <span className="text-gray-700">·</span>
            <Link href="/terms" className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
