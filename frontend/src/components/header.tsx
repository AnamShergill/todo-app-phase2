'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-surface-dark border-b border-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">TodoBoom 💥</span>
            </Link>
            <nav className="ml-6 flex space-x-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-secondary hover:text-primary hover:border-primary-action transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-secondary hover:text-primary hover:border-primary-action transition-colors duration-200"
              >
                Boom Assistant
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-secondary hover:text-primary hover:border-primary-action transition-colors duration-200"
              >
                Profile
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-secondary">
                  Welcome, <span className="font-medium text-primary">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="ml-4 inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-danger hover:bg-danger/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger/50 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-dark rounded-xl text-sm font-medium text-secondary bg-surface-dark hover:bg-hover-surface transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary-action hover:bg-primary-hover transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;