'use client';
import React, { useState } from 'react';
import { Table, Button, Popconfirm, Modal, Form, Input, InputNumber, Select, Upload } from 'antd';
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// Type for Property Data
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
  const [form] = Form.useForm();

  // Open modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Handle form submission
  const handleFormSubmit = (values: any) => {
    console.log("New Property:", values);
    setIsModalOpen(false);
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

      {/* Add Property Modal */}
      <Modal
        title="Add New Property"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Submit
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="title" label="Property Title" rules={[{ required: true, message: 'Please enter the property title' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price ($)" rules={[{ required: true, message: 'Please enter the price' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please enter the location' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="propertyType" label="Property Type" rules={[{ required: true, message: 'Select property type' }]}>
            <Select>
              {propertyTypes.map(type => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="listingType" label="Listing Type" rules={[{ required: true, message: 'Select listing type' }]}>
            <Select>
              {listingTypes.map(type => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="bedrooms" label="Bedrooms" rules={[{ required: true, message: 'Enter number of bedrooms' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="bathrooms" label="Bathrooms" rules={[{ required: true, message: 'Enter number of bathrooms' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="area" label="Area (sq ft)" rules={[{ required: true, message: 'Enter area size' }]}>
            <InputNumber min={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="amenities" label="Amenities">
            <Input placeholder="Separate by commas (e.g., Pool, Gym, Parking)" />
          </Form.Item>
          <Form.Item name="images" label="Upload Images">
            <Upload beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PropertyListing;
