'use client';
import Image from 'next/image';
import { Mail, Phone, MessageCircle, Check, Images, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Breadcrumb } from 'antd';
import SanitizedHTML from '@/components/SanitizedHTML';
import axios from 'axios';
import { Property, Seller } from '@/types/interfaces';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChatModal from '@/components/ChatModal';

export default function PropertyDetails({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const propertyId = params.id;
  const router = useRouter();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/property/${propertyId}`);
        setProperty(response.data.property);
        setSeller(response.data.seller);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load property details');
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // Image handling
  const images = property?.images || ['/item1.webp']; // Fallback to placeholder if no images

  const openImageViewer = (index: number) => {
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

  // Contact functionality
  const handleEmailContact = () => {
    if (seller && seller.email) {
      const subject = `Inquiry about: ${property?.title}`;
      const body = `Hi ${seller.name},\n\nI'm interested in your property: ${property?.title} at ${property?.location}.\n\nPlease contact me with more information.\n\nThank you!`;
  
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        seller.email
      )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
      window.open(gmailUrl, '_blank');
    } else {
      alert('Seller email is not available');
    }
  };
  
  const handlePhoneContact = () => {
    if (seller && seller.phoneNumber) {
      window.location.href = `tel:${seller.phoneNumber}`;
    } else {
      alert('Seller phone number is not available');
    }
  };

  const handleWhatsAppContact = () => {
    if (seller && seller.phoneNumber) {
      // Clean the phone number - remove spaces, dashes, etc.
      const cleanPhoneNumber = seller.phoneNumber.replace(/\D/g, '');
      const message = `Hi ${seller.name}, I'm interested in your property: ${property?.title} at ${property?.location}.`;
      window.open(`https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      alert('Seller phone number is not available');
    }
  };

  const handleChatContact = () => {
    if (seller && seller.id) {
      // Navigate to chat page with seller ID
      router.push(`/chat/${seller.id}?propertyId=${propertyId}`);
    } else {
      alert('Cannot initiate chat at this time');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 mt-20">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-20 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!property || !seller) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        Property or seller information not found.
      </div>
    );
  }

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
      <Breadcrumb className='mb-5'>
        <Breadcrumb.Item>
          <Link href="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/properties">Properties</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{property.title}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 relative h-96">
          <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 z-10 flex items-center gap-1">
            <Images size={20} />
            <span>{images.length}</span>
          </div>
          <Image
            src={images[0]}
            alt={property.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg cursor-pointer"
            onClick={() => openImageViewer(0)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((index) => (
            images[index] && (
              <div key={index} className="relative h-44">
                <Image
                  src={images[index]}
                  alt={`${property.title} image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg cursor-pointer"
                  onClick={() => openImageViewer(index)}
                />
              </div>
            )
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
              alt={`${property.title} image ${currentImageIndex + 1}`}
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
          <p className="text-lg text-gray-700">{property.location}</p>
        </div>
        <div className="flex flex-wrap mt-4 md:mt-0 gap-2">
          <button 
            className="bg-primary text-white px-4 py-3 rounded flex items-center"
            onClick={handleEmailContact}
          >
            <Mail className="mr-2" size={20} />
            EMAIL
          </button>
          <button 
            className="border border-gray-300 text-gray-700 px-4 py-3 rounded flex items-center"
            onClick={handlePhoneContact}
          >
            <Phone className="mr-2" size={20} />
            CALL
          </button>
          <button 
            className="border border-gray-300 text-gray-700 px-4 py-3 rounded flex items-center"
            onClick={handleWhatsAppContact}
          >
            <MessageCircle className="mr-2" size={20} color="green" />
            WHATSAPP
          </button>
          <button 
            className="border border-gray-300 bg-blue-50 text-blue-700 px-4 py-3 rounded flex items-center"
            onClick={() => setChatModalVisible(true)}
          >
            <MessageSquare className="mr-2" size={20} color="blue" />
            CHAT
          </button>
        </div>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
          <h3 className="text-gray-500 mb-1">Price:</h3>
          <p className="text-red-500 text-xl font-semibold">
            {property.listingType === 'rental'
              ? `$${property.price}/mo`
              : `$${property.price.toLocaleString()}`}
          </p>
        </div>
        <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
          <h3 className="text-gray-500 mb-1">Location:</h3>
          <p className="text-gray-800 text-xl">{property.location}</p>
        </div>
        <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
          <h3 className="text-gray-500 mb-1">Bedrooms:</h3>
          <p className="text-gray-800 text-xl">{property.bedrooms}</p>
        </div>
        <div>
          <h3 className="text-gray-500 mb-1">Size:</h3>
          <p className="text-gray-800 text-xl">{property.area} sqft</p>
        </div>
      </div>

      <div className="flex items-center mb-8">
        <div className="relative w-12 h-12 mr-4">
          <Image
            src="/profile2.jpg" // Replace with actual seller avatar if available
            alt={seller.name}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div>
          <p className="text-lg font-medium">{seller.name}</p>
          <p className="text-gray-600">{seller.phoneNumber}</p>
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
            'View of Water',
          ].map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check size={18} className="text-gray-400 mr-2" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        <div className="md:col-span-2">
          <SanitizedHTML html={property.description} />
          <div className="mt-6">
            <p className="text-gray-700">{property.propertyType}</p>
            <p className="text-gray-700">{property.bedrooms} Bedrooms</p>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Amenities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4">
        {property.amenities.map((amenity, index) => (
          <div key={index} className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-3"></div>
            <span className="text-gray-700">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
      <ChatModal
        visible={chatModalVisible}
        onClose={() => setChatModalVisible(false)}
        receiverId={seller.id}
        propertyId={propertyId}
      />
    </>
  );
}