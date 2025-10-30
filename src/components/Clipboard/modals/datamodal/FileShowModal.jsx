import React from "react";
import MediaCard from "../../components/MediaCard";

const FileShowModal = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-6xl mb-4">📁</div>
          <p className="text-xl font-medium">No files yet</p>
          <p className="text-sm mt-2">Click the + button to add your first file</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {[...data].reverse().map((file) => (
        <MediaCard key={file.id} item={file} type="file" />
      ))}
    </div>
  );
};

export default FileShowModal;
