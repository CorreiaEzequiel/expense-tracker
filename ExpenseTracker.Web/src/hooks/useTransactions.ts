import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/apiClient'
import type { TransactionResponse, CreateTransactionRequest, ReportSummaryResponse } from '../types'

// Query keys
export const transactionKeys = {
  all: ['transactions'] as const,
  summary: ['transactions', 'summary'] as const,
  detail: (id: string) => [...transactionKeys.all, id] as const,
}

// Fetch transaction summary (o endpoint GET /transactions retorna resumo)
export const useTransactionSummary = () => {
  return useQuery({
    queryKey: transactionKeys.summary,
    queryFn: async () => {
      const response = await apiClient.get('/transactions')
      // Extrair dados do wrapper Result<T>: response.data.data ou response.data
      // Isso garante compatibilidade com diferentes estruturas de resposta
      const result = response.data?.data || response.data
      return result as ReportSummaryResponse
    },
  })
}

// Fetch single transaction
export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<TransactionResponse>(`/transactions/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Create transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transaction: CreateTransactionRequest) => {
      const { data } = await apiClient.post<TransactionResponse>('/transactions', transaction)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}

// Update transaction
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...transaction }: CreateTransactionRequest & { id: string }) => {
      const { data } = await apiClient.put<TransactionResponse>(`/transactions/${id}`, transaction)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all })
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) })
    },
  })
}

// Delete transaction
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/transactions/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}
