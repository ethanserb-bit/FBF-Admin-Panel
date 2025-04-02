import { apiClient } from './client';
import type {
  Request,
  RequestListParams,
  PaginatedResponse,
  DenyRequestData,
  AssignExpertData,
  ApproveRequestData,
} from './types';
import { toast } from 'react-hot-toast';

export const requestService = {
  async getRequests(params: RequestListParams = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<PaginatedResponse<Request>>(
      `/requests?${queryParams.toString()}`
    );

    if (!response.success) {
      toast.error(response.error?.message || 'Failed to fetch requests');
    }

    return response;
  },

  async getRequestById(id: string) {
    const response = await apiClient.get<Request>(`/requests/${id}`);

    if (!response.success) {
      toast.error(response.error?.message || 'Failed to fetch request details');
    }

    return response;
  },

  async approveRequest(data: ApproveRequestData) {
    const { requestId, ...approveData } = data;
    const response = await apiClient.post<Request>(
      `/requests/${requestId}/approve`,
      approveData
    );

    if (response.success) {
      toast.success('Request approved successfully');
    } else {
      toast.error(response.error?.message || 'Failed to approve request');
    }

    return response;
  },

  async denyRequest(data: DenyRequestData) {
    const { requestId, ...denyData } = data;
    const response = await apiClient.post<Request>(
      `/requests/${requestId}/deny`,
      denyData
    );

    if (response.success) {
      toast.success('Request denied successfully');
    } else {
      toast.error(response.error?.message || 'Failed to deny request');
    }

    return response;
  },

  async assignExpert(data: AssignExpertData) {
    const { requestId, ...assignData } = data;
    const response = await apiClient.post<Request>(
      `/requests/${requestId}/assign`,
      assignData
    );

    if (response.success) {
      toast.success('Expert assigned successfully');
    } else {
      toast.error(response.error?.message || 'Failed to assign expert');
    }

    return response;
  },

  async getRequestResponses(requestId: string) {
    const response = await apiClient.get<Request['responses']>(
      `/requests/${requestId}/responses`
    );

    if (!response.success) {
      toast.error(response.error?.message || 'Failed to fetch responses');
    }

    return response;
  },

  async addResponse(requestId: string, content: string) {
    const response = await apiClient.post<Request['responses'][0]>(
      `/requests/${requestId}/responses`,
      { content }
    );

    if (response.success) {
      toast.success('Response added successfully');
    } else {
      toast.error(response.error?.message || 'Failed to add response');
    }

    return response;
  },

  async updateResponse(requestId: string, responseId: string, content: string) {
    const response = await apiClient.put<Request['responses'][0]>(
      `/requests/${requestId}/responses/${responseId}`,
      { content }
    );

    if (response.success) {
      toast.success('Response updated successfully');
    } else {
      toast.error(response.error?.message || 'Failed to update response');
    }

    return response;
  },

  async deleteResponse(requestId: string, responseId: string) {
    const response = await apiClient.delete<void>(
      `/requests/${requestId}/responses/${responseId}`
    );

    if (response.success) {
      toast.success('Response deleted successfully');
    } else {
      toast.error(response.error?.message || 'Failed to delete response');
    }

    return response;
  }
}; 