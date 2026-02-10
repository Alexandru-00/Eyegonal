import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, LogOut, Package, Users, BarChart3, Tag } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { ProductService } from '@/services'
import { Button, ToastContainer } from '@/components/ui'
import { PageTransition } from '@/components/layout'
import { ProductModal, CategoryManager } from '@/components/admin'
import { useToast } from '@/hooks'
import type { ProductWithCategory } from '@/types'

export function AdminDashboard() {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalValue: 0,
  })
  const [productModal, setProductModal] = useState({
    isOpen: false,
    mode: 'create' as 'create' | 'edit',
    product: null as ProductWithCategory | null,
  })
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false)

  const { adminUser, signOut } = useAuth()
  const navigate = useNavigate()
  const { toasts, removeToast, success, error: showError } = useToast()

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin/login')
      return
    }

    fetchProducts()
  }, [adminUser, navigate])

  const fetchProducts = async () => {
    try {
      const { data, error } = await ProductService.getAll()

      if (error) {
        console.error('Error fetching products:', error)
        error('Errore nel caricamento dei prodotti')
        return
      }

      setProducts(data || [])

      // Calculate stats
      const totalProducts = data?.length || 0
      const categories = new Set(data?.map(p => p.category?.name) || [])
      const totalValue = data?.reduce((sum, p) => sum + p.price, 0) || 0

      setStats({
        totalProducts,
        totalCategories: categories.size,
        totalValue,
      })
    } catch (error) {
      console.error('Error in fetchProducts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      return
    }

    try {
      const { error } = await ProductService.delete(id)

      if (error) {
        console.error('Error deleting product:', error)
        error('Errore durante l\'eliminazione del prodotto')
        return
      }

      const deletedProduct = products.find(p => p.id === id)
      setProducts(products.filter(p => p.id !== id))

      // Update stats
      setStats(prev => ({
        ...prev,
        totalProducts: prev.totalProducts - 1,
        totalValue: prev.totalValue - (deletedProduct?.price || 0),
      }))

      success('Prodotto eliminato con successo')
    } catch (err) {
      console.error('Error in handleDeleteProduct:', err)
      showError('Errore durante l\'eliminazione del prodotto')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const openCreateProductModal = () => {
    setProductModal({
      isOpen: true,
      mode: 'create',
      product: null,
    })
  }

  const openEditProductModal = (product: ProductWithCategory) => {
    setProductModal({
      isOpen: true,
      mode: 'edit',
      product,
    })
  }

  const closeProductModal = () => {
    setProductModal({
      isOpen: false,
      mode: 'create',
      product: null,
    })
  }

  const handleProductSuccess = () => {
    fetchProducts()
    success('Prodotto salvato con successo')
  }

  const handleCategorySuccess = () => {
    fetchProducts() // Refresh products to get updated category info
    success('Categorie aggiornate con successo')
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eyegonal-black dark:border-white"></div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-eyegonal-gray-50 dark:bg-eyegonal-gray-950">
        {/* Header */}
        <header className="bg-white dark:bg-eyegonal-gray-900 shadow-sm border-b border-eyegonal-gray-200 dark:border-eyegonal-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-display font-bold text-eyegonal-black dark:text-white">
                  Eyegonal Admin
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setCategoryManagerOpen(true)}
                  variant="outline"
                  size="sm"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Categorie
                </Button>
                <span className="text-sm text-eyegonal-gray-600 dark:text-eyegonal-gray-400">
                  {adminUser?.email}
                </span>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              className="bg-white dark:bg-eyegonal-gray-900 p-6 shadow-sm border border-eyegonal-gray-200 dark:border-eyegonal-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center">
                <Package className="h-8 w-8 text-eyegonal-black dark:text-white" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-eyegonal-gray-600 dark:text-eyegonal-gray-400">
                    Totale Prodotti
                  </p>
                  <p className="text-2xl font-bold text-eyegonal-black dark:text-white">
                    {stats.totalProducts}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-eyegonal-gray-900 p-6 shadow-sm border border-eyegonal-gray-200 dark:border-eyegonal-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-eyegonal-black dark:text-white" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-eyegonal-gray-600 dark:text-eyegonal-gray-400">
                    Categorie
                  </p>
                  <p className="text-2xl font-bold text-eyegonal-black dark:text-white">
                    {stats.totalCategories}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-eyegonal-gray-900 p-6 shadow-sm border border-eyegonal-gray-200 dark:border-eyegonal-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center">
                <Users className="h-8 w-8 text-eyegonal-black dark:text-white" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-eyegonal-gray-600 dark:text-eyegonal-gray-400">
                    Valore Totale
                  </p>
                  <p className="text-2xl font-bold text-eyegonal-black dark:text-white">
                    €{stats.totalValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Products Section */}
          <motion.div
            className="bg-white dark:bg-eyegonal-gray-900 shadow-sm border border-eyegonal-gray-200 dark:border-eyegonal-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="px-6 py-4 border-b border-eyegonal-gray-200 dark:border-eyegonal-gray-800">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-display font-semibold text-eyegonal-black dark:text-white">
                  Tutti i Prodotti
                </h2>
                <Button onClick={openCreateProductModal}>
                  <Plus className="w-4 h-4 mr-2" />
                  Aggiungi Prodotto
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-eyegonal-gray-200 dark:divide-eyegonal-gray-800">
                <thead className="bg-eyegonal-gray-50 dark:bg-eyegonal-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-eyegonal-gray-500 dark:text-eyegonal-gray-400 uppercase tracking-wider">
                      Immagine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-eyegonal-gray-500 dark:text-eyegonal-gray-400 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-eyegonal-gray-500 dark:text-eyegonal-gray-400 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-eyegonal-gray-500 dark:text-eyegonal-gray-400 uppercase tracking-wider">
                      Prezzo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-eyegonal-gray-500 dark:text-eyegonal-gray-400 uppercase tracking-wider">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-eyegonal-gray-900 divide-y divide-eyegonal-gray-200 dark:divide-eyegonal-gray-800">
                  {products.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      className="hover:bg-eyegonal-gray-50 dark:hover:bg-eyegonal-gray-800"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-16 bg-eyegonal-gray-100 dark:bg-eyegonal-gray-800 flex-shrink-0">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-eyegonal-black dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-eyegonal-gray-500 dark:text-eyegonal-gray-400 truncate max-w-xs">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-eyegonal-gray-100 dark:bg-eyegonal-gray-800 text-eyegonal-gray-800 dark:text-eyegonal-gray-200 capitalize">
                          {product.category?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-eyegonal-black dark:text-white">
                        €{product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditProductModal(product)}
                            className="text-eyegonal-gray-600 dark:text-eyegonal-gray-400 hover:text-eyegonal-black dark:hover:text-white"
                            title="Modifica"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Elimina"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {products.length === 0 && (
              <div className="px-6 py-12 text-center">
                <Package className="mx-auto h-12 w-12 text-eyegonal-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-eyegonal-gray-900 dark:text-white">
                  Nessun prodotto
                </h3>
                <p className="mt-1 text-sm text-eyegonal-gray-500 dark:text-eyegonal-gray-400">
                  Inizia aggiungendo il tuo primo prodotto.
                </p>
                <div className="mt-6">
                  <Button onClick={openCreateProductModal}>
                    <Plus className="w-4 h-4 mr-2" />
                    Aggiungi Prodotto
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={productModal.isOpen}
        onClose={closeProductModal}
        onSuccess={handleProductSuccess}
        product={productModal.product}
        mode={productModal.mode}
      />

      <CategoryManager
        isOpen={categoryManagerOpen}
        onClose={() => setCategoryManagerOpen(false)}
        onSuccess={handleCategorySuccess}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageTransition>
  )
}