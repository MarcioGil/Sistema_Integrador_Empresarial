import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalProdutos: 0,
    pedidosPendentes: 0,
    contasVencer: 0
  })

  const [chartData, setChartData] = useState([
    { dia: '01/11', vendas: 4200 },
    { dia: '02/11', vendas: 3800 },
    { dia: '03/11', vendas: 5000 },
    { dia: '04/11', vendas: 4500 },
    { dia: '05/11', vendas: 6200 },
    { dia: '06/11', vendas: 5500 },
    { dia: '07/11', vendas: 7000 }
  ])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Buscar estatísticas reais (adaptar conforme API)
      const [clientesRes, produtosRes] = await Promise.all([
        api.get('/api/clientes/?page_size=1'),
        api.get('/api/produtos/?page_size=1')
      ])
      
      setStats({
        totalClientes: clientesRes.data.count || 0,
        totalProdutos: produtosRes.data.count || 0,
        pedidosPendentes: 12, // Mock
        contasVencer: 8 // Mock
      })
    } catch (err) {
      console.error('Erro ao buscar estatísticas', err)
    }
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
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4 text-gray-700">Vendas dos Últimos 7 Dias</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="vendas" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
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

