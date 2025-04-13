'use client';

import { useState } from 'react';
import { resetPassword } from '@/lib/actions/auth-actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await resetPassword(token, formData);

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
            <p>Your password has been reset successfully!</p>
          </div>
          
          <Link 
            href="/login" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Go to login
          </Link>
        </div>
      ) : (
        <form action={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Password must be at least 6 characters long
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed dark:disabled:bg-blue-800"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}
