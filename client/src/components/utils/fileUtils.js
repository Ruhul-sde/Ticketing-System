import {
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaFileWord,
  FaFileExcel,
  FaFileArchive,
  FaFileContract
} from 'react-icons/fa';

export const getFileIcon = (filename, fileType = '') => {
  const extension = filename.split('.').pop().toLowerCase();
  
  if (fileType.includes('image/')) {
    return <FaFileImage className="text-green-400" />;
  } else if (fileType.includes('pdf') || extension === 'pdf') {
    return <FaFilePdf className="text-red-400" />;
  } else if (fileType.includes('word') || ['doc', 'docx'].includes(extension)) {
    return <FaFileWord className="text-blue-400" />;
  } else if (fileType.includes('excel') || ['xls', 'xlsx', 'csv'].includes(extension)) {
    return <FaFileExcel className="text-green-500" />;
  } else if (fileType.includes('zip') || ['zip', 'rar', '7z'].includes(extension)) {
    return <FaFileArchive className="text-yellow-400" />;
  } else {
    return <FaFileAlt className="text-gray-400" />;
  }
};

export const getSupportingDocIcon = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return <FaFilePdf className="text-red-400" />;
    case 'doc':
    case 'docx':
      return <FaFileWord className="text-blue-400" />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FaFileExcel className="text-green-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <FaFileImage className="text-green-400" />;
    case 'zip':
    case 'rar':
    case '7z':
      return <FaFileArchive className="text-yellow-400" />;
    default:
      return <FaFileContract className="text-purple-400" />;
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};