import React from 'react'
import { Card } from '../ui/Card'

export default function Dashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">Card 1 (Vendas)</div>
        <div className="bg-white p-4 rounded shadow">Card 2 (Estoque)</div>
        <div className="bg-white p-4 rounded shadow">Card 3 (Financeiro)</div>
      </div>
    </div>
  )
}
