// components/super-admin/tabs/CompaniesTab.jsx
import React from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import axios from 'axios';
import { formatTime, getStatusColor } from '../../../constants/theme';

const CompaniesTab = () => {
  const { 
    companies, 
    setCompanies 
  } = useSuperAdmin();
  const { API_URL } = useAuth();

  const refreshAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      const response = await axios.post(
        `${API_URL}/companies/refresh`, 
        {}, 
        config
      );
      
      setCompanies(response.data);
      alert('Analytics refreshed successfully!');
    } catch (err) {
      alert(`Failed to refresh analytics: ${err.message}`);
    }
  };

  const updateCompanyStatus = async (companyId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      await axios.patch(
        `${API_URL}/companies/${companyId}`, 
        { status }, 
        config
      );
      
      setCompanies(prev => prev.map(company => 
        company._id === companyId 
          ? { ...company, status } 
          : company
      ));
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const toggleSuspension = (company) => {
    const nextStatus = company.status === 'suspended' ? 'active' : 'suspended';
    updateCompanyStatus(company._id, nextStatus);
  };

  const toggleFreeze = (company) => {
    const nextStatus = company.status === 'frozen' ? 'active' : 'frozen';
    updateCompanyStatus(company._id, nextStatus);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-2xl font-bold text-white">Company Directory</h3>
        <Button 
          variant="ghost" 
          onClick={refreshAnalytics}
          className="flex items-center gap-2"
        >
          <span>🔄</span>
          Refresh Analytics
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-sm uppercase tracking-wider">
              <th className="p-4">Company</th>
              <th className="p-4">Domain</th>
              <th className="p-4">Users</th>
              <th className="p-4">Tickets</th>
              <th className="p-4">Support Time</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {companies.map(company => (
              <tr key={company._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="font-bold">{company.name}</div>
                  {company.description && (
                    <div className="text-xs text-white/60 mt-1 truncate max-w-xs">
                      {company.description}
                    </div>
                  )}
                </td>
                <td className="p-4 text-sm text-white/60">
                  {company.domain || 'N/A'}
                </td>
                <td className="p-4 text-sm">
                  <span className="font-bold">{company.employeeCount || 0}</span>
                </td>
                <td className="p-4 text-sm">
                  <div className="flex flex-col">
                    <span className="font-bold">{company.totalTickets || 0}</span>
                    {company.activeTickets > 0 && (
                      <span className="text-xs text-[#ED1B2F]">
                        {company.activeTickets} active
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-sm">
                  {formatTime(company.totalSupportTime)}
                </td>
                <td className="p-4">
                  <Badge color={getStatusColor(company.status || 'active')}>
                    {company.status || 'active'}
                  </Badge>
                </td>
                <td className="p-4 flex gap-2">
                  <Button 
                    variant="ghost" 
                    className="px-3 py-1 text-xs" 
                    onClick={() => toggleSuspension(company)}
                  >
                    {company.status === 'suspended' ? 'Activate' : 'Suspend'}
                  </Button>
                  <Button 
                    variant="danger" 
                    className="px-3 py-1 text-xs" 
                    onClick={() => toggleFreeze(company)}
                  >
                    {company.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {companies.length === 0 && (
          <div className="text-center text-white/40 py-10">
            No companies found
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {companies.length}
          </div>
          <div className="text-sm text-white/60">Total Companies</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {companies.filter(c => c.status === 'active').length}
          </div>
          <div className="text-sm text-white/60">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#ED1B2F]">
            {companies.filter(c => c.status === 'suspended' || c.status === 'frozen').length}
          </div>
          <div className="text-sm text-white/60">Suspended/Frozen</div>
        </div>
      </div>
    </Card>
  );
};

export default CompaniesTab;