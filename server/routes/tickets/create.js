import express from 'express';
import Ticket from '../../models/Ticket.js';
import { authenticate } from '../../middleware/auth.js';
import { upload, generateTicketNumber, isValidObjectId } from './helpers.js';
import { sendTicketCreatedEmail } from '../../utils/email.js';

const router = express.Router();

/* ===================== CREATE (FORM DATA) ===================== */
router.post('/', authenticate, upload.array('attachments', 10), async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      title,
      description,
      priority = 'medium',
      department,
      category,
      reason
    } = req.body;

    if (!title?.trim())
      return res.status(400).json({ message: 'Title is required' });

    if (!description?.trim())
      return res.status(400).json({ message: 'Description is required' });

    if (!department)
      return res.status(400).json({ message: 'Department is required' });

    const departmentId = isValidObjectId(department) ? department : null;
    const ticketNumber = await generateTicketNumber(departmentId);

    const attachments = req.files?.map(file => ({
      filename: `${Date.now()}-${file.originalname}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      data: file.buffer,
      uploadedAt: new Date()
    })) || [];

    const ticket = await Ticket.create({
      ticketNumber,
      type: 'ticket',
      title: title.trim(),
      description: description.trim(),
      category: category || null,
      reason: reason || null,
      attachments,
      priority,
      department: departmentId,
      createdBy: ['admin', 'superadmin'].includes(req.user.role) && req.body.createdBy ? req.body.createdBy : req.user._id,
      status: 'pending'
    });

    await ticket.populate(['createdBy', 'department']);

    if (ticket.createdBy?.email) {
      sendTicketCreatedEmail(ticket.createdBy.email, ticket)
        .catch(err => console.error('EMAIL ERROR:', err.message));
    }

    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/* ===================== CREATE (JSON) ===================== */
router.post('/json', authenticate, async (req, res) => {
  try {
    if (!req.user?._id)
      return res.status(401).json({ message: 'Unauthorized' });

    const {
      title,
      description,
      priority = 'medium',
      department,
      category,
      reason,
      attachments = []
    } = req.body;

    if (!title?.trim())
      return res.status(400).json({ message: 'Title is required' });

    if (!description?.trim())
      return res.status(400).json({ message: 'Description is required' });

    if (!department)
      return res.status(400).json({ message: 'Department is required' });

    const departmentId = isValidObjectId(department) ? department : null;
    const ticketNumber = await generateTicketNumber(departmentId);

    const ticket = await Ticket.create({
      ticketNumber,
      type: 'ticket',
      title: title.trim(),
      description: description.trim(),
      category,
      reason,
      attachments,
      priority,
      department: departmentId,
      createdBy: ['admin', 'superadmin'].includes(req.user.role) && req.body.createdBy ? req.body.createdBy : req.user._id,
      status: 'pending'
    });

    await ticket.populate(['createdBy', 'department']);

    if (ticket.createdBy?.email) {
      sendTicketCreatedEmail(ticket.createdBy.email, ticket)
        .catch(err => console.error(err));
    }

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;