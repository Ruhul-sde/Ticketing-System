
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Torus, Float } from '@react-three/drei';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AnimatedTorus = ({ color, position }) => (
  <Float speed={2} rotationIntensity={2} floatIntensity={1}>
    <Torus args={[0.7, 0.2, 16, 100]} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
    </Torus>
  </Float>
);

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [categories, setCategories] = useState([]);
  const [adminProfiles, setAdminProfiles] = useState([]);
  
  // Modal states
  const [showAdminDetailModal, setShowAdminDetailModal] = useState(false);
  const [showTokenDetailModal, setShowTokenDetailModal] = useState(false);
  const [showCategoryDetailModal, setShowCategoryDetailModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Form states
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSubCategoryForm, setShowSubCategoryForm] = useState(false);
  const [showAdminProfileForm, setShowAdminProfileForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [newDept, setNewDept] = useState({ name: '', description: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '', subCategories: [] });
  const [newSubCategory, setNewSubCategory] = useState('');
  const [newAdminProfile, setNewAdminProfile] = useState({ 
    userId: '', 
    bio: '', 
    expertise: [], 
    categories: [], 
    phone: '', 
    profileImage: '',
    employeeId: '',
    address: '',
    emergencyContact: { name: '', phone: '', relation: '' }
  });
  const [newExpertise, setNewExpertise] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [assignmentData, setAssignmentData] = useState({ department: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { API_URL, user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching dashboard data from:', API_URL);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const [statsRes, usersRes, deptsRes, tokensRes, categoriesRes, profilesRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/stats`, config).catch(err => {
          console.error('Stats fetch error:', err);
          throw err;
        }),
        axios.get(`${API_URL}/users`, config).catch(err => {
          console.error('Users fetch error:', err);
          throw err;
        }),
        axios.get(`${API_URL}/departments`, config).catch(err => {
          console.error('Departments fetch error:', err);
          throw err;
        }),
        axios.get(`${API_URL}/tokens`, config).catch(err => {
          console.error('Tokens fetch error:', err);
          throw err;
        }),
        axios.get(`${API_URL}/categories`, config).catch(err => {
          console.error('Categories fetch error:', err);
          throw err;
        }),
        axios.get(`${API_URL}/admin-profiles`, config).catch(err => {
          console.error('Profiles fetch error:', err);
          throw err;
        })
      ]);
      
      console.log('Data fetched successfully');
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setDepartments(deptsRes.data);
      setTokens(tokensRes.data);
      setCategories(categoriesRes.data);
      setAdminProfiles(profilesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError(`Failed to load dashboard data: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/departments`, newDept);
      setNewDept({ name: '', description: '' });
      setShowDeptForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Failed to create department');
    }
  };

  const deleteDepartment = async (deptId) => {
    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_URL}/departments/${deptId}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting department:', error);
        alert('Failed to delete department');
      }
    }
  };

  const updateUser = async (userId) => {
    try {
      await axios.patch(`${API_URL}/users/${userId}`, assignmentData);
      setSelectedUser(null);
      setAssignmentData({ department: '', role: '' });
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const assignToken = async (tokenId, adminId, deptId) => {
    try {
      await axios.patch(`${API_URL}/tokens/${tokenId}/assign`, {
        assignedTo: adminId,
        department: deptId
      });
      fetchData();
    } catch (error) {
      console.error('Error assigning token:', error);
      alert('Failed to assign token');
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.patch(`${API_URL}/categories/${editingCategory._id}`, newCategory);
      } else {
        await axios.post(`${API_URL}/categories`, newCategory);
      }
      setNewCategory({ name: '', description: '', subCategories: [] });
      setShowCategoryForm(false);
      setEditingCategory(null);
      fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const addSubCategory = () => {
    if (newSubCategory.trim()) {
      setNewCategory({
        ...newCategory,
        subCategories: [...newCategory.subCategories, newSubCategory.trim()]
      });
      setNewSubCategory('');
    }
  };

  const removeSubCategory = (index) => {
    setNewCategory({
      ...newCategory,
      subCategories: newCategory.subCategories.filter((_, i) => i !== index)
    });
  };

  const deleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${API_URL}/categories/${categoryId}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  const deleteSubCategory = async (categoryId, subCategoryName) => {
    if (window.confirm(`Are you sure you want to delete subcategory "${subCategoryName}"?`)) {
      try {
        const category = categories.find(c => c._id === categoryId);
        const updatedSubCategories = category.subCategories.filter(sc => sc !== subCategoryName);
        await axios.patch(`${API_URL}/categories/${categoryId}`, {
          ...category,
          subCategories: updatedSubCategories
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        alert('Failed to delete subcategory');
      }
    }
  };

  const createAdminProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/admin-profiles`, newAdminProfile);
      setNewAdminProfile({ 
        userId: '', 
        bio: '', 
        expertise: [], 
        categories: [], 
        phone: '', 
        profileImage: '',
        employeeId: '',
        address: '',
        emergencyContact: { name: '', phone: '', relation: '' }
      });
      setShowAdminProfileForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating admin profile:', error);
      alert('Failed to create admin profile');
    }
  };

  const addExpertise = () => {
    if (newExpertise.trim()) {
      setNewAdminProfile({
        ...newAdminProfile,
        expertise: [...newAdminProfile.expertise, newExpertise.trim()]
      });
      setNewExpertise('');
    }
  };

  const removeExpertise = (index) => {
    setNewAdminProfile({
      ...newAdminProfile,
      expertise: newAdminProfile.expertise.filter((_, i) => i !== index)
    });
  };

  const deleteAdminProfile = async (profileId) => {
    if (window.confirm('Are you sure you want to delete this admin profile?')) {
      try {
        await axios.delete(`${API_URL}/admin-profiles/${profileId}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting admin profile:', error);
        alert('Failed to delete admin profile');
      }
    }
  };

  const openAdminDetail = (admin) => {
    const profile = adminProfiles.find(p => p.user?._id === admin._id);
    setSelectedAdmin({ ...admin, profile });
    setShowAdminDetailModal(true);
  };

  const openTokenDetail = (token) => {
    setSelectedToken(token);
    setShowTokenDetailModal(true);
  };

  const openCategoryDetail = (category) => {
    setSelectedCategory(category);
    setShowCategoryDetailModal(true);
  };

  const editCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description || '',
      subCategories: [...(category.subCategories || [])]
    });
    setShowCategoryForm(true);
  };

  const COLORS = ['#ED1B2F', '#455185', '#00C49F', '#FFBB28', '#8884D8', '#FF8042'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-2xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  const pieData = stats ? [
    { name: 'Solved', value: stats.overview.solvedTokens },
    { name: 'Assigned', value: stats.overview.assignedTokens },
    { name: 'Pending', value: stats.overview.pendingTokens }
  ] : [];

  const departmentStats = departments.map(dept => {
    const deptTokens = tokens.filter(t => t.department?._id === dept._id);
    const deptAdmins = users.filter(u => u.role === 'admin' && u.department?._id === dept._id);
    return {
      name: dept.name,
      totalTokens: deptTokens.length,
      solved: deptTokens.filter(t => t.status === 'solved').length,
      pending: deptTokens.filter(t => t.status === 'pending').length,
      admins: deptAdmins.length
    };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 h-64 rounded-2xl overflow-hidden shadow-2xl">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <AnimatedTorus color="#ED1B2F" position={[-2, 0, 0]} />
          <AnimatedTorus color="#455185" position={[2, 0, 0]} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Super Admin Dashboard</h2>
        <p className="text-white/60 mt-2">Welcome, {user?.name || 'Super Admin'}</p>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <h3 className="text-white/60 text-sm mb-2">Total Tokens</h3>
              <p className="text-3xl font-bold text-white">{stats.overview.totalTokens}</p>
              <div className="mt-2 text-xs text-white/50">All time</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <h3 className="text-white/60 text-sm mb-2">Solved</h3>
              <p className="text-3xl font-bold text-green-400">{stats.overview.solvedTokens}</p>
              <div className="mt-2 text-xs text-white/50">
                {stats.overview.totalTokens > 0 ? 
                  `${Math.round((stats.overview.solvedTokens / stats.overview.totalTokens) * 100)}% completion` 
                  : '0% completion'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <h3 className="text-white/60 text-sm mb-2">Pending</h3>
              <p className="text-3xl font-bold text-yellow-400">{stats.overview.pendingTokens}</p>
              <div className="mt-2 text-xs text-white/50">Awaiting assignment</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <h3 className="text-white/60 text-sm mb-2">Assigned</h3>
              <p className="text-3xl font-bold text-blue-400">{stats.overview.assignedTokens}</p>
              <div className="mt-2 text-xs text-white/50">In progress</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Token Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={pieData} 
                    cx="50%" 
                    cy="50%" 
                    labelLine={false} 
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100} 
                    fill="#8884d8" 
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Department Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="name" stroke="#ffffff" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#ffffff" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="solved" fill="#00C49F" name="Solved" />
                  <Bar dataKey="pending" fill="#FFBB28" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Departments Management */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Departments ({departments.length})</h3>
          <button
            onClick={() => setShowDeptForm(!showDeptForm)}
            className="px-4 py-2 bg-[#ED1B2F] hover:bg-[#d41829] text-white rounded-lg transition-colors"
          >
            {showDeptForm ? 'Cancel' : '+ Add Department'}
          </button>
        </div>

        {showDeptForm && (
          <form onSubmit={createDepartment} className="mb-4 space-y-3 bg-white/5 p-4 rounded-lg">
            <input
              type="text"
              placeholder="Department Name"
              value={newDept.name}
              onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newDept.description}
              onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
            />
            <button type="submit" className="px-4 py-2 bg-[#455185] hover:bg-[#3a456f] text-white rounded-lg transition-colors">
              Create Department
            </button>
          </form>
        )}

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => {
            const deptStats = departmentStats.find(d => d.name === dept.name);
            return (
              <div key={dept._id} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-semibold text-lg">{dept.name}</h4>
                  <button
                    onClick={() => deleteDepartment(dept._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    🗑️
                  </button>
                </div>
                <p className="text-white/60 text-sm mb-3">{dept.description}</p>
                {deptStats && (
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-400">✓ {deptStats.solved} solved</span>
                    <span className="text-yellow-400">⏳ {deptStats.pending} pending</span>
                    <span className="text-blue-400">👥 {deptStats.admins} admins</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Category & Subcategory Management */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Category & Subcategory Management ({categories.length})</h3>
          <button
            onClick={() => {
              setShowCategoryForm(!showCategoryForm);
              setEditingCategory(null);
              setNewCategory({ name: '', description: '', subCategories: [] });
            }}
            className="px-4 py-2 bg-[#ED1B2F] hover:bg-[#d41829] text-white rounded-lg transition-colors"
          >
            {showCategoryForm ? 'Cancel' : '+ Add Category'}
          </button>
        </div>

        {showCategoryForm && (
          <form onSubmit={createCategory} className="mb-4 space-y-3 bg-white/5 p-4 rounded-lg">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
            />
            <div>
              <label className="text-white/80 text-sm mb-2 block">Subcategories</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add subcategory"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubCategory())}
                  className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#455185]"
                />
                <button
                  type="button"
                  onClick={addSubCategory}
                  className="px-4 py-2 bg-[#455185] hover:bg-[#3a456f] text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newCategory.subCategories.map((sub, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/20 text-white rounded-full text-sm flex items-center gap-2">
                    {sub}
                    <button
                      type="button"
                      onClick={() => removeSubCategory(idx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <button type="submit" className="px-4 py-2 bg-[#455185] hover:bg-[#3a456f] text-white rounded-lg transition-colors">
              {editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </form>
        )}

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all border border-white/10 cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 
                  className="text-white font-semibold text-lg hover:text-[#ED1B2F] transition-colors"
                  onClick={() => openCategoryDetail(cat)}
                >
                  {cat.name}
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => editCategory(cat)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p className="text-white/60 text-sm mb-3">{cat.description}</p>
              {cat.subCategories && cat.subCategories.length > 0 && (
                <div>
                  <p className="text-white/50 text-xs mb-2">Subcategories ({cat.subCategories.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.subCategories.slice(0, 3).map((sub, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white/10 text-white/70 rounded text-xs">
                        {sub}
                      </span>
                    ))}
                    {cat.subCategories.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 text-white/70 rounded text-xs">
                        +{cat.subCategories.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Admin Directory */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Admin Directory ({adminProfiles.length})</h3>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#455185]"
            >
              <option value="all" className="text-gray-900">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id} className="text-gray-900">
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowAdminProfileForm(!showAdminProfileForm)}
              className="px-4 py-2 bg-[#ED1B2F] hover:bg-[#d41829] text-white rounded-lg transition-colors"
            >
              {showAdminProfileForm ? 'Cancel' : '+ Add Admin Profile'}
            </button>
          </div>
        </div>

        {showAdminProfileForm && (
          <form onSubmit={createAdminProfile} className="mb-4 space-y-4 bg-white/5 p-6 rounded-xl border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm mb-2">Select Admin User *</label>
                <select
                  value={newAdminProfile.userId}
                  onChange={(e) => setNewAdminProfile({ ...newAdminProfile, userId: e.target.value })}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
                  required
                >
                  <option value="" className="text-gray-900">Select Admin User</option>
                  {users.filter(u => u.role === 'admin').map((admin) => (
                    <option key={admin._id} value={admin._id} className="text-gray-900">
                      {admin.name} - {admin.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Employee ID</label>
                <input
                  type="text"
                  placeholder="EMP-001"
                  value={newAdminProfile.employeeId}
                  onChange={(e) => setNewAdminProfile({ ...newAdminProfile, employeeId: e.target.value })}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={newAdminProfile.phone}
                  onChange={(e) => setNewAdminProfile({ ...newAdminProfile, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm mb-2">Profile Picture URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/profile.jpg"
                  value={newAdminProfile.profileImage}
                  onChange={(e) => setNewAdminProfile({ ...newAdminProfile, profileImage: e.target.value })}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm mb-2">Bio</label>
                <textarea
                  placeholder="Tell us about this admin..."
                  value={newAdminProfile.bio}
                  onChange={(e) => setNewAdminProfile({ ...newAdminProfile, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F] min-h-24"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm mb-2">Address</label>
                <textarea
                  placeholder="Full address"
                  value={newAdminProfile.address}
                  onChange={(e) => setNewAdminProfile({ ...newAdminProfile, address: e.target.value })}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
                  rows="2"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h5 className="text-white font-semibold mb-3">Emergency Contact</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={newAdminProfile.emergencyContact.name}
                    onChange={(e) => setNewAdminProfile({ 
                      ...newAdminProfile, 
                      emergencyContact: { ...newAdminProfile.emergencyContact, name: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#455185]"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    placeholder="Contact Phone"
                    value={newAdminProfile.emergencyContact.phone}
                    onChange={(e) => setNewAdminProfile({ 
                      ...newAdminProfile, 
                      emergencyContact: { ...newAdminProfile.emergencyContact, phone: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#455185]"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Relation</label>
                  <input
                    type="text"
                    placeholder="Spouse, Parent, etc."
                    value={newAdminProfile.emergencyContact.relation}
                    onChange={(e) => setNewAdminProfile({ 
                      ...newAdminProfile, 
                      emergencyContact: { ...newAdminProfile.emergencyContact, relation: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#455185]"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-white/80 text-sm mb-2 block">Assigned Categories</label>
              <div className="space-y-2 max-h-40 overflow-y-auto bg-white/5 rounded-lg p-2">
                {categories.map((cat) => (
                  <label key={cat._id} className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={newAdminProfile.categories.includes(cat._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewAdminProfile({
                            ...newAdminProfile,
                            categories: [...newAdminProfile.categories, cat._id]
                          });
                        } else {
                          setNewAdminProfile({
                            ...newAdminProfile,
                            categories: newAdminProfile.categories.filter(c => c !== cat._id)
                          });
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-white text-sm">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-white/80 text-sm mb-2 block">Areas of Expertise</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add expertise area"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                  className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#455185]"
                />
                <button
                  type="button"
                  onClick={addExpertise}
                  className="px-4 py-2 bg-[#455185] hover:bg-[#3a456f] text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newAdminProfile.expertise.map((exp, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/20 text-white rounded-full text-sm flex items-center gap-2">
                    {exp}
                    <button
                      type="button"
                      onClick={() => removeExpertise(idx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="Profile Image URL"
              value={newAdminProfile.profileImage}
              onChange={(e) => setNewAdminProfile({ ...newAdminProfile, profileImage: e.target.value })}
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]"
            />
            <button type="submit" className="px-4 py-2 bg-[#455185] hover:bg-[#3a456f] text-white rounded-lg transition-colors">
              Create Admin Profile
            </button>
          </form>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {adminProfiles
            .filter(profile => {
              if (categoryFilter === 'all') return true;
              return profile.categories?.some(cat => cat._id === categoryFilter);
            })
            .map((profile) => (
            <div 
              key={profile._id} 
              className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all border border-white/10 cursor-pointer"
              onClick={() => openAdminDetail(profile.user)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {profile.profileImage && (
                    <img src={profile.profileImage} alt={profile.user?.name} className="w-12 h-12 rounded-full object-cover" />
                  )}
                  <div>
                    <h4 className="text-white font-semibold hover:text-[#ED1B2F] transition-colors">{profile.user?.name}</h4>
                    <p className="text-white/60 text-xs">{profile.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAdminProfile(profile._id);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  🗑️
                </button>
              </div>
              <p className="text-white/70 text-sm mb-2 line-clamp-2">{profile.bio}</p>
              <div className="text-xs text-white/50 mb-2">
                📞 {profile.phone || 'N/A'}
              </div>
              <div className="text-xs text-white/50 mb-2">
                🏢 {profile.user?.department?.name || 'No Department'}
              </div>
              {profile.categories && profile.categories.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-white/50 mb-1">Categories:</div>
                  <div className="flex flex-wrap gap-1">
                    {profile.categories.slice(0, 2).map((cat, idx) => (
                      <span key={idx} className="px-2 py-1 bg-[#ED1B2F]/20 text-[#ED1B2F] rounded text-xs">
                        {cat.name}
                      </span>
                    ))}
                    {profile.categories.length > 2 && (
                      <span className="px-2 py-1 bg-[#ED1B2F]/20 text-[#ED1B2F] rounded text-xs">
                        +{profile.categories.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {profile.expertise && profile.expertise.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {profile.expertise.slice(0, 2).map((exp, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                      {exp}
                    </span>
                  ))}
                  {profile.expertise.length > 2 && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                      +{profile.expertise.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Token List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
        <h3 className="text-xl font-bold text-white mb-4">All Tokens ({tokens.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4">Token #</th>
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Creator</th>
                <th className="text-left py-3 px-4">Department</th>
                <th className="text-left py-3 px-4">Assigned To</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Priority</th>
                <th className="text-left py-3 px-4">Created</th>
                <th className="text-left py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {tokens.slice(0, 10).map((token) => (
                <tr 
                  key={token._id} 
                  className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => openTokenDetail(token)}
                >
                  <td className="py-3 px-4">
                    <span className="bg-gradient-to-r from-[#ED1B2F]/20 to-[#455185]/20 text-white px-2 py-1 rounded text-xs font-mono font-bold border border-white/20">
                      {token.tokenNumber || token._id.slice(-8)}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">{token.title}</td>
                  <td className="py-3 px-4">
                    <div className="text-white/90">{token.createdBy?.name}</div>
                    <div className="text-white/50 text-xs">{token.createdBy?.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white/70 text-sm">
                      {token.department?.name || 'Unassigned'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {token.assignedTo ? (
                      <div>
                        <div className="text-white/90 text-sm">{token.assignedTo.name}</div>
                        <div className="text-white/50 text-xs">{token.assignedTo.email}</div>
                      </div>
                    ) : (
                      <span className="text-white/50 text-sm">Not assigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      token.status === 'solved' ? 'bg-green-500/20 text-green-400' :
                      token.status === 'assigned' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {token.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      token.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      token.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {token.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white/60 text-sm">
                    {new Date(token.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTokenDetail(token);
                      }}
                      className="text-[#ED1B2F] hover:text-[#d41829] text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tokens.length > 10 && (
            <p className="text-white/60 text-center py-4 text-sm">Showing 10 of {tokens.length} tokens</p>
          )}
        </div>
      </div>

      {/* Admin Detail Modal */}
      {showAdminDetailModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowAdminDetailModal(false)}>
          <div className="bg-gradient-to-br from-[#455185] to-[#2a3357] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-white">Admin Details</h3>
              <button onClick={() => setShowAdminDetailModal(false)} className="text-white/60 hover:text-white text-2xl">×</button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {selectedAdmin.profile?.profileImage && (
                  <img src={selectedAdmin.profile.profileImage} alt={selectedAdmin.name} className="w-20 h-20 rounded-full object-cover border-4 border-white/20" />
                )}
                <div>
                  <h4 className="text-2xl font-bold text-white">{selectedAdmin.name}</h4>
                  <p className="text-white/70">{selectedAdmin.email}</p>
                  <p className="text-white/50 text-sm">Employee Code: {selectedAdmin.employeeCode}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Role</p>
                  <p className="text-white font-semibold">{selectedAdmin.role}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Department</p>
                  <p className="text-white font-semibold">{selectedAdmin.department?.name || 'N/A'}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Phone</p>
                  <p className="text-white font-semibold">{selectedAdmin.profile?.phone || 'N/A'}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs ${selectedAdmin.profile?.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {selectedAdmin.profile?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {selectedAdmin.profile?.bio && (
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-2">Bio</p>
                  <p className="text-white">{selectedAdmin.profile.bio}</p>
                </div>
              )}

              {selectedAdmin.profile?.categories && selectedAdmin.profile.categories.length > 0 && (
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-2">Assigned Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAdmin.profile.categories.map((cat, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[#ED1B2F]/20 text-[#ED1B2F] rounded-full text-sm">
                        {cat.name}
                        {cat.subCategories && cat.subCategories.length > 0 && (
                          <span className="ml-1 text-xs text-white/50">({cat.subCategories.length} subs)</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedAdmin.profile?.expertise && selectedAdmin.profile.expertise.length > 0 && (
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-2">Areas of Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAdmin.profile.expertise.map((exp, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-2">Statistics</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-green-400">{tokens.filter(t => t.solvedBy?._id === selectedAdmin._id).length}</p>
                    <p className="text-white/60 text-xs">Tokens Solved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-400">{tokens.filter(t => t.assignedTo?._id === selectedAdmin._id && t.status === 'assigned').length}</p>
                    <p className="text-white/60 text-xs">Currently Assigned</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-400">
                      {tokens.filter(t => t.solvedBy?._id === selectedAdmin._id && t.timeToSolve).length > 0
                        ? Math.round(tokens.filter(t => t.solvedBy?._id === selectedAdmin._id && t.timeToSolve).reduce((sum, t) => sum + t.timeToSolve, 0) / tokens.filter(t => t.solvedBy?._id === selectedAdmin._id && t.timeToSolve).length)
                        : 0}
                    </p>
                    <p className="text-white/60 text-xs">Avg Time (min)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Token Detail Modal */}
      {showTokenDetailModal && selectedToken && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowTokenDetailModal(false)}>
          <div className="bg-gradient-to-br from-[#455185] to-[#2a3357] rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedToken.title}</h3>
                <span className="bg-gradient-to-r from-[#ED1B2F]/20 to-[#455185]/20 text-white px-3 py-1 rounded text-sm font-mono font-bold border border-white/20">
                  #{selectedToken.tokenNumber || selectedToken._id.slice(-8)}
                </span>
              </div>
              <button onClick={() => setShowTokenDetailModal(false)} className="text-white/60 hover:text-white text-2xl">×</button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-2">Description</p>
                <p className="text-white">{selectedToken.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedToken.status === 'solved' ? 'bg-green-500/20 text-green-400' :
                    selectedToken.status === 'assigned' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {selectedToken.status}
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Priority</p>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedToken.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    selectedToken.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {selectedToken.priority}
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Category</p>
                  <p className="text-white font-semibold">{selectedToken.category || 'N/A'}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Subcategory</p>
                  <p className="text-white font-semibold">{selectedToken.subCategory || 'N/A'}</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-2">Creator Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/50 text-xs">Name</p>
                    <p className="text-white">{selectedToken.createdBy?.name}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Email</p>
                    <p className="text-white">{selectedToken.createdBy?.email}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Company</p>
                    <p className="text-white">{selectedToken.createdBy?.companyName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Created At</p>
                    <p className="text-white">{new Date(selectedToken.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {selectedToken.assignedTo && (
                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                  <p className="text-blue-400 text-sm mb-2">Assigned To</p>
                  <p className="text-white font-semibold">{selectedToken.assignedTo.name}</p>
                  <p className="text-white/70 text-sm">{selectedToken.assignedTo.email}</p>
                  <p className="text-white/60 text-sm">Department: {selectedToken.department?.name || 'N/A'}</p>
                </div>
              )}

              {selectedToken.solvedBy && (
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                  <p className="text-green-400 text-sm mb-2">Solved By</p>
                  <p className="text-white font-semibold">{selectedToken.solvedBy.name}</p>
                  <p className="text-white/70 text-sm">{selectedToken.solvedBy.email}</p>
                  {selectedToken.solvedAt && (
                    <p className="text-white/60 text-sm">Solved at: {new Date(selectedToken.solvedAt).toLocaleString()}</p>
                  )}
                  {selectedToken.timeToSolve && (
                    <p className="text-white/60 text-sm">Time to solve: {selectedToken.timeToSolve} minutes</p>
                  )}
                </div>
              )}

              {selectedToken.remarks && selectedToken.remarks.length > 0 && (
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-3">Admin Remarks</p>
                  <div className="space-y-3">
                    {selectedToken.remarks.map((remark, idx) => (
                      <div key={idx} className="bg-white/5 rounded-lg p-3 border-l-4 border-[#455185]">
                        <p className="text-white text-sm mb-1">{remark.text}</p>
                        <p className="text-white/40 text-xs">
                          {remark.addedBy?.name} • {new Date(remark.addedAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedToken.feedback && (
                <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
                  <p className="text-purple-400 text-sm mb-2">User Feedback</p>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-white font-semibold">Rating:</p>
                    <p className="text-yellow-400">{'⭐'.repeat(selectedToken.feedback.rating)}</p>
                  </div>
                  {selectedToken.feedback.comment && (
                    <p className="text-white/70 text-sm">{selectedToken.feedback.comment}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Category Detail Modal */}
      {showCategoryDetailModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowCategoryDetailModal(false)}>
          <div className="bg-gradient-to-br from-[#455185] to-[#2a3357] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedCategory.name}</h3>
                <p className="text-white/70">{selectedCategory.description}</p>
              </div>
              <button onClick={() => setShowCategoryDetailModal(false)} className="text-white/60 hover:text-white text-2xl">×</button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-white font-semibold">Subcategories ({selectedCategory.subCategories?.length || 0})</p>
                  <button
                    onClick={() => {
                      setShowCategoryDetailModal(false);
                      editCategory(selectedCategory);
                    }}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30"
                  >
                    + Add Subcategory
                  </button>
                </div>
                {selectedCategory.subCategories && selectedCategory.subCategories.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCategory.subCategories.map((sub, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                        <span className="text-white">{sub}</span>
                        <button
                          onClick={() => deleteSubCategory(selectedCategory._id, sub)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60 text-sm">No subcategories yet</p>
                )}
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-white font-semibold mb-3">Usage Statistics</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-blue-400">
                      {tokens.filter(t => t.category === selectedCategory.name).length}
                    </p>
                    <p className="text-white/60 text-xs">Total Tokens</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-400">
                      {tokens.filter(t => t.category === selectedCategory.name && t.status === 'solved').length}
                    </p>
                    <p className="text-white/60 text-xs">Solved Tokens</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-white font-semibold mb-2">Metadata</p>
                <div className="space-y-2 text-sm">
                  <p className="text-white/60">Created: {new Date(selectedCategory.createdAt).toLocaleString()}</p>
                  <p className="text-white/60">Category ID: {selectedCategory._id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
