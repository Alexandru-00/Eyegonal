import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import bcrypt from 'https://deno.land/x/bcrypt/mod.ts'

serve(async (req) => {
  // Enable CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email e password sono richiesti' }),
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Find admin user by email
    const { data: adminData, error: adminError } = await supabaseClient
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single()

    if (adminError || !adminData) {
      return new Response(
        JSON.stringify({ error: 'Credenziali non valide' }),
        {
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Verify password with bcrypt
    const isValidPassword = await bcrypt.compare(password, adminData.password_hash)

    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ error: 'Credenziali non valide' }),
        {
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Update last login
    await supabaseClient
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', adminData.id)

    // Create session token using Supabase Auth
    const { data: authData, error: authError } = await supabaseClient.auth.signInAnonymously()

    if (authError) {
      console.error('Auth error:', authError)
      // Fallback: return admin data without auth token
      return new Response(
        JSON.stringify({
          adminUser: {
            id: adminData.id,
            email: adminData.email,
            created_at: adminData.created_at,
            last_login: adminData.last_login,
          },
        }),
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      )
    }

    return new Response(
      JSON.stringify({
        adminUser: {
          id: adminData.id,
          email: adminData.email,
          created_at: adminData.created_at,
          last_login: adminData.last_login,
        },
        session: authData.session,
      }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (error) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({ error: 'Errore interno del server' }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    )
  }
})