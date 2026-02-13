
import React, { useState } from 'react';
import ScreenHeader from '../components/ScreenHeader';
import { ShieldAlert, BellRing, Info, CheckCircle, Clock } from 'lucide-react';

interface AlertsScreenProps {
  onBack: () => void;
}

const AlertsScreen: React.FC<AlertsScreenProps> = ({ onBack }) => {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'danger', title: 'High Radiation Level', message: 'Sensor detected 0.61 µSv/h in City Center.', time: '10 min ago', unread: true },
    { id: 2, type: 'info', title: 'Weekly Report Ready', message: 'Your radiation exposure trends for the week are available.', time: '2 hours ago', unread: true },
    { id: 3, type: 'success', title: 'Safe Zone Detected', message: 'Residential Zone A remains within optimal levels.', time: '1 day ago', unread: false },
    { id: 4, type: 'warning', title: 'Battery Low', message: 'Car Deck Sensor battery is below 15%.', time: '1 day ago', unread: false }
  ]);

  const handleAlertClick = (id: number) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, unread: false } : alert
    ));
  };

  const handleClearAll = () => {
    setAlerts([]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ScreenHeader 
        title="Alerts" 
        onBack={onBack} 
        actions={<button onClick={handleClearAll} className="text-indigo-600 text-xs font-bold uppercase tracking-wider hover:text-indigo-700 transition-colors">Clear All</button>}
      />

      <div className="p-6 space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => handleAlertClick(alert.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
              alert.unread ? 'bg-white border-indigo-100 shadow-sm' : 'bg-slate-100/30 border-transparent opacity-70'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl ${
                alert.type === 'danger' ? 'bg-rose-100 text-rose-600' :
                alert.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                alert.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {alert.type === 'danger' ? <ShieldAlert size={20} /> : 
                 alert.type === 'warning' ? <BellRing size={20} /> :
                 alert.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-800">{alert.title}</h4>
                  <div className="flex items-center text-[10px] text-slate-400 font-medium ml-2">
                    <Clock size={10} className="mr-1" />
                    {alert.time}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{alert.message}</p>
                {alert.unread && (
                  <div className="mt-2 w-2 h-2 rounded-full bg-indigo-600" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsScreen;
