import { useState } from 'react'
import { usePersonReport } from '../hooks/useReports'
import { usePeople } from '../hooks/usePeople'
import Select from 'react-select'
import dayjs from 'dayjs'
import { formatCurrency } from '../utils/currency'

/**
 * Dashboard principal de relatórios: permite visualizar transações detalhadas por pessoa
 * com agrupamento mensal e totalizadores. Funciona como a tela principal de análise financeira.
 * 
 * Funcionalidades:
 * - Seleção de pessoa por dropdown
 * - Filtro opcional por período (data inicial e final)
 * - Resumo financeiro consolidado (receita, despesa, saldo)
 * - Agrupamento mensal com tabela de transações
 * - Formatação automática de valores em Real Brasileiro
 */
export default function ReportsPage() {
  const [selectedPersonId, setSelectedPersonId] = useState<string>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { data: people } = usePeople()
  const { data: report, isLoading, error } = usePersonReport(
    selectedPersonId,
    startDate || undefined,
    endDate || undefined
  )

  const personOptions = people?.map(person => ({
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

  const getMonthName = (month: number) => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    return months[month - 1]
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Relatório Detalhado por Pessoa</h2>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pessoa
            </label>
            <Select
              options={personOptions}
              onChange={(option) => setSelectedPersonId(option?.value || '')}
              placeholder="Selecione uma pessoa..."
              styles={customSelectStyles}
              isClearable
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
            />
          </div>
        </div>
      </div>

      {!selectedPersonId && (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">Selecione uma pessoa para visualizar o relatório</p>
        </div>
      )}

      {selectedPersonId && isLoading && (
        <div className="text-center py-8">Carregando relatório...</div>
      )}

      {selectedPersonId && error && (
        <div className="text-center text-red-600 py-8">
          Erro ao carregar relatório: {error instanceof Error ? error.message : 'Erro desconhecido'}
        </div>
      )}

      {selectedPersonId && report && (
        <>
          {/* Resumo */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{report.personName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Saldo Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(report.netBalance || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Grupos Mensais */}
          {report.monthlyGroups?.map((group: any, index: number) => (
            <div key={index} className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {getMonthName(group.month)} {group.year}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Receita</p>
                  <p className="text-xl font-semibold text-green-600">
                    {formatCurrency(group.totalRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Despesa</p>
                  <p className="text-xl font-semibold text-red-600">
                    {formatCurrency(group.totalExpense)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Saldo</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(group.balance)}
                  </p>
                </div>
              </div>

              {/* Transações */}
              {group.transactions && group.transactions.length > 0 && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Descrição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {group.transactions.map((transaction: any, txIndex: number) => (
                      <tr key={txIndex}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {dayjs(transaction.date).format('DD/MM/YYYY')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.type === 1 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type === 1 ? 'Receita' : 'Despesa'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <span className={transaction.type === 1 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(transaction.value)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
