import { useState, useEffect, useRef } from 'react';
import { handleDetails } from '../../controller/authController.js';
import { getClips } from '../../controller/modalController.js';
import { logout } from '../../controller/manageSession.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import no_profile from '../../assets/no_profile.png';
import logo from '../../assets/logo.png';
import Imagemodal from './modals/Imagemodal.jsx';
import Textmodal from './modals/Textmodal.jsx';
import Filemodal from './modals/Filemodal.jsx';
import TextShowModal from './modals/datamodal/TextShowModal.jsx';
import ImageShowModal from './modals/datamodal/ImageShowModal.jsx';
import FileShowModal from './modals/datamodal/FileShowModal.jsx';

const Homepage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadModalOption, setUploadModalOption] = useState(0);
  const [option, setOption] = useState(1);
  const [data, setData] = useState({ text: [], images: [], files: [] });
  const [profile, setProfile] = useState(null);
  const [accountPlan, setAccountPlan] = useState(1);
  const navigate = useNavigate();
  const fabRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await handleDetails();
        if (!isMounted) return;
        if (data?.status === 200) {
          setProfile(data.data.user?.profile || null);
          setAccountPlan(data.data.user?.accountPlan || 1);
        } else if (data?.status === 429) toast.error(data.data.error);
      } catch (err) {
        await logout();
        navigate('/auth/login');
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    const fetchClipsData = async () => {
      try {
        const data = await getClips();
        if (!isMounted) return;
        if (data?.status === 429) {
          toast.error(data.data.error);
          return;
        }
        if (data?.status === 200) {
          setData({
            text: data.data.userClips[0]?.text || [],
            images: data.data.userClips[0]?.image || [],
            files: data.data.userClips[0]?.file || [],
          });
        }
      } catch (err) {
        await logout();
        navigate('/auth/login');
      }
    };
    fetchClipsData();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fabRef.current && !fabRef.current.contains(e.target)) {
        setUploadModal(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setUploadModal(false);
        setUploadModalOption(0);
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="shrink-0">
              <img src={logo} alt="Logo" className="h-10 w-auto" />
            </div>

            <div className="relative">
              <div
                className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-blue-500 bg-white cursor-pointer hover:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                onClick={() => setIsOpen(!isOpen)}
              >
                <img src={profile || no_profile} alt="Profile" className="h-full w-full object-cover" />
              </div>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/myaccount');
                      }}
                    >
                      My Account
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                      onClick={() => {
                        logout();
                        navigate('/auth/login');
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {uploadModalOption === 1 ? (
        <Textmodal setUploadModal={setUploadModal} setUploadModalOption={setUploadModalOption} accountPlan={accountPlan} />
      ) : uploadModalOption === 2 ? (
        <Imagemodal setUploadModal={setUploadModal} setUploadModalOption={setUploadModalOption} accountPlan={accountPlan} />
      ) : uploadModalOption === 3 ? (
        <Filemodal setUploadModal={setUploadModal} setUploadModalOption={setUploadModalOption} accountPlan={accountPlan} />
      ) : null}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 1, name: 'Text', icon: '📝' },
              { id: 2, name: 'Images', icon: '🖼️' },
              { id: 3, name: 'Files', icon: '📁' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setOption(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  option === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg min-h-[600px] p-6">
          {option === 1 ? (
            <TextShowModal data={data.text} />
          ) : option === 2 ? (
            <ImageShowModal data={data.images} />
          ) : option === 3 ? (
            <FileShowModal data={data.files} />
          ) : null}
        </div>
      </div>

      <div ref={fabRef} id="fab-menu" className="fixed bottom-8 right-8 z-50">
        <div className="relative flex items-center justify-center">
          <button
            className={`bg-linear-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full h-14 w-14 flex justify-center items-center shadow-xl hover:scale-110 transition-transform duration-300 ${
              uploadModal ? 'rotate-45' : ''
            }`}
            onClick={() => setUploadModal(!uploadModal)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
            </svg>
          </button>

          <div className={`absolute bottom-10 right-10 origin-bottom-right transition-all duration-300 ${uploadModal ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}>
            {[
              { id: 1, icon: '📝', label: 'Text', color: 'from-violet-500 to-purple-600', angle: -90 },
              { id: 2, icon: '🖼️', label: 'Image', color: 'from-blue-500 to-cyan-600', angle: -135 },
              { id: 3, icon: '📁', label: 'File', color: 'from-emerald-500 to-teal-600', angle: -180 },
            ].map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setUploadModalOption(item.id);
                  setUploadModal(false);
                }}
                className={`absolute bg-linear-to-r ${item.color} text-white p-3 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 ease-out hover:scale-110`}
                style={{
                  transform: uploadModal ? `rotate(${item.angle}deg) translate(6rem) rotate(${-item.angle}deg)` : 'rotate(0deg) translate(0)',
                  transitionDelay: `${index * 0.07}s`,
                }}
              >
                <span className="text-xl">{item.icon}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
