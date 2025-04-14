'use client'
import { Check, Crown } from 'lucide-react';
import { useState } from 'react';

const plans = [
  {
    title: 'Basic',
    price: '$0',
    period: 'forever',
    description: 'Ideal for normal sellers starting out.',
    features: [
      'List up to 5 properties/month',
      'Upload pictures & descriptions',
      'Basic property information',
      'Track inquiries with basic metrics'
    ],
    button: 'Get started',
    highlight: false
  },
  {
    title: 'Pro',
    price: '$30',
    period: 'per month',
    description: 'For sellers aiming to optimize their listings.',
    features: [
      'List up to 15 properties/month',
      'Upload pictures & descriptions',
      'Advanced analytics (clicks, views, inquiries)',
      'Performance insights'
    ],
    button: 'Get started',
    highlight: true
  },
  {
    title: 'Premium',
    price: '$50',
    period: 'per month',
    description: 'For sellers wanting unlimited access and insights.',
    features: [
      'Unlimited property listings',
      'Advanced listing management',
      'Detailed analytics (engagement rates, clicks, views)',
      'View profiles of engaged users'
    ],
    button: 'Get started',
    highlight: false
  }
];

export default function Membership() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b bg-white">
      <div className="text-center mb-16">
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose the perfect plan to elevate your property listings and connect with more potential buyers.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-3xl transition-all duration-300 ${
              hoveredIndex === index ? 'transform -translate-y-2' : ''
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Popular badge */}
            {plan.highlight && (
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <span className="bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full shadow-md flex items-center">
                  <Crown size={16} className="mr-1" />
                  Most Popular
                </span>
              </div>
            )}
            
            <div className={`h-full border-2 rounded-3xl p-8 flex flex-col ${
              plan.highlight 
                ? 'border-blue-500 shadow-xl bg-gradient-to-b from-blue-50 to-white' 
                : hoveredIndex === index 
                  ? 'border-gray-300 shadow-lg' 
                  : 'border-gray-200 shadow'
            }`}>
              <h3 className="text-2xl font-bold text-center mb-2">{plan.title}</h3>
              <div className="flex justify-center items-baseline mb-4">
                <span className="text-5xl font-extrabold">{plan.price}</span>
                <span className="text-gray-500 text-sm ml-1">/{plan.period}</span>
              </div>
              <p className="text-center text-gray-600 mb-8">{plan.description}</p>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className={`w-5 h-5 mr-3 mt-0.5 ${plan.highlight ? 'text-blue-500' : 'text-green-500'}`} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full py-3 px-6 rounded-xl text-white font-semibold transition-all duration-200 ${
                  plan.highlight 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg' 
                    : 'bg-gray-700 hover:bg-gray-800'
                }`}
              >
                {plan.button}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}