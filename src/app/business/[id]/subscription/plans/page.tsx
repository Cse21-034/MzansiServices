import SubscriptionPlans from '@/app/subscription/SubscriptionPlans';

export const metadata = {
  title: 'Subscription Plans | Namibia Services',
  description: 'Choose the perfect plan for your business',
};

export default function SubscriptionPlansPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { businessId?: string };
}) {
  const businessId = searchParams?.businessId || params.id;

  return (
    <main className="min-h-screen">
      <SubscriptionPlans businessId={businessId} />
    </main>
  );
}
