// tickets/utils/fileHelpers.js
// This is a pure JavaScript utility file - NO JSX here!

// Return icon component names as strings or component references
export const getFileIconType = (filename, fileType = '') => {
  const extension = filename.split('.').pop().toLowerCase();
  
  if (fileType.includes('image/')) {
    return 'FaFileImage';
  } else if (fileType.includes('pdf') || extension === 'pdf') {
    return 'FaFilePdf';
  } else if (fileType.includes('word') || ['doc', 'docx'].includes(extension)) {
    return 'FaFileWord';
  } else if (fileType.includes('excel') || ['xls', 'xlsx', 'csv'].includes(extension)) {
    return 'FaFileExcel';
  } else if (fileType.includes('zip') || ['zip', 'rar', '7z'].includes(extension)) {
    return 'FaFileArchive';
  } else {
    return 'FaFileAlt';
  }
};

export const getSupportingDocIconType = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'FaFilePdf';
    case 'doc':
    case 'docx':
      return 'FaFileWord';
    case 'xls':
    case 'xlsx':
    case 'csv':
      return 'FaFileExcel';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'FaFileImage';
    case 'zip':
    case 'rar':
    case '7z':
      return 'FaFileArchive';
    default:
      return 'FaFileContract';
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};