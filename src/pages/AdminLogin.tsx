import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui'
import { PageTransition } from '@/components/layout'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signIn(email, password)

      if (error) {
        setError(error.message)
      } else {
        navigate('/admin/dashboard')
      }
    } catch (err) {
      setError('Errore durante il login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-eyegonal-gray-50 dark:bg-eyegonal-gray-950 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-md w-full space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-eyegonal-black dark:bg-white flex items-center justify-center">
              <LogIn className="h-6 w-6 text-white dark:text-eyegonal-black" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-display font-bold text-eyegonal-black dark:text-white">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-eyegonal-gray-600 dark:text-eyegonal-gray-400">
              Accedi al pannello di amministrazione Eyegonal
            </p>
          </div>

          {/* Form */}
          <motion.form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-eyegonal-gray-300 dark:border-eyegonal-gray-700 placeholder-eyegonal-gray-500 text-eyegonal-black dark:text-white bg-white dark:bg-eyegonal-gray-900 focus:outline-none focus:ring-eyegonal-black dark:focus:ring-white focus:border-eyegonal-black dark:focus:border-white focus:z-10 sm:text-sm"
                  placeholder="Email amministratore"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-eyegonal-gray-300 dark:border-eyegonal-gray-700 placeholder-eyegonal-gray-500 text-eyegonal-black dark:text-white bg-white dark:bg-eyegonal-gray-900 focus:outline-none focus:ring-eyegonal-black dark:focus:ring-white focus:border-eyegonal-black dark:focus:border-white focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-eyegonal-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-eyegonal-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="text-red-600 dark:text-red-400 text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eyegonal-black dark:focus:ring-white"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Accedi
                  </>
                )}
              </Button>
            </div>

            {/* Default Credentials Info */}
            <div className="text-center">
              <p className="text-xs text-eyegonal-gray-500 dark:text-eyegonal-gray-400">
                Credenziali di default:<br />
                Email: admin@eyegonal.com<br />
                Password: admin123
              </p>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </PageTransition>
  )
}