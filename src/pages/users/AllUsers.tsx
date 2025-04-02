// src/pages/users/UserList.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Tag, Modal } from 'antd';
import { SearchOutlined, UserDeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';

// First, install the required dependencies:
// npm install antd @ant-design/icons

interface User {
  key: string;
  username: string;
  email: string;
  status: 'active' | 'inactive';
  reportsCount: number;
  joinDate: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a: User, b: User) => a.username.localeCompare(b.username),
      filterDropdown: () => null,
      render: (text: string) => text,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: User['status']) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Reports Filed',
      dataIndex: 'reportsCount',
      key: 'reportsCount',
      sorter: (a: User, b: User) => a.reportsCount - b.reportsCount,
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      sorter: (a: User, b: User) => 
        new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: User) => (
        <Space>
          <Button 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button 
            icon={<UserDeleteOutlined />} 
            danger
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const mockUsers: User[] = [
          {
            key: '1',
            username: 'john_doe',
            email: 'john@example.com',
            status: 'active',
            reportsCount: 0,
            joinDate: '2023-01-15',
          },
          {
            key: '2',
            username: 'jane_smith',
            email: 'jane@example.com',
            status: 'active',
            reportsCount: 3,
            joinDate: '2023-02-20',
          },
          {
            key: '3',
            username: 'bob_wilson',
            email: 'bob@example.com',
            status: 'inactive',
            reportsCount: 1,
            joinDate: '2023-03-10',
          },
          {
            key: '4',
            username: 'alice_johnson',
            email: 'alice@example.com',
            status: 'active',
            reportsCount: 2,
            joinDate: '2023-04-05',
          },
        ];
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleDelete = (user: User) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: `This will permanently delete ${user.username}'s account.`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        // TODO: Implement delete functionality
        console.log('Delete user:', user);
      },
    });
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <Input
          placeholder="Search users"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
          className="max-w-xs"
        />
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg shadow">
        <Table 
          columns={columns as ColumnType<User>[]} 
          dataSource={filteredUsers}
          loading={loading}
          pagination={{
            total: filteredUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </div>

      <Modal
        title="Edit User"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => setIsModalVisible(false)}>
            Save Changes
          </Button>,
        ]}
      >
        {selectedUser && (
          <div>
            <p>Edit user: {selectedUser.username}</p>
            {/* Add more form fields as needed */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserList;