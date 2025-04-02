import React, { useState } from 'react';
import { MessageCircle, CheckCircle, XCircle, AlertCircle, User, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MediaContent {
  type: 'video' | 'voice' | 'image' | 'attachment';
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  fileType?: string;
}

interface Request {
  id: string;
  question: string;
  content: {
    text?: string;
    voice?: MediaContent;
    video?: MediaContent;
    attachments?: MediaContent[];
  };
  seekingAdviceFrom: 'male' | 'female' | 'non-binary' | 'everyone';
  planType: 'single' | 'expert' | 'multiple' | 'subscription';
  categories: RequestCategory[];
  status: 'pending' | 'approved' | 'rejected' | 'expert-assigned' | 'answered';
  createdAt: Date;
  responses: {
    id: string;
    content: {
      video: MediaContent; // Required video response
      text?: string;
      attachments?: MediaContent[];
      links?: string[];
    };
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    respondentType: 'user' | 'expert';
    respondentGender: 'male' | 'female' | 'non-binary';
  }[];
  userLocation: string;
  priority: 'high' | 'normal' | 'low';
  needsExpertReview: boolean;
}

type RequestCategory = 
  | 'Dating Apps'
  | 'Red Flags'
  | 'Trust Issues'
  | 'Communication'
  | 'Commitment'
  | 'Mixed Signals'
  | 'Long Distance'
  | 'First Dates'
  | 'Moving On'
  | 'Setting Boundaries'
  | 'Situationships'
  | 'Online Dating';

const Queue = () => {
  const [requests] = useState<Request[]>([
    {
      id: '1',
      question: "He says he's not ready for a relationship but keeps texting me daily. What should I do?",
      content: {
        text: "He says he's not ready, you should focus on yourself and set boundaries.",
        voice: {
          type: 'voice',
          url: '',
          duration: 120
        },
        video: {
          type: 'video',
          url: '',
          thumbnailUrl: '',
          duration: 180
        },
        attachments: [
          {
            type: 'image',
            url: '',
            thumbnailUrl: '',
            duration: 120
          }
        ]
      },
      seekingAdviceFrom: 'male',
      planType: 'single',
      categories: ['Dating Apps', 'Red Flags'],
      status: 'pending',
      createdAt: new Date(),
      responses: [
        {
          id: 'r1',
          content: {
            video: {
              type: 'video',
              url: '',
              thumbnailUrl: '',
              duration: 180
            },
            text: "If he's not ready, you should focus on yourself and set boundaries.",
            attachments: [
              {
                type: 'image',
                url: '',
                thumbnailUrl: '',
                duration: 120
              }
            ]
          },
          status: 'pending',
          createdAt: new Date(),
          respondentType: 'user',
          respondentGender: 'male'
        }
      ],
      userLocation: 'UCLA Campus',
      priority: 'normal',
      needsExpertReview: false
    },
    {
      id: '2',
      question: "Dealing with serious trust issues after being cheated on. Need professional advice.",
      content: {
        text: "Dealing with serious trust issues after being cheated on. Need professional advice.",
        voice: {
          type: 'voice',
          url: '',
          duration: 120
        },
        video: {
          type: 'video',
          url: '',
          thumbnailUrl: '',
          duration: 180
        },
        attachments: [
          {
            type: 'image',
            url: '',
            thumbnailUrl: '',
            duration: 120
          }
        ]
      },
      seekingAdviceFrom: 'everyone',
      planType: 'expert',
      categories: ['Trust Issues'],
      status: 'expert-assigned',
      createdAt: new Date(),
      responses: [],
      userLocation: 'UCLA Campus',
      priority: 'high',
      needsExpertReview: true
    }
  ]);

  const [filter, setFilter] = useState('all');

  const formatCategory = (category: RequestCategory) => {
    if (!category) return '';
    return category;
  };

  const handleApproveRequest = (id: string) => {
    console.log('Approve request:', id);
  };

  const handleRejectRequest = (id: string) => {
    console.log('Reject request:', id);
  };

  const handleAssignToExpert = (id: string) => {
    console.log('Assign to expert:', id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Request Management</h1>
        <div className="flex gap-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending Review</option>
            <option value="expert">Needs Expert</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-semibold">Pending Review</h3>
          </div>
          <p className="text-2xl font-bold">24</p>
          <p className="text-sm text-gray-500">Needs moderation</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Shield className="w-5 h-5" />
            <h3 className="font-semibold">Expert Queue</h3>
          </div>
          <p className="text-2xl font-bold">8</p>
          <p className="text-sm text-gray-500">Awaiting expert response</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-semibold">Response Queue</h3>
          </div>
          <p className="text-2xl font-bold">31</p>
          <p className="text-sm text-gray-500">Pending responses</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-semibold">Resolved Today</h3>
          </div>
          <p className="text-2xl font-bold">45</p>
          <p className="text-sm text-gray-500">Successfully handled</p>
        </div>
      </div>

      {/* Request List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Active Requests</h2>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-4">Request</th>
                <th className="pb-4">Seeking Advice</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Responses</th>
                <th className="pb-4">Created</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-t">
                  {/* Request Info */}
                  <td className="py-4">
                    <Link to={`/requests/${request.id}`} className="hover:text-purple-600">
                      <div className="max-w-md">
                        <p className="font-medium">{request.question}</p>
                        <div className="flex gap-2 mt-1">
                          {request.categories.map((category, index) => (
                            <span 
                              key={index}
                              className={`px-2 py-1 text-xs rounded-full ${
                                category === 'Red Flags' ? 'bg-red-100 text-red-800' :
                                'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {formatCategory(category)}
                            </span>
                          ))}
                          {request.needsExpertReview && (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              Expert Review
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </td>

                  {/* Seeking Advice */}
                  <td className="py-4">
                    <span className="flex items-center gap-1">
                      {request.planType === 'expert' ? (
                        <Shield className="w-4 h-4 text-blue-600" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      {request.seekingAdviceFrom}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      request.status === 'expert-assigned' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>

                  {/* Responses Count */}
                  <td className="py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                      {request.responses.length} responses
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="py-4 text-gray-500">
                    {request.createdAt.toLocaleTimeString()}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveRequest(request.id)}
                        className="p-1 hover:bg-green-100 rounded"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="p-1 hover:bg-red-100 rounded"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4 text-red-600" />
                      </button>
                      {request.planType !== 'expert' && (
                        <button
                          onClick={() => handleAssignToExpert(request.id)}
                          className="p-1 hover:bg-blue-100 rounded"
                          title="Assign to Expert"
                        >
                          <Shield className="w-4 h-4 text-blue-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Queue;
