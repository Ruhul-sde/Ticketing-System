// components/super-admin/modals/CreateTicketModal.jsx
import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import Button from '../../ui/Button';

const CreateTicketModal = () => {
  const { departments, toggleModal } = useSuperAdmin();
  const { API_URL } = useAuth();
  
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    department: '',
    category: '',
    userDetails: {
      name: '',
      email: '',
      employeeCode: '',
      companyName: ''
    }
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      await axios.post(
        `${API_URL}/tickets/on-behalf`, 
        newTicket, 
        config
      );
      
      toggleModal('createToken', false);
      alert('Ticket created successfully!');
      
      // Reset form
      setNewTicket({
        title: '',
        description: '',
        priority: 'medium',
        department: '',
        category: '',
        userDetails: {
          name: '',
          email: '',
          employeeCode: '',
          companyName: ''
        }
      });
    } catch (err) {
      alert(`Failed to create ticket: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedDepartment = departments.find(d => d._id === newTicket.department);
  const availableCategories = selectedDepartment?.categories || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <input
          required
          placeholder="Ticket Title"
          className="w-full bg-black/20 p-2 rounded border border-white/10 focus:border-[#ED1B2F] outline-none"
          value={newTicket.title}
          onChange={e => setNewTicket({...newTicket, title: e.target.value})}
        />
        
        <textarea
          required
          placeholder="Detailed Description"
          className="w-full bg-black/20 p-2 rounded border border-white/10 focus:border-[#ED1B2F] outline-none"
          rows="4"
          value={newTicket.description}
          onChange={e => setNewTicket({...newTicket, description: e.target.value})}
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            required
            className="bg-black/20 p-2 rounded border border-white/10 focus:border-[#ED1B2F] outline-none"
            value={newTicket.priority}
            onChange={e => setNewTicket({...newTicket, priority: e.target.value})}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>

          <select
            required
            className="bg-black/20 p-2 rounded border border-white/10 focus:border-[#ED1B2F] outline-none"
            value={newTicket.department}
            onChange={e => setNewTicket({...newTicket, department: e.target.value})}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {availableCategories.length > 0 && (
          <select
            className="w-full bg-black/20 p-2 rounded border border-white/10 focus:border-[#ED1B2F] outline-none"
            value={newTicket.category}
            onChange={e => setNewTicket({...newTicket, category: e.target.value})}
          >
            <option value="">Select Category (Optional)</option>
            {availableCategories.map(cat => (
              <option key={cat._id || cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        )}

        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h4 className="font-bold mb-3">User Information</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="User Name"
              className="bg-black/20 p-2 rounded border border-white/10 focus:border-[#ED1B2F] outline-none"
              value={newTicket.userDetails.name}
              onChange={e => setNewTicket({
                ...newTicket,
                userDetails: {...newTicket.userDetails, name: e.target.value}
              })}
            />
            
            <input
              required
              type="email"
              placeholder="User Email"
              className="bg-black/20 p-2 rounded border border-white/10 focus:border-[#ED1B2F] outline-none"
              value={newTicket.userDetails.email}
              onChange={e => setNewTicket({
                ...newTicket,
                userDetails: {...newTicket.userDetails, email: e.target.value}
              })}
            />
            
            <input
              placeholder="Employee Code"
              className="bg-black/20 p-2 rounded border border-white/10 focus:border-[#ED1B2F] outline-none"
              value={newTicket.userDetails.employeeCode}
              onChange={e => setNewTicket({
                ...newTicket,
                userDetails: {...newTicket.userDetails, employeeCode: e.target.value}
              })}
            />
            
            <input
              placeholder="Company Name"
              className="bg-black/20 p-2 rounded border border-white/10 focus:border-[#ED1B2F] outline-none"
              value={newTicket.userDetails.companyName}
              onChange={e => setNewTicket({
                ...newTicket,
                userDetails: {...newTicket.userDetails, companyName: e.target.value}
              })}
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creating Ticket...' : 'Create Ticket'}
        </Button>
      </div>
    </form>
  );
};

export default CreateTicketModal;