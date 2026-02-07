import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown, ShoppingBag } from 'lucide-react'
import { Button, Hexagon, HexagonGrid, Logo } from '@/components/ui'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Hexagon Background */}
      <HexagonGrid count={8} />
      
      {/* Large Animated Logo */}
      <motion.div
        className="absolute opacity-5 dark:opacity-10"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <Logo size="xl" className="w-[600px] h-[600px]" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-eyegonal-gray-100 dark:bg-eyegonal-gray-900 text-sm font-medium tracking-wider uppercase">
              <Hexagon size="sm" className="w-4 h-4">
                <div className="w-2 h-2 rounded-full bg-current" />
              </Hexagon>
              The Big EYE
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="block">An Eye For</span>
            <span className="block gradient-text">Your Back</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-eyegonal-gray-500 dark:text-eyegonal-gray-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A Look At Loners.{' '}
            <strong className="text-eyegonal-black dark:text-white">
              More Than A Brand.
            </strong>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/collezione">
              <Button size="lg">
                Esplora Collezione
              </Button>
            </Link>
            <a
              href="https://www.vinted.it/member/250232039-eyegonal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg">
                <ShoppingBag className="w-5 h-5" />
                Acquista
              </Button>
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{
              opacity: { delay: 1, duration: 0.5 },
              y: { delay: 1.5, duration: 2, repeat: Infinity },
            }}
          >
            <ArrowDown className="w-6 h-6 text-eyegonal-gray-400" />
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-eyegonal-black to-transparent" />
    </section>
  )
}
