import type { Metadata } from 'next';
import StatusLayout from '@/components/payment/StatusLayout';
import StatusCard from '@/components/payment/StatusCard';

export const metadata: Metadata = {
  title: 'Payment Cancelled | Nexus Vyoma',
  description:
    'The transaction session was cancelled for Nexus Vyoma 2026. No charges were deducted.',
};

export default function CancelledPage() {
  return (
    <StatusLayout>
      <StatusCard status="cancelled" />
    </StatusLayout>
  );
}
