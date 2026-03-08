import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return res.status(500).json({ error: 'Configurazione server errata' })
  }

  const { image, fileName } = req.body || {}
  if (!image || !fileName || typeof image !== 'string' || typeof fileName !== 'string') {
    return res.status(400).json({ error: 'image e fileName sono richiesti' })
  }

  try {
    const buffer = Buffer.from(image, 'base64')
    const ext = (fileName.split('.').pop() || 'png').toLowerCase()
    const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '-')
    const mimeTypes: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      webp: 'image/webp',
    }
    const contentType = mimeTypes[ext] || 'image/png'

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data, error } = await supabase.storage
      .from('products')
      .upload(safeName, buffer, {
        contentType,
        upsert: true,
      })

    if (error) {
      console.error('Storage upload error:', error)
      return res.status(500).json({ error: error.message || 'Errore upload' })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(data.path)

    return res.status(200).json({ url: publicUrl })
  } catch (err) {
    console.error('Upload error:', err)
    return res.status(500).json({ error: 'Errore durante l\'upload' })
  }
}
