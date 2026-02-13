
import React from 'react';
import { ShieldCheck } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6">
      <div className="mb-8 animate-bounce bg-white/10 p-6 rounded-full backdrop-blur-md">
        <ShieldCheck size={80} className="text-white" />
      </div>
      <h1 className="text-4xl font-bold mb-2 tracking-tight">RadSafe</h1>
      <p className="text-indigo-100 text-center text-lg max-w-xs opacity-90 font-light">
        Protecting your mobile lifestyle and environmental safety through intelligence.
      </p>
      <div className="mt-20 flex space-x-2">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-75" />
        <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse delay-150" />
      </div>
    </div>
  );
};

export default WelcomeScreen;
