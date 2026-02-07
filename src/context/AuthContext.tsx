import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/supabase'
import type { User } from '@supabase/supabase-js'

interface AdminUser {
  id: string
  email: string
  created_at: string
  last_login: string | null
}

interface AuthContextType {
  user: User | null
  adminUser: AdminUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchAdminUser(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchAdminUser(session.user.id)
      } else {
        setAdminUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchAdminUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching admin user:', error)
        setAdminUser(null)
      } else {
        setAdminUser(data)
        // Update last login
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', userId)
      }
    } catch (error) {
      console.error('Error in fetchAdminUser:', error)
      setAdminUser(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error }
    }

    // Check if user is admin
    if (data.user) {
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (adminError || !adminData) {
        // Sign out if not admin
        await supabase.auth.signOut()
        return { error: { message: 'Accesso negato. Solo amministratori possono accedere.' } }
      }
    }

    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setAdminUser(null)
  }

  const isAdmin = !!adminUser

  const value = {
    user,
    adminUser,
    loading,
    signIn,
    signOut,
    isAdmin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}