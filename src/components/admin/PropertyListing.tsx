import { useState, useEffect } from 'react';
import { Table, Button, message, Popconfirm, Space } from 'antd';
import axios from 'axios';
import AddPropertyModal from '../AddPropertyModal';
import type { Property } from '@/types/interfaces';

const PropertyListing: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/property');
      setProperties(response.data.properties);
    } catch (error) {
      message.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete('/api/property', { data: { id } });
      message.success('Property deleted successfully');
      fetchProperties();
    } catch (error) {
      message.error('Failed to delete property');
    }
  };

  const handleEdit = (record: Property) => {
    setCurrentProperty(record);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleAddNew = () => {
    setCurrentProperty(null);
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setCurrentProperty(null);
    setIsEditing(false);
  };

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
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Type',
      dataIndex: 'propertyType',
      key: 'propertyType',
    },
    {
      title: 'Bedrooms',
      dataIndex: 'bedrooms',
      key: 'bedrooms',
    },
    {
      title: 'Bathrooms',
      dataIndex: 'bathrooms',
      key: 'bathrooms',
    },
    {
      title: 'Area (sq ft)',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: 'Listing Type',
      dataIndex: 'listingType',
      key: 'listingType',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Property) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the property"
            description="Are you sure you want to delete this property?"
            onConfirm={() => handleDelete(record._id!)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={handleAddNew}
        style={{ marginBottom: 16 }}
      >
        Add Property
      </Button>

      <div style={{ overflow: 'auto', maxHeight: '600px' }}>
        <Table
          columns={columns}
          dataSource={properties}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 400 }}
          sticky
        />
      </div>

      <AddPropertyModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onSuccess={fetchProperties}
        isEditing={isEditing}
        property={currentProperty}
      />
    </div>
  );
};

export default PropertyListing;