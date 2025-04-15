'use client';
import PropertyCard from '@/components/propertycard';
import { Property } from '@/types/interfaces';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Buy = () => {
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
        <>
        <div className="bg-primary text-white w-full min-h-screen flex items-center justify-center p-4">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="relative w-full lg:w-1/2">
            <div className="relative">
                <Image 
                src="/buy-and-sell-hero-section.png" 
                alt="Modern property and real estate agent" 
                width={800} 
                height={600}
                className="w-full"
                />
            </div>
            </div>
            
            <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                Are you looking to buy a property?
            </h1>
            
            <Link href="/contact">
                <div className="inline-flex items-center border border-white rounded-full px-8 py-4 hover:bg-white hover:text-primary transition-colors cursor-pointer">
                <span className="font-medium text-lg">Get In Touch</span>
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
        </div>
        </div>
        <section className="px-4 py-8 md:px-8">
        <h2 className="text-2xl text-black font-semibold mb-6 text-start">Featured Properties For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {properties.map((property) => (
            <PropertyCard key={property._id} {...property} />
            ))}
        </div>
        </section>
        </>
    );
};

export default Buy;