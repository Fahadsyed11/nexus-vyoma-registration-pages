import { redirect } from 'next/navigation';

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/** Legacy URL — canonical page lives at /register/check-email. */
export default async function LegacyCheckEmailRedirect({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const email = typeof params.email === 'string' ? `?email=${encodeURIComponent(params.email)}` : '';
  redirect(`/register/check-email${email}`);
}
