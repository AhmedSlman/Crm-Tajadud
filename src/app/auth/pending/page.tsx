'use client';

import { Clock, Mail, CheckCircle, LogOut } from 'lucide-react';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function PendingApprovalPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0c081e] via-[#1a0f3d] to-[#0c081e]">
      {/* Floating background particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#563EB7]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7c5fdc]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="bg-gradient-to-br from-[#14102a] to-[#1a1333] border border-[#563EB7]/20 rounded-2xl shadow-2xl shadow-black/50 p-8 md:p-12 animate-scaleIn text-center">
          {/* Clock Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full mb-6 relative">
            <Clock className="text-yellow-400" size={40} />
            <div className="absolute inset-0 rounded-full bg-yellow-500/20 animate-ping" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-4">
            Account Pending Approval
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-lg mb-8">
            Thank you for registering! Your account is currently pending approval from an administrator.
          </p>

          {/* Info Cards */}
          <div className="space-y-4 mb-8">
            <div className="bg-[#1a1333]/50 border border-[#563EB7]/10 rounded-xl p-4 text-left">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#563EB7]/20 rounded-lg">
                  <Mail className="text-[#563EB7]" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">Check Your Email</h3>
                  <p className="text-sm text-gray-400">
                    You&apos;ll receive an email notification once your account has been reviewed and approved.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1333]/50 border border-[#563EB7]/10 rounded-xl p-4 text-left">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="text-green-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">What&apos;s Next?</h3>
                  <p className="text-sm text-gray-400">
                    An admin will review your application. This typically takes 24-48 hours. 
                    Once approved, you&apos;ll be able to sign in and start working!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-[#1a1333]/50 border border-[#563EB7]/10 rounded-xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4 text-left">Approval Process</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="text-white" size={16} />
                  </div>
                  <div className="w-0.5 h-8 bg-[#563EB7]/30 my-1" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-white font-medium">Account Created</p>
                  <p className="text-xs text-gray-400">Your registration was successful</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center animate-pulse">
                    <Clock className="text-white" size={16} />
                  </div>
                  <div className="w-0.5 h-8 bg-[#563EB7]/30 my-1" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-white font-medium">Admin Review</p>
                  <p className="text-xs text-gray-400">Waiting for admin approval</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#563EB7]/30 flex items-center justify-center">
                    <CheckCircle className="text-gray-500" size={16} />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-400 font-medium">Account Activated</p>
                  <p className="text-xs text-gray-500">You can start using the system</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/auth/login')}
              variant="primary"
              className="w-full"
            >
              <LogOut size={20} className="mr-2" />
              Back to Login
            </Button>
            <p className="text-sm text-gray-500">
              Need help? Contact{' '}
              <a href="mailto:admin@crm.com" className="text-[#563EB7] hover:text-[#6d4dd4] transition-colors">
                admin@crm.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © 2025 Agency CRM. All rights reserved.
        </p>
      </div>
    </div>
  );
}

