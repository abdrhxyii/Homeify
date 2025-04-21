import { FormInstance } from 'antd'; // Import FormInstance from antd
import { ReactElement } from 'react';

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
    createdAt: string;
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

export interface AddPropertyModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  isEditing?: boolean;
  property?: Property | null;
}

export interface CardData {
  title: string;
  count: string | number;
  icon: ReactElement;
  color: string;
  iconColor: string;
}

export interface UserData {
  key: string;
  _id: string;
  name: string;
  email: string;
  paymentStatus?: 'Paid' | 'Free';
  role: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalUsers: number;
  paidUsers: number;
  totalProperties: number;
  bestLister: {
    name: string;
    email: string;
    propertyCount: number;
  };
  subscriptionDistribution: {
    Basic: number;
    Pro: number;
    Premium: number;
  };
  totalRevenue: number;
}

export interface UserGrowthData {
  date: string;
  count: number;
}

export type PeriodType = 'daily' | 'weekly' | 'monthly';