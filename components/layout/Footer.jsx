'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bqfrwitqsllkptyqsbsd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZnJ3aXRxc2xsa3B0eXFzYnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTg5NDgsImV4cCI6MjA5NTQ3NDk0OH0.ahxSmyNXZ9Js6tlj91CvyFcDgOZwx28_-LIUevamWGo'
)

export default function Footer() {
  const [featuredProducts, setFeaturedProducts] = useState([])

  const [settings, setSettings] = useState({
    brand_name: 'ASHKONABAZAR',
    primary_color: '#1a6b5e',
    footer_address: '123 Main St, Dhaka, Bangladesh',
    footer_phone: '+880 1800-555-8899',
    footer_email: 'info@ashkonabazar.com',
    footer_copyright: 'Copyright © 2024, AshkonaBazar, All Rights Reserved',
  })

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase.from('products').select('*').eq('featured', true).limit(4)
      if (data) setFeaturedProducts(data)
    }
    fetchFeatured()

    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*').single()
      if (data) setSettings(prev => ({ ...prev, ...data }))
    }
    fetchSettings()
  }, [])

  const nameParts = settings.brand_name.trim().split(' ')
  const firstPart = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0].slice(0, -5) || nameParts[0]
  const secondPart = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0].slice(-5)
  const TEAL = settings.primary_color

  return (
    <footer>
      {/* FOOTER MAIN */}
      <div className="py-16 px-8" style={{ background: '#1a1a1a' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* COL 1 — BRAND */}
          <div className="md:col-span-1">
            <div className="flex items-baseline gap-0.5 mb-5">
              <span className="font-black text-2xl tracking-tight text-white" style={{ fontFamily: 'Georgia, serif' }}>
                <span className="border-b-4 border-white">{firstPart.charAt(0)}</span>{firstPart.slice(1)}
              </span>
              <span className="font-black text-2xl tracking-tight" style={{ color: TEAL, fontFamily: 'Georgia, serif' }}>{secondPart}</span>
            </div>
            <div className="flex flex-col gap-3 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{settings.footer_address}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>{settings.footer_phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <Link href={"mailto:" + settings.footer_email} className="hover:text-white transition-colors">{settings.footer_email}</Link>
              </div>
            </div>
            <div className="flex gap-3">
              {[
                { icon: 'f', label: 'Facebook' },
                { icon: '📸', label: 'Instagram' },
                { icon: '✖', label: 'Twitter' },
                { icon: '🎵', label: 'TikTok' },
                { icon: '▶', label: 'YouTube' },
              ].map(s => (
                <button key={s.label} className="w-8 h-8 border border-gray-700 flex items-center justify-center text-xs text-gray-400 hover:text-white hover:border-white transition-all rounded-sm">
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* COL 2 — ABOUT US */}
          <div>
            <h4 className="text-white text-sm font-bold mb-5">About Us</h4>
            <ul className="flex flex-col gap-3">
              {['About Us', 'Blog', 'FAQ', 'Privacy Policy', 'Terms & Conditions'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 text-sm hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3 — MY ACCOUNT */}
          <div>
            <h4 className="text-white text-sm font-bold mb-5">My Account</h4>
            <ul className="flex flex-col gap-3">
              {['Login', 'Order History', 'Affiliates', 'Newsletter', 'Gift Certificate', 'Returns'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 text-sm hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 4 — CUSTOMER SERVICE */}
          <div>
            <h4 className="text-white text-sm font-bold mb-5">Customer Service</h4>
            <ul className="flex flex-col gap-3">
              {['Contact Us', 'Store Locations', 'Our Brands', 'Site Map', 'Delivery Information', 'Unlimited Links'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 text-sm hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 5 — RECENTLY VIEWED */}
          <div>
            <h4 className="text-white text-sm font-bold mb-5">Recently Viewed</h4>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Silk Evening Dress', price: '৳89.99', emoji: '👗' },
                { name: 'Chef Knife Set', price: '৳99.99', oldPrice: '৳149', emoji: '🔪' },
                { name: 'Linen Shirt', price: '৳65.00', emoji: '👔' },
                { name: 'Cast Iron Pan', price: '৳59.50', oldPrice: '৳85', emoji: '🍳' },
              ].map(item => (
                <div key={item.name} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-12 h-12 bg-gray-800 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition-colors">
                    <span className="text-xl">{item.emoji}</span>
                  </div>
                  <div>
                    <div className="text-gray-300 text-xs font-medium group-hover:text-white transition-colors leading-tight">{item.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white text-xs font-bold">{item.price}</span>
                      {item.oldPrice && <span className="text-gray-500 text-xs line-through">{item.oldPrice}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="px-8 py-5 border-t border-gray-800" style={{ background: '#111' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: TEAL }}>{firstPart.charAt(0)}</span>
            <span className="text-gray-500 text-xs">{settings.footer_copyright}</span>
          </div>
          <div className="flex items-center gap-2">
            {['VISA', 'MC', 'AMEX', 'DISCOVER', 'PayPal', 'Stripe'].map(p => (
              <span key={p} className="bg-white text-gray-700 text-[10px] font-bold px-2 py-1 rounded-sm">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
