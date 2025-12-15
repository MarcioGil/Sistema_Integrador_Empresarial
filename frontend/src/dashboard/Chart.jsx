import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const data = {
  labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  datasets: [
    {
      label: "Receita (R$)",
      data: [12000, 15000, 18000, 17000, 21000, 25000, 23000, 26000, 24000, 28000, 30000, 32000],
      fill: true,
      backgroundColor: (ctx) => {
        const bg = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
        bg.addColorStop(0, "rgba(59,130,246,0.3)");
        bg.addColorStop(1, "rgba(59,130,246,0.0)");
        return bg;
      },
      borderColor: "#2563eb",
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: "#2563eb",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index", intersect: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#64748b", font: { weight: "bold" } },
    },
    y: {
      grid: { color: "#e5e7eb" },
      ticks: { color: "#64748b" },
    },
  },
};

export default function Chart({ dark }) {
  return (
    <div className="w-full h-72">
      <Line data={data} options={options} />
    </div>
  );
}
