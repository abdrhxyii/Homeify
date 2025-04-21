'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { message } from 'antd';
import AdminDashboard from './AdminDashboard';

const Dashboard: React.FC = () => {
  const { role } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect can be used for any common data fetching or setup
    // that applies to all dashboard types
    
    // Simulate some initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleError = (errorMessage: string) => {
    message.error(errorMessage);
  };

  const renderDashboard = () => {
    switch (role) {
      case 'ADMIN':
        return <AdminDashboard loading={loading} onError={handleError} />;
    }
  };

  return (
    <div className="p-8">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;