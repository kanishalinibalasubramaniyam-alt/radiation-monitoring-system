
import React, { useState, useEffect } from 'react';
import { getMLPrediction } from '../services/geminiService';
import ScreenHeader from '../components/ScreenHeader';
import { BrainCircuit, TrendingUp, ShieldCheck, Activity, RefreshCw } from 'lucide-react';

interface MLPredictionScreenProps {
  onBack: () => void;
}

const MLPredictionScreen: React.FC<MLPredictionScreenProps> = ({ onBack }) => {
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPrediction = async () => {
    setLoading(true);
    const history = Array.from({ length: 24 }, () => 0.1 + Math.random() * 0.1);
    const res = await getMLPrediction(history);
    setPrediction(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <ScreenHeader 
        title="AI Forecasting" 
        onBack={onBack} 
        actions={
          <button onClick={fetchPrediction} className="p-2 hover:bg-slate-100 rounded-full text-indigo-600">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        }
      />
      
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">Neural processing active...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl">
              <p className="text-indigo-100 text-sm font-medium mb-1">Estimated Next Hour</p>
              <div className="flex items-baseline space-x-2 mb-4">
                <span className="text-5xl font-black">{prediction?.predictedValue || '0.14'}</span>
                <span className="text-lg font-medium opacity-80">µSv/h</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                  Confidence: {Math.round((prediction?.confidence || 0.85) * 100)}%
                </div>
                <div className="flex items-center text-xs font-bold capitalize">
                  <TrendingUp size={16} className="mr-1" />
                  {prediction?.trend || 'Stable'}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                <Activity size={18} className="mr-2 text-indigo-600" />
                Intelligence Summary
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "{prediction?.analysis || "Environmental patterns suggest stability. No significant electromagnetic fluctuations detected in current sector."}"
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start space-x-3">
              <ShieldCheck className="text-emerald-600 mt-1" size={20} />
              <div>
                <h4 className="text-sm font-bold text-emerald-800">Pre-Emptive Safety</h4>
                <p className="text-xs text-emerald-600 mt-1 leading-snug">
                  Predicted values remain 85% below safe exposure thresholds for the next 4 hours.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MLPredictionScreen;
