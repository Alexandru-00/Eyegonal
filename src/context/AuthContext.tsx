import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
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

const ADMIN_SESSION_KEY = 'eyegonal_admin_session'

export function AuthProvider({ children }: AuthProviderProps) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing admin session
    checkAdminSession()
  }, [])

  const checkAdminSession = () => {
    try {
      const sessionData = localStorage.getItem(ADMIN_SESSION_KEY)
      if (sessionData) {
        const session = JSON.parse(sessionData)
        // Check if session is still valid (24 hours)
        const sessionTime = new Date(session.timestamp).getTime()
        const now = new Date().getTime()
        const hoursDiff = (now - sessionTime) / (1000 * 60 * 60)

        if (hoursDiff < 24) {
          setAdminUser(session.adminUser)
        } else {
          // Session expired
          localStorage.removeItem(ADMIN_SESSION_KEY)
        }
      }
    } catch (error) {
      console.error('Error checking admin session:', error)
      localStorage.removeItem(ADMIN_SESSION_KEY)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Call Supabase Edge Function to verify admin credentials
      const { data, error } = await supabase.functions.invoke('verify-admin-password', {
        body: { email, password }
      })

      if (error) {
        console.error('Function error:', error)
        return { error: { message: 'Errore durante il login. Riprova.' } }
      }

      if (data.error) {
        return { error: { message: data.error } }
      }

      // Create session with admin user data
      const sessionData = {
        adminUser: data.adminUser,
        timestamp: new Date().toISOString()
      }

      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData))
      setAdminUser(data.adminUser)

      return { error: null }
    } catch (error) {
      console.error('Error during admin sign in:', error)
      return { error: { message: 'Errore durante il login. Riprova.' } }
    }
  }

  const signOut = async () => {
    localStorage.removeItem(ADMIN_SESSION_KEY)
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