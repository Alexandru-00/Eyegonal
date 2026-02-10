import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, Loader } from 'lucide-react'
import { CategoryService } from '@/services'
import { Button } from '@/components/ui'
import { useToast } from '@/hooks'
import type { Category } from '@/types'

interface CategoryManagerProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CategoryManager({ isOpen, onClose, onSuccess }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)
  const { success, error } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await CategoryService.getAll()
    if (!error && data) {
      setCategories(data)
    }
    setLoading(false)
  }

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return

    setSaving(true)
    const { error } = await CategoryService.create(newCategory)
    if (!error) {
      setNewCategory({ name: '', description: '' })
      await fetchCategories()
      onSuccess()
    }
    setSaving(false)
  }

  const handleEditCategory = async (id: string) => {
    if (!editForm.name.trim()) return

    setSaving(true)
    const { error } = await CategoryService.update(id, editForm)
    if (!error) {
      setEditingId(null)
      await fetchCategories()
      onSuccess()
    }
    setSaving(false)
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa categoria? Tutti i prodotti associati perderanno il riferimento.')) {
      return
    }

    const { error } = await CategoryService.delete(id)
    if (!error) {
      await fetchCategories()
      onSuccess()
    }
  }

  const startEditing = (category: Category) => {
    setEditingId(category.id)
    setEditForm({ name: category.name, description: category.description })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditForm({ name: '', description: '' })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-eyegonal-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-eyegonal-gray-200 dark:border-eyegonal-gray-800">
            <h2 className="text-2xl font-display font-bold text-eyegonal-black dark:text-white">
              Gestione Categorie
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-eyegonal-gray-100 dark:hover:bg-eyegonal-gray-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Add New Category */}
                <div className="bg-eyegonal-gray-50 dark:bg-eyegonal-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-eyegonal-black dark:text-white mb-4">
                    Aggiungi Nuova Categoria
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Nome categoria"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                      className="px-3 py-2 border border-eyegonal-gray-300 dark:border-eyegonal-gray-700 rounded-md bg-white dark:bg-eyegonal-gray-900 text-eyegonal-black dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Descrizione (opzionale)"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                      className="px-3 py-2 border border-eyegonal-gray-300 dark:border-eyegonal-gray-700 rounded-md bg-white dark:bg-eyegonal-gray-900 text-eyegonal-black dark:text-white"
                    />
                  </div>
                  <Button
                    onClick={handleAddCategory}
                    disabled={saving || !newCategory.name.trim()}
                    className="w-full md:w-auto"
                  >
                    {saving ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                        Creazione...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Aggiungi Categoria
                      </>
                    )}
                  </Button>
                </div>

                {/* Existing Categories */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-eyegonal-black dark:text-white">
                    Categorie Esistenti
                  </h3>
                  {categories.length === 0 ? (
                    <p className="text-eyegonal-gray-500 dark:text-eyegonal-gray-400 text-center py-4">
                      Nessuna categoria presente
                    </p>
                  ) : (
                    categories.map((category) => (
                      <motion.div
                        key={category.id}
                        layout
                        className="bg-white dark:bg-eyegonal-gray-800 border border-eyegonal-gray-200 dark:border-eyegonal-gray-700 rounded-lg p-4"
                      >
                        {editingId === category.id ? (
                          // Edit Mode
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                className="px-3 py-2 border border-eyegonal-gray-300 dark:border-eyegonal-gray-600 rounded-md bg-white dark:bg-eyegonal-gray-700 text-eyegonal-black dark:text-white"
                              />
                              <input
                                type="text"
                                value={editForm.description}
                                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                className="px-3 py-2 border border-eyegonal-gray-300 dark:border-eyegonal-gray-600 rounded-md bg-white dark:bg-eyegonal-gray-700 text-eyegonal-black dark:text-white"
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                onClick={cancelEditing}
                                variant="outline"
                                size="sm"
                              >
                                Annulla
                              </Button>
                              <Button
                                onClick={() => handleEditCategory(category.id)}
                                disabled={saving}
                                size="sm"
                              >
                                {saving ? (
                                  <>
                                    <Loader className="w-4 h-4 animate-spin mr-2" />
                                    Salvataggio...
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Salva
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-eyegonal-black dark:text-white">
                                {category.name}
                              </h4>
                              {category.description && (
                                <p className="text-sm text-eyegonal-gray-600 dark:text-eyegonal-gray-400">
                                  {category.description}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => startEditing(category)}
                                className="p-2 text-eyegonal-gray-600 dark:text-eyegonal-gray-400 hover:text-eyegonal-black dark:hover:text-white hover:bg-eyegonal-gray-100 dark:hover:bg-eyegonal-gray-700 rounded-md transition-colors"
                                title="Modifica"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                title="Elimina"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}