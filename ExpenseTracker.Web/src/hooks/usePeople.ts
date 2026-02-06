import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/apiClient'
import type { PersonResponse, CreatePersonRequest } from '../types'

// Query keys
export const personKeys = {
  all: ['people'] as const,
  detail: (id: string) => [...personKeys.all, id] as const,
}

// Fetch all people
export const usePeople = () => {
  return useQuery({
    queryKey: personKeys.all,
    queryFn: async () => {
      const response = await apiClient.get('/people')
      const result = response.data?.data || response.data
      // Garantir que sempre retorna um array
      return Array.isArray(result) ? result : []
    },
  })
}

// Fetch single person
export const usePerson = (id: string) => {
  return useQuery({
    queryKey: personKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<PersonResponse>(`/people/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Create person
export const useCreatePerson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (person: CreatePersonRequest) => {
      const { data } = await apiClient.post<PersonResponse>('/people', person)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personKeys.all })
    },
  })
}

// Update person
export const useUpdatePerson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...person }: CreatePersonRequest & { id: string }) => {
      const { data } = await apiClient.put<PersonResponse>(`/people/${id}`, person)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: personKeys.all })
      queryClient.invalidateQueries({ queryKey: personKeys.detail(variables.id) })
    },
  })
}

// Delete person
export const useDeletePerson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/people/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personKeys.all })
    },
  })
}
