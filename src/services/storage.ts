import { supabase } from '@/supabase'

export class StorageService {
  private static BUCKET_NAME = 'products'

  static async uploadImage(file: File, productName: string): Promise<{ url: string | null, error: any }> {
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${productName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        return { url: null, error }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(data.path)

      return { url: publicUrl, error: null }
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