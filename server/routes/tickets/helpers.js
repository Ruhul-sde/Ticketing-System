import mongoose from 'mongoose';
import multer from 'multer';
import Ticket from '../../models/Ticket.js';
import Department from '../../models/Department.js';

/* ===================== OBJECT ID VALIDATOR ===================== */
export const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

/* ===================== MULTER SETUP ===================== */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|csv/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) cb(null, true);
  else cb(new Error('Only image and document files are allowed'));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10
  }
});

/* ===================== TICKET NUMBER GENERATOR ===================== */
export const generateTicketNumber = async (departmentId) => {
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