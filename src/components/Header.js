"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isAuthenticated, logout, getUsername } from '@/lib/auth';

export default function Header() {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUserAuthenticated(isAuthenticated());
    setUsername(getUsername() || '');
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-xl mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-indigo-700">
          Alika Activity Tracker
        </Link>
        <nav className="flex items-center space-x-4">
          {userAuthenticated && (
            <>
              <Link href="/stats" className="text-indigo-600 hover:text-indigo-800">
                Stats
              </Link>
              {/* <div className="flex items-center">
                <span className="text-gray-600 mr-2">{username}</span>
                <button 
                  onClick={handleLogout}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Logout
                </button>
              </div> */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}