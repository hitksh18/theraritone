import React, { useState } from 'react';
import { User, Edit, LogOut, ShoppingBag, Clock, Settings, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ToastContainer';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Profile = () => {
  const { user, logout, cart } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    stylePreference: '',
    gender: ''
  });

  const handleSave = () => {
    setIsEditing(false);
    showToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile has been updated successfully!'
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast({
        type: 'success',
        title: 'Logged Out',
        message: 'You have been logged out successfully.'
      });
      navigate('/');
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Logout Failed',
        message: 'Failed to logout. Please try again.'
      });
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen">
      <Navbar 
        onSearchOpen={() => {}}
        onCartOpen={() => {}}
        pageTitle="Profile"
        showBackButton={true}
      />
      
      <div className="pt-20 max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="luxury-card rounded-lg p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 luxury-card rounded-full flex items-center justify-center">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={24} className="text-[var(--text-primary)]" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{profile.name || 'User Profile'}</h2>
                    <p className="text-[var(--secondary-accent)]">{profile.email}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Edit size={16} />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-[var(--text-primary)]">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    disabled={!isEditing}
                    className="mt-1 luxury-input"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-[var(--text-primary)]">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="mt-1 luxury-input opacity-50"
                  />
                </div>

                <div>
                  <Label htmlFor="stylePreference" className="text-[var(--text-primary)]">Style Preference</Label>
                  <select
                    id="stylePreference"
                    value={profile.stylePreference}
                    onChange={(e) => setProfile({...profile, stylePreference: e.target.value})}
                    disabled={!isEditing}
                    className="mt-1 w-full luxury-input"
                  >
                    <option value="">Select Style</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Streetwear">Streetwear</option>
                    <option value="Classic">Classic</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="gender" className="text-[var(--text-primary)]">Gender</Label>
                  <select
                    id="gender"
                    value={profile.gender}
                    onChange={(e) => setProfile({...profile, gender: e.target.value})}
                    disabled={!isEditing}
                    className="mt-1 w-full luxury-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex space-x-4">
                  <Button 
                    onClick={handleSave} 
                    className="btn-primary"
                  >
                    Save Changes
                  </Button>
                  <Button 
                    onClick={() => setIsEditing(false)} 
                    className="btn-secondary"
                  >
                    Cancel
                  </Button>
                </div>
              )}

              <div className="mt-8 pt-8 section-divider border-t">
                <Button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-[var(--error-color)] text-white hover:bg-red-700 rounded-xl px-4 py-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions & Cart Overview */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="luxury-card rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/orders')}
                  className="w-full justify-start btn-secondary"
                >
                  <Clock className="mr-2" size={16} />
                  Order History
                </Button>
                
                <Button
                  onClick={() => navigate('/wishlist')}
                  className="w-full justify-start btn-secondary"
                >
                  <Heart className="mr-2" size={16} />
                  Saved Collections
                </Button>
                
                <Button
                  onClick={() => navigate('/settings')}
                  className="w-full justify-start btn-secondary"
                >
                  <Settings className="mr-2" size={16} />
                  Settings
                </Button>
              </div>
            </div>

            {/* Cart Overview */}
            {cart.length > 0 && (
              <div className="luxury-card rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center">
                  <ShoppingBag className="mr-2" size={16} />
                  Cart Overview
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[var(--secondary-accent)]">Items:</span>
                    <span className="font-medium text-[var(--text-primary)]">{cart.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-[var(--secondary-accent)]">Total:</span>
                    <span className="font-medium text-[var(--text-primary)]">₹{cartTotal}</span>
                  </div>
                  
                  <Button
                    onClick={() => navigate('/cart')}
                    className="w-full btn-primary"
                  >
                    View Cart
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;