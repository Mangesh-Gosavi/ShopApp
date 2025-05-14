import '../Css/Forgot.css'
import { useState } from "react";
import Popup from './Popup';
import "../Css/Popup.css"
import { useNavigate } from "react-router-dom";
import API_BASE_URL from './config';


function Forgot() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const phoneverify = async (e) => {
    e.preventDefault();

    const data = { "phone": phone }
    try {
      const response = await fetch(`${API_BASE_URL}/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        console.log("error");
      }
      setShowPopup(true);
      setPopupMessage("OTP send to your number");
    }
    catch (error) {
      console.log(error);
    }
  }

  const otpverify = async (e) => {
    e.preventDefault();

    const data = { "phone": parseInt(phone), "otp": parseInt(otp) }
    try {
      const response = await fetch(`${API_BASE_URL}/verifyotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        const error = await response.json()
        console.error(error);
      }
      setShowPopup(true);
      setPopupMessage("OTP Verified");
      navigate("/Newpassword");
    }
    catch (error) {
      console.log(error);
    }
  }

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  return (
    <>
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <form className="forgot-password-form">
          <h3 htmlFor="email">Phone</h3>
          <input type="number" id="email" className='input' name="email" onChange={(e) => { setPhone(e.target.value) }} placeholder="Enter your phone number" required />
          <button type="button" onClick={(e) => phoneverify(e)}>Verify</button><br /><br />
        </form>
        <div>
          <input className='input' type="number" id="number" name="number" onChange={(e) => { setOtp(e.target.value) }} placeholder="Enter your otp" required /><br />
          <button className='btn' type="button" onClick={(e) => otpverify(e)}>Submit</button>
        </div>
        <div>{showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}</div>
      </div>
    </>

  )
}

export default Forgot