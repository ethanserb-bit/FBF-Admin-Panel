import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, CheckCircle, XCircle, AlertTriangle, Video, Shield, UserPlus, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
  responses: Response[];
}

interface Response {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    type: 'user' | 'expert';
  };
  createdAt: Date;
  status: 'pending' | 'approved' | 'denied';
}

const ResponseSection: React.FC<{ response: Response }> = ({ response }) => {
  return (
    <div className="border-b last:border-b-0 py-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{response.author.name}</span>
            {response.author.type === 'expert' && (
              <Shield className="w-4 h-4 text-blue-500" />
            )}
          </div>
          <span className="text-sm text-gray-500">
            {new Date(response.createdAt).toLocaleString()}
          </span>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          response.status === 'approved' ? 'bg-green-100 text-green-800' :
          response.status === 'denied' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
        </span>
      </div>
      <p className="text-gray-700 mt-2">{response.content}</p>
    </div>
  );
};

const RequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      try {
        // Mock data for now - replace with actual API call
        const mockRequest: Request = {
          id: id || '1',
          question: 'Need advice on rebuilding trust',
          content: 'Detailed description of the situation...',
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
          ],
          responses: [
            {
              id: 'resp1',
              content: 'This is a thoughtful response to your situation...',
              author: {
                id: 'expert1',
                name: 'Dr. Smith',
                type: 'expert'
              },
              createdAt: new Date(),
              status: 'pending'
            }
          ]
        };
        setRequest(mockRequest);
      } catch (error) {
        console.error('Error fetching request:', error);
        toast.error('Failed to load request details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRequest();
    }
  }, [id]);

  const handleApprove = async () => {
    if (!request) return;
    try {
      // Implement approve logic
      toast.success('Request approved successfully');
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleDeny = async () => {
    if (!request) return;
    try {
      // Implement deny logic
      toast.success('Request denied successfully');
    } catch (error) {
      toast.error('Failed to deny request');
    }
  };

  const handleAssign = async () => {
    if (!request) return;
    try {
      // Implement assign logic
      toast.success('Expert assigned successfully');
    } catch (error) {
      toast.error('Failed to assign expert');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Request not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Queue
      </button>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{request.question}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              request.type === 'expert' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
            </span>
            {request.isUrgent && (
              <span className="flex items-center gap-1 text-orange-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Urgent</span>
              </span>
            )}
            <span className="text-sm text-gray-500">
              {new Date(request.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        {request.status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={handleDeny}
              className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <XCircle className="w-4 h-4" />
              Deny
            </button>
            <button
              onClick={handleAssign}
              className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <UserPlus className="w-4 h-4" />
              Assign Expert
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="prose max-w-none">
          <p>{request.content}</p>
        </div>

        {request.mediaAttachments && request.mediaAttachments.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-900 mb-2">Media Attachments</h3>
            <div className="grid grid-cols-3 gap-4">
              {request.mediaAttachments.map((media, index) => (
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
      </div>

      {/* User Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">User Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Name</span>
            <p className="font-medium">{request.userDetails.name}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Membership</span>
            <p className="font-medium">{request.userDetails.membershipType}</p>
          </div>
        </div>
      </div>

      {/* Responses */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Responses</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {request.responses.map((response) => (
            <div key={response.id} className="p-4">
              <ResponseSection response={response} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
