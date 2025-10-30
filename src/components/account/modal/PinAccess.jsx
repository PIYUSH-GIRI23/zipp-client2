import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../../../controller/manageSession';
import { setPin, resetPin } from '../../../controller/authController';

const PinAccess = ({ data, setWhichOption }) => {
  const navigate = useNavigate();
  const [pin, setPinData] = useState(['', '', '', '', '', '']); // 6-digit PIN
  const [password, setPassword] = useState('');
  const [usePin, setUsePin] = useState(data.usesPin || false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    setUsePin(data.usesPin || false);
  }, [data.usesPin]);

  const handlePinChange = (value, index) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPinData(newPin);

    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePinKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePinAccess = () => {
    setUsePin(!usePin);
    setPinData(['', '', '', '', '', '']);
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usePin) {
      const pinString = pin.join('');
      if (pinString.length !== 6) {
        toast.error('PIN must be 6 digits');
        return;
      }

      if (!password) {
        toast.error('Password is required to set a PIN');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (usePin) {
        await setUserPin();
      } else {
        await resetUserPin();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserPin = async () => {
    try {
      const response = await resetPin();
      if (response.status === 200) {
        toast.success('PIN access disabled successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(response.data.error);
      }
    } catch {
      await logout();
      toast.error('Session expired. Please login again.');
      setTimeout(() => {
        navigate('/auth/login');
      }, 1000);
    }
  };

  const setUserPin = async () => {
    try {
      const pinString = pin.join('');
      const response = await setPin(pinString, password);
      if (response.status === 200) {
        toast.success('PIN set successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (response.status === 469) {
        toast.info('Please set up your password for password login.');
        setTimeout(() => {
          navigate('/forgot-password');
        }, 1000);
      } else {
        toast.error(response.data.error || response.data.message);
      }
    } catch {
      await logout();
      toast.error('Session expired. Please login again.');
      setTimeout(() => {
        navigate('/auth/login');
      }, 1000);
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl shadow-md p-6">
        {data.isMailVerified ? (
          <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">PIN Access</h2>
              <p className="text-sm text-gray-600 mt-1">
                Configure PIN-based access for quick logins on trusted devices.
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">PIN Access</p>
                <p className="text-sm text-gray-500">
                  {usePin
                    ? 'PIN access is enabled. You can login using your PIN.'
                    : 'PIN access is disabled. Enable to set up a PIN for quick login.'}
                </p>
              </div>
              <button
                onClick={togglePinAccess}
                className={`relative cursor-pointer inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  usePin ? 'bg-green-500' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={usePin}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    usePin ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* PIN Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {usePin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    PIN (6 digits)*
                  </label>
                  <div className="flex justify-center space-x-2 mb-4">
                    {pin.map((digit, index) => (
                      <input
                        key={index}
                        id={`pin-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handlePinChange(e.target.value, index)}
                        onKeyDown={(e) => handlePinKeyDown(e, index)}
                        className="w-14 h-14 text-center text-2xl font-medium border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                        inputMode="numeric"
                      />
                    ))}
                  </div>
                </div>
              )}

              {usePin && (
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your password"
                      className={`w-full px-3 py-2 border rounded-md ${
                        focusedField === 'password'
                          ? 'border-indigo-500'
                          : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              )}

              {(usePin || data.usesPin) && (
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      (usePin && (pin.some((d) => d === '') || !password))
                    }
                    className={`w-full cursor-pointer py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                  >
                    {isLoading
                      ? 'Processing...'
                      : usePin
                      ? 'Update PIN'
                      : 'Disable PIN Access'}
                  </button>
                </div>
              )}

              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>

            <div className="pt-2 text-xs text-gray-500">
              <p>
                Note: PIN-based login is a convenient but less secure method.
                Use it only on trusted devices.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="text-red-600 text-5xl mb-4">!</div>
            <h1 className="text-2xl font-bold mb-4 text-red-600">
              Email Not Verified
            </h1>
            <p className="text-gray-700 text-center mb-4">
              Please verify your email to enable PIN access and other account
              features.
            </p>
            <button
              onClick={() => setWhichOption(5)}
              className="cursor-pointer px-6 py-3 bg-violet-700 hover:bg-violet-800 text-white rounded-md shadow"
            >
              Verify Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PinAccess;

