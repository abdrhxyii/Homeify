'use client'
import Image from 'next/image';
import { Mail, Phone, MessageCircle, Check, Images } from 'lucide-react';
import { useState } from 'react';

export default function PropertyDetails() {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    '/item1.webp',
    '/item1.webp',
    '/item1.webp',
    '/item1.webp',
    '/item1.webp'
  ];

  const openImageViewer = (index: any) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 relative h-96">
          <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 z-10 flex items-center gap-1">
            <Images size={20}/>
            <span>{images.length}</span>
          </div>
          <Image 
            src={images[0]} 
            alt="Villa with pool and lake view" 
            layout="fill" 
            objectFit="cover" 
            className="rounded-lg cursor-pointer"
            onClick={() => openImageViewer(0)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="relative h-44">
              <Image 
                src={images[index]} 
                alt={`Villa image ${index + 1}`} 
                layout="fill" 
                objectFit="cover" 
                className="rounded-lg cursor-pointer"
                onClick={() => openImageViewer(index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image Viewer Modal */}
      {isViewerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl w-full">
            <button 
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={closeImageViewer}
            >
              ×
            </button>
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
              onClick={prevImage}
            >
              ←
            </button>
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
              onClick={nextImage}
            >
              →
            </button>
            <Image
              src={images[currentImageIndex]}
              alt={`Villa image ${currentImageIndex + 1}`}
              width={1200}
              height={800}
              objectFit="contain"
              className="w-full h-auto"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">6200 Sqft | 5 Bed | Extended and Upgraded</h1>
          <p className="text-lg text-gray-700">5 Bedroom Villa For Sale in Jumeirah Islands, Jumeirah Islands.</p>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-2">
          <button className="bg-primary text-white px-6 py-3 rounded flex items-center">
            <Mail className="mr-2" size={20} />
            EMAIL
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded flex items-center">
            <Phone className="mr-2" size={20} />
            CALL
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded flex items-center">
            <MessageCircle className="mr-2" size={20} color="green" />
            WHATSAPP
          </button>
        </div>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
          <h3 className="text-gray-500 mb-1">Price:</h3>
          <p className="text-red-500 text-xl font-semibold">AED25,750,000</p>
        </div>
        <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
          <h3 className="text-gray-500 mb-1">Location:</h3>
          <p className="text-gray-800 text-xl">Jumeirah Islands</p>
        </div>
        <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
          <h3 className="text-gray-500 mb-1">Bedrooms:</h3>
          <p className="text-gray-800 text-xl">5</p>
        </div>
        <div>
          <h3 className="text-gray-500 mb-1">Size:</h3>
          <p className="text-gray-800 text-xl">6200sqft</p>
        </div>
      </div>

      <div className="flex items-center mb-8">
        <div className="relative w-12 h-12 mr-4">
          <Image 
            src="/item1.webp" 
            alt="Agent" 
            layout="fill" 
            objectFit="cover" 
            className="rounded-full"
          />
        </div>
        <div>
          <p className="text-lg font-medium">Roberto Perez Lorenzo</p>
          <p className="text-gray-600">+97155333372</p>
        </div>
      </div>

      {/* Key Features & Description */}
      <h2 className="text-2xl font-bold mb-6">Key Features & Description</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          {[
            'Community Park',
            'Maids Room',
            'Landscaped Garden',
            'Study',
            'Central A/C & Heating',
            'Balcony',
            'Security',
            'Covered Parking',
            'Private Garden',
            'Private Pool',
            'View of Water'
          ].map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check size={18} className="text-gray-400 mr-2" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        <div className="md:col-span-2">
          <p className="text-gray-700 leading-relaxed">
            This fantastic fully extended and upgraded Costa Del Sol style villa is in Jumeirah Islands and
            now benefits of having a BUA of 6,200 Sq Ft, and benefits from 5 good size bedrooms all with
            en-suite bathrooms. On the ground floor, there is 3 separate living rooms, an open plan kitchen
            and an industrial back kitchen. The main reception boasts a beautiful double height ceiling
            which gives the villa a great sense on light and space with beautiful views of the lake. Outside,
            boosts a large plot of 10,775 Sq Ft with a private swimming pool. The property has a stunning
            lake view to the rear and is very private and peaceful, vacant and viewings are exclusively by
            appointment only.
          </p>
          <div className="mt-6">
            <p className="text-gray-700">-Entertainment Foyer</p>
            <p className="text-gray-700">-5 Bedrooms</p>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Amenities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4">
        {[
          'Community Swimming Pool',
          'Basketball court',
          'Restaurants',
          'Gymnasium',
          'Childrens area',
          'Golf club',
          'Tennis court',
          'Supermarkets'
        ].map((amenity, index) => (
          <div key={index} className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-3"></div>
            <span className="text-gray-700">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}