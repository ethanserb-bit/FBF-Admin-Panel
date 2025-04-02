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

export const notificationService = {
  async sendNotification(data: NotificationData) {
    try {
      // TODO: Implement your preferred notification system
      // This could be:
      // 1. Push notifications using Firebase Cloud Messaging
      // 2. In-app notifications stored in MongoDB
      // 3. Email notifications
      // 4. SMS notifications
      // 5. WebSocket real-time notifications

      // For now, we'll simulate storing in MongoDB
      const notification = {
        ...data,
        read: false,
        createdAt: new Date(),
      };

      // Simulate storing notification
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      // If using WebSocket, emit to specific user
      // socket.to(data.userId).emit('notification', notification);

      return { success: true };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false };
    }
  },

  async sendBulkNotifications(notifications: NotificationData[]) {
    try {
      const results = await Promise.all(
        notifications.map(notification => this.sendNotification(notification))
      );

      return {
        success: results.every(result => result.success),
        totalSent: results.filter(result => result.success).length,
      };
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      return { success: false, totalSent: 0 };
    }
  },

  async notifyExperts(requestId: string, experts: { id: string }[]) {
    const notifications = experts.map(expert => ({
      userId: expert.id,
      title: 'New Expert Request Available',
      message: 'A new request matching your expertise is available.',
      type: 'info' as const,
      actions: [{
        label: 'View Request',
        action: `VIEW_REQUEST_${requestId}`,
      }],
    }));

    return this.sendBulkNotifications(notifications);
  },

  async sendDenialNotification(userId: string, requestId: string, reason: string) {
    return this.sendNotification({
      userId,
      title: 'Request Denied',
      message: reason,
      type: 'info',
      actions: [
        {
          label: 'Get Refund',
          action: `REFUND_${requestId}`,
        },
        {
          label: 'Edit Request',
          action: `EDIT_REQUEST_${requestId}`,
        },
      ],
    });
  },

  async sendExpertAssignmentNotification(expertId: string, requestId: string) {
    return this.sendNotification({
      userId: expertId,
      title: 'New Exclusive Request',
      message: 'You have been assigned an exclusive request with premium commission.',
      type: 'success',
      actions: [{
        label: 'View Request',
        action: `VIEW_REQUEST_${requestId}`,
      }],
    });
  },
}; 