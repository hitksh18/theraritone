import React, { useState } from 'react';
import { Bell, Shield, User, MapPin, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ToastContainer';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    scanReminders: true
  });
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: ''
  });
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      address: '123 Main St, Mumbai, Maharashtra 400001',
      isDefault: true,
      isEditing: false
    }
  ]);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);

  const handleSavePersonalInfo = () => {
    showToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your personal information has been updated successfully!'
    });
  };

  const handleChangePassword = () => {
    showToast({
      type: 'info',
      title: 'Password Change',
      message: 'Password change functionality will be available soon.'
    });
  };

  const handleEditAddress = (addressId: number) => {
    setEditingAddress(addressId);
    setAddresses(prev => prev.map(addr => 
      addr.id === addressId ? { ...addr, isEditing: true } : addr
    ));
  };

  const handleSaveAddress = (addressId: number) => {
    setEditingAddress(null);
    setAddresses(prev => prev.map(addr => 
      addr.id === addressId ? { ...addr, isEditing: false } : addr
    ));
    showToast({
      type: 'success',
      title: 'Address Updated',
      message: 'Your address has been updated successfully!'
    });
  };

  const handleAddressChange = (addressId: number, newAddress: string) => {
    setAddresses(prev => prev.map(addr => 
      addr.id === addressId ? { ...addr, address: newAddress } : addr
    ));
  };

  const handleDownloadData = () => {
    showToast({
      type: 'info',
      title: 'Data Download',
      message: 'Your data download will be ready shortly. Check your email for the download link.'
    });
  };

  const handleDeleteAccount = () => {
    showToast({
      type: 'warning',
      title: 'Account Deletion',
      message: 'Please contact support to delete your account. This action cannot be undone.'
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        onSearchOpen={() => {}}
        onCartOpen={() => {}}
        pageTitle="Settings"
        showBackButton={true}
      />

      <div className="pt-20 max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="luxury-card rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="name" className="text-[var(--text-primary)]">Full Name</Label>
                <Input
                  id="name"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                  className="mt-1 luxury-input"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-[var(--text-primary)]">Email</Label>
                <Input
                  id="email"
                  value={personalInfo.email}
                  disabled
                  className="mt-1 luxury-input opacity-50"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-[var(--text-primary)]">Phone Number</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  className="mt-1 luxury-input"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={handleSavePersonalInfo} 
                className="btn-primary"
              >
                Save Changes
              </Button>
              <Button 
                onClick={handleChangePassword} 
                className="btn-secondary"
              >
                Change Password
              </Button>
            </div>
          </div>

          {/* Delivery Addresses */}
          <div className="luxury-card rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center">
              <MapPin className="mr-2" size={20} />
              Delivery Addresses
            </h2>
            
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="border border-[var(--border-color)] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-[var(--text-primary)]">{address.type}</span>
                        {address.isDefault && (
                          <span className="text-xs px-2 py-1 rounded font-medium bg-[var(--primary-accent)] text-black">
                            Default
                          </span>
                        )}
                      </div>
                      {address.isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={address.address}
                            onChange={(e) => handleAddressChange(address.id, e.target.value)}
                            className="w-full luxury-input"
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <Button 
                              onClick={() => handleSaveAddress(address.id)}
                              size="sm" 
                              className="btn-primary"
                            >
                              Save
                            </Button>
                            <Button 
                              onClick={() => {
                                setEditingAddress(null);
                                setAddresses(prev => prev.map(addr => 
                                  addr.id === address.id ? { ...addr, isEditing: false } : addr
                                ));
                              }}
                              size="sm" 
                              className="btn-secondary"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[var(--secondary-accent)] text-sm">{address.address}</p>
                      )}
                    </div>
                    {!address.isEditing && (
                      <Button 
                        onClick={() => handleEditAddress(address.id)}
                        size="sm" 
                        className="btn-secondary flex items-center space-x-1"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full btn-secondary"
                onClick={() => {
                  showToast({
                    type: 'info',
                    title: 'Add Address',
                    message: 'Address management feature will be available soon.'
                  });
                }}
              >
                Add New Address
              </Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="luxury-card rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center">
              <Bell className="mr-2" size={20} />
              Notification Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[var(--text-primary)]">Order Updates</Label>
                  <p className="text-sm text-[var(--secondary-accent)]">Get notified about order status changes</p>
                </div>
                <Switch
                  checked={notifications.orderUpdates}
                  onCheckedChange={(checked) => {
                    setNotifications({...notifications, orderUpdates: checked});
                    showToast({
                      type: 'success',
                      title: 'Notification Updated',
                      message: `Order updates ${checked ? 'enabled' : 'disabled'}.`
                    });
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[var(--text-primary)]">Promotions</Label>
                  <p className="text-sm text-[var(--secondary-accent)]">Receive promotional offers and discounts</p>
                </div>
                <Switch
                  checked={notifications.promotions}
                  onCheckedChange={(checked) => {
                    setNotifications({...notifications, promotions: checked});
                    showToast({
                      type: 'success',
                      title: 'Notification Updated',
                      message: `Promotions ${checked ? 'enabled' : 'disabled'}.`
                    });
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[var(--text-primary)]">Scan Reminders</Label>
                  <p className="text-sm text-[var(--secondary-accent)]">Reminders to update your body scan</p>
                </div>
                <Switch
                  checked={notifications.scanReminders}
                  onCheckedChange={(checked) => {
                    setNotifications({...notifications, scanReminders: checked});
                    showToast({
                      type: 'success',
                      title: 'Notification Updated',
                      message: `Scan reminders ${checked ? 'enabled' : 'disabled'}.`
                    });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="luxury-card rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center">
              <Shield className="mr-2" size={20} />
              Privacy & Security
            </h2>
            
            <div className="space-y-4">
              <Button 
                onClick={handleDownloadData}
                className="w-full justify-start btn-secondary"
              >
                Download My Data
              </Button>
              <Button 
                onClick={() => navigate('/quick-links')}
                className="w-full justify-start btn-secondary"
              >
                Privacy Policy
              </Button>
              <Button 
                onClick={() => navigate('/quick-links')}
                className="w-full justify-start btn-secondary"
              >
                Terms of Service
              </Button>
              <Button 
                onClick={handleDeleteAccount}
                className="w-full justify-start bg-[var(--error-color)] text-white hover:bg-red-700 rounded-xl px-4 py-2"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;