import React from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import { getStatusColor, getPriorityColor } from '../../../constants/theme';
import { getFileIcon, getSupportingDocIcon, formatFileSize } from '../../../utils/fileUtils';
import {
  FaBuilding,
  FaLayerGroup,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaPaperclip,
  FaFileContract,
  FaEye as FaEyeIcon,
  FaDownload,
  FaTrash,
  FaUpload,
  FaSpinner
} from 'react-icons/fa';

const TicketDetailModal = ({
  isOpen,
  onClose,
  ticket,
  onDownload,
  onView,
  onDeleteAttachment,
  onAddMore,
  downloadingAttachments = {}
}) => {
  if (!ticket) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ticket #${ticket.ticketNumber || ticket._id?.slice(-6)}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Ticket Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-lg font-bold text-white mb-2">{ticket.title}</h4>
            <div className="text-sm text-white/70">
              Created by: {ticket.createdBy?.name || 'Unknown'}
              {ticket.createdBy?.companyName && ` • ${ticket.createdBy.companyName}`}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge color={getStatusColor(ticket.status)}>
              {ticket.status}
            </Badge>
            <Badge color={getPriorityColor(ticket.priority)}>
              {ticket.priority}
            </Badge>
            {ticket.category && (
              <Badge color="blue">{ticket.category}</Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <h5 className="font-bold text-white mb-2">Description</h5>
          <div className="bg-white/5 p-4 rounded-lg text-white/80 whitespace-pre-wrap">
            {ticket.description || 'No description provided.'}
          </div>
          {ticket.reason && (
            <div className="mt-2 text-sm text-white/60">
              <span className="font-medium">Reason:</span> {ticket.reason}
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <h6 className="font-bold text-white/70 text-sm mb-2">Company</h6>
            <div className="text-white flex items-center gap-2">
              <FaBuilding />
              {ticket.company?.name || ticket.createdBy?.companyName || 'No company'}
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <h6 className="font-bold text-white/70 text-sm mb-2">Department</h6>
            <div className="text-white flex items-center gap-2">
              <FaLayerGroup />
              {ticket.department?.name || 'No department'}
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <h6 className="font-bold text-white/70 text-sm mb-2">Created</h6>
            <div className="text-white flex items-center gap-2">
              <FaCalendarAlt />
              {new Date(ticket.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        {(ticket.attachments && ticket.attachments.length > 0) && (
          <div>
            <h5 className="font-bold text-white mb-2">Attachments ({ticket.attachments?.length || 0})</h5>
            
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
                        onClick={() => onView(ticket._id, attachment._id, attachment.originalName || attachment.filename)}
                        disabled={downloadingAttachments[attachment._id]}
                        className="flex items-center gap-1"
                        title="View in browser"
                      >
                        {downloadingAttachments[attachment._id] ? (
                          <FaSpinner className="animate-spin" size={12} />
                        ) : (
                          <FaEyeIcon size={12} />
                        )}
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(ticket._id, attachment._id, attachment.originalName || attachment.filename)}
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
                        onClick={() => onDeleteAttachment(ticket._id, attachment._id)}
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
        {(ticket.supportingDocuments && ticket.supportingDocuments.length > 0) && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-bold text-white flex items-center gap-2">
                <FaFileContract className="text-purple-400" />
                Supporting Documents ({ticket.supportingDocuments.length})
              </h5>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddMore(ticket._id)}
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
                        onClick={() => onView(ticket._id, doc._id, doc.originalName || doc.filename)}
                        disabled={downloadingAttachments[doc._id]}
                        className="flex items-center gap-1"
                        title="View in browser"
                      >
                        {downloadingAttachments[doc._id] ? (
                          <FaSpinner className="animate-spin" size={12} />
                        ) : (
                          <FaEyeIcon size={12} />
                        )}
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(ticket._id, doc._id, doc.originalName || doc.filename)}
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
                        onClick={() => onDeleteAttachment(ticket._id, doc._id)}
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

        {/* Combined Empty State */}
        {(!ticket.attachments || ticket.attachments.length === 0) && 
         (!ticket.supportingDocuments || ticket.supportingDocuments.length === 0) && (
          <div className="bg-white/5 p-6 rounded-lg text-center">
            <FaPaperclip className="text-3xl text-white/30 mx-auto mb-3" />
            <p className="text-white/60">No attachments or supporting documents</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddMore(ticket._id)}
              className="mt-3"
            >
              <FaUpload className="mr-2" />
              Upload Files
            </Button>
          </div>
        )}

        {/* Time Tracking */}
        {ticket.timeToSolve && (
          <div className="bg-white/5 p-4 rounded-lg">
            <h5 className="font-bold text-white mb-2">Time to Resolution</h5>
            <div className="text-white flex items-center gap-2">
              <FaClock />
              {Math.round(ticket.timeToSolve / 60000)} minutes
            </div>
          </div>
        )}

        {/* Solution */}
        {ticket.solution && (
          <div>
            <h5 className="font-bold text-white mb-2">Solution</h5>
            <div className="bg-white/5 p-4 rounded-lg text-white/80">
              {ticket.solution}
            </div>
          </div>
        )}

        {/* Feedback */}
        {ticket.feedback && (
          <div className="bg-white/5 p-4 rounded-lg">
            <h5 className="font-bold text-white mb-2">User Feedback</h5>
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                {ticket.feedback.rating >= 4 ? (
                  <FaCheckCircle className="text-emerald-400" />
                ) : ticket.feedback.rating >= 3 ? (
                  <FaExclamationTriangle className="text-yellow-400" />
                ) : (
                  <FaTimesCircle className="text-red-400" />
                )}
                <span className="font-medium">Rating: {ticket.feedback.rating}/5</span>
              </div>
              {ticket.feedback.comment && (
                <div className="text-white/70 text-sm mt-2 p-3 bg-black/20 rounded">
                  "{ticket.feedback.comment}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default TicketDetailModal;