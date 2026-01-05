// components/super-admin/modals/DepartmentModal.jsx
import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import Button from '../../ui/Button';

const DepartmentModal = () => {
  const { 
    newDept, setNewDept, 
    tempCategory, setTempCategory,
    selections, toggleModal,
    departments, setDepartments,
    fetchData // Make sure this function exists in context
  } = useSuperAdmin();
  
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const addCategoryToDept = () => {
    if (tempCategory.trim()) {
      const newCategory = {
        name: tempCategory.trim(),
        _id: Date.now().toString(), // Temporary ID for UI
        description: '',
        subCategories: []
      };
      
      setNewDept(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
      setTempCategory('');
    }
  };

  const removeCategoryFromDept = (index) => {
    const updatedCategories = [...newDept.categories];
    updatedCategories.splice(index, 1);
    setNewDept(prev => ({
      ...prev,
      categories: updatedCategories
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    try {
      // Prepare categories for backend (remove temporary _id)
      const categoriesToSave = newDept.categories.map(cat => ({
        name: cat.name,
        description: cat.description || '',
        subCategories: cat.subCategories || []
      }));

      const departmentData = {
        name: newDept.name.trim(),
        description: newDept.description.trim(),
        categories: categoriesToSave
      };

      console.log('Saving department:', departmentData);

      let response;
      
      if (selections.dept) {
        // Update existing department
        response = await axios.patch(
          `/departments/${selections.dept._id}`,
          departmentData
        );
        
        console.log('Update response:', response.data);
        
        // Update local state immediately
        setDepartments(prev => 
          prev.map(dept => 
            dept._id === selections.dept._id 
              ? { ...dept, ...response.data }
              : dept
          )
        );
      } else {
        // Create new department
        response = await axios.post('/departments', departmentData);
        
        console.log('Create response:', response.data);
        
        // Update local state immediately
        setDepartments(prev => [...prev, response.data]);
      }
      
      // Refresh data from server to ensure sync
      if (fetchData) {
        await fetchData();
      }
      
      toggleModal('dept', false);
      alert('✅ Department saved successfully!');
      
    } catch (err) {
      console.error('Error saving department:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save department';
      setError(`❌ ${errorMsg}`);
      alert(`Failed to save department: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-bold mb-1">Department Name *</label>
          <input 
            className="w-full bg-black/20 p-3 rounded-lg border border-white/10 focus:border-[#ED1B2F] outline-none transition-colors"
            value={newDept.name} 
            onChange={e => setNewDept({...newDept, name: e.target.value})} 
            required 
            placeholder="Enter department name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-1">Description</label>
          <textarea 
            className="w-full bg-black/20 p-3 rounded-lg border border-white/10 focus:border-[#ED1B2F] outline-none transition-colors"
            value={newDept.description} 
            onChange={e => setNewDept({...newDept, description: e.target.value})} 
            rows="3"
            placeholder="Enter department description"
          />
        </div>
        
        {/* Categories Section */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-bold">Ticket Categories</label>
            <span className="text-xs text-white/50">
              {newDept.categories.length} category{newDept.categories.length !== 1 ? 'ies' : ''}
            </span>
          </div>
          
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              className="flex-1 bg-black/20 p-2 rounded-lg border border-white/10 focus:border-[#ED1B2F] outline-none"
              placeholder="Add category (e.g. Hardware, Network)"
              value={tempCategory}
              onChange={(e) => setTempCategory(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCategoryToDept();
                }
              }}
            />
            <Button 
              type="button" 
              variant="secondary" 
              onClick={addCategoryToDept}
              disabled={!tempCategory.trim() || isSaving}
            >
              Add
            </Button>
          </div>
          
          {/* Categories List */}
          {newDept.categories.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {newDept.categories.map((cat, idx) => (
                <div 
                  key={cat._id || idx}
                  className="flex items-center justify-between bg-[#455185]/20 p-3 rounded-lg border border-[#455185]/30"
                >
                  <div>
                    <span className="font-medium text-white">{cat.name}</span>
                    {cat.description && (
                      <p className="text-xs text-white/60 mt-1">{cat.description}</p>
                    )}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeCategoryFromDept(idx)} 
                    className="text-red-400 hover:text-red-300 font-bold text-lg"
                    disabled={isSaving}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-white/30">
              <p>No categories added yet</p>
              <p className="text-sm mt-1">Add categories to organize tickets</p>
            </div>
          )}
        </div>

        <div className="pt-4 flex gap-3">
          <Button 
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={() => toggleModal('dept', false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1"
            disabled={isSaving || !newDept.name.trim()}
          >
            {isSaving ? 'Saving...' : selections.dept ? 'Update Department' : 'Save Department'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default DepartmentModal;