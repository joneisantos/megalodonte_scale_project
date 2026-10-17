export class OkokScaleAdapter {
  async scanAndConnect(onWeightRead: (weight: number, impedance: number) => void) {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'OK' }, 
          { namePrefix: 'Scale' },
          { namePrefix: 'BK' }
        ],
        optionalServices: ['0000fee7-0000-1000-8000-00805f9b34fb', 0xFFE0]
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('0000fee7-0000-1000-8000-00805f9b34fb');
      const characteristic = await service.getCharacteristic('0000fec8-0000-1000-8000-00805f9b34fb');

      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value;
        const weight = value.getUint16(2, false) / 10;
        const impedance = value.getUint16(4, false);
        
        if (weight > 0) {
          onWeightRead(weight, impedance);
        }
      });
    } catch (error) {
      console.error("Erro na conexão Bluetooth:", error);
      alert("Falha ou dispositivo não suportado/pareado via Web Bluetooth.");
    }
  }
}
