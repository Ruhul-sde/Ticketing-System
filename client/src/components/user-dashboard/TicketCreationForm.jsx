// components/user-dashboard/TicketCreationForm.jsx
import React, { useState } from 'react';
import { useUserDashboard } from '../../context/UserDashboardContext';
import { RocketLaunchIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';

const TicketCreationForm = () => {
  const { 
    ticketDraft, 
    setTicketDraft, 
    departments, 
    isSubmitting, 
    submitTicket,
    submitTicketJson,
    handleFileUpload,
    removeAttachment,
    testConnection
  } = useUserDashboard();
  
  const [validationError, setValidationError] = useState('');
  const [useJsonMode, setUseJsonMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    
    // Validate required fields
    if (!ticketDraft.title.trim()) {
      setValidationError('Title is required');
      return;
    }
    
    if (!ticketDraft.description.trim()) {
      setValidationError('Description is required');
      return;
    }
    
    if (!ticketDraft.department) {
      setValidationError('Please select a department');
      return;
    }
    
    console.log('Submitting ticket...');
    
    const result = useJsonMode 
      ? await submitTicketJson()
      : await submitTicket();
      
    if (result.success) {
      alert('✅ ' + result.message);
    } else {
      alert('❌ ' + result.message);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      console.log('Files selected:', e.target.files.length);
      handleFileUpload(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  const getDepartmentCategories = () => {
    if (!ticketDraft.department) return [];
    const selectedDept = departments.find(d => d._id === ticketDraft.department);
    console.log('Selected department:', selectedDept?.name);
    console.log('Categories:', selectedDept?.categories);
    return selectedDept?.categories || [];
  };

  const departmentCategories = getDepartmentCategories();

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-white">Create New Support Ticket</h3>
            <p className="text-white/60">Fill in the details below to submit a new support request</p>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={testConnection}
              className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors"
            >
              Test Connection
            </button>
            <button
              type="button"
              onClick={() => setUseJsonMode(!useJsonMode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                useJsonMode 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}
            >
              {useJsonMode ? 'JSON Mode: ON' : 'JSON Mode: OFF'}
            </button>
          </div>
        </div>
      </div>

      {validationError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-red-400 font-medium">⚠️ {validationError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Title Field */}
          <div className="group">
            <label className="text-xs font-bold text-[#455185] uppercase ml-1 mb-2 block">
              Issue Title *
            </label>
            <input
              type="text"
              required
              placeholder="What's happening? Be specific"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]/50 focus:bg-white/10 transition-all placeholder:text-slate-600 text-white"
              value={ticketDraft.title}
              onChange={(e) => {
                console.log('Title:', e.target.value);
                setTicketDraft({...ticketDraft, title: e.target.value});
              }}
              disabled={isSubmitting}
            />
            <p className="text-xs text-white/40 mt-1 ml-1">
              Current: {ticketDraft.title.length} characters
            </p>
          </div>

          {/* Description Field */}
          <div className="group">
            <label className="text-xs font-bold text-[#455185] uppercase ml-1 mb-2 block">
              Description *
            </label>
            <textarea
              rows="5"
              required
              placeholder="Provide detailed context about your issue..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F]/50 focus:bg-white/10 transition-all placeholder:text-slate-600 text-white"
              value={ticketDraft.description}
              onChange={(e) => {
                console.log('Description:', e.target.value);
                setTicketDraft({...ticketDraft, description: e.target.value});
              }}
              disabled={isSubmitting}
            />
            <p className="text-xs text-white/40 mt-1 ml-1">
              Current: {ticketDraft.description.length} characters
            </p>
          </div>

          {/* Attachments */}
          <div className="group">
            <label className="text-xs font-bold text-[#455185] uppercase ml-1 mb-2 block">
              Attachments (Optional)
            </label>
            <div className="space-y-3">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isSubmitting || useJsonMode}
                />
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  isSubmitting || useJsonMode
                    ? 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                    : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-[#455185] cursor-pointer'
                }`}>
                  <PaperClipIcon className="w-5 h-5" />
                  <span>
                    {useJsonMode 
                      ? 'Attachments disabled in JSON mode' 
                      : 'Click to attach files (screenshots, documents, etc.)'
                    }
                  </span>
                </div>
              </label>
              
              {ticketDraft.attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-white/60">Attached files:</p>
                  {ticketDraft.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-lg border border-white/10">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-white block truncate">{file.name}</span>
                        <span className="text-xs text-white/50">
                          {(file.size / 1024).toFixed(1)} KB • {file.type}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-400 hover:text-red-300 ml-2"
                        disabled={isSubmitting}
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-white/5 rounded-[2rem] p-6 space-y-6 border border-white/5">
          {/* Priority */}
          <div>
            <label className="text-xs font-bold text-[#ED1B2F] uppercase mb-2 block">
              Priority Level *
            </label>
            <select 
              className="w-full bg-slate-800 rounded-xl px-4 py-3 outline-none border border-white/10 text-white"
              value={ticketDraft.priority}
              onChange={(e) => setTicketDraft({...ticketDraft, priority: e.target.value})}
              required
              disabled={isSubmitting}
            >
              <option value="low">Low - Standard Request</option>
              <option value="medium">Medium - Important</option>
              <option value="high">High - Urgent (ASAP)</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="text-xs font-bold text-[#455185] uppercase mb-2 block">
              Department *
            </label>
            <select 
              required
              className="w-full bg-slate-800 rounded-xl px-4 py-3 outline-none border border-white/10 text-white"
              value={ticketDraft.department}
              onChange={(e) => {
                console.log('Department changed:', e.target.value);
                setTicketDraft({
                  ...ticketDraft, 
                  department: e.target.value,
                  category: '' // Reset category when department changes
                });
              }}
              disabled={isSubmitting || departments.length === 0}
            >
              <option value="">Select Department</option>
              {departments.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
            {departments.length === 0 && (
              <p className="text-xs text-yellow-400 mt-1">Loading departments...</p>
            )}
          </div>

          {/* Category - Only show if department selected and has categories */}
          {ticketDraft.department && departmentCategories.length > 0 && (
            <div>
              <label className="text-xs font-bold text-[#455185] uppercase mb-2 block">
                Category (Optional)
              </label>
              <select 
                className="w-full bg-slate-800 rounded-xl px-4 py-3 outline-none border border-white/10 text-white"
                value={ticketDraft.category}
                onChange={(e) => {
                  console.log('Category changed:', e.target.value);
                  setTicketDraft({...ticketDraft, category: e.target.value});
                }}
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {departmentCategories.map(cat => (
                  <option key={cat._id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {ticketDraft.category && (
                <p className="text-xs text-white/60 mt-1">
                  Selected: {ticketDraft.category}
                </p>
              )}
            </div>
          )}

          {/* Debug Info */}
          <div className="bg-black/20 p-4 rounded-xl border border-white/5">
            <p className="text-xs font-bold text-white/60 uppercase mb-1">Debug Info</p>
            <div className="text-xs text-white/40 space-y-1">
              <p>Title: {ticketDraft.title ? '✓' : '✗'}</p>
              <p>Description: {ticketDraft.description ? '✓' : '✗'}</p>
              <p>Department: {ticketDraft.department ? '✓' : '✗'}</p>
              <p>Mode: {useJsonMode ? 'JSON' : 'FormData'}</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-white/10">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-[#ED1B2F] to-[#b01423] rounded-2xl font-black text-white shadow-xl hover:shadow-[#ED1B2F]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <RocketLaunchIcon className="w-5 h-5" /> 
                  {useJsonMode ? 'Submit (JSON Mode)' : 'Submit Ticket'}
                </>
              )}
            </button>
            <p className="text-xs text-white/50 mt-3 text-center">
              {useJsonMode 
                ? 'Using JSON mode (no file uploads)' 
                : 'Using FormData mode (supports file uploads)'
              }
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TicketCreationForm;