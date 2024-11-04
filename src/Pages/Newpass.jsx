import '../Css/Newpass.css'
import Popup from './Popup'; 
import "../Css/Popup.css"
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useState } from 'react';

function Newpassword(){
    const { status } = useParams();
    const [phone,setPhone] = useState('')
    const [password,setPassword] = useState('')
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const newpass = async(e) =>{
        e.preventDefault();
       
        const data = {"phone":phone,"newpassword":password}
        try{
            const response = await fetch("http://localhost:3000/newpassword",{
                method:"POST",
                headers:{
                   "Content-Type": "application/json"
                },
                body:JSON.stringify(data) 
               })
               if(!response.ok){
                const error = await response.json()
                console.error(error);
               }
               setShowPopup(true);
               setPopupMessage("Password changed");
        }
        catch(error){
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
        <input type="number" className='input' onChange={(e)=>{setPhone(e.target.value)}} placeholder="Enter your phone number" required/>
        <input type="text" className='input' onChange={(e)=>{setPassword(e.target.value)}} placeholder="Enter your newpassword" required/>
        <button type="button" onClick={(e) => newpass(e)}className='btn'>Submit</button><br/>
        </form>
        <h2><Link className='link' to="/">Login</Link></h2>
        <div>{showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}</div>
    </div>
    </>
        
     )
}

export default Newpassword