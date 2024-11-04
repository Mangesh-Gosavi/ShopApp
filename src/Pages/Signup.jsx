import { useState } from "react"
import '../Css/Signup.css'
import { Link } from "react-router-dom"
import { CircleUser } from 'lucide-react';
import { KeyRound } from 'lucide-react';
import { BookUser } from 'lucide-react';
import Popup from './Popup';
import '../Css/Popup.css'
import { Mail } from 'lucide-react';
import { useNavigate } from "react-router-dom";


function Signup(){
  const userId = randomid()
  const [name,setName] = useState('')
  const [phone,setPhone] = useState('')
  const [email,setEmail] =useState('')
  const [password,setPassword] = useState('') 
  const [repassword,setRepassword] = useState('') 
  const [error, seterror] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();
  

  function randomid(){
    var characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var lenString = 7;
    var randomstring = '';  
    for (var i=0; i<lenString; i++) {  
      var rnum = Math.floor(Math.random() * characters.length);  
      randomstring += characters.substring(rnum, rnum+1);  
    }  
    return randomstring
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(name.length != 0 && phone.length != 0 &&  email.length != 0 &&  password.length != 0 && repassword.length != 0){
        if(phone.length < 11 && phone.length > 9){
          if(password == repassword){
            const data = {"id":userId,"name":name,"phone":phone,"email":email,"password":password}
            try {
                const response = await fetch("http://localhost:3000/Signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
                
              if (!response.ok) {
                const error = await response.json()
                seterror(error.message)
                setShowPopup(true);
                setPopupMessage(error.message)
                return;
              }
              navigate("/Home");
              
            } catch (error) {
                console.error("Error:", error);
            }
          }
          else{
            seterror("Both Passwords don't match!")
            setShowPopup(true);
            setPopupMessage("Both Passwords don't match!");
            return;
          }
        }
        else{
          seterror("Invalid Number Please Recheck!")
          setShowPopup(true);
          setPopupMessage("Invalid Number Please Recheck!");
          return;
        }
    }
    else{
      seterror("Please Fill All The Details!")
      setShowPopup(true);
      setPopupMessage("Please Fill All The Details!");
      return;
    }
  }
    
    return (
        <div  className='center-body'>
        <form className='form ' onSubmit={handleSubmit}>
          <h2>Sign Up</h2><br/>
          <div className="content"><CircleUser/><input className="uinput" name="uname" type="text" placeholder="Name" onChange={(e)=>setName(e.target.value)} require/></div><br/>
          <div className="content"><BookUser/><input className="uinput" name="uphone" type="number" placeholder="Phone Number" onChange={(e)=>setPhone(e.target.value)} require/></div><br/>
          <div className="content"><Mail/><input className="uinput" name="uemail" type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} require/></div><br/>
          <div className="content"><KeyRound/><input className="uinput" type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} require/></div><br/>
          <div className="content"><KeyRound/><input className="uinput" type="password" placeholder="Re-enter Password" onChange={(e)=>setRepassword(e.target.value)} require/></div><br/>
          <button className='loginbtn' type="submit">Submit</button><br/>
          <h5>Already have an account? <Link className='link' to="/Login">Signin</Link></h5>
        </form>
        <div>{showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}</div>
      </div>
    
     )
}

export default Signup