import { useState } from 'react'
import { useCategories, useCreateCategory } from '../hooks/useCategories'
import { CategoryPurpose } from '../types'

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories()
  const createCategory = useCreateCategory()

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ 
    description: '',
    purpose: CategoryPurpose.Expense
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createCategory.mutateAsync({ 
        description: formData.description,
        purpose: formData.purpose
      })
      setShowModal(false)
      setFormData({ description: '', purpose: CategoryPurpose.Expense })
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
    }
  }

  const getPurposeLabel = (purpose: CategoryPurpose) => {
    switch (purpose) {
      case CategoryPurpose.Expense:
        return 'Despesa'
      case CategoryPurpose.Revenue:
        return 'Receita'
      case CategoryPurpose.Both:
        return 'Ambos'
      default:
        return 'Desconhecido'
    }
  }

  const getPurposeBadgeColor = (purpose: CategoryPurpose) => {
    switch (purpose) {
      case CategoryPurpose.Expense:
        return 'bg-red-100 text-red-800'
      case CategoryPurpose.Revenue:
        return 'bg-green-100 text-green-800'
      case CategoryPurpose.Both:
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center">Carregando categorias...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center text-red-600">
          Erro ao carregar categorias: {error instanceof Error ? error.message : 'Erro desconhecido'}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Categorias</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Nova Categoria
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {categories?.map((category) => (
            <li key={category.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600">{category.description}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPurposeBadgeColor(category.purpose)}`}>
                    {getPurposeLabel(category.purpose)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Nova Categoria
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                  required
                  placeholder="Digite a descrição"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: parseInt(e.target.value) as CategoryPurpose })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                  required
                >
                  <option value={CategoryPurpose.Expense}>Despesa</option>
                  <option value={CategoryPurpose.Revenue}>Receita</option>
                  <option value={CategoryPurpose.Both}>Ambos</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setFormData({ description: '', purpose: CategoryPurpose.Expense })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createCategory.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {createCategory.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
