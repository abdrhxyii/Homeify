// pages/payment/success.tsx or app/payment/success/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();
  
  useEffect(() => {
    // You could show a success message for a few seconds
    const timer = setTimeout(() => {
      // Redirect to dashboard or membership page
      router.push('/dashboard');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your account has been upgraded successfully.
        </p>
        <p className="text-gray-500">
          You will be redirected to your dashboard shortly...
        </p>
      </div>
    </div>
  );
}