import { useState, useEffect, useRef } from 'react';
import { sendVerification, verifyEmailOTP } from '../../../controller/authController';
import { toast } from 'react-toastify';

const VerifyMail = ({ data }) => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes
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
      toast.info("OTP expired. Please request a new one.");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);
      const response = await sendVerification();

      if (response?.status === 200) {
        toast.success("Verification mail sent successfully");
        toast.success("Please check your inbox or spam folder");
        setStep(2);
        setTimer(120);
        setTimerActive(true);
      } else if (response?.status === 429) {
        toast.error(response.data.error);
      } else {
        toast.error(
          response?.data?.message ||
            response?.data?.error ||
            "Failed to send verification mail"
        );
      }
    } catch (error) {
 
      toast.error("An error occurred. Please try again later.");
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
        verifyOtp(otpString);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (otpString) => {
    const otpToVerify = otpString || otp.join('');

    if (otpToVerify.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await verifyEmailOTP(data.email, otpToVerify);

      if (response?.status === 200) {
        toast.success("Email verified successfully!");
        window.location.reload();
      } else if (response?.status === 400) {
        toast.error(response.data.message);
        if (response.data.attemptsRemaining) {
          toast.warning(`${response.data.attemptsRemaining} attempts remaining`);
        }
      } else if (response?.status === 429) {
        toast.error(response.data.error);
      } else {
        toast.error("Failed to verify OTP");
      }
    } catch (error) {

      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timerActive) return;

    try {
      setIsLoading(true);
      const response = await sendVerification();

      if (response?.status === 200) {
        toast.success("New verification code sent successfully");
        setTimer(120);
        setTimerActive(true);
        setOtp(['', '', '', '', '', '']);
      } else if (response?.status === 429) {
        toast.error(response.data.error);
      } else {
        toast.error("Failed to send new verification code");
      }
    } catch (error) {
    
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setOtp(['', '', '', '', '', '']);
    setTimerActive(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      {data.isMailVerified ? (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-4 text-green-600">
            Email Already Verified
          </h1>
          <p className="text-gray-700 text-center">
            Your email address has already been verified. You can now access all
            features of your account.
          </p>
        </div>
      ) : step === 1 ? (
        <div className="flex flex-col items-center justify-center py-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Verify Your Email
          </h1>
          <p className="text-gray-700 text-center mb-6">
            Please verify your email so you can access all features. We'll send a
            6-digit code to your registered address.
          </p>
          <button
            onClick={handleSendOTP}
            disabled={isLoading}
            className={`cursor-pointer px-6 py-3 rounded-md text-white font-medium ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-violet-700 hover:bg-violet-800 shadow'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Enter Verification Code
          </h1>
          <p className="text-gray-700 text-center mb-6">
            We've sent a 6-digit verification code to your email address. Enter it
            below to verify your account.
          </p>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1 text-center">
              Code expires in:
            </p>
            <div
              className={`text-xl font-bold ${
                timer < 30 ? 'text-red-500' : 'text-gray-800'
              }`}
            >
              {formatTime(timer)}
            </div>
          </div>

          <div className="flex space-x-3 mb-6">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => (otpInputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:border-violet-500 focus:ring focus:ring-violet-200 focus:outline-none transition-all"
                autoComplete="one-time-code"
                inputMode="numeric"
              />
            ))}
          </div>

          <button
            onClick={() => verifyOtp()}
            disabled={isLoading || otp.includes('') || !timerActive}
            className={`w-full cursor-pointer px-6 py-3 rounded-md text-white font-medium mb-4 ${
              isLoading || otp.includes('') || !timerActive
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-violet-700 hover:bg-violet-800 shadow'
            }`}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full">
            <button
              onClick={handleBackToStep1}
              className="text-violet-700 hover:text-violet-900 font-medium text-sm"
            >
              ← Back
            </button>
            <button
              onClick={handleResendOTP}
              disabled={timerActive}
              className={`text-sm font-medium ${
                timerActive
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-violet-700 hover:text-violet-900'
              }`}
            >
              {timerActive
                ? `Resend code in ${formatTime(timer)}`
                : 'Resend verification code'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyMail;

