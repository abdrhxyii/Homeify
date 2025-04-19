// pages/payment/cancel.tsx or app/payment/cancel/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentCancel() {
  const router = useRouter();
  
  useEffect(() => {
    // Automatically redirect after a few seconds
    const timer = setTimeout(() => {
      router.push('/membership');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-xl text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Canceled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was canceled or did not complete.
        </p>
        <Link href="/membership" className="text-blue-600 hover:text-blue-800 font-medium">
          Return to membership page
        </Link>
        <p className="mt-4 text-gray-500 text-sm">
          You will be redirected automatically in a few seconds...
        </p>
      </div>
    </div>
  );
}