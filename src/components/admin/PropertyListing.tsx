'use client';
import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, Modal, Form, Input, InputNumber, Select, Upload } from 'antd';
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AddPropertyModal from '../AddPropertyModal';
import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import { showSuccessNotification, showErrorNotification } from '@/lib/notificationUtil';

interface PropertyData {
  key: number;
  title: string;
  price: number;
  location: string;
  propertyType: string;
  listingType: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dummy property data for the table
const propertyData: PropertyData[] = [
  {
    key: 1,
    title: 'Luxury Apartment in Downtown',
    price: 450000,
    location: 'New York, NY',
    propertyType: 'apartment',
    listingType: 'sale',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-02-10'),
  },
];

// Handle delete property
const handleDelete = (id: number) => {
  console.log("Deleting property with ID:", id);
};

// Property types and listing types
const propertyTypes = [
  'apartment', 'house', 'condo', 'land', 'studio', 'villa', 'townhouse', 
  'penthouse', 'duplex', 'bungalow', 'cottage', 'mansion', 'farmhouse', 
  'chalet', 'loft', 'mobile home', 'co-op', 'commercial', 'industrial', 
  'mixed-use', 'ranch'
];

const listingTypes = ['sale', 'rental', 'other'];

const PropertyListing: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentLoggedInUserId } = useAuthStore();
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(currentLoggedInUserId, "currentLoggedInUserId");
  }, []);

  // Open modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // Handle form submission
  const handleFormSubmit = async (values: {
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
  }) => {
    console.log("New Property:", values);
    const { title, description, price, location, propertyType, bedrooms, bathrooms, area, amenities, images, listingType } = values;

    try {
      const response = await axios.post('/api/property', {
        title,
        description,
        price,
        location,
        propertyType,
        bedrooms,
        bathrooms,
        area,
        amenities,
        images,
        listingType,
        sellerId: currentLoggedInUserId,
      });

      showSuccessNotification("Property created successfully!");
      console.log("Property created:", response.data);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error creating property:", error);
      showErrorNotification(error.response?.data?.message || "Failed to create property.");
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text: number) => `$${text.toLocaleString()}`,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Property Type',
      dataIndex: 'propertyType',
      key: 'propertyType',
    },
    {
      title: 'Listing Type',
      dataIndex: 'listingType',
      key: 'listingType',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: Date) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: Date) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: PropertyData) => (
        <Popconfirm
          title="Are you sure you want to delete this property?"
          onConfirm={() => handleDelete(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />} size="small">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Property Listings</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Add Property
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table columns={columns} dataSource={propertyData} pagination={false} scroll={{ x: 1000 }} />
      </div>

      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default PropertyListing;
