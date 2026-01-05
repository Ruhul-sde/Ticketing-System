// context/SuperAdminContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth from AuthContext

export const SuperAdminDashboardContext = createContext();

export const useSuperAdmin = () => {
  const context = useContext(SuperAdminDashboardContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within SuperAdminDashboardProvider');
  }
  return context;
};

export const SuperAdminDashboardProvider = ({ children }) => {
  const { API_URL } = useAuth(); // Now useAuth is defined here
  
  // Rest of your state...
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [adminProfiles, setAdminProfiles] = useState([]);
  const [companies, setCompanies] = useState([]);
  
  // UI States
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [modals, setModals] = useState({
    company: false,
    adminDetail: false,
    tokenDetail: false,
    dept: false,
    user: false,
    status: false,
    adminForm: false,
    createToken: false
  });

  // Selection States
  const [selections, setSelections] = useState({
    company: null,
    admin: null,
    ticket: null,
    user: null,
    dept: null
  });

  // Form States
  const [newDept, setNewDept] = useState({ name: '', description: '', categories: [] });
  const [tempCategory, setTempCategory] = useState('');
  const [newAdminProfile, setNewAdminProfile] = useState({ 
    name: '', email: '', password: '', expertise: [], 
    department: '', categories: [], phone: '', employeeId: '' 
  });
  const [newToken, setNewToken] = useState({
    title: '', description: '', priority: 'medium', department: '', 
    category: '', subCategory: '', reason: '', supportingDocuments: [], 
    userDetails: { name: '', email: '', employeeCode: '', companyName: '' }
  });

  // Filter States
  const [filters, setFilters] = useState({
    department: 'all',
    status: 'all',
    priority: 'all',
  });

  const toggleModal = (modalName, show = true) => {
    setModals(prev => ({ ...prev, [modalName]: show }));
  };

  const contextValue = {
    // State
    stats, setStats,
    users, setUsers,
    departments, setDepartments,
    tickets, setTickets,
    adminProfiles, setAdminProfiles,
    companies, setCompanies,
    
    // UI State
    activeTab, setActiveTab,
    selectedTimeRange, setSelectedTimeRange,
    searchQuery, setSearchQuery,
    loading, setLoading,
    error, setError,
    
    // Modal State
    modals, setModals,
    selections, setSelections,
    
    // Form State
    newDept, setNewDept,
    tempCategory, setTempCategory,
    newAdminProfile, setNewAdminProfile,
    newToken, setNewToken,
    
    // Filter State
    filters, setFilters,
    
    // Functions
    toggleModal,
    API_URL // Pass API_URL from AuthContext
  };

  return (
    <SuperAdminDashboardContext.Provider value={contextValue}>
      {children}
    </SuperAdminDashboardContext.Provider>
  );
};