'use client';
// app/not-found.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the /home page when a 404 page is accessed
    router.push('/home');
  }, [router]);

  return null;  // Optionally, show a loading message or spinner here
}
