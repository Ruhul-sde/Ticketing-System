// components/super-admin/tabs/DepartmentsTab.jsx
import React, { useEffect, useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import axios from 'axios';

const DepartmentsTab = () => {
  const { 
    departments, 
    setDepartments,
    toggleModal, 
    setSelections, 
    setNewDept,
    fetchData // Make sure this is in context
  } = useSuperAdmin();
  
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to refresh departments
  const refreshDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/departments');
      console.log('Refreshed departments:', response.data.length);
      setDepartments(response.data);
    } catch (err) {
      console.error('Error refreshing departments:', err);
      setError('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    refreshDepartments();
  }, []);

  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department? This will also delete all its categories.')) {
      try {
        await axios.delete(`/departments/${departmentId}`);
        await refreshDepartments(); // Refresh after delete
        alert('Department deleted successfully!');
      } catch (err) {
        console.error('Delete error:', err);
        alert(`Failed to delete department: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const openEditModal = (dept) => {
    setSelections(prev => ({ ...prev, dept }));
    setNewDept({ 
      name: dept.name, 
      description: dept.description || '', 
      categories: dept.categories || [] 
    });
    toggleModal('dept', true);
  };

  const openCreateModal = () => {
    setSelections(prev => ({ ...prev, dept: null }));
    setNewDept({ name: '', description: '', categories: [] });
    toggleModal('dept', true);
  };

  // Function to add a quick category
  const addQuickCategory = async (departmentId, departmentName) => {
    const categoryName = prompt(`Enter category name for ${departmentName}:`);
    if (!categoryName?.trim()) return;

    try {
      const response = await axios.post(`/departments/${departmentId}/categories`, {
        name: categoryName.trim(),
        description: '',
        subCategories: []
      });
      
      // Update local state
      setDepartments(prev => 
        prev.map(dept => 
          dept._id === departmentId ? response.data : dept
        )
      );
      
      alert(`✅ Category "${categoryName}" added successfully!`);
    } catch (err) {
      console.error('Add category error:', err);
      alert(`❌ Failed to add category: ${err.response?.data?.message || err.message}`);
    }
  };

  // Stats calculation
  const totalCategories = departments.reduce((acc, dept) => 
    acc + (dept.categories?.length || 0), 0
  );
  
  const maxCategories = departments.length > 0 
    ? Math.max(...departments.map(dept => dept.categories?.length || 0))
    : 0;
  
  const deptsWithCategories = departments.filter(dept => 
    dept.categories?.length > 0
  ).length;

  return (
    <Card>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Departments</h3>
          <p className="text-white/60">Manage departments and their categories</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="ghost" 
            onClick={refreshDepartments}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </Button>
          <Button onClick={openCreateModal}>
            + Add Department
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {loading && !error ? (
        <div className="text-center py-10">
          <div className="w-12 h-12 border-4 border-[#ED1B2F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading departments...</p>
        </div>
      ) : departments.length === 0 ? (
        <div className="text-center text-white/40 py-10">
          <div className="text-6xl mb-4">🏢</div>
          <h4 className="text-xl font-bold mb-2">No Departments Found</h4>
          <p className="mb-6">Create your first department to get started!</p>
          <Button onClick={openCreateModal}>Create First Department</Button>
        </div>
      ) : (
        <>
          {/* Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map(dept => (
              <div 
                key={dept._id} 
                className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-[#ED1B2F] transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-bold group-hover:text-[#ED1B2F] transition-colors">
                    {dept.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#ED1B2F]/20 text-[#ED1B2F] px-2 py-1 rounded-full">
                      {dept.categories?.length || 0} categories
                    </span>
                  </div>
                </div>
                
                <p className="text-white/60 text-sm mb-4 min-h-[3rem]">
                  {dept.description || 'No description provided.'}
                </p>
                
                {/* Categories Display */}
                <div className="mb-4">
                  <div className="text-xs text-white/40 mb-2">Categories:</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {dept.categories?.slice(0, 3).map((cat, i) => (
                      <span 
                        key={cat._id || i} 
                        className="text-xs bg-[#455185]/30 px-2 py-1 rounded text-white/80 border border-[#455185] truncate max-w-[120px]"
                        title={cat.description || cat.name}
                      >
                        {cat.name}
                      </span>
                    ))}
                    {dept.categories?.length > 3 && (
                      <span className="text-xs text-white/50 px-2 py-1">
                        +{dept.categories.length - 3} more
                      </span>
                    )}
                    {(!dept.categories || dept.categories.length === 0) && (
                      <span className="text-xs text-white/30 italic">
                        No categories
                      </span>
                    )}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => addQuickCategory(dept._id, dept.name)}
                      className="text-xs text-[#455185] hover:text-white transition-colors"
                    >
                      + Add Category
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                  <div className="text-xs text-white/40">
                    {dept.createdAt ? new Date(dept.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(dept)}
                      className="text-[#455185] font-bold hover:text-white transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteDepartment(dept._id)}
                      className="text-[#ED1B2F] hover:text-red-400 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Department Stats */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-white/5 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {departments.length}
                </div>
                <div className="text-sm text-white/60">Total Departments</div>
              </div>
              
              <div className="text-center bg-white/5 p-4 rounded-lg">
                <div className="text-2xl font-bold text-emerald-400">
                  {totalCategories}
                </div>
                <div className="text-sm text-white/60">Total Categories</div>
              </div>
              
              <div className="text-center bg-white/5 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {maxCategories}
                </div>
                <div className="text-sm text-white/60">Max Categories</div>
              </div>
              
              <div className="text-center bg-white/5 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">
                  {deptsWithCategories}
                </div>
                <div className="text-sm text-white/60">Departments with Categories</div>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default DepartmentsTab;