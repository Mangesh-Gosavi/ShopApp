import { useEffect } from 'react'
import '../Css/Order.css'
import Loader from '../Pages/Loader';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';


function Order() {
    const [userdata,setUserdata] = useState([])
    const [loading, setLoading] = useState(true);
    let { userid } = useParams();
    console.log(userid);
    

    useEffect(() => {
        const init = async () => {
            try {
              const token = localStorage.getItem('token');
              console.log("Token retrieved:", token);
                const response = await fetch(`http://localhost:3000/userorder`, {
                    method: "GET",
                    headers: 
                    {                        
                      "Accept": "application/json",
                      "Authorization": `Bearer ${token}`
                    }
                });
    
                const data = await response.json();
                console.log(data);
                setUserdata(data);
            } catch (error) {
                console.error(error);
            }
        }
        init();

            setTimeout(() => {
              setLoading(false); 
            }, 2000); 
    }, [userid]);


  return (
    <>
    <div>
      <Header/>
    {loading ? (
       <Loader/>
    ) :
      (  <div className="order-container">
          <div className="order"> 
              <h3>Orders</h3>
              <table className="detail">
                  <tr>
                      <th>OrderID</th>
                      <th>TotalAmount</th>
                      <th>Address</th>
                      <th>BookedDate</th>
                      <th>Status</th>
                  </tr>
                  {userdata.map((item) => (
                      <tr key={item.orderid}>
                          <td>{item.orderid}</td>
                          <td>{item.totalamount}</td>
                          <td>{item.address}</td>
                          <td>{item.bookeddate}</td>
                          <td>{item.status}</td>
                      </tr>
                  ))}
              </table>
          </div>
      </div>
    )}
    </div>
    </>
  )
}

export default Order
