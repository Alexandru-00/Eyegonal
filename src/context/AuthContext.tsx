import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/supabase'

interface AdminUser {
  id: string
  email: string
  created_at: string
  last_login: string | null
}

interface AuthContextType {
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

function userToAdminUser(user: User): AdminUser {
  return {
    id: user.id,
    email: user.email ?? '',
    created_at: user.created_at,
    last_login: user.last_sign_in_at ?? null,
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ottieni sessione iniziale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdminUser(session?.user ? userToAdminUser(session.user) : null)
      setLoading(false)
    })

    // Ascolta cambiamenti di auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminUser(session?.user ? userToAdminUser(session.user) : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        return { error: { message: error.message === 'Invalid login credentials' ? 'Email o password non corretti' : error.message } }
      }

      if (data.user) {
        setAdminUser(userToAdminUser(data.user))
      }
      return { error: null }
    } catch (error) {
      console.error('Error during admin sign in:', error)
      return { error: { message: 'Errore durante il login. Riprova.' } }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setAdminUser(null)
  }

  const isAdmin = !!adminUser

  const value = {
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