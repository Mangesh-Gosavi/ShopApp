import '../Css/Newpass.css'
import Popup from './Popup';
import "../Css/Popup.css"
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API_BASE_URL from './config';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

function Newpassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const useremail = localStorage.getItem("userEmail");
  
    if (useremail && useremail !== "null") {
      setEmail(useremail);
    }
  }, []);

  const newpass = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setShowPopup(true);
      setPopupMessage("Passwords do not match");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/newpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newpassword: password })
      });
      if (!response.ok) {
        const error = await response.json();
        console.error(error);
      }
      setShowPopup(true);
      setPopupMessage("Password changed successfully");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="np-body">
      <div className="np-card">
        <div className="np-icon-circle">
          <ShieldCheck size={28} />
        </div>

        <h1 className="np-title">New Password</h1>
        <p className="np-subtitle">Set a strong new password for your account</p>

        <div className="np-divider" />

        <div className="np-field">
          <span className="np-field-icon"><Mail size={17} /></span>
          <input
            className="np-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly
          />
        </div>

        <div className="np-field">
          <span className="np-field-icon"><Lock size={17} /></span>
          <input
            className="np-input"
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="np-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <div className="np-field">
          <span className="np-field-icon"><Lock size={17} /></span>
          <input
            className="np-input"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span className="np-toggle" onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <button className="np-btn" type="button" onClick={newpass}>
          Save New Password
        </button>

        <Link className="np-back-link" to="/login">← Back to Login</Link>
      </div>

      {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
    </div>
  );
}

export default Newpassword;
