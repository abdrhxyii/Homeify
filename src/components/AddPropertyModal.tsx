'use client';
import React from 'react';
import { Modal, Form, Input, InputNumber, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const propertyTypes = [
  'apartment', 'house', 'condo', 'land', 'studio', 'villa', 'townhouse', 
  'penthouse', 'duplex', 'bungalow', 'cottage', 'mansion', 'farmhouse', 
  'chalet', 'loft', 'mobile home', 'co-op', 'commercial', 'industrial', 
  'mixed-use', 'ranch'
];

const listingTypes = ['sale', 'rental', 'other'];

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Add New Property"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item 
          name="title" 
          label="Property Title" 
          rules={[{ required: true, message: 'Please enter the property title' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
          name="description" 
          label="Description" 
          rules={[{ required: true, message: 'Please enter the description' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item 
          name="price" 
          label="Price ($)" 
          rules={[{ required: true, message: 'Please enter the price' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item 
          name="location" 
          label="Location" 
          rules={[{ required: true, message: 'Please enter the location' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
          name="propertyType" 
          label="Property Type" 
          rules={[{ required: true, message: 'Select property type' }]}
        >
          <Select>
            {propertyTypes.map(type => (
              <Select.Option key={type} value={type}>{type}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item 
          name="listingType" 
          label="Listing Type" 
          rules={[{ required: true, message: 'Select listing type' }]}
        >
          <Select>
            {listingTypes.map(type => (
              <Select.Option key={type} value={type}>{type}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item 
          name="bedrooms" 
          label="Bedrooms" 
          rules={[{ required: true, message: 'Enter number of bedrooms' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item 
          name="bathrooms" 
          label="Bathrooms" 
          rules={[{ required: true, message: 'Enter number of bathrooms' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item 
          name="area" 
          label="Area (sq ft)" 
          rules={[{ required: true, message: 'Enter area size' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item 
          name="amenities" 
          label="Amenities" 
          rules={[{ required: true, message: 'Enter amenities' }]}
        >
          <Input placeholder="Separate by commas (e.g., Pool, Gym, Parking)" />
        </Form.Item>
        <Form.Item 
          name="images" 
          label="Upload Images (4-6)" 
          rules={[{ required: true, message: 'Please upload 4-6 images' }]}
        >
          <Upload 
            beforeUpload={() => false} 
            listType="picture" 
            multiple 
            maxCount={6}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPropertyModal;