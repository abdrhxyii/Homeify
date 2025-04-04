import Image from 'next/image';
import { MapPin, Bed, Wifi, Heart } from 'lucide-react';

const PropertyCard = () => {
  return (
    <div className="border rounded-3xl border-gray-200 overflow-hidden w-full sm:max-w-sm mx-auto">
      <div className="relative w-full h-48 sm:h-56">
        <Image
          src="/property.webp"
          alt="Property Image"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute top-3 right-3 bg-white p-1 rounded-full shadow-md cursor-pointer hover:bg-gray-100">
          <Heart size={18} className="text-gray-600" />
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h2 className="text-sm sm:text-base text-black font-semibold mb-2">
          A Mirow Stylish Apartment 10 min walk to Cosmos Muzeum
        </h2>

        <div className="flex justify-between items-center mb-2 text-gray-600 text-xs sm:text-sm">
          <p className="text-lg sm:text-xl font-bold text-gray-900">$772,00</p>
        </div>

        <div className="flex justify-between items-center text-gray-500 mt-3 text-xs sm:text-sm">
          <div className="flex items-center">
            <MapPin size={16} />
            <span className="ml-1">Mirow</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Bed size={16} />
              <span className="ml-1">2 Bed</span>
            </div>

            <div className="flex items-center">
              <Wifi size={16} />
              <span className="ml-1">Wi-Fi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
