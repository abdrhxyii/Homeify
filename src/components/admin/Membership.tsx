'use client'
import { Check } from 'lucide-react';

const plans = [
  {
    title: 'Basic',
    price: '$0',
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
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-8">Buy our membership, increase your sales</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`border rounded-2xl p-6 shadow-lg flex flex-col ${plan.highlight ? 'border-blue-500' : 'border-gray-300'}`}
          >
            <h3 className="text-xl font-semibold text-center mb-4">{plan.title}</h3>
            <p className="text-4xl font-bold text-center mb-2">{plan.price}</p>
            <p className="text-center text-gray-500 mb-6">{plan.description}</p>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <Check className="text-green-500 w-5 h-5 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={`mt-auto py-2 px-4 rounded-xl text-white font-semibold ${plan.highlight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}