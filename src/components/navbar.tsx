'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, role, checkAuthStatus, logout } = useAuthStore();
  const route = useRouter();
  const [activeItem, setActiveItem] = useState<string>('');

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    route.push('/');
  };

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    closeMenu();
  };

  return (
    <nav
    className={`p-4 w-full fixed top-0 z-50 transition-all duration-300 backdrop-blur-md ${
      isScrolled
        ? 'bg-primary/30 border-b border-white/20'
        : 'bg-primary/80'
    }`}    
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Image src={'/home.svg'} alt="CeyHome" width={150} height={100} />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          <Link
            href="/"
            className={`text-white hover:text-secondary ${
              activeItem === 'home' ? 'text-secondary font-bold' : ''
            }`}
            onClick={() => handleItemClick('home')}
          >
            Home
          </Link>
          <Link
            href="/buy"
            className={`text-white hover:text-secondary ${
              activeItem === 'buy' ? 'text-secondary font-bold' : ''
            }`}
            onClick={() => handleItemClick('buy')}
          >
            Buy
          </Link>
          {!isAuthenticated && (
            <Link
              href="/seller-account"
              className={`text-white hover:text-secondary ${
                activeItem === 'sell' ? 'text-secondary font-bold' : ''
              }`}
              onClick={() => handleItemClick('sell')}
            >
              Sell
            </Link>
          )}
          <Link
            href="/rent"
            className={`text-white hover:text-secondary ${
              activeItem === 'rent' ? 'text-secondary font-bold' : ''
            }`}
            onClick={() => handleItemClick('rent')}
          >
            Rent
          </Link>
          <Link
            href="#manage"
            className={`text-white hover:text-secondary ${
              activeItem === 'manage' ? 'text-secondary font-bold' : ''
            }`}
            onClick={() => handleItemClick('manage')}
          >
            Manage Rental
          </Link>
          {isAuthenticated && (role === 'ADMIN' || role === 'SELLER') && (
            <Link
              href="/dashboard"
              className={`text-white hover:text-secondary ${
                activeItem === 'dashboard' ? 'text-secondary font-bold' : ''
              }`}
              onClick={() => handleItemClick('dashboard')}
            >
              Dashboard
            </Link>
          )}
          {isAuthenticated && role === 'USER' && (
            <Link
              href="/chat"
              className={`text-white hover:text-secondary ${
                activeItem === 'chat' ? 'text-secondary font-bold' : ''
              }`}
              onClick={() => handleItemClick('chat')}
            >
              Chat
            </Link>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Image
                src={'/userdefault.jpg'}
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
          <button
            className="text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-0 bg-white bg-opacity-80 backdrop-blur-md z-50 p-4">
          <div className="flex flex-col text-black">
            <button onClick={closeMenu} className="self-end text-black">
              <X size={24} />
            </button>

            <Link
              href="/buy"
              className={`py-2 border-b border-black ${
                activeItem === 'buy' ? 'text-secondary font-bold' : ''
              }`}
              onClick={() => handleItemClick('buy')}
            >
              Buy
            </Link>
            {!isAuthenticated && (
              <Link
                href="#sell"
                className={`py-2 border-b border-black ${
                  activeItem === 'sell' ? 'text-secondary font-bold' : ''
                }`}
                onClick={() => handleItemClick('sell')}
              >
                Sell
              </Link>
            )}
            <Link
              href="/rent"
              className={`py-2 border-b border-black ${
                activeItem === 'rent' ? 'text-secondary font-bold' : ''
              }`}
              onClick={() => handleItemClick('rent')}
            >
              Rent
            </Link>
            <Link
              href="#manage"
              className={`py-2 border-b border-black ${
                activeItem === 'manage' ? 'text-secondary font-bold' : ''
              }`}
              onClick={() => handleItemClick('manage')}
            >
              Manage Rental
            </Link>
            {isAuthenticated && role === 'USER' && (
              <Link
                href="/chat"
                className={`py-2 border-b border-black ${
                  activeItem === 'chat' ? 'text-secondary font-bold' : ''
                }`}
                onClick={() => handleItemClick('chat')}
              >
                Chat
              </Link>
            )}

            <div className="flex flex-col space-y-4 mt-4">
              {isAuthenticated ? (
                <div className="flex flex-col items-center space-y-4">
                  <Image
                    src={'/userdefault.jpg'}
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
                    className="text-black border rounded-3xl border-black py-2 px-4 bg-red-500 hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" onClick={closeMenu}>
                    <button className="text-black border rounded-3xl border-black py-2 px-8 bg-primary hover:bg-white hover:text-primary">
                      Login
                    </button>
                  </Link>
                  <Link href="/register" onClick={closeMenu}>
                    <button className="border rounded-3xl border-black py-2 px-8 bg-white text-primary">
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