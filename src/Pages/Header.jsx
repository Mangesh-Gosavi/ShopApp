import "../Css/Home.css"
import User from  "../Images/circle-user (1).svg"
import Cart from  "../Images/shopping-cart.svg"
import { Link } from "react-router-dom"
import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Search from "./search";


function Header(){
    const [user, setUser] = useState({});
    const [data, setdata] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchdata, setsearchdata] = useState('');
    const navigate = useNavigate();
    

    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log("Token retrieved:", token);
                const response = await fetch("http://localhost:3000/profile", {
                    method: "GET",
                    headers: 
                    {                        
                      "Accept": "application/json",
                      "Authorization": `Bearer ${token}`
                    }
                });
    
                const data = await response.json();
                setUser(data);
                const serializedData = btoa(JSON.stringify(data.email));
                setdata(serializedData);
            } catch (error) {
                console.error(error);
            }
        }

        init();
    }, []);

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

    const handleclick = async () => {
        try {
          const response = await fetch("http://localhost:3000/logout", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
          });
      
          if (response.ok) {
            localStorage.removeItem('token'); 
            console.log("Logged out successfully");
            window.location.href = '/login'; 
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
        <Link to="/Home" className="biglogo"><h1>Pooja Collection</h1></Link>
        <Link to="/Home" className="smalllogo" ><h1>PJC</h1></Link>

            <div className="navsearch">
                <input className="search" onChange={(e)=>setsearchdata(e.target.value)} placeholder="Search Here" type="text"/>
            </div>
            <div style={{ alignItems: "center", display: "flex" }}>
   <div className="dropdown">
    <div style={{ display: "flex", gap: "14px",alignItems: "center" }}>
        <Link to="/Cart">
            <img src={Cart} style={{ height: "21px", width: "21px", marginRight :"12px" }} />
        </Link>
        <img onClick={toggleDropdown} style={{ height: "27px", width: "27px", marginRight :"12px" }} src={User} className="dropbtn" />
        </div>
        <div className={isDropdownOpen ? "dropdown-content show" : "dropdown-content"}>
        <Link to={`/Order/${data}`}>Order Details</Link>
        <a href="#" onClick={handleclick}>Logout</a>
        </div>
    </div>
    </div>
        </div>
    </div>
    <div style={{display:"flex",justifyContent:"center",zIndex:"1"}}><Search prodData={searchdata}/></div>  
    </>
     )
}

export default Header