import '../Css/Newpass.css'
import Popup from './Popup';
import "../Css/Popup.css"
import {  useNavigate } from 'react-router-dom';
import { useState } from 'react';
import API_BASE_URL from './config';

function Newpassword() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const newpass = async (e) => {
    e.preventDefault();

    const data = { "phone": phone, "newpassword": password }
    try {
      const response = await fetch(`${API_BASE_URL}/newpassword`, {
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
      navigate("/login");
      setShowPopup(true);
      setPopupMessage("Password changed");
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
        <h2>Enter New Password</h2>
        <form >
          <input type="number" className='input' onChange={(e) => { setPhone(e.target.value) }} placeholder="Enter your phone number" required />
          <input type="text" className='input' onChange={(e) => { setPassword(e.target.value) }} placeholder="Enter your newpassword" required />
          <button type="button" onClick={(e) => newpass(e)} className='btn'>Submit</button><br />
        </form>
        <div>{showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}</div>
      </div>
    </>

  )
}

export default Newpassword