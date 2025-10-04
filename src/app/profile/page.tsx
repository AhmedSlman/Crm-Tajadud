'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { User, Mail, Phone, Briefcase, Save, Key } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: (user as any)?.phone || '',
    department: (user as any)?.department || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      
      await api.auth.updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        department: profileData.department,
      });

      toast.success('تم تحديث الملف الشخصي بنجاح! ✅');
      setIsEditing(false);
      
      // إعادة تحميل الصفحة لتحديث البيانات
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('فشل في تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    try {
      setLoading(true);
      
      await api.auth.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );

      toast.success('تم تغيير كلمة المرور بنجاح! ✅');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('فشل في تغيير كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2">
          My Profile
        </h1>
        <p className="text-gray-400 text-lg">Manage your account settings and preferences</p>
      </div>

      {/* Profile Information */}
      <Card title="Profile Information">
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#563EB7] to-[#7c5fdc] flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
              <p className="text-gray-400">{user?.email}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <User size={16} className="inline mr-2" />
                Full Name
              </label>
              <Input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <Input
                type="email"
                value={user?.email || ''}
                disabled
                className="opacity-50"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <Phone size={16} className="inline mr-2" />
                Phone
              </label>
              <Input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <Briefcase size={16} className="inline mr-2" />
                Department
              </label>
              <Input
                type="text"
                value={profileData.department}
                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button onClick={handleUpdateProfile} disabled={loading}>
                  <Save size={16} className="mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setIsEditing(false);
                    setProfileData({
                      name: user?.name || '',
                      phone: (user as any)?.phone || '',
                      department: (user as any)?.department || '',
                    });
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card title="Change Password">
        {!isChangingPassword ? (
          <div>
            <p className="text-gray-400 mb-4">
              Keep your account secure by regularly updating your password
            </p>
            <Button onClick={() => setIsChangingPassword(true)}>
              <Key size={16} className="mr-2" />
              Change Password
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="Enter your current password"
            />

            <Input
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="Enter new password (min 6 characters)"
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
            />

            <div className="flex gap-3">
              <Button onClick={handleChangePassword} disabled={loading}>
                <Save size={16} className="mr-2" />
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Account Information */}
      <Card title="Account Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Role:</span>
            <span className="text-white ml-2 font-medium">{user?.role}</span>
          </div>
          <div>
            <span className="text-gray-400">Status:</span>
            <span className="text-white ml-2 font-medium">{user?.status}</span>
          </div>
          <div>
            <span className="text-gray-400">Member Since:</span>
            <span className="text-white ml-2 font-medium">
              {(user as any)?.joinedAt || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Approved By:</span>
            <span className="text-white ml-2 font-medium">
              {(user as any)?.approvedBy || 'N/A'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
