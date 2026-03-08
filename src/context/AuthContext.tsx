import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../supabase'

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
    const restoreSession = () => {
      try {
        const sessionData = localStorage.getItem(ADMIN_SESSION_KEY)
        if (sessionData) {
          const session = JSON.parse(sessionData)
          const sessionTime = new Date(session.timestamp).getTime()
          const hoursDiff = (Date.now() - sessionTime) / (1000 * 60 * 60)
          if (hoursDiff < 24) {
            setAdminUser(session.adminUser)
          } else {
            localStorage.removeItem(ADMIN_SESSION_KEY)
          }
        }
      } catch {
        localStorage.removeItem(ADMIN_SESSION_KEY)
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.rpc('verify_admin_login', {
        p_email: email,
        p_password: password,
      })

      if (error) {
        return { error: { message: error.message || 'Errore durante il login' } }
      }

      const errMsg = data?.error
      if (errMsg) {
        return { error: { message: errMsg } }
      }

      const admin = data?.adminUser
      const sessionToken = data?.sessionToken
      if (!admin || !sessionToken) {
        return { error: { message: 'Credenziali non valide' } }
      }

      const sessionData = {
        adminUser: admin,
        sessionToken,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData))
      setAdminUser(admin)
      return { error: null }
    } catch (error) {
      console.error('Error during admin sign in:', error)
      return { error: { message: 'Errore durante il login. Riprova.' } }
    }
  }

  const signOut = async () => {
    try {
      const sessionStr = localStorage.getItem(ADMIN_SESSION_KEY)
      if (sessionStr) {
        const data = JSON.parse(sessionStr)
        const token = data?.sessionToken
        if (token) {
          await supabase.rpc('admin_revoke_session', { p_token: token })
        }
      }
    } catch {
      /* ignore */
    }
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