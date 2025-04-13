'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { subscriptionPlans } from '@/lib/data/subscription-plans';
import { getUserFromSession } from '@/lib/actions/auth-actions';

export default function PricingPlans() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    router.push(`/checkout?plan=${planId}`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Choose the right plan for you
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
            All plans include unlimited public access to your lists
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6 flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Free</h3>
              <p className="mt-4 text-gray-500 dark:text-gray-400">The basics to get started with sharing links.</p>
              <div className="mt-6 mb-4">
                <p className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">₹0</span>
                  <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">/forever</span>
                </p>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700 dark:text-gray-300">1 List</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700 dark:text-gray-300">Basic features</p>
                </li>
              </ul>
            </div>
            <button
              type="button"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={() => router.push('/register')}
            >
              Get started for free
            </button>
          </div>

          {/* Subscription Plans */}
          {subscriptionPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white dark:bg-gray-800 border ${
                plan.type === 'lifetime' 
                  ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400' 
                  : 'border-gray-200 dark:border-gray-700'
              } rounded-lg shadow-md p-6 flex flex-col`}
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                {plan.type === 'lifetime' && (
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-2">
                    Most Popular
                  </span>
                )}
                <p className="mt-4 text-gray-500 dark:text-gray-400">{plan.description}</p>
                <div className="mt-6 mb-4">
                  <p className="flex items-baseline">
                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">₹{plan.price}</span>
                    <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                      {plan.type === 'monthly' ? '/month' : plan.type === 'yearly' ? '/year' : '/lifetime'}
                    </span>
                  </p>
                </div>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700 dark:text-gray-300">Unlimited lists</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700 dark:text-gray-300">Priority support</p>
                  </li>
                  {plan.type === 'lifetime' && (
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-gray-700 dark:text-gray-300">Pay once, use forever</p>
                    </li>
                  )}
                </ul>
              </div>
              <button
                type="button"
                className={`mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md ${
                  plan.type === 'lifetime'
                    ? 'text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                    : 'text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500'
                }`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.type === 'lifetime' ? 'Get lifetime access' : `Subscribe ${plan.type === 'monthly' ? 'monthly' : 'yearly'}`}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-base text-gray-500 dark:text-gray-400">
            Have questions? Contact us at <a href="mailto:support@theurlist.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@theurlist.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
