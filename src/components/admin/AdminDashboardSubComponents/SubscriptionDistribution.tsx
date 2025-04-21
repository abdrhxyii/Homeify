import React from 'react';
import { Card } from 'antd';

interface SubscriptionProps {
  distribution: {
    Basic: number;
    Pro: number;
    Premium: number;
  };
}

const SubscriptionDistribution: React.FC<SubscriptionProps> = ({ distribution }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Subscription Distribution</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center shadow-md">
          <h3 className="text-lg font-medium">Basic</h3>
          <p className="text-3xl font-bold mt-2">{distribution.Basic}</p>
        </Card>
        <Card className="text-center shadow-md">
          <h3 className="text-lg font-medium">Pro</h3>
          <p className="text-3xl font-bold mt-2">{distribution.Pro}</p>
        </Card>
        <Card className="text-center shadow-md">
          <h3 className="text-lg font-medium">Premium</h3>
          <p className="text-3xl font-bold mt-2">{distribution.Premium}</p>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionDistribution;