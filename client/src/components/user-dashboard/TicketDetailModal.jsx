// components/user-dashboard/TicketDetailModal.jsx
import React, { useState } from 'react';
import { 
  XMarkIcon, 
  ClockIcon, 
  UserIcon, 
  BuildingOfficeIcon, 
  TagIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const TicketDetailModal = ({ ticket, onClose }) => {
  const { user } = useAuth();
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: ticket.feedback?.rating || 0,
    comment: ticket.feedback?.comment || ''
  });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(!!ticket.feedback);

  const statusColors = {
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    assigned: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    closed: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  };

  const priorityColors = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const handleStarClick = (rating) => {
    if (!feedbackSubmitted && ticket.status === 'resolved') {
      setFeedback(prev => ({ ...prev, rating }));
    }
  };

  const submitFeedback = async () => {
    if (!feedback.rating || feedback.rating < 1) {
      alert('Please select a rating (1-5 stars)');
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const response = await axios.post(`/tickets/${ticket._id}/feedback`, {
        rating: feedback.rating,
        comment: feedback.comment.trim() || undefined
      });

      setFeedbackSubmitted(true);
      setShowFeedbackForm(false);
      alert('✅ Thank you for your feedback!');
      
      // Refresh ticket data if needed
      if (onClose) {
        // You might want to pass updated ticket back to parent
        // or trigger a refresh
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert(`❌ Failed to submit feedback: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const canGiveFeedback = ticket.status === 'resolved' && !feedbackSubmitted;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
      <div className="absolute inset-0 bg-[#0a0c14]/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Gradient Header */}
        <div className="h-2 bg-gradient-to-r from-[#ED1B2F] to-[#455185]" />
        
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4">{ticket.title}</h2>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${statusColors[ticket.status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                  {ticket.status?.toUpperCase()}
                </span>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${priorityColors[ticket.priority] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                  {ticket.priority?.toUpperCase()} PRIORITY
                </span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-white/80 border border-white/10">
                  #{ticket.ticketNumber || ticket._id?.slice(-8)}
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors ml-4"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Ticket Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <BuildingOfficeIcon className="w-5 h-5 text-[#455185]" />
                <span className="text-sm font-bold text-white/60">Department</span>
              </div>
              <p className="text-white font-medium">{ticket.department?.name || 'Not assigned'}</p>
            </div>
            
            <div className="bg-white/5 p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <UserIcon className="w-5 h-5 text-[#455185]" />
                <span className="text-sm font-bold text-white/60">Assigned To</span>
              </div>
              <p className="text-white font-medium">
                {ticket.assignedTo?.name || 'Not assigned yet'}
              </p>
            </div>
            
            <div className="bg-white/5 p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <ClockIcon className="w-5 h-5 text-[#455185]" />
                <span className="text-sm font-bold text-white/60">Created</span>
              </div>
              <p className="text-white font-medium">
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Description</h3>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-white/90 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>

          {/* Category */}
          {ticket.category && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <TagIcon className="w-5 h-5 text-[#455185]" />
                <h3 className="text-lg font-bold text-white">Category</h3>
              </div>
              <div className="inline-block bg-[#455185]/20 text-[#455185] px-4 py-2 rounded-xl font-medium">
                {ticket.category}
              </div>
            </div>
          )}

          {/* Feedback Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Your Feedback</h3>
              {!feedbackSubmitted && ticket.status === 'resolved' && (
                <button
                  onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                  className="px-4 py-2 bg-gradient-to-r from-[#ED1B2F] to-[#b01423] rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity"
                >
                  {showFeedbackForm ? 'Cancel Feedback' : 'Give Feedback'}
                </button>
              )}
            </div>

            {feedbackSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <StarIconSolid className="w-6 h-6 text-emerald-400" />
                  <span className="text-lg font-bold text-emerald-400">
                    {feedback.rating}/5 Stars
                  </span>
                </div>
                {feedback.comment && (
                  <div className="mt-3">
                    <p className="text-sm text-white/60 mb-1">Your comment:</p>
                    <p className="text-white/90 bg-white/5 p-3 rounded-lg">{feedback.comment}</p>
                  </div>
                )}
                <p className="text-sm text-emerald-400/80 mt-3">
                  Thank you for your feedback! Your input helps us improve our service.
                </p>
              </div>
            ) : showFeedbackForm && canGiveFeedback ? (
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <h4 className="text-white font-bold mb-4">How would you rate your support experience?</h4>
                
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className="p-1 hover:scale-110 transition-transform"
                      disabled={feedbackSubmitted}
                    >
                      {star <= feedback.rating ? (
                        <StarIconSolid className="w-8 h-8 text-yellow-400" />
                      ) : (
                        <StarIcon className="w-8 h-8 text-white/40" />
                      )}
                    </button>
                  ))}
                  <span className="ml-3 text-lg font-bold text-white">
                    {feedback.rating}/5
                  </span>
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-white/60 mb-2">
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    value={feedback.comment}
                    onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Tell us more about your experience..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#455185] transition-colors"
                    rows="4"
                    disabled={feedbackSubmitted}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    onClick={submitFeedback}
                    disabled={isSubmittingFeedback || feedback.rating === 0}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingFeedback ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      'Submit Feedback'
                    )}
                  </button>
                  <button
                    onClick={() => setShowFeedbackForm(false)}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-white hover:bg-white/10 transition-colors"
                    disabled={isSubmittingFeedback}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : ticket.status === 'resolved' && !feedbackSubmitted ? (
              <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-amber-400" />
                  <span className="text-lg font-bold text-amber-400">We Value Your Feedback</span>
                </div>
                <p className="text-white/80 mb-4">
                  Your ticket has been resolved! Please take a moment to rate your experience 
                  and help us improve our service quality.
                </p>
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl font-bold text-white hover:opacity-90 transition-opacity"
                >
                  Give Feedback Now
                </button>
              </div>
            ) : ticket.status !== 'resolved' ? (
              <div className="bg-slate-500/10 border border-slate-500/30 p-6 rounded-2xl">
                <p className="text-white/60">
                  Feedback option will be available once your ticket is resolved.
                </p>
              </div>
            ) : null}
          </div>

          {/* Remarks/Updates */}
          {ticket.remarks?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Updates & Remarks</h3>
              <div className="space-y-4">
                {ticket.remarks.map((remark, index) => (
                  <div key={index} className="bg-white/5 p-5 rounded-2xl border-l-4 border-[#455185]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#455185]/30 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-[#455185]" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{remark.addedBy?.name || 'Support Agent'}</p>
                          <p className="text-xs text-white/60">{remark.role || 'Support Team'}</p>
                        </div>
                      </div>
                      <span className="text-xs text-white/40">
                        {new Date(remark.addedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-white/90">{remark.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {ticket.attachments?.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Attachments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ticket.attachments.map((attachment, index) => (
                  <div key={index} className="bg-white/5 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PaperClipIcon className="w-5 h-5 text-[#455185]" />
                      <div className="min-w-0">
                        <p className="text-white truncate">{attachment.filename || attachment.name}</p>
                        <p className="text-xs text-white/40">
                          {new Date(attachment.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <a 
                      href={attachment.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#455185] hover:text-[#ED1B2F] font-medium text-sm whitespace-nowrap"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;