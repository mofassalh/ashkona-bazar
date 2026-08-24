import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LayoutWrapper from '@/components/layout/LayoutWrapper'
import { Toaster } from 'react-hot-toast'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-serif',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'AshkonaBazar — Fashion & Kitchen',
  description: 'Your one-stop destination for fashion and kitchen essentials in Bangladesh. Quality products, fast delivery.',
  metadataBase: new URL('https://ashkonabazar.com'),
  openGraph: {
    title: 'AshkonaBazar — Fashion & Kitchen',
    description: 'Your one-stop destination for fashion and kitchen essentials in Bangladesh. Quality products, fast delivery.',
    url: 'https://ashkonabazar.com',
    siteName: 'AshkonaBazar',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AshkonaBazar — Fashion & Kitchen',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AshkonaBazar — Fashion & Kitchen',
    description: 'Your one-stop destination for fashion and kitchen essentials in Bangladesh.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${dmSans.variable} font-sans antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
