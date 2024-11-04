import "../Css/Card.css"
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react"

function Card(){
    const [proddata,setProddata] = useState([])

    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log("Token retrieved:", token);
                const response = await fetch("http://localhost:3000/allproducts", {
                    method: "GET",
                    headers: 
                    {                        
                      "Accept": "application/json",
                      "Authorization": `Bearer ${token}`
                    }
                });
    
                const data = await response.json();
                console.log(data);
                setProddata(data);
            } catch (error) {
                console.error(error);
            }
        }
        init();
    }, []);

    return (
    <>
    {proddata.map((item)=>{
    return(
    <div className="cardbg">
        <div className="card">
            <div style={{width:"100%"}}>
                <Link to={`/Product/${item.productid}`}><img className= 'cardimg' src={item.image} alt="img"/></Link>
                <h1>{item.brand}</h1>
                <Link to={`/Product/${item.productid}`} className="text"><h1>{item.description}</h1></Link>
                 <h2>Price:₹{item.price} Discount:{item.discount}%</h2>
                 {item.stock <=20 ? (
                    <h2 style={{color:"red"}}>Instocks:{item.stock}</h2>
                    ) : item.stock > 20 ? (
                        <h2 style={{color:"green"}}>Instocks:{item.stock}</h2>
                    ) : null }
            </div>
        </div> 
     </div> )
        })}
    </>
     )
}

export default Card