import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

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

  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password sono richiesti' })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return res.status(500).json({ error: 'Configurazione server errata' })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const { data: adminData, error: adminError } = await supabase
    .from('admin_users')
    .select('id, email, password_hash, created_at, last_login')
    .eq('email', email)
    .single()

  if (adminError || !adminData) {
    return res.status(401).json({ error: 'Credenziali non valide' })
  }

  const isValid = await bcrypt.compare(password, adminData.password_hash)

  if (!isValid) {
    return res.status(401).json({ error: 'Credenziali non valide' })
  }

  const lastLogin = new Date().toISOString()
  await supabase
    .from('admin_users')
    .update({ last_login: lastLogin })
    .eq('id', adminData.id)

  return res.status(200).json({
    adminUser: {
      id: adminData.id,
      email: adminData.email,
      created_at: adminData.created_at,
      last_login: lastLogin,
    },
  })
}
