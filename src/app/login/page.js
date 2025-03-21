"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">
            Alika Activity Tracker
          </h1>
          <p className="mt-2 text-gray-600">
            Login to access your baby's activity tracking
          </p>
        </div>
        
        <LoginForm />
      </div>
    </main>
  );
} 