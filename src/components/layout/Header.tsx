import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Instagram, ShoppingBag } from 'lucide-react'
import { Logo, LogoText, ThemeToggle } from '@/components/ui'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Collezione', href: '/collezione' },
  { label: 'About', href: '/about' },
  { label: 'Contatti', href: '/contatti' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <>
      <motion.header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500
          ${isScrolled ? 'glass py-3' : 'bg-transparent py-6'}
        `}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <Logo size="md" className="transition-transform group-hover:rotate-12" />
              <LogoText className="text-xl hidden sm:block" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="relative group"
                >
                  <span className={`
                    text-sm uppercase tracking-wider font-medium
                    transition-colors duration-300
                    ${location.pathname === item.href 
                      ? 'text-eyegonal-black dark:text-white' 
                      : 'text-eyegonal-gray-500 hover:text-eyegonal-black dark:hover:text-white'
                    }
                  `}>
                    {item.label}
                  </span>
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-eyegonal-black dark:bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: location.pathname === item.href ? '100%' : 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/eyegonal"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-eyegonal-gray-100 dark:hover:bg-eyegonal-gray-900 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              
              <ThemeToggle />

              <a
                href="https://www.vinted.it/member/250232039-eyegonal"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-eyegonal-black dark:bg-white text-white dark:text-eyegonal-black text-sm font-medium hover:opacity-80 transition-opacity"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-eyegonal-black/50 dark:bg-white/10 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              className="absolute top-20 left-4 right-4 bg-white dark:bg-eyegonal-gray-900 border border-eyegonal-gray-200 dark:border-eyegonal-gray-800 p-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className={`
                        block py-3 text-lg font-medium border-b border-eyegonal-gray-200 dark:border-eyegonal-gray-800
                        ${location.pathname === item.href 
                          ? 'text-eyegonal-black dark:text-white' 
                          : 'text-eyegonal-gray-500'
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.a
                  href="https://www.vinted.it/member/250232039-eyegonal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 mt-4 py-4 bg-eyegonal-black dark:bg-white text-white dark:text-eyegonal-black font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Acquista su Vinted
                </motion.a>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
