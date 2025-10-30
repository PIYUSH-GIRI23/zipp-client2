import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/auth/Auth";
import Dashboard from "./components/Dashboard";
import Homepage from "./components/Clipboard/Homepage";
import Account from "./components/account/Account";
import ForgotPassword from "./components/account/ForgotPassword";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth/*" element={<Auth />} />
          <Route path="/clipboard" element={<Homepage />} />
          <Route path="/myaccount" element={<Account />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
