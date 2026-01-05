// context/UserDashboardContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export const UserDashboardContext = createContext();

export const useUserDashboard = () => {
  const context = useContext(UserDashboardContext);
  if (!context) {
    throw new Error('useUserDashboard must be used within UserDashboardProvider');
  }
  return context;
};

export const UserDashboardProvider = ({ children }) => {
  const { user } = useAuth();
  
  // State
  const [supportTickets, setSupportTickets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ticket draft
  const [ticketDraft, setTicketDraft] = useState({
    title: '',
    description: '',
    priority: 'medium',
    department: '',
    category: '',
    attachments: []
  });

  // Fetch data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [ticketRes, deptRes] = await Promise.all([
        axios.get('/tickets'),
        axios.get('/departments')
      ]);
      
      console.log('Fetched tickets:', ticketRes.data.length);
      console.log('Fetched departments:', deptRes.data.length);
      
      // Filter tickets for current user
      if (user?._id) {
        const userTickets = ticketRes.data.filter(t => 
          t.createdBy?._id === user._id || t.createdBy === user._id
        );
        console.log('User tickets:', userTickets.length);
        setSupportTickets(userTickets);
      }
      
      setDepartments(deptRes.data);
      setError(null);
    } catch (err) {
      console.error("Dashboard sync error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // File handling
  const handleFileUpload = (files) => {
    const uploadedFiles = Array.from(files);
    console.log('Files to upload:', uploadedFiles.length);
    
    const newAttachments = uploadedFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file // Keep reference for FormData
    }));
    
    setTicketDraft(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const removeAttachment = (index) => {
    setTicketDraft(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Ticket submission - SIMPLIFIED VERSION
  const submitTicket = async () => {
    setIsSubmitting(true);
    console.log('Starting ticket submission...');
    
    try {
      // Validate required fields
      if (!ticketDraft.title.trim()) {
        throw new Error('Title is required');
      }
      if (!ticketDraft.description.trim()) {
        throw new Error('Description is required');
      }
      if (!ticketDraft.department) {
        throw new Error('Department is required');
      }

      console.log('Creating FormData with:', {
        title: ticketDraft.title,
        description: ticketDraft.description,
        department: ticketDraft.department,
        category: ticketDraft.category,
        attachments: ticketDraft.attachments.length
      });

      const formData = new FormData();
      formData.append('title', ticketDraft.title.trim());
      formData.append('description', ticketDraft.description.trim());
      formData.append('priority', ticketDraft.priority);
      formData.append('department', ticketDraft.department);
      
      if (ticketDraft.category) {
        formData.append('category', ticketDraft.category);
      }
      
      // Append attachments
      ticketDraft.attachments.forEach((attachment) => {
        formData.append('attachments', attachment.file);
      });

      // Log FormData contents for debugging
      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]));
      }

      const response = await axios.post('/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 second timeout
      });
      
      console.log('Ticket created successfully:', response.data);
      
      // Reset form
      setTicketDraft({
        title: '',
        description: '',
        priority: 'medium',
        department: '',
        category: '',
        attachments: []
      });
      setIsCreatingTicket(false);
      
      // Add new ticket to state
      setSupportTickets(prev => [response.data, ...prev]);
      
      return { success: true, message: 'Ticket created successfully!' };
      
    } catch (err) {
      console.error("Ticket submission error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to create ticket';
      
      return { 
        success: false, 
        message: errorMessage 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Alternative: Submit ticket using JSON (for testing)
  const submitTicketJson = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: ticketDraft.title.trim(),
        description: ticketDraft.description.trim(),
        priority: ticketDraft.priority,
        department: ticketDraft.department,
        category: ticketDraft.category || undefined
      };

      console.log('Submitting JSON:', payload);

      const response = await axios.post('/tickets/json', payload);
      
      // Reset form
      setTicketDraft({
        title: '',
        description: '',
        priority: 'medium',
        department: '',
        category: '',
        attachments: []
      });
      setIsCreatingTicket(false);
      
      // Add new ticket to state
      setSupportTickets(prev => [response.data, ...prev]);
      
      return { success: true, message: 'Ticket created successfully!' };
    } catch (err) {
      console.error("JSON submission error:", err.response?.data);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to create ticket' 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open/close modal
  const openTicketModal = (ticket) => {
    setActiveTicket(ticket);
    setIsModalOpen(true);
  };

  const closeTicketModal = () => {
    setActiveTicket(null);
    setIsModalOpen(false);
  };

  // Test connection
  const testConnection = async () => {
    try {
      const response = await axios.post('/tickets/test', {
        test: 'data',
        title: 'Test Title',
        description: 'Test Description'
      });
      console.log('Test successful:', response.data);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Test failed:', err);
      return { success: false, error: err.message };
    }
  };

  // Context value
  const value = {
    // State
    supportTickets,
    departments,
    activeTicket,
    isModalOpen,
    isCreatingTicket,
    isSubmitting,
    loading,
    error,
    ticketDraft,
    
    // Setters
    setTicketDraft,
    setIsCreatingTicket,
    
    // Functions
    fetchDashboardData,
    handleFileUpload,
    removeAttachment,
    submitTicket,
    submitTicketJson,
    openTicketModal,
    closeTicketModal,
    testConnection
  };

  return (
    <UserDashboardContext.Provider value={value}>
      {children}
    </UserDashboardContext.Provider>
  );
};