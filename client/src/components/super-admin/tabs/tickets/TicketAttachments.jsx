// tickets/TicketAttachments.jsx
import React, { useState } from 'react';
import Button from '../../../ui/Button';
import { useAuth } from '../../../../context/AuthContext';
import axios from 'axios';
import { FaSpinner, FaEye, FaDownload, FaTrash, FaUpload } from 'react-icons/fa';
import { getFileIcon, getSupportingDocIcon, formatFileSize } from './utils/fileHelpers';

const TicketAttachments = ({ ticket, onTicketUpdated }) => {
  const { API_URL } = useAuth();
  const [downloadingAttachments, setDownloadingAttachments] = useState({});

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
      onTicketUpdated(response.data);
      alert('Attachment deleted successfully');
    } catch (error) {
      console.error('Error deleting attachment:', error);
      alert('Failed to delete attachment');
    }
  };

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
        onTicketUpdated(response.data);
        alert('Attachments added successfully');
      } catch (error) {
        console.error('Error adding attachments:', error);
        alert('Failed to add attachments');
      }
    };
    
    input.click();
  };

  if (!ticket) return null;

  return (
    <>
      {/* Main Attachments Section */}
      {ticket.attachments && ticket.attachments.length > 0 && (
        <div>
          <h5 className="font-bold text-white mb-2">Attachments ({ticket.attachments.length})</h5>
          <div className="space-y-3">
            {ticket.attachments.map((attachment) => (
              <div key={attachment._id} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(attachment.originalName || attachment.filename, attachment.mimeType || '')}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {attachment.originalName || attachment.filename}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <span>Uploaded: {new Date(attachment.uploadedAt).toLocaleDateString()}</span>
                        {attachment.size && <span>• {formatFileSize(attachment.size)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewAttachment(ticket._id, attachment._id, attachment.originalName || attachment.filename)}
                      disabled={downloadingAttachments[attachment._id]}
                      className="flex items-center gap-1"
                      title="View in browser"
                    >
                      {downloadingAttachments[attachment._id] ? (
                        <FaSpinner className="animate-spin" size={12} />
                      ) : (
                        <FaEye size={12} />
                      )}
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadAttachment(ticket._id, attachment._id, attachment.originalName || attachment.filename)}
                      disabled={downloadingAttachments[attachment._id]}
                      className="flex items-center gap-1"
                      title="Download file"
                    >
                      {downloadingAttachments[attachment._id] ? (
                        <FaSpinner className="animate-spin" size={12} />
                      ) : (
                        <FaDownload size={12} />
                      )}
                      Download
                    </Button>
                    <button
                      onClick={() => deleteAttachment(ticket._id, attachment._id)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete attachment"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supporting Documents Section */}
      {ticket.supportingDocuments && ticket.supportingDocuments.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-bold text-white flex items-center gap-2">
              <FaUpload className="text-purple-400" />
              Supporting Documents ({ticket.supportingDocuments.length})
            </h5>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addMoreAttachments(ticket._id)}
              className="flex items-center gap-2"
            >
              <FaUpload size={12} />
              Add More
            </Button>
          </div>
          
          <div className="space-y-3">
            {ticket.supportingDocuments.map((doc) => (
              <div key={doc._id} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getSupportingDocIcon(doc.originalName || doc.filename)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {doc.originalName || doc.filename}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        {doc.size && <span>• {formatFileSize(doc.size)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewAttachment(ticket._id, doc._id, doc.originalName || doc.filename)}
                      disabled={downloadingAttachments[doc._id]}
                      className="flex items-center gap-1"
                      title="View in browser"
                    >
                      {downloadingAttachments[doc._id] ? (
                        <FaSpinner className="animate-spin" size={12} />
                      ) : (
                        <FaEye size={12} />
                      )}
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadAttachment(ticket._id, doc._id, doc.originalName || doc.filename)}
                      disabled={downloadingAttachments[doc._id]}
                      className="flex items-center gap-1"
                      title="Download file"
                    >
                      {downloadingAttachments[doc._id] ? (
                        <FaSpinner className="animate-spin" size={12} />
                      ) : (
                        <FaDownload size={12} />
                      )}
                      Download
                    </Button>
                    <button
                      onClick={() => deleteAttachment(ticket._id, doc._id)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete document"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!ticket.attachments || ticket.attachments.length === 0) && 
       (!ticket.supportingDocuments || ticket.supportingDocuments.length === 0) && (
        <div className="bg-white/5 p-6 rounded-lg text-center">
          <FaUpload className="text-3xl text-white/30 mx-auto mb-3" />
          <p className="text-white/60">No attachments or supporting documents</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addMoreAttachments(ticket._id)}
            className="mt-3"
          >
            <FaUpload className="mr-2" />
            Upload Files
          </Button>
        </div>
      )}
    </>
  );
};

export default TicketAttachments;