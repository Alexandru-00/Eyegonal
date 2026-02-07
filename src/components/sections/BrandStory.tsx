import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Hexagon, Logo } from '@/components/ui'

const stats = [
  { value: '68', label: 'Followers' },
  { value: '12', label: 'Posts' },
  { value: '∞', label: 'Vision' },
]

export function BrandStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-32 relative overflow-hidden bg-eyegonal-gray-100 dark:bg-eyegonal-gray-900"
    >
      {/* Floating Hexagons */}
      <motion.div
        className="absolute top-20 left-10 opacity-20"
        style={{ y }}
      >
        <Hexagon size="xl" variant="outline" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 opacity-20"
        style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
      >
        <Hexagon size="lg" variant="outline" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            style={{ opacity }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm uppercase tracking-wider text-eyegonal-gray-500 dark:text-eyegonal-gray-400 mb-4 block">
              La Nostra Storia
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              The Big EYE
            </h2>
            <div className="space-y-4 text-eyegonal-gray-600 dark:text-eyegonal-gray-300">
              <p className="text-lg">
                <strong className="text-eyegonal-black dark:text-white">Eyegonal</strong> nasce 
                dall'idea di creare qualcosa di diverso. Non un semplice brand di abbigliamento, 
                ma un simbolo per chi sceglie di camminare da solo.
              </p>
              <p>
                L'occhio esagonale rappresenta una visione unica: la capacità di osservare 
                il mondo da angolazioni che altri ignorano. È per i loners, per chi preferisce 
                la propria compagnia, per chi ha il coraggio di essere diverso.
              </p>
              <p>
                <em>"An Eye For Your Back"</em> - perché anche quando sei solo, 
                qualcuno veglia su di te.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <span className="font-display text-4xl md:text-5xl font-bold block">
                    {stat.value}
                  </span>
                  <span className="text-sm text-eyegonal-gray-500 dark:text-eyegonal-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Rotating outer ring */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                <Hexagon size="2xl" variant="outline" className="w-80 h-96 opacity-30" />
              </motion.div>
              
              {/* Counter-rotating middle ring */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Hexagon size="xl" variant="outline" className="w-60 h-72 opacity-50" />
              </motion.div>

              {/* Static center logo */}
              <div className="relative z-10 p-20">
                <Logo size="xl" animated className="w-40 h-40" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
