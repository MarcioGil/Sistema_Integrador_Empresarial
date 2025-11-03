import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/clientes', icon: '👥', label: 'Clientes' },
    { path: '/produtos', icon: '📦', label: 'Produtos' },
    { path: '/estoque', icon: '📈', label: 'Estoque' },
    { path: '/vendas', icon: '💰', label: 'Vendas' },
    { path: '/financeiro', icon: '💳', label: 'Financeiro' }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center">
        <h3 className="text-lg font-bold">Sistema Integrador</h3>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-2xl focus:outline-none"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-gray-900 text-white p-4 flex flex-col`}
      >
        <h3 className="hidden md:block text-xl font-bold mb-6">Sistema Integrador</h3>
        
        {user && (
          <div className="bg-gray-800 rounded-lg p-3 mb-6">
            <p className="text-sm text-gray-400">Logado como:</p>
            <p className="font-semibold">{user.username || 'Usuário'}</p>
          </div>
        )}

        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`p-3 rounded transition-all ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-4 p-3 bg-red-600 rounded hover:bg-red-700 transition font-semibold"
        >
          🚪 Sair
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
