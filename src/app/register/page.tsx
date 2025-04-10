'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from "next/link";
import { setCookie } from "nookies";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from 'next/navigation';
import { showSuccessNotification, showErrorNotification } from "@/lib/notificationUtil";

export default function Page() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { checkAuthStatus } = useAuthStore();
  const route = useRouter()

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        phoneNumber,
        password,
      });

      console.log(response.data, "register data")
      
      setCookie(null, 'token', response.data.token, {
        path: '/',
        maxAge: 30 * 24 * 60 * 60, 
      });

      setCookie(null, 'user', JSON.stringify(response.data.user), {
        path: '/',
        maxAge: 30 * 24 * 60 * 60, 
      });
      
      checkAuthStatus();
      showSuccessNotification('Registration successful');
      if(response.data.user.role === "ADMIN") {
        route.push('/dashboard')
      } else if (response.data.user.role === "USER") {
        route.push('/')
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
      showErrorNotification(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 "
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 "
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 "
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 "
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full justify-center rounded-md ${loading ? 'bg-gray-400' : 'bg-primary'} px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus:ring-2 focus:ring-offset-2`}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-indigo-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}