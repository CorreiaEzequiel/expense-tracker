import { useState } from 'react'
import dayjs from 'dayjs'
import { usePeople, useCreatePerson, useUpdatePerson, useDeletePerson } from '../hooks/usePeople'
import ConfirmDialog from '../components/ConfirmDialog'

export default function PeoplePage() {
  const { data: people, isLoading, error } = usePeople()
  const createPerson = useCreatePerson()
  const updatePerson = useUpdatePerson()
  const deletePerson = useDeletePerson()

  const [showModal, setShowModal] = useState(false)
  const [editingPerson, setEditingPerson] = useState<{ id: string; name: string; birthDate: string } | null>(null)
  const [formData, setFormData] = useState({ name: '', birthDate: '' })
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; personId: string | null }>({
    isOpen: false,
    personId: null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Conversão crítica: o campo birthDate do formulário (YYYY-MM-DD) 
      // precisa ser enviado como dateOfBirth em formato ISO 8601 com timezone
      // Exemplo: 2000-02-03T23:38:53.489Z
      const dateOfBirthISO = dayjs(formData.birthDate).toISOString()
      
      if (editingPerson) {
        await updatePerson.mutateAsync({ 
          id: editingPerson.id, 
          name: formData.name,
          dateOfBirth: dateOfBirthISO 
        })
      } else {
        await createPerson.mutateAsync({ 
          name: formData.name,
          dateOfBirth: dateOfBirthISO 
        })
      }
      setShowModal(false)
      setFormData({ name: '', birthDate: '' })
      setEditingPerson(null)
    } catch (error) {
      console.error('Erro ao salvar pessoa:', error)
    }
  }

  const handleEdit = (person: { id: string; name: string; birthDate: string }) => {
    setEditingPerson(person)
    setFormData({ 
      name: person.name,
      birthDate: dayjs(person.birthDate).format('YYYY-MM-DD')
    })
    setShowModal(true)
  }

  const handleDeleteClick = (id: string) => {
    setConfirmDelete({ isOpen: true, personId: id })
  }

  const handleConfirmDelete = async () => {
    if (confirmDelete.personId) {
      try {
        await deletePerson.mutateAsync(confirmDelete.personId)
      } catch (error) {
        console.error('Erro ao deletar pessoa:', error)
      }
    }
    setConfirmDelete({ isOpen: false, personId: null })
  }

  const handleNew = () => {
    setEditingPerson(null)
    setFormData({ name: '', birthDate: '' })
    setShowModal(true)
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center">Carregando pessoas...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center text-red-600">
          Erro ao carregar pessoas: {error instanceof Error ? error.message : 'Erro desconhecido'}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Pessoas</h2>
        <button 
          onClick={handleNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Nova Pessoa
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {people?.map((person) => (
            <li key={person.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">{person.name}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(person)}
                      className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(person.id)}
                      className="text-sm text-red-600 hover:text-red-900 font-medium"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingPerson ? 'Editar Pessoa' : 'Nova Pessoa'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                  <span className="text-xs text-gray-500 ml-2">
                    ({formData.name.length}/200 caracteres)
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                  maxLength={200}
                  required
                  placeholder="Digite o nome"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                  required
                  max={dayjs().format('YYYY-MM-DD')}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setFormData({ name: '', birthDate: '' })
                    setEditingPerson(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createPerson.isPending || updatePerson.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {createPerson.isPending || updatePerson.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta pessoa? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, personId: null })}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
      />
    </div>
  )
}
