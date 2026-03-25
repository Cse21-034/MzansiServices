import SubscriptionManagement from '@/app/subscription/SubscriptionManagement';

export const metadata = {
  title: 'Subscription Management | Namibia Services',
  description: 'Manage your subscription and view features',
};

export default function SubscriptionPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="min-h-screen">
      <SubscriptionManagement businessId={params.id} />
    </main>
  );
}
