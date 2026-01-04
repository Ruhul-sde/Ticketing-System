import express from 'express';
import mongoose from 'mongoose';
import Ticket from '../models/Ticket.js';
import Department from '../models/Department.js';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  sendTicketCreatedEmail,
  sendTicketResolvedEmail,
  sendTokenCompletedEmail
} from '../utils/email.js';

const router = express.Router();

/* ===================== HELPERS ===================== */

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ===================== TICKET NUMBER ===================== */

const generateTicketNumber = async (departmentId) => {
  const now = new Date();

  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  let deptInitial = 'G';

  if (departmentId && isValidObjectId(departmentId)) {
    const dept = await Department.findById(departmentId).lean();
    if (dept?.name) deptInitial = dept.name[0].toUpperCase();
  }

  const start = new Date(now.setHours(0, 0, 0, 0));
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const count = await Ticket.countDocuments({
    createdAt: { $gte: start, $lt: end },
    ...(departmentId && { department: departmentId })
  });

  return `T${yy}${mm}${dd}${deptInitial}${String(count + 1).padStart(3, '0')}`;
};

/* ===================== CREATE TICKET ===================== */

router.post('/', authenticate, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      title,
      description,
      priority = 'medium',
      department,
      category,
      attachments = [],
      reason
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: 'Title and description are required'
      });
    }

    const departmentId =
      department && isValidObjectId(department) ? department : null;

    const ticketNumber = await generateTicketNumber(departmentId);

    const ticket = await Ticket.create({
      ticketNumber,
      type: 'ticket',
      title,
      description,
      category,
      reason,
      attachments,
      priority,
      department: departmentId,
      createdBy: req.user._id
      // ✅ status defaults to "pending"
    });

    await ticket.populate(['createdBy', 'department']);

    // 📧 Non-blocking email
    if (ticket.createdBy?.email) {
      sendTicketCreatedEmail(ticket.createdBy.email, ticket)
        .catch(err => console.error('EMAIL ERROR:', err.message));
    }

    return res.status(201).json(ticket);

  } catch (error) {
    console.error('❌ CREATE TICKET FAILED:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
});

/* ===================== GET TICKETS (DASHBOARD FIX) ===================== */

router.get('/', authenticate, async (req, res) => {
  try {
    const query = {};

    // USER → own tickets
    if (req.user.role === 'user') {
      query.createdBy = req.user._id;
    }

    // ADMIN → department tickets
    if (
      req.user.role === 'admin' &&
      req.user.department &&
      req.user.department._id &&
      isValidObjectId(req.user.department._id)
    ) {
      query.department = req.user.department._id;
    }

    const tickets = await Ticket.find(query)
      .populate([
        { path: 'createdBy', select: 'name email' },
        { path: 'assignedTo', select: 'name email' },
        { path: 'solvedBy', select: 'name email' },
        { path: 'department', select: 'name' }
      ])
      .sort({ createdAt: -1 })
      .lean(); // 🔥 prevents frontend crash

    return res.status(200).json(tickets);

  } catch (error) {
    console.error('❌ GET TICKETS FAILED:', error);
    return res.status(500).json({
      message: 'Failed to load data'
    });
  }
});

/* ===================== UPDATE STATUS ===================== */

router.patch(
  '/:id/update',
  authenticate,
  authorize('admin', 'superadmin'),
  async (req, res) => {
    try {
      if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ticket ID' });
      }

      const oldTicket = await Ticket.findById(req.params.id);

      const ticket = await Ticket.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate(['createdBy', 'department']);

      if (
        oldTicket?.status !== 'resolved' &&
        ticket.status === 'resolved' &&
        ticket.createdBy?.email
      ) {
        const fn =
          ticket.type === 'token'
            ? sendTokenCompletedEmail
            : sendTicketResolvedEmail;

        fn(ticket.createdBy.email, ticket)
          .catch(err => console.error('EMAIL ERROR:', err.message));
      }

      return res.json(ticket);

    } catch (error) {
      console.error('❌ UPDATE FAILED:', error);
      return res.status(500).json({ message: 'Update failed' });
    }
  }
);

export default router;
