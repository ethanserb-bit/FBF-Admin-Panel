import { Request as ExpressRequest, Response } from 'express';
import Request from '../models/Request';
import Expert from '../models/Expert';

export const requestController = {
  async approveRequest(req: ExpressRequest, res: Response) {
    try {
      const { requestId } = req.params;
      const { type } = req.body;

      const request = await Request.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      request.status = 'approved';
      await request.save();

      // Move to appropriate section
      if (type === 'expert') {
        // Additional expert-specific logic here
        const experts = await Expert.find({ isAvailable: true });
        // Notify experts logic would go here
      }

      res.json({ success: true, message: 'Request approved successfully' });
    } catch (error) {
      console.error('Error in approveRequest:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async denyRequest(req: ExpressRequest, res: Response) {
    try {
      const { requestId } = req.params;
      const { reason } = req.body;

      const request = await Request.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      request.status = 'denied';
      request.denialReason = reason;
      request.refundStatus = 'pending';
      await request.save();

      // Notification logic would go here
      
      res.json({ success: true, message: 'Request denied successfully' });
    } catch (error) {
      console.error('Error in denyRequest:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async assignExpert(req: ExpressRequest, res: Response) {
    try {
      const { requestId } = req.params;
      const { expertId, exclusive, commissionRate } = req.body;

      const [request, expert] = await Promise.all([
        Request.findById(requestId),
        Expert.findById(expertId)
      ]);

      if (!request || !expert) {
        return res.status(404).json({ 
          message: !request ? 'Request not found' : 'Expert not found' 
        });
      }

      request.assignedExpertId = expertId;
      request.isExclusive = exclusive;
      request.commissionRate = commissionRate;
      await request.save();

      // Notification logic would go here

      res.json({ success: true, message: 'Expert assigned successfully' });
    } catch (error) {
      console.error('Error in assignExpert:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async startAnswering(req: ExpressRequest, res: Response) {
    try {
      const { requestId } = req.params;
      const { type } = req.body;

      const request = await Request.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      request.status = 'in_progress';
      await request.save();

      res.json({ success: true, message: 'Started answering request' });
    } catch (error) {
      console.error('Error in startAnswering:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getAvailableExperts(req: ExpressRequest, res: Response) {
    try {
      const experts = await Expert.find({ 
        isAvailable: true 
      }).select('name specialties rating responseRate');

      res.json(experts);
    } catch (error) {
      console.error('Error in getAvailableExperts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async processRefund(req: ExpressRequest, res: Response) {
    try {
      const { requestId } = req.params;

      const request = await Request.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      // Add your payment processing logic here
      request.refundStatus = 'processed';
      await request.save();

      res.json({ success: true, message: 'Refund processed successfully' });
    } catch (error) {
      console.error('Error in processRefund:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async moveToSection(req: ExpressRequest, res: Response) {
    try {
      const { requestId } = req.params;
      const { section } = req.body;

      const request = await Request.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      // Add logic to move request to appropriate section
      // This might involve updating UI state or other metadata

      res.json({ success: true, message: `Request moved to ${section} section` });
    } catch (error) {
      console.error('Error in moveToSection:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}; 