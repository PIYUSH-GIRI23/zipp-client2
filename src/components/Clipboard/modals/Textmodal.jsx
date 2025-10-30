import { useState } from 'react';
import { logout } from '../../../controller/manageSession';
import { toast } from 'react-toastify';
import { handleTextSave } from '../../../controller/modalController';
import { useNavigate } from 'react-router-dom';
import { findLimits } from '../../../utils/findLimits';

const HandleCross = (setUploadModal, setUploadModalOption) => {
  setUploadModal(false);
  setUploadModalOption(0);
};

const Textmodal = (props) => {
  const text_char_limit = findLimits(props.accountPlan).text_character_limit;
  const navigate = useNavigate();
  const [charCount, setCharCount] = useState(text_char_limit);
  const [data, setData] = useState({ body: '', head: '' });

  const handleSave = async () => {
    if (charCount === text_char_limit) return toast.error('Text body cannot be empty');
    if (charCount < 0) return toast.error('Text body exceeds maximum character limit');
    if (data.head.trim() === '') return toast.error('Heading cannot be empty');
    if (data.body.trim() === '') return toast.error('Text body cannot be empty');
    if (data.head.length > 100) return toast.error('Heading exceeds maximum character limit');

    try {
      const response = await handleTextSave(data);
     
      if (response.status === 200) {
        HandleCross(props.setUploadModal, props.setUploadModalOption);
        window.location.reload();
        return;
      }
      if ([429, 400, 403].includes(response.status)) {
        toast.error(response.data.error);
        return;
      }
    } catch {
      await logout();
      navigate('/auth/login');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[600px] relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Text Note</h2>
          <button
            onClick={() => HandleCross(props.setUploadModal, props.setUploadModalOption)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* ✅ Heading input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter heading..."
              maxLength={100}
              onChange={(e) => setData({ ...data, head: e.target.value })}
              rows={2}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {100 - (data.head?.length || 0)} characters remaining
            </p>
          </div>

          {/* ✅ Content input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full h-64 border border-gray-300 rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              maxLength={text_char_limit}
              placeholder="Type or paste your text here..."
              onChange={(e) => {
                setCharCount(text_char_limit - e.target.value.length);
                setData({ ...data, body: e.target.value });
              }}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {charCount} characters remaining
            </p>
          </div>

          {/* ✅ Save button */}
          <button
            onClick={handleSave}
            disabled={!data.body.trim() || !data.head.trim()}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${
              data.body.trim() && data.head.trim()
                ? 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            } transition-all duration-200 transform hover:scale-[1.02]`}
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default Textmodal;
