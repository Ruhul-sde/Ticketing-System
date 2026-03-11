import express from 'express';
import Ticket from '../../models/Ticket.js';
import { authenticate } from '../../middleware/auth.js';
import { upload, isValidObjectId } from './helpers.js';

const router = express.Router();

router.put('/:id', authenticate, upload.array('attachments', 10), async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id))
      return res.status(400).json({ message: 'Invalid ticket ID' });

    const ticket = await Ticket.findById(id);
    if (!ticket)
      return res.status(404).json({ message: 'Ticket not found' });

    const isCreator = ticket.createdBy.toString() === req.user._id.toString();
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

    if (!isCreator && !isAdmin)
      return res.status(403).json({ message: 'Permission denied' });

    if (req.user.role === 'user' && ticket.status !== 'pending')
      return res.status(400).json({ message: 'Only pending tickets can be edited' });

    Object.assign(ticket, req.body);

    if (req.files?.length) {
      const files = req.files.map(file => ({
        filename: `${Date.now()}-${file.originalname}`,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        data: file.buffer,
        uploadedAt: new Date()
      }));
      ticket.attachments.push(...files);
    }

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update ticket' });
  }
});

export default router;