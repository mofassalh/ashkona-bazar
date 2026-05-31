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
  const [settings, setSettings] = useState({
    brand_name: 'ASHKONABAZAR',
    primary_color: '#1a6b5e',
    footer_address: '123 Main St, Dhaka, Bangladesh',
    footer_phone: '+880 1800-555-8899',
    footer_email: 'info@ashkonabazar.com',
    footer_copyright: 'Copyright 2024, AshkonaBazar, All Rights Reserved',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    tiktok_url: '',
    youtube_url: '',
  })

  useEffect(() => {
    supabase.from('settings').select('*').then(({ data }) => {
      if (data) {
        const obj = {}
        data.forEach(s => obj[s.key] = s.value)
        setSettings(prev => ({ ...prev, ...obj }))
      }
    })
  }, [])

  const nameParts = settings.brand_name.trim().split(' ')
  const firstPart = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0].slice(0, -5) || nameParts[0]
  const secondPart = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0].slice(-5)
  const TEAL = settings.primary_color

  const socials = [
    { url: settings.facebook_url, emoji: 'f', label: 'Facebook' },
    { url: settings.instagram_url, emoji: '📸', label: 'Instagram' },
    { url: settings.twitter_url, emoji: '✕', label: 'Twitter' },
    { url: settings.tiktok_url, emoji: '♪', label: 'TikTok' },
    { url: settings.youtube_url, emoji: '▶', label: 'YouTube' },
  ].filter(s => s.url)

  return (
    <footer>
      <div className="py-10 px-8" style={{ background: '#1a1a1a' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          
          {/* LEFT: BRAND + CONTACT */}
          <div>
            <div className="flex items-baseline gap-0.5 mb-5">
              <span className="font-black text-2xl tracking-tight text-white" style={{ fontFamily: 'Georgia, serif' }}>
                <span className="border-b-4 border-white">{firstPart.charAt(0)}</span>{firstPart.slice(1)}
              </span>
              <span className="font-black text-2xl tracking-tight" style={{ color: TEAL, fontFamily: 'Georgia, serif' }}>{secondPart}</span>
            </div>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin size={15} style={{ color: TEAL }} />
                <span>{settings.footer_address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} style={{ color: TEAL }} />
                <span>{settings.footer_phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} style={{ color: TEAL }} />
                <Link href={"mailto:" + settings.footer_email} className="hover:text-white transition-colors">{settings.footer_email}</Link>
              </div>
            </div>
          </div>

          {/* RIGHT: SOCIAL MEDIA */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Follow Us</div>
            <div className="flex items-center gap-3">
              {socials.length > 0 ? socials.map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold transition-all duration-300 hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => e.currentTarget.style.background = TEAL}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  {s.emoji}
                </a>
              )) : (
                <span className="text-xs text-gray-600">No social links added</span>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="px-8 py-4 border-t border-gray-800" style={{ background: '#111' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <span className="text-gray-500 text-xs">{settings.footer_copyright}</span>
        </div>
      </div>
    </footer>
  )
}
