// components/super-admin/modals/AdminFormModal.jsx
import React from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import Button from '../../ui/Button';

const AdminFormModal = () => {
  const { 
    newAdminProfile, setNewAdminProfile, 
    departments, toggleModal 
  } = useSuperAdmin();
  const { API_URL } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      await axios.post(
        `${API_URL}/admin-profiles`, 
        newAdminProfile, 
        config
      );
      
      toggleModal('adminForm', false);
      alert('Admin created successfully!');
      
      // Reset form
      setNewAdminProfile({
        name: '',
        email: '',
        password: '',
        expertise: [],
        department: '',
        categories: [],
        phone: '',
        employeeId: ''
      });
    } catch (err) {
      alert(`Failed to create admin: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <input
          required
          placeholder="Full Name"
          className="w-full bg-black/20 p-2 rounded border border-white/10"
          value={newAdminProfile.name}
          onChange={e =>
            setNewAdminProfile({ ...newAdminProfile, name: e.target.value })
          }
        />

        <input
          required
          type="email"
          placeholder="Email Address"
          className="w-full bg-black/20 p-2 rounded border border-white/10"
          value={newAdminProfile.email}
          onChange={e =>
            setNewAdminProfile({ ...newAdminProfile, email: e.target.value })
          }
        />

        <input
          required
          type="password"
          placeholder="Password"
          className="w-full bg-black/20 p-2 rounded border border-white/10"
          value={newAdminProfile.password}
          onChange={e =>
            setNewAdminProfile({ ...newAdminProfile, password: e.target.value })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Phone Number"
            className="w-full bg-black/20 p-2 rounded border border-white/10"
            value={newAdminProfile.phone}
            onChange={e =>
              setNewAdminProfile({ ...newAdminProfile, phone: e.target.value })
            }
          />

          <input
            placeholder="Employee ID"
            className="w-full bg-black/20 p-2 rounded border border-white/10"
            value={newAdminProfile.employeeId}
            onChange={e =>
              setNewAdminProfile({ ...newAdminProfile, employeeId: e.target.value })
            }
          />
        </div>

        <select
          required
          className="w-full bg-black/20 p-2 rounded border border-white/10"
          value={newAdminProfile.department}
          onChange={e =>
            setNewAdminProfile({ ...newAdminProfile, department: e.target.value })
          }
        >
          <option value="">Assign Department</option>
          {departments.map(d => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        <div className="pt-4">
          <Button type="submit" className="w-full">
            Create Admin Profile
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AdminFormModal;