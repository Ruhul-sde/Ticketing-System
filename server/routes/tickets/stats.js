import express from 'express';
import Ticket from '../../models/Ticket.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

router.get('/dashboard/stats', authenticate, async (req, res) => {
  try {
    const tickets = await Ticket.find();

    res.json({
      total: tickets.length,
      pending: tickets.filter(t => t.status === 'pending').length,
      resolved: tickets.filter(t => t.status === 'resolved').length
    });
  } catch (err) {
    res.status(500).json({ message: 'Stats failed' });
  }
});

export default router;