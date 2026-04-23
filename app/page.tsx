"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard/classes');
    } else {
      router.push('/login');
    }
  }, [router]);

  return <div className="h-screen bg-slate-100 flex items-center justify-center text-slate-500">Checking auth state...</div>;
}
