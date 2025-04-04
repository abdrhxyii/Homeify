// components/Dashboard.tsx
'use client';
import React from 'react';
import { Card, Button, DatePicker, Table, Space, Popconfirm } from "antd";
import { User, Home } from "lucide-react";
import dayjs from "dayjs";

// Type for Card Data
interface CardData {
  title: string;
  count: string;
  icon: JSX.Element;
  color: string;
  iconColor: string;
}

// Type for User Data
interface UserData {
  key: number;
  id: number;
  name: string;
  email: string;
  paymentStatus: 'Paid' | 'Free';
  role: 'SELLER' | 'BUYER';
}

// Array of objects with card data
const cardData: CardData[] = [
  {
    title: "Total Users",
    count: "2,340",
    icon: <User size={32} />,
    color: "#6B73FF",
    iconColor: "#6B73FF",
  },
  {
    title: "Paid Users",
    count: "1,120",
    icon: <User size={32} />,
    color: "#FF8C00",
    iconColor: "#FF8C00",
  },
  {
    title: "Property Listings",
    count: "540",
    icon: <Home size={32} />,
    color: "#33C6A4",
    iconColor: "#33C6A4",
  },
];

// Dummy user data for the table
const userData: UserData[] = [
  {
    key: 1,
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    paymentStatus: "Paid",
    role: "SELLER",
  },
  {
    key: 2,
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    paymentStatus: "Free",
    role: "BUYER",
  },
  {
    key: 3,
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    paymentStatus: "Paid",
    role: "SELLER",
  },
  // Add more users as needed
];

// Handle delete user
const handleDelete = (id: number) => {
  console.log("Deleting user with ID:", id);
  // You can add logic here to delete the user from the database
};

const Dashboard: React.FC = () => {
  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: UserData) => (
        <Popconfirm
          title="Are you sure you want to delete this user?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger size="small">Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-8">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card, index) => (
          <Card
            key={index}
            className="shadow-xl rounded-lg"
            style={{ backgroundColor: card.color, color: 'white' }}
            bodyStyle={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <div className="flex items-center">
              <div className={`mr-4 p-4 rounded-full bg-white text-[${card.iconColor}]`}>
                {card.icon}
              </div>
              <div>
                <h3 className="text-3xl font-bold">{card.count}</h3>
                <p className="text-sm">{card.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Date Range Picker and Generate Button */}
      <div className="mt-8 flex justify-between items-center">
        <div className="w-full sm:w-auto">
          <DatePicker.RangePicker
            defaultValue={[dayjs().startOf('month'), dayjs().endOf('month')]}
            format="YYYY-MM-DD"
            className="w-full sm:w-64"
          />
        </div>
        <div className="ml-4">
          <Button type="primary">Generate</Button>
        </div>
      </div>

      {/* User Table Section */}
      <div className="mt-8">
        <Table
          columns={columns}
          dataSource={userData}
          pagination={false} // Optionally you can add pagination
        />
      </div>
    </div>
  );
};

export default Dashboard;
