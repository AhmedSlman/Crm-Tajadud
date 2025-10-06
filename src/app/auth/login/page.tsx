'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Image from 'next/image';
import Logo from '@/assets/dqdddd.svg';
import StockPattern from '@/assets/stock.svg';
import { LogIn, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0c081e] via-[#1a0f3d] to-[#0c081e] relative">
      {/* Floating background particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#563EB7]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7c5fdc]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6 group">
            <div className="relative">
              <Image 
                src={Logo} 
                alt="Company Logo" 
                width={440} 
                height={60}
                quality={100}
                className="object-contain w-[220px] h-auto transition-all duration-700 group-hover:scale-110 animate-fadeIn filter drop-shadow-[0_0_20px_rgba(124,95,220,0.4)]"
                priority
                unoptimized
              />
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#563EB7]/30 to-[#7c5fdc]/30 blur-2xl opacity-50 group-hover:opacity-100 transition-all duration-700 -z-10 animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Welcome to Tajadud
          </h1>
          <p className="text-gray-400 animate-fadeIn" style={{ animationDelay: '0.3s' }}>Sign in to manage your digital marketing projects</p>
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
            
            {/* Client Portal Link */}
            <div className="mt-4 text-center">
              <Link 
                href="/client-login" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Client? Access your portal here →
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © 2025 Tajadud. All rights reserved.
        </p>
      </div>
    </div>
  );
}

