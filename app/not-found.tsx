import type { Metadata } from 'next';
import NotFoundView from '@/components/404/NotFoundView';

export const metadata: Metadata = {
  title: '404 | Nexus Vyoma',
  description: 'The requested page has drifted beyond Nexus Vyoma coordinates.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <NotFoundView />;
}
