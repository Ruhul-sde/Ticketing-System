// components/user-dashboard/TicketDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  ClockIcon, 
  UserIcon, 
  BuildingOfficeIcon, 
  TagIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  PaperClipIcon,
  DocumentIcon,
  PhotoIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  CheckIcon,
  TrashIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Get API base URL from environment or use relative path
const API_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:5000/api' 
  : '/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.message);
    return Promise.reject(error);
  }
);

const TicketDetailModal = ({ ticket, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: ticket.feedback?.rating || 0,
    comment: ticket.feedback?.comment || ''
  });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(!!ticket.feedback);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState({
    title: ticket.title || '',
    description: ticket.description || '',
    category: ticket.category || '',
    priority: ticket.priority || 'medium',
    department: ticket.department?._id || ticket.department || ''
  });
  const [newAttachments, setNewAttachments] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [attachmentsToRemove, setAttachmentsToRemove] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [error, setError] = useState('');

  // Initialize data
  useEffect(() => {
    setEditData({
      title: ticket.title || '',
      description: ticket.description || '',
      category: ticket.category || '',
      priority: ticket.priority || 'medium',
      department: ticket.department?._id || ticket.department || ''
    });
    setFeedback({
      rating: ticket.feedback?.rating || 0,
      comment: ticket.feedback?.comment || ''
    });
    setFeedbackSubmitted(!!ticket.feedback);
    
    // Initialize attachments
    if (ticket.attachments && Array.isArray(ticket.attachments)) {
      setExistingAttachments(ticket.attachments);
    }
  }, [ticket]);

  // Load departments when modal opens
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoadingDepartments(true);
      setError('');
      
      console.log('Fetching departments...');
      
      // Try multiple endpoints
      const endpoints = ['/departments', '/api/departments', '/admin/departments'];
      let departmentsData = [];
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint);
          console.log('Departments response from', endpoint, ':', response.data);
          
          if (response.data && Array.isArray(response.data)) {
            departmentsData = response.data;
            break;
          } else if (response.data && Array.isArray(response.data.departments)) {
            departmentsData = response.data.departments;
            break;
          } else if (response.data && Array.isArray(response.data.data)) {
            departmentsData = response.data.data;
            break;
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err.message);
          continue;
        }
      }
      
      // If no departments found from API, use sample data
      if (departmentsData.length === 0) {
        console.log('Using sample departments');
        departmentsData = [
          { _id: 'tech', name: 'Technical Support' },
          { _id: 'billing', name: 'Billing' },
          { _id: 'sales', name: 'Sales' },
          { _id: 'support', name: 'Customer Support' },
          { _id: 'hr', name: 'Human Resources' }
        ];
      }
      
      // Add current department if not in list
      if (ticket.department && ticket.department._id) {
        const exists = departmentsData.some(dept => 
          dept && dept._id && dept._id === ticket.department._id
        );
        if (!exists && ticket.department.name) {
          departmentsData.unshift(ticket.department);
        }
      }
      
      setDepartments(departmentsData);
      console.log('Departments loaded:', departmentsData.length);
    } catch (err) {
      console.error('Failed to load departments:', err);
      setError('Could not load departments. Using default options.');
      
      // Set default departments
      setDepartments([
        { _id: 'tech', name: 'Technical Support' },
        { _id: 'billing', name: 'Billing' },
        { _id: 'sales', name: 'Sales' }
      ]);
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      alert('Some files exceed the 10MB size limit');
    }
    setNewAttachments(prev => [...prev, ...validFiles]);
  };

  const removeNewAttachment = (index) => {
    setNewAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (attachmentId) => {
    setAttachmentsToRemove(prev => [...prev, attachmentId]);
    setExistingAttachments(prev => prev.filter(att => att._id !== attachmentId));
  };

  const handleUpdateTicket = async () => {
    if (!editData.title.trim() || !editData.description.trim()) {
      alert('Title and Description are required');
      return;
    }

    setIsUpdating(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('title', editData.title.trim());
      formData.append('description', editData.description.trim());
      
      if (editData.category) {
        formData.append('category', editData.category);
      }
      
      formData.append('priority', editData.priority);
      
      if (editData.department) {
        formData.append('department', editData.department);
      }
      
      // Add new files
      newAttachments.forEach(file => {
        formData.append('attachments', file);
      });

      console.log('Updating ticket ID:', ticket._id);
      console.log('Update data:', {
        title: editData.title,
        description: editData.description,
        category: editData.category,
        priority: editData.priority,
        department: editData.department,
        newAttachments: newAttachments.length
      });

      // Try multiple endpoints for update
      const endpoints = [
        `/tickets/${ticket._id}`,
        `/api/tickets/${ticket._id}`,
        `/ticket/${ticket._id}`
      ];
      
      let response;
      let lastError;
      
      for (const endpoint of endpoints) {
        try {
          console.log('Trying endpoint:', endpoint);
          response = await api.put(endpoint, formData, {
            headers: { 
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Update successful via', endpoint);
          break;
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err.message);
          lastError = err;
          continue;
        }
      }
      
      if (!response) {
        throw lastError || new Error('All update endpoints failed');
      }

      alert('✅ Ticket updated successfully!');
      setIsEditing(false);
      setNewAttachments([]);
      setAttachmentsToRemove([]);
      
      // Trigger parent update
      if (onUpdate) {
        onUpdate(response.data);
      }
      
    } catch (err) {
      console.error('Error updating ticket:', err);
      const status = err.response?.status;
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
      
      if (status === 404) {
        setError(`API endpoint not found. Please check your server configuration.`);
      } else if (status === 401) {
        setError('Session expired. Please log in again.');
      } else if (status === 403) {
        setError('You do not have permission to update this ticket.');
      } else {
        setError(`Failed to update ticket: ${errorMsg}`);
      }
      
      alert(`❌ Failed to update ticket: ${errorMsg}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const downloadAttachment = async (attachmentId, fileName) => {
    try {
      const endpoints = [
        `/tickets/${ticket._id}/attachment/${attachmentId}`,
        `/api/tickets/${ticket._id}/attachment/${attachmentId}`,
        `/ticket/${ticket._id}/attachment/${attachmentId}`
      ];
      
      let response;
      
      for (const endpoint of endpoints) {
        try {
          response = await api.get(endpoint, { responseType: 'blob' });
          break;
        } catch (err) {
          console.log(`Download endpoint ${endpoint} failed:`, err.message);
          continue;
        }
      }
      
      if (!response) {
        throw new Error('All download endpoints failed');
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'attachment');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert(`Failed to download file: ${error.message}`);
    }
  };

  const viewAttachment = async (attachmentId, fileName, mimeType) => {
    try {
      const response = await api.get(`/tickets/${ticket._id}/view/${attachmentId}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { 
        type: mimeType || response.headers['content-type'] 
      });
      const url = window.URL.createObjectURL(blob);

      if (mimeType?.startsWith('image/') || mimeType === 'application/pdf') {
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          alert('Please allow popups to view this file');
          downloadAttachment(attachmentId, fileName);
        }
      } else {
        downloadAttachment(attachmentId, fileName);
      }
    } catch (error) {
      console.error('View error:', error);
      downloadAttachment(attachmentId, fileName);
    }
  };

  const canEdit = () => {
    if (!user) return false;
    
    if (user.role === 'user') {
      return ticket.status === 'pending' && 
             user._id === (ticket.createdBy?._id || ticket.createdBy);
    }
    return ['admin', 'superadmin'].includes(user.role);
  };

  const statusColors = {
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    assigned: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    closed: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  };

  const priorityColors = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const handleStarClick = (rating) => {
    if (!feedbackSubmitted && ticket.status === 'resolved') {
      setFeedback(prev => ({ ...prev, rating }));
    }
  };

  const submitFeedback = async () => {
    if (!feedback.rating || feedback.rating < 1) {
      alert('Please select a rating (1-5 stars)');
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const response = await api.post(`/tickets/${ticket._id}/feedback`, {
        rating: feedback.rating,
        comment: feedback.comment.trim() || undefined
      });

      setFeedbackSubmitted(true);
      setShowFeedbackForm(false);
      alert('✅ Thank you for your feedback!');
      
      if (onUpdate) {
        onUpdate(response.data);
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert(`❌ Failed to submit feedback: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const canGiveFeedback = ticket.status === 'resolved' && 
                         !feedbackSubmitted && 
                         user._id === (ticket.createdBy?._id || ticket.createdBy);

  const getFileIcon = (fileName, mimeType) => {
    if (!fileName && !mimeType) return <DocumentIcon className="w-5 h-5 text-[#455185]" />;
    
    const extension = fileName?.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension) || 
        mimeType?.startsWith('image/')) {
      return <PhotoIcon className="w-5 h-5 text-[#455185]" />;
    } else if (extension === 'pdf' || mimeType === 'application/pdf') {
      return <DocumentTextIcon className="w-5 h-5 text-[#455185]" />;
    } else if (['doc', 'docx'].includes(extension) || 
               mimeType?.includes('msword')) {
      return <DocumentTextIcon className="w-5 h-5 text-[#455185]" />;
    } else if (['xls', 'xlsx'].includes(extension) || 
               mimeType?.includes('excel')) {
      return <DocumentTextIcon className="w-5 h-5 text-[#455185]" />;
    }
    
    return <DocumentIcon className="w-5 h-5 text-[#455185]" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
      <div className="absolute inset-0 bg-[#0a0c14]/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="h-2 bg-gradient-to-r from-[#ED1B2F] to-[#455185]" />
        
        <div className="p-6 md:p-8">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <ExclamationCircleIcon className="w-5 h-5" />
                <span className="font-bold">Error</span>
              </div>
              <p className="text-white/80 text-sm">{error}</p>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4 pr-4">
                  <div>
                    <label className="block text-sm font-bold text-white/60 mb-2 text-left">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={handleEditChange}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ED1B2F] transition-colors"
                      placeholder="Enter ticket title"
                      required
                    />
                  </div>
                </div>
              ) : (
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4">{ticket.title}</h2>
              )}
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${statusColors[ticket.status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                  {ticket.status?.toUpperCase()}
                </span>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${priorityColors[ticket.priority] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                  {ticket.priority?.toUpperCase()} PRIORITY
                </span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-white/80 border border-white/10">
                  #{ticket.ticketNumber || ticket._id?.slice(-8)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {canEdit() && !isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#ED1B2F] to-[#b01423] rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  Edit Ticket
                </button>
              )}
              {isEditing && (
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setNewAttachments([]);
                    setAttachmentsToRemove([]);
                    setError('');
                  }}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-white/10 rounded-xl text-white font-bold text-sm hover:bg-white/20 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Ticket Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <BuildingOfficeIcon className="w-5 h-5 text-[#455185]" />
                <span className="text-sm font-bold text-white/60">Department</span>
              </div>
              {isEditing ? (
                <div>
                  <select
                    name="department"
                    value={editData.department}
                    onChange={handleEditChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ED1B2F] transition-colors"
                    disabled={isLoadingDepartments}
                  >
                    <option value="">Select Department</option>
                    {Array.isArray(departments) && departments.map(dept => (
                      <option key={dept._id || dept.id} value={dept._id || dept.id}>
                        {dept.name || 'Unknown Department'}
                      </option>
                    ))}
                  </select>
                  {isLoadingDepartments && (
                    <p className="text-xs text-white/40 mt-1">Loading departments...</p>
                  )}
                </div>
              ) : (
                <p className="text-white font-medium">{ticket.department?.name || 'Not assigned'}</p>
              )}
            </div>
            
            <div className="bg-white/5 p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <ClockIcon className="w-5 h-5 text-[#455185]" />
                <span className="text-sm font-bold text-white/60">Priority</span>
              </div>
              {isEditing ? (
                <select
                  name="priority"
                  value={editData.priority}
                  onChange={handleEditChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ED1B2F] transition-colors"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <p className="text-white font-medium">{ticket.priority?.toUpperCase() || 'MEDIUM'}</p>
              )}
            </div>
            
            <div className="bg-white/5 p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <UserIcon className="w-5 h-5 text-[#455185]" />
                <span className="text-sm font-bold text-white/60">Created</span>
              </div>
              <p className="text-white font-medium">
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Description</h3>
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                    rows="6"
                    className="w-full bg-black/20 border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:border-[#ED1B2F] transition-colors leading-relaxed"
                    placeholder="Describe your issue in detail"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={editData.category}
                    onChange={handleEditChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ED1B2F] transition-colors"
                    placeholder="e.g., Technical, Billing, etc."
                  />
                </div>

                {/* Attachments Section - Edit Mode */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-white/60">Attachments</h4>
                    <span className="text-xs text-white/40">Max 10MB per file</span>
                  </div>
                  
                  {/* Existing Attachments */}
                  {existingAttachments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-white/60 mb-2">Current attachments:</p>
                      <div className="space-y-2">
                        {existingAttachments.map((attachment) => (
                          <div key={attachment._id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {getFileIcon(attachment.originalName, attachment.mimeType)}
                              <div className="min-w-0 flex-1">
                                <p className="text-white truncate text-sm">{attachment.originalName}</p>
                                <p className="text-xs text-white/40">
                                  {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt || ticket.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeExistingAttachment(attachment._id)}
                              className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                              title="Remove attachment"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Attachments */}
                  <div>
                    <p className="text-sm text-white/60 mb-2">Add new files:</p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="w-full bg-white/5 border border-dashed border-white/20 rounded-xl p-4 text-white/60 text-sm hover:border-[#455185] transition-colors cursor-pointer"
                    />
                    
                    {/* Preview new attachments */}
                    {newAttachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {newAttachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                            <div className="flex items-center gap-3">
                              <DocumentIcon className="w-4 h-4 text-emerald-400" />
                              <div>
                                <p className="text-white text-sm">{file.name}</p>
                                <p className="text-xs text-emerald-400/70">
                                  {formatFileSize(file.size)} • Ready to upload
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeNewAttachment(index)}
                              className="p-1.5 text-red-400 hover:text-red-300"
                              title="Remove file"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-white/10">
                  <button
                    onClick={handleUpdateTicket}
                    disabled={isUpdating}
                    className="flex-1 py-3 bg-gradient-to-r from-[#ED1B2F] to-[#b01423] rounded-xl font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setNewAttachments([]);
                      setAttachmentsToRemove([]);
                      setError('');
                    }}
                    disabled={isUpdating}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-white/90 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </div>
            )}
          </div>

          {/* Category */}
          {!isEditing && ticket.category && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <TagIcon className="w-5 h-5 text-[#455185]" />
                <h3 className="text-lg font-bold text-white">Category</h3>
              </div>
              <div className="inline-block bg-[#455185]/20 text-[#455185] px-4 py-2 rounded-xl font-medium">
                {ticket.category}
              </div>
            </div>
          )}

          {/* Attachments Section - View Mode */}
          {!isEditing && existingAttachments.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Attachments</h3>
                <PaperClipIcon className="w-5 h-5 text-white/60" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {existingAttachments.map((attachment) => (
                  <div key={attachment._id} className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {getFileIcon(attachment.originalName, attachment.mimeType)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white truncate font-medium">{attachment.originalName}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-white/40">
                              {formatFileSize(attachment.size)}
                            </span>
                            <span className="text-xs text-white/40">
                              {new Date(attachment.uploadedAt || ticket.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-3">
                        {(attachment.mimeType?.startsWith('image/') || attachment.mimeType === 'application/pdf') && (
                          <button
                            onClick={() => viewAttachment(attachment._id, attachment.originalName, attachment.mimeType)}
                            className="px-3 py-1.5 bg-[#455185]/20 hover:bg-[#455185]/30 text-[#455185] font-medium text-sm rounded-lg transition-colors whitespace-nowrap"
                            title="View"
                          >
                            View
                          </button>
                        )}
                        <button
                          onClick={() => downloadAttachment(attachment._id, attachment.originalName)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-lg transition-colors whitespace-nowrap"
                          title="Download"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Your Feedback</h3>
              {!feedbackSubmitted && canGiveFeedback && (
                <button
                  onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                  className="px-4 py-2 bg-gradient-to-r from-[#ED1B2F] to-[#b01423] rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity"
                >
                  {showFeedbackForm ? 'Cancel Feedback' : 'Give Feedback'}
                </button>
              )}
            </div>

            {feedbackSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <StarIconSolid className="w-6 h-6 text-emerald-400" />
                  <span className="text-lg font-bold text-emerald-400">
                    {feedback.rating}/5 Stars
                  </span>
                </div>
                {feedback.comment && (
                  <div className="mt-3">
                    <p className="text-sm text-white/60 mb-1">Your comment:</p>
                    <p className="text-white/90 bg-white/5 p-3 rounded-lg">{feedback.comment}</p>
                  </div>
                )}
                <p className="text-sm text-emerald-400/80 mt-3">
                  Thank you for your feedback! Your input helps us improve our service.
                </p>
              </div>
            ) : showFeedbackForm && canGiveFeedback ? (
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <h4 className="text-white font-bold mb-4">How would you rate your support experience?</h4>
                
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className="p-1 hover:scale-110 transition-transform"
                      disabled={feedbackSubmitted}
                    >
                      {star <= feedback.rating ? (
                        <StarIconSolid className="w-8 h-8 text-yellow-400" />
                      ) : (
                        <StarIcon className="w-8 h-8 text-white/40" />
                      )}
                    </button>
                  ))}
                  <span className="ml-3 text-lg font-bold text-white">
                    {feedback.rating}/5
                  </span>
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-white/60 mb-2">
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    value={feedback.comment}
                    onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Tell us more about your experience..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#455185] transition-colors"
                    rows="4"
                    disabled={feedbackSubmitted}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    onClick={submitFeedback}
                    disabled={isSubmittingFeedback || feedback.rating === 0}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingFeedback ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      'Submit Feedback'
                    )}
                  </button>
                  <button
                    onClick={() => setShowFeedbackForm(false)}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-white hover:bg-white/10 transition-colors"
                    disabled={isSubmittingFeedback}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : ticket.status === 'resolved' && !feedbackSubmitted && canGiveFeedback ? (
              <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-amber-400" />
                  <span className="text-lg font-bold text-amber-400">We Value Your Feedback</span>
                </div>
                <p className="text-white/80 mb-4">
                  Your ticket has been resolved! Please take a moment to rate your experience 
                  and help us improve our service quality.
                </p>
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl font-bold text-white hover:opacity-90 transition-opacity"
                >
                  Give Feedback Now
                </button>
              </div>
            ) : ticket.status !== 'resolved' ? (
              <div className="bg-slate-500/10 border border-slate-500/30 p-6 rounded-2xl">
                <p className="text-white/60">
                  Feedback option will be available once your ticket is resolved.
                </p>
              </div>
            ) : null}
          </div>

          {/* Remarks/Updates */}
          {ticket.remarks?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Updates & Remarks</h3>
              <div className="space-y-4">
                {ticket.remarks.map((remark, index) => (
                  <div key={index} className="bg-white/5 p-5 rounded-2xl border-l-4 border-[#455185]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#455185]/30 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-[#455185]" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{remark.addedBy?.name || 'Support Agent'}</p>
                          <p className="text-xs text-white/60">{remark.role || 'Support Team'}</p>
                        </div>
                      </div>
                      <span className="text-xs text-white/40">
                        {new Date(remark.addedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-white/90">{remark.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;