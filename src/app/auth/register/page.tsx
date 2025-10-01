'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { UserPlus, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: '' as UserRole | '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.role) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role as UserRole,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const roleOptions = [
    { value: '', label: 'Select your role' },
    { value: 'account-manager', label: '👔 Account Manager' },
    { value: 'graphic-designer', label: '🎨 Graphic Designer' },
    { value: 'social-media', label: '📱 Social Media Specialist' },
    { value: 'content-writer', label: '✍️ Content Writer' },
    { value: 'video-editor', label: '🎬 Video Editor' },
    { value: 'ads-specialist', label: '📢 Ads Specialist' },
    { value: 'seo-specialist', label: '🔍 SEO Specialist' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0c081e] via-[#1a0f3d] to-[#0c081e]">
      {/* Floating background particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#563EB7]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7c5fdc]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#563EB7] to-[#7c5fdc] rounded-2xl shadow-2xl shadow-[#563EB7]/50 mb-4 animate-fadeIn">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2">
            Join Our Team
          </h1>
          <p className="text-gray-400">Create your employee account</p>
        </div>

        {/* Register Card */}
        <div className="bg-gradient-to-br from-[#14102a] to-[#1a1333] border border-[#563EB7]/20 rounded-2xl shadow-2xl shadow-black/50 p-8 animate-slideIn">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
                <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-green-400 text-sm font-medium">
                    Registration successful! Redirecting to pending approval page...
                  </p>
                </div>
              </div>
            )}

            {/* Full Name */}
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ahmed Hassan"
              required
            />

            {/* Email */}
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ahmed@example.com"
              required
            />

            {/* Phone */}
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+20 123 456 7890"
              required
            />

            {/* Role Selection */}
            <Select
              label="Your Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              options={roleOptions}
              required
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="At least 6 characters"
              required
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Re-enter your password"
              required
            />

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-blue-400 text-sm">
                <strong>📌 Note:</strong> Your account will be pending until approved by an admin. 
                You&apos;ll be notified once your account is activated.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Account...
                </>
              ) : success ? (
                <>
                  <CheckCircle size={20} className="mr-2" />
                  Redirecting...
                </>
              ) : (
                <>
                  <UserPlus size={20} className="mr-2" />
                  Create Account
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#563EB7]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#14102a] text-gray-400">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link href="/auth/login">
              <Button variant="secondary" className="w-full">
                Sign In Instead
              </Button>
            </Link>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © 2025 Agency CRM. All rights reserved.
        </p>
      </div>
    </div>
  );
}

