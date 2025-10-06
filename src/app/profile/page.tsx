'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Camera, User as UserIcon, Mail, Phone, Briefcase, Upload, X } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { getAvatarUrl } from '@/lib/config';

export default function ProfilePage() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    try {
      setUploading(true);
      
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload
      const response = await api.auth.uploadAvatar(file);
      
      // Update local storage
      const updatedUser = { ...user, avatar: response.avatar_url || response.avatar };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Profile picture updated successfully!');
      
      // Reload page to update everywhere
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload profile picture');
      setAvatarPreview(user?.avatar || '');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    try {
      setUploading(true);
      const response = await api.auth.deleteAvatar();
      
      // Update local storage
      const updatedUser = { ...user, avatar: response.avatar };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAvatarPreview(response.avatar);
      
      toast.success('Profile picture removed');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to remove profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your personal information</p>
        </div>

        {/* Profile Picture Card */}
        <Card title="Profile Picture" hover={false}>
          <div className="flex items-center gap-8">
            {/* Avatar Display */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-[#563EB7]/20 border-4 border-[#563EB7]/30">
                {avatarPreview ? (
                  <img
                    src={getAvatarUrl(avatarPreview)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Camera Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#563EB7] hover:bg-[#6B4EC7] rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                title="Change picture"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Camera size={20} className="text-white" />
                )}
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Info & Actions */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">{user?.name}</h3>
              <p className="text-gray-400 mb-4">{user?.email}</p>
              
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload size={16} className="mr-2" />
                  Upload New Picture
                </Button>
                
                {avatarPreview && !avatarPreview.includes('dicebear.com') && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDeleteAvatar}
                    disabled={uploading}
                  >
                    <X size={16} className="mr-2" />
                    Remove Picture
                  </Button>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-3">
                Supported formats: JPG, PNG, GIF (Max 2MB)
              </p>
            </div>
          </div>
        </Card>

        {/* Profile Information */}
        <Card title="Personal Information" hover={false}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <UserIcon size={16} />
                <span className="text-sm font-medium">Full Name</span>
              </div>
              <p className="text-white font-semibold">{user?.name}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Mail size={16} />
                <span className="text-sm font-medium">Email</span>
              </div>
              <p className="text-white font-semibold">{user?.email}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Phone size={16} />
                <span className="text-sm font-medium">Phone</span>
              </div>
              <p className="text-white font-semibold">{user && 'phone' in user ? (user as { phone?: string }).phone || 'Not provided' : 'Not provided'}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Briefcase size={16} />
                <span className="text-sm font-medium">Role</span>
              </div>
              <p className="text-white font-semibold capitalize">
                {user?.role?.replace('-', ' ')}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
