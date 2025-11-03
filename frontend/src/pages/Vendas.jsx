import React, { useEffect, useState } from 'react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import Toast from '../components/Toast'
import { exportVendasPDF } from '../utils/pdfExport'

export default function Vendas() {
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCarrinho, setShowCarrinho] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchPedidos()
    fetchClientes()
    fetchProdutos()
  }, [filtroStatus])

  const fetchPedidos = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (filtroStatus) params.status = filtroStatus
      const { data } = await api.get('/api/pedidos/', { params })
      setPedidos(data.results || data)
    } catch (err) {
      console.error('Erro ao buscar pedidos', err)
      setError('Não foi possível carregar os pedidos.')
    } finally {
      setLoading(false)
    }
  }

  const fetchClientes = async () => {
    try {
      const { data } = await api.get('/api/clientes/')
      setClientes(data.results || data)
    } catch (err) {
      console.error('Erro ao buscar clientes', err)
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

  const handleExportPDF = () => {
    try {
      exportVendasPDF(pedidos, clientes, produtos)
      setToast({ message: 'Relatório PDF gerado com sucesso!', type: 'success' })
    } catch (err) {
      setToast({ message: 'Erro ao gerar PDF', type: 'error' })
    }
  }

  const handleCancelar = async (id) => {
    if (!window.confirm('Cancelar pedido?')) return
    try {
      await api.patch(`/api/pedidos/${id}/`, { status: 'cancelado' })
      fetchPedidos()
    } catch (err) {
      alert('Erro ao cancelar pedido')
    }
  }

  const handleFinalizar = async (id) => {
    if (!window.confirm('Finalizar pedido?')) return
    try {
      await api.patch(`/api/pedidos/${id}/`, { status: 'finalizado' })
      fetchPedidos()
    } catch (err) {
      alert('Erro ao finalizar pedido')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pendente: 'bg-yellow-100 text-yellow-800',
      processando: 'bg-blue-100 text-blue-800',
      finalizado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    }
    return `px-2 py-1 text-xs rounded ${badges[status] || 'bg-gray-100 text-gray-800'}`
  }

  return (
    <div className="p-4 sm:p-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">💰 Vendas / Pedidos</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            disabled={pedidos.length === 0}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
          >
            📄 Exportar PDF
          </button>
          <button
            onClick={() => setShowCarrinho(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            🛒 Novo Pedido
          </button>
        </div>
      </div>

      <div className="mb-6">
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="processando">Processando</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Carregando vendas..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchPedidos} />
      ) : pedidos.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">Nenhum pedido encontrado</p>
          <button
            onClick={() => setShowCarrinho(true)}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Criar Primeiro Pedido
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((p) => (
            <div key={p.id} className="bg-white rounded shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">Pedido #{p.id}</h3>
                  <p className="text-sm text-gray-600">Cliente: {p.cliente_nome || 'N/A'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(p.data_pedido).toLocaleString('pt-BR')}
                  </p>
                </div>
                <span className={getStatusBadge(p.status)}>
                  {p.status?.toUpperCase()}
                </span>
              </div>

              <div className="border-t pt-3 mb-3">
                <h4 className="font-semibold mb-2">Itens:</h4>
                {p.itens?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm mb-1">
                    <span>
                      {item.produto_nome} (x{item.quantidade})
                    </span>
                    <span className="font-semibold">
                      R$ {parseFloat(item.preco_unitario * item.quantidade).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <div className="text-xl font-bold text-green-600">
                  Total: R$ {parseFloat(p.valor_total).toFixed(2)}
                </div>
                <div className="flex gap-2">
                  {p.status === 'pendente' && (
                    <>
                      <button
                        onClick={() => handleFinalizar(p.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        ✓ Finalizar
                      </button>
                      <button
                        onClick={() => handleCancelar(p.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        ✗ Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCarrinho && (
        <CarrinhoModal
          onClose={() => {
            setShowCarrinho(false)
            fetchPedidos()
          }}
        />
      )}
    </div>
  )
}

function CarrinhoModal({ onClose }) {
  const [clientes, setClientes] = useState([])
  const [produtos, setProdutos] = useState([])
  const [carrinho, setCarrinho] = useState([])
  const [clienteSelecionado, setClienteSelecionado] = useState('')
  const [produtoSelecionado, setProdutoSelecionado] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClientes()
    fetchProdutos()
  }, [])

  const fetchClientes = async () => {
    try {
      const { data } = await api.get('/api/clientes/?ativo=true')
      setClientes(data.results || data)
    } catch (err) {
      console.error('Erro ao buscar clientes', err)
    }
  }

  const fetchProdutos = async () => {
    try {
      const { data } = await api.get('/api/produtos/?ativo=true')
      setProdutos(data.results || data)
    } catch (err) {
      console.error('Erro ao buscar produtos', err)
    }
  }

  const adicionarAoCarrinho = () => {
    if (!produtoSelecionado || quantidade <= 0) return
    
    const produto = produtos.find(p => p.id === parseInt(produtoSelecionado))
    if (!produto) return

    const itemExistente = carrinho.find(item => item.produto === produto.id)
    
    if (itemExistente) {
      setCarrinho(carrinho.map(item => 
        item.produto === produto.id 
          ? { ...item, quantidade: item.quantidade + quantidade }
          : item
      ))
    } else {
      setCarrinho([...carrinho, {
        produto: produto.id,
        produto_nome: produto.nome,
        quantidade: quantidade,
        preco_unitario: parseFloat(produto.preco_venda)
      }])
    }

    setProdutoSelecionado('')
    setQuantidade(1)
  }

  const removerDoCarrinho = (produtoId) => {
    setCarrinho(carrinho.filter(item => item.produto !== produtoId))
  }

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => 
      total + (item.preco_unitario * item.quantidade), 0
    )
  }

  const finalizarPedido = async () => {
    if (!clienteSelecionado) {
      alert('Selecione um cliente')
      return
    }
    if (carrinho.length === 0) {
      alert('Adicione ao menos um produto')
      return
    }

    setLoading(true)
    try {
      await api.post('/api/pedidos/', {
        cliente: parseInt(clienteSelecionado),
        itens: carrinho.map(item => ({
          produto: item.produto,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario
        }))
      })
      alert('Pedido criado com sucesso!')
      onClose()
    } catch (err) {
      console.error('Erro ao criar pedido', err)
      alert('Erro ao criar pedido: ' + (err.response?.data?.detail || 'Erro desconhecido'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">🛒 Novo Pedido</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-semibold">Cliente *</label>
          <select
            value={clienteSelecionado}
            onChange={(e) => setClienteSelecionado(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione um cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h4 className="font-semibold mb-3">Adicionar Produto</h4>
          <div className="flex gap-2">
            <select
              value={produtoSelecionado}
              onChange={(e) => setProdutoSelecionado(e.target.value)}
              className="flex-1 p-2 border rounded"
            >
              <option value="">Selecione um produto</option>
              {produtos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome} - R$ {parseFloat(p.preco_venda).toFixed(2)}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
              className="w-24 p-2 border rounded"
              placeholder="Qtd"
            />
            <button
              onClick={adicionarAoCarrinho}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Adicionar
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-3">Carrinho ({carrinho.length} itens)</h4>
          {carrinho.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhum item no carrinho</p>
          ) : (
            <div className="space-y-2">
              {carrinho.map((item) => (
                <div key={item.produto} className="flex justify-between items-center p-3 bg-white border rounded">
                  <div>
                    <p className="font-semibold">{item.produto_nome}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantidade}x R$ {item.preco_unitario.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-600">
                      R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removerDoCarrinho(item.produto)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between items-center text-2xl font-bold">
            <span>Total:</span>
            <span className="text-green-600">R$ {calcularTotal().toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={finalizarPedido}
            disabled={loading || carrinho.length === 0 || !clienteSelecionado}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:bg-gray-400 font-semibold"
          >
            {loading ? 'Processando...' : '✓ Finalizar Pedido'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
