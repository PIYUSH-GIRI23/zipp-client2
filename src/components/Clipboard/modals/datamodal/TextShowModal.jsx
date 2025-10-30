import React, { useState } from "react";
import { motion } from "framer-motion";
import { logout } from "../../../../controller/manageSession";
import { MdContentCopy, MdDelete, MdCheck } from "react-icons/md";
import { deleteText } from "../../../../controller/modalController";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TextShowModal = ({ data }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [deletedIndex, setDeletedIndex] = useState(null);
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl mb-4"
          >
            📝
          </motion.div>
          <p className="text-xl font-medium">No text clips yet</p>
          <p className="text-sm mt-2">Click the + button to save your first text clip</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const deleteClip = async (id, index) => {
    try {
      const res = await deleteText(id);
      if (res?.status === 429) {
        toast.error(res.data.error);
        return;
      }
      setDeletedIndex(index);
      setTimeout(() => {
        setDeletedIndex(null);
        window.location.reload();
      }, 1500);
    } catch {
      await logout();
      navigate("/auth/login");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {[...data].reverse().map((clip, index) => (
        <motion.div
          key={clip.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div className="relative">
            {/* Card Header */}
            <div className="p-4 bg-linear-to-r from-blue-50 via-indigo-50 to-blue-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 truncate flex-1" title={clip.head}>
                  {clip.head}
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                {clip.createdAt
                  ? new Date(clip.createdAt).toLocaleString()
                  : "No timestamp"}
              </p>
            </div>

            {/* Card Body */}
            <div
              className="p-4 cursor-pointer group bg-white hover:bg-gray-50 transition-colors duration-200 relative"
              onClick={() => copyToClipboard(clip.body, index)}
            >
              <div className="text-gray-800 text-sm wrap-break-words overflow-hidden line-clamp-4 min-h-16 leading-relaxed">
                {clip.body}
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="opacity-0 group-hover:opacity-100 bg-white shadow-lg rounded-full p-2 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                  <MdContentCopy className="text-blue-600" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Card Actions */}
          <div className="p-3 bg-gray-50 border-t flex justify-between items-center">
            <div className="flex space-x-2">
              {copiedIndex === index && (
                <span className="text-green-600 text-sm font-medium flex items-center">
                  <MdCheck size={16} className="mr-1" />
                  Copied!
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(clip.body, index);
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <MdContentCopy size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteClip(clip.id, index);
                }}
                className={`p-1.5 rounded-full hover:bg-red-50 transition-colors ${
                  deletedIndex === index
                    ? "text-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                {deletedIndex === index ? (
                  <div className="animate-spin">
                    <MdCheck size={18} />
                  </div>
                ) : (
                  <MdDelete size={18} />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TextShowModal;
