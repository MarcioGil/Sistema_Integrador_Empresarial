import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <h3 className="text-xl font-bold mb-6">Sistema Integrador</h3>
        <nav className="flex flex-col gap-2 flex-1">
          <Link to="/" className="p-2 rounded hover:bg-gray-700">
            📊 Dashboard
          </Link>
          <Link to="/clientes" className="p-2 rounded hover:bg-gray-700">
            👥 Clientes
          </Link>
          <Link to="/produtos" className="p-2 rounded hover:bg-gray-700">
            📦 Produtos
          </Link>
          <Link to="/estoque" className="p-2 rounded hover:bg-gray-700">
            📈 Estoque
          </Link>
          <Link to="/vendas" className="p-2 rounded hover:bg-gray-700">
            💰 Vendas
          </Link>
          <Link to="/financeiro" className="p-2 rounded hover:bg-gray-700">
            💳 Financeiro
          </Link>
          <Link to="/fornecedores" className="p-2 rounded hover:bg-gray-700">
            🏭 Fornecedores
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-4 p-2 bg-red-600 rounded hover:bg-red-700"
        >
          🚪 Sair
        </button>
      </aside>
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
