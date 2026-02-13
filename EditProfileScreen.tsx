import React, { useState, useEffect } from 'react';
import { User, Camera, Save, ArrowLeft } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { database } from '../services/database';

interface EditProfileScreenProps {
  onBack: () => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ onBack }) => {
  const { user, updateProfile } = useUser();  // Changed from updateUser to updateProfile
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Sync local state with user context
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setProfilePhoto(user.profilePhoto || '');
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);

    try {
      const updatedProfile = {
        name,
        email,
        profilePhoto: profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        phone: user?.phone || '',
        updatedAt: new Date().toISOString()
      };

      console.log('🔄 Saving profile:', updatedProfile);
      console.log('👤 User ID:', user?.id);

      // 1. Update in context (saves to localStorage)
      updateProfile(updatedProfile);  // FIXED: Changed updateUser to updateProfile
      console.log('✅ Saved to localStorage');

      // 2. Try to save to database (optional - won't break if fails)
      if (user?.id) {
        try {
          console.log('🌐 Checking database availability...');
          const dbAvailable = await database.isAvailable();
          console.log('📊 Database available:', dbAvailable);
          
          if (dbAvailable) {
            console.log('💾 Saving to database...');
            await database.saveUserProfile(parseInt(user.id), updatedProfile);
            console.log('✅ Saved to database');
            
            // Also save to profiles collection
            await database.saveProfile({
              userId: parseInt(user.id),
              ...updatedProfile
            });
            console.log('✅ Saved to profiles collection');
          } else {
            console.log('⚠️ Database not available, using localStorage only');
          }
        } catch (dbError) {
          console.log('❌ Database error:', dbError);
        }
      } else {
        console.log('⚠️ No user ID found, skipping database save');
      }

      setMessage('✅ Profile updated successfully!');
      
      // Go back after 1.5 seconds
      setTimeout(() => {
        console.log('↩️ Navigating back to profile screen');
        onBack();
      }, 1500);

    } catch (error) {
      console.log('❌ Profile save error:', error);
      setMessage('❌ Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button onClick={onBack} className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>

        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden">
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={48} className="text-slate-400" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700">
              <Camera size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-slate-500 mt-2">Click camera to upload photo</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Demo Photo URLs */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quick Profile Photos (Click to select)
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley'
              ].map((url, index) => (
                <button
                  key={index}
                  onClick={() => setProfilePhoto(url)}
                  className="flex-shrink-0"
                >
                  <img 
                    src={url} 
                    alt="Avatar" 
                    className="w-16 h-16 rounded-full border-2 border-transparent hover:border-indigo-500"
                  />
                </button>
              ))}
            </div>
          </div>

          {message && (
            <div className="text-green-600 bg-green-50 p-3 rounded-lg">
              {message}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save size={20} className="mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* User Info */}
        <div className="mt-8 p-4 bg-slate-50 rounded-lg">
          <h3 className="font-medium mb-2">Current User Info:</h3>
          <p className="text-sm text-slate-600">
            <strong>Name:</strong> {user?.name}<br/>
            <strong>Email:</strong> {user?.email}<br/>
            <strong>ID:</strong> {user?.id}<br/>
            <strong>Role:</strong> {user?.role}
          </p>
        </div>
        
        {/* Debug Info (remove in production) */}
        
      </div>
    </div>
  );
};

export default EditProfileScreen;