export interface User {
  id: string;
  name: string;
  email: string;
  membershipType: 'free' | 'premium' | 'vip';
}

export interface Expert {
  id: string;
  name: string;
  email: string;
  specialty: string[];
  bio: string;
  verified: boolean;
  rating: number;
  totalAdvice: number;
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
}

export interface Request {
  id: string;
  question: string;
  content: string;
  status: 'pending' | 'approved' | 'denied';
  isUrgent: boolean;
  category: string;
  type: 'regular' | 'expert';
  createdAt: string;
  userId: string;
  userDetails: User;
  mediaAttachments?: MediaAttachment[];
  responses: Response[];
  assignedExpert?: Expert;
}

export interface Response {
  id: string;
  requestId: string;
  content: string;
  author: {
    id: string;
    name: string;
    type: 'user' | 'expert';
  };
  createdAt: string;
  status: 'pending' | 'approved' | 'denied';
}

export interface RequestListParams {
  page?: number;
  limit?: number;
  status?: Request['status'];
  type?: Request['type'];
  category?: string;
  isUrgent?: boolean;
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DenyRequestData {
  requestId: string;
  reason: string;
  additionalNotes?: string;
}

export interface AssignExpertData {
  requestId: string;
  expertId: string;
  exclusive?: boolean;
  commissionRate?: number;
}

export interface ApproveRequestData {
  requestId: string;
  type: Request['type'];
  priority?: 'high' | 'normal' | 'low';
  notes?: string;
} 