import React, { useEffect, useState } from 'react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import Toast from '../components/Toast.jsx'
import { exportFinanceiroPDF } from '../utils/pdfExport.js'

export default function Financeiro() {
  const [aba, setAba] = useState('receber') // 'receber' ou 'pagar'
  const [contas, setContas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroStatus, setFiltroStatus] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showPagamentoForm, setShowPagamentoForm] = useState(false)
  const [selectedConta, setSelectedConta] = useState(null)
  const [resumo, setResumo] = useState({ pendente: 0, pago: 0, vencido: 0 })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchContas()
  }, [aba, filtroStatus])

  const fetchContas = async () => {
    setLoading(true)
    setError(null)
    try {
      const endpoint = aba === 'receber' ? '/contas-receber/' : '/contas-pagar/'
      const params = {}
      if (filtroStatus) params.status = filtroStatus
      const { data } = await api.get(endpoint, { params })
      const contasList = data.results || data || []
      setContas(contasList)
      
      // Calcular resumo
      const hoje = new Date()
      const pendente = contasList.filter(c => c.status === 'pendente').reduce((sum, c) => sum + parseFloat(c.valor), 0)
      const pago = contasList.filter(c => c.status === 'pago').reduce((sum, c) => sum + parseFloat(c.valor), 0)
      const vencido = contasList.filter(c => c.status === 'pendente' && new Date(c.data_vencimento) < hoje).reduce((sum, c) => sum + parseFloat(c.valor), 0)
      setResumo({ pendente, pago, vencido })
    } catch (err) {
      console.error('Erro ao buscar contas', err)
      console.error('Detalhes:', err.response?.data)
      // Dados mock expandidos
      const mockContas = aba === 'receber' ? [
        { id: 1, descricao: 'Venda PED-001 - João Silva', valor: 3500.00, data_vencimento: '2025-11-15', status: 'pendente', cliente: { nome: 'João Silva' } },
        { id: 2, descricao: 'Venda PED-002 - Maria Santos', valor: 150.00, data_vencimento: '2025-10-28', status: 'pago', cliente: { nome: 'Maria Santos' }, data_pagamento: '2025-10-27' },
        { id: 3, descricao: 'Venda PED-003 - Empresa ABC', valor: 5200.00, data_vencimento: '2025-11-20', status: 'pendente', cliente: { nome: 'Empresa ABC Ltda' } },
        { id: 4, descricao: 'Venda PED-004 - Carlos Oliveira', valor: 1200.00, data_vencimento: '2025-11-05', status: 'pago', cliente: { nome: 'Carlos Oliveira' }, data_pagamento: '2025-11-04' },
        { id: 5, descricao: 'Venda PED-005 - Ana Costa', valor: 850.00, data_vencimento: '2025-11-08', status: 'pago', cliente: { nome: 'Ana Costa' }, data_pagamento: '2025-11-07' },
        { id: 6, descricao: 'Venda PED-006 - Tech Solutions', valor: 12500.00, data_vencimento: '2025-11-25', status: 'pendente', cliente: { nome: 'Tech Solutions SA' } },
        { id: 7, descricao: 'Venda PED-007 - Pedro Mendes', valor: 2800.00, data_vencimento: '2025-11-12', status: 'pendente', cliente: { nome: 'Pedro Mendes' } },
        { id: 8, descricao: 'Venda PED-008 - Loja InfoTech', valor: 7800.00, data_vencimento: '2025-11-18', status: 'pendente', cliente: { nome: 'Loja InfoTech' } },
        { id: 9, descricao: 'Venda PED-009 - Juliana Ferreira', valor: 450.00, data_vencimento: '2025-10-30', status: 'pago', cliente: { nome: 'Juliana Ferreira' }, data_pagamento: '2025-10-29' },
        { id: 10, descricao: 'Venda PED-010 - Rafael Santos', valor: 3200.00, data_vencimento: '2025-11-10', status: 'pendente', cliente: { nome: 'Rafael Santos' } }
      ] : [
        { id: 1, descricao: 'Fornecedor Materiais Eletrônicos', valor: 2500.00, data_vencimento: '2025-11-10', status: 'pendente', fornecedor: { nome: 'Tech Supply Ltda' } },
        { id: 2, descricao: 'Aluguel Escritório - Novembro', valor: 4000.00, data_vencimento: '2025-11-05', status: 'pago', fornecedor: { nome: 'Imobiliária ABC' }, data_pagamento: '2025-11-03' },
        { id: 3, descricao: 'Fornecedor Periféricos', valor: 5800.00, data_vencimento: '2025-11-15', status: 'pendente', fornecedor: { nome: 'Distribuidora XYZ' } },
        { id: 4, descricao: 'Conta de Energia - Outubro', valor: 1250.00, data_vencimento: '2025-11-08', status: 'pago', fornecedor: { nome: 'Eletropaulo' }, data_pagamento: '2025-11-07' },
        { id: 5, descricao: 'Internet Empresarial', valor: 890.00, data_vencimento: '2025-11-12', status: 'pendente', fornecedor: { nome: 'Vivo Empresas' } },
        { id: 6, descricao: 'Fornecedor Componentes', valor: 8900.00, data_vencimento: '2025-11-20', status: 'pendente', fornecedor: { nome: 'Global Parts SA' } },
        { id: 7, descricao: 'Salários - Outubro', valor: 15000.00, data_vencimento: '2025-11-05', status: 'pago', fornecedor: { nome: 'Folha de Pagamento' }, data_pagamento: '2025-11-05' },
        { id: 8, descricao: 'Manutenção Equipamentos', valor: 1800.00, data_vencimento: '2025-11-18', status: 'pendente', fornecedor: { nome: 'TechFix Assistência' } }
      ]
      setContas(mockContas)
      
      const hoje = new Date()
      const pendente = mockContas.filter(c => c.status === 'pendente').reduce((sum, c) => sum + parseFloat(c.valor), 0)
      const pago = mockContas.filter(c => c.status === 'pago').reduce((sum, c) => sum + parseFloat(c.valor), 0)
      const vencido = mockContas.filter(c => c.status === 'pendente' && new Date(c.data_vencimento) < hoje).reduce((sum, c) => sum + parseFloat(c.valor), 0)
      setResumo({ pendente, pago, vencido })
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = () => {
    try {
      exportFinanceiroPDF(contas)
      setToast({ message: 'Relatório PDF gerado com sucesso!', type: 'success' })
    } catch (err) {
      setToast({ message: 'Erro ao gerar PDF', type: 'error' })
    }
  }

  const handleRegistrarPagamento = (conta) => {
    setSelectedConta(conta)
    setShowPagamentoForm(true)
  }

  const isVencida = (dataVencimento, status) => {
    return status === 'pendente' && new Date(dataVencimento) < new Date()
  }

  return (
    <div className="p-4 sm:p-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">💳 Financeiro</h2>
        <button
          onClick={handleExportPDF}
          disabled={contas.length === 0}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          📄 Exportar PDF
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow">
          <p className="text-yellow-800 font-semibold">💰 Pendente</p>
          <p className="text-2xl font-bold text-yellow-900">R$ {resumo.pendente.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow">
          <p className="text-green-800 font-semibold">✓ Pago</p>
          <p className="text-2xl font-bold text-green-900">R$ {resumo.pago.toFixed(2)}</p>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
          <p className="text-red-800 font-semibold">⚠️ Vencido</p>
          <p className="text-2xl font-bold text-red-900">R$ {resumo.vencido.toFixed(2)}</p>
        </div>
      </div>

      {/* Abas */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setAba('receber')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            aba === 'receber' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📥 Contas a Receber
        </button>
        <button
          onClick={() => setAba('pagar')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            aba === 'pagar' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📤 Contas a Pagar
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="pago">Pago</option>
          <option value="cancelado">Cancelado</option>
        </select>
        {user?.role === 'admin' || user?.role === 'financeiro' || user?.role === 'gerente' ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Nova Conta
          </button>
        ) : null}
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Descrição</th>
                <th className="p-3 text-left">{aba === 'receber' ? 'Cliente' : 'Fornecedor'}</th>
                <th className="p-3 text-left">Vencimento</th>
                <th className="p-3 text-left">Valor</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contas.map((c) => {
                const vencida = isVencida(c.data_vencimento, c.status)
                return (
                  <tr key={c.id} className={`border-t hover:bg-gray-50 ${vencida ? 'bg-red-50' : ''}`}>
                    <td className="p-3">{c.descricao}</td>
                    <td className="p-3">{c.cliente_nome || c.fornecedor_nome || '-'}</td>
                    <td className="p-3">
                      {new Date(c.data_vencimento).toLocaleDateString('pt-BR')}
                      {vencida && <span className="ml-2 text-red-600 font-semibold">⚠️ VENCIDA</span>}
                    </td>
                    <td className="p-3 font-bold">R$ {parseFloat(c.valor).toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        c.status === 'pago' ? 'bg-green-100 text-green-800' :
                        c.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {c.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      {c.status === 'pendente' && (user?.role === 'admin' || user?.role === 'financeiro' || user?.role === 'gerente') && (
                        <button
                          onClick={() => handleRegistrarPagamento(c)}
                          className="text-green-600 hover:underline"
                        >
                          💳 Registrar Pagamento
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

      {showForm && (
        <ContaForm
          tipo={aba}
          onClose={() => {
            setShowForm(false)
            fetchContas()
          }}
        />
      )}

      {showPagamentoForm && selectedConta && (
        <PagamentoForm
          conta={selectedConta}
          tipo={aba}
          onClose={() => {
            setShowPagamentoForm(false)
            setSelectedConta(null)
            fetchContas()
          }}
        />
      )}
    </div>
  )
}

function ContaForm({ tipo, onClose }) {
  const [clientes, setClientes] = useState([])
  const [fornecedores, setFornecedores] = useState([])
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data_vencimento: '',
    cliente: '',
    fornecedor: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (tipo === 'receber') {
      fetchClientes()
    } else {
      fetchFornecedores()
    }
  }, [tipo])

  const fetchClientes = async () => {
    try {
      const { data } = await api.get('/api/clientes/?ativo=true')
      setClientes(data.results || data)
    } catch (err) {
      console.error('Erro ao buscar clientes', err)
    }
  }

  const fetchFornecedores = async () => {
    try {
      const { data } = await api.get('/api/fornecedores/?ativo=true')
      setFornecedores(data.results || data)
    } catch (err) {
      console.error('Erro ao buscar fornecedores', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const newErrors = {}
    if (!formData.descricao) newErrors.descricao = 'Descrição obrigatória'
    if (!formData.valor || formData.valor <= 0) newErrors.valor = 'Valor inválido'
    if (!formData.data_vencimento) newErrors.data_vencimento = 'Data obrigatória'
    if (tipo === 'receber' && !formData.cliente) newErrors.cliente = 'Cliente obrigatório'
    if (tipo === 'pagar' && !formData.fornecedor) newErrors.fornecedor = 'Fornecedor obrigatório'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const endpoint = tipo === 'receber' ? '/api/contas-receber/' : '/api/contas-pagar/'
      await api.post(endpoint, formData)
      onClose()
    } catch (err) {
      const apiErrors = err.response?.data || {}
      setErrors(apiErrors)
      alert('Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            Nova Conta a {tipo === 'receber' ? 'Receber' : 'Pagar'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Descrição *</label>
              <input
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Ex: Venda #123, Aluguel, Fornecedor XYZ..."
              />
              {errors.descricao && <p className="text-red-600 text-sm">{errors.descricao}</p>}
            </div>

            <div>
              <label className="block mb-1 font-semibold">Valor *</label>
              <input
                name="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {errors.valor && <p className="text-red-600 text-sm">{errors.valor}</p>}
            </div>

            <div>
              <label className="block mb-1 font-semibold">Data de Vencimento *</label>
              <input
                name="data_vencimento"
                type="date"
                value={formData.data_vencimento}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {errors.data_vencimento && <p className="text-red-600 text-sm">{errors.data_vencimento}</p>}
            </div>

            {tipo === 'receber' ? (
              <div>
                <label className="block mb-1 font-semibold">Cliente *</label>
                <select
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Selecione...</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
                {errors.cliente && <p className="text-red-600 text-sm">{errors.cliente}</p>}
              </div>
            ) : (
              <div>
                <label className="block mb-1 font-semibold">Fornecedor *</label>
                <select
                  name="fornecedor"
                  value={formData.fornecedor}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Selecione...</option>
                  {fornecedores.map(f => (
                    <option key={f.id} value={f.id}>{f.nome}</option>
                  ))}
                </select>
                {errors.fornecedor && <p className="text-red-600 text-sm">{errors.fornecedor}</p>}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
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

function PagamentoForm({ conta, tipo, onClose }) {
  const [formData, setFormData] = useState({
    data_pagamento: new Date().toISOString().split('T')[0],
    valor_pago: conta.valor,
    forma_pagamento: 'dinheiro'
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const endpoint = tipo === 'receber' 
        ? `/api/contas-receber/${conta.id}/registrar_pagamento/`
        : `/api/contas-pagar/${conta.id}/registrar_pagamento/`
      
      await api.post(endpoint, formData)
      alert('Pagamento registrado com sucesso!')
      onClose()
    } catch (err) {
      alert('Erro ao registrar pagamento: ' + (err.response?.data?.detail || 'Erro desconhecido'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Registrar Pagamento</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="font-semibold">{conta.descricao}</p>
          <p className="text-sm text-gray-600">Valor: R$ {parseFloat(conta.valor).toFixed(2)}</p>
          <p className="text-sm text-gray-600">
            Vencimento: {new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Data do Pagamento</label>
              <input
                name="data_pagamento"
                type="date"
                value={formData.data_pagamento}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Valor Pago</label>
              <input
                name="valor_pago"
                type="number"
                step="0.01"
                value={formData.valor_pago}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Forma de Pagamento</label>
              <select
                name="forma_pagamento"
                value={formData.forma_pagamento}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="pix">PIX</option>
                <option value="transferencia">Transferência</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Registrando...' : '✓ Confirmar Pagamento'}
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
