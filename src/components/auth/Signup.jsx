import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../assets/logo.png';
import { handleGoogleRedirect, handleSignup, handleGoogleAuth } from '../../controller/authController';

const Signup = () => {
  const navigate = useNavigate();
  useEffect(() => {
    handleGoogleRedirect(navigate);
  }, [navigate]);
  const handleGoogleSignup = () => {
    handleGoogleAuth('signup');
  };
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });

    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') setPasswordMatch(value === formData.confirmPassword || formData.confirmPassword === '');
      else setPasswordMatch(value === formData.password);
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const nameRegex = /^[A-Za-z]+$/;

    if (!nameRegex.test(formData.firstName)) {
      toast.error('First name should contain only letters.');
      return false;
    }
    if (formData.lastName && !nameRegex.test(formData.lastName)) {
      toast.error('Last name should contain only letters.');
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    if (!passwordRegex.test(formData.password)) {
      toast.error('Password must be at least 8 chars with uppercase, lowercase, number & special char.');
      return false;
    }
    if (!passwordMatch) {
      toast.error('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await handleSignup(formData);
      if (res?.status === 201) {
        const accessToken = res?.data?.accessToken;
        const refreshToken = res?.data?.refreshToken;

        if (accessToken) {
          localStorage.setItem('zipp-accessToken', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('zipp-refreshToken', refreshToken);
        }
        navigate('/clipboard');
      } else toast.error(res?.data?.message || 'Signup failed. Please try again.');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Signup failed. Please try again.');
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full items-center lg:w-[60%] p-2">
      {/* Logo */}
      <div className="text-center mb-10 w-full">
        <img src={logo} alt="Logo" className="mx-auto h-10" />
        <h2 className="text-xl font-medium text-violet-700 mb-1">Create an account</h2>
        <p className="text-sm text-violet-900">Sign up to start syncing your clipboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 w-full">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
              required
              className={`w-full px-3 py-2 border rounded-md ${focusedField === 'firstName' ? 'border-[#818cf8]' : 'border-slate-300'}`}
              placeholder="John"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-3 py-2 border rounded-md ${focusedField === 'lastName' ? 'border-[#818cf8]' : 'border-slate-300'}`}
              placeholder="Doe"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            required
            className={`w-full px-3 py-2 border rounded-md ${focusedField === 'email' ? 'border-[#818cf8]' : 'border-slate-300'}`}
            placeholder="john.doe@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              required
              className={`w-full px-3 py-2 border rounded-md ${focusedField === 'password' ? 'border-[#818cf8]' : 'border-slate-300'}`}
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
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">Confirm Password *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
              required
              className={`w-full px-3 py-2 border rounded-md ${
                !passwordMatch && formData.confirmPassword
                  ? 'border-red-500'
                  : focusedField === 'confirmPassword'
                    ? 'border-[#818cf8]'
                    : 'border-slate-300'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
              tabIndex={-1}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {!passwordMatch && formData.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center mb-4 cursor-pointer">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 border-slate-300 rounded accent-[#818cf8]"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-700 cursor-pointer">
            Remember me
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`cursor-pointer w-full py-3 px-4 rounded-md text-white ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-violet-700 hover:bg-violet-900'}`}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
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
          Already have an account?{' '}
          <Link to="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
