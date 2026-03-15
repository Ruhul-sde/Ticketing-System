import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import LoadingSpinner from '../../ui/LoadingSpinner';
import Pagination from '../../ui/Pagination';
import TicketStats from '../tickets/TicketStats';
import TicketFilters from '../tickets/TicketFilters';
import TicketTable from '../tickets/TicketTable';
import CreateTicketForm from '../tickets/CreateTicketForm';
import TicketDetailModal from '../tickets/TicketDetailModal';
import {
  FaTicketAlt,
  FaPlus,
  FaFilter
} from 'react-icons/fa';
import axios from 'axios';

const TicketsTab = () => {
  const { API_URL } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    company: 'all',
    department: 'all',
    status: 'all',
    priority: 'all'
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTicketDetailModal, setShowTicketDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Form state
  const [companyUsers, setCompanyUsers] = useState([]);
  const [departmentCategories, setDepartmentCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [downloadingAttachments, setDownloadingAttachments] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  // Fetch tickets, companies, and departments
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      // Fetch tickets
      const ticketsResponse = await axios.get(`${API_URL}/tickets`, config);
      const ticketsData = ticketsResponse.data || [];
      setTickets(ticketsData);

      // Fetch companies
      const companiesResponse = await axios.get(`${API_URL}/companies?limit=100`, config);
      console.log('Companies API response:', companiesResponse.data);
      
      // Extract companies array from the response
      let companiesData = [];
      if (companiesResponse.data && companiesResponse.data.success && companiesResponse.data.companies) {
        companiesData = companiesResponse.data.companies;
      } else if (Array.isArray(companiesResponse.data)) {
        companiesData = companiesResponse.data;
      } else if (companiesResponse.data && companiesResponse.data.data) {
        companiesData = companiesResponse.data.data;
      }
      
      console.log('Extracted companies:', companiesData);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);

      // Fetch departments
      const departmentsResponse = await axios.get(`${API_URL}/departments`, config);
      let departmentsData = [];
      
      if (departmentsResponse.data && departmentsResponse.data.departments) {
        departmentsData = departmentsResponse.data.departments;
      } else if (Array.isArray(departmentsResponse.data)) {
        departmentsData = departmentsResponse.data;
      } else if (departmentsResponse.data && departmentsResponse.data.data) {
        departmentsData = departmentsResponse.data.data;
      }
      
      console.log('Fetched departments:', departmentsData);
      setDepartments(departmentsData);

      // Calculate stats
      const totalTickets = ticketsData.length;
      const openTickets = ticketsData.filter(t => t.status === 'open' || t.status === 'pending').length;
      const inProgressTickets = ticketsData.filter(t => t.status === 'in-progress' || t.status === 'assigned').length;
      const resolvedTickets = ticketsData.filter(t => t.status === 'resolved' || t.status === 'closed').length;

      setStats({
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users by company
  const fetchCompanyUsers = async (companyId) => {
    console.log('Fetching users for company:', companyId);
    if (!companyId) {
      setCompanyUsers([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      const usersResponse = await axios.get(`${API_URL}/users?companyId=${companyId}`, config);
      console.log('Users API response:', usersResponse.data);
      
      // Extract users from response
      let usersData = [];
      if (usersResponse.data && usersResponse.data.users) {
        usersData = usersResponse.data.users;
      } else if (Array.isArray(usersResponse.data)) {
        usersData = usersResponse.data;
      } else if (usersResponse.data && usersResponse.data.data) {
        usersData = usersResponse.data.data;
      }
      
      // Filter only regular users (not superadmins)
      const regularUsers = Array.isArray(usersData) ? usersData.filter(user => user.role === 'user') : [];
      console.log('Filtered users:', regularUsers);
      setCompanyUsers(regularUsers);

    } catch (error) {
      console.error('Error fetching company users:', error);
      setCompanyUsers([]);
    }
  };

  // Fetch department categories
  const fetchDepartmentCategories = async (departmentId) => {
    console.log('Fetching categories for department:', departmentId);
    if (!departmentId) {
      setDepartmentCategories([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      // First try to get from already loaded departments
      const selectedDept = departments.find(dept => dept._id === departmentId);
      
      if (selectedDept && selectedDept.categories && Array.isArray(selectedDept.categories)) {
        console.log('Categories from loaded departments:', selectedDept.categories);
        setDepartmentCategories(selectedDept.categories);
        return;
      }

      // If not found, fetch from API
      const departmentResponse = await axios.get(`${API_URL}/departments/${departmentId}`, config);
      console.log('Department detail response:', departmentResponse.data);
      
      let categories = [];
      if (departmentResponse.data && departmentResponse.data.categories) {
        categories = departmentResponse.data.categories;
      } else if (departmentResponse.data && departmentResponse.data.data && departmentResponse.data.data.categories) {
        categories = departmentResponse.data.data.categories;
      } else if (departmentResponse.data && departmentResponse.data.department && departmentResponse.data.department.categories) {
        categories = departmentResponse.data.department.categories;
      }
      
      const finalCategories = Array.isArray(categories) ? categories : [];
      console.log('Final categories from API:', finalCategories);
      setDepartmentCategories(finalCategories);

    } catch (error) {
      console.error('Error fetching department categories:', error);
      setDepartmentCategories([]);
    }
  };

  // Create new ticket
  const handleCreateTicket = async (ticketData) => {
    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('title', ticketData.title);
      formData.append('description', ticketData.description);
      formData.append('priority', ticketData.priority || 'medium');
      if (ticketData.category) {
        formData.append('category', ticketData.category);
      }
      formData.append('reason', ticketData.reason || '');
      formData.append('department', ticketData.departmentId);
      formData.append('createdBy', ticketData.userId);

      ticketData.attachments.forEach((attachment) => {
        formData.append('attachments', attachment.file);
      });

      const config = { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        } 
      };

      const response = await axios.post(`${API_URL}/tickets`, formData, config);
      
      if (response.data) {
        setShowCreateModal(false);
        await fetchData();
        alert('Ticket created successfully!');
      }

    } catch (error) {
      console.error('Error creating ticket:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Failed to create ticket: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  // View ticket details
  const viewTicketDetails = async (ticket) => {
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      const response = await axios.get(`${API_URL}/tickets/${ticket._id}`, config);
      setSelectedTicket(response.data);
      setShowTicketDetailModal(true);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      alert('Failed to load ticket details');
    }
  };

  // Download attachment
  const downloadAttachment = async (ticketId, attachmentId, filename) => {
    try {
      setDownloadingAttachments(prev => ({ ...prev, [attachmentId]: true }));
      
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      };

      const response = await axios.get(
        `${API_URL}/tickets/${ticketId}/attachment/${attachmentId}`,
        config
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert('Failed to download file');
    } finally {
      setDownloadingAttachments(prev => ({ ...prev, [attachmentId]: false }));
    }
  };

  // View attachment
  const viewAttachment = async (ticketId, attachmentId, filename) => {
    try {
      setDownloadingAttachments(prev => ({ ...prev, [attachmentId]: true }));
      
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      };

      const response = await axios.get(
        `${API_URL}/tickets/${ticketId}/view/${attachmentId}`,
        config
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, '_blank');
      
    } catch (error) {
      console.error('Error viewing attachment:', error);
      alert('Failed to view file');
    } finally {
      setDownloadingAttachments(prev => ({ ...prev, [attachmentId]: false }));
    }
  };

  // Delete attachment
  const deleteAttachment = async (ticketId, attachmentId) => {
    if (!window.confirm('Are you sure you want to delete this attachment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      await axios.delete(`${API_URL}/tickets/${ticketId}/attachment/${attachmentId}`, config);
      
      const response = await axios.get(`${API_URL}/tickets/${ticketId}`, config);
      setSelectedTicket(response.data);
      
      alert('Attachment deleted successfully');
    } catch (error) {
      console.error('Error deleting attachment:', error);
      alert('Failed to delete attachment');
    }
  };

  // Add more attachments
  const addMoreAttachments = async (ticketId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.zip,.rar';
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('attachments', file);
      });

      try {
        const token = localStorage.getItem('token');
        const config = { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        };

        await axios.post(`${API_URL}/tickets/${ticketId}/attachments`, formData, config);
        
        const response = await axios.get(`${API_URL}/tickets/${ticketId}`, config);
        setSelectedTicket(response.data);
        
        alert('Attachments added successfully');
      } catch (error) {
        console.error('Error adding attachments:', error);
        alert('Failed to add attachments');
      }
    };
    
    input.click();
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchQuery === '' || 
      ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber?.toString().includes(searchQuery) ||
      ticket.createdBy?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCompany = filters.company === 'all' || 
      (ticket.company && ticket.company._id === filters.company);
    
    const matchesDepartment = filters.department === 'all' || 
      (ticket.department && ticket.department._id === filters.department);
    
    const matchesStatus = filters.status === 'all' || 
      ticket.status === filters.status;
    
    const matchesPriority = filters.priority === 'all' || 
      ticket.priority === filters.priority;
    
    return matchesSearch && matchesCompany && matchesDepartment && matchesStatus && matchesPriority;
  });

  // Pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  // Get unique values for filters
  const statuses = [...new Set(tickets.map(t => t.status).filter(Boolean))];
  const priorities = [...new Set(tickets.map(t => t.priority).filter(Boolean))];

  if (loading && tickets.length === 0) {
    return <LoadingSpinner text="Loading tickets..." fullPage />;
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaTicketAlt className="text-[#ED1B2F]" />
            Support Tickets
          </h3>
          <p className="text-sm text-white/60 mt-1">
            {filteredTickets.length} of {stats.totalTickets} tickets • {stats.openTickets} open • {stats.inProgressTickets} in progress
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <FaPlus />
            New Ticket
          </Button>
          <Button 
            variant="secondary" 
            onClick={fetchData}
            className="flex items-center gap-2"
            disabled={loading}
          >
            <FaFilter className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <TicketStats stats={stats} />

      {/* Filters */}
      <TicketFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
        companies={companies}
        departments={departments}
        statuses={statuses}
        priorities={priorities}
      />

      {/* Tickets Table */}
      <TicketTable
        tickets={currentTickets}
        onViewTicket={viewTicketDetails}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredTickets.length}
        itemsPerPage={ticketsPerPage}
      />

      {/* Create Ticket Modal */}
      <CreateTicketForm
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setCompanyUsers([]);
          setDepartmentCategories([]);
        }}
        onSubmit={handleCreateTicket}
        companies={companies}
        departments={departments}
        companyUsers={companyUsers}
        departmentCategories={departmentCategories}
        loading={uploading}
        onCompanyChange={fetchCompanyUsers}
        onDepartmentChange={fetchDepartmentCategories}
      />

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        isOpen={showTicketDetailModal}
        onClose={() => setShowTicketDetailModal(false)}
        ticket={selectedTicket}
        onDownload={downloadAttachment}
        onView={viewAttachment}
        onDeleteAttachment={deleteAttachment}
        onAddMore={addMoreAttachments}
        downloadingAttachments={downloadingAttachments}
      />
    </Card>
  );
};

export default TicketsTab;