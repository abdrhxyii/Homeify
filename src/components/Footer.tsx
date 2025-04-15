'use client'
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-16 px-4 md:px-12 lg:px-16 bg-[#fdfff4]">
      {/* Top section */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
        {/* Brand and description */}
        <div className="col-span-1">
          <div className="flex items-center mb-6">
            {/* <Image src="/home.svg" alt="Homeifye Logo" width={150} height={150} className="text-orange-500" /> */}
            <h2 className="text-2xl font-bold text-gray-800">Homeifye</h2>
          </div>
          
          <p className="text-gray-700 mb-6">
            © Homeifye is dedicated to transforming the real estate experience through innovation and excellence.
          </p>
          
          {/* Social icons */}
          <div className="flex space-x-5">
            <Link href="#" className="text-gray-700 hover:text-gray-900">
              <Instagram size={22} />
            </Link>
            <Link href="#" className="text-gray-700 hover:text-gray-900">
              <Facebook size={22} />
            </Link>
            <Link href="#" className="text-gray-700 hover:text-gray-900">
              <Twitter size={22} />
            </Link>
            <Link href="#" className="text-gray-700 hover:text-gray-900">
              <Linkedin size={22} />
            </Link>
          </div>
          
          {/* Get for Free button */}
          <Link href="#" className="inline-flex items-center border border-orange-500 text-orange-500 rounded-full px-8 py-3 mt-8 hover:bg-orange-50 transition-colors">
            <span>Get Your Free Consultation</span>
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
        
        {/* Real Estate Services links */}
        <div className="col-span-1">
          <h3 className="text-xl font-medium text-gray-800 mb-6">Our Services</h3>
          <nav className="flex flex-col space-y-4">
            <Link href="/buy" className="text-gray-700 hover:text-gray-900">Buy a Home</Link>
            <Link href="/sell" className="text-gray-700 hover:text-gray-900">Sell Your Property</Link>
            <Link href="/rent" className="text-gray-700 hover:text-gray-900">Rent a Property</Link>
            <Link href="/mortgage" className="text-gray-700 hover:text-gray-900">Mortgage Services</Link>
          </nav>
        </div>
        
        {/* Resources links */}
        <div className="col-span-1">
          <h3 className="text-xl font-medium text-gray-800 mb-6">Resources</h3>
          <nav className="flex flex-col space-y-4">
            <Link href="/market-reports" className="text-gray-700 hover:text-gray-900">Market Reports</Link>
            <Link href="/guides" className="text-gray-700 hover:text-gray-900">Buying Guides</Link>
            <Link href="/faq" className="text-gray-700 hover:text-gray-900">FAQs</Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900">Real Estate Blog</Link>
          </nav>
        </div>
        
        {/* Contact info */}
        <div className="col-span-1">
          <h3 className="text-xl font-medium text-gray-800 mb-6">Contact Us</h3>
          <div className="flex flex-col space-y-4">
            <p className="text-gray-700">Phone: (62) 1829017</p>
            <p className="text-gray-700">Email: hello@homeifye.com</p>
            <p className="text-gray-700">Address: 2912 Meadowbrook Road, Los Angeles, CA 90017</p>
          </div>
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 mb-16"></div>
      
      {/* Bottom section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-8 md:mb-0">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Need Help with Real Estate?</h2>
          <p className="text-gray-700">Let us assist you in finding your dream home or selling your property.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;