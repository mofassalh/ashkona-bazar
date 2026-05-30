'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function AboutPage() {
  const [settings, setSettings] = useState<any>({})

  useEffect(() => {
    supabase.from('settings').select('*').then(({ data }) => {
      const obj: any = {}
      data?.forEach((s: any) => obj[s.key] = s.value)
      setSettings(obj)
    })
  }, [])

  const TEAL = settings.primary_color || '#1a6b5e'

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <div className="py-16 px-6 text-center" style={{ background: '#f5f2ee' }}>
        <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-4">{settings.about_title || 'About Us'}</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">{settings.about_subtitle || 'We are dedicated to bringing you the best products at the best prices.'}</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* ABOUT TEXT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="font-bold text-2xl text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-500 leading-relaxed">{settings.about_story || 'AshkonaBazar was founded with a simple mission: to make quality products accessible to everyone. We believe that great products should not come with a high price tag.'}</p>
          </div>
          <div>
            <h2 className="font-bold text-2xl text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-500 leading-relaxed">{settings.about_mission || 'We are committed to providing our customers with the highest quality products, exceptional customer service, and a seamless shopping experience.'}</p>
          </div>
        </div>

        {/* CONTACT */}
        <div className="border-t border-gray-100 pt-16">
          <h2 className="font-bold text-2xl text-gray-900 mb-8 text-center">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CONTACT INFO */}
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: TEAL }}>
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Address</div>
                  <div className="text-gray-500 text-sm">{settings.footer_address || '123 Main St, Dhaka, Bangladesh'}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: TEAL }}>
                  <Phone size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Phone</div>
                  <div className="text-gray-500 text-sm">{settings.footer_phone || '+880 1800-555-8899'}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: TEAL }}>
                  <Mail size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Email</div>
                  <div className="text-gray-500 text-sm">{settings.footer_email || 'info@ashkonabazar.com'}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: TEAL }}>
                  <Clock size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Business Hours</div>
                  <div className="text-gray-500 text-sm">{settings.business_hours || 'Saturday - Thursday: 9AM - 9PM'}</div>
                </div>
              </div>
            </div>

            {/* CONTACT FORM */}
            <div className="bg-gray-50 rounded-sm p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Send us a message</h3>
              <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Name</label>
                  <input type="text" className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm bg-white" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Email</label>
                  <input type="email" className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm bg-white" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">Message</label>
                  <textarea rows={4} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm bg-white resize-none" placeholder="How can we help?" />
                </div>
                <button type="submit" className="w-full py-3 text-white text-sm font-bold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity" style={{ background: TEAL }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
