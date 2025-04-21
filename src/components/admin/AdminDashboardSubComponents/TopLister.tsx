import React from 'react';
import { Card } from 'antd';

interface TopListerProps {
  bestLister: {
    name: string;
    email: string;
    propertyCount: number;
  };
}

const TopLister: React.FC<TopListerProps> = ({ bestLister }) => {
  return (
    <div className="mt-8">
      <Card className="shadow-md">
        <h2 className="text-xl font-semibold mb-2">Top Property Lister</h2>
        <p><strong>Name:</strong> {bestLister.name}</p>
        <p><strong>Email:</strong> {bestLister.email}</p>
        <p><strong>Properties Listed:</strong> {bestLister.propertyCount}</p>
      </Card>
    </div>
  );
};

export default TopLister;