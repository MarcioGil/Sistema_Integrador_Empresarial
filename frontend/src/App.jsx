import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Produtos from './pages/Produtos'
import Estoque from './pages/Estoque'
import Vendas from './pages/Vendas'
import Financeiro from './pages/Financeiro'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="produtos" element={<Produtos />} />
        <Route path="estoque" element={<Estoque />} />
        <Route path="vendas" element={<Vendas />} />
        <Route path="financeiro" element={<Financeiro />} />
      </Route>
    </Routes>
  )
}
