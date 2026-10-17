import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MetricChartProps {
  metrics: {
    label: string;
    real: number;
    ideal: number;
  }[];
}

export const MetricChart: React.FC<MetricChartProps> = ({ metrics }) => {
  const data = {
    labels: metrics.map(m => m.label),
    datasets: [
      {
        label: 'Real (Atual)',
        data: metrics.map(m => m.real),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Ideal (Referência)',
        data: metrics.map(m => m.ideal),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Comparativo de Métricas: Real vs Ideal' },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <Bar data={data} options={options} />
    </div>
  );
};
