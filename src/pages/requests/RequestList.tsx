import React, { useState } from 'react';
import { MessageCircle, CheckCircle, XCircle, AlertTriangle, Eye, ArrowUp, Filter, ArrowUpDown, Video, Shield, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DenyRequestModal from '../../components/DenyRequestModal';
import AssignExpertModal from '../../components/AssignExpertModal';
import { requestService } from '../../services/requestService';

interface Request {
  id: string;
  question: string;
  content: string;
  status: 'pending' | 'approved' | 'denied';
  isUrgent: boolean;
  category: string;
  createdAt: Date;
  userId: string;
  userDetails: {
    name: string;
    membershipType: 'free' | 'premium' | 'vip';
  };
  type: 'regular' | 'expert';
  mediaAttachments?: {
    type: 'image' | 'video';
    url: string;
    thumbnailUrl?: string;
  }[];
}

const RequestList = () => {
  const [requests] = useState<Request[]>([
    {
      id: '1',
      question: 'Need advice on rebuilding trust',
      content: 'Detailed description...',
      status: 'pending',
      isUrgent: true,
      category: 'Relationships',
      type: 'expert',
      createdAt: new Date(),
      userId: 'user1',
      userDetails: {
        name: 'Jane Doe',
        membershipType: 'premium'
      },
      mediaAttachments: [
        {
          type: 'video',
          url: '/video1.mp4',
          thumbnailUrl: '/thumb1.jpg'
        }
      ]
    },
    // Add more sample requests
  ]);

  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    category: 'all',
    urgency: 'all'
  });

  const [sortConfig, setSortConfig] = useState({
    field: 'createdAt',
    direction: 'desc'
  });

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const [showDenyModal, setShowDenyModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredRequests = requests.filter(request => {
    if (filters.type !== 'all' && request.type !== filters.type) return false;
    if (filters.status !== 'all' && request.status !== filters.status) return false;
    if (filters.category !== 'all' && request.category !== filters.category) return false;
    if (filters.urgency === 'urgent' && !request.isUrgent) return false;
    if (filters.urgency === 'normal' && request.isUrgent) return false;
    return true;
  }).sort((a, b) => {
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;

    const aValue = a[sortConfig.field as keyof Request];
    const bValue = b[sortConfig.field as keyof Request];
    
    if (sortConfig.direction === 'asc') {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  const handleViewDetails = (request: Request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleApprove = async (requestId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    try {
      const result = await requestService.approveRequest(requestId, request.type);
      if (result.success) {
        // Update local state
        const updatedRequests = requests.map(r =>
          r.id === requestId ? { ...r, status: 'approved' } : r
        );
        // Update your requests state here
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleDeny = async (requestId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedRequestId(requestId);
    setShowDenyModal(true);
  };

  const handleDenySubmit = async (reason: string) => {
    if (!selectedRequestId) return;

    try {
      const result = await requestService.denyRequest({
        requestId: selectedRequestId,
        reason,
      });

      if (result.success) {
        // Update local state
        const updatedRequests = requests.map(r =>
          r.id === selectedRequestId ? { ...r, status: 'denied' } : r
        );
        // Update your requests state here
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to deny request');
    }
  };

  const handleAssign = async (requestId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedRequestId(requestId);
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async (expertId: string) => {
    if (!selectedRequestId) return;

    try {
      const result = await requestService.assignExpert({
        requestId: selectedRequestId,
        expertId,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to assign expert');
    }
  };

  const handleAnswer = async (requestId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    try {
      // Move to appropriate section based on request type
      const response = await fetch(`/api/requests/${requestId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: request.type,
          status: 'in_progress'
        }),
      });

      if (!response.ok) throw new Error('Failed to start answering request');

      // Redirect to answer interface
      window.location.href = `/requests/${requestId}/answer`;
      
      toast.success('Opening answer interface');
    } catch (error) {
      console.error('Error starting answer:', error);
      toast.error('Failed to start answering request');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Request Management</h1>
        <div className="flex gap-4">
          <select 
            className="border rounded-md px-3 py-2"
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="all">All Types</option>
            <option value="regular">Regular Requests</option>
            <option value="expert">Expert Requests</option>
          </select>
          <select 
            className="border rounded-md px-3 py-2"
            value={filters.urgency}
            onChange={(e) => setFilters(prev => ({ ...prev, urgency: e.target.value }))}
          >
            <option value="all">All Urgency</option>
            <option value="urgent">Urgent Only</option>
            <option value="normal">Normal Only</option>
          </select>
          <select 
            className="border rounded-md px-3 py-2"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold">Urgent Requests</h3>
          </div>
          <p className="text-2xl font-bold">{requests.filter(r => r.isUrgent).length}</p>
          <p className="text-sm text-gray-500">Needs immediate attention</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-semibold">Pending Review</h3>
          </div>
          <p className="text-2xl font-bold">{requests.filter(r => r.status === 'pending').length}</p>
          <p className="text-sm text-gray-500">Awaiting moderation</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Shield className="w-5 h-5" />
            <h3 className="font-semibold">Expert Requests</h3>
          </div>
          <p className="text-2xl font-bold">{requests.filter(r => r.type === 'expert').length}</p>
          <p className="text-sm text-gray-500">Professional advice needed</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-semibold">Approved Today</h3>
          </div>
          <p className="text-2xl font-bold">
            {requests.filter(r => 
              r.status === 'approved' && 
              r.createdAt.toDateString() === new Date().toDateString()
            ).length}
          </p>
          <p className="text-sm text-gray-500">Successfully processed</p>
        </div>
      </div>

      {/* Request List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-2">
                  Date
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRequests.map(request => (
              <tr 
                key={request.id} 
                className={`hover:bg-gray-50 cursor-pointer ${request.isUrgent ? 'bg-orange-50 hover:bg-orange-100' : ''}`}
                onClick={() => handleViewDetails(request)}
              >
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    {request.isUrgent && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                    {request.createdAt.toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    request.type === 'expert' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{request.question}</div>
                    <div className="text-sm text-gray-500">{request.category}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'denied' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{request.userDetails.name}</div>
                    <div className="text-gray-500">{request.userDetails.membershipType}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={(e) => handleApprove(request.id, e)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => handleAnswer(request.id, e)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Answer"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => handleDeny(request.id, e)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Deny"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => handleAssign(request.id, e)}
                          className="text-purple-600 hover:text-purple-900 p-1"
                          title="Assign"
                        >
                          <UserPlus className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(request);
                      }}
                      className="text-gray-600 hover:text-gray-900 p-1"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedRequest.question}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedRequest.type === 'expert' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedRequest.type.charAt(0).toUpperCase() + selectedRequest.type.slice(1)}
                  </span>
                  {selectedRequest.isUrgent && (
                    <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                      Urgent
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    {selectedRequest.createdAt.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Request Details</h3>
                <p className="text-gray-700">{selectedRequest.content}</p>
              </div>

              {selectedRequest.mediaAttachments && selectedRequest.mediaAttachments.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Media Attachments</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedRequest.mediaAttachments.map((media, index) => (
                      <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        {media.type === 'video' ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Video className="w-8 h-8 text-gray-400" />
                          </div>
                        ) : (
                          <img 
                            src={media.thumbnailUrl || media.url} 
                            alt="Attachment" 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-900 mb-2">User Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedRequest.userDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Membership</p>
                      <p className="font-medium">{selectedRequest.userDetails.membershipType}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between gap-3">
              {selectedRequest.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleAnswer(selectedRequest.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> Answer
                  </button>
                  <button
                    onClick={() => handleDeny(selectedRequest.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Deny
                  </button>
                  <button
                    onClick={() => handleAssign(selectedRequest.id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" /> Assign
                  </button>
                </div>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add modals */}
      <DenyRequestModal
        isOpen={showDenyModal}
        onClose={() => setShowDenyModal(false)}
        onDeny={handleDenySubmit}
      />

      <AssignExpertModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignSubmit}
      />
    </div>
  );
};

export default RequestList; 