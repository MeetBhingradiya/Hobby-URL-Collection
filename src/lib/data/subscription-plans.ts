// Subscription plan interface
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  type: 'monthly' | 'yearly' | 'lifetime';
}

// Available subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    description: 'Unlimited lists with premium features',
    price: 299, // in INR
    duration: 30, // 30 days
    type: 'monthly',
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yearly',
    description: 'Unlimited lists with premium features, save 20%',
    price: 2999, // in INR
    duration: 365, // 365 days
    type: 'yearly',
  },
  {
    id: 'premium-lifetime',
    name: 'Premium Lifetime',
    description: 'Unlimited lists with premium features forever',
    price: 7999, // in INR
    duration: 36500, // ~100 years (effectively lifetime)
    type: 'lifetime',
  },
];

// Helper function to get subscription plan by ID
export function getSubscriptionPlan(planId: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find(plan => plan.id === planId);
}
