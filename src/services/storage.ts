import { supabase } from '@/supabase'

export class StorageService {
  private static BUCKET_NAME = 'products'

  static async uploadImage(file: File, productName: string): Promise<{ url: string | null, error: any }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${productName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExt}`

      // Usa API serverless (service_role) - bypassa RLS e policy bucket
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          const base64 = result.split(',')[1] || result
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const base = typeof window !== 'undefined' ? window.location.origin : ''
      const res = await fetch(`${base}/api/upload-product-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, fileName }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        return { url: null, error: { message: data.error || 'Upload fallito' } }
      }
      return { url: data.url || null, error: null }
    } catch (error) {
      return { url: null, error }
    }
  }

  static async deleteImage(imageUrl: string): Promise<{ error: any }> {
    try {
      // Extract filename from URL
      const urlParts = imageUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([fileName])

      return { error }
    } catch (error) {
      return { error }
    }
  }
}