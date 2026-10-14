import type { Metadata } from 'next';
import StatusLayout from '@/components/payment/StatusLayout';
import StatusCard from '@/components/payment/StatusCard';

export const metadata: Metadata = {
  title: 'Payment Pending | Nexus Vyoma',
  description:
    'Your payment is currently being processed by the payment gateway for Nexus Vyoma 2026.',
};

export default function PendingPage() {
  return (
    <StatusLayout>
      <StatusCard status="pending" />
    </StatusLayout>
  );
}
