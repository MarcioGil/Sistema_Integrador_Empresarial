import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Clientes from './pages/Clientes.jsx'
import Produtos from './pages/Produtos.jsx'
import Estoque from './pages/Estoque.jsx'
import Vendas from './pages/Vendas.jsx'
import Financeiro from './pages/Financeiro.jsx'
import Fornecedores from './pages/Fornecedores.jsx'
import Usuarios from './pages/Usuarios.jsx'
import Auditoria from './pages/Auditoria.jsx'
import Layout from './components/Layout.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
        <Route path="produtos" element={<PrivateRoute><Produtos /></PrivateRoute>} />
        <Route path="estoque" element={<PrivateRoute><Estoque /></PrivateRoute>} />
        <Route path="vendas" element={<PrivateRoute><Vendas /></PrivateRoute>} />
        <Route path="financeiro" element={<PrivateRoute><Financeiro /></PrivateRoute>} />
        <Route path="fornecedores" element={<PrivateRoute><Fornecedores /></PrivateRoute>} />
        <Route path="usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
        <Route path="auditoria" element={<PrivateRoute><Auditoria /></PrivateRoute>} />
      </Route>
    </Routes>
  )
}
