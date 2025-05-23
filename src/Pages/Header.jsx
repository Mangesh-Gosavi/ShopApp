import "../Css/Home.css"
import User from "../Images/circle-user (1).svg"
import Cart from "../Images/shopping-cart.svg"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Search from "./search";
import API_BASE_URL from './config';

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchdata, setsearchdata] = useState('');
  const navigate = useNavigate();

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
    e.preventDefault(); // Prevent default anchor navigation

    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        console.log("Logged out successfully");
        navigate('/login');  // Use React Router navigation here
      } else {
        console.log("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <div className="headerbg">
        <div className="nav">
          <div className="logo-section">
            <Link to="/Home" className="biglogo"><h1>Pooja Collection</h1></Link>
            <Link to="/Home" className="smalllogo"><h1>PJC</h1></Link>
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
                />
              </div>
              <div className={isDropdownOpen ? "dropdown-content show" : "dropdown-content"}>
                <Link to={`/Cart`}>Cart</Link>
                <Link to={`/order`}>Order Details</Link>
                <p onClick={handleclick}>Logout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {searchdata && (
        <div className="search-results-container">
          <Search prodData={searchdata} />
        </div>
      )}
    </>
  )
}

export default Header;
