import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import { getUserFromSession } from '@/lib/actions/auth-actions';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Forgot Password - The Urlist',
  description: 'Reset your password to regain access to your account',
};

export default async function ForgotPasswordPage() {
  const user = await getUserFromSession();
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect('/lists');
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <ForgotPasswordForm />
    </div>
  );
}
