'use client'
import Image from 'next/image';
import Link from 'next/link';

const Rent = () => {
  return (
    <div className="bg-primary text-white w-full min-h-screen flex items-center mt-6">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-4 md:px-8">
        <div className="lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            Find the right and best home for your family
          </h1>
          
          <Link href="/explore">
            <div className="inline-flex items-center border border-white rounded-full px-8 py-4 hover:bg-white hover:text-primary transition-colors cursor-pointer">
              <span className="font-medium text-lg">Start exploring</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14 5l7 7m0 0l-7 7m7-7H3" 
                />
              </svg>
            </div>
          </Link>
        </div>
        
        <div className="lg:w-1/2 relative">
          <div className="relative">
            <div className="overflow-hidden w-full max-w-lg mx-auto">
              <Image 
                src="/herosection.avif" 
                alt="Modern house and real estate agent with clients" 
                width={600} 
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4 z-10">
              <div className="bg-gray-100 rounded-2xl overflow-hidden w-64 h-48 shadow-lg">
                <Image 
                  src="/herosection.avif" 
                  alt="Real estate agent with clients" 
                  width={320} 
                  height={240}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div> */}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Rent;