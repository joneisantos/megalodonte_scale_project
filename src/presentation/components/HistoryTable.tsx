import React from 'react';
import { WeighingEntity } from '../../infrastructure/persistence/AppDatabase';

interface HistoryTableProps {
  records: WeighingEntity[];
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ records }) => {
  if (records.length === 0) {
    return <p className="text-gray-500 italic">Nenhum histórico de pesagem registrado ainda.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
      <h3 className="text-lg font-bold mb-4">Histórico de Pesagens</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Peso (kg)</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gordura (%)</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Massa Magra (kg)</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Impedância (Ω)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm">
          {records.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-2 whitespace-nowrap">{new Date(r.timestamp).toLocaleString()}</td>
              <td className="px-4 py-2 whitespace-nowrap font-semibold">{r.weight}</td>
              <td className="px-4 py-2 whitespace-nowrap">{r.bodyFat}%</td>
              <td className="px-4 py-2 whitespace-nowrap">{r.muscleMass} kg</td>
              <td className="px-4 py-2 whitespace-nowrap text-gray-500">{r.impedance} Ω</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
