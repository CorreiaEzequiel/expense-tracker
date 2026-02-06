import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Função para configurar o toast notification
// Este setup permite que o apiClient exiba notificações automaticamente
// baseadas no tipo de resposta do backend (Success=0, Warning=1, Error=2)
let toastNotifier: ((message: string, type: 'success' | 'error' | 'warning' | 'info') => void) | null = null

export const setupApiNotifications = (showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void) => {
  toastNotifier = showToast
}

// Interceptor para logging (opcional em dev)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratamento de erros e validação de respostas
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.config.url, response.data)
    
    // Validar estrutura da resposta do backend (Result<T>)
    // O backend retorna { isSuccess, data, message, type }
    // Aqui convertemos o 'type' numérico em notificações visuais apropriadas
    const data = response.data
    
    if (data && typeof data === 'object' && 'isSuccess' in data && 'message' in data && 'type' in data) {
      const { isSuccess, message, type } = data
      
      // Exibir notificação baseada no resultado
      if (toastNotifier && message) {
        if (isSuccess && type === 0) {
          // Success
          toastNotifier(message, 'success')
        } else if (type === 1) {
          // Warning
          toastNotifier(message, 'warning')
        } else if (!isSuccess || type === 2) {
          // Error
          toastNotifier(message, 'error')
        }
      }
    }
    
    return response
  },
  (error) => {
    console.error('[API Error]', error.response?.data || error.message)
    
    // Tratamento de erros HTTP
    if (toastNotifier) {
      let errorMessage = 'Erro ao comunicar com o servidor'
      
      if (error.response) {
        const data = error.response.data
        
        // Verificar se o erro vem no formato Result<T>
        if (data && typeof data === 'object' && 'message' in data) {
          errorMessage = data.message
        } else if (error.response.status === 404) {
          errorMessage = 'Recurso não encontrado'
        } else if (error.response.status === 400) {
          errorMessage = 'Requisição inválida'
        } else if (error.response.status === 500) {
          errorMessage = 'Erro interno do servidor'
        } else if (error.response.status === 401) {
          errorMessage = 'Não autorizado'
        } else if (error.response.status === 403) {
          errorMessage = 'Acesso negado'
        }
      } else if (error.request) {
        errorMessage = 'Servidor não está respondendo'
      } else {
        errorMessage = error.message || 'Erro desconhecido'
      }
      
      toastNotifier(errorMessage, 'error')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
