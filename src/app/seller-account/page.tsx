"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { setCookie } from "nookies";
import { useAuthStore } from "@/store/useAuthStore";
import { showSuccessNotification, showErrorNotification } from "@/lib/notificationUtil"; // Import the notification utility

export default function SellerRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { checkAuthStatus } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error before submission

    try {
      const response = await axios.post("/api/auth/register", {
        ...form,
        role: "SELLER",
      });

      if (response.data.token && response.data.user) {
        setCookie(null, "token", response.data.token, {
          path: "/",
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        setCookie(null, "user", JSON.stringify(response.data.user), {
          path: "/",
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        checkAuthStatus(); // Call auth check after successful login
        showSuccessNotification("Account created successfully!"); // Use the success notification
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
      showErrorNotification(error.response?.data?.message || "Registration failed."); // Use the error notification
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column - Image */}
      <div className="hidden md:flex flex-1 justify-center items-center">
        <Image src="/seller.png" alt="Seller Registration" width={500} height={500} />
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register as a Seller</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white p-3 rounded-lg font-semibold transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-opacity-90"
              }`}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}