import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../assets/logo.png';
import { handleGoogleRedirect, doesExists, handleLogin, handleGoogleAuth } from '../../controller/authController';

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    handleGoogleRedirect(navigate);
  }, [navigate]);

  const handleGoogleLogin = () => {
    handleGoogleAuth('login');
  };
  const [step, setStep] = useState(1); // 1: email, 2: password/pin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPinData] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const [usesPin, setUsesPin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await doesExists(email);
      if (response?.status === 200) {
        const { isUnique, isMailVerified, usesPin } = response.data;
        if (isUnique) {
          toast.error('No account found with this email address.');
        } else {
          setIsVerified(isMailVerified);
          setUsesPin(usesPin);
          setStep(2);
        }
      } else {
        toast.error(response?.data?.error || 'Failed to verify email.');
      }
    } catch {
      toast.error('Failed to verify email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinChange = (value, index) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newPin = [...pin];
    newPin[index] = value;
    setPinData(newPin);

    // Auto-focus next input
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (isVerified && usesPin) {
      const pinString = pin.join('');
      if (pinString.length !== 6) {
        toast.error('Please enter a complete 6-digit PIN.');
        return;
      }
    } else {
      if (!password.trim()) {
        toast.error('Please enter your password.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const loginData = {
        email,
        rememberMe,
        ...(isVerified && usesPin ? { pin: pin.join('') } : { password }),
      };

      const response = await handleLogin(loginData);
      if (response?.status === 200) {
        const accessToken = response?.data?.accessToken;
        const refreshToken = response?.data?.refreshToken;

        if (accessToken) {
          localStorage.setItem('zipp-accessToken', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('zipp-refreshToken', refreshToken);
        }
        navigate('/clipboard');
      } else if (response?.status === 469) {
        toast.info('Please set up your password for password login.');
        setTimeout(() => {
          navigate('/forgot-password');
        }, 1000);
      } else {
        toast.error(response?.data?.message || 'Login failed. Please try again.');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setPassword('');
    setPinData(['', '', '', '', '', '']);
    setIsVerified(false);
    setUsesPin(false);
  };

  return (
    <div className="flex flex-col w-full items-center lg:w-[60%] p-2">
      {/* Logo */}
      <div className="text-center mb-10 w-full">
        <img src={logo} alt="Logo" className="mx-auto h-10" />
        <h2 className="text-xl font-medium text-violet-700 mb-1">Welcome back</h2>
        <p className="text-sm text-violet-900">Sign in to your account</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4 w-full">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              className={`w-full px-3 py-2 border rounded-md ${
                focusedField === 'email' ? 'border-[#818cf8]' : 'border-slate-300'
              }`}
              placeholder="john.doe@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`cursor-pointer w-full py-3 px-4 rounded-md text-white ${
              isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-violet-700 hover:bg-violet-900'
            }`}
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 rounded-md p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="text-center mt-5 text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleLoginSubmit} className="space-y-4 w-full">
          <div className="mb-4">
            <button
              type="button"
              onClick={handleBackToEmail}
              className="text-sm text-blue-600 hover:text-blue-800 mb-2"
            >
              ← Back to email
            </button>
            <p className="text-sm text-slate-600">Signing in as: <strong>{email}</strong></p>
          </div>

          {(isVerified && usesPin) ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Enter your 6-digit PIN *
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
                    className="w-12 h-12 text-center text-lg font-medium border border-slate-300 rounded-md focus:border-[#818cf8] focus:outline-none"
                    inputMode="numeric"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`w-full px-3 py-2 border rounded-md ${
                    focusedField === 'password' ? 'border-[#818cf8]' : 'border-slate-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center mb-4 cursor-pointer">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 border-slate-300 rounded accent-[#818cf8]"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-700 cursor-pointer">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`cursor-pointer w-full py-3 px-4 rounded-md text-white ${
              isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-violet-700 hover:bg-violet-900'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
              Forgot your password?
            </Link>
          </div>

          <div className="text-center mt-5 text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
