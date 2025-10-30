import React from "react";
import { motion } from "framer-motion";
import { MdContentCopy } from "react-icons/md";

const FallbackModal = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10 text-gray-400">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-3"
      >
        {/* Floating Icon */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="p-4 bg-gray-700/30 rounded-full shadow-inner"
        >
          <MdContentCopy size={40} className="text-gray-300" />
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-xl font-semibold text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          No Clips Found
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-gray-400 text-sm text-center max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Save a text snippet to see it appear here.  
          You can copy, view, or delete them anytime.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default FallbackModal;
