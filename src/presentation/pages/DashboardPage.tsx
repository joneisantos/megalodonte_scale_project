import React, { useState, useEffect } from 'react';
import { MetricChart } from '../components/MetricChart';
import { HistoryTable } from '../components/HistoryTable';
import { OkokScaleAdapter } from '../../infrastructure/bluetooth/OkokScaleAdapter';
import { RegisterWeighingUseCase } from '../../application/use-cases/RegisterWeighingUseCase';
import { IndexedDBWeighingRepository } from '../../infrastructure/persistence/IndexedDBWeighingRepository';
import { db, UserEntity, WeighingEntity } from '../../infrastructure/persistence/AppDatabase';

const scaleAdapter = new OkokScaleAdapter();
const weighingRepo = new IndexedDBWeighingRepository();
const registerUseCase = new RegisterWeighingUseCase(weighingRepo);

export const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [history, setHistory] = useState<WeighingEntity[]>([]);
  const [latest, setLatest] = useState<WeighingEntity | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Perfil padrão mockado ou criado no primeiro acesso
  useEffect(() => {
    async function initUser() {
      let existingUser = await db.users.toCollection().first();
      if (!existingUser) {
        const newUser: UserEntity = {
          id: 'user-default-1',
          name: 'Jonei',
          age: 38,
          height: 1.75,
          gender: 'male'
        };
        await db.users.add(newUser);
        existingUser = newUser;
      }
      setUser(existingUser);
      loadHistory(existingUser.id);
    }
    initUser();
  }, []);

  const loadHistory = async (userId: string) => {
    const records = await weighingRepo.getByUser(userId);
    setHistory(records);
    if (records.length > 0) {
      setLatest(records[records.length - 1]);
    }
  };

  const handleConnectScale = () => {
    if (!user) return;
    setLoading(true);
    
    // Modo real via Bluetooth ou simulação caso navegador não suporte Web Bluetooth
    scaleAdapter.scanAndConnect(async (weight, impedance) => {
      const record = await registerUseCase.execute(user.id, weight, impedance, user.height, user.gender, user.age);
      setLatest(record);
      await loadHistory(user.id);
      setLoading(false);
    });
  };

  // Simulação rápida para testes em desktop/navegadores sem suporte BLE físico direto
  const handleSimulateWeighing = async () => {
    if (!user) return;
    const mockWeight = 87.5;
    const mockImpedance = 520;
    const record = await registerUseCase.execute(user.id, mockWeight, mockImpedance, user.height, user.gender, user.age);
    setLatest(record);
    await loadHistory(user.id);
  };

  const chartMetrics = latest ? [
    { label: 'Peso (kg)', real: latest.weight, ideal: latest.idealWeight },
    { label: 'Gordura Corp. (%)', real: latest.bodyFat, ideal: latest.idealBodyFat },
  ] : [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Dashboard Megalodonte Bioimpedância</h1>
          <p className="text-gray-600">Usuário: {user?.name} | Altura: {user?.height}m | Idade: {user?.age} anos</p>
        </div>
        <div className="space-x-3">
          <button 
            onClick={handleConnectScale}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            Conectar Balança (Bluetooth)
          </button>
          <button 
            onClick={handleSimulateWeighing}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
          >
            Simular Pesagem
          </button>
        </div>
      </header>

      {latest && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-700 mb-4">Última Medição Registrada</h2>
              <p className="text-sm text-gray-500 mb-2">Data: {new Date(latest.timestamp).toLocaleString()}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <span className="text-sm text-blue-600 font-medium">Peso Real</span>
                  <p className="text-2xl font-bold text-blue-900">{latest.weight} kg</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <span className="text-sm text-green-600 font-medium">Gordura Corporal</span>
                  <p className="text-2xl font-bold text-green-900">{latest.bodyFat} %</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <span className="text-sm text-purple-600 font-medium">Massa Magra</span>
                  <p className="text-2xl font-bold text-purple-900">{latest.muscleMass} kg</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <span className="text-sm text-orange-600 font-medium">Impedância</span>
                  <p className="text-2xl font-bold text-orange-900">{latest.impedance} Ω</p>
                </div>
              </div>
            </div>
          </div>
          <MetricChart metrics={chartMetrics} />
        </div>
      )}

      <HistoryTable records={history} />
    </div>
  );
};
