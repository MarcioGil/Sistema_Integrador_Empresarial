import React, { useEffect, useState } from 'react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import Toast from '../components/Toast.jsx'

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingFornecedor, setEditingFornecedor] = useState(null)
  const [toast, setToast] = useState(null)
  const { user } = require('../contexts/AuthContext').useAuth();

  useEffect(() => {
    fetchFornecedores()
  }, [search])

  const fetchFornecedores = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = search ? { search } : {}
      const { data } = await api.get('/fornecedores/', { params })
      setFornecedores(data.results || data || [])
    } catch (err) {
      console.error('Erro ao buscar fornecedores', err)
      setError('Erro ao carregar fornecedores. Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este fornecedor?')) return
    try {
      await api.delete(`/api/fornecedores/${id}/`)
      setToast({ message: 'Fornecedor removido com sucesso!', type: 'success' })
      fetchFornecedores()
    } catch (err) {
      setToast({ message: 'Erro ao remover fornecedor', type: 'error' })
    }
  }

  const handleEdit = (fornecedor) => {
    setEditingFornecedor(fornecedor)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingFornecedor(null)
    fetchFornecedores()
  }

  return (
    <div className="p-4 sm:p-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">🏭 Fornecedores</h2>
        
        {user?.role === 'admin' || user?.role === 'gerente' ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Novo Fornecedor
          </button>
        ) : null}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar por nome, CNPJ ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Carregando fornecedores..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchFornecedores} />
      ) : fornecedores.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">Nenhum fornecedor encontrado</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Cadastrar Primeiro Fornecedor
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="p-3 text-left">Nome/Razão Social</th>
                <th className="p-3 text-left hidden md:table-cell">CNPJ</th>
                <th className="p-3 text-left hidden sm:table-cell">Telefone</th>
                <th className="p-3 text-left hidden xl:table-cell">Email</th>
                <th className="p-3 text-center">Avaliação</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {fornecedores.map((f) => (
                <tr key={f.id} className="border-t hover:bg-blue-50 transition">
                  <td className="p-3 font-medium">
                    {f.nome}
                    {f.nome_fantasia && <span className="text-gray-500 text-sm block">{f.nome_fantasia}</span>}
                  </td>
                  <td className="p-3 hidden md:table-cell text-gray-600">{f.cnpj}</td>
                  <td className="p-3 hidden sm:table-cell text-gray-600">{f.telefone}</td>
                  <td className="p-3 hidden xl:table-cell text-gray-600">{f.email}</td>
                  <td className="p-3 text-center">
                    {f.avaliacao > 0 ? '⭐'.repeat(f.avaliacao) : '-'}
                  </td>
                  <td className="p-3 text-center">
                     <span className={`px-2 py-1 rounded text-xs ${f.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                       {f.status}
                     </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                       {user?.role === 'admin' || user?.role === 'gerente' ? (
                          <>
                            <button
                              onClick={() => handleEdit(f)}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(f.id)}
                              className="text-red-600 hover:text-red-800 hover:underline font-medium"
                            >
                              🗑️
                            </button>
                          </>
                       ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <FornecedorForm
          fornecedor={editingFornecedor}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}

function FornecedorForm({ fornecedor, onClose }) {
  const [formData, setFormData] = useState({
    nome: fornecedor?.nome || '',
    nome_fantasia: fornecedor?.nome_fantasia || '',
    cnpj: fornecedor?.cnpj || '',
    inscricao_estadual: fornecedor?.inscricao_estadual || '',
    email: fornecedor?.email || '',
    telefone: fornecedor?.telefone || '',
    celular: fornecedor?.celular || '',
    site: fornecedor?.site || '',
    contato_nome: fornecedor?.contato_nome || '',
    contato_cargo: fornecedor?.contato_cargo || '',
    endereco: fornecedor?.endereco || '',
    numero: fornecedor?.numero || '',
    complemento: fornecedor?.complemento || '',
    bairro: fornecedor?.bairro || '',
    cidade: fornecedor?.cidade || '',
    estado: fornecedor?.estado || '',
    cep: fornecedor?.cep || '',
    banco: fornecedor?.banco || '',
    agencia: fornecedor?.agencia || '',
    conta: fornecedor?.conta || '',
    pix: fornecedor?.pix || '',
    prazo_entrega_dias: fornecedor?.prazo_entrega_dias || 0,
    prazo_pagamento_dias: fornecedor?.prazo_pagamento_dias || 0,
    status: fornecedor?.status || 'ativo',
    avaliacao: fornecedor?.avaliacao || 0,
    observacoes: fornecedor?.observacoes || ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const validateCNPJ = (cnpj) => {
    return cnpj.replace(/\D/g, '').length === 14
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const newErrors = {}
    if (!formData.nome) newErrors.nome = 'Nome obrigatório'
    if (!formData.cnpj) {
      newErrors.cnpj = 'CNPJ obrigatório'
    } else if (!validateCNPJ(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido (14 dígitos)'
    }
    if (!formData.email) newErrors.email = 'Email obrigatório'
    if (!formData.telefone) newErrors.telefone = 'Telefone obrigatório'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      if (fornecedor) {
        await api.put(`/api/fornecedores/${fornecedor.id}/`, formData)
      } else {
        await api.post('/api/fornecedores/', formData)
      }
      onClose()
    } catch (err) {
      const apiErrors = err.response?.data || {}
      setErrors(apiErrors)
      alert('Erro ao salvar fornecedor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {fornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            
          {/* Dados Principais */}
          <div className="bg-gray-50 p-4 rounded text-sm mb-2">
            <h4 className="font-bold mb-2 text-gray-700">Dados Principais</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block mb-1 font-semibold">Razão Social *</label>
                   <input name="nome" value={formData.nome} onChange={handleChange} className="w-full p-2 border rounded" />
                   {errors.nome && <p className="text-red-600 text-xs">{errors.nome}</p>}
                </div>
                <div>
                   <label className="block mb-1 font-semibold">Nome Fantasia</label>
                   <input name="nome_fantasia" value={formData.nome_fantasia} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                   <label className="block mb-1 font-semibold">CNPJ *</label>
                   <input name="cnpj" value={formData.cnpj} onChange={handleChange} className="w-full p-2 border rounded" placeholder="00.000.000/0000-00" />
                   {errors.cnpj && <p className="text-red-600 text-xs">{errors.cnpj}</p>}
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">Inscrição Estadual</label>
                   <input name="inscricao_estadual" value={formData.inscricao_estadual} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
            </div>
          </div>

          {/* Contato */}
          <div className="bg-gray-50 p-4 rounded text-sm mb-2">
            <h4 className="font-bold mb-2 text-gray-700">Contato</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block mb-1 font-semibold">Email *</label>
                   <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
                   {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">Site</label>
                   <input name="site" value={formData.site} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">Telefone *</label>
                   <input name="telefone" value={formData.telefone} onChange={handleChange} className="w-full p-2 border rounded" />
                    {errors.telefone && <p className="text-red-600 text-xs">{errors.telefone}</p>}
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">Celular</label>
                   <input name="celular" value={formData.celular} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">Nome do Contato</label>
                   <input name="contato_nome" value={formData.contato_nome} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">Cargo do Contato</label>
                   <input name="contato_cargo" value={formData.contato_cargo} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-gray-50 p-4 rounded text-sm mb-2">
            <h4 className="font-bold mb-2 text-gray-700">Endereço</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="md:col-span-2">
                   <label className="block mb-1 font-semibold">Logradouro</label>
                   <input name="endereco" value={formData.endereco} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">Número</label>
                   <input name="numero" value={formData.numero} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">Bairro</label>
                   <input name="bairro" value={formData.bairro} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">Cidade</label>
                   <input name="cidade" value={formData.cidade} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">Estado (UF)</label>
                   <input name="estado" value={formData.estado} onChange={handleChange} maxLength={2} className="w-full p-2 border rounded" />
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">CEP</label>
                   <input name="cep" value={formData.cep} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                 <div className="md:col-span-2">
                   <label className="block mb-1 font-semibold">Complemento</label>
                   <input name="complemento" value={formData.complemento} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
            </div>
          </div>

          {/* Dados Bancários */}
           <div className="bg-gray-50 p-4 rounded text-sm mb-2">
            <h4 className="font-bold mb-2 text-gray-700">Dados Bancários</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div>
                   <label className="block mb-1 font-semibold">Banco</label>
                   <input name="banco" value={formData.banco} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">Agência</label>
                   <input name="agencia" value={formData.agencia} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">Conta</label>
                   <input name="conta" value={formData.conta} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">Chave PIX</label>
                   <input name="pix" value={formData.pix} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
            </div>
          </div>
          
           {/* Outros */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                   <label className="block mb-1 font-semibold">Status</label>
                   <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                       <option value="ativo">Ativo</option>
                       <option value="inativo">Inativo</option>
                       <option value="bloqueado">Bloqueado</option>
                   </select>
                </div>
                 <div>
                   <label className="block mb-1 font-semibold">Avaliação (0-5)</label>
                   <input name="avaliacao" type="number" min="0" max="5" value={formData.avaliacao} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
           </div>


          <div className="flex gap-2 pt-4 border-t">
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
