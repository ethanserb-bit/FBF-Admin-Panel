import React, { useState } from 'react';
import { Eye, RotateCcw, AlertCircle } from 'lucide-react';

interface BlockedUser {
  id: string;
  name: string;
  email: string;
  blockedDate: Date;
  reason: string;
  reportCount: number;
  blockedBy: string;
  status: 'blocked' | 'pending-review';
}

const BlockedUsers = () => {
  const [blockedUsers] = useState<BlockedUser[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      blockedDate: new Date('2024-01-15'),
      reason: 'Multiple reports of harassment',
      reportCount: 5,
      blockedBy: 'System',
      status: 'blocked'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      blockedDate: new Date('2024-01-20'),
      reason: 'Inappropriate content sharing',
      reportCount: 3,
      blockedBy: 'Admin',
      status: 'pending-review'
    }
  ]);

  const handleUnblock = (id: string) => {
    // Implement unblock functionality
    console.log('Unblock user:', id);
  };

  const handleViewDetails = (id: string) => {
    // Implement view details functionality
    console.log('View details:', id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blocked Users</h1>
        <div className="flex gap-2">
          <select className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="all">All Status</option>
            <option value="blocked">Blocked</option>
            <option value="pending">Pending Review</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">User List</h2>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-4">User</th>
                <th className="pb-4">Reason</th>
                <th className="pb-4">Reports</th>
                <th className="pb-4">Blocked By</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Blocked Date</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blockedUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="py-4">
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-gray-600">{user.reason}</p>
                  </td>
                  <td className="py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      {user.reportCount} reports
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm">{user.blockedBy}</span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'blocked' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status === 'blocked' ? 'Blocked' : 'Pending Review'}
                    </span>
                  </td>
                  <td className="py-4 text-gray-500">
                    {user.blockedDate.toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(user.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleUnblock(user.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Unblock User"
                      >
                        <RotateCcw className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warning Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-semibold">High Risk Users</h3>
          </div>
          <p className="text-2xl font-bold">23</p>
          <p className="text-sm text-gray-500">Users with 3+ reports</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-semibold">Pending Reviews</h3>
          </div>
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-500">Awaiting moderation</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-semibold">Total Blocked</h3>
          </div>
          <p className="text-2xl font-bold">156</p>
          <p className="text-sm text-gray-500">All time</p>
        </div>
      </div>
    </div>
  );
};

export default BlockedUsers;

