import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword1, forgotPassword2 } from '../../controller/authController';
import logo from '../../assets/logo.png';
import { logout } from '../../controller/manageSession';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    otp: ['', '', '', '', '', ''],
  });
  const [passKey, setPasskey] = useState('');

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  // OTP timer state
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const otpInputRefs = useRef([]);
  
  // Password validation
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    message: '',
  });
  
  // Track whether user has started entering password
  const [passwordAttempted, setPasswordAttempted] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval;
    
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      toast.info("OTP expired. Please request a new one.");
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timer]);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Password validation
    if (name === 'password') {
      validatePassword(value);
      // Check if passwords match
      if (formData.confirmPassword) {
        setPasswordMatch(value === formData.confirmPassword);
      }
    } else if (name === 'confirmPassword') {
      setPasswordMatch(formData.password === value);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    // Set password attempted whenever this function is called with a non-empty password
    if (password) {
      setPasswordAttempted(true);
    }
    
    if (!password || password.trim() === '') {
      setPasswordStrength({
        isValid: false,
        message: '',
      });
      return;
    }
    
    if (passwordRegex.test(password)) {
      setPasswordStrength({
        isValid: true,
        message: 'Password strength: Strong',
      });
    } else {
      setPasswordStrength({
        isValid: false,
        message: 'Password must have at least 8 characters with uppercase, lowercase, number & special character',
      });
    }
  };

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData(prev => ({ ...prev, otp: newOtp }));

    // Auto-focus next input only (no auto-submit)
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await forgotPassword1(formData.email);
      
      
      if (response?.status === 200) {
        if (response.data.success) {
          toast.success("OTP sent to your email");
       
          setPasskey(response.data.passKey);
          setStep(2);
          // Start timer
          setTimer(response.data.expirySeconds || 120);
          setTimerActive(true);
        } else {
          toast.error(response.data.message || response.data.error || "Failed to send verification code");
        }
      } else if (response?.status === 404) {
        toast.error("No account found with this email address.");
      } else if (response?.status === 429) {
        toast.error(response.data.message || "Too many attempts. Please try again later.");
      } else {
        toast.error(response.data.message || "Failed to send verification code");
      }
    } catch (error) {
      
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timerActive) return;
    
    setIsLoading(true);
    try {
      const response = await forgotPassword1(formData.email);
      
      if (response?.status === 200 && response.data.success) {
        toast.success("New verification code sent to your email");
        // Reset timer with server response or fallback
        setTimer(response.data.expirySeconds || 120);
        setTimerActive(true);
        // Clear OTP fields
        setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
      } else if (response?.status === 429) {
        toast.error(response.data.message || "Too many attempts. Please try again later.");
      } else {
        toast.error(response.data.message || "Failed to send new verification code");
      }
    } catch (error) {
      
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    
    const otpString = formData.otp.join('');
    
    // Check if OTP has expired
    if (!timerActive || timer <= 0) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }
    
    // Check if any OTP digit is empty
    if (formData.otp.some(digit => !digit.trim())) {
      toast.error("Please enter a complete 6-digit OTP.");
      return;
    }
    
    if (!passwordStrength.isValid) {
      toast.error("Please enter a valid password.");
      return;
    }
    
    if (!passwordMatch) {
      toast.error("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    try {
      // Reset password with OTP verification in one step
      const response = await forgotPassword2(
        formData.email,
        formData.password,
        formData.confirmPassword,
        passKey,
        otpString
      );

      
      
      if (response?.status === 200) {
        if (response.data.success) {
          toast.success(response.data.message || "Password reset successfully");
          await logout(); 
          setTimeout(() => {
            navigate('/auth/login');
          }, 1500);
        } else {
          toast.error(response.data.message || "Failed to reset password");
        }
      } else if (response?.status === 429) {
        toast.error(response.data.message || "Too many attempts. Please try again later.");
      } else if (response?.status === 400) {
        if (response.data.message?.toLowerCase().includes('expired')) {
          toast.error("OTP has expired. Please request a new one.");
          setTimer(0);
          setTimerActive(false);
        } else {
          toast.error(response.data.message || "Invalid OTP or password");
          if (response.data.attemptsRemaining) {
            toast.warning(`${response.data.attemptsRemaining} attempts remaining`);
          }
        }
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
   
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
    setTimerActive(false);
  };

  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      {/* Left decorative panel - visible on large screens */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative">
        <div className="p-12 flex flex-col justify-center w-full">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6 self-start">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            Secure & Private
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">Reset Your Password</h1>
          <p className="text-lg text-blue-100 mb-8 max-w-lg">Enter the email associated with your account and we'll send a verification code to reset your password securely.</p>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-blue-100">Encrypted storage</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-blue-100">Fast & reliable</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-48 h-48 bg-linear-to-tl from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Right / Form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <img src={logo} alt="Logo" className="mx-auto h-10 mb-2" />
            <h2 className="text-2xl font-semibold text-slate-800">Reset Password</h2>
            <p className="text-sm text-slate-500">Follow the steps to securely reset your password</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    focusedField === 'email' ? 'border-violet-500' : 'border-slate-300'
                  } focus:outline-none focus:ring-1 focus:ring-violet-500`}
                  placeholder="Enter your email address"
                  required
                />
                <p className="mt-1 text-xs text-slate-500">
                  We'll send a verification code to this email address.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-700 hover:bg-violet-800'
                }`}
              >
                {isLoading ? 'Sending...' : 'Continue'}
              </button>

              <div className="text-center mt-4">
                <Link to="/auth/login" className="text-sm text-violet-700 hover:text-violet-900">
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="text-sm text-violet-700 hover:text-violet-900"
                >
                  ← Back to email
                </button>
                <p className="text-sm text-slate-600 mt-1">
                  Resetting password for: <strong>{formData.email}</strong>
                </p>
              </div>

              {/* OTP Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Enter verification code *
                </label>
                <div className="flex justify-center space-x-2 mb-1">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={formData.otp[index]}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-md focus:border-violet-500 focus:ring focus:ring-violet-200 focus:outline-none transition-all"
                      autoComplete="one-time-code"
                      inputMode="numeric"
                    />
                  ))}
                </div>

                {/* Timer Display */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Code expires in:</p>
                  {timerActive && timer > 0 ? (
                    <p className={`text-sm font-medium ${timer < 30 ? "text-red-500" : "text-gray-700"}`}>
                      {formatTime(timer)}
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-red-500">
                      OTP expired! Please request a new one.
                    </p>
                  )}
                </div>

                {/* Resend Option */}
                <div className="text-center mt-2">
                  <button
                    onClick={handleResendOTP}
                    disabled={timerActive && timer > 0}
                    type="button"
                    className={`text-xs ${
                      timerActive && timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-violet-700 hover:underline"
                    }`}
                  >
                    {timerActive && timer > 0 ? `Resend code in ${formatTime(timer)}` : "Resend verification code"}
                  </button>
                </div>
              </div>

              {/* Password Fields */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      focusedField === 'password' ? 'border-violet-500' : 'border-slate-300'
                    } focus:outline-none focus:ring-1 focus:ring-violet-500`}
                    placeholder="••••••••"
                    required
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
                {passwordAttempted && (
                  <p className={`text-xs mt-1 ${passwordStrength.isValid ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordStrength.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      !passwordMatch && formData.confirmPassword
                        ? 'border-red-500'
                        : focusedField === 'confirmPassword'
                          ? 'border-violet-500'
                          : 'border-slate-300'
                    } focus:outline-none focus:ring-1 focus:ring-violet-500`}
                    placeholder="••••••••"
                    required
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
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  isLoading || 
                  !timerActive || 
                  timer <= 0 ||
                  formData.otp.some(digit => !digit.trim()) || 
                  !passwordStrength.isValid || 
                  !passwordMatch || 
                  !formData.password || 
                  !formData.confirmPassword
                }
                className={`w-full py-2 px-4 rounded-md text-white font-medium mt-4 ${
                  isLoading || !timerActive || timer <= 0 || formData.otp.some(digit => !digit.trim()) || !passwordStrength.isValid || !passwordMatch || !formData.password || !formData.confirmPassword
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-violet-700 hover:bg-violet-800'
                }`}
              >
                {isLoading ? 'Processing...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
