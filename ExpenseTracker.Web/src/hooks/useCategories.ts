import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/apiClient'
import type { CategoryResponse, CreateCategoryRequest } from '../types'

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  detail: (id: string) => [...categoryKeys.all, id] as const,
}

// Fetch all categories
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const response = await apiClient.get('/categories')
      const result = response.data?.data || response.data
      // Garantir que sempre retorna um array
      return Array.isArray(result) ? result : []
    },
  })
}

// Fetch single category
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<CategoryResponse>(`/categories/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (category: CreateCategoryRequest) => {
      const { data } = await apiClient.post<CategoryResponse>('/categories', category)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

// Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...category }: CreateCategoryRequest & { id: string }) => {
      const { data } = await apiClient.put<CategoryResponse>(`/categories/${id}`, category)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) })
    },
  })
}

// Delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/categories/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}
