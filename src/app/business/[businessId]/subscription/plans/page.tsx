import SubscriptionPlans from '@/app/subscription/SubscriptionPlans';

export const metadata = {
  title: 'Subscription Plans | Namibia Services',
  description: 'Choose the perfect plan for your business',
};

export default function SubscriptionPlansPage({
  searchParams,
}: {
  searchParams: { businessId?: string };
}) {
  const businessId = searchParams?.businessId || '';

  return (
    <main className="min-h-screen">
      <SubscriptionPlans businessId={businessId} />
    </main>
  );
}
