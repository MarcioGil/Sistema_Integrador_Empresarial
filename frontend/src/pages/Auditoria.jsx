import React, { useEffect, useState } from 'react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function Auditoria() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filterModel, setFilterModel] = useState('')
  
  useEffect(() => {
    fetchLogs()
  }, [search, filterModel])

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (search) params.search = search
      if (filterModel) params.content_type_model = filterModel
      
      // Ajuste conforma a implementação do backend (ex: search e filters)
      const { data } = await api.get('/logs/', { params })
      setLogs(data.results || data || [])
    } catch (err) {
      console.error('Erro ao buscar logs', err)
      setError('Erro ao carregar logs de auditoria.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getActionColor = (action) => {
    switch (action) {
        case 'CREATE': return 'bg-green-100 text-green-800'
        case 'UPDATE': return 'bg-blue-100 text-blue-800'
        case 'DELETE': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">📝 Auditoria do Sistema</h2>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="🔍 Buscar por usuário, IP ou objeto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select 
            value={filterModel} 
            onChange={(e) => setFilterModel(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-w-[200px]"
        >
            <option value="">Todos os Modelos</option>
            <option value="cliente">Clientes</option>
            <option value="produto">Produtos</option>
            <option value="pedido">Vendas</option>
            <option value="usuario">Usuários</option>
            <option value="fornecedor">Fornecedores</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Carregando logs de auditoria..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchLogs} />
      ) : logs.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">Nenhum registro de auditoria encontrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left">Data/Hora</th>
                <th className="p-3 text-left">Usuário</th>
                <th className="p-3 text-center">Ação</th>
                <th className="p-3 text-left">Recurso</th>
                <th className="p-3 text-left hidden md:table-cell">Objeto</th>
                <th className="p-3 text-left hidden lg:table-cell">Alterações</th>
                <th className="p-3 text-left hidden xl:table-cell">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 whitespace-nowrap">{formatDate(log.data_hora || log.timestamp)}</td>
                  <td className="p-3 font-medium">{log.usuario_nome || log.user || 'Sistema'}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getActionColor(log.acao || log.action)}`}>
                        {log.acao || log.action}
                    </span>
                  </td>
                  <td className="p-3 capitalize">{log.objeto_tipo || log.model_name}</td>
                  <td className="p-3 hidden md:table-cell">{log.objeto_str || log.object_repr}</td>
                  <td className="p-3 hidden lg:table-cell max-w-xs truncate text-gray-500" title={JSON.stringify(log.alteracoes || log.changes)}>
                      {log.alteracoes ? JSON.stringify(log.alteracoes).substring(0, 50) + '...' : '-'}
                  </td>
                  <td className="p-3 hidden xl:table-cell text-gray-500">{log.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
