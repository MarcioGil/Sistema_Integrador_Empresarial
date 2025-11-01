import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(e.target)
    const username = form.get('username')
    const password = form.get('password')

    try {
      const { data } = await axios.post('/api/token/', { username, password })
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      navigate('/')
    } catch (err) {
      setError('Usuário ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Sistema Integrador</h1>
        <p className="text-gray-600 mb-6">Entre com suas credenciais</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <label className="block mb-2 font-semibold text-gray-700">Usuário</label>
        <input
          name="username"
          required
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite seu usuário"
        />

        <label className="block mb-2 font-semibold text-gray-700">Senha</label>
        <input
          name="password"
          type="password"
          required
          className="w-full p-3 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite sua senha"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-semibold disabled:bg-gray-400 transition"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          Desenvolvido por Márcio Gil
        </p>
      </form>
    </div>
  )
}
