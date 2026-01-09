'use client';

import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-midnight flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-primary mb-8">
          Welcome To TodoBoom 💥
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-primary">
          Explode your productivity. One task at a time.
        </h2>
        <p className="mt-2 text-center text-sm text-secondary">
          A hackathon-ready todo app that amplifies your productivity
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card py-8 px-4 sm:rounded-xl sm:px-10">
          <div className="space-y-6">
            <div>
              <Link
                href="/register"
                className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-medium text-white bg-primary-action hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-action transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface-dark text-secondary">Or</span>
              </div>
            </div>

            <div>
              <Link
                href="/login"
                className="w-full flex justify-center py-3 px-4 border border-dark rounded-xl text-sm font-medium text-secondary bg-surface-dark hover:bg-hover-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-action transition-all duration-200"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}