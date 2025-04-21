import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { UserData } from '@/types/interfaces';

interface UserManagementProps {
  users: UserData[];
  loading: boolean;
  onDeleteUser: (id: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, loading, onDeleteUser }) => {
  const columns = [
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
          onConfirm={() => onDeleteUser(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger size="small">Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{ pageSize: 10 }}
        rowKey="_id"
      />
    </>
  );
};

export default UserManagement;