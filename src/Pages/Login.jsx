import Popup from './Popup';
import "../Css/Popup.css"
import { Link } from 'react-router-dom'
import '../Css/Login.css'
import Loader from './Loader';
import { CircleUser, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from './config';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const data = { "email": email, "password": password }
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jsonData = JSON.stringify(data);

    const token = localStorage.getItem('token');
    const url = new URL(`${API_BASE_URL}/Login`);
    url.searchParams.append("data", jsonData);

    if (email.length !== 0 && password.length !== 0) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok) {
          const error = await response.json()
          setShowPopup(true);
          setPopupMessage(error.message)
          return;
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate("/Home");
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Please Fill All The Details!")
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    const handleBackButton = (event) => {
      event.preventDefault();
      window.history.forward();
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className='center-body'>
          <form className='form' onSubmit={(e) => handleSubmit(e)}>
            <h1 className='title'>Pooja Collection</h1>
            <h1 className='title'>Login</h1><br/>

            <div className='content'>
              <span className='icon'><CircleUser /></span>
              <input
                id='name'
                className="uinput"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className='content password-content'>
              <span className='icon'><KeyRound /></span>
              <input
                id='password'
                className="uinput"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <button className='loginbtn' type="submit">Submit</button>
            <h4><Link className='link' to='/forgotpassword'>Forgot Password</Link></h4>
            <h5>Don't have an account? <Link className='link' to="/Signup">Signup</Link></h5>
            {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
          </form>
        </div>
      )}
    </>

  )
}

export default Login;
