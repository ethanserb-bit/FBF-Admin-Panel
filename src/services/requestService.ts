import { toast } from 'react-hot-toast';

interface RequestResponse {
  success: boolean;
  message: string;
}

interface DenyRequestData {
  requestId: string;
  reason: string;
}

interface AssignExpertData {
  requestId: string;
  expertId: string;
}

interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  actions?: {
    label: string;
    action: string;
  }[];
}

// Helper function for expert notifications
async function notifyExperts(requestId: string): Promise<void> {
  try {
    // Get all available experts
    const expertsResponse = await fetch('/api/experts/available');
    const experts = await expertsResponse.json();

    // Notify each expert
    const notifications = experts.map((expert: { id: string }) => ({
      userId: expert.id,
      title: 'New Expert Request Available',
      message: 'A new request matching your expertise is available.',
      type: 'info' as const
    }));

    await Promise.all(
      notifications.map(notification =>
        fetch('/api/notifications/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notification),
        })
      )
    );
  } catch (error) {
    console.error('Error notifying experts:', error);
  }
}

export const requestService = {
  async approveRequest(requestId: string, type: 'regular' | 'expert'): Promise<RequestResponse> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) throw new Error('Failed to approve request');

      // Move request to appropriate section based on type
      if (type === 'expert') {
        // Move to expert requests section
        await fetch(`/api/requests/${requestId}/move-to-expert`, {
          method: 'POST',
        });
        
        // Notify available experts
        await notifyExperts(requestId);
        toast.success('Request approved and moved to expert section');
      } else {
        // Move to general advice section
        await fetch(`/api/requests/${requestId}/move-to-general`, {
          method: 'POST',
        });
        toast.success('Request approved and moved to general advice section');
      }

      return { success: true, message: 'Request approved successfully' };
    } catch (error) {
      console.error('Error approving request:', error);
      return { success: false, message: 'Failed to approve request' };
    }
  },

  async denyRequest({ requestId, reason }: DenyRequestData): Promise<RequestResponse> {
    try {
      // Send denial notification with refund options
      const notification: NotificationData = {
        userId: 'user_id', // Replace with actual user ID
        title: 'Request Denied',
        message: reason,
        type: 'info',
        actions: [
          {
            label: 'Get Refund',
            action: 'REFUND'
          },
          {
            label: 'Edit Request',
            action: 'EDIT'
          }
        ]
      };

      // TODO: Replace with actual API calls
      const [denyResponse, notificationResponse] = await Promise.all([
        fetch(`/api/requests/${requestId}/deny`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason }),
        }),
        fetch('/api/notifications/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notification),
        })
      ]);

      if (!denyResponse.ok || !notificationResponse.ok) {
        throw new Error('Failed to process denial');
      }

      toast.success('Request denied and user notified with options');
      return { success: true, message: 'Request denied successfully' };
    } catch (error) {
      console.error('Error denying request:', error);
      return { success: false, message: 'Failed to deny request' };
    }
  },

  async assignExpert({ requestId, expertId }: AssignExpertData): Promise<RequestResponse> {
    try {
      // Assign expert and make request exclusive
      const response = await fetch(`/api/requests/${requestId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          expertId,
          exclusive: true, // Make it only visible to assigned expert
          commissionRate: 0.75 // Higher commission rate for assigned experts
        }),
      });

      if (!response.ok) throw new Error('Failed to assign expert');

      // Notify expert of new exclusive request
      const notification: NotificationData = {
        userId: expertId,
        title: 'New Exclusive Request',
        message: 'You have been assigned an exclusive request with premium commission.',
        type: 'success'
      };

      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      toast.success('Expert assigned successfully with exclusive access');
      return { success: true, message: 'Expert assigned successfully' };
    } catch (error) {
      console.error('Error assigning expert:', error);
      return { success: false, message: 'Failed to assign expert' };
    }
  }
}; 