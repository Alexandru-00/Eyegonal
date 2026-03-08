import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

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
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : ''
      const res = await fetch(`${base}/api/verify-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { error: { message: data.error || 'Credenziali non valide' } }
      }

      const sessionData = {
        adminUser: data.adminUser,
        timestamp: new Date().toISOString(),
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