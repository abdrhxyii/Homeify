'use client';
import { useState, useEffect } from 'react';
import { Table, Button, message, Popconfirm, Space } from 'antd';
import axios from 'axios';
import { showErrorNotification, showSuccessNotification } from "@/lib/notificationUtil";

interface SubscriptionData {
  _id: string;
  userName: string;
  userEmail: string;
  plan: string;
  status: string;
  expiresAt: string;
}

const ManageSubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/dashboard/admin/manage-subscription');
      setSubscriptions(response.data.subscriptions);
    } catch (error) {
      showErrorNotification('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete('/api/dashboard/manage-subscription', { data: { id } });
      showSuccessNotification('Subscription deleted successfully');
      fetchSubscriptions();
    } catch (error) {
      showErrorNotification('Failed to delete subscription');
    }
  };

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Expires At',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (expiresAt: string) => new Date(expiresAt).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: SubscriptionData) => (
        <Space size="middle">
          <Popconfirm
            title="Delete the subscription"
            description="Are you sure you want to delete this subscription?"
            onConfirm={() => handleDelete(record._id)}
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Subscriptions</h1>
      <div style={{ overflow: 'auto', maxHeight: '600px' }}>
        <Table
          columns={columns}
          dataSource={subscriptions}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 400 }}
          sticky
        />
      </div>
    </div>
  );
};

export default ManageSubscriptions;