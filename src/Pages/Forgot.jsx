import '../Css/Forgot.css'
import { useState } from "react";
import Popup from './Popup';
import "../Css/Popup.css"
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from './config';
import { Mail, ShieldCheck, Send } from 'lucide-react';

function Forgot() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const phoneverify = async (e) => {
    e.preventDefault();
    setSending(true);
    localStorage.setItem("userEmail", email);
    try {
      const response = await fetch(`${API_BASE_URL}/sendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        console.log("error sending OTP");
      }
      setOtpSent(true);
      setShowPopup(true);
      setPopupMessage("OTP sent to your email");
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const otpverify = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: parseInt(otp) })
      });
      if (!response.ok) {
        const error = await response.json();
        console.error(error);
      }
      setShowPopup(true);
      setPopupMessage("OTP Verified");
      navigate("/Newpassword");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fp-body">
      <div className="fp-card">
        <div className="fp-icon-circle">
          {otpSent ? <ShieldCheck size={28} /> : <Mail size={28} />}
        </div>

        <h1 className="fp-title">Forgot Password</h1>
        <p className="fp-subtitle">
          {otpSent
            ? "Enter the OTP sent to your email"
            : "We'll send an OTP to reset your password"}
        </p>

        <div className="fp-steps">
          <div className={`fp-step-dot ${!otpSent ? 'active' : ''}`} />
          <div className={`fp-step-line ${otpSent ? 'active' : ''}`} />
          <div className={`fp-step-dot ${otpSent ? 'active' : ''}`} />
        </div>
        <p className="fp-step-label">Step {otpSent ? '2' : '1'} of 2</p>

        {!otpSent ? (
          <div className="fp-inline-row">
            <div className="fp-field">
              <span className="fp-field-icon"><Mail size={17} /></span>
              <input
                className="fp-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              className="fp-send-btn"
              type="button"
              onClick={phoneverify}
              disabled={sending || !email}
            >
              <Send size={15} style={{ marginRight: 5, verticalAlign: 'middle' }} />
              {sending ? 'Sending…' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <>
            <div className="fp-field" style={{ width: '100%' }}>
              <span className="fp-field-icon"><Mail size={17} /></span>
              <input
                className="fp-input"
                type="email"
                value={email}
                readOnly
                style={{ color: '#888', cursor: 'default' }}
              />
            </div>
            <div className="fp-field" style={{ width: '100%' }}>
              <span className="fp-field-icon"><ShieldCheck size={17} /></span>
              <input
                className="fp-input"
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button className="fp-btn" type="button" onClick={otpverify}>
              Verify OTP
            </button>
            <button
              className="fp-back-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onClick={() => setOtpSent(false)}
            >
              Change email
            </button>
          </>
        )}

        <Link className="fp-back-link" to="/login">← Back to Login</Link>
      </div>

      {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
    </div>
  );
}

export default Forgot;
