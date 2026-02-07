import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Grid, List, ShoppingBag } from 'lucide-react'
import { PageTransition } from '@/components/layout'
import { Button, ProductCard, HexagonGrid } from '@/components/ui'

type Category = 'all' | 'tshirt' | 'hoodie' | 'accessories'

const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'Tutto' },
  { id: 'tshirt', label: 'T-Shirt' },
  { id: 'hoodie', label: 'Felpe' },
  { id: 'accessories', label: 'Accessori' },
]

const products = [
  {
    id: '1',
    name: 'Eye Tee Black',
    price: 35,
    category: 'tshirt' as Category,
    image: '/images/products/tee-black.jpg',
    description: 'T-shirt nera con logo Eyegonal frontale',
  },
  {
    id: '2',
    name: 'Eye Tee White',
    price: 35,
    category: 'tshirt' as Category,
    image: '/images/products/tee-white.jpg',
    description: 'T-shirt bianca con logo Eyegonal frontale',
  },
  {
    id: '3',
    name: 'Hexagon Hoodie Black',
    price: 55,
    category: 'hoodie' as Category,
    image: '/images/products/hoodie-black.jpg',
    description: 'Felpa nera con cappuccio e logo esagonale',
  },
  {
    id: '4',
    name: 'Hexagon Hoodie White',
    price: 55,
    category: 'hoodie' as Category,
    image: '/images/products/hoodie-white.jpg',
    description: 'Felpa bianca con cappuccio e logo esagonale',
  },
  {
    id: '5',
    name: 'Eye Long Sleeve Black',
    price: 42,
    category: 'tshirt' as Category,
    image: '/images/products/longsleeve-black.jpg',
    description: 'Maglia a maniche lunghe nera',
  },
  {
    id: '6',
    name: 'Eye Long Sleeve White',
    price: 42,
    category: 'tshirt' as Category,
    image: '/images/products/longsleeve-white.jpg',
    description: 'Maglia a maniche lunghe bianca',
  },
]

export function Collezione() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory)

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <HexagonGrid count={4} />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm uppercase tracking-wider text-eyegonal-gray-500 dark:text-eyegonal-gray-400 mb-4 block">
              Collezione 2026
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              I Nostri Pezzi
            </h1>
            <p className="text-xl text-eyegonal-gray-500 dark:text-eyegonal-gray-400">
              Ogni capo racconta una storia. Design minimalista, 
              qualità premium, stile unico.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {/* Toolbar */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-eyegonal-gray-200 dark:border-eyegonal-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    px-4 py-2 text-sm font-medium transition-all
                    ${activeCategory === cat.id
                      ? 'bg-eyegonal-black text-white dark:bg-white dark:text-eyegonal-black'
                      : 'bg-eyegonal-gray-100 dark:bg-eyegonal-gray-900 hover:bg-eyegonal-gray-200 dark:hover:bg-eyegonal-gray-800'
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* View Toggle & Shop Link */}
            <div className="flex items-center gap-4">
              <div className="flex border border-eyegonal-gray-200 dark:border-eyegonal-gray-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-eyegonal-black text-white dark:bg-white dark:text-eyegonal-black' : ''}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-eyegonal-black text-white dark:bg-white dark:text-eyegonal-black' : ''}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <a
                href="https://www.vinted.it/member/250232039-eyegonal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm">
                  <ShoppingBag className="w-4 h-4" />
                  Acquista su Vinted
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Products */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className={`
                ${viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' 
                  : 'flex flex-col gap-6'
                }
              `}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {viewMode === 'grid' ? (
                    <ProductCard
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      category={categories.find(c => c.id === product.category)?.label || ''}
                    />
                  ) : (
                    <div className="flex gap-6 p-4 border border-eyegonal-gray-200 dark:border-eyegonal-gray-800 hover:border-eyegonal-black dark:hover:border-white transition-colors">
                      <div className="w-32 h-32 bg-eyegonal-gray-100 dark:bg-eyegonal-gray-900 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs uppercase tracking-wider text-eyegonal-gray-500">
                          {categories.find(c => c.id === product.category)?.label}
                        </span>
                        <h3 className="font-display font-semibold text-lg mt-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-eyegonal-gray-500 dark:text-eyegonal-gray-400 mt-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="font-medium text-lg">€{product.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-eyegonal-gray-500">
                Nessun prodotto trovato in questa categoria.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-eyegonal-gray-100 dark:bg-eyegonal-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Acquista su Vinted
            </h2>
            <p className="text-eyegonal-gray-500 dark:text-eyegonal-gray-400 mb-8">
              Tutti i nostri pezzi sono disponibili su Vinted. 
              Spedizione sicura e protezione acquirente garantita.
            </p>
            <a
              href="https://www.vinted.it/member/250232039-eyegonal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg">
                <ShoppingBag className="w-5 h-5" />
                Vai al Negozio
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
