import React from 'react';
import { FaUpload, FaTrash } from 'react-icons/fa';
import Button from './Button';
import { getFileIcon, formatFileSize } from '../utils/fileUtils';

const FileUpload = ({
  onFileSelect,
  attachments = [],
  onRemove,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedFileTypes = '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.zip,.rar',
  multiple = true,
  label = 'Attachments (Optional)'
}) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onFileSelect(files);
    e.target.value = ''; // Reset file input
  };

  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-2">
        {label}
      </label>
      <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center hover:border-[#ED1B2F]/50 transition-colors">
        <input
          type="file"
          id="file-upload"
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          accept={acceptedFileTypes}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center gap-2">
            <FaUpload className="text-3xl text-white/50" />
            <p className="text-white/70">Click to upload files or drag and drop</p>
            <p className="text-xs text-white/40">Images, documents, and archives up to 10MB</p>
          </div>
        </label>
      </div>

      {attachments.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-white/70">Selected files ({attachments.length}):</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(attachment.name, attachment.type)}
                  <div>
                    <p className="text-white text-sm truncate max-w-xs">{attachment.name}</p>
                    <p className="text-xs text-white/40">{formatFileSize(attachment.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(attachment.id)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;