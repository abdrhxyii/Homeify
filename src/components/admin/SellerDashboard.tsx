'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import { Card, Statistic, Table, Typography, Button, Spin } from 'antd';
import { showErrorNotification } from '@/lib/notificationUtil';
import { ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface PopularListing {
  id: string;
  title: string;
  clickCount: number;
}

interface AnalyticsData {
  totalProperties: number;
  totalMessagedUsers: number;
  totalClickCount?: number;
  popularListings?: PopularListing[];
  premiumMetrics?: {
    rentalProperties?: number;
    saleProperties?: number;
  };
}

const SellerDashboard: React.FC = () => {
  const { currentLoggedInUserId } = useAuthStore();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [plan, setPlan] = useState<string>('Basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!currentLoggedInUserId) {
      showErrorNotification('Please log in to view analytics');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch analytics data
      const analyticsResponse = await axios.get(`/api/dashboard/seller/overview?sellerId=${currentLoggedInUserId}`);
      setAnalytics(analyticsResponse.data.data);

      // Fetch subscription to determine plan
      const subResponse = await axios.get(`/api/subscription/check?userId=${currentLoggedInUserId}`);
      setPlan(subResponse.data.hasActiveSubscription ? subResponse.data.subscription.plan : 'Basic');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch analytics data';
      setError(errorMessage);
      showErrorNotification(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [currentLoggedInUserId]);

  const handleRefresh = () => {
    fetchAnalytics();
  };

  const popularColumns = [
    {
      title: 'Property Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Clicks',
      dataIndex: 'clickCount',
      key: 'clickCount',
      render: (clickCount: number) => clickCount.toLocaleString(),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Seller Analytics Dashboard</Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="mb-6">
          <Text type="danger">{error}</Text>
        </Card>
      )}

      {loading ? (
        <div className="text-center">
          <Spin size="large" tip="Loading analytics..." />
        </div>
      ) : !analytics ? (
        <Card>
          <Text>No analytics data available. Try refreshing or contact support.</Text>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card hoverable>
              <Statistic
                title="Total Properties Listed"
                value={analytics.totalProperties}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
            <Card hoverable>
              <Statistic
                title="Total Messaged Users"
                value={analytics.totalMessagedUsers}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
            {(plan === 'Pro' || plan === 'Premium') && (
              <Card hoverable>
                <Statistic
                  title="Total Click Count"
                  value={analytics.totalClickCount || 0}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            )}
          </div>

          {(plan === 'Pro' || plan === 'Premium') && analytics.popularListings && (
            <Card title="Popular Listings (Top 5)" className="mb-6">
              {analytics.popularListings.length > 0 ? (
                <Table
                  columns={popularColumns}
                  dataSource={analytics.popularListings}
                  rowKey="id"
                  pagination={false}
                  size="middle"
                />
              ) : (
                <Text>No popular listings available yet.</Text>
              )}
            </Card>
          )}

          {plan === 'Premium' && (
            <Card title="Premium Metrics" className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Statistic
                  title="Rental Properties"
                  value={analytics.premiumMetrics?.rentalProperties || 0}
                  valueStyle={{ color: '#1890ff' }}
                />
                <Statistic
                  title="Sale Properties"
                  value={analytics.premiumMetrics?.saleProperties || 0}
                  valueStyle={{ color: '#1890ff' }}
                />
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default SellerDashboard;