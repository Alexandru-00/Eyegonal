import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  hexagon?: boolean
  className?: string
}

const variants = {
  primary: `
    bg-eyegonal-black text-white 
    dark:bg-white dark:text-eyegonal-black
    hover:bg-eyegonal-gray-800 dark:hover:bg-eyegonal-gray-200
  `,
  secondary: `
    bg-eyegonal-gray-200 text-eyegonal-black
    dark:bg-eyegonal-gray-800 dark:text-white
    hover:bg-eyegonal-gray-300 dark:hover:bg-eyegonal-gray-700
  `,
  outline: `
    bg-transparent border-2 border-eyegonal-black text-eyegonal-black
    dark:border-white dark:text-white
    hover:bg-eyegonal-black hover:text-white
    dark:hover:bg-white dark:hover:text-eyegonal-black
  `,
  ghost: `
    bg-transparent text-eyegonal-black dark:text-white
    hover:bg-eyegonal-gray-100 dark:hover:bg-eyegonal-gray-900
  `,
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  hexagon = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-medium transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-eyegonal-black dark:focus:ring-white focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${hexagon ? 'clip-hexagon' : 'rounded-none'}
  `

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
