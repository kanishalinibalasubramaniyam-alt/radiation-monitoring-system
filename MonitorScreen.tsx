
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Radio, MapPin, Zap, ChevronRight } from 'lucide-react';

interface MonitorScreenProps {
  onNavigate: (screen: string) => void;
}

const MonitorScreen: React.FC<MonitorScreenProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any[]>([]);
  const [currentLevel, setCurrentLevel] = useState(0.12);

  useEffect(() => {
    // Generate initial data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: `${i}:00`,
      val: 0.1 + Math.random() * 0.05
    }));
    setData(initialData);

    const interval = setInterval(() => {
      const newVal = 0.1 + Math.random() * 0.05;
      setCurrentLevel(parseFloat(newVal.toFixed(3)));
      setData(prev => [...prev.slice(1), { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), val: newVal }]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Live Monitor</h1>

      <div className="bg-slate-900 rounded-3xl p-8 mb-6 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <Zap size={200} className="absolute -right-10 -bottom-10 rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Scanning Active</span>
          </div>
          <div className="text-6xl font-black mb-2 flex items-baseline justify-center">
            {currentLevel}
            <span className="text-lg font-medium ml-2 text-slate-400">µSv/h</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Detected at North Campus Center</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm mb-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4 px-2">Trend (Last 20 Samples)</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Radio size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Average</p>
            <p className="text-sm font-bold text-slate-800">0.115</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center space-x-3">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Peak</p>
            <p className="text-sm font-bold text-slate-800">0.142</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('mapping')}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <MapPin size={20} />
              </div>
              <span className="text-sm font-bold text-slate-800">View Map</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
          <button
            onClick={() => onNavigate('alerts')}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-rose-300 hover:shadow-md transition-all active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <Radio size={20} />
              </div>
              <span className="text-sm font-bold text-slate-800">View Alerts</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonitorScreen;
