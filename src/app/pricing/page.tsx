import PricingPlans from '@/components/PricingPlans';

export const metadata = {
  title: 'Pricing - The Urlist',
  description: 'Choose the right plan for managing your URL collections',
};

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PricingPlans />
    </div>
  );
}
