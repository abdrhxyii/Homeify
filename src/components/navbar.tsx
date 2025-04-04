'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, profileImage, checkAuthStatus, logout } = useAuthStore();
  
  const route = useRouter()

  // onClick={() => { 
  //   logout(); 
  //   closeMenu(); 
  // }}

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const closeMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout()
    route.push('/')
  }

  return (
    <nav className="bg-primary p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Image src={'/home.svg'} alt="CeyHome" width={150} height={100} />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-white hover:text-gray-300">Home</Link>
          <Link href="#buy" className="text-white hover:text-gray-300">Buy</Link>
          <Link href="/seller-account" className="text-white hover:text-gray-300">Sell</Link>
          <Link href="#rent" className="text-white hover:text-gray-300">Rent</Link>
          <Link href="#manage" className="text-white hover:text-gray-300">Manage Rental</Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Image 
                src={profileImage ?? '/userdefault.jpg'} 
                alt="User" 
                width={40} 
                height={40} 
                className="rounded-full border"
              />
              <button 
                onClick={handleLogout} 
                className="text-white border rounded-3xl border-white py-2 px-4 bg-red-500 hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <button className="text-white border rounded-3xl border-white py-2 px-6 bg-primary hover:bg-white hover:text-primary">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="border rounded-3xl border-white py-2 px-6 bg-white text-primary">
                  Signup
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <button className="text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="flex flex-col bg-primary text-white p-4 w-2/3 h-full">
            <button onClick={closeMenu} className="self-end text-white">
              <X size={24} />
            </button>

            <Link href="#buy" className="py-2 border-b border-white" onClick={closeMenu}>Buy</Link>
            <Link href="#sell" className="py-2 border-b border-white" onClick={closeMenu}>Sell</Link>
            <Link href="#rent" className="py-2 border-b border-white" onClick={closeMenu}>Rent</Link>
            <Link href="#manage" className="py-2 border-b border-white" onClick={closeMenu}>Manage Rental</Link>

            <div className="flex flex-col space-y-4 mt-4">
              {isAuthenticated ? (
                <div className="flex flex-col items-center space-y-4">
                  <Image 
                    src={profileImage ?? '/userdefault.jpg'} 
                    alt="User" 
                    width={50} 
                    height={50} 
                    className="rounded-full border"
                  />
                  <button 
                    onClick={() => { 
                      handleLogout(); 
                      closeMenu(); 
                    }}
                    className="text-white border rounded-3xl border-white py-2 px-4 bg-red-500 hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" onClick={closeMenu}>
                    <button className="text-white border rounded-3xl border-white py-2 px-8 bg-primary hover:bg-white hover:text-primary">
                      Login
                    </button>
                  </Link>
                  <Link href="/register" onClick={closeMenu}>
                    <button className="border rounded-3xl border-white py-2 px-8 bg-white text-primary">
                      Signup
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
