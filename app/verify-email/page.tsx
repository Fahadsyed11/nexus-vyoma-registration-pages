import { redirect } from 'next/navigation';

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/** Legacy URL — canonical page lives at /register/verify-email. */
export default async function LegacyVerifyEmailRedirect({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const email = typeof params.email === 'string' ? `?email=${encodeURIComponent(params.email)}` : '';
  redirect(`/register/verify-email${email}`);
}
