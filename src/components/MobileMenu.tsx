'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiLogOut, FiLogIn, FiUser, FiList, FiHome, FiDollarSign } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { logout, getUserFromSession } from '@/lib/actions/auth-actions';
import { getSubscriptionStatus } from '@/lib/actions/payment-actions';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch user data client-side
        const userData = await fetch('/api/user').then(res => res.json());
        setUser(userData.user || null);
        
        if (userData.user) {
          const subStatus = await fetch('/api/subscription').then(res => res.json());
          setSubscription(subStatus.subscription || null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setSubscription(null);
    toggleMenu();
    window.location.href = '/';
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleMenu}
        className="p-2 rounded-full text-gray-600 dark:text-gray-300 focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-12 w-64 glass rounded-xl shadow-lg py-4 border border-gray-100 dark:border-gray-800 z-50">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center"
              onClick={toggleMenu}
            >
              <FiHome className="mr-2" /> Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/lists" 
                  className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center"
                  onClick={toggleMenu}
                >
                  <FiList className="mr-2" /> My Lists
                </Link>
                
                {subscription?.isSubscribed ? (
                  <div className="px-6 py-2 text-green-600 dark:text-green-400 flex items-center">
                    <FiUser className="mr-2" /> 
                    Premium {subscription.isLifetime ? 'Lifetime' : 'Member'}
                  </div>
                ) : (
                  <Link 
                    href="/pricing" 
                    className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center"
                    onClick={toggleMenu}
                  >
                    <FiDollarSign className="mr-2" /> Upgrade to Premium
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors text-left flex items-center"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center"
                  onClick={toggleMenu}
                >
                  <FiLogIn className="mr-2" /> Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center"
                  onClick={toggleMenu}
                >
                  <FiUser className="mr-2" /> Register
                </Link>
                <Link 
                  href="/pricing" 
                  className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center"
                  onClick={toggleMenu}
                >
                  <FiDollarSign className="mr-2" /> Pricing
                </Link>
              </>
            )}
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            
            <Link 
              href="/privacy" 
              className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-sm"
              onClick={toggleMenu}
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-sm"
              onClick={toggleMenu}
            >
              Terms of Service
            </Link>
            
            <div className="px-6 py-2 flex items-center">
              <span className="text-gray-600 dark:text-gray-300 mr-2">Theme:</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
