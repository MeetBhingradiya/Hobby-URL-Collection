'use client';

import { useState } from 'react';
import { login } from '@/lib/actions/auth-actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await login(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    // Redirect to dashboard on successful login
    router.push('/lists');
    router.refresh();
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Login to Your Account</h2>
      
      <form action={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Link 
              href="/forgot-password" 
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed dark:disabled:bg-blue-800"
        >
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link 
            href="/register" 
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
