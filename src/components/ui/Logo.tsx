import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  className?: string
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
}

export function Logo({ size = 'md', animated = false, className = '' }: LogoProps) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={`${sizes[size]} ${className}`}
      initial={animated ? { rotate: 0 } : undefined}
      animate={animated ? { rotate: 360 } : undefined}
      transition={animated ? { duration: 20, repeat: Infinity, ease: 'linear' } : undefined}
    >
      {/* Outer Hexagon */}
      <motion.polygon
        points="50,2 95,27 95,73 50,98 5,73 5,27"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      
      {/* Inner Hexagon */}
      <motion.polygon
        points="50,15 82,35 82,65 50,85 18,65 18,35"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
      />
      
      {/* Eye Outline */}
      <motion.ellipse
        cx="50"
        cy="50"
        rx="22"
        ry="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      />
      
      {/* Pupil */}
      <motion.circle
        cx="50"
        cy="50"
        r="8"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.3 }}
      />
      
      {/* Eye Reflection */}
      <motion.circle
        cx="54"
        cy="47"
        r="3"
        fill="currentColor"
        className="text-white dark:text-eyegonal-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.5 }}
      />
    </motion.svg>
  )
}

export function LogoText({ className = '' }: { className?: string }) {
  return (
    <motion.span 
      className={`font-display font-bold tracking-wider ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      EYEGONAL
    </motion.span>
  )
}
