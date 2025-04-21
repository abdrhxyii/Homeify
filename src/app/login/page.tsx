'use client';
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { setCookie } from "nookies";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showSuccessNotification, showErrorNotification } from "@/lib/notificationUtil";

export default function Page() {
  const [error, setError] = useState<string | null>(null);
  const route = useRouter()
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setError(null);

    try {
      const { data } = await axios.post("/api/auth/login", formData);
      
      setCookie(null, "token", data.token, {
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });

      setCookie(null, "user", JSON.stringify(data.user), {
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });

      checkAuthStatus();

      showSuccessNotification(`Welcome ${data.user.name}`);

      if(data.user.role === "ADMIN") {
        route.push('/dashboard')
      } else if (data.user.role === "SELLER") {
        route.push('/dashboard')
      } else if (data.user.role === "USER") {
        route.push('/')
      }
    } catch (error: any) {
      console.error("Login Error:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "Something went wrong.");
      showErrorNotification(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);

    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-primary">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div>
              <button
                disabled={loading}
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Don&#39;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
