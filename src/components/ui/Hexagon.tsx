import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface HexagonProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'filled' | 'outline' | 'gradient'
  animated?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-16 h-18',
  md: 'w-24 h-28',
  lg: 'w-32 h-36',
  xl: 'w-48 h-56',
  '2xl': 'w-64 h-72',
}

export function Hexagon({
  children,
  size = 'md',
  variant = 'filled',
  animated = false,
  className = '',
  ...props
}: HexagonProps) {
  const baseClasses = `
    relative flex items-center justify-center
    clip-hexagon transition-all duration-300
    ${sizeClasses[size]}
  `

  const variantClasses = {
    filled: 'bg-eyegonal-black dark:bg-white text-white dark:text-eyegonal-black',
    outline: 'bg-transparent border-2 border-eyegonal-black dark:border-white',
    gradient: 'bg-gradient-to-br from-eyegonal-gray-400 to-eyegonal-black dark:from-eyegonal-gray-600 dark:to-white',
  }

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      animate={animated ? { rotate: 360 } : undefined}
      transition={animated ? { duration: 20, repeat: Infinity, ease: 'linear' } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface HexagonGridProps {
  count?: number
  className?: string
}

export function HexagonGrid({ count = 6, className = '' }: HexagonGridProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-5 dark:opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: 360,
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 2,
          }}
        >
          <Hexagon size="2xl" variant="outline" />
        </motion.div>
      ))}
    </div>
  )
}

interface HexagonFrameProps {
  children: ReactNode
  className?: string
}

export function HexagonFrame({ children, className = '' }: HexagonFrameProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon
          points="50,0 100,25 100,75 50,100 0,75 0,25"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-eyegonal-black dark:text-white"
        />
      </svg>
      <div className="relative z-10 p-8">
        {children}
      </div>
    </div>
  )
}
