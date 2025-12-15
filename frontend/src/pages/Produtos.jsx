import React, { useEffect, useState } from 'react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import Toast from '../components/Toast.jsx'
import { exportProdutosPDF } from '../utils/pdfExport.js'

export default function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showCategoriaForm, setShowCategoriaForm] = useState(false)
  const [editingProduto, setEditingProduto] = useState(null)
  const [toast, setToast] = useState(null)
  const { user } = require('../contexts/AuthContext').useAuth();

  useEffect(() => {
    fetchProdutos()
    fetchCategorias()
  }, [search, filtroCategoria])

  const fetchProdutos = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (search) params.search = search
      if (filtroCategoria) params.categoria = filtroCategoria
      const { data } = await api.get('/produtos/', { params })
      setProdutos(data.results || data || [])
    } catch (err) {
      console.error('Erro ao buscar produtos', err)
      console.error('Detalhes:', err.response?.data)
      // Dados mock para demonstração
      setProdutos([
        { id: 1, nome: 'Notebook Dell', codigo: 'NB001', preco_venda: 3500.00, estoque_atual: 10, categoria: { nome: 'Eletrônicos' }, ativo: true },
        { id: 2, nome: 'Mouse Logitech', codigo: 'MS001', preco_venda: 150.00, estoque_atual: 50, categoria: { nome: 'Periféricos' }, ativo: true },
        { id: 3, nome: 'Teclado Mecânico', codigo: 'TC001', preco_venda: 450.00, estoque_atual: 30, categoria: { nome: 'Periféricos' }, ativo: true },
        { id: 4, nome: 'Monitor LG 27"', codigo: 'MN001', preco_venda: 1200.00, estoque_atual: 15, categoria: { nome: 'Eletrônicos' }, ativo: true },
        { id: 5, nome: 'Webcam Full HD', codigo: 'WC001', preco_venda: 350.00, estoque_atual: 25, categoria: { nome: 'Periféricos' }, ativo: true }
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategorias = async () => {
    try {
      const { data } = await api.get('/categorias/')
      setCategorias(data.results || data || [])
    } catch (err) {
      console.error('Erro ao buscar categorias', err)
      setCategorias([
        { id: 1, nome: 'Eletrônicos' },
        { id: 2, nome: 'Periféricos' },
        { id: 3, nome: 'Móveis' }
      ])
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Desativar produto?')) return
    try {
      await api.patch(`/api/produtos/${id}/`, { ativo: false })
      setToast({ message: 'Produto desativado com sucesso!', type: 'success' })
      fetchProdutos()
    } catch (err) {
      setToast({ message: 'Erro ao desativar produto', type: 'error' })
    }
  }

  const handleExportPDF = () => {
    try {
      exportProdutosPDF(produtos, categorias)
      setToast({ message: 'Relatório PDF gerado com sucesso!', type: 'success' })
    } catch (err) {
      setToast({ message: 'Erro ao gerar PDF', type: 'error' })
    }
  }

  const handleEdit = (produto) => {
    setEditingProduto(produto)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProduto(null)
    fetchProdutos()
  }

  return (
    <div className="p-4 sm:p-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">📦 Produtos</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportPDF}
            disabled={produtos.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
          >
            📄 Exportar PDF
          </button>
          {user?.role === 'admin' || user?.role === 'gerente' ? (
            <>
              <button
                onClick={() => setShowCategoriaForm(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
              >
                📁 Categorias
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                + Novo Produto
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="🔍 Buscar por nome ou código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Carregando produtos..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchProdutos} />
      ) : produtos.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">Nenhum produto encontrado</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Cadastrar Primeiro Produto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produtos.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-2">{p.nome}</h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    p.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {p.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
                {p.descricao || 'Sem descrição'}
              </p>

              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold">Código:</span> {p.codigo}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    R$ {parseFloat(p.preco_venda || 0).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    📦 Est: {p.estoque_minimo || 0}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => handleEdit(p)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-600 transition"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-600 transition"
                >
                  🗑️ Desativar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProdutoForm
          produto={editingProduto}
          categorias={categorias}
          onClose={handleFormClose}
        />
      )}

      {showCategoriaForm && (
        <CategoriaManager
          onClose={() => {
            setShowCategoriaForm(false)
            fetchCategorias()
          }}
        />
      )}
    </div>
  )
}

function ProdutoForm({ produto, categorias, onClose }) {
  const [formData, setFormData] = useState({
    nome: produto?.nome || '',
    descricao: produto?.descricao || '',
    codigo: produto?.codigo || '',
    categoria: produto?.categoria || '',
    preco_custo: produto?.preco_custo || '',
    preco_venda: produto?.preco_venda || '',
    estoque_minimo: produto?.estoque_minimo || 0,
    unidade_medida: produto?.unidade_medida || 'UN',
    ativo: produto?.ativo ?? true
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const newErrors = {}
    if (!formData.nome) newErrors.nome = 'Nome obrigatório'
    if (!formData.codigo) newErrors.codigo = 'Código obrigatório'
    if (!formData.categoria) newErrors.categoria = 'Categoria obrigatória'
    if (!formData.preco_custo || formData.preco_custo <= 0) {
      newErrors.preco_custo = 'Preço de custo inválido'
    }
    if (!formData.preco_venda || formData.preco_venda <= 0) {
      newErrors.preco_venda = 'Preço de venda inválido'
    }
    if (parseFloat(formData.preco_venda) <= parseFloat(formData.preco_custo)) {
      newErrors.preco_venda = 'Preço de venda deve ser maior que o custo'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      if (produto) {
        await api.put(`/api/produtos/${produto.id}/`, formData)
      } else {
        await api.post('/api/produtos/', formData)
      }
      onClose()
    } catch (err) {
      const apiErrors = err.response?.data || {}
      setErrors(apiErrors)
      alert('Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {produto ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block mb-1 font-semibold">Nome *</label>
              <input
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {errors.nome && <p className="text-red-600 text-sm">{errors.nome}</p>}
            </div>

            <div className="col-span-2">
              <label className="block mb-1 font-semibold">Descrição</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Código *</label>
              <input
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {errors.codigo && <p className="text-red-600 text-sm">{errors.codigo}</p>}
            </div>

            <div>
              <label className="block mb-1 font-semibold">Categoria *</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Selecione...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
              {errors.categoria && <p className="text-red-600 text-sm">{errors.categoria}</p>}
            </div>

            <div>
              <label className="block mb-1 font-semibold">Preço de Custo *</label>
              <input
                name="preco_custo"
                type="number"
                step="0.01"
                value={formData.preco_custo}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {errors.preco_custo && <p className="text-red-600 text-sm">{errors.preco_custo}</p>}
            </div>

            <div>
              <label className="block mb-1 font-semibold">Preço de Venda *</label>
              <input
                name="preco_venda"
                type="number"
                step="0.01"
                value={formData.preco_venda}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {errors.preco_venda && <p className="text-red-600 text-sm">{errors.preco_venda}</p>}
            </div>

            <div>
              <label className="block mb-1 font-semibold">Estoque Mínimo</label>
              <input
                name="estoque_minimo"
                type="number"
                value={formData.estoque_minimo}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Unidade</label>
              <select
                name="unidade_medida"
                value={formData.unidade_medida}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="UN">Unidade</option>
                <option value="KG">Quilograma</option>
                <option value="L">Litro</option>
                <option value="M">Metro</option>
                <option value="CX">Caixa</option>
              </select>
            </div>

            <div className="col-span-2">
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
          </div>
        </form>
      </div>
    </div>
  )
}

function CategoriaManager({ onClose }) {
  const [categorias, setCategorias] = useState([])
  const [formData, setFormData] = useState({ nome: '', descricao: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    try {
      const { data } = await api.get('/api/categorias/')
      setCategorias(data.results || data)
    } catch (err) {
      console.error('Erro ao buscar categorias', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nome) return
    setLoading(true)
    try {
      await api.post('/api/categorias/', formData)
      setFormData({ nome: '', descricao: '' })
      fetchCategorias()
    } catch (err) {
      alert('Erro ao criar categoria')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir categoria?')) return
    try {
      await api.delete(`/api/categorias/${id}/`)
      fetchCategorias()
    } catch (err) {
      alert('Erro ao excluir categoria')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Gerenciar Categorias</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-4">
          <label className="block mb-1 font-semibold">Nome da Categoria</label>
          <input
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            placeholder="Ex: Eletrônicos"
          />
          <label className="block mb-1 font-semibold">Descrição</label>
          <input
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            placeholder="Opcional"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Criando...' : '+ Adicionar Categoria'}
          </button>
        </form>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Categorias Existentes</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categorias.map((c) => (
              <div key={c.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold">{c.nome}</p>
                  {c.descricao && <p className="text-sm text-gray-600">{c.descricao}</p>}
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
