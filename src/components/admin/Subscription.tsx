// components/SubscriptionTable.tsx
'use client';
import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// Type for Subscription Data
interface SubscriptionData {
  key: number;
  name: string;
  plan: 'basic' | 'pro' | 'premium';
  date: Date;
  status: 'active' | 'inactive' | 'expired';
}

// Dummy subscription data for the table
const subscriptionData: SubscriptionData[] = [
  {
    key: 1,
    name: 'John Doe',
    plan: 'basic',
    date: new Date('2023-01-01'),
    status: 'active',
  },
  {
    key: 2,
    name: 'Jane Smith',
    plan: 'pro',
    date: new Date('2022-05-10'),
    status: 'inactive',
  },
  {
    key: 3,
    name: 'George Johnson',
    plan: 'premium',
    date: new Date('2021-11-25'),
    status: 'expired',
  },
  // Add more subscriptions as needed
];

// Handle delete subscription
const handleDelete = (id: number) => {
  console.log("Deleting subscription with ID:", id);
  // You can add logic here to delete the subscription from the database
};

const SubscriptionTable: React.FC = () => {
  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text: Date) => dayjs(text).format('YYYY-MM-DD'), // Format the date
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'active' | 'inactive' | 'expired') => {
        let color = '';
        if (status === 'active') color = 'green';
        else if (status === 'inactive') color = 'orange';
        else color = 'red';

        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: SubscriptionData) => (
        <Popconfirm
          title="Are you sure you want to remove this subscription?"
          onConfirm={() => handleDelete(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
          >
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Subscription List</h2>
      {/* Subscription Table Section */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={subscriptionData}
          pagination={false} // Optionally you can add pagination
          scroll={{ x: 1000 }} // Make table horizontally scrollable if necessary
        />
      </div>
    </div>
  );
};

export default SubscriptionTable;
