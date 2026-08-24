import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bqfrwitqsllkptyqsbsd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZnJ3aXRxc2xsa3B0eXFzYnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTg5NDgsImV4cCI6MjA5NTQ3NDk0OH0.ahxSmyNXZ9Js6tlj91CvyFcDgOZwx28_-LIUevamWGo'
)

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { data: product } = await supabase
    .from('products')
    .select('name, description, image_url, price, sale_price')
    .eq('slug', slug)
    .single()

  if (!product) {
    return {
      title: 'Product Not Found — AshkonaBazar',
    }
  }

  const price = product.sale_price || product.price
  const title = product.name + ' — AshkonaBazar'
  const description = product.description || ('Buy ' + product.name + ' at the best price in Bangladesh. Only \u09f3' + price + ' at AshkonaBazar.')
  const image = product.image_url || 'https://ashkonabazar.com/og-image.jpg'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://ashkonabazar.com/products/' + slug,
      siteName: 'AshkonaBazar',
      images: [
        {
          url: image,
          width: 800,
          height: 800,
          alt: product.name,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default function ProductLayout({ children }) {
  return children
}
