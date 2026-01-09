'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import TaskList from '@/components/task-list';
import TaskFilterBar from '@/components/task-filter-bar';

export default function DashboardPage() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-highlight-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="min-h-screen bg-app">
      <Header />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-highlight-primary to-highlight-secondary">TodoBoom Dashboard</h1>
            <Link
              href="/chat"
              className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-highlight-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight-primary transition-all duration-200 transform hover:-translate-y-0.5 shadow-neon-purple"
            >
              Explode with AI Assistant
            </Link>
          </div>
          <TaskFilterBar />
          <TaskList />
        </div>
      </main>
    </div>
  );
}