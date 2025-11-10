import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import no_profile from "../../../assets/no_profile.png";
import { usernameUpdate, deleteAccount, checkUsername } from '../../../controller/authController';
import { resetClips, uploadProfilePic, removeProfilePic } from '../../../controller/modalController';
import DeleteConfirmation from './DeleteConfirmation';
import { logout, logoutAll } from '../../../controller/manageSession';
import { FaLaptop, FaMobileAlt, FaTablet, FaDesktop, FaQuestionCircle, FaClock } from 'react-icons/fa';
import { SpinnerLoader, ButtonLoader } from '../../common/Loader';

const Settings = ({ data }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(data.username || '');
  const [isUnique, setIsUnique] = useState(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profilePic, setProfilePic] = useState(data.profile || null);
  const fileInputRef = useRef(null);
  const debounceTimeout = useRef(null);

  const checkUsernameUnique = async (usernameToCheck) => {
    if (usernameToCheck === data.username || !usernameToCheck.trim()) {
      setIsUnique(null);
      setIsCheckingUsername(false);
      return;
    }
    if (/\d/.test(usernameToCheck[0])) {
      toast.error("Username cannot start with a number");
      setIsCheckingUsername(false);
      return;
    }
    if (usernameToCheck.length < 3 || usernameToCheck.length > 30) {
      toast.error("Username must be between 3 and 30 characters long");
      setIsCheckingUsername(false);
      return;
    }
    const allowedPattern = /^[a-zA-Z0-9_-]+$/;
    if (!allowedPattern.test(usernameToCheck)) {
      toast.error("Username can only contain letters, numbers, underscores, and hyphens");
      setIsCheckingUsername(false);
      return;
    }
    
    setIsCheckingUsername(true);
    try {
      const response = await checkUsername(usernameToCheck);
      if (response.status === 200) {
        setIsUnique(response.data.isUnique);
      } else if ([400, 409, 429].includes(response.status)) {
        setIsUnique(false);
        toast.error(response.data.message || "Error checking username");
      } else if (response.status === 401) {
        await logout();
        toast.error('Session expired. Please login again.');
        setTimeout(() => navigate('/auth/login'), 1000);
      }
    } catch {
      await logout();
      navigate('/auth/login');
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      checkUsernameUnique(newUsername);
    }, 500);
  };

  const handleUpdateUsername = async () => {
    if (!isUnique) return;
    try {
      if (username.length < 3 || username.length > 30) {
        toast.error("Username must be between 3 and 30 characters long");
        return;
      }
      const allowedPattern = /^[a-zA-Z0-9_-]+$/;
      if (!allowedPattern.test(username)) {
        toast.error("Username can only contain letters, numbers, underscores, and hyphens");
        return;
      }
      setIsLoading(true);
      const response = await usernameUpdate(username);
      if (response.status === 200 && response.data.success) {
        toast.success('Username updated successfully');
        window.location.reload();
      } else if (response.status === 401) {
        await logout();
        toast.error('Session expired. Please login again.');
        setTimeout(() => navigate('/auth/login'), 1000);
      } else {
        toast.error(response.data.message || response.data.error || 'Failed to update username');
      }
    } catch {
      await logout();
      navigate('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetClips = async () => {
    setIsResetting(true);
    try {
      const response = await resetClips();
      if (response.status === 200) {
        toast.success('All clips have been reset successfully');
      } else if (response.status === 401) {
        await logout();
        toast.error('Session expired. Please login again.');
        setTimeout(() => navigate('/auth/login'), 1000);
      } else {
        toast.error(response.data.message || response.data.error || 'Failed to reset clips');
      }
    } catch {
      toast.error('Failed to reset clips. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteAccount = async (password) => {
    setIsLoading(true);
    try {
      const response = await deleteAccount(password);
      if (response.status === 200 && response.data.success) {
        toast.success('Account deleted successfully');
        await logout();
        setTimeout(() => navigate('/auth/login'), 1000);
        return true;
      } else if (response.status === 401) {
        toast.error('Incorrect password');
        return false;
      } else if (response.status === 469) {
        toast.info('Please set up your password for password login.');
        setTimeout(() => navigate('/forgot-password'), 1000);
      } else {
        toast.error(response.data.message || response.data.error || 'Failed to delete account');
        return false;
      }
    } catch {
      await logout();
      navigate('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePicUpdate = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('profilePic', file);
      const response = await uploadProfilePic(formData);
      if (response.status === 200) {
        const reader = new FileReader();
        reader.onload = (event) => setProfilePic(event.target?.result);
        reader.readAsDataURL(file);
        toast.success('Profile picture updated successfully');
      } else {
        toast.error(response.data.message || 'Failed to update profile picture');
      }
    } catch {
      toast.error('Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProfilePic = async () => {
    try {
      setIsLoading(true);
      const response = await removeProfilePic();
      if (response.status === 200) {
        setProfilePic(null);
        toast.success('Profile picture removed successfully');
      } else {
        toast.error(response.data.message || 'Failed to remove profile picture');
      }
    } catch {
      toast.error('Failed to remove profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAll();
      toast.success('Logged out from all devices successfully');
      setTimeout(() => navigate('/auth/login'), 1000);
    } catch {
      toast.error('Failed to logout from all devices. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    return () => debounceTimeout.current && clearTimeout(debounceTimeout.current);
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

        {/* Profile Picture */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm">
              <img src={profilePic || no_profile} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleProfilePicUpdate} disabled={isLoading}
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isLoading ? <ButtonLoader text="Updating..." color="white" /> : 'Update Photo'}
              </button>
              {profilePic && (
                <button onClick={handleRemoveProfilePic} disabled={isLoading}
                  className={`px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isLoading ? <ButtonLoader text="Removing..." color="gray" /> : 'Remove'}
                </button>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Username</h3>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Username"
                />
                {isCheckingUsername && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <SpinnerLoader size="sm" color="blue" />
                  </div>
                )}
              </div>
              <button
                onClick={handleUpdateUsername}
                disabled={!isUnique || isLoading || username === data.username || isCheckingUsername}
                className={`px-4 py-2 rounded text-white ${
                  isUnique && username !== data.username && !isCheckingUsername
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}>
                {isLoading ? <ButtonLoader text="Updating..." color="white" /> : 'Update'}
              </button>
            </div>
            {username !== data.username && username.trim() && !isCheckingUsername && (
              <p className={`text-sm ${isUnique ? 'text-green-600' : 'text-red-600'}`}>
                {isUnique ? '✓ Username is available' : '✗ Username is already taken'}
              </p>
            )}
            {isCheckingUsername && (
              <p className="text-sm text-gray-500">Checking availability...</p>
            )}
          </div>
        </div>

        {/* Active Sessions */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
          <div className="bg-gray-50 border rounded-md p-3 max-h-56 overflow-y-auto">
            {data.history && data.history.length ? (
              data.history.map((device, i) => {
                const browser = device.data[1] || 'Unknown';
                const os = device.data[3] || 'Unknown';
                const deviceType = device.data[5] || 'Unknown';
                const timestamp = device.data[7] || Date.now();
                const date = new Date(timestamp);
                const DeviceIcon =
                  deviceType.toLowerCase().includes('mobile') || os.toLowerCase().includes('android') || os.toLowerCase().includes('ios')
                    ? FaMobileAlt
                    : deviceType.toLowerCase().includes('tablet')
                    ? FaTablet
                    : os.toLowerCase().includes('windows') || os.toLowerCase().includes('mac') || os.toLowerCase().includes('linux')
                    ? FaDesktop
                    : FaQuestionCircle;

                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-white rounded shadow-sm">
                    <div className="flex items-center space-x-3">
                      <DeviceIcon className="text-gray-600 text-xl" />
                      <div>
                        <p className="font-medium">{browser} on {os}</p>
                        <p className="text-xs text-gray-500">{device.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <FaClock className="mr-1" />
                      <div>
                        <p>{date.toLocaleDateString()}</p>
                        <p>{date.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-4">No active sessions found</p>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-red-200 rounded-md p-4 bg-red-50">
          <h3 className="text-lg font-medium text-red-800 mb-4">Danger Zone</h3>

          <div className="mb-4 py-3 border-b border-red-200">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <div>
                <h4 className="font-medium">Logout from All Devices</h4>
                <p className="text-sm text-gray-600">This will log you out from all devices.</p>
              </div>
              <button
                onClick={handleLogoutAllDevices}
                disabled={isLoggingOut}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
                {isLoggingOut ? <ButtonLoader text="Logging out..." color="white" /> : 'Logout All Devices'}
              </button>
            </div>
          </div>

          <div className="mb-4 py-3 border-b border-red-200">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <div>
                <h4 className="font-medium">Reset All Clips</h4>
                <p className="text-sm text-gray-600">This will delete all your saved clips permanently.</p>
              </div>
              <button
                onClick={handleResetClips}
                disabled={isResetting}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
                {isResetting ? <ButtonLoader text="Resetting..." color="white" /> : 'Reset All Clips'}
              </button>
            </div>
          </div>

          <div className="py-3">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-gray-600">This will permanently delete your account.</p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <DeleteConfirmation
            onConfirm={handleDeleteAccount}
            onCancel={() => setShowDeleteModal(false)}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;
  