import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  hexagonAccent?: boolean
}

export function Card({ 
  children, 
  className = '', 
  hoverable = true,
  hexagonAccent = false 
}: CardProps) {
  return (
    <motion.div
      className={`
        relative bg-white dark:bg-eyegonal-gray-900
        border border-eyegonal-gray-200 dark:border-eyegonal-gray-800
        overflow-hidden transition-all duration-300
        ${hoverable ? 'hover:border-eyegonal-black dark:hover:border-white' : ''}
        ${className}
      `}
      whileHover={hoverable ? { y: -4 } : undefined}
    >
      {hexagonAccent && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-eyegonal-black dark:bg-white rotate-45" />
        </div>
      )}
      {children}
    </motion.div>
  )
}

interface ProductCardProps {
  image: string
  name: string
  price: number
  category: string
  onView?: () => void
}

export function ProductCard({ image, name, price, category, onView }: ProductCardProps) {
  return (
    <Card className="group cursor-pointer" hexagonAccent>
      <div className="aspect-square overflow-hidden bg-eyegonal-gray-100 dark:bg-eyegonal-gray-800">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500"
          whileHover={{ scale: 1.05 }}
        />
      </div>
      <div className="p-4">
        <span className="text-xs uppercase tracking-wider text-eyegonal-gray-500 dark:text-eyegonal-gray-400">
          {category}
        </span>
        <h3 className="mt-1 font-display font-semibold text-lg">
          {name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-medium">€{price.toFixed(2)}</span>
          <motion.button
            onClick={onView}
            className="text-sm underline underline-offset-4 opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ x: 4 }}
          >
            Scopri →
          </motion.button>
        </div>
      </div>
    </Card>
  )
}
