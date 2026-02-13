import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import WelcomeScreen from './screens/WelcomeScreen';
import AuthScreen from './screens/AuthScreen';
import DashboardScreen from './screens/DashboardScreen';
import MonitorScreen from './screens/MonitorScreen';
import MLPredictionScreen from './screens/MLPredictionScreen';
import MappingScreen from './screens/MappingScreen';
import IoTConnectivityScreen from './screens/IoTConnectivityScreen';
import AlertsScreen from './screens/AlertsScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import PrivacySettingsScreen from './screens/PrivacySettingsScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import RecommendationsScreen from './screens/RecommendationsScreen';
import AdminScreen from './screens/AdminScreen';
import { UserProvider } from './contexts/UserContext';

// Simple screen manager - ALWAYS WORKS
const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<string>('welcome');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Debug every render
  console.log('🎬 RENDER - Current Screen:', currentScreen);

  // Auto move from welcome to auth
  useEffect(() => {
    if (currentScreen === 'welcome') {
      const timer = setTimeout(() => {
        console.log('⏰ Moving to auth screen');
        setCurrentScreen('auth');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Check saved login
  useEffect(() => {
    const savedUser = localStorage.getItem('radsafe_user');
    if (savedUser && currentScreen === 'auth') {
      console.log('🔑 Found saved user, auto-login');
      setIsAuthenticated(true);
      setCurrentScreen('dashboard');
    }
  }, []);

  const handleLogin = () => {
    console.log('✅ Login successful');
    setIsAuthenticated(true);
    setCurrentScreen('dashboard');
  };

  // FORCE navigation - this will work
  const navigate = (screen: string) => {
    console.log(`🔄 NAVIGATE TO: ${screen} (from ${currentScreen})`);
    
    // Force React to re-render
    setCurrentScreen(''); // Clear first
    setTimeout(() => {
      setCurrentScreen(screen);
      window.scrollTo(0, 0);
    }, 50);
  };

  const goBack = () => {
    console.log('🔙 Going back');
    if (['editprofile', 'privacy'].includes(currentScreen)) {
      navigate('settings');
    } else {
      navigate('dashboard');
    }
  };

  // Render the current screen
  const renderContent = () => {
    console.log(`🎯 Rendering: ${currentScreen}`);
    
    // Add a key to force re-render
    const screenKey = `${currentScreen}_${Date.now()}`;
    
    switch(currentScreen) {
      case 'welcome':
        return <WelcomeScreen key={screenKey} />;
        
      case 'auth':
        return <AuthScreen key={screenKey} onLogin={handleLogin} />;
        
      case 'dashboard':
        return <DashboardScreen key={screenKey} onNavigate={navigate} />;
        
      case 'monitor':
        return <MonitorScreen key={screenKey} onNavigate={navigate} />;
        
      case 'analytics':
        return <AnalyticsScreen key={screenKey} onNavigate={navigate} />;
        
      case 'settings':
        return <ProfileScreen
          key={screenKey}
          isAdmin={false}
          onLogout={() => {
            setIsAuthenticated(false);
            localStorage.removeItem('radsafe_user');
            navigate('auth');
          }}
          onNavigate={navigate}
        />;
        
      case 'editprofile': return <EditProfileScreen key={screenKey} onBack={goBack} />;
        
      case 'ml':
        return <MLPredictionScreen key={screenKey} onBack={goBack} />;
        
      case 'mapping':
        return <MappingScreen key={screenKey} onBack={goBack} />;
        
      case 'iot':
        return <IoTConnectivityScreen key={screenKey} onBack={goBack} />;
        
      case 'alerts':
        return <AlertsScreen key={screenKey} onBack={goBack} />;
        
      case 'chatbot':
        return <ChatbotScreen key={screenKey} onBack={goBack} />;
        
      case 'recommendations':
        return <RecommendationsScreen key={screenKey} onBack={goBack} />;
        
      case 'privacy':
        return <PrivacySettingsScreen key={screenKey} onBack={goBack} />;
        
      case 'admin':
        return <AdminScreen key={screenKey} onBack={goBack} />;
        
      default:
        return <DashboardScreen key={screenKey} onNavigate={navigate} />;
    }
  };

  const showNavigation = isAuthenticated && !['welcome', 'auth', 'editprofile', 'privacy'].includes(currentScreen);

  return (
    <UserProvider>
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-20">
        <main className="min-h-screen">
          {renderContent()}
        </main>
        
        {showNavigation && (
          <Navigation 
            currentTab={currentScreen} 
            onTabChange={navigate} 
          />
        )}
        
        {/* Debug overlay - remove for production */}
        


      </div>
    </UserProvider>
  );
};

export default App;