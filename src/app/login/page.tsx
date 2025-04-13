import LoginForm from '@/components/LoginForm';
import { getUserFromSession } from '@/lib/actions/auth-actions';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Login - The Urlist',
  description: 'Login to your account to manage your URL lists',
};

export default async function LoginPage() {
  const user = await getUserFromSession();
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect('/lists');
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <LoginForm />
    </div>
  );
}
