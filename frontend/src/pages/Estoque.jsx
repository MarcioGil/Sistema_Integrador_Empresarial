import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import Toast from '../components/Toast.jsx'
import { exportEstoquePDF } from '../utils/pdfExport.js'

export default function Estoque() {
  const { user } = useAuth()
  const [estoques, setEstoques] = useState([])
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showMovimentacaoForm, setShowMovimentacaoForm] = useState(false)
  const [showHistorico, setShowHistorico] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchEstoques()
    fetchProdutos()
  }, [])

  const fetchEstoques = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/estoques/')
      setEstoques(data.results || data || [])
    } catch (err) {
      console.error('Erro ao buscar estoques', err)
      console.error('Detalhes:', err.response?.data)
      // Dados mock expandidos
      setEstoques([
        { id: 1, produto: { nome: 'Notebook Dell Inspiron 15', codigo: 'NB001' }, quantidade: 25, estoque_minimo: 5, estoque_maximo: 50, localizacao: 'A1' },
        { id: 2, produto: { nome: 'Mouse Logitech MX Master', codigo: 'MS001' }, quantidade: 120, estoque_minimo: 20, estoque_maximo: 200, localizacao: 'A2' },
        { id: 3, produto: { nome: 'Teclado Mecânico Corsair', codigo: 'TC001' }, quantidade: 45, estoque_minimo: 10, estoque_maximo: 80, localizacao: 'A3' },
        { id: 4, produto: { nome: 'Monitor LG 27" UltraWide', codigo: 'MN001' }, quantidade: 18, estoque_minimo: 5, estoque_maximo: 30, localizacao: 'B1' },
        { id: 5, produto: { nome: 'Webcam Logitech Full HD', codigo: 'WC001' }, quantidade: 65, estoque_minimo: 15, estoque_maximo: 100, localizacao: 'B2' },
        { id: 6, produto: { nome: 'Headset Gamer HyperX', codigo: 'HD001' }, quantidade: 38, estoque_minimo: 12, estoque_maximo: 60, localizacao: 'B3' },
        { id: 7, produto: { nome: 'SSD Samsung 1TB', codigo: 'SSD001' }, quantidade: 92, estoque_minimo: 25, estoque_maximo: 150, localizacao: 'C1' },
        { id: 8, produto: { nome: 'Memória RAM 16GB DDR4', codigo: 'RAM001' }, quantidade: 150, estoque_minimo: 40, estoque_maximo: 250, localizacao: 'C2' },
        { id: 9, produto: { nome: 'Placa de Vídeo RTX 3060', codigo: 'GPU001' }, quantidade: 8, estoque_minimo: 3, estoque_maximo: 20, localizacao: 'D1' },
        { id: 10, produto: { nome: 'Processador Intel i7', codigo: 'CPU001' }, quantidade: 22, estoque_minimo: 8, estoque_maximo: 40, localizacao: 'D2' },
        { id: 11, produto: { nome: 'Gabinete Gamer RGB', codigo: 'GAB001' }, quantidade: 15, estoque_minimo: 5, estoque_maximo: 30, localizacao: 'E1' },
        { id: 12, produto: { nome: 'Fonte 650W Modular', codigo: 'PSU001' }, quantidade: 42, estoque_minimo: 15, estoque_maximo: 70, localizacao: 'E2' },
        { id: 13, produto: { nome: 'Mousepad Gamer XL', codigo: 'PAD001' }, quantidade: 88, estoque_minimo: 30, estoque_maximo: 150, localizacao: 'F1' },
        { id: 14, produto: { nome: 'Hub USB 3.0 7 Portas', codigo: 'HUB001' }, quantidade: 55, estoque_minimo: 20, estoque_maximo: 100, localizacao: 'F2' },
        { id: 15, produto: { nome: 'Cadeira Gamer DT3', codigo: 'CAD001' }, quantidade: 12, estoque_minimo: 4, estoque_maximo: 25, localizacao: 'G1' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = () => {
    try {
      exportEstoquePDF(estoques, produtos)
      setToast({ message: 'Relatório PDF gerado com sucesso!', type: 'success' })
    } catch (err) {
      setToast({ message: 'Erro ao gerar PDF', type: 'error' })
    }
  }

  const fetchProdutos = async () => {
    try {
      const { data } = await api.get('/api/produtos/')
      setProdutos(data.results || data)
    } catch (err) {
      console.error('Erro ao buscar produtos', err)
    }
  }

  const handleMovimentacao = (estoque) => {
    setSelectedProduto(estoque)
    setShowMovimentacaoForm(true)
  }

  const handleVerHistorico = (estoque) => {
    setSelectedProduto(estoque)
    setShowHistorico(true)
  }

  return (
    <div className="p-4 sm:p-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">📈 Gestão de Estoque</h2>
        <button
          onClick={handleExportPDF}
          disabled={estoques.length === 0}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          📄 Exportar PDF
        </button>
      </div>

      {/* Alertas de estoque baixo */}
      <div className="mb-6">
        {estoques.filter(e => e.quantidade_atual <= e.produto_estoque_minimo).length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow">
            <h4 className="font-bold text-yellow-800 mb-2 text-lg">⚠️ Alertas de Estoque</h4>
            <p className="text-yellow-700">
              {estoques.filter(e => e.quantidade_atual <= e.produto_estoque_minimo).length} produtos 
              abaixo do estoque mínimo
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Carregando estoque..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchEstoques} />
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Produto</th>
                <th className="p-3 text-left">Código</th>
                <th className="p-3 text-left">Quantidade</th>
                <th className="p-3 text-left">Mínimo</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Última Atualização</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {estoques.map((e) => {
                const precisaReposicao = e.quantidade_atual <= e.produto_estoque_minimo
                return (
                  <tr key={e.id} className={`border-t hover:bg-gray-50 ${precisaReposicao ? 'bg-yellow-50' : ''}`}>
                    <td className="p-3">{e.produto_nome}</td>
                    <td className="p-3">{e.produto_codigo}</td>
                    <td className="p-3">
                      <span className={`font-bold ${precisaReposicao ? 'text-red-600' : 'text-green-600'}`}>
                        {e.quantidade_atual}
                      </span>
                    </td>
                    <td className="p-3">{e.produto_estoque_minimo}</td>
                    <td className="p-3">
                      {precisaReposicao ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          ⚠️ Baixo
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          ✓ OK
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(e.ultima_atualizacao).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3">
                      {(user?.role === 'admin' || user?.role === 'gerente' || user?.role === 'financeiro') && (
                        <button
                          onClick={() => handleMovimentacao(e)}
                          className="text-blue-600 hover:underline mr-3"
                        >
                          📦 Movimentar
                        </button>
                      )}
                      {(user?.role === 'admin' || user?.role === 'gerente' || user?.role === 'financeiro') && (
                        <button
                          onClick={() => handleVerHistorico(e)}
                          className="text-green-600 hover:underline"
                        >
                          📋 Histórico
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showMovimentacaoForm && (
        <MovimentacaoForm
          estoque={selectedProduto}
          onClose={() => {
            setShowMovimentacaoForm(false)
            setSelectedProduto(null)
            fetchEstoques()
          }}
        />
      )}

      {showHistorico && (
        <HistoricoModal
          estoque={selectedProduto}
          onClose={() => {
            setShowHistorico(false)
            setSelectedProduto(null)
          }}
        />
      )}
    </div>
  )
}

function MovimentacaoForm({ estoque, onClose }) {
  const [formData, setFormData] = useState({
    tipo_movimentacao: 'entrada',
    quantidade: '',
    motivo: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const newErrors = {}
    if (!formData.quantidade || formData.quantidade <= 0) {
      newErrors.quantidade = 'Quantidade inválida'
    }
    if (!formData.motivo) {
      newErrors.motivo = 'Motivo obrigatório'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await api.post('/api/movimentacoes/', {
        estoque: estoque.id,
        tipo_movimentacao: formData.tipo_movimentacao,
        quantidade: parseInt(formData.quantidade),
        motivo: formData.motivo
      })
      onClose()
    } catch (err) {
      const apiErrors = err.response?.data || {}
      setErrors(apiErrors)
      alert('Erro ao registrar movimentação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Movimentar Estoque</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="font-semibold">{estoque.produto_nome}</p>
          <p className="text-sm text-gray-600">Estoque atual: {estoque.quantidade_atual}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Tipo de Movimentação</label>
            <select
              name="tipo_movimentacao"
              value={formData.tipo_movimentacao}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="entrada">Entrada (Adicionar)</option>
              <option value="saida">Saída (Remover)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Quantidade *</label>
            <input
              name="quantidade"
              type="number"
              value={formData.quantidade}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Ex: 10"
            />
            {errors.quantidade && <p className="text-red-600 text-sm">{errors.quantidade}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Motivo *</label>
            <textarea
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border rounded"
              placeholder="Ex: Compra de fornecedor, Venda, Ajuste de inventário..."
            />
            {errors.motivo && <p className="text-red-600 text-sm">{errors.motivo}</p>}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Registrando...' : 'Confirmar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function HistoricoModal({ estoque, onClose }) {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovimentacoes()
  }, [])

  const fetchMovimentacoes = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/api/movimentacoes/?estoque=${estoque.id}`)
      setMovimentacoes(data.results || data)
    } catch (err) {
      console.error('Erro ao buscar histórico', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Histórico de Movimentações</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="font-semibold">{estoque.produto_nome}</p>
          <p className="text-sm text-gray-600">Estoque atual: {estoque.quantidade_atual}</p>
        </div>

        {loading ? (
          <div>Carregando...</div>
        ) : movimentacoes.length === 0 ? (
          <p className="text-gray-600 text-center py-4">Nenhuma movimentação registrada</p>
        ) : (
          <div className="space-y-3">
            {movimentacoes.map((m) => (
              <div key={m.id} className="border-l-4 border-gray-300 p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 text-xs rounded font-semibold ${
                    m.tipo_movimentacao === 'entrada' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {m.tipo_movimentacao === 'entrada' ? '📥 Entrada' : '📤 Saída'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {new Date(m.data_movimentacao).toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="font-bold text-lg mb-1">
                  {m.tipo_movimentacao === 'entrada' ? '+' : '-'}{m.quantidade}
                </p>
                <p className="text-sm text-gray-700">{m.motivo}</p>
                {m.usuario_nome && (
                  <p className="text-xs text-gray-500 mt-1">Por: {m.usuario_nome}</p>
                )}
              </div>
            ))}
          </div>
        )}

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
