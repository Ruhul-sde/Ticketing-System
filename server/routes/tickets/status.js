import express from 'express';
import Ticket from '../../models/Ticket.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { isValidObjectId } from './helpers.js';
import { sendTicketResolvedEmail } from '../../utils/email.js';

const router = express.Router();

router.patch('/:id/status', authenticate, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res.status(400).json({ message: 'Invalid ID' });

    const { status, solution } = req.body;

    const ticket = await Ticket.findById(req.params.id).populate('createdBy');
    if (!ticket)
      return res.status(404).json({ message: 'Ticket not found' });

    ticket.status = status;
    if (solution) ticket.solution = solution;

    if (status === 'resolved') {
      ticket.solvedAt = new Date();
      ticket.solvedBy = req.user._id;
      ticket.timeToSolve = new Date() - ticket.createdAt;

      if (ticket.createdBy?.email) {
        sendTicketResolvedEmail(ticket.createdBy.email, ticket)
          .catch(err => console.error(err));
      }
    }

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Status update failed' });
  }
});

export default router;