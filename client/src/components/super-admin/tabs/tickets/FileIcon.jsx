// tickets/FileIcon.jsx
import React from 'react';
import {
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaFileWord,
  FaFileExcel,
  FaFileArchive,
  FaFileContract
} from 'react-icons/fa';

const FileIcon = ({ type, className = "text-gray-400" }) => {
  switch (type) {
    case 'FaFileImage':
      return <FaFileImage className={`text-green-400 ${className}`} />;
    case 'FaFilePdf':
      return <FaFilePdf className={`text-red-400 ${className}`} />;
    case 'FaFileWord':
      return <FaFileWord className={`text-blue-400 ${className}`} />;
    case 'FaFileExcel':
      return <FaFileExcel className={`text-green-500 ${className}`} />;
    case 'FaFileArchive':
      return <FaFileArchive className={`text-yellow-400 ${className}`} />;
    case 'FaFileContract':
      return <FaFileContract className={`text-purple-400 ${className}`} />;
    case 'FaFileAlt':
    default:
      return <FaFileAlt className={`text-gray-400 ${className}`} />;
  }
};

export default FileIcon;