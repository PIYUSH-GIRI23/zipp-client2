import { useState, useRef } from 'react';
import { logout } from '../../../controller/manageSession';
import { toast } from 'react-toastify';
import { uploadImage } from '../../../controller/modalController';
import { useNavigate } from 'react-router-dom';
import { findLimits } from '../../../utils/findLimits';

const HandleCross = (setUploadModal, setUploadModalOption) => {
  setUploadModal(false);
  setUploadModalOption(0);
};

const Imagemodal = (props) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [heading, setHeading] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imageSizeLimit = findLimits(props.accountPlan).image_size_limit;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a PNG, JPG, JPEG file.');
      return;
    }

    if (file.size > imageSizeLimit * 1024 * 1024) {
      toast.error(`File size exceeds ${imageSizeLimit}MB limit`);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image to upload');
      return;
    }

    if (!heading.trim()) {
      toast.error('Heading cannot be empty');
      return;
    }
    if (heading.length > 20) {
      toast.error('Heading cannot exceed 20 characters');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('heading', heading);

      const response = await uploadImage(formData);
 

      if (response.status === 200) {
        toast.success('Image uploaded successfully');
        HandleCross(props.setUploadModal, props.setUploadModalOption);
        window.location.reload();
        return;
      }

      if ([429, 400, 403, 404].includes(response.status)) {
        toast.error(response.data.error);
        return;
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred during image upload');
      // await logout();
      // navigate('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Image</h2>
          <button
            onClick={() => HandleCross(props.setUploadModal, props.setUploadModalOption)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* ✅ Heading input field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              maxLength={20}
              placeholder="Enter heading (max 20 chars)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {heading.length}/20
            </p>
          </div>

          {/* ✅ Image upload section */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
            }`}
            onClick={triggerFileInput}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);

              const droppedFile = e.dataTransfer.files[0];
              if (!droppedFile) return;

              const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
              if (!allowedTypes.includes(droppedFile.type)) {
                toast.error('Invalid file type. Please upload a PNG, JPG, JPEG file.');
                return;
              }

              if (droppedFile.size > imageSizeLimit * 1024 * 1024) {
                toast.error(`File size exceeds ${imageSizeLimit}MB limit`);
                return;
              }

              setSelectedFile(droppedFile);
              const reader = new FileReader();
              reader.onloadend = () => setPreview(reader.result);
              reader.readAsDataURL(droppedFile);
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".png,.jpg,.jpeg,.gif"
              className="hidden"
            />
            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 mx-auto object-contain rounded border border-gray-200"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-3 py-1 bg-white/90 rounded-full text-sm text-gray-700 shadow-md">
                    Click or drag to change
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8">
                <div className="text-4xl mb-4">📷</div>
                <p className="text-gray-500 font-medium">
                  Drop your image here or click to browse
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  PNG, JPG, JPEG, GIF up to {imageSizeLimit}MB
                </p>
              </div>
            )}
          </div>

          {/* ✅ Upload button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || !heading.trim() || isLoading}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${
              selectedFile && heading.trim() && !isLoading
                ? 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            } transition-all duration-200 transform hover:scale-[1.02]`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0
                    c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Uploading...</span>
              </>
            ) : (
              <span>Upload Image</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Imagemodal;
