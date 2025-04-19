'use client'
import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import { Check, Crown, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    highlight: false,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC, // Not used for checkout
  },
  {
    title: 'Pro',
    price: '$30',
    period: 'for 30 days', // Updated to reflect one-time payment
    description: 'For sellers aiming to optimize their listings.',
    features: [
      'List up to 15 properties/month',
      'Upload pictures & descriptions',
      'Advanced analytics (clicks, views, inquiries)',
      'Performance insights'
    ],
    button: 'Get started',
    highlight: true,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO, // From .env
  },
  {
    title: 'Premium',
    price: '$50',
    period: 'for 30 days', // Updated to reflect one-time payment
    description: 'For sellers wanting unlimited access and insights.',
    features: [
      'Unlimited property listings',
      'Advanced listing management',
      'Detailed analytics (engagement rates, clicks, views)',
      'View profiles of engaged users'
    ],
    button: 'Get started',
    highlight: false,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PREMIUM, // From .env
  }
];

export default function Membership() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { currentLoggedInUserId } = useAuthStore();

  // Fetch user's subscription status when component mounts
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!currentLoggedInUserId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/subscription/check?userId=${currentLoggedInUserId}`);
        if (response.data.hasActiveSubscription) {
          setActiveSubscription(response.data.subscription);
        }
      } catch (err) {
        console.error("Error checking subscription status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [currentLoggedInUserId]);

  const handleCheckout = async (variantId: string | undefined, planTitle: string) => {
    if (planTitle === 'Basic') {
      return;
    }

    if (!currentLoggedInUserId) {
      setError('You must be logged in to upgrade your plan.');
      return;
    }

    if (!variantId) {
      setError('Invalid plan configuration. Please try again later.');
      return;
    }

    // Check if user already has an active subscription
    if (activeSubscription) {
      setError(`You already have an active ${activeSubscription.plan} subscription that expires on ${new Date(activeSubscription.expiresAt).toLocaleDateString()}. Please wait until it expires before purchasing a new subscription.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/checkouts', {
        variantId: variantId,
        userId: currentLoggedInUserId,
      });

      const { checkoutUrl } = response.data;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError('Failed to initiate checkout. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  // Function to display the current plan banner if user has an active subscription
  const renderCurrentPlanBanner = () => {
    if (!activeSubscription) return null;

    return (
      <div className="w-full bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-md flex items-center">
        <Info className="text-blue-500 mr-2" size={20} />
        <div>
          <p className="font-medium">
            You currently have an active <span className="font-bold">{activeSubscription.plan}</span> subscription
          </p>
          <p className="text-sm text-gray-600">
            Valid until: {new Date(activeSubscription.expiresAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 flex justify-center">
        <div className="animate-pulse">Loading subscription information...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b bg-white">
      <div className="text-center mb-16">
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan to elevate your property listings and connect with more potential buyers.
        </p>
      </div>

      {renderCurrentPlanBanner()}

      {error && (
        <div className="text-center text-red-600 mb-8 p-4 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          // Determine if this is the current active plan
          const isCurrentPlan = activeSubscription && activeSubscription.plan === plan.title;
          // Determine if the user is on the basic plan (no active subscription) and this is the basic card
          const isBasicAndNoSubscription = !activeSubscription && plan.title === 'Basic';

          return (
            <div
              key={index}
              className={`relative rounded-3xl transition-all duration-300 ${
                hoveredIndex === index ? 'transform -translate-y-2' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Popular badge or Current Plan badge */}
              {(plan.highlight || isCurrentPlan || isBasicAndNoSubscription) && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className={`${isCurrentPlan || isBasicAndNoSubscription ? 'bg-green-600' : 'bg-blue-600'} text-white text-sm font-medium px-4 py-1 rounded-full shadow-md flex items-center`}>
                    {(isCurrentPlan || isBasicAndNoSubscription) ? (
                      <>
                        <Check size={16} className="mr-1" />
                        Current Plan
                      </>
                    ) : (
                      <>
                        <Crown size={16} className="mr-1" />
                        Most Popular
                      </>
                    )}
                  </span>
                </div>
              )}

              <div
                className={`h-full border-2 rounded-3xl p-8 flex flex-col ${
                  isCurrentPlan || isBasicAndNoSubscription
                    ? 'border-green-500 shadow-xl bg-gradient-to-b from-green-50 to-white'
                    : plan.highlight
                      ? 'border-blue-500 shadow-xl bg-gradient-to-b from-blue-50 to-white'
                      : hoveredIndex === index
                        ? 'border-gray-300 shadow-lg'
                        : 'border-gray-200 shadow'
                }`}
              >
                <h3 className="text-2xl font-bold text-center mb-2">{plan.title}</h3>
                <div className="flex justify-center items-baseline mb-4">
                  <span className="text-5xl font-extrabold">{plan.price}</span>
                  <span className="text-gray-500 text-sm ml-1">/{plan.period}</span>
                </div>
                <p className="text-center text-gray-600 mb-8">{plan.description}</p>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check
                        className={`w-5 h-5 mr-3 mt-0.5 ${
                          isCurrentPlan || isBasicAndNoSubscription ? 'text-green-500' : plan.highlight ? 'text-blue-500' : 'text-green-500'
                        }`}
                      />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan.variantId, plan.title)}
                  disabled={loading || plan.title === 'Basic' || isCurrentPlan}
                  className={`w-full py-3 px-6 rounded-xl text-white font-semibold transition-all duration-200 ${
                    isCurrentPlan || isBasicAndNoSubscription
                      ? 'bg-green-600 cursor-not-allowed'
                      : plan.highlight
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                        : 'bg-gray-700 hover:bg-gray-800'
                  } ${(loading || isCurrentPlan || isBasicAndNoSubscription) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading
                    ? 'Processing...'
                    : isCurrentPlan || isBasicAndNoSubscription
                      ? 'Current Plan'
                      : plan.button}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}