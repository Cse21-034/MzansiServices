import PaymentSuccess from '@/app/subscription/PaymentSuccess';

export const metadata = {
  title: 'Payment Status | Namibia Services',
  description: 'View your payment status',
};

export default function PaymentSuccessPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    reference?: string;
    status?: string;
    businessId?: string;
  };
}) {
  return (
    <main className="min-h-screen">
      <PaymentSuccess searchParams={searchParams} />
    </main>
  );
}
