'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'
import ImageUpload from '@/components/ui/ImageUpload'

export default function AdminSettings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('settings').select('*').then(({ data }) => {
      const obj = {}
      data?.forEach(s => obj[s.key] = s.value)
      setSettings(obj)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const updates = Object.entries(settings).map(([key, value]) => ({
      key, value, updated_at: new Date().toISOString()
    }))
    const { error } = await supabase.from('settings').upsert(updates, { onConflict: 'key' })
    if (error) { toast.error('Error saving settings'); setSaving(false); return }
    toast.success('Settings saved!')
    setSaving(false)
  }

  const ImageField = ({ label, settingKey }) => (
    <div>
      <ImageUpload
        value={settings[settingKey] || ''}
        onChange={(url) => setSettings({...settings, [settingKey]: url})}
        label={label}
      />
    </div>
  )

  const Field = ({ label, settingKey, type = 'text', placeholder = '' }) => (
    <div>
      <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={settings[settingKey] || ''}
          onChange={e => setSettings({...settings, [settingKey]: e.target.value})}
          rows={2}
          className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm resize-none"
          placeholder={placeholder}
        />
      ) : type === 'color' ? (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={settings[settingKey] || '#1a6b5e'}
            onChange={e => setSettings({...settings, [settingKey]: e.target.value})}
            className="w-12 h-10 border border-gray-200 rounded-sm cursor-pointer"
          />
          <input
            type="text"
            value={settings[settingKey] || ''}
            onChange={e => setSettings({...settings, [settingKey]: e.target.value})}
            className="flex-1 border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm"
            placeholder="#1a6b5e"
          />
        </div>
      ) : (
        <input
          type={type}
          value={settings[settingKey] || ''}
          onChange={e => setSettings({...settings, [settingKey]: e.target.value})}
          className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-700 rounded-sm"
          placeholder={placeholder}
        />
      )}
    </div>
  )

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>

  return (
    <div className="max-w-3xl">
      <div className="flex justify-end mb-6">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 text-white px-6 py-2.5 text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90 disabled:opacity-50" style={{ background: '#1a6b5e' }}>
          <Save size={14} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="space-y-6">

        {/* SECTION VISIBILITY */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <h3 className="font-bold text-base mb-5 pb-3 border-b border-gray-100">Section Visibility</h3>
          <div className="flex flex-col gap-4">
            {[
              { key: 'show_weekly_deals', label: 'Weekly Deals', desc: 'Homepage weekly deals section' },
              { key: 'show_partners', label: 'Our Partners', desc: 'Homepage partners/brands section' },
              { key: 'show_testimonials', label: 'Customer Reviews', desc: 'Homepage testimonials section' },
              { key: 'show_blog', label: 'Blog Section', desc: 'Homepage latest articles section' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 border border-gray-100 rounded-sm">
                <div>
                  <div className="text-sm font-semibold text-gray-800">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
                <div
                  className="w-10 h-6 rounded-full relative transition-colors cursor-pointer flex-shrink-0"
                  style={{ background: settings[item.key] === 'true' ? '#1a6b5e' : '#e5e7eb' }}
                  onClick={() => setSettings({...settings, [item.key]: settings[item.key] === 'true' ? 'false' : 'true'})}
                >
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm" style={{ left: settings[item.key] === 'true' ? '22px' : '2px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BRAND */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <h3 className="font-bold text-base mb-5 pb-3 border-b border-gray-100">Brand Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Brand Name" settingKey="brand_name" placeholder="AshkonaBazar" />
            <Field label="Brand Tagline" settingKey="brand_tagline" placeholder="Fashion & Kitchen" />
          </div>
        </div>

        {/* COLORS */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <h3 className="font-bold text-base mb-5 pb-3 border-b border-gray-100">Colors</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary Color" settingKey="primary_color" type="color" />
            <Field label="Secondary Color" settingKey="secondary_color" type="color" />
          </div>
        </div>

        {/* ANNOUNCEMENT */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <h3 className="font-bold text-base mb-5 pb-3 border-b border-gray-100">Announcement Bar</h3>
          <Field label="Announcement Text" settingKey="announcement_text" type="textarea" placeholder="Free Shipping on Orders Over ৳500..." />
        </div>



        {/* CONTACT */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <h3 className="font-bold text-base mb-5 pb-3 border-b border-gray-100">Contact Info</h3>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Address" settingKey="footer_address" placeholder="123 Main St, Dhaka" />
            <Field label="Phone" settingKey="footer_phone" placeholder="+880 1800-555-8899" />
            <Field label="Email" settingKey="footer_email" placeholder="info@ashkonabazar.com" />
          </div>
        </div>

        {/* ABOUT PAGE */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <h3 className="font-bold text-base mb-5 pb-3 border-b border-gray-100">About Page</h3>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Page Title" settingKey="about_title" placeholder="About Us" />
            <Field label="Page Subtitle" settingKey="about_subtitle" placeholder="We are dedicated to bringing you the best products..." />
            <Field label="Our Story" settingKey="about_story" type="textarea" placeholder="AshkonaBazar was founded..." />
            <Field label="Our Mission" settingKey="about_mission" type="textarea" placeholder="We are committed to..." />
            <Field label="Business Hours" settingKey="business_hours" placeholder="Saturday - Thursday: 9AM - 9PM" />
          </div>
        </div>

        {/* PRODUCT PAGE */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <h3 className="font-bold text-base mb-5 pb-3 border-b border-gray-100">Product Page</h3>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Shipping & Returns Text" settingKey="shipping_returns" type="textarea" placeholder="Free shipping on orders over ৳500..." />
            <Field label="Additional Product Info" settingKey="additional_product_info" type="textarea" placeholder="All products are quality checked..." />
          </div>
        </div>

        {/* SOCIAL MEDIA */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <h3 className="font-bold text-base mb-5 pb-3 border-b border-gray-100">Social Media Links</h3>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Facebook URL" settingKey="facebook_url" placeholder="https://facebook.com/yourpage" />
            <Field label="Instagram URL" settingKey="instagram_url" placeholder="https://instagram.com/yourpage" />
            <Field label="Twitter / X URL" settingKey="twitter_url" placeholder="https://twitter.com/yourpage" />
            <Field label="TikTok URL" settingKey="tiktok_url" placeholder="https://tiktok.com/@yourpage" />
            <Field label="YouTube URL" settingKey="youtube_url" placeholder="https://youtube.com/@yourpage" />
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <h3 className="font-bold text-base mb-5 pb-3 border-b border-gray-100">Footer</h3>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Copyright Text" settingKey="footer_copyright" placeholder="Copyright © 2024, AshkonaBazar, All Rights Reserved" />
          </div>
        </div>

        {/* NAV LINKS */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <h3 className="font-bold text-base mb-5 pb-3 border-b border-gray-100">Navigation Links</h3>
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4,5,6,7].map((i: any) => (
              <Field key={i} label={"Nav Link " + i} settingKey={"nav_link_" + i} placeholder={"Link " + i} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
