import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import logo from "./../assets/logo.png";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAuthNavigate = (path) => {
    if(localStorage.getItem('zipp-accessToken') && localStorage.getItem('zipp-refreshToken')){
      navigate('/clipboard');
      return;
    }
    navigate(`/auth/${path}`);
  }

  const features = [
    { title: "Instant Sync", description: "Automatically sync your clipboard across all your devices in real-time.", icon: "💨" },
    { title: "Organize Easily", description: "Categorize and search your saved snippets, links, and images effortlessly.", icon: "📂" },
    { title: "Secure & Private", description: "Your data is encrypted and never shared with anyone without your consent.", icon: "🔒" },
    { title: "Multi-format Support", description: "Save text, code, images, and links without any hassle.", icon: "🖼️" },
    { title: "PIN Sign-in", description: "Quick and secure login using a 4-digit PIN. Very easy and convenient.", icon: "🔢" },
    { title: "Cloud Backup", description: "All your data is safely backed up in the cloud for peace of mind.", icon: "☁️" },
    { title: "Offline Access", description: "Access your saved content even without internet connectivity.", icon: "📶" },
    { title: "Multi-Device Support", description: "Access your saved content from any device seamlessly.", icon: "📱" },
  ];

  const metrics = [
    { number: "2M+", label: "Happy Customers", icon: "😊" },
    { number: "99.99%", label: "Uptime", icon: "⏱️" },
    { number: "5M+", label: "Downloads", icon: "⬇️" },
    { number: "120+", label: "Countries Served", icon: "🌍" },
  ];

  const faqs = [
    { q: "How do I install Zipp?", a: "Just sign up and download the app on your device. All your clipboard data syncs automatically." },
    { q: "Is my data secure?", a: "Yes! All your data is encrypted and private. We never share it without your consent." },
    { q: "Can I access offline?", a: "Absolutely! Zipp stores your clipboard data locally so you can access it without internet." },
    { q: "How do I use PIN Sign-in?", a: "Set a 4-digit PIN in settings, and log in quickly without typing your password." },
  ];

  const scrollTo = (id) => {
    if (id === "Home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
  };

  return (
    <div className="m-0 p-0 font-sans bg-gray-50 text-gray-800">

      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center w-[120px] cursor-pointer" onClick={() => scrollTo("Home")}>
            <img src={logo} alt="Logo" className="w-[45px] h-auto" />
          </div>

          {/* Desktop Links */}
          <div className="text-sm hidden md:flex space-x-8 text-gray-600 font-medium tracking-wide">
            {["Home", "Features", "About Us", "FAQ"].map((item) => (
              <button
                key={item}
                className="transition-colors hover:text-blue-600 cursor-pointer"
                onClick={() => scrollTo(item.replace(/\s+/g, ""))}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex space-x-4 tracking-wide">
            <button
              onClick={() => handleAuthNavigate("login")}
              className="px-4 py-2 text-xs font-medium border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => handleAuthNavigate("signup")}
              className="px-6 py-2 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button className="focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden px-6 py-4 space-y-4 bg-white text-xs">
            {["Home", "Features", "About Us", "FAQ"].map((item) => (
              <button
                key={item}
                className="block text-gray-700 hover:text-indigo-600 w-full text-left"
                onClick={() => scrollTo(item.replace(/\s+/g, ""))}
              >
                {item}
              </button>
            ))}
            <div className="flex flex-col space-y-2">
                <button
                onClick={() => handleAuthNavigate("login")}
                className="px-4 py-2 text-sm font-medium border border-indigo-500 text-indigo-500 rounded hover:bg-indigo-50"
                >
                Login
                </button>
                <button
                onClick={() => handleAuthNavigate("signup")}
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                Get Started
                </button>
            </div>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div id="Home" className="mt-16 flex flex-col items-center justify-center px-6 text-center space-y-4 bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-32 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-400 rounded-full opacity-10 animate-pulse"></div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight drop-shadow-lg">Never Lose What You Copy</h1>
        <p className="text-lg sm:text-xl md:text-2xl leading-relaxed tracking-wide max-w-2xl drop-shadow">
          Zipp saves text, code, links, and images — always ready when you need them.
        </p>
        <Link to="/auth/signup" className="mt-6 px-8 py-4 text-lg md:text-xl font-semibold bg-white text-slate-800 rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
          Get Started
        </Link>
      </div>

      {/* Features Section */}
      <div id="Features" className="px-6 md:px-16 lg:px-32 py-16 bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12
                      bg-linear-to-r from-slate-700 via-blue-600 to-indigo-600
                      bg-clip-text text-transparent">
          Why Zipp is Awesome
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-linear-to-br from-white to-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex flex-col items-center text-center border border-slate-100">
              <div className="text-5xl mb-3">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-blue-600">{feature.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About Us Section */}
      <div id="AboutUs" className="px-6 md:px-16 lg:px-32 py-16 bg-linear-to-r from-slate-100 via-blue-50 to-indigo-50 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">About Us</h2>
        <div className="flex flex-col md:flex-row items-center md:space-x-12 space-y-6 md:space-y-0 max-w-5xl mx-auto">
          <div className="bg-linear-to-r from-white to-slate-100 p-8 rounded-2xl shadow-lg flex-1 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-blue-600 mb-3">Trusted by Millions</h3>
            <p className="text-gray-700 text-justify">Zipp is used worldwide to save and organize clipboard data efficiently. Productivity, simplicity, and reliability are our top priorities.</p>
          </div>
          <div className="bg-linear-to-r from-white to-blue-100 p-8 rounded-2xl shadow-lg flex-1 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-blue-600 mb-3">Our Mission</h3>
            <p className="text-gray-700 text-justify">To make clipboard management effortless, secure, and seamless across all your devices. Every copy you make is safe and accessible anytime.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center mt-12">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-2">{metric.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-600">{metric.number}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div id="FAQ" className="px-6 md:px-16 lg:px-32 py-16 bg-linear-to-r from-slate-100 via-blue-50 to-indigo-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12
               bg-linear-to-r from-slate-700 via-blue-600 to-indigo-600
               bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-blue-600 mb-2">{faq.q}</h3>
              <p className="text-gray-700">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 md:px-16 lg:px-32 py-20 bg-linear-to-r from-slate-800 via-blue-800 to-indigo-800 text-white text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Ready to Elevate Your Workflow?</h2>
        <p className="max-w-2xl mx-auto mb-6 text-lg md:text-xl drop-shadow">
          Start using Zipp today and never lose track of what you copy again. Experience seamless sync, organization, and security across all your devices.
        </p>
        <Link to="/auth/signup" className="px-8 py-4 text-lg font-semibold bg-white text-slate-800 rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
          Get Started
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 text-gray-300">
        <div className="px-6 md:px-16 lg:px-32 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-bold mb-3 text-white">Zipp</h3>
            <p>Organize your clipboard seamlessly. Save text, links, images, and code securely.</p>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-white">Company</h3>
            <ul>
              <li className="py-1 hover:text-white cursor-pointer">About Us</li>
              <li className="py-1 hover:text-white cursor-pointer">Team Members</li>
              <li className="py-1 hover:text-white cursor-pointer">Blogs</li>
              <li className="py-1 hover:text-white cursor-pointer">Careers</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-white">Support</h3>
            <ul>
              <li className="py-1 hover:text-white cursor-pointer">Help Center</li>
              <li className="py-1 hover:text-white cursor-pointer">FAQs</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-white">Contact</h3>
            <ul>
              <li className="py-1">Email: support@zippapp.com</li>
              <li className="py-1">Working Hours: Mon-Fri 9AM - 6PM</li>
            </ul>
          </div>
        </div>
        <div className="text-center py-4 border-t border-gray-700 text-sm">
          © {new Date().getFullYear()} Zipp. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
