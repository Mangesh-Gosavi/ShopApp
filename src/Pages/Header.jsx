import "../Css/Home.css";
import User from "../Images/circle-user (1).svg";
import Cart from "../Images/shopping-cart.svg";
import { Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Search from "./search";
import API_BASE_URL from './config';

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchdata, setsearchdata] = useState('');
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = (event) => {
    if (!event.target.matches('.dropbtn')) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", closeDropdown);
    return () => {
      window.removeEventListener("click", closeDropdown);
    };
  }, []);

  const handleclick = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        setLogoutMessage("Logout successful");
        setTimeout(() => setLogoutSuccess(true), 1500);
      } else {
        setLogoutMessage("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      setLogoutMessage("An error occurred");
    }
  };

  // Redirect after showing message
  if (logoutSuccess) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div className="headerbg">
        <div className="nav">
          <div className="logo-section">
            <Link to="/home" className="biglogo"><h1>Pooja Collection</h1></Link>
            <Link to="/home" className="smalllogo"><h1>PJC</h1></Link>
          </div>

          <div className="navsearch">
            <input
              className="search"
              onChange={(e) => setsearchdata(e.target.value)}
              placeholder="Search Here"
              type="text"
            />
          </div>

          <div className="nav-icons">
            <div className="dropdown">
              <div className="dropdown-toggle">
                <img
                  onClick={toggleDropdown}
                  src={User}
                  className="icon user-icon dropbtn"
                  alt="User"
                />
              </div>
              <div className={isDropdownOpen ? "dropdown-content show" : "dropdown-content"}>
                <Link to="/cart">Cart</Link>
                <Link to="/order">Order Details</Link>
                <p onClick={handleclick} style={{ cursor: 'pointer', margin: 0 }}>Logout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout message */}
      {logoutMessage && (
        <div className="logout-message">
          {logoutMessage}
        </div>
      )}

      {searchdata && (
        <div className="search-results-container">
          <Search prodData={searchdata} />
        </div>
      )}
    </>
  );
}

export default Header;
