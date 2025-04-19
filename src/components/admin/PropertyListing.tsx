import { useState, useEffect } from 'react';
import { Table, Button, message, Popconfirm, Space } from 'antd';
import axios from 'axios';
import AddPropertyModal from '../AddPropertyModal';
import type { Property } from '@/types/interfaces';
import { useAuthStore } from '@/store/useAuthStore';
import { showErrorNotification } from "@/lib/notificationUtil";
import { Info } from 'lucide-react';

const PropertyListing: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
  const { currentLoggedInUserId } = useAuthStore();

  // Define plan limits
  const planLimits: { [key: string]: number } = {
    Basic: 5,
    Pro: 15,
    Premium: Infinity // Unlimited for Premium
  };

  // Fetch subscription status
  const fetchSubscription = async () => {
    if (!currentLoggedInUserId) {
      setIsSubscriptionLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/subscription/check?userId=${currentLoggedInUserId}`);
      if (response.data.hasActiveSubscription) {
        setSubscription(response.data.subscription);
      } else {
        // Default to Basic plan if no active subscription
        setSubscription({ plan: 'Basic' });
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setSubscription({ plan: 'Basic' }); // Fallback to Basic on error
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/property/seller?sellerId=${currentLoggedInUserId}`);
      setProperties(response.data.properties);
    } catch (error) {
      message.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
    fetchProperties();
  }, [currentLoggedInUserId]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete('/api/property', { data: { id } });
      message.success('Property deleted successfully');
      fetchProperties();
    } catch (error) {
      message.error('Failed to delete property');
    }
  };

  const renderCurrentPlanBanner = () => {
    if (!subscription) return null;

    return (
      <div className="w-full bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-md flex items-center">
        <Info className="text-blue-500 mr-2" size={20} />
        <div>
          <p className="font-medium">
            You currently have an active <span className="font-bold">{subscription.plan}</span> subscription
          </p>
          <p className="text-sm text-gray-600">
            Valid until: {new Date(subscription.expiresAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  };

  const handleEdit = (record: Property) => {
    setCurrentProperty(record);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleAddNew = () => {
    // Check subscription and listing limits
    const currentPlan = subscription?.plan || 'Basic';
    const listingLimit = planLimits[currentPlan];
    const currentListings = properties.length;

    if (currentListings >= listingLimit) {
      showErrorNotification(
        `You have reached the maximum property listing limit for your ${currentPlan} plan (${listingLimit} properties). Please upgrade your plan to add more properties.`
      );
      return;
    }

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

  const currentPlan = subscription?.plan || 'Basic';
  const listingLimit = planLimits[currentPlan];
  const isAddDisabled = properties.length >= listingLimit;

  return (
    <div>
      {renderCurrentPlanBanner()}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={handleAddNew}
          disabled={isSubscriptionLoading || isAddDisabled}
        >
          Add Property
        </Button>
        <span style={{ marginLeft: '16px' }}>
          Listings: {properties.length}
        </span>
      </div>

      <div style={{ overflow: 'auto', maxHeight: '600px' }}>
        <Table
          columns={columns}
          dataSource={properties}
          rowKey="_id"
          loading={loading || isSubscriptionLoading}
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