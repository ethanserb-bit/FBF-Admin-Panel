import React, { useState } from 'react';
import { MessageCircle, CheckCircle, XCircle, Shield, Eye, Video, Image } from 'lucide-react';

interface MediaContent {
  type: 'video' | 'image';
  url: string;
  thumbnailUrl?: string;
}

interface Response {
  id: string;
  requestId: string;
  content: {
    text: string;
    media: MediaContent[];
  };
  respondentType: 'user' | 'expert';
  respondentName: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: Date;
  assignedExpert?: {
    id: string;
    name: string;
    specialty: string;
  };
}

const denialReasons = [
  { id: 'inappropriate', label: 'Inappropriate Content' },
  { id: 'low-quality', label: 'Low Quality Response' },
  { id: 'off-topic', label: 'Off Topic' },
  { id: 'harmful', label: 'Potentially Harmful Advice' },
  { id: 'spam', label: 'Spam or Promotional' }
];

const experts = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Relationship Counselor' },
  { id: '2', name: 'Dr. Michael Chen', specialty: 'Dating Coach' },
  { id: '3', name: 'Lisa Thompson', specialty: 'Family Therapist' }
];

const ResponseList = () => {
  const [responses] = useState<Response[]>([
    {
      id: '1',
      requestId: 'req1',
      content: {
        text: "Here's my professional advice on your situation...",
        media: [
          {
            type: 'video',
            url: '/video1.mp4',
            thumbnailUrl: '/thumb1.jpg'
          }
        ]
      },
      respondentType: 'expert',
      respondentName: 'Dr. Sarah Johnson',
      status: 'pending',
      createdAt: new Date()
    }
  ]);

  const [showDenialModal, setShowDenialModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);
  const [denialReason, setDenialReason] = useState('');
  const [denialNote, setDenialNote] = useState('');
  const [selectedExpert, setSelectedExpert] = useState('');

  const handleApprove = (response: Response) => {
    console.log('Approving response:', response.id);
  };

  const handleDeny = (response: Response) => {
    setSelectedResponse(response);
    setShowDenialModal(true);
  };

  const handleAssign = (response: Response) => {
    setSelectedResponse(response);
    setShowAssignModal(true);
  };

  const submitDenial = () => {
    if (!selectedResponse || !denialReason) return;
    console.log('Denying response:', {
      responseId: selectedResponse.id,
      reason: denialReason,
      note: denialNote
    });
    setShowDenialModal(false);
    setDenialReason('');
    setDenialNote('');
  };

  const submitAssignment = () => {
    if (!selectedResponse || !selectedExpert) return;
    console.log('Assigning expert:', {
      responseId: selectedResponse.id,
      expertId: selectedExpert
    });
    setShowAssignModal(false);
    setSelectedExpert('');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Response Management</h1>
        <div className="flex gap-4">
          <select className="border rounded-md px-3 py-2">
            <option>All Responses</option>
            <option>Expert Responses</option>
            <option>User Responses</option>
          </select>
          <select className="border rounded-md px-3 py-2">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Denied</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 text-blue-600">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Pending Review</span>
          </div>
          <p className="text-2xl font-bold mt-2">8</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 text-purple-600">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Expert Responses</span>
          </div>
          <p className="text-2xl font-bold mt-2">3</p>
        </div>
      </div>

      {/* Response List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Respondent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {responses.map(response => (
              <tr key={response.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm text-gray-900 line-clamp-2">{response.content.text}</div>
                    {response.content.media.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {response.content.media.map((media, index) => (
                          <div key={index} className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            {media.type === 'video' ? (
                              <Video className="w-6 h-6 text-gray-400" />
                            ) : (
                              <Image className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{response.respondentName}</div>
                    <div className="text-gray-500">
                      {response.respondentType === 'expert' ? (
                        <span className="flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          Expert
                        </span>
                      ) : 'User'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    response.status === 'approved' ? 'bg-green-100 text-green-800' :
                    response.status === 'denied' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {response.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleApprove(response)}
                    className="text-green-600 hover:text-green-900 mx-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeny(response)}
                    className="text-red-600 hover:text-red-900 mx-2"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                  {!response.assignedExpert && (
                    <button
                      onClick={() => handleAssign(response)}
                      className="text-blue-600 hover:text-blue-900 mx-2"
                    >
                      <Shield className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Denial Modal */}
      {showDenialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Deny Response</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Denial
              </label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={denialReason}
                onChange={(e) => setDenialReason(e.target.value)}
              >
                <option value="">Select a reason...</option>
                {denialReasons.map(reason => (
                  <option key={reason.id} value={reason.id}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                className="w-full border rounded-md px-3 py-2"
                rows={3}
                value={denialNote}
                onChange={(e) => setDenialNote(e.target.value)}
                placeholder="Optional additional explanation..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDenialModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={submitDenial}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={!denialReason}
              >
                Deny Response
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expert Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Assign Expert</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Expert
              </label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={selectedExpert}
                onChange={(e) => setSelectedExpert(e.target.value)}
              >
                <option value="">Choose an expert...</option>
                {experts.map(expert => (
                  <option key={expert.id} value={expert.id}>
                    {expert.name} - {expert.specialty}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={submitAssignment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!selectedExpert}
              >
                Assign Expert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseList; 