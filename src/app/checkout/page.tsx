import CheckoutForm from '@/components/CheckoutForm';
import { getUserFromSession } from '@/lib/actions/auth-actions';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Checkout - The Urlist',
  description: 'Complete your purchase to upgrade your account',
};

export default async function CheckoutPage() {
  // Check if user is logged in
  const user = await getUserFromSession();
  
  if (!user) {
    redirect('/login?redirect=checkout');
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <CheckoutForm />
    </div>
  );
}
