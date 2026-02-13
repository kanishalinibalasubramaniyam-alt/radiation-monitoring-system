import React, { useState, useEffect } from 'react';
import { RadiationStatus } from '../types';
import StatusIndicator from '../components/StatusIndicator';
import { Brain, Cpu, ShieldAlert, Award, ChevronRight, Activity, Gauge } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const { user } = useUser();
  
  // ========== NEW: RADIATION METER STATE ==========
  const [radiationLevel, setRadiationLevel] = useState(0.12);
  const [meterStatus, setMeterStatus] = useState<'low' | 'medium' | 'high'>('low');
  
  // Simulate changing radiation levels (like a real speed meter)
  useEffect(() => {
    const interval = setInterval(() => {
      // Random fluctuation between 0.05 and 0.35
      const newLevel = parseFloat((0.08 + Math.random() * 0.27).toFixed(2));
      setRadiationLevel(newLevel);
      
      // Update status based on level
      if (newLevel < 0.15) {
        setMeterStatus('low');
      } else if (newLevel < 0.25) {
        setMeterStatus('medium');
      } else {
        setMeterStatus('high');
      }
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // ========== NEW: SPEED METER COMPONENT ==========
  const RadiationSpeedMeter = () => {
    // Calculate needle rotation (-90deg to +90deg)
    const minValue = 0.05;
    const maxValue = 0.35;
    const percentage = (radiationLevel - minValue) / (maxValue - minValue);
    const rotation = -90 + (percentage * 180); // -90 to +90 degrees
    
    // Colors based on level
    const getMeterColor = () => {
      if (radiationLevel < 0.15) return '#10b981'; // Green
      if (radiationLevel < 0.25) return '#f59e0b'; // Amber
      return '#ef4444'; // Red
    };
    
    const getStatusText = () => {
      if (radiationLevel < 0.15) return 'SAFE';
      if (radiationLevel < 0.25) return 'MODERATE';
      return 'ELEVATED';
    };
    
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Gauge size={20} className={`
              ${radiationLevel < 0.15 ? 'text-emerald-500' : ''}
              ${radiationLevel >= 0.15 && radiationLevel < 0.25 ? 'text-amber-500' : ''}
              ${radiationLevel >= 0.25 ? 'text-rose-500' : ''}
            `} />
            <h3 className="font-bold text-slate-800">Radiation Speed Meter</h3>
          </div>
          <span className={`
            px-3 py-1 rounded-full text-xs font-bold
            ${radiationLevel < 0.15 ? 'bg-emerald-100 text-emerald-700' : ''}
            ${radiationLevel >= 0.15 && radiationLevel < 0.25 ? 'bg-amber-100 text-amber-700' : ''}
            ${radiationLevel >= 0.25 ? 'bg-rose-100 text-rose-700' : ''}
          `}>
            {getStatusText()}
          </span>
        </div>
        
        {/* SPEED METER VISUALIZATION */}
        <div className="relative w-full h-48 flex flex-col items-center justify-center">
          {/* Meter background - semicircle */}
          <svg viewBox="0 0 200 100" className="w-full h-full">
            {/* Gray background arc */}
            <path
              d="M20,80 A80,80 0 0,1 180,80"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
              strokeLinecap="round"
            />
            
            {/* Colored arc based on level */}
            <path
              d="M20,80 A80,80 0 0,1 180,80"
              fill="none"
              stroke={getMeterColor()}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 251.2} 251.2`}
              strokeDashoffset="0"
            />
            
            {/* Tick marks */}
            <line x1="20" y1="80" x2="12" y2="80" stroke="#94a3b8" strokeWidth="2" />
            <line x1="100" y1="20" x2="100" y2="12" stroke="#94a3b8" strokeWidth="2" />
            <line x1="180" y1="80" x2="188" y2="80" stroke="#94a3b8" strokeWidth="2" />
            
            {/* Labels */}
            <text x="15" y="95" fontSize="10" fill="#64748b">0.05</text>
            <text x="92" y="30" fontSize="10" fill="#64748b">0.20</text>
            <text x="170" y="95" fontSize="10" fill="#64748b">0.35</text>
            
            {/* NEEDLE */}
            <g transform={`rotate(${rotation}, 100, 80)`}>
              <line
                x1="100"
                y1="80"
                x2="100"
                y2="35"
                stroke="#1e293b"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="100" cy="80" r="6" fill="#1e293b" />
              <circle cx="100" cy="80" r="3" fill="white" />
            </g>
          </svg>
          
          {/* Current reading - big number like speedometer */}
          <div className="absolute bottom-0 text-center">
            <div className="text-4xl font-black text-slate-900">
              {radiationLevel}
              <span className="text-lg font-medium text-slate-500 ml-1">µSv/h</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {radiationLevel < 0.15 ? '✅ Normal background' : ''}
              {radiationLevel >= 0.15 && radiationLevel < 0.25 ? '⚠️ Monitor exposure' : ''}
              {radiationLevel >= 0.25 ? '🔴 Take precautions' : ''}
            </p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-between mt-8 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-slate-600">Low (&lt;0.15)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs text-slate-600">Medium (0.15-0.25)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <span className="text-xs text-slate-600">High (&gt;0.25)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 pb-24">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-sm text-slate-500 font-medium">Welcome back,</h2>
          <h1 className="text-2xl font-bold text-slate-900">{user?.name || 'User'}</h1>
        </div>
        <button 
          onClick={() => onNavigate('alerts')} 
          className="relative p-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <ShieldAlert className="text-indigo-600" size={24} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>
      </header>

      {/* ========== NEW: RADIATION SPEED METER ========== */}
      <RadiationSpeedMeter />

      {/* ========== EXISTING STATUS INDICATOR ========== */}
      <div onClick={() => onNavigate('monitor')} className="cursor-pointer group">
        <StatusIndicator status={RadiationStatus.SAFE} value={radiationLevel} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div 
          onClick={() => onNavigate('ml')} 
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all active:scale-95"
        >
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
            <Brain className="text-indigo-600" size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-800">ML Predictions</h3>
          <p className="text-[10px] text-slate-500 mt-1">AI-powered trend forecast</p>
        </div>
        <div 
          onClick={() => onNavigate('iot')} 
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all active:scale-95"
        >
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-3">
            <Cpu className="text-emerald-600" size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-800">IoT Sensors</h3>
          <p className="text-[10px] text-slate-500 mt-1">3 Connected Devices</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Daily Safety Score</h3>
          <span className="text-emerald-600 text-sm font-bold">
            {radiationLevel < 0.15 ? '98' : radiationLevel < 0.25 ? '75' : '45'}/100
          </span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className={`
              h-full rounded-full shadow-inner transition-all duration-500
              ${radiationLevel < 0.15 ? 'bg-emerald-500 w-[98%]' : ''}
              ${radiationLevel >= 0.15 && radiationLevel < 0.25 ? 'bg-amber-500 w-[75%]' : ''}
              ${radiationLevel >= 0.25 ? 'bg-rose-500 w-[45%]' : ''}
            `}
          />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="font-bold text-slate-800">Active Monitoring</h3>
        <button 
          onClick={() => onNavigate('recommendations')}
          className="w-full flex items-center justify-between p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center space-x-3">
            <Award size={24} />
            <span className="font-semibold text-left">Get Real-Time AI Safety Advice</span>
          </div>
          <ChevronRight size={20} />
        </button>

        <button 
          onClick={() => onNavigate('monitor')}
          className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>
            <span className="font-semibold text-slate-700">Live Radiation Stream</span>
          </div>
          <Activity size={20} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default DashboardScreen;