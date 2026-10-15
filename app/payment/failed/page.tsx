import type { Metadata } from 'next';
import StatusLayout from '@/components/payment/StatusLayout';
import StatusCard from '@/components/payment/StatusCard';

export const metadata: Metadata = {
  title: 'Payment Failed | Nexus Vyoma',
  description:
    'The transaction could not be processed for Nexus Vyoma 2026.',
};

export default function FailedPage() {
  return (
    <StatusLayout>
      <StatusCard status="failed" />
    </StatusLayout>
  );
}
