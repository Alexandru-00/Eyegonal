import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-none
        bg-transparent hover:bg-eyegonal-gray-100 dark:hover:bg-eyegonal-gray-900
        transition-colors duration-300
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Passa al tema ${theme === 'light' ? 'scuro' : 'chiaro'}`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  )
}

export function ThemeSwitch({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className={`text-sm ${theme === 'light' ? 'font-medium' : 'opacity-50'}`}>
        Light
      </span>
      <motion.button
        onClick={toggleTheme}
        className="relative w-14 h-8 bg-eyegonal-gray-200 dark:bg-eyegonal-gray-800 rounded-none"
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-6 h-6 bg-eyegonal-black dark:bg-white"
          animate={{ left: theme === 'light' ? 4 : 32 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
      <span className={`text-sm ${theme === 'dark' ? 'font-medium' : 'opacity-50'}`}>
        Dark
      </span>
    </div>
  )
}
