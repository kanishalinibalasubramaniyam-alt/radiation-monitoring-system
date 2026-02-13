import { useEffect, type FC } from 'react';
import { User, Shield, Bell, LogOut, ChevronRight, HelpCircle, ShieldCheck, Bot } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { database } from '../services/database';

interface ProfileScreenProps {
  onLogout: () => void;
  onNavigate: (screen: string) => void;
  isAdmin: boolean;
}

const ProfileScreen: FC<ProfileScreenProps> = ({ onLogout, onNavigate, isAdmin }) => {
  const { user, updateProfile } = useUser();  // Changed to updateProfile
  
  // ========== Load profile from database ==========
  useEffect(() => {
    const loadProfileFromDatabase = async () => {
      if (user?.id) {
        try {
          console.log('🔄 Loading profile from database for user ID:', user.id);
          
          // Try to get profile from database
          const dbProfile = await database.getUserProfile(parseInt(user.id));
          
          if (dbProfile && dbProfile.name) {
            console.log('✅ Found profile in database:', dbProfile);
            
            // Update local state if database has newer/more complete data
            if (dbProfile.name !== user.name || dbProfile.profilePhoto !== user.profilePhoto) {
              console.log('🔄 Updating user from database...');
              
              // Update user context with database data
              updateProfile({  // Changed to updateProfile
                name: dbProfile.name,
                email: dbProfile.email || user.email,
                profilePhoto: dbProfile.profilePhoto || user.profilePhoto
              });
            }
          } else {
            console.log('📭 No profile found in database, using local storage');
          }
        } catch (error) {
          console.log('⚠️ Could not load from database:', error);
        }
      }
    };
    
    loadProfileFromDatabase();
  }, [user?.id, updateProfile]); // Added updateProfile to dependencies
  
  // ========== Debug info ==========
  useEffect(() => {
    console.log('👤 Current user in ProfileScreen:', {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      source: localStorage.getItem('radsafe_user') ? 'localStorage' : 'context'
    });
    
    // Check database connection
    const checkDatabase = async () => {
      const available = await database.isAvailable();
      console.log('🌐 Database available:', available);
    };
    checkDatabase();
  }, [user]);
  
  const sections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', value: user?.name || 'User', target: 'editprofile' },
        { icon: Shield, label: 'Privacy & Security', value: 'High Protection', target: 'privacy' }
      ]
    },
    {
      title: 'System',
      items: [
        { icon: Bell, label: 'Notifications', value: 'All On', target: 'alerts' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Documentation', value: '', target: 'recommendations' },
        { icon: Bot, label: 'AI Assistant', value: 'Ask questions', target: 'chatbot' }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-indigo-700 rounded-full p-1">
            <img 
              src={user?.profilePhoto || "https://picsum.photos/seed/alex/200"} 
              alt="Profile" 
              className="w-full h-full rounded-full border-4 border-white object-cover" 
              onError={(e) => {
                // If image fails to load, use fallback
                e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'user'}`;
              }}
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          {isAdmin ? 'Admin User' : (user?.name || 'User')}
        </h2>
        <p className="text-slate-500 text-sm">
          {isAdmin ? 'System Administrator' : 'Premium Member Since 2024'}
        </p>
        
        {/* Debug info - can remove later */}
        <div className="mt-2 space-y-1 text-xs">
          <div className="text-slate-400">User ID: {user?.id || 'Not set'}</div>
          <div className="text-slate-400">Email: {user?.email || 'Not set'}</div>
        </div>
      </div>

      <div className="space-y-8">
        {isAdmin && (
          <div>
            <h3 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-4 px-2">Management</h3>
            <div className="bg-rose-50 border border-rose-100 rounded-3xl overflow-hidden shadow-sm">
              <button 
                onClick={() => onNavigate('admin')}
                className="w-full flex items-center justify-between p-4 hover:bg-rose-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-rose-500 text-white rounded-xl">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-sm font-bold text-rose-700">Admin Control Panel</span>
                </div>
                <ChevronRight size={18} className="text-rose-400" />
              </button>
            </div>
          </div>
        )}

        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">{section.title}</h3>
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
              {section.items.map((item, iIdx) => (
<button 
                  key={item.label} 
                  onClick={() => item.target && onNavigate(item.target)}
                  className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${
                    iIdx !== section.items.length - 1 ? 'border-b border-slate-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                      <item.icon size={20} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.value && <span className="text-xs text-slate-400">{item.value}</span>}
                    <ChevronRight size={18} className={`text-slate-300 ${!item.target ? 'opacity-20' : ''}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 p-4 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 transition-colors"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
        
       
      </div>
    </div>
  );
};

export default ProfileScreen;