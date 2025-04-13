'use client';

import { useState } from 'react';
import { forgotPassword } from '@/lib/actions/auth-actions';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await forgotPassword(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    // Show success message
    setSuccess(true);
    setIsLoading(false);
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Reset Your Password</h2>
      
      {success ? (
        <div className="text-center">
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>If an account with that email exists, we've sent a password reset link.</p>
            <p className="mt-2">Please check your email inbox.</p>
          </div>
          
          <Link 
            href="/login" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <form action={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              We'll send a password reset link to this email address.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed dark:disabled:bg-blue-800"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
          
          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
