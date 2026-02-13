
import React from 'react';
import ScreenHeader from '../components/ScreenHeader';
import { Globe, Users, Database, Server, ChevronRight, Activity, AlertTriangle, Settings } from 'lucide-react';

interface AdminScreenProps {
  onBack: () => void;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onBack }) => {
  const regions = [
    { name: 'North District', active: 142, status: 'stable', load: 'Low' },
    { name: 'Central Hub', active: 894, status: 'warning', load: 'Critical' },
    { name: 'South Port', active: 231, status: 'stable', load: 'Med' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <ScreenHeader 
        title="Admin Control" 
        onBack={onBack}
        actions={<button className="p-2 bg-slate-900 text-white rounded-xl shadow-md"><Settings size={18} /></button>}
      />

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <Users size={20} className="text-indigo-600 mb-3" />
            <h4 className="text-[10px] font-bold text-slate-400 uppercase">Active Nodes</h4>
            <p className="text-2xl font-black text-slate-900">1,267</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <Database size={20} className="text-emerald-600 mb-3" />
            <h4 className="text-[10px] font-bold text-slate-400 uppercase">System Uptime</h4>
            <p className="text-2xl font-black text-slate-900">99.9%</p>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 mb-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-rose-500 text-white rounded-2xl animate-pulse">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-rose-800">Critical Anomaly</h4>
              <p className="text-xs text-rose-600">Central Hub exceeding limits</p>
            </div>
          </div>
          <button className="bg-white text-rose-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm">Review</button>
        </div>

        <h3 className="font-bold text-slate-800 mb-4 px-2">Regional Monitoring</h3>
        <div className="space-y-4">
          {regions.map((region, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-300 transition-all">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-12 rounded-full ${region.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{region.name}</h4>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase">
                      <Users size={12} className="mr-1" />
                      {region.active} Nodes
                    </div>
                    <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase">
                      <Activity size={12} className="mr-1" />
                      {region.load} Load
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:bg-slate-800 transition-colors active:scale-[0.98]">
            <Server size={20} />
            <span>Environmental Data Matrix</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;
