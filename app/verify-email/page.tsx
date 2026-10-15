import { Suspense } from 'react';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function RedirectContent({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const email = typeof params.email === 'string' ? `?email=${encodeURIComponent(params.email)}` : '';
  redirect(`/register/verify-email${email}`);
  return null;
}

/** Legacy URL — canonical page lives at /register/verify-email. */
export default function LegacyVerifyEmailRedirect(props: PageProps) {
  return (
    <Suspense fallback={null}>
      <RedirectContent {...props} />
    </Suspense>
  );
}
