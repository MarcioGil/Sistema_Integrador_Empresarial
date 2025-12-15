
import React from "react";

import Chart from "../dashboard/Chart.jsx";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Card({ title, value, color }) {
	return (
		<div className={`flex flex-col bg-white shadow rounded p-4 border-l-4 ${color} min-w-[180px]`}>
			<span className="text-gray-500 text-sm font-medium">{title}</span>
			<span className="text-2xl font-bold text-gray-800 mt-1">{value}</span>
		</div>
	);
}

const Dashboard = () => {
	// Mock data, replace with API calls as needed
	const resumo = [
		{ title: "Receita do Mês", value: "R$ 32.000", color: "border-blue-500" },
		{ title: "Despesas", value: "R$ 18.500", color: "border-red-400" },
		{ title: "Clientes Ativos", value: 128, color: "border-green-500" },
		{ title: "Produtos em Estoque", value: 540, color: "border-yellow-400" },
	];

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
				{resumo.map((item, idx) => (
					<Card key={idx} {...item} />
				))}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="bg-white rounded shadow p-6">
					<h2 className="text-xl font-semibold mb-4 text-gray-700">Receita Mensal</h2>
					<Chart />
				</div>
				<div className="bg-white rounded shadow p-6">
					<h2 className="text-xl font-semibold mb-4 text-gray-700">Vendas por Mês</h2>
					<Bar
						data={{
							labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
							datasets: [
								{
									label: "Vendas",
									data: [80, 95, 110, 105, 120, 130, 125, 140, 135, 150, 160, 170],
									backgroundColor: "#22c55e",
									borderRadius: 6,
								},
							],
						}}
						options={{
							responsive: true,
							plugins: { legend: { display: false } },
							scales: {
								x: { grid: { display: false }, ticks: { color: "#64748b", font: { weight: "bold" } } },
								y: { grid: { color: "#e5e7eb" }, ticks: { color: "#64748b" } },
							},
						}}
					/>
				</div>
				<div className="bg-white rounded shadow p-6">
					<h2 className="text-xl font-semibold mb-4 text-gray-700">Estoque por Categoria</h2>
					<Bar
						data={{
							labels: ["Eletrônicos", "Roupas", "Alimentos", "Livros", "Outros"],
							datasets: [
								{
									label: "Estoque",
									data: [120, 200, 150, 80, 90],
									backgroundColor: "#3b82f6",
									borderRadius: 6,
								},
							],
						}}
						options={{
							responsive: true,
							plugins: { legend: { display: false } },
							scales: {
								x: { grid: { display: false }, ticks: { color: "#64748b", font: { weight: "bold" } } },
								y: { grid: { color: "#e5e7eb" }, ticks: { color: "#64748b" } },
							},
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;

