// tickets/CreateTicketModal.jsx (updated imports and usage)
import React, { useState, useEffect } from 'react';
import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';
import { useAuth } from '../../../../context/AuthContext';
import axios from 'axios';
import { FaSpinner, FaUpload, FaTrash } from 'react-icons/fa';
import FileIcon from './FileIcon';
import { getFileIconType, formatFileSize } from './utils/fileHelpers';
import { validateTicketForm } from './utils/ticketHelpers';

// In the attachment preview section, replace:
{getFileIcon(attachment.name, attachment.type)}

// With:
<FileIcon type={getFileIconType(attachment.name, attachment.type)} />
const CreateTicketModal = ({ isOpen, onClose, companies, departments, onTicketCreated }) => {
  const { API_URL } = useAuth();
  const [newTicketData, setNewTicketData] = useState({
    companyId: '',
    userId: '',
    departmentId: '',
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    reason: ''
  });
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [departmentCategories, setDepartmentCategories] = useState([]);

  // Fetch users when company changes
  useEffect(() => {
    if (newTicketData.companyId) {
      fetchCompanyUsers(newTicketData.companyId);
    } else {
      setCompanyUsers([]);
    }
  }, [newTicketData.companyId]);

  // Fetch categories when department changes
  useEffect(() => {
    if (newTicketData.departmentId) {
      fetchDepartmentCategories(newTicketData.departmentId);
    } else {
      setDepartmentCategories([]);
      setNewTicketData(prev => ({ ...prev, category: '' }));
    }
  }, [newTicketData.departmentId]);

  const fetchCompanyUsers = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      const usersResponse = await axios.get(`${API_URL}/users?companyId=${companyId}`, config);
      const usersData = usersResponse.data.users || usersResponse.data || [];
      const regularUsers = Array.isArray(usersData) ? usersData.filter(user => user.role === 'user') : [];
      setCompanyUsers(regularUsers);

      if (regularUsers.length > 0 && !newTicketData.userId) {
        setNewTicketData(prev => ({
          ...prev,
          userId: regularUsers[0]._id
        }));
      }
    } catch (error) {
      console.error('Error fetching company users:', error);
      setCompanyUsers([]);
    }
  };

  const fetchDepartmentCategories = async (departmentId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      const selectedDept = departments.find(dept => dept._id === departmentId);
      
      if (selectedDept?.categories && Array.isArray(selectedDept.categories)) {
        const categories = selectedDept.categories;
        setDepartmentCategories(categories);
        
        if (categories.length > 0) {
          setNewTicketData(prev => ({
            ...prev,
            category: categories[0]
          }));
        } else {
          setNewTicketData(prev => ({ ...prev, category: '' }));
        }
        return;
      }

      const departmentResponse = await axios.get(`${API_URL}/departments/${departmentId}`, config);
      let categories = departmentResponse.data.categories || 
                      departmentResponse.data.data?.categories || 
                      departmentResponse.data.department?.categories || [];
      
      const finalCategories = Array.isArray(categories) ? categories : [];
      setDepartmentCategories(finalCategories);
      
      if (finalCategories.length > 0) {
        setNewTicketData(prev => ({
          ...prev,
          category: finalCategories[0]
        }));
      } else {
        setNewTicketData(prev => ({ ...prev, category: '' }));
      }
    } catch (error) {
      console.error('Error fetching department categories:', error);
      setDepartmentCategories([]);
      setNewTicketData(prev => ({ ...prev, category: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTicketData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 
                       'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                       'text/plain', 'text/csv', 'application/vnd.ms-excel', 
                       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                       'application/zip', 'application/x-zip-compressed'];
    const maxSize = 10 * 1024 * 1024;

    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        alert(`File ${file.name} has invalid type. Only images, documents, and archives are allowed.`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    const newAttachments = validFiles.map(file => ({
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      id: Date.now() + Math.random().toString(36).substr(2, 9)
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  const removeAttachment = (id) => {
    const attachment = attachments.find(a => a.id === id);
    if (attachment?.preview) {
      URL.revokeObjectURL(attachment.preview);
    }
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = async () => {
    const validationError = validateTicketForm(newTicketData, departmentCategories);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('title', newTicketData.title);
      formData.append('description', newTicketData.description);
      formData.append('priority', newTicketData.priority || 'medium');
      if (newTicketData.category) {
        formData.append('category', newTicketData.category);
      }
      formData.append('reason', newTicketData.reason || '');
      formData.append('department', newTicketData.departmentId);
      formData.append('createdBy', newTicketData.userId);

      attachments.forEach((attachment) => {
        formData.append('attachments', attachment.file);
      });

      const config = { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        } 
      };

      await axios.post(`${API_URL}/tickets`, formData, config);
      
      // Reset form
      setNewTicketData({
        companyId: '',
        userId: '',
        departmentId: '',
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        reason: ''
      });
      setAttachments([]);
      setCompanyUsers([]);
      setDepartmentCategories([]);
      
      onTicketCreated();
      onClose();
      alert('Ticket created successfully!');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert(`Failed to create ticket: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Ticket" size="xl">
      <div className="space-y-4">
        {/* Company and User Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Company *
            </label>
            <select
              name="companyId"
              value={newTicketData.companyId}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
              required
            >
              <option value="" className="bg-gray-900 text-white">Select Company</option>
              {companies.map(company => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              User *
            </label>
            <select
              name="userId"
              value={newTicketData.userId}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
              required
              disabled={!newTicketData.companyId || companyUsers.length === 0}
            >
              <option value="" className="bg-gray-900 text-white">
                {!newTicketData.companyId 
                  ? 'Select company first' 
                  : companyUsers.length === 0 
                  ? 'No users found in this company'
                  : 'Select User'}
              </option>
              {companyUsers.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Department and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Department *
            </label>
            <select
              name="departmentId"
              value={newTicketData.departmentId}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
              required
            >
              <option value="" className="bg-gray-900 text-white">Select Department</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Category {departmentCategories.length > 0 && '*'}
            </label>
            <select
              name="category"
              value={newTicketData.category}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
              required={departmentCategories.length > 0}
              disabled={!newTicketData.departmentId}
            >
              <option value="" className="bg-gray-900 text-white">
                {!newTicketData.departmentId 
                  ? 'Select department first' 
                  : departmentCategories.length === 0
                  ? 'No categories available'
                  : 'Select Category'}
              </option>
              {departmentCategories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority and Reason */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={newTicketData.priority}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Reason (Optional)
            </label>
            <input
              type="text"
              name="reason"
              value={newTicketData.reason}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
              placeholder="Brief reason for the ticket"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={newTicketData.title}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
            placeholder="Brief description of the issue"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={newTicketData.description}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ED1B2F] min-h-[120px]"
            placeholder="Detailed description of the issue, steps to reproduce, etc."
            required
          />
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Attachments (Optional)
          </label>
          <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center hover:border-[#ED1B2F]/50 transition-colors">
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.zip,.rar"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-2">
                <FaUpload className="text-3xl text-white/50" />
                <p className="text-white/70">Click to upload files or drag and drop</p>
                <p className="text-xs text-white/40">Images, documents, and archives up to 10MB</p>
              </div>
            </label>
          </div>

          {/* Attachment Preview */}
          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-white/70">Selected files ({attachments.length}):</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getFileIcon(attachment.name, attachment.type)}
                      <div>
                        <p className="text-white text-sm truncate max-w-xs">{attachment.name}</p>
                        <p className="text-xs text-white/40">{formatFileSize(attachment.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <div className="text-xs text-white/40">
          * Required fields
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={uploading || !newTicketData.companyId || !newTicketData.userId || 
                     !newTicketData.departmentId || !newTicketData.title || 
                     !newTicketData.description || 
                     (departmentCategories.length > 0 && !newTicketData.category)}
          >
            {uploading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Creating...
              </>
            ) : 'Create Ticket'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateTicketModal;