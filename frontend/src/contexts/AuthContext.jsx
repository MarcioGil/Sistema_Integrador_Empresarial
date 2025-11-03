import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar se há token ao carregar
    const token = localStorage.getItem('access')
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [])

  const loadUser = async () => {
    try {
      // Buscar informações do usuário atual
      const { data } = await api.get('/usuarios/me/')
      setUser(data)
    } catch (err) {
      console.error('Erro ao carregar usuário', err)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/token/', { username, password })
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      await loadUser()
      navigate('/')
      return { success: true }
    } catch (err) {
      console.error('Erro no login', err)
      console.error('Detalhes do erro:', err.response?.data)
      console.error('URL completa:', err.config?.baseURL + err.config?.url)
      return {
        success: false,
        error: err.response?.data?.detail || 'Credenciais inválidas'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUser(null)
    navigate('/login')
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
