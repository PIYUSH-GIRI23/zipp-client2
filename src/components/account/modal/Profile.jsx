import React from 'react';
import { FaUser, FaCalendarAlt, FaCheck, FaTimes, FaCrown, FaMobileAlt, FaTablet, FaDesktop, FaLaptop } from 'react-icons/fa';
import { MdVerified, MdEmail, MdDateRange, MdStars, MdHistory } from 'react-icons/md';


const Profile  = ({ data, setWhichOption }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? '-' : date.toLocaleString();
  };
  
  const formatDateOnly = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval === 1 ? `${interval} month ago` : `${interval} months ago`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? `${interval} day ago` : `${interval} days ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? `${interval} hour ago` : `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? `${interval} minute ago` : `${interval} minutes ago`;
    }
    
    return seconds < 10 ? 'just now' : `${seconds} seconds ago`;
  };
  
  const getPlanName = (planId) => {
    switch (planId) {
      case 1:
        return 'Basic';
      case 2:
        return 'Pro';
      case 3:
        return 'Premium';
      default:
        return 'Basic';
    }
  };
  
  const getPlanColor = (planId) => {
    switch (planId) {
      case 1:
        return 'bg-gray-100 text-gray-800';
      case 2:
        return 'bg-blue-100 text-blue-800';
      case 3:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPlanFeatures = (planId) => {
    switch (planId) {
      case 1:
        return [
          'Basic clipboard functionality',
          'Limited text clips storage',
          'Character limit per text clip',
          'Basic device sync'
        ];
      case 2:
        return [
          'Up to 1000 text clips',
          'Up to 100 image clips',
          'Up to 20 file clips',
          '10,000 characters per text clip',
          'Image size limit: 20MB',
          'File size limit: 50MB',
          '24/7 support'
        ];
      case 3:
        return [
          'Up to 2000 text clips',
          'Up to 500 image clips',
          'Up to 100 file clips',
          '10,000 characters per text clip',
          'Image size limit: 50MB',
          'File size limit: 100MB',
          '24/7 support',
          'AI assistant (coming soon)'
        ];
      default:
        return [
          'Basic clipboard functionality',
          'Limited text clips storage',
          'Text clips only'
        ];
    }
  };
  
  const getLatestDevices = () => {
    if (!data.history || data.history.length === 0) return [];
    
    // Sort by timestamp (newest first) and take up to 3
    return [...data.history]
      .sort((a, b) => (b.data[7] || 0) - (a.data[7] || 0))
      .slice(0, 3);
  };
  
  const getDeviceIcon = (device) => {
    const deviceType = device.data[5]?.toLowerCase() || '';
    const os = device.data[3]?.toLowerCase() || '';
    
    if (deviceType.includes('mobile') || os.includes('android') || os.includes('ios')) {
      return <FaMobileAlt className="text-gray-600" />;
    } else if (deviceType.includes('tablet')) {
      return <FaTablet className="text-gray-600" />;
    } else if (os.includes('windows') || os.includes('mac') || os.includes('linux')) {
      return <FaDesktop className="text-gray-600" />;
    } else {
      return <FaLaptop className="text-gray-600" />;
    }
  };
  
  const onVerifyEmail = () => {
    setWhichOption(5); // parent should handle: setWhichOption(5)
  };
  
  const latestDevices = getLatestDevices();
  const memberSince = formatDateOnly(data.dateOfJoining || 0);
  const membershipDuration = data.dateOfJoining 
    ? Math.floor((Date.now() - data.dateOfJoining) / (1000 * 60 * 60 * 24 * 30)) 
    : 0;
  const planName = getPlanName(data.accountPlan);
  const planFeatures = getPlanFeatures(data.accountPlan);
  const planColor = getPlanColor(data.accountPlan);
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with user summary */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="md:flex">
            <div className="md:shrink-0 flex items-center justify-center bg-linear-to-r from-blue-500 to-indigo-600 p-6 md:w-48">
              <div className="relative w-24 h-24">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl text-indigo-500 font-bold shadow-inner">
                  {data.profile ? (
                    <img 
                      src={data.profile} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.src = ''; // Clear the src to show initials
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 w-full h-full rounded-full flex items-center justify-center ${data.profile ? 'bg-black bg-opacity-40' : ''}`}>
                    <span className={`${data.profile ? 'text-white' : 'text-indigo-500'}`}>
                      {(data.firstName?.[0] || '') + (data.lastName?.[0] || '')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8 w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    {data.firstName} {data.lastName}
                    {data.isMailVerified && (
                      <MdVerified className="ml-2 text-blue-500" title="Verified Account" />
                    )}
                  </h1>
                  <p className="text-gray-600">@{data.username}</p>
                </div>
                
                {/* Plan Badge */}
                <div className={`${planColor} px-3 py-1 rounded-full text-sm font-semibold flex items-center`}>
                  <FaCrown className="mr-1" />
                  {planName} {data.accountPlan !== 1 && 'Plan'}
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center">
                  <MdEmail className="text-gray-500 mr-1" />
                  <span className="text-gray-700">{data.email}</span>
                </div>
                
                <div className="flex items-center">
                  <MdDateRange className="text-gray-500 mr-1" />
                  <span className="text-gray-700">Member since {memberSince}</span>
                </div>
                
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-500 mr-1" />
                  <span className="text-gray-700">{membershipDuration} months</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Profile Details */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <FaUser className="mr-2" /> Profile Details
            </h2>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                {/* First Name */}
                <div className="p-4">
                  <span className="text-gray-500 text-sm">First Name</span>
                  <p className="font-semibold text-gray-900">{data.firstName || '-'}</p>
                </div>
                
                {/* Last Name */}
                <div className="p-4">
                  <span className="text-gray-500 text-sm">Last Name</span>
                  <p className="font-semibold text-gray-900">{data.lastName || '-'}</p>
                </div>
                
                {/* Email + Verify */}
                <div className="p-4">
                  <div>
                  <span className="text-gray-500 text-sm mr-2">Email</span>
                    {data.isMailVerified ? (
                    <div className="inline-flex items-center bg-green-100 px-2 py-1 rounded-full">
                      <FaCheck className="w-3 h-3 text-green-600" />
                    </div>
                    ) : (
                    <button
                      onClick={onVerifyEmail}
                      className="inline-flex items-center px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md"
                    >
                      Verify
                    </button>
                    )}
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-semibold text-gray-900">{data.email || '-'}</p>
                  </div>
                  </div>
                </div>
                
                {/* Username */}
                <div className="p-4">
                  <span className="text-gray-500 text-sm">Username</span>
                  <p className="font-semibold text-gray-900">@{data.username || '-'}</p>
                </div>
                
                {/* PIN Status */}
                <div className="p-4">
                  <span className="text-gray-500 text-sm">PIN Protection</span>
                  <div className="flex items-center mt-1">
                    {data.usesPin ? (
                      <>
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm flex items-center">
                          <FaCheck className="mr-1" /> Enabled
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm flex items-center">
                          <FaTimes className="mr-1" /> Disabled
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Last Login */}
                <div className="p-4">
                  <span className="text-gray-500 text-sm">Last Login</span>
                  <p className="font-semibold text-gray-900">
                    {formatDate(data.lastLogin)}
                    <span className="block text-xs text-gray-500 mt-1">
                      ({getTimeAgo(data.lastLogin)})
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            {latestDevices.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <MdHistory className="mr-2" /> Recent Devices
                </h2>
                
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {latestDevices.map((device, index) => {
                      const browser = device.data[1] || 'Unknown';
                      const os = device.data[3] || 'Unknown';
                      const timestamp = device.data[7] || 0;
                      
                      return (
                        <div key={index} className="p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-xl mr-3">
                              {getDeviceIcon(device)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{browser} on {os}</p>
                              <p className="text-sm text-gray-500">{device.ip}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-700">{formatDate(timestamp)}</p>
                            <p className="text-xs text-gray-500">{getTimeAgo(timestamp)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right column - Plan Details */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <MdStars className="mr-2" /> Plan Details
            </h2>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className={`${planColor.replace('bg-', 'bg-opacity-20 bg-')} px-4 py-3 border-b border-gray-200`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{planName}</h3>
                  {data.accountPlan === 0 && (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Upgrade
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="font-medium text-gray-800 mb-2">Features</h4>
                <ul className="space-y-2">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-2 shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {data.accountPlan !== undefined && data.accountPlan < 2 && (
                  <div className="mt-4 text-center">
                    <button 
                      onClick={() => setWhichOption(2)} // This will navigate to Boost component
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                      {data.accountPlan === 1 ? 'Upgrade to Pro/Premium' : 'Upgrade to Premium'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Usage Summary */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold">Usage Summary</h3>
              </div>
              
              <div className="p-4 space-y-3">
                {/* Show clip limits based on plan */}
                {data.accountPlan === 1 ? (
                  <p className="text-sm text-center text-gray-600">
                  View detailed usage statistics in the <span className="font-medium">Plan & Usage</span> section.
                  </p>
                ) : (
                  <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Text Clips</span>
                    <span className="text-sm font-medium">
                    {data.accountPlan === 2 ? '1000 max' : '2000 max'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Image Clips</span>
                    <span className="text-sm font-medium">
                    {data.accountPlan === 2 ? '100 max' : '500 max'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">File Clips</span>
                    <span className="text-sm font-medium">
                    {data.accountPlan === 2 ? '20 max' : '100 max'}
                    </span>
                  </div>
                  </>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  {data.accountPlan !== 1 && (
                    <button 
                      onClick={() => setWhichOption(2)} 
                      className="cursor-pointer w-full text-center text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      View detailed usage →
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Account Stats */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold">Account Stats</h3>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account Age</span>
                  <span className="text-sm font-medium">{membershipDuration} months</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Devices</span>
                  <span className="text-sm font-medium">{data.history?.length || 0}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Activity</span>
                  <span className="text-sm font-medium">{getTimeAgo(data.lastLogin)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profile Updated</span>
                  <span className="text-sm font-medium">{getTimeAgo(data.lastUpdated)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
