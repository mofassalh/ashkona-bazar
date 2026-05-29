'use client'
import { useState } from 'react'
import { Upload, X, Image } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUpload({ value, onChange, label = 'Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ashkona_products')
    formData.append('cloud_name', 'dtgr8waqa')

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dtgr8waqa/image/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.secure_url) {
        onChange(data.secure_url)
      } else {
        setError('Upload failed')
      }
    } catch (err) {
      setError('Upload failed')
    }
    setUploading(false)
  }

  return (
    <div>
      <label className="text-xs font-semibold uppercase text-gray-500 block mb-1.5">{label}</label>
      <div className="border-2 border-dashed border-gray-200 rounded-sm overflow-hidden">
        {value ? (
          <div className="relative">
            <img src={value} alt="Uploaded" className="w-full h-48 object-cover" />
            <button
              onClick={() => onChange('')}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-gray-50 transition-colors">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-teal-700 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-gray-400">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload size={24} className="text-gray-300" />
                <span className="text-sm text-gray-400">Click to upload image</span>
                <span className="text-xs text-gray-300">PNG, JPG, WEBP up to 10MB</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
