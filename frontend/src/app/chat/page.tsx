'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/header';
import ChatInterface from '@/components/chat-interface';

export default function ChatPage() {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-surface border-neon">
            <div className="px-4 py-5 sm:px-6 border-b border-neon">
              <h3 className="text-lg leading-6 font-medium text-primary">Task Assistant Chat</h3>
              <p className="mt-1 text-sm text-muted">Chat with your AI task assistant</p>
            </div>
            <div className="p-6">
              <ChatInterface />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}