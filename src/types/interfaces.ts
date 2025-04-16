import { FormInstance } from 'antd'; // Import FormInstance from antd

export interface PropertyData {
    key: number;
    title: string;
    price: number;
    location: string;
    propertyType: string;
    listingType: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AddPropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    form: FormInstance
}


// types/property.ts
export interface Property {
    _id?: string;
    title: string;
    description: string;
    price: number;
    location: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    amenities: string[];
    images: string[];
    listingType: string;
    sellerId: string;
}
  
  export interface PropertyFormData extends Omit<Property, 'images'> {
    images: File[];
  }
  
export interface Seller {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  propertyId?: string;
}