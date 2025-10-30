import { useState } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { removeMedia } from '../../../controller/modalController.js';
import DeleteModal from '../modals/datamodal/DeleteModal.jsx';
import fallbackImage from '../../../assets/fallbackImage.png';

const MediaCard = ({ item, type }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

 const copyImageToClipboard = async (imageUrl) => {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Convert to PNG if it's not already PNG
    let finalBlob = blob;
    if (blob.type !== 'image/png') {
      const img = await createImageBitmap(blob);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Convert canvas to PNG blob
      finalBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
    }

    // Write the PNG blob to clipboard
    await navigator.clipboard.write([
      new ClipboardItem({
        [finalBlob.type]: finalBlob,
      }),
    ]);

    toast.success('Image copied to clipboard!');
  } catch (error) {
    console.error('Failed to copy image:', error);
    toast.error('Failed to copy image');
  }
};

  const handleDownloadImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(item.url, { mode: 'cors' });
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Try to extract extension from blob type
      const ext = blob.type.split('/')[1] || 'png';
      a.download = `${item.heading || 'image'}.${ext}`;

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('✅ Image downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

   const handleDownloadFile = async () => {
    try {
      setIsLoading(true);
     

      // Fetch the file from Cloudinary
      const response = await fetch(item.url, { mode: 'cors' });
      const blob = await response.blob();

      // Create a temporary blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Use originalName or fallback
      const fileName =
        item.originalName ||
        `${item.heading || 'file'}.${item.format || 'bin'}`;

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Revoke after download
      window.URL.revokeObjectURL(blobUrl);

      toast.success(`✅ ${fileName} downloaded successfully!`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('❌ Failed to download. Please try again.');
    } finally {
      setIsLoading(false);
    }
};

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      if (!item.publicId) {
        toast.error('Cannot delete: Missing public ID');
        return;
      }
      
      const response = await removeMedia(item.publicId, type);

      if (response.status === 200) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
        window.location.reload();
        return;
      }

      if ([429, 400, 403, 404].includes(response.status)) {
        toast.error(response.data.error);
        return;
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(`Failed to delete ${type}. Please try again.`);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="p-4">
        {type === 'image' && (
          <div
            className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => copyImageToClipboard(item.url)}
          >
            <img
              src={item.url}
              alt={item.heading}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />
          </div>
        )}

        {type === 'file' && (
          <div className="aspect-video flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">📄</div>
              <div className="text-sm text-gray-500 break-all px-4">{item.originalName || item.heading}</div>
              <div className="text-xs text-gray-400 mt-2">{formatSize(item.size)}</div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 truncate" title={item.heading}>
              {item.heading}
            </h3>
          </div>

          <div className="text-sm text-gray-500 mt-1">{formatDate(item.createdAt)}</div>
        </div>

        <div className="absolute top-4 right-4 flex gap-2 transition-opacity duration-200">
          {type === 'image' && (
            <>
              <button
                onClick={() => copyImageToClipboard(item.url)}
                className={`p-2 rounded-lg bg-white shadow-lg text-gray-800 hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                title="Copy Image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </button>
              <button
                onClick={handleDownloadImage}
                disabled={isLoading}
                className={`p-2 rounded-lg bg-white shadow-lg text-gray-800 hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                title="Download Image"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className={`p-2 rounded-lg bg-white shadow-lg text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-2 ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}

          {type === 'file' && (
            <>
              <button
                onClick={handleDownloadFile}
                disabled={isLoading}
                className={`p-2 rounded-lg bg-white shadow-lg text-gray-800 hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                title="Download"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className={`p-2 rounded-lg bg-white shadow-lg text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-2 ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={isDeleting}
          type={type}
          title={item.heading}
        />
      )}
    </div>
  );
};

export default MediaCard;
