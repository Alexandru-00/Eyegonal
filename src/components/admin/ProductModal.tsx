import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Save, Loader } from 'lucide-react'
import { ProductService, CategoryService, StorageService } from '@/services'
import { Button } from '@/components/ui'
import { useToast } from '@/hooks'
import type { Product, Category, ProductWithCategory } from '@/types'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  product?: ProductWithCategory | null
  mode: 'create' | 'edit'
}

export function ProductModal({ isOpen, onClose, onSuccess, product, mode }: ProductModalProps) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const { error: showError } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
      if (mode === 'edit' && product) {
        setFormData({
          name: product.name,
          description: product.description || '',
          price: product.price.toString(),
          category_id: product.category_id,
          image: product.image || '',
        })
        setImagePreview(product.image || '')
      } else {
        resetForm()
      }
    }
  }, [isOpen, mode, product])

  const fetchCategories = async () => {
    const { data, error } = await CategoryService.getAll()
    if (!error && data) {
      setCategories(data)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image: '',
    })
    setImageFile(null)
    setImagePreview('')
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    try {
      const { url, error } = await StorageService.uploadImage(file, formData.name || 'product')
      if (error) {
        showError('Errore durante l\'upload dell\'immagine')
        return
      }
      if (url) {
        setFormData(prev => ({ ...prev, image: url }))
        setImagePreview(url)
      }
    } catch (error) {
      alert('Errore durante l\'upload dell\'immagine')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.category_id) {
      showError('Compila tutti i campi obbligatori')
      return
    }

    setLoading(true)

    try {
      // Upload image if there's a new file
      let imageUrl = formData.image
      if (imageFile) {
        const { url, error } = await StorageService.uploadImage(imageFile, formData.name)
        if (error) {
          showError('Errore durante l\'upload dell\'immagine')
          return
        }
        imageUrl = url || ''
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        image: imageUrl,
      }

      if (mode === 'create') {
        const { error } = await ProductService.create(productData)
        if (error) {
          alert('Errore durante la creazione del prodotto')
          return
        }
      } else if (mode === 'edit' && product) {
        const { error } = await ProductService.update(product.id, productData)
        if (error) {
          alert('Errore durante la modifica del prodotto')
          return
        }
      }

      onSuccess()
      onClose()
    } catch (error) {
      showError('Errore durante il salvataggio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white dark:bg-eyegonal-gray-900 shadow-xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-eyegonal-gray-200 dark:border-eyegonal-gray-800">
              <h2 className="text-2xl font-display font-bold text-eyegonal-black dark:text-white">
                {mode === 'create' ? 'Aggiungi Prodotto' : 'Modifica Prodotto'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-eyegonal-gray-100 dark:hover:bg-eyegonal-gray-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-eyegonal-gray-700 dark:text-eyegonal-gray-300 mb-2">
                      Nome Prodotto *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-eyegonal-gray-300 dark:border-eyegonal-gray-700 rounded-md bg-white dark:bg-eyegonal-gray-800 text-eyegonal-black dark:text-white focus:ring-2 focus:ring-eyegonal-black focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-eyegonal-gray-700 dark:text-eyegonal-gray-300 mb-2">
                      Descrizione
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-eyegonal-gray-300 dark:border-eyegonal-gray-700 rounded-md bg-white dark:bg-eyegonal-gray-800 text-eyegonal-black dark:text-white focus:ring-2 focus:ring-eyegonal-black focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-eyegonal-gray-700 dark:text-eyegonal-gray-300 mb-2">
                      Prezzo (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-eyegonal-gray-300 dark:border-eyegonal-gray-700 rounded-md bg-white dark:bg-eyegonal-gray-800 text-eyegonal-black dark:text-white focus:ring-2 focus:ring-eyegonal-black focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-eyegonal-gray-700 dark:text-eyegonal-gray-300 mb-2">
                      Categoria *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-eyegonal-gray-300 dark:border-eyegonal-gray-700 rounded-md bg-white dark:bg-eyegonal-gray-800 text-eyegonal-black dark:text-white focus:ring-2 focus:ring-eyegonal-black focus:border-transparent"
                      required
                    >
                      <option value="">Seleziona una categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-eyegonal-gray-700 dark:text-eyegonal-gray-300 mb-2">
                    Immagine Prodotto
                  </label>
                  <div className="space-y-4">
                    {/* Image Preview */}
                    <div className="w-full h-64 border-2 border-dashed border-eyegonal-gray-300 dark:border-eyegonal-gray-700 rounded-lg flex items-center justify-center bg-eyegonal-gray-50 dark:bg-eyegonal-gray-800">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="w-12 h-12 text-eyegonal-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-eyegonal-gray-500 dark:text-eyegonal-gray-400">
                            Trascina un'immagine o clicca per selezionare
                          </p>
                        </div>
                      )}
                    </div>

                    {/* File Input */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="block w-full px-4 py-2 text-center border border-eyegonal-gray-300 dark:border-eyegonal-gray-700 rounded-md bg-white dark:bg-eyegonal-gray-800 text-eyegonal-gray-700 dark:text-eyegonal-gray-300 hover:bg-eyegonal-gray-50 dark:hover:bg-eyegonal-gray-700 cursor-pointer transition-colors"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin inline mr-2" />
                          Caricamento...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 inline mr-2" />
                          Seleziona Immagine
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex justify-end space-x-4 p-6 border-t border-eyegonal-gray-200 dark:border-eyegonal-gray-800">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                disabled={loading}
              >
                Annulla
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Salvataggio...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {mode === 'create' ? 'Crea Prodotto' : 'Salva Modifiche'}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}