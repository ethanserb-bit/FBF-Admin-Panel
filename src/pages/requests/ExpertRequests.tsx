import React, { useState } from 'react';
import { MessageCircle, CheckCircle, XCircle, Shield, Eye, Video, Image, Paperclip, Play } from 'lucide-react';

interface MediaContent {
  type: 'video' | 'voice' | 'image' | 'attachment';
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  fileType?: string;
}

interface ExpertRequest {
  id: string;
  question: string;
  content: {
    text?: string;
    media?: MediaContent[];
  };
  status: 'pending' | 'approved' | 'assigned' | 'completed' | 'rejected';
  expert?: {
    id: string;
    name: string;
    specialty: string;
  };
  responses: Response[];
  createdAt: Date;
}

interface Response {
  id: string;
  expertId: string;
  content: {
    text: string;
    media: MediaContent[];
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const ExpertRequests: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<ExpertRequest | null>(null);
  const [requests] = useState<ExpertRequest[]>([
    {
      id: '1',
      question: "Need professional advice about trust issues after infidelity",
      content: {
        text: "My partner cheated on me 6 months ago...",
        media: [
          {
            type: 'video',
            url: '/sample-video.mp4',
            thumbnailUrl: '/video-thumb.jpg',
            duration: 120
          }
        ]
      },
      status: 'pending',
      responses: [],
      createdAt: new Date()
    },
    {
      id: '2',
      question: "Looking for expert guidance on rebuilding trust",
      content: {
        text: "After a difficult breakup...",
        media: []
      },
      status: 'approved',
      responses: [],
      createdAt: new Date()
    }
  ]);

  const handleApproveRequest = (id: string) => {
    console.log('Approving request:', id);
    // Here you would update the request status to 'approved'
  };

  const handleRejectRequest = (id: string) => {
    console.log('Rejecting request:', id);
    // Here you would update the request status to 'rejected'
  };

  const handleAssignExpert = (requestId: string, expertId: string) => {
    console.log('Assigning expert:', expertId, 'to request:', requestId);
    // Here you would update the request with the assigned expert and change status to 'assigned'
  };

  const handleApproveResponse = (requestId: string, responseId: string) => {
    console.log('Approving response:', responseId, 'for request:', requestId);
  };

  const renderMediaPreview = (media: MediaContent) => {
    switch (media.type) {
      case 'video':
        return (
          <div className="relative group cursor-pointer">
            <div className="w-32 h-24 bg-gray-100 rounded flex items-center justify-center">
              {media.thumbnailUrl ? (
                <img src={media.thumbnailUrl} alt="Video thumbnail" className="w-full h-full object-cover rounded" />
              ) : (
                <Video className="w-8 h-8 text-gray-400" />
              )}
              <Play className="absolute inset-0 m-auto w-8 h-8 text-white opacity-0 group-hover:opacity-100" />
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {Math.floor(media.duration! / 60)}:{(media.duration! % 60).toString().padStart(2, '0')}
            </span>
          </div>
        );
      case 'image':
        return (
          <div className="w-32 h-24 bg-gray-100 rounded">
            <img src={media.url} alt="Attachment" className="w-full h-full object-cover rounded" />
          </div>
        );
      default:
        return (
          <div className="w-32 h-24 bg-gray-100 rounded flex items-center justify-center">
            <Paperclip className="w-8 h-8 text-gray-400" />
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expert Requests</h1>
        <div className="flex gap-2">
          <select className="px-4 py-2 border rounded-md">
            <option value="all">All Requests</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.map(request => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{request.question}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    <p className="text-sm text-gray-500">
                      {request.createdAt.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveRequest(request.id)}
                        className="p-2 hover:bg-green-50 rounded-full"
                        title="Approve Request"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="p-2 hover:bg-red-50 rounded-full"
                        title="Reject Request"
                      >
                        <XCircle className="w-5 h-5 text-red-600" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="p-2 hover:bg-gray-50 rounded-full"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Media Preview */}
              {request.content.media && request.content.media.length > 0 && (
                <div className="flex gap-4 mt-4">
                  {request.content.media.map((media, index) => (
                    <div key={index}>
                      {renderMediaPreview(media)}
                    </div>
                  ))}
                </div>
              )}

              {/* Expert Assignment - Now shows for approved requests */}
              {(request.status === 'approved' || request.status === 'pending') && !request.expert && (
                <div className="mt-4 p-4 bg-blue-50 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Assign Expert</span>
                  </div>
                  <select 
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => handleAssignExpert(request.id, e.target.value)}
                  >
                    <option value="">Select an expert...</option>
                    <option value="1">Dr. Sarah Johnson - Relationship Counselor</option>
                    <option value="2">Dr. Michael Chen - Dating Coach</option>
                    <option value="3">Lisa Thompson - Family Therapist</option>
                  </select>
                </div>
              )}

              {/* Responses Section */}
              {request.responses.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium mb-2">Responses</h4>
                  {request.responses.map(response => (
                    <div key={response.id} className="bg-gray-50 p-3 rounded-md mb-2">
                      <div className="flex justify-between items-start">
                        <p className="text-sm">{response.content.text}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveResponse(request.id, response.id)}
                            className="p-1 hover:bg-green-100 rounded"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      {response.content.media && response.content.media.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {response.content.media.map((media, index) => (
                            <div key={index} className="w-20 h-20">
                              {renderMediaPreview(media)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertRequests; 