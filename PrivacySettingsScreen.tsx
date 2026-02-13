import React, { useState } from 'react';
import { ArrowLeft, Shield, Eye, EyeOff, Lock, Bell, Users, Globe } from 'lucide-react';

interface PrivacySettingsScreenProps {
  onBack: () => void;
}

const PrivacySettingsScreen: React.FC<PrivacySettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState({
    profileVisibility: 'friends',
    dataSharing: true,
    locationTracking: false,
    notifications: true,
    analytics: false,
    twoFactor: true
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleVisibilityChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      profileVisibility: value
    }));
  };

  return (
    <div className="p-6">
      <header className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors mr-4"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Privacy & Security</h1>
      </header>

      <div className="space-y-6">
        {/* Profile Visibility */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Eye size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Profile Visibility</h3>
                <p className="text-xs text-slate-500">Who can see your profile</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {[
              { value: 'public', label: 'Public', icon: Globe },
              { value: 'friends', label: 'Friends Only', icon: Users },
              { value: 'private', label: 'Private', icon: EyeOff }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleVisibilityChange(option.value)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                  settings.profileVisibility === option.value
                    ? 'bg-indigo-50 border border-indigo-200'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <option.icon size={18} className={settings.profileVisibility === option.value ? 'text-indigo-600' : 'text-slate-500'} />
                  <span className={`text-sm font-medium ${settings.profileVisibility === option.value ? 'text-indigo-700' : 'text-slate-700'}`}>
                    {option.label}
                  </span>
                </div>
                {settings.profileVisibility === option.value && (
                  <div className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Security Settings</h3>
                <p className="text-xs text-slate-500">Protect your account</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {[
              { key: 'twoFactor', label: 'Two-Factor Authentication', icon: Lock, description: 'Add an extra layer of security' },
              { key: 'notifications', label: 'Security Notifications', icon: Bell, description: 'Get alerts about account activity' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <item.icon size={18} className="text-slate-500" />
                  <div>
                    <span className="text-sm font-medium text-slate-800">{item.label}</span>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(item.key as keyof typeof settings)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings[item.key as keyof typeof settings] ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Data & Privacy</h3>
                <p className="text-xs text-slate-500">Control your data usage</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {[
              { key: 'dataSharing', label: 'Data Sharing', description: 'Share anonymized data for improvements' },
              { key: 'locationTracking', label: 'Location Tracking', description: 'Allow location-based features' },
              { key: 'analytics', label: 'Usage Analytics', description: 'Help improve the app with analytics' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-800">{item.label}</span>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
                <button
                  onClick={() => handleToggle(item.key as keyof typeof settings)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings[item.key as keyof typeof settings] ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsScreen;