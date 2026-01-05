// components/super-admin/tabs/UsersTab.jsx
import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import axios from 'axios';
import { getStatusColor } from '../../../constants/theme';

const UsersTab = () => {
  const { users, departments } = useSuperAdmin();
  const { API_URL } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Get unique companies and roles
  const companies = [...new Set(users.map(u => u.company).filter(Boolean))];
  const roles = [...new Set(users.map(u => u.role).filter(Boolean))];

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = filterCompany === 'all' || user.company === filterCompany;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesCompany && matchesRole && matchesStatus;
  });

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      await axios.patch(
        `${API_URL}/users/${userId}/role`, 
        { role: newRole }, 
        config
      );
      
      alert('User role updated successfully!');
    } catch (err) {
      alert(`Failed to update role: ${err.message}`);
    }
  };

  const updateUserDepartment = async (userId, departmentId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      await axios.patch(
        `${API_URL}/users/${userId}/department`, 
        { department: departmentId }, 
        config
      );
      
      alert('User department updated successfully!');
    } catch (err) {
      alert(`Failed to update department: ${err.message}`);
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      await axios.patch(
        `${API_URL}/users/${userId}/status`, 
        { status }, 
        config
      );
      
      alert('User status updated successfully!');
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const resetUserPassword = async (userId) => {
    const newPassword = prompt('Enter new password for this user:');
    if (!newPassword) return;

    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      await axios.post(
        `${API_URL}/users/${userId}/reset-password`, 
        { newPassword }, 
        config
      );
      
      alert('Password reset successfully!');
    } catch (err) {
      alert(`Failed to reset password: ${err.message}`);
    }
  };

  return (
    <Card>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-2xl font-bold text-white">User Management</h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search users..." 
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#ED1B2F] flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white"
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
        >
          <option value="all">All Companies</option>
          {companies.map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
        
        <select
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        
        <select
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-sm uppercase">
              <th className="p-4">User</th>
              <th className="p-4">Company</th>
              <th className="p-4">Role</th>
              <th className="p-4">Department</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {filteredUsers.map(user => (
              <tr key={user._id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4">
                  <div className="font-bold">{user.name}</div>
                  <div className="text-xs text-white/60">{user.email}</div>
                  {user.employeeCode && (
                    <div className="text-xs text-white/40">ID: {user.employeeCode}</div>
                  )}
                </td>

                <td className="p-4 text-sm">
                  {user.company || (
                    <span className="text-white/40 italic">Not set</span>
                  )}
                </td>

                <td className="p-4">
                  <select
                    className="bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm"
                    value={user.role || ''}
                    onChange={(e) => updateUserRole(user._id, e.target.value)}
                  >
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="super-admin">Super Admin</option>
                  </select>
                </td>

                <td className="p-4">
                  <select
                    className="bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm"
                    value={user.department || ''}
                    onChange={(e) => updateUserDepartment(user._id, e.target.value)}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Badge color={getStatusColor(user.status || 'active')}>
                      {user.status || 'active'}
                    </Badge>
                    <select
                      className="bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-xs"
                      value={user.status || 'active'}
                      onChange={(e) => updateUserStatus(user._id, e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      className="px-3 py-1 text-xs"
                      onClick={() => resetUserPassword(user._id)}
                    >
                      Reset Password
                    </Button>
                    <div className="text-xs text-white/40">
                      Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center text-white/40 py-10">
            No users found matching your criteria
          </div>
        )}
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="text-center bg-white/5 p-4 rounded-lg">
          <div className="text-2xl font-bold text-white">
            {users.length}
          </div>
          <div className="text-sm text-white/60">Total Users</div>
        </div>
        
        <div className="text-center bg-white/5 p-4 rounded-lg">
          <div className="text-2xl font-bold text-emerald-400">
            {users.filter(u => u.status === 'active').length}
          </div>
          <div className="text-sm text-white/60">Active</div>
        </div>
        
        <div className="text-center bg-white/5 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">
            {users.filter(u => u.role === 'admin' || u.role === 'super-admin').length}
          </div>
          <div className="text-sm text-white/60">Admins</div>
        </div>
        
        <div className="text-center bg-white/5 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-400">
            {companies.length}
          </div>
          <div className="text-sm text-white/60">Companies</div>
        </div>
        
        <div className="text-center bg-white/5 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">
            {users.filter(u => u.department).length}
          </div>
          <div className="text-sm text-white/60">With Department</div>
        </div>
      </div>
    </Card>
  );
};

export default UsersTab;