import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../assets/logo.png';
import { handleGoogleRedirect, handleSignup, handleGoogleAuth, sendSignupOtp, verifySignupOtp } from '../../controller/authController';

const Signup = () => {
  const navigate = useNavigate();
  useEffect(() => {
    handleGoogleRedirect(navigate);
  }, [navigate]);

  const handleGoogleSignup = () => {
    handleGoogleAuth('signup');
  };

  const [step, setStep] = useState(1); // 1: form input, 2: OTP verification
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });

  const [emailMatch, setEmailMatch] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      toast.info("OTP expired. Please request a new code.");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'email' || name === 'confirmEmail') {
        if (name === 'email') setEmailMatch(value === updated.confirmEmail || updated.confirmEmail === '');
        else setEmailMatch(value === updated.email);
      }
      if (name === 'password' || name === 'confirmPassword') {
        if (name === 'password') setPasswordMatch(value === updated.confirmPassword || updated.confirmPassword === '');
        else setPasswordMatch(value === updated.password);
      }
      return updated;
    });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const nameRegex = /^[A-Za-z]+$/;

    if (!nameRegex.test(formData.firstName.trim())) {
      toast.error('First name should contain only letters.');
      return false;
    }
    if (formData.lastName.trim() && !nameRegex.test(formData.lastName.trim())) {
      toast.error('Last name should contain only letters.');
      return false;
    }
    if (!emailRegex.test(formData.email.trim())) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    if (!formData.confirmEmail.trim() || formData.email.trim().toLowerCase() !== formData.confirmEmail.trim().toLowerCase()) {
      toast.error('Email addresses do not match.');
      return false;
    }
    if (!passwordRegex.test(formData.password)) {
      toast.error('Password must be at least 8 chars with uppercase, lowercase, number & special char.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSendOtpSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await sendSignupOtp(formData.email.trim(), formData.confirmEmail.trim());
      if (res?.status === 200 && res?.data?.success) {
        toast.success("Verification code sent to your email!");
        setStep(2);
        setTimer(120);
        setTimerActive(true);
      } else {
        toast.error(res?.data?.message || res?.data?.error || "Failed to send verification code");
      }
    } catch (error) {
      toast.error("Error sending verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    } else if (value && index === 5) {
      const otpString = newOtp.join('');
      if (otpString.length === 6 && !newOtp.includes('')) {
        handleVerifyAndSignup(otpString);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (timerActive) return;
    setIsLoading(true);
    try {
      const res = await sendSignupOtp(formData.email.trim(), formData.confirmEmail.trim());
      if (res?.status === 200 && res?.data?.success) {
        toast.success("New verification code sent!");
        setTimer(120);
        setTimerActive(true);
        setOtp(['', '', '', '', '', '']);
      } else {
        toast.error(res?.data?.message || "Failed to resend verification code");
      }
    } catch (error) {
      toast.error("Error resending code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndSignup = async (otpString) => {
    const codeToVerify = otpString || otp.join('');
    if (codeToVerify.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP code.");
      return;
    }

    setIsLoading(true);
    try {
      const verifyRes = await verifySignupOtp(formData.email.trim(), codeToVerify);
      if (verifyRes?.status === 200 && verifyRes?.data?.success) {
        toast.success("Email code verified! Creating account...");
        // Complete actual account creation
        const res = await handleSignup(formData);
        if (res?.status === 201) {
          const accessToken = res?.data?.accessToken;
          const refreshToken = res?.data?.refreshToken;

          if (accessToken) localStorage.setItem('zipp-accessToken', accessToken);
          if (refreshToken) localStorage.setItem('zipp-refreshToken', refreshToken);

          navigate('/clipboard');
        } else {
          toast.error(res?.data?.message || 'Signup failed. Please try again.');
        }
      } else {
        toast.error(verifyRes?.data?.message || verifyRes?.data?.error || "Invalid OTP code");
        if (verifyRes?.data?.attemptsRemaining) {
          toast.warning(`${verifyRes.data.attemptsRemaining} attempts remaining`);
        }
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full items-center lg:w-[60%] p-2">
      {/* Logo */}
      <div className="text-center mb-8 w-full">
        <img src={logo} alt="Logo" className="mx-auto h-10" />
        <h2 className="text-xl font-medium text-violet-700 mb-1">
          {step === 1 ? 'Create an account' : 'Verify Email Address'}
        </h2>
        <p className="text-sm text-violet-900">
          {step === 1 ? 'Sign up to start syncing your clipboard' : `Enter the 6-digit code sent to ${formData.email}`}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSendOtpSubmit} className="space-y-3 w-full">
          <div className="grid grid-cols-2 gap-4 mb-1">
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

          {/* Email */}
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

          {/* Confirm Email */}
          <div>
            <label htmlFor="confirmEmail" className="block text-sm font-medium text-slate-700 mb-1">Confirm Email Address *</label>
            <input
              type="email"
              id="confirmEmail"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
              onFocus={() => setFocusedField('confirmEmail')}
              onBlur={() => setFocusedField(null)}
              required
              className={`w-full px-3 py-2 border rounded-md ${
                !emailMatch && formData.confirmEmail
                  ? 'border-red-500'
                  : focusedField === 'confirmEmail'
                    ? 'border-[#818cf8]'
                    : 'border-slate-300'
              }`}
              placeholder="john.doe@example.com"
            />
            {!emailMatch && formData.confirmEmail && (
              <p className="text-red-500 text-xs mt-1">Email addresses do not match</p>
            )}
          </div>

          {/* Password */}
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

          {/* Confirm Password */}
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

          {/* Send OTP Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`cursor-pointer w-full py-3 px-4 rounded-md text-white font-medium ${
              isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-violet-700 hover:bg-violet-900'
            }`}
          >
            {isLoading ? 'Sending Code...' : 'Continue'}
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
      ) : (
        /* STEP 2: OTP Verification Screen */
        <div className="w-full flex flex-col items-center">
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Code expires in:</p>
            <div className={`text-xl font-bold ${timer < 30 ? 'text-red-500' : 'text-slate-800'}`}>
              {formatTime(timer)}
            </div>
          </div>

          <div className="flex space-x-2 sm:space-x-3 mb-6">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => (otpInputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-xl font-bold border border-slate-300 rounded-lg focus:border-violet-500 focus:ring focus:ring-violet-200 focus:outline-none transition-all"
                autoComplete="one-time-code"
                inputMode="numeric"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleVerifyAndSignup()}
            disabled={isLoading || otp.includes('') || !timerActive}
            className={`w-full cursor-pointer py-3 px-4 rounded-md text-white font-medium mb-4 ${
              isLoading || otp.includes('') || !timerActive
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-violet-700 hover:bg-violet-900 shadow'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Verify & Create Account'}
          </button>

          <div className="flex justify-between items-center w-full mt-2 text-sm">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp(['', '', '', '', '', '']);
                setTimerActive(false);
              }}
              className="text-violet-700 hover:text-violet-900 font-medium"
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={timerActive}
              className={`font-medium ${
                timerActive ? 'text-gray-400 cursor-not-allowed' : 'text-violet-700 hover:text-violet-900'
              }`}
            >
              {timerActive ? `Resend code in ${formatTime(timer)}` : 'Resend code'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
