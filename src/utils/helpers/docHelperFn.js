export const getFileType = (doc) => {
  if (!doc?.fileType) return 'unknown';
  const mime = doc.fileType.toLowerCase();
  if (mime === 'application/pdf') return 'pdf';
  if (mime.startsWith('image/')) return 'image';
  return 'unknown';
};

export const getPreviewImage = (doc) => {
  const type = getFileType(doc);
  if (type === 'image') return doc.fileUrl;
  if (type === 'pdf') return doc.fileUrl.replace('.pdf', '.gif');
  return '/file-image.png';
};

export const formatFileSize = (size) => {
  if (!size) return '-';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};
