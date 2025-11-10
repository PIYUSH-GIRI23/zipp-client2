import React from 'react';
import { motion } from 'framer-motion';

// Spinner Loader
export const SpinnerLoader = ({ size = 'md', color = 'blue' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colors = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600',
    indigo: 'border-indigo-600'
  };

  return (
    <div className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`} />
  );
};

// Dots Loader
export const DotsLoader = ({ color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-600',
    white: 'bg-white',
    gray: 'bg-gray-600',
    indigo: 'bg-indigo-600'
  };

  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`h-3 w-3 rounded-full ${colors[color]}`}
          animate={{
            y: [0, -10, 0],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15
          }}
        />
      ))}
    </div>
  );
};

// Pulse Loader
export const PulseLoader = ({ text = 'Loading...', color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-600',
    white: 'bg-white',
    gray: 'bg-gray-600',
    indigo: 'bg-indigo-600'
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        className={`h-16 w-16 rounded-full ${colors[color]} opacity-75`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 0.3, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity
        }}
      />
      {text && <p className="text-gray-600 font-medium">{text}</p>}
    </div>
  );
};

// Skeleton Loader for Cards
export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="p-4 bg-gray-100">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
      </div>
      <div className="p-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
      <div className="p-3 bg-gray-50 border-t flex justify-between">
        <div className="h-8 w-8 bg-gray-300 rounded-full" />
        <div className="h-8 w-8 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};

// Full Page Loader
export const FullPageLoader = ({ text = 'Loading...', icon = '📦' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="text-center">
        <motion.div
          className="text-6xl mb-6"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {icon}
        </motion.div>
        <PulseLoader text={text} color="blue" />
      </div>
    </div>
  );
};

// Section Loader
export const SectionLoader = ({ text = 'Loading...', minHeight = '400px' }) => {
  return (
    <div className="flex items-center justify-center" style={{ minHeight }}>
      <div className="text-center">
        <DotsLoader color="blue" />
        {text && <p className="text-gray-600 mt-4 font-medium">{text}</p>}
      </div>
    </div>
  );
};

// Button Loader
export const ButtonLoader = ({ text = 'Processing...', color = 'white' }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <SpinnerLoader size="sm" color={color} />
      {text && <span>{text}</span>}
    </div>
  );
};

// Skeleton Grid for Clips
export const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

// Skeleton for Profile Details
export const SkeletonProfile = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="md:flex">
          <div className="md:shrink-0 flex items-center justify-center bg-gray-200 p-6 md:w-48">
            <div className="w-24 h-24 rounded-full bg-gray-300" />
          </div>
          <div className="p-6 md:p-8 w-full">
            <div className="h-8 bg-gray-300 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-64" />
              <div className="h-4 bg-gray-200 rounded w-48" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-white rounded-xl shadow-md" />
        <div className="h-64 bg-white rounded-xl shadow-md" />
      </div>
    </div>
  );
};

export default {
  SpinnerLoader,
  DotsLoader,
  PulseLoader,
  SkeletonCard,
  FullPageLoader,
  SectionLoader,
  ButtonLoader,
  SkeletonGrid,
  SkeletonProfile
};
