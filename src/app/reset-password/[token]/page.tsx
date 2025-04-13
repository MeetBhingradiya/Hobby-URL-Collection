import ResetPasswordForm from '@/components/ResetPasswordForm';
import { getUserFromSession } from '@/lib/actions/auth-actions';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Reset Password - The Urlist',
  description: 'Create a new password for your account',
};

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const user = await getUserFromSession();
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect('/lists');
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <ResetPasswordForm token={params.token} />
    </div>
  );
}
