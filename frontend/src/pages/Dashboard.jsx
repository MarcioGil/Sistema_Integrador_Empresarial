import React, { useEffect, useState } from 'react'
import api from '../services/api'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalProdutos: 0,
    pedidosPendentes: 0,
    contasVencer: 0
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [vendasChartData, setVendasChartData] = useState([
    { dia: '01/11', vendas: 4200 },
    { dia: '02/11', vendas: 3800 },
    { dia: '03/11', vendas: 5000 },
    { dia: '04/11', vendas: 4500 },
    { dia: '05/11', vendas: 6200 },
    { dia: '06/11', vendas: 5500 },
    { dia: '07/11', vendas: 7000 }
  ])

  const [produtosTopData, setProdutosTopData] = useState([
    { nome: 'Produto A', vendas: 45 },
    { nome: 'Produto B', vendas: 38 },
    { nome: 'Produto C', vendas: 32 },
    { nome: 'Produto D', vendas: 28 },
    { nome: 'Produto E', vendas: 22 }
  ])

  const [financeiroData, setFinanceiroData] = useState([
    { name: 'Receitas', value: 45000, color: '#10b981' },
    { name: 'Despesas', value: 28000, color: '#ef4444' }
  ])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      // Buscar estatísticas reais (adaptar conforme API)
      const [clientesRes, produtosRes, vendasRes] = await Promise.all([
        api.get('/api/clientes/?page_size=1'),
        api.get('/api/produtos/?page_size=1'),
        api.get('/api/vendas/?page_size=10').catch(() => ({ data: { results: [] } }))
      ])

      setStats({
        totalClientes: clientesRes.data.count || 0,
        totalProdutos: produtosRes.data.count || 0,
        pedidosPendentes: vendasRes.data.results?.length || 12,
        contasVencer: 8 // Mock - implementar endpoint
      })

      // Processar dados reais de vendas se disponível
      if (vendasRes.data.results?.length > 0) {
        const vendasPorDia = processVendasPorDia(vendasRes.data.results)
        if (vendasPorDia.length > 0) {
          setVendasChartData(vendasPorDia)
        }
      }
    } catch (err) {
      console.error('Erro ao buscar estatísticas', err)
      setError('Não foi possível carregar os dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const processVendasPorDia = (vendas) => {
    // Agrupar vendas por dia
    const grouped = {}
    vendas.forEach((v) => {
      const date = new Date(v.data_venda || v.created_at)
      const dia = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      if (!grouped[dia]) {
        grouped[dia] = 0
      }
      grouped[dia] += parseFloat(v.valor_total || 0)
    })

    return Object.entries(grouped)
      .map(([dia, vendas]) => ({ dia, vendas }))
      .slice(-7) // Últimos 7 dias
  }

  if (loading) {
    return <LoadingSpinner size="lg" text="Carregando dashboard..." />
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={fetchStats} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Clientes Ativos"
          value={stats.totalClientes}
          icon="👥"
          color="bg-blue-500"
        />
        <StatCard
          title="Produtos Cadastrados"
          value={stats.totalProdutos}
          icon="📦"
          color="bg-green-500"
        />
        <StatCard
          title="Pedidos Pendentes"
          value={stats.pedidosPendentes}
          icon="🛒"
          color="bg-yellow-500"
        />
        <StatCard
          title="Contas a Vencer"
          value={stats.contasVencer}
          icon="💳"
          color="bg-red-500"
        />
      </div>

      {/* Gráfico de vendas */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-700">📈 Vendas dos Últimos 7 Dias</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={vendasChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value)
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="vendas"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Vendas (R$)"
              dot={{ fill: '#3b82f6', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grid com 2 gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Gráfico de produtos mais vendidos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-gray-700">🏆 Top 5 Produtos Mais Vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={produtosTopData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vendas" fill="#10b981" name="Quantidade Vendida" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de receitas vs despesas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-gray-700">💰 Receitas vs Despesas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={financeiroData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) =>
                  `${name}: ${new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(value)}`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {financeiroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(value)
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <h4 className="font-bold text-yellow-800 mb-2">⚠️ Estoque Baixo</h4>
          <p className="text-yellow-700">5 produtos precisam de reposição</p>
        </div>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <h4 className="font-bold text-red-800 mb-2">📅 Contas Vencidas</h4>
          <p className="text-red-700">3 contas a receber vencidas</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`${color} text-white text-4xl p-4 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

