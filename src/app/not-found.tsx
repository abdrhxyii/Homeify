'use client';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="mt-4 text-2xl text-gray-600">Page Not Found</h2>
      <p className="mt-2 text-gray-500">Sorry, the page you are looking for does not exist.</p>
      <Link href="/" className="mt-6 inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;