'use client';

import Image from 'next/image';
import { MapPin, Bed, Wifi, Heart } from 'lucide-react';
import { Property } from '@/types/interfaces';
import { useRouter } from 'next/navigation';
import { showErrorNotification } from '@/lib/notificationUtil';
import axios from 'axios';

const PropertyCard = ({ _id, title, price, location, bedrooms, amenities, images }: Property) => {
  const router = useRouter();

  const handleClick = async () => {
    try {
      await axios.post('/api/property/track-click', { propertyId: _id });
      router.push(`/property/${_id}`);
    } catch (error) {
      showErrorNotification('Failed to record property click');
      router.push(`/property/${_id}`);
    }
  };

  return (
    <>
      <div className="border rounded-3xl border-gray-200 overflow-hidden w-full sm:max-w-sm mx-auto cursor-pointer" onClick={handleClick}>
        <div className="relative w-full h-48 sm:h-56">
          <Image
            src={images[0] || '/property.webp'}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 right-3 bg-white p-1 rounded-full shadow-md cursor-pointer hover:bg-gray-100">
            <Heart size={18} className="text-gray-600" />
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <h2 className="text-sm sm:text-base text-black font-semibold mb-2">
            {title}
          </h2>

          <div className="flex justify-between items-center mb-2 text-gray-600 text-xs sm:text-sm">
            <p className="text-lg sm:text-xl font-bold text-gray-900">${price.toLocaleString()}</p>
          </div>

          <div className="flex justify-between items-center text-gray-500 mt-3 text-xs sm:text-sm">
            <div className="flex items-center">
              <MapPin size={16} />
              <span className="ml-1">{location.split(',')[0]}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Bed size={16} />
                <span className="ml-1">{bedrooms} Bed</span>
              </div>

              {amenities.includes('wifi') && (
                <div className="flex items-center">
                  <Wifi size={16} />
                  <span className="ml-1">Wi-Fi</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyCard;