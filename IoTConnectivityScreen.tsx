
import React, { useState } from 'react';
import ScreenHeader from '../components/ScreenHeader';
import { Cpu, Plus, Wifi, Battery, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

interface IoTConnectivityScreenProps {
  onBack: () => void;
}

const IoTConnectivityScreen: React.FC<IoTConnectivityScreenProps> = ({ onBack }) => {
  const [scanning, setScanning] = useState(false);
  const devices = [
    { name: 'Pocket Monitor v2', id: 'RAD-092', battery: 84, status: 'connected' },
    { name: 'Home Hub Sensor', id: 'RAD-HUB-1', battery: 100, status: 'connected' },
    { name: 'Car Deck Sensor', id: 'RAD-CAR-X', battery: 12, status: 'low_battery' }
  ];

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ScreenHeader 
        title="IoT Ecosystem" 
        onBack={onBack} 
        actions={
          <button onClick={handleScan} className="p-2 hover:bg-slate-100 rounded-full text-indigo-600">
            <Plus size={24} />
          </button>
        }
      />

      <div className="p-6">
        <div className="bg-indigo-600 rounded-3xl p-6 text-white mb-8 relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <h2 className="text-lg font-bold mb-1">Status Overview</h2>
            <p className="text-indigo-100 text-sm opacity-80">2 Active Sensors synced</p>
            <div className="mt-6 flex space-x-8">
              <div className="text-center">
                <div className="text-2xl font-black">12.4s</div>
                <div className="text-[10px] uppercase font-bold text-indigo-200">Latency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black">98%</div>
                <div className="text-[10px] uppercase font-bold text-indigo-200">Integrity</div>
              </div>
            </div>
          </div>
          <Wifi size={120} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
        </div>

        {scanning && (
          <div className="mb-8 p-6 border-2 border-dashed border-indigo-200 rounded-3xl text-center bg-indigo-50/50">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
              <RefreshCw size={24} className="animate-spin" />
            </div>
            <p className="text-sm font-bold text-slate-700">Searching for RadSensors...</p>
            <p className="text-xs text-slate-400 mt-1">Keep devices near your mobile unit</p>
          </div>
        )}

        <h3 className="font-bold text-slate-800 mb-4 px-2">My Connected Hardware</h3>
        <div className="space-y-4">
          {devices.map((device, idx) => (
            <div
              key={idx}
              onClick={() => alert(`${device.name} (${device.id})\nStatus: ${device.status}\nBattery: ${device.battery}%\nLast sync: 2 minutes ago`)}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${device.status === 'low_battery' ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-600'}`}>
                  <Cpu size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{device.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] font-mono text-slate-400">{device.id}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center space-x-1">
                      <Battery size={12} className={device.battery < 20 ? 'text-rose-500' : 'text-slate-400'} />
                      <span className={`text-[10px] font-bold ${device.battery < 20 ? 'text-rose-500' : 'text-slate-500'}`}>{device.battery}%</span>
                    </div>
                  </div>
                </div>
              </div>
              {device.status === 'connected' ? (
                <CheckCircle2 size={24} className="text-emerald-500" />
              ) : (
                <AlertCircle size={24} className="text-rose-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IoTConnectivityScreen;
