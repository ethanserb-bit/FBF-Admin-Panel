import React from 'react';
import { Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: { 
  title: string; 
  value: string; 
  icon: React.ElementType;
  color: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Urgent Requests"
          value="12"
          icon={AlertCircle}
          color="bg-red-500"
        />
        <StatCard
          title="Pending Review"
          value="48"
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Expert Requests"
          value="156"
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Approved Today"
          value="24"
          icon={CheckCircle}
          color="bg-green-500"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Placeholder for recent activity list */}
            <p className="text-gray-600">Loading recent activities...</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50">
              <h3 className="font-medium">Review Requests</h3>
              <p className="text-sm text-gray-600">Check pending requests</p>
            </button>
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50">
              <h3 className="font-medium">Manage Experts</h3>
              <p className="text-sm text-gray-600">View expert applications</p>
            </button>
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50">
              <h3 className="font-medium">User Reports</h3>
              <p className="text-sm text-gray-600">Handle user reports</p>
            </button>
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50">
              <h3 className="font-medium">Content Review</h3>
              <p className="text-sm text-gray-600">Moderate new content</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}