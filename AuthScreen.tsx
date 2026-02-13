import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, User, Eye, EyeOff } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { apiService } from '../services/api';

interface AuthScreenProps {
  onLogin: (role: 'user' | 'admin') => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const { login } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate inputs
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    if (isLogin) {
      // LOGIN: Check stored users
      const storedUsers = JSON.parse(localStorage.getItem('radsafe_users') || '[]');
      const user = storedUsers.find((u: any) => u.email === email && u.password === password);

      if (user) {
        // Login successful
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'user' as const,
          profilePhoto: user.profilePhoto
        };

        login(userData);
        alert(`🎉 LOGIN SUCCESSFUL!\n\nWelcome back ${user.name}!`);
        onLogin('user');
      } else {
        setError('Invalid email or password');
      }
    } else {
      // SIGNUP: Store new user
      const storedUsers = JSON.parse(localStorage.getItem('radsafe_users') || '[]');

      // Check if user already exists
      const existingUser = storedUsers.find((u: any) => u.email === email);
      if (existingUser) {
        setError('User already exists with this email');
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password, // In production, hash this!
        profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      storedUsers.push(newUser);
      localStorage.setItem('radsafe_users', JSON.stringify(storedUsers));

      // Auto-login after signup
      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: 'user' as const,
        profilePhoto: newUser.profilePhoto
      };

      login(userData);
      alert(`🎉 REGISTRATION SUCCESSFUL!\n\nWelcome ${newUser.name}!`);
      onLogin('user');
    }

    setLoading(false);
  };

  // Auto-fill saved email if exists
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('radsafe_last_email');
    if (savedEmail && isLogin) {
      setEmail(savedEmail);
    }
  }, [isLogin]);

  return (
    <div className="p-8 flex flex-col min-h-screen justify-center bg-white">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          {isLogin ? 'Welcome Back' : 'Join RadSafe'}
        </h2>
        <p className="text-slate-500">
          {isLogin ? 'Sign in to monitor your surroundings' : 'Create an account to stay protected'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="email" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (rememberMe) {
                  localStorage.setItem('radsafe_last_email', e.target.value);
                }
              }}
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700 block">Password</label>
            {isLogin && <button type="button" className="text-xs text-indigo-600 font-medium">Forgot?</button>}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {isLogin && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="remember" className="text-sm text-slate-600">
              Remember my email
            </label>
          </div>
        )}

        

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}</span>
        </button>
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-slate-500 text-sm"
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span className="text-indigo-600 font-bold">{isLogin ? 'Sign Up' : 'Log In'}</span>
        </button>
      </div>

      
      
      </div>
    
  );
};

export default AuthScreen;