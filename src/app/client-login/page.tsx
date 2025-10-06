'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Image from 'next/image';
import Logo from '@/assets/dqdddd.svg';
import StockPattern from '@/assets/stock.svg';
import { Building2, Lock, Mail, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ClientUser } from '@/types';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';

export default function ClientLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // استخدام API الحقيقي
      const client = await authAPI.clientLogin(formData);

      toast.success(`Welcome back, ${client.name}! 👋`, {
        description: 'Redirecting to your dashboard...',
      });

      // Redirect to client dashboard
      router.push('/client-dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({ email, password });
    setTimeout(() => {
      const submitEvent = {
        preventDefault: () => {},
      } as React.FormEvent;
      handleSubmit(submitEvent);
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0c081e] via-[#1a0f3d] to-[#0c081e] relative">
      {/* Floating background particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Side - Branding */}
        <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6 p-8">
          <div className="flex items-center justify-center mb-4 group">
            <div className="relative">
              <Image 
                src={Logo} 
                alt="Company Logo" 
                width={480} 
                height={70}
                quality={100}
                className="object-contain w-[240px] h-auto transition-all duration-700 group-hover:scale-110 animate-fadeIn filter drop-shadow-[0_0_25px_rgba(124,95,220,0.5)]"
                priority
                unoptimized
              />
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#563EB7]/30 to-[#7c5fdc]/30 blur-2xl opacity-50 group-hover:opacity-100 transition-all duration-700 -z-10 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-3 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-[#563EB7] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg shadow-[#563EB7]/50">
              <Building2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Client Portal</h1>
              <p className="text-sm text-gray-400">Track Your Projects</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent leading-tight">
              Welcome to Your
              <br />
              <span className="text-[#563EB7]">Project Dashboard</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-md">
              Stay updated on your projects, track progress, and review content - all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md">
            <div className="bg-[#563EB7]/10 border border-[#563EB7]/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#563EB7] mb-1">24/7</div>
              <div className="text-xs text-gray-400">Access</div>
            </div>
            <div className="bg-[#563EB7]/10 border border-[#563EB7]/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#563EB7] mb-1">Real-time</div>
              <div className="text-xs text-gray-400">Updates</div>
            </div>
            <div className="bg-[#563EB7]/10 border border-[#563EB7]/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#563EB7] mb-1">Secure</div>
              <div className="text-xs text-gray-400">Platform</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-[#14102a]/80 backdrop-blur-xl border border-[#563EB7]/20 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#563EB7] to-[#8B5CF6] rounded-2xl mb-4">
                  <Lock className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Client Login</h3>
                <p className="text-gray-400">Access your project dashboard</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-12"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#563EB7] to-[#8B5CF6] hover:from-[#4c35a4] hover:to-[#7c3aed] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles size={20} />
                      Sign In to Dashboard
                    </div>
                  )}
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="mt-8 pt-6 border-t border-[#563EB7]/20">
                <p className="text-center text-sm text-gray-400 mb-4">Demo Client Accounts</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('mohamed@techstart.com', '123456')}
                    className="w-full text-left px-3 py-2 bg-[#563EB7]/10 hover:bg-[#563EB7]/20 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white font-medium">TechStart Solutions</p>
                        <p className="text-xs text-gray-400">mohamed@techstart.com / 123456</p>
                      </div>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('sarah@greenlife.com', '123456')}
                    className="w-full text-left px-3 py-2 bg-[#563EB7]/10 hover:bg-[#563EB7]/20 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white font-medium">GreenLife Organic</p>
                        <p className="text-xs text-gray-400">sarah@greenlife.com / 123456</p>
                      </div>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('omar@urbanstyle.com', '123456')}
                    className="w-full text-left px-3 py-2 bg-[#563EB7]/10 hover:bg-[#563EB7]/20 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white font-medium">Urban Style Fashion</p>
                        <p className="text-xs text-gray-400">omar@urbanstyle.com / 123456</p>
                      </div>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link 
                  href="/auth/login" 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Team Member? Login here →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
