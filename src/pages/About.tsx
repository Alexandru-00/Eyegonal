import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Eye, Hexagon as HexagonIcon, Users, Heart } from 'lucide-react'
import { PageTransition } from '@/components/layout'
import { Hexagon, Logo, HexagonGrid } from '@/components/ui'

const values = [
  {
    icon: Eye,
    title: 'Visione Unica',
    description: 'Vedere il mondo da prospettive che altri ignorano. Ogni angolo nasconde una storia.',
  },
  {
    icon: HexagonIcon,
    title: 'Design Esagonale',
    description: 'La forma perfetta della natura. Simbolo di equilibrio, forza e connessione.',
  },
  {
    icon: Users,
    title: 'Per i Loners',
    description: 'Per chi sceglie la solitudine come forza, non come debolezza.',
  },
  {
    icon: Heart,
    title: 'Autenticità',
    description: 'Niente compromessi. Ogni pezzo racconta chi sei veramente.',
  },
]

const timeline = [
  { year: '2024', event: 'Nasce l\'idea di Eyegonal' },
  { year: '2024', event: 'Prima collezione "The Big EYE"' },
  { year: '2025', event: 'Espansione online su Vinted' },
  { year: '2026', event: 'Lancio del sito ufficiale' },
]

export function About() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  return (
    <PageTransition>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <HexagonGrid count={6} />
        
        <motion.div
          className="container mx-auto px-6 pt-32 pb-20 relative z-10 text-center"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm uppercase tracking-wider text-eyegonal-gray-500 dark:text-eyegonal-gray-400 mb-4 block">
              Chi Siamo
            </span>
          </motion.div>
          
          <motion.h1
            className="font-display text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            More Than
            <br />
            <span className="gradient-text">A Brand</span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-eyegonal-gray-500 dark:text-eyegonal-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Eyegonal è un movimento. Un modo di vedere e vivere il mondo.
            Per chi non ha paura di essere diverso.
          </motion.p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-eyegonal-gray-100 dark:bg-eyegonal-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <motion.div
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative flex items-center justify-center py-20">
                <motion.div
                  className="absolute"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                >
                  <Hexagon size="2xl" variant="outline" className="w-72 h-80 opacity-30" />
                </motion.div>
                <Logo size="xl" className="w-32 h-32 relative z-10" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                La Storia dell'Occhio
              </h2>
              <div className="space-y-4 text-eyegonal-gray-600 dark:text-eyegonal-gray-300">
                <p>
                  <strong className="text-eyegonal-black dark:text-white">Eyegonal</strong> non 
                  è nato in un ufficio di design o in una sala riunioni. È nato da un'idea 
                  semplice: creare qualcosa per chi si sente diverso.
                </p>
                <p>
                  L'occhio esagonale è il nostro simbolo. Rappresenta la visione periferica - 
                  quella capacità di vedere oltre ciò che è ovvio, di notare i dettagli che 
                  altri ignorano. È l'occhio che veglia su chi cammina da solo.
                </p>
                <p>
                  "An Eye For Your Back" non è solo uno slogan. È una promessa. 
                  Quando indossi Eyegonal, porti con te un pezzo di questa filosofia.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm uppercase tracking-wider text-eyegonal-gray-500 dark:text-eyegonal-gray-400 mb-2 block">
              I Nostri Valori
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Cosa Rappresentiamo
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="text-center p-8 border border-eyegonal-gray-200 dark:border-eyegonal-gray-800 hover:border-eyegonal-black dark:hover:border-white transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
                  <Hexagon size="lg" variant="filled">
                    <value.icon className="w-6 h-6" />
                  </Hexagon>
                </div>
                <h3 className="font-display font-semibold text-lg mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-eyegonal-gray-500 dark:text-eyegonal-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-eyegonal-gray-100 dark:bg-eyegonal-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm uppercase tracking-wider text-eyegonal-gray-500 dark:text-eyegonal-gray-400 mb-2 block">
              Il Nostro Percorso
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Timeline
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className="flex gap-6 mb-8 last:mb-0"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-eyegonal-black dark:bg-white" />
                  {index < timeline.length - 1 && (
                    <div className="w-px h-full bg-eyegonal-gray-300 dark:bg-eyegonal-gray-700 my-2" />
                  )}
                </div>
                <div className="pb-8">
                  <span className="font-display font-bold text-lg">
                    {item.year}
                  </span>
                  <p className="text-eyegonal-gray-600 dark:text-eyegonal-gray-300 mt-1">
                    {item.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
