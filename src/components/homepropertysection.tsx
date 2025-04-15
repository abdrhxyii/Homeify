'use client';
import React, { useEffect, useState } from 'react';
import PropertyCard from './propertycard';
import axios from 'axios';
import { Property } from '@/types/interfaces';

export default function HomePropertySection() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/property');
        setProperties(response.data.properties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section className="px-4 py-8 md:px-8">
      <h2 className="text-2xl text-black font-semibold mb-6 text-start">Featured Properties For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {properties.map((property) => (
          <PropertyCard key={property._id} {...property} />
        ))}
      </div>
    </section>
  );
}