import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/auth") {
      navigate("/auth/login", { replace: true });
    }
  }, [location.pathname, navigate]);

  const isLogin = location.pathname.includes("login");

  return (
    <div className="flex min-h-screen font-sans m-0 p-0 overflow-hidden">
      {/* Left Side - Zipp Clipboard Theme */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
        {/* Background Clipboard Elements */}
        <div className="absolute top-16 right-16 w-20 h-24 bg-white/10 rounded-lg border-2 border-white/20"></div>
        <div className="absolute top-32 right-32 w-16 h-20 bg-white/15 rounded-lg border-2 border-white/25 rotate-12"></div>
        <div className="absolute bottom-40 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/4 left-1/3 w-12 h-16 bg-white/10 rounded-md rotate-45"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-15 left-20 text-4xl animate-pulse">📋</div>
        
        {/* Main Content */}
        <div className="flex flex-col justify-center p-12 lg:p-16 xl:p-20 text-white relative z-10">
          {/* Free Badge */}
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-8 self-start">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            Free Forever
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
            Never Lose<br />
            What You<br />
            Copy Again
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg lg:text-xl text-blue-100 mb-12 max-w-md leading-relaxed">
            Zipp saves your clipboard across all devices. Text, code, links, and images — always ready when you need them.
          </p>
          
          {/* Features List */}
          <div className="space-y-3 mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-blue-100">Instant sync across devices</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-blue-100">Secure & encrypted storage</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-blue-100">Works offline too</span>
            </div>
          </div>
          
          {/* Quote Section */}
          <div className="mt-auto">
            <blockquote className="text-blue-100 italic text-base lg:text-lg mb-4 max-w-sm leading-relaxed">
              "Productivity is never an accident. It is always the result of intelligent planning."
            </blockquote>
            <cite className="text-white font-semibold text-lg">
              Paul J. Meyer
            </cite>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-linear-to-tl from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-indigo-400/20 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-4 sm:p-6 lg:p-8 ">
        {isLogin ? <Login /> : <Signup />} 
      </div>
    </div>
  );
};

export default Auth;
