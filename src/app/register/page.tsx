import RegisterForm from '@/components/RegisterForm';
import { getUserFromSession } from '@/lib/actions/auth-actions';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Register - The Urlist',
  description: 'Create an account to start managing your URL lists',
};

export default async function RegisterPage() {
  const user = await getUserFromSession();
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect('/lists');
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <RegisterForm />
    </div>
  );
}
