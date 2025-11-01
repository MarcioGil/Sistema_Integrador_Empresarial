import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../services/api'

export default function Login() {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const username = form.get('username')
    const password = form.get('password')
    try {
      const { data } = await axios.post('/api/token/', { username, password })
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      navigate('/')
    } catch (err) {
      alert('Falha ao autenticar')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Entrar</h1>
        <label className="block mb-2">Usuário</label>
        <input name="username" className="w-full p-2 border rounded mb-4" />
        <label className="block mb-2">Senha</label>
        <input name="password" type="password" className="w-full p-2 border rounded mb-4" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Entrar</button>
      </form>
    </div>
  )
}
