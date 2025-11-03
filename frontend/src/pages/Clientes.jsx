import React, { useEffect, useState } from 'react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import Toast from '../components/Toast'
import { exportClientesPDF } from '../utils/pdfExport'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCliente, setEditingCliente] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchClientes()
  }, [search])

  const fetchClientes = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = search ? { search } : {}
      const { data } = await api.get('/api/clientes/', { params })
      setClientes(data.results || data)
    } catch (err) {
      console.error('Erro ao buscar clientes', err)
      setError('Não foi possível carregar os clientes. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Desativar cliente?')) return
    try {
      await api.patch(`/api/clientes/${id}/`, { ativo: false })
      setToast({ message: 'Cliente desativado com sucesso!', type: 'success' })
      fetchClientes()
    } catch (err) {
      setToast({ message: 'Erro ao desativar cliente', type: 'error' })
    }
  }

  const handleExportPDF = () => {
    try {
      exportClientesPDF(clientes)
      setToast({ message: 'Relatório PDF gerado com sucesso!', type: 'success' })
    } catch (err) {
      setToast({ message: 'Erro ao gerar PDF', type: 'error' })
    }
  }

  const handleEdit = (cliente) => {
    setEditingCliente(cliente)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingCliente(null)
    fetchClientes()
  }

  return (
    <div className="p-4 sm:p-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">👥 Clientes</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportPDF}
            disabled={clientes.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📄 Exportar PDF
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Novo Cliente
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar por nome, CPF ou CNPJ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Carregando clientes..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchClientes} />
      ) : clientes.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">Nenhum cliente encontrado</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Cadastrar Primeiro Cliente
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left hidden md:table-cell">CPF/CNPJ</th>
                <th className="p-3 text-left hidden lg:table-cell">Tipo</th>
                <th className="p-3 text-left hidden sm:table-cell">Telefone</th>
                <th className="p-3 text-left hidden xl:table-cell">Email</th>
                <th className="p-3 text-center">Ativo</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} className="border-t hover:bg-blue-50 transition">
                  <td className="p-3 font-medium">{c.nome}</td>
                  <td className="p-3 hidden md:table-cell text-gray-600">{c.cpf_cnpj}</td>
                  <td className="p-3 hidden lg:table-cell">
                    <span className={`px-2 py-1 rounded text-xs ${c.tipo === 'PF' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {c.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </span>
                  </td>
                  <td className="p-3 hidden sm:table-cell text-gray-600">{c.telefone}</td>
                  <td className="p-3 hidden xl:table-cell text-gray-600">{c.email}</td>
                  <td className="p-3 text-center text-xl">{c.ativo ? '✅' : '❌'}</td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-600 hover:text-red-800 hover:underline font-medium"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ClienteForm
          cliente={editingCliente}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}

function ClienteForm({ cliente, onClose }) {
  const [formData, setFormData] = useState({
    nome: cliente?.nome || '',
    cpf_cnpj: cliente?.cpf_cnpj || '',
    tipo: cliente?.tipo || 'PF',
    telefone: cliente?.telefone || '',
    email: cliente?.email || '',
    endereco: cliente?.endereco || '',
    cidade: cliente?.cidade || '',
    estado: cliente?.estado || '',
    cep: cliente?.cep || '',
    ativo: cliente?.ativo ?? true
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateCPF = (cpf) => {
    // Simples validação de tamanho
    return cpf.replace(/\D/g, '').length === 11
  }

  const validateCNPJ = (cnpj) => {
    return cnpj.replace(/\D/g, '').length === 14
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Validações
    const newErrors = {}
    if (!formData.nome) newErrors.nome = 'Nome obrigatório'
    if (!formData.cpf_cnpj) {
      newErrors.cpf_cnpj = 'CPF/CNPJ obrigatório'
    } else if (formData.tipo === 'PF' && !validateCPF(formData.cpf_cnpj)) {
      newErrors.cpf_cnpj = 'CPF inválido (11 dígitos)'
    } else if (formData.tipo === 'PJ' && !validateCNPJ(formData.cpf_cnpj)) {
      newErrors.cpf_cnpj = 'CNPJ inválido (14 dígitos)'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      if (cliente) {
        await api.put(`/api/clientes/${cliente.id}/`, formData)
      } else {
        await api.post('/api/clientes/', formData)
      }
      onClose()
    } catch (err) {
      const apiErrors = err.response?.data || {}
      setErrors(apiErrors)
      alert('Erro ao salvar cliente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {cliente ? 'Editar Cliente' : 'Novo Cliente'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="PF">Pessoa Física</option>
              <option value="PJ">Pessoa Jurídica</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Nome *</label>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.nome && <p className="text-red-600 text-sm">{errors.nome}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">
              {formData.tipo === 'PF' ? 'CPF' : 'CNPJ'} *
            </label>
            <input
              name="cpf_cnpj"
              value={formData.cpf_cnpj}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder={formData.tipo === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
            />
            {errors.cpf_cnpj && <p className="text-red-600 text-sm">{errors.cpf_cnpj}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Telefone</label>
            <input
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Endereço</label>
            <input
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-semibold">Cidade</label>
              <input
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Estado</label>
              <input
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                maxLength={2}
                className="w-full p-2 border rounded"
                placeholder="SP"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">CEP</label>
            <input
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="00000-000"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                name="ativo"
                type="checkbox"
                checked={formData.ativo}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="font-semibold">Ativo</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
