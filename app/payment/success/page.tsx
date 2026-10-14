import type { Metadata } from 'next';
import StatusLayout from '@/components/payment/StatusLayout';
import StatusCard from '@/components/payment/StatusCard';

export const metadata: Metadata = {
  title: 'Payment Successful | Nexus Vyoma',
  description:
    'Your transaction has been verified and registration confirmed for Nexus Vyoma 2026 at ISL Engineering College, Hyderabad.',
};

interface SuccessPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = searchParams ? await searchParams : {};

  const transactionId =
    typeof params.transaction_id === 'string'
      ? params.transaction_id
      : typeof params.txnid === 'string'
      ? params.txnid
      : typeof params.payment_id === 'string'
      ? params.payment_id
      : 'TXN_NV26_894120';

  const orderId =
    typeof params.order_id === 'string'
      ? params.order_id
      : typeof params.orderid === 'string'
      ? params.orderid
      : 'ORD_NV26_54910';

  const teamName =
    typeof params.team_name === 'string'
      ? params.team_name
      : typeof params.team === 'string'
      ? params.team
      : undefined;

  const teamMembers =
    typeof params.team_members === 'string'
      ? params.team_members
      : typeof params.members === 'string'
      ? params.members
      : undefined;

  return (
    <StatusLayout>
      <StatusCard
        status="success"
        transactionId={transactionId}
        orderId={orderId}
        teamName={teamName}
        teamMembers={teamMembers}
      />
    </StatusLayout>
  );
}
