import { useState } from 'react'
import { useTransactionSummary, useCreateTransaction } from '../hooks/useTransactions'
import { useCategories } from '../hooks/useCategories'
import { usePeople } from '../hooks/usePeople'
import { TransactionType } from '../types'
import Select from 'react-select'
import dayjs from 'dayjs'
import { formatCurrency } from '../utils/currency'

export default function TransactionsPage() {
  const { data: summary, isLoading, error } = useTransactionSummary()
  const { data: categories } = useCategories()
  const { data: people } = usePeople()
  const createTransaction = useCreateTransaction()

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    type: TransactionType.Expense,
    description: '',
    date: dayjs().format('YYYY-MM-DD'),
    categoryId: '',
    personId: ''
  })

  const categoryOptions = categories?.map(cat => ({
    value: cat.id,
    label: cat.description
  })) || []

  // Filtrar pessoas com mais de 18 anos se for receita
  const personOptions = people
    ?.filter(person => {
      if (formData.type === TransactionType.Revenue) {
        return person.age >= 18
      }
      return true
    })
    .map(person => ({
      value: person.id,
      label: person.name
    })) || []

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      borderColor: '#d1d5db',
      '&:hover': {
        borderColor: '#6366f1'
      }
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? '#6366f1' 
        : state.isFocused 
        ? '#e0e7ff' 
        : 'white',
      color: state.isSelected ? 'white' : '#111827',
      fontWeight: state.isSelected ? '500' : '400',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#6366f1'
      }
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 9999
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#111827',
      fontWeight: '500'
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const valueNumber = parseFloat(formData.amount)
      
      // Importante: o campo no backend é 'value', não 'amount'
      // Conversão de string para número antes de enviar
      await createTransaction.mutateAsync({
        description: formData.description,
        value: valueNumber,
        type: formData.type,
        categoryId: formData.categoryId,
        personId: formData.personId
      })
      setShowModal(false)
      setFormData({
        amount: '',
        type: TransactionType.Expense,
        description: '',
        date: dayjs().format('YYYY-MM-DD'),
        categoryId: '',
        personId: ''
      })
    } catch (error) {
      console.error('Erro ao criar transação:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center">Carregando resumo...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center text-red-600">
          Erro ao carregar resumo: {error instanceof Error ? error.message : 'Erro desconhecido'}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Resumo de Transações</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Nova Transação
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Receita Total</h3>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              {formatCurrency(summary.totalRevenue || 0)}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Despesa Total</h3>
            <p className="mt-2 text-3xl font-semibold text-red-600">
              {formatCurrency(summary.totalExpense || 0)}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Saldo</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {formatCurrency(summary.netBalance || 0)}
            </p>
          </div>
        </div>
      )}

      {!summary && (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-center text-gray-500">Nenhum dado disponível</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Nova Transação
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) as TransactionType })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                  required
                >
                  <option value={TransactionType.Expense}>Despesa</option>
                  <option value={TransactionType.Revenue}>Receita</option>
                </select>
              </div>
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
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <Select
                  options={categoryOptions}
                  onChange={(option) => setFormData({ ...formData, categoryId: option?.value || '' })}
                  placeholder="Selecione uma categoria..."
                  styles={customSelectStyles}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pessoa * {formData.type === TransactionType.Revenue && <span className="text-xs text-gray-500">(Somente +18 anos)</span>}
                </label>
                {/* Filtro de idade: quando o tipo é Receita, mostra apenas pessoas >= 18 anos */}
                <Select
                  options={personOptions}
                  value={personOptions.find(p => p.value === formData.personId) || null}
                  onChange={(option) => setFormData({ ...formData, personId: option?.value || '' })}
                  placeholder="Selecione uma pessoa..."
                  styles={customSelectStyles}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setFormData({
                      amount: '',
                      type: TransactionType.Expense,
                      description: '',
                      date: dayjs().format('YYYY-MM-DD'),
                      categoryId: '',
                      personId: ''
                    })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createTransaction.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {createTransaction.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
