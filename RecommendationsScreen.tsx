
import React, { useState, useEffect } from 'react';
import { getSafetyRecommendations } from '../services/geminiService';
import ScreenHeader from '../components/ScreenHeader';
import { Lightbulb, ShieldCheck, Zap, BookOpen, ExternalLink, RefreshCw } from 'lucide-react';

interface RecommendationsScreenProps {
  onBack: () => void;
}

const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({ onBack }) => {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTips = async () => {
    setLoading(true);
    const res = await getSafetyRecommendations(0.12);
    setRecommendations(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchTips();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <ScreenHeader 
        title="Safety Guide" 
        onBack={onBack} 
        actions={
          <button onClick={fetchTips} className="p-2 hover:bg-slate-100 rounded-full text-amber-600">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        }
      />

      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">Consulting Gemini Safety Engine...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">AI-Powered Safety Protocols</h3>
            <div className="space-y-4">
              {recommendations?.tips?.map((tip: any, idx: number) => (
                <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all cursor-pointer">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
                  <div className="relative z-10">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full mb-2 inline-block shadow-sm ${
                      tip.priority === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {tip.priority} Priority
                    </span>
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">{tip.tip}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Educational Core</h3>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => alert('µSv/h (microsieverts per hour) is the unit of radiation dose rate. 0.1 µSv/h is typical background radiation. Levels above 0.3 µSv/h may require monitoring.')}
                  className="bg-slate-900 rounded-3xl p-6 text-white flex items-center justify-between hover:bg-slate-800 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <BookOpen size={24} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold">µSv/h Decoded</h4>
                      <p className="text-xs text-slate-400">Measure what matters</p>
                    </div>
                  </div>
                  <ExternalLink size={20} className="text-slate-500" />
                </button>

                <button
                  onClick={() => alert('Shielding Methods: 1) Distance - Radiation decreases with square of distance. 2) Time - Minimize exposure time. 3) Shielding - Use dense materials like lead. 4) Personal Protection - Wear appropriate gear in high-risk areas.')}
                  className="bg-indigo-600 rounded-3xl p-6 text-white flex items-center justify-between hover:bg-indigo-700 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <ShieldCheck size={24} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold">Shielding Methods</h4>
                      <p className="text-xs text-indigo-200">Passive protection tips</p>
                    </div>
                  </div>
                  <ExternalLink size={20} className="text-indigo-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsScreen;
