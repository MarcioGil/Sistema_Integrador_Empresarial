import axios from 'axios'

const instance = axios.create({
  baseURL: '/',
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

    return Promise.reject(error)
  }
)

export default instance
