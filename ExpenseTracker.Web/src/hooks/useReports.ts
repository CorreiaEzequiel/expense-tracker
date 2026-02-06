import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/apiClient'

// Query keys
export const reportKeys = {
  all: ['reports'] as const,
  categories: (startDate?: string, endDate?: string) => 
    [...reportKeys.all, 'categories', startDate, endDate] as const,
  people: (startDate?: string, endDate?: string) => 
    [...reportKeys.all, 'people', startDate, endDate] as const,
  summary: () => [...reportKeys.all, 'summary'] as const,
  personDetailed: (personId: string, startDate?: string, endDate?: string) =>
    [...reportKeys.all, 'person', personId, startDate, endDate] as const,
}

// Fetch detailed report for a person
export const usePersonReport = (personId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: reportKeys.personDetailed(personId, startDate, endDate),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      
      const response = await apiClient.get(
        `/transactions/person/${personId}/report?${params.toString()}`
      )
      return response.data?.data || response.data
    },
    enabled: !!personId,
  })
}

// Fetch categories report
export const useCategoriesReport = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: reportKeys.categories(startDate, endDate),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      
      const response = await apiClient.get(
        `/reports/categories?${params.toString()}`
      )
      return response.data?.data || response.data
    },
  })
}

// Fetch people report
export const usePeopleReport = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: reportKeys.people(startDate, endDate),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      
      const response = await apiClient.get(
        `/reports/people?${params.toString()}`
      )
      return response.data?.data || response.data
    },
  })
}

// Fetch overall summary
export const useOverallSummary = () => {
  return useQuery({
    queryKey: reportKeys.summary(),
    queryFn: async () => {
      const response = await apiClient.get('/reports/summary')
      return response.data?.data || response.data
    },
  })
}
