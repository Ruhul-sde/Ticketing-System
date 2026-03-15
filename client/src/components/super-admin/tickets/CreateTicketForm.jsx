import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Textarea from '../../ui/Textarea';
import Dropdown from '../../ui/Dropdown';
import FileUpload from '../../ui/FileUpload';
import { FaSpinner } from 'react-icons/fa';

const CreateTicketForm = ({
  isOpen,
  onClose,
  onSubmit,
  companies,
  departments,
  companyUsers,
  departmentCategories,
  loading,
  onCompanyChange,  // Add these callback props
  onDepartmentChange // Add these callback props
}) => {
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
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
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Trigger company change callback
    if (name === 'companyId') {
      setFormData(prev => ({ ...prev, userId: '' })); // Reset user when company changes
      if (onCompanyChange) {
        onCompanyChange(value);
      }
    }
    
    // Trigger department change callback
    if (name === 'departmentId') {
      setFormData(prev => ({ ...prev, category: '' })); // Reset category when department changes
      if (onDepartmentChange) {
        onDepartmentChange(value);
      }
    }
  };

  const handleFileSelect = (files) => {
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 
                         'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'text/plain', 'text/csv', 'application/vnd.ms-excel', 
                         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                         'application/zip', 'application/x-zip-compressed'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type) && file.type) {
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
      preview: file.type?.startsWith('image/') ? URL.createObjectURL(file) : null,
      id: Date.now() + Math.random().toString(36).substr(2, 9)
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = (id) => {
    const attachment = attachments.find(a => a.id === id);
    if (attachment && attachment.preview) {
      URL.revokeObjectURL(attachment.preview);
    }
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = () => {
    onSubmit({ ...formData, attachments });
  };

  const isFormValid = () => {
    return formData.companyId && 
           formData.userId && 
           formData.departmentId && 
           formData.title && 
           formData.description && 
           (departmentCategories.length === 0 || formData.category);
  };

  // Debug logging
  console.log('CreateTicketForm props:', {
    companies: companies?.length,
    departments: departments?.length,
    companyUsers: companyUsers?.length,
    departmentCategories: departmentCategories?.length,
    selectedCompany: formData.companyId,
    selectedDept: formData.departmentId
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Ticket" size="xl">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dropdown
            label="Company"
            options={companies?.map(c => ({ value: c._id, label: c.name })) || []}
            value={formData.companyId}
            onChange={handleChange}
            name="companyId"
            placeholder="Select Company"
            required
          />
          
          <Dropdown
            label="User"
            options={companyUsers?.map(u => ({ value: u._id, label: `${u.name} (${u.email})` })) || []}
            value={formData.userId}
            onChange={handleChange}
            name="userId"
            placeholder={!formData.companyId ? 'Select company first' : 
                        companyUsers?.length === 0 ? 'No users found in this company' : 'Select User'}
            disabled={!formData.companyId || companyUsers?.length === 0}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dropdown
            label="Department"
            options={departments?.map(d => ({ value: d._id, label: d.name })) || []}
            value={formData.departmentId}
            onChange={handleChange}
            name="departmentId"
            placeholder="Select Department"
            required
          />
          
          <Dropdown
            label="Category"
            options={departmentCategories?.map(c => ({ value: c, label: c })) || []}
            value={formData.category}
            onChange={handleChange}
            name="category"
            placeholder={!formData.departmentId ? 'Select department first' : 
                        departmentCategories?.length === 0 ? 'No categories available' : 'Select Category'}
            disabled={!formData.departmentId || departmentCategories?.length === 0}
            required={departmentCategories?.length > 0}
          />
          {formData.departmentId && departmentCategories?.length === 0 && (
            <p className="text-xs text-yellow-400/70 mt-1">
              This department has no categories configured
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dropdown
            label="Priority"
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' }
            ]}
            value={formData.priority}
            onChange={handleChange}
            name="priority"
          />
          
          <Input
            label="Reason (Optional)"
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Brief reason for the ticket"
          />
        </div>

        <Input
          label="Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Brief description of the issue"
          required
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed description of the issue, steps to reproduce, etc."
          rows={4}
          required
        />

        <FileUpload
          attachments={attachments}
          onFileSelect={handleFileSelect}
          onRemove={handleRemoveAttachment}
        />
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
            disabled={loading || !isFormValid()}
          >
            {loading ? (
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

export default CreateTicketForm;