import { useState, useEffect } from "react";
import '../Css/Signup.css';
import { Link, useNavigate } from "react-router-dom";
import { CircleUser, KeyRound, BookUser, Eye, EyeOff, Mail } from 'lucide-react';
import Popup from '../Pages/Popup';
import Loader from '../Pages/Loader';
import API_BASE_URL from './config';

function Signup() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const userId = randomid();

  function randomid() {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    let result = '';
    for (let i = 0; i < 7; i++) {
      result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !password || !repassword) {
      setShowPopup(true);
      setPopupMessage("Please fill all the details!");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setShowPopup(true);
      setPopupMessage("Invalid phone number!");
      return;
    }

    if (password !== repassword) {
      setShowPopup(true);
      setPopupMessage("Both passwords don't match!");
      return;
    }

    const data = { id: userId, name, phone, email, password };

    try {
      const response = await fetch(`${API_BASE_URL}/Signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (response.ok) {
        if (result.token) localStorage.setItem("authToken", result.token);
        setShowPopup(true);
        setPopupMessage(result.message);
        navigate("/Home");
      } else {
        setShowPopup(true);
        setPopupMessage(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setShowPopup(true);
      setPopupMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className='signup-center-body'>
          <form className='signup-form' onSubmit={handleSubmit}>
            <h2 className="signup-title">Sign Up</h2><br />

            <div className="signup-content">
              <CircleUser className="signup-icon" />
              <input className="signup-uinput" name="uname" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="signup-content">
              <BookUser className="signup-icon" />
              <input className="signup-uinput" name="uphone" type="tel" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className="signup-content">
              <Mail className="signup-icon" />
              <input className="signup-uinput" name="uemail" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className='password-content'>
              <KeyRound className="signup-icon" />
              <input
                className="uinput"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <div className='password-content'>
              <KeyRound className="signup-icon" />
              <input
                className="uinput"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter Password"
                onChange={(e) => setRepassword(e.target.value)}
                required
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <button className='signup-loginbtn' type="submit">Submit</button><br /><br />
            <h5>Already have an account? <Link className='signup-link' to="/login">Signin</Link></h5>
          </form>

          {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
        </div>
      )}
    </>
  );
}

export default Signup;
