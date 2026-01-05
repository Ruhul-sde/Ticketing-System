// components/super-admin/tabs/AdminsTab.jsx
import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import axios from 'axios';

const AdminsTab = () => {
  const { 
    adminProfiles, 
    departments, 
    toggleModal, 
    setSelections, 
    setNewAdminProfile 
  } = useSuperAdmin();
  const { API_URL } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter admins
  const filteredAdmins = adminProfiles.filter(admin => {
    const matchesSearch = searchTerm === '' || 
      admin.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = filterDept === 'all' || 
      admin.department?._id === filterDept ||
      admin.department === filterDept;
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && admin.isActive) ||
      (filterStatus === 'inactive' && !admin.isActive);
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  const openCreateModal = () => {
    setSelections(prev => ({ ...prev, admin: null }));
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
    toggleModal('adminForm', true);
  };

  const deleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        const config = { 
          headers: { 'Authorization': `Bearer ${token}` } 
        };

        await axios.delete(
          `${API_URL}/admin-profiles/${adminId}`, 
          config
        );
        
        alert('Admin deleted successfully!');
      } catch (err) {
        alert(`Failed to delete admin: ${err.message}`);
      }
    }
  };

  const toggleAdminStatus = async (adminId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      await axios.patch(
        `${API_URL}/admin-profiles/${adminId}/status`, 
        { isActive: !currentStatus }, 
        config
      );
      
      alert('Admin status updated successfully!');
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  return (
    <Card>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-2xl font-bold text-white">Admin Management</h3>
        <Button onClick={openCreateModal}>
          + Add Admin
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search admins..."
          className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#ED1B2F]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
        
        <select
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-sm uppercase">
              <th className="p-4">Admin</th>
              <th className="p-4">Contact Info</th>
              <th className="p-4">Department</th>
              <th className="p-4">Employee ID</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {filteredAdmins.map(admin => (
              <tr key={admin._id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4">
                  <div className="font-bold">{admin.user?.name || 'N/A'}</div>
                  <div className="text-xs text-white/60">
                    {admin.expertise?.length > 0 
                      ? `Expertise: ${admin.expertise.slice(0, 2).join(', ')}`
                      : 'No expertise defined'
                    }
                  </div>
                </td>

                <td className="p-4">
                  <div className="text-sm">{admin.user?.email || 'N/A'}</div>
                  {admin.phone && (
                    <div className="text-xs text-white/60">{admin.phone}</div>
                  )}
                </td>

                <td className="p-4 text-sm">
                  {admin.department?.name || (
                    <span className="text-white/40 italic">Not assigned</span>
                  )}
                </td>

                <td className="p-4 text-sm">
                  {admin.employeeId || (
                    <span className="text-white/40 italic">Not set</span>
                  )}
                </td>

                <td className="p-4">
                  <Badge color={admin.isActive ? 'green' : 'red'}>
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      variant={admin.isActive ? 'danger' : 'secondary'}
                      className="px-3 py-1 text-xs"
                      onClick={() => toggleAdminStatus(admin._id, admin.isActive)}
                    >
                      {admin.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    
                    <Button
                      variant="danger"
                      className="px-3 py-1 text-xs"
                      onClick={() => deleteAdmin(admin._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAdmins.length === 0 && (
          <div className="text-center text-white/40 py-10">
            No admins found matching your criteria
          </div>
        )}
      </div>

      {/* Admin Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="text-center bg-white/5 p-4 rounded-lg">
          <div className="text-2xl font-bold text-white">
            {adminProfiles.length}
          </div>
          <div className="text-sm text-white/60">Total Admins</div>
        </div>
        
        <div className="text-center bg-white/5 p-4 rounded-lg">
          <div className="text-2xl font-bold text-emerald-400">
            {adminProfiles.filter(a => a.isActive).length}
          </div>
          <div className="text-sm text-white/60">Active</div>
        </div>
        
        <div className="text-center bg-white/5 p-4 rounded-lg">
          <div className="text-2xl font-bold text-[#ED1B2F]">
            {adminProfiles.filter(a => !a.isActive).length}
          </div>
          <div className="text-sm text-white/60">Inactive</div>
        </div>
        
        <div className="text-center bg-white/5 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-400">
            {[...new Set(adminProfiles.map(a => a.department?._id).filter(Boolean))].length}
          </div>
          <div className="text-sm text-white/60">Departments Covered</div>
        </div>
      </div>
    </Card>
  );
};

export default AdminsTab;