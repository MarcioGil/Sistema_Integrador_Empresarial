import axios from 'axios'

// Usa variável de ambiente em produção ou proxy local em desenvolvimento
const baseURL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : '/api'

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor: adiciona token de acesso
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: trata 401 e tenta refresh automático
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Se 401 e ainda não tentou refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refresh')
      if (!refreshToken) {
        // Sem refresh token, redireciona para login
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        // Tenta renovar o access token
        const { data } = await axios.post('/api/token/refresh/', {
          refresh: refreshToken
        })
        localStorage.setItem('access', data.access)
        
        // Atualiza header e reexecuta request original
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return instance(originalRequest)
      } catch (refreshError) {
        // Refresh falhou, limpa e redireciona
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }



    // Feedback visual de erro Global (Toast)
    if (error.response) {
      const { status, data } = error.response
      
      // Erro de servidor ou permissão (exceto 401 que já é tratado)
      if (status >= 500) {
        window.dispatchEvent(new CustomEvent('toast', {
          detail: { message: 'Erro interno do servidor. Tente novamente mais tarde.', type: 'error' }
        }))
      } else if (status === 403) {
        window.dispatchEvent(new CustomEvent('toast', {
          detail: { message: 'Você não tem permissão para realizar esta ação.', type: 'warning' }
        }))
      } else if (status === 404) {
         // Opcional: avisar 404 ou deixar quieto dependendo da UX desejada. 
         // Geralmente GET 404 é ok, mas ações tipo DELETE/UPDATE 404 são erros.
         console.warn("Recurso não encontrado:", originalRequest.url);
      } else if (status === 400 && data) {
         // Erros de validação (opcional mostrar o primeiro)
         // window.dispatchEvent(new CustomEvent('toast', {
         //   detail: { message: 'Erro de validação. Verifique os dados.', type: 'error' }
         // }))
      }
    } else if (error.request) {
      // Erro de rede (sem resposta)
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { message: 'Erro de conexão. Verifique sua internet.', type: 'error' }
      }))
    }

    return Promise.reject(error)
  }
)

export default instance
