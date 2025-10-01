'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { LogIn, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleDemoLogin = async (email: string, password: string) => {
    setFormData({ email, password });
    setError('');
    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

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
            Welcome Back
          </h1>
          <p className="text-gray-400">Sign in to your CRM account</p>
        </div>

        {/* Login Card */}
        <div className="bg-gradient-to-br from-[#14102a] to-[#1a1333] border border-[#563EB7]/20 rounded-2xl shadow-2xl shadow-black/50 p-8 animate-slideIn">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Email */}
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#563EB7]/30 bg-[#1a1333] checked:bg-[#563EB7] focus:ring-[#563EB7] focus:ring-2"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#563EB7] hover:text-[#6d4dd4] transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} className="mr-2" />
                  Sign In
                </>
              )}
            </Button>

            {/* Demo Accounts Toggle */}
            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="w-full text-sm text-gray-400 hover:text-[#563EB7] transition-colors"
            >
              {showDemoAccounts ? 'Hide' : 'Show'} Demo Accounts
            </button>

            {/* Demo Accounts */}
            {showDemoAccounts && (
              <div className="space-y-2 p-4 bg-[#1a1333]/50 rounded-xl border border-[#563EB7]/10 animate-fadeIn">
                <p className="text-xs text-gray-400 mb-3 font-medium">Quick Login (Demo):</p>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin@crm.com', 'admin123')}
                  className="w-full text-left px-3 py-2 bg-[#563EB7]/10 hover:bg-[#563EB7]/20 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">Admin Account</p>
                      <p className="text-xs text-gray-400">admin@crm.com / admin123</p>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('ahmed@crm.com', '123456')}
                  className="w-full text-left px-3 py-2 bg-[#563EB7]/10 hover:bg-[#563EB7]/20 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">Graphic Designer</p>
                      <p className="text-xs text-gray-400">ahmed@crm.com / 123456</p>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('sara@crm.com', '123456')}
                  className="w-full text-left px-3 py-2 bg-[#563EB7]/10 hover:bg-[#563EB7]/20 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">Social Media</p>
                      <p className="text-xs text-gray-400">sara@crm.com / 123456</p>
                    </div>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Pending</span>
                  </div>
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#563EB7]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#14102a] text-gray-400">Don&apos;t have an account?</span>
              </div>
            </div>

            {/* Register Link */}
            <Link href="/auth/register">
              <Button variant="secondary" className="w-full">
                Create New Account
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

