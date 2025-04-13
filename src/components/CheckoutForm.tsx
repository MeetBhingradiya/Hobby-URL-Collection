'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createUpiPaymentIntent } from '@/lib/actions/payment-actions';
import { getSubscriptionPlan } from '@/lib/data/subscription-plans';
import Image from 'next/image';

export default function CheckoutForm() {
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  
  const plan = planId ? getSubscriptionPlan(planId) : null;

  useEffect(() => {
    if (!plan) {
      router.push('/pricing');
    }
  }, [plan, router]);

  if (!plan) {
    return <div className="text-center p-8">Loading...</div>;
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createUpiPaymentIntent(formData);
      
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      
      setPaymentData(result.paymentData);
      setLoading(false);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const copyUpiUrl = () => {
    if (paymentData?.upiUrl) {
      navigator.clipboard.writeText(paymentData.upiUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Checkout</h2>
      
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white">Order Summary</h3>
        <div className="mt-2 flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">{plan.name}</span>
          <span className="text-gray-900 dark:text-white">₹{plan.price}</span>
        </div>
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {plan.type === 'monthly' 
            ? 'Monthly subscription' 
            : plan.type === 'yearly' 
              ? 'Yearly subscription' 
              : 'Lifetime access'}
        </div>
      </div>
      
      {paymentData ? (
        <div className="text-center">          <div className="mb-6 bg-white p-4 rounded-lg mx-auto w-fit">
            {paymentData.qrData ? (
              <Image 
                src={paymentData.qrData} 
                alt="UPI QR Code" 
                width={200} 
                height={200} 
                className="mx-auto"
                unoptimized
              />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-sm">QR Code unavailable</p>
              </div>
            )}
          </div>
          
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Scan the QR code using any UPI app to complete payment
          </p>
          
          <div className="flex items-center justify-between mb-6 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="truncate flex-1 text-gray-700 dark:text-gray-300 font-mono text-sm">
              {paymentData.upiUrl}
            </div>
            <button
              type="button"
              onClick={copyUpiUrl}
              className="ml-2 p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              {copied ? (
                <span className="text-green-600 dark:text-green-400">Copied!</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
            <p>Amount: ₹{paymentData.amount}</p>
            <p className="mt-1">After payment, your account will be upgraded automatically.</p>
          </div>
            <button
            type="button"
            onClick={() => router.push('/lists')}
            className="mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            I've completed the payment
          </button>
        </div>
      ) : (
        <form action={handleSubmit}>
          <input type="hidden" name="planId" value={planId || ''} />
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your UPI ID (Optional)
            </label>
            <input
              type="text"
              id="upiId"
              name="upiId"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              This helps us match your payment. Leave blank if you'll scan the QR code.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>
      )}
    </div>
  );
}
