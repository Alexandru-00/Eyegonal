import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button, ProductCard, HexagonFrame } from '@/components/ui'

const featuredProducts = [
  {
    id: '1',
    name: 'Eye Tee Black',
    price: 35,
    category: 'T-Shirt',
    image: '/images/tee-black.jpg',
  },
  {
    id: '2',
    name: 'Eye Tee White',
    price: 35,
    category: 'T-Shirt',
    image: '/images/tee-white.jpg',
  },
  {
    id: '3',
    name: 'Hexagon Hoodie',
    price: 55,
    category: 'Felpa',
    image: '/images/hoodie.jpg',
  },
]

export function FeaturedProducts() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm uppercase tracking-wider text-eyegonal-gray-500 dark:text-eyegonal-gray-400 mb-2 block">
              Collezione
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Pezzi Iconici
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/collezione">
              <Button variant="outline">
                Vedi Tutto
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featuredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard
                image={product.image}
                name={product.name}
                price={product.price}
                category={product.category}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Banner */}
        <motion.div
          className="mt-24 relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <HexagonFrame className="aspect-square bg-eyegonal-gray-100 dark:bg-eyegonal-gray-900">
              <div className="flex items-center justify-center h-full">
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="font-display text-7xl md:text-9xl font-bold opacity-10">
                    EYE
                  </span>
                </motion.div>
              </div>
            </HexagonFrame>

            <div className="space-y-6">
              <h3 className="font-display text-3xl md:text-4xl font-bold">
                Design Esclusivo
              </h3>
              <p className="text-eyegonal-gray-500 dark:text-eyegonal-gray-400 text-lg">
                Ogni capo Eyegonal è pensato per chi non segue la massa. 
                Il nostro logo esagonale rappresenta la visione periferica, 
                quella capacità di vedere ciò che altri ignorano.
              </p>
              <ul className="space-y-3">
                {['100% Cotone Premium', 'Stampa Serigrafica', 'Edizione Limitata'].map((feature, i) => (
                  <motion.li
                    key={feature}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-eyegonal-black dark:bg-white" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
