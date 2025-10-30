import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png";
import no_profile from "../../assets/no_profile.png";
import { handleDetails } from '../../controller/authController';
import { getClips } from '../../controller/modalController';
import Boost from './modal/Boost';
import Profile from './modal/Profile';
import Settings from './modal/Settings';
import PinAccess from './modal/PinAccess';
import VerifyMail from './modal/VerifyMail';
import { toast } from 'react-toastify';
import { logout } from '../../controller/manageSession';

const Account = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [accountPlan, setAccountPlan] = useState(null);
  const [data, setData] = useState({});
  const [clipData, setClipData] = useState([]);
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [whichOption, setWhichOption] = useState(1); // 1=Profile, 2=Boost, 3=Pin, 4=Settings, 5=Verify
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await handleDetails();
        if (data?.status === 200) {
          setData(data.data.user);
          setProfile(data.data.user?.profile || null);
          setAccountPlan(data.data.user?.accountPlan || null);
        }
      } catch {
        await logout();
        navigate('/auth/login');
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getClips();
        if (data?.status === 200) {
          setClipData(data.data.userClips[0]);
          setPurchaseDate(data.data.userClips[0].tokenRefresh || null);
        }
        if (data?.status === 400 || data?.status === 429) {
          toast.error(data?.data?.message || data?.data?.error || "Error fetching clip data");
          return;
        }
        if (data.status === 404) {
          return;
        }
      } catch {
        await logout();
        navigate('/auth/login');
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header for mobile with hamburger and logo */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white shadow">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md focus:outline-none"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className="flex items-center space-x-2">
          <img src={logo} alt="Zipp" className="h-8" />
        </div>

        <div />
      </div>

      <div className="flex relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 p-6 flex-col items-center h-screen">
          {/* ✅ Desktop Logo */}
          <div className="flex items-center justify-center mb-6">
            <img src={logo} alt="Zipp" className="h-10" />
          </div>

          <div className="relative flex flex-col items-center mb-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-green-600">
              {profile ? (
                <img 
                  src={profile} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = no_profile;
                    console.error("Failed to load profile image");
                  }}
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {data?.firstName?.[0]?.toUpperCase() || ''}{data?.lastName?.[0]?.toUpperCase() || ''}
                </div>
              )}
            </div>

            {accountPlan && accountPlan > 1 && (
              <div
                className={`mt-3 px-4 py-1 rounded-full text-xs font-bold ${accountPlan === 2
                  ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-linear-to-r from-yellow-400 via-red-500 to-pink-500 text-white'
                  }`}
                style={{
                  boxShadow: accountPlan === 3 ? '0 0 10px rgba(255,215,0,0.5)' : 'none',
                  border: accountPlan === 3 ? '1px solid gold' : 'none'
                }}
              >
                {accountPlan === 2 ? 'PRO' : 'PREMIUM'}
              </div>
            )}
          </div>

          <nav className="w-full space-y-2 flex-1">
            <button onClick={() => setWhichOption(1)} className={`w-full cursor-pointer text-left px-4 py-3 rounded-lg font-semibold ${whichOption === 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-800'}`}>
              Profile
            </button>
            <button onClick={() => navigate('/clipboard')} className="w-full cursor-pointer text-left px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 text-gray-800">
              Dashboard
            </button>
            <button onClick={() => setWhichOption(2)} className={`w-full cursor-pointer text-left px-4 py-3 rounded-lg font-semibold ${whichOption === 2 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-800'}`}>
              Boost
            </button>
            <button onClick={() => setWhichOption(3)} className={`w-full cursor-pointer text-left px-4 py-3 rounded-lg font-semibold ${whichOption === 3 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-800'}`}>
              Pin Access
            </button>
            <button onClick={() => setWhichOption(4)} className={`w-full cursor-pointer text-left px-4 py-3 rounded-lg font-semibold ${whichOption === 4 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-800'}`}>
              Settings
            </button>
            <button onClick={() => setWhichOption(5)} className={`w-full cursor-pointer text-left px-4 py-3 rounded-lg font-semibold ${whichOption === 5 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-800'}`}>
              Verify Email
            </button>
          </nav>

          <div className="mt-auto w-full">
            <button
              onClick={async () => {
                await logout();
                navigate('/auth/login');
              }}
              className="w-full px-4 cursor-pointer py-3 rounded-lg text-gray-800 bg-red-50 hover:bg-red-500 hover:text-white"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile overlay menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute inset-0 z-40 bg-black/40">
            <div className="w-64 bg-white h-full p-4">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full mr-3 overflow-hidden">
                  {profile ? (
                    <img 
                      src={profile} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = no_profile;
                        console.error("Failed to load profile image");
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {data?.firstName?.[0]?.toUpperCase() || ''}{data?.lastName?.[0]?.toUpperCase() || ''}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{data?.firstName || 'User'}</div>
                  <div className="text-xs text-gray-500">@{data?.username || ''}</div>
                </div>
              </div>
              <nav className="space-y-2">
                <button onClick={() => { setWhichOption(1); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">Profile</button>
                <button onClick={() => { navigate('/clipboard'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">Dashboard</button>
                <button onClick={() => { setWhichOption(2); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">Boost</button>
                <button onClick={() => { setWhichOption(3); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">Pin Access</button>
                <button onClick={() => { setWhichOption(4); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">Settings</button>
                <button onClick={() => { setWhichOption(5); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">Verify Email</button>
              </nav>

              <div className="mt-6">
                <button onClick={async () => { await logout(); navigate('/auth/login'); }} className="w-full px-3 py-2 rounded-md bg-red-50 hover:bg-red-500 hover:text-white">Logout</button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              {whichOption === 1 ? <Profile data={data} setWhichOption={setWhichOption} /> :
                whichOption === 2 ? <Boost data={clipData} accountPlan={accountPlan} purchaseDate={purchaseDate} /> :
                  whichOption === 3 ? <PinAccess data={data} setWhichOption={setWhichOption} /> :
                    whichOption === 4 ? <Settings data={data} /> :
                      whichOption === 5 ? <VerifyMail data={data} /> :
                        null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Account;
