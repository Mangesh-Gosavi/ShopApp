import Popup from './Popup';
import Loader from "./Loader";
import "../Css/Popup.css"
import "../Css/Cart.css"
import { useEffect, useState } from "react";
import Header from "./Header"
import API_BASE_URL from './config';

function CartItem() {
  const [cartdata, setCartdata] = useState([]);
  const [selectedQuantity, setselectedQuantity] = useState("1");
  const [subtotal, setsubtotal] = useState(0);
  const [charge, setcharge] = useState(50);
  const [price, setprice] = useState(0);
  const [address, setaddress] = useState('');
  const [method, setmethod] = useState('COD');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Token retrieved:", token);
        const response = await fetch(`${API_BASE_URL}/cart`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log(data)
        setCartdata(data);

        let total = 0;
        for (let i of data) {
          total += (i.price * i.quantity);
        }
        setsubtotal(total);

        if (subtotal === 0) {
          setprice(0);
        } else {
          setprice(subtotal + charge);
        }

      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [price, subtotal, charge]);

  const Addprod = async (e, id, brand, product, price, size) => {
    e.preventDefault();

    const data = { "productid": id, "brand": brand, "product": product, "price": price, "quantity": parseInt(selectedQuantity), "size": size };
    try {
      const token = localStorage.getItem('token');
      console.log("Token retrieved:", token);
      await fetch(`${API_BASE_URL}/addproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.log(error);
    }

    window.location.reload();

  }

  const removeprod = async (e, id, size) => {
    e.preventDefault();
    const data = { "productid": id, "quantity": parseInt(selectedQuantity), "size": size }
    try {
      const token = localStorage.getItem('token');
      console.log("Token retrieved:", token);
      const response = await fetch(`${API_BASE_URL}/removeproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      // Remove product
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          setCartdata(prevCartData => prevCartData.filter(item => item.productid !== id && item.size !== size));
        } else {
          console.error("Failed to remove product");
        }
      } else {
        console.error("Failed to remove product");
      }
    } catch (error) {
      console.log(error);
    }
    window.location.reload();

  }

  const book = async (e) => {
    e.preventDefault();
    const data = {
      "total": parseInt(price),
      "address": address,
      "product": cartdata,
      "method": method
    };
    try {
      if (method === "COD") {
        const token = localStorage.getItem('token');
        console.log("Token retrieved:", token);
        const response = await fetch(`${API_BASE_URL}/orderitem`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });
        setShowPopup(true);
        setPopupMessage("Your Order is Booked");
        setCartdata([]);
        window.location.reload();
      } else {
        setShowPopup(true);
        setPopupMessage("Online Method Currently Not Available");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  return (
    <>
      <div>
        <Header />
        <div>{showPopup && <Popup message={popupMessage} onClose={closePopup} />}</div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className='cartbody'>
          <div className='cartalign'>
            <div className='cartleft'>
              {cartdata.map((item) => (
                <div className="cartlist" key={item.productid}>
                  <div className="fixed-height">
                    <div className="cart">
                      <img className="cartimg" src={item.image} alt="img" />
                      <div className="cart-details">
                        <h1>{item.brand}</h1>
                        <h2>Price: ₹{item.price}</h2>
                        <h2>Size: {item.size}</h2>
                        <h2 className='detailgap'>
                          <div>
                            Quantity:
                            <select name="quantity" value={selectedQuantity} onChange={(e) => { setselectedQuantity(e.target.value) }} id="quantity">
                              {[...Array(8)].map((_, index) => (
                                <option key={index + 1} value={index + 1}>{index + 1}</option>
                              ))}
                            </select>
                          </div>
                          Items: {item.quantity}
                        </h2>
                        <button className="cartbtn" onClick={(e) => Addprod(e, item.productid, item.brand, item.product, item.price, item.size)} type="button">
                          Add Product
                        </button>
                        <button className="cartbtn" onClick={(e) => removeprod(e, item.productid, item.size)} type="button">
                          Remove Product
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='cartright'>
              <div className='orderDetails'>
                <form className="right" onSubmit={book}>
                  <h2 className="order-heading">Order Details</h2>
                  <h4 className="order-row">Sub Total: ₹{subtotal}</h4>
                  <h4 className="order-row">Delivery Charges: ₹{charge}</h4>
                  <h4 className="order-row">Total: ₹{price}</h4>
                  <h4 className="order-row">Delivery Address:</h4>
                  <input type="text" onChange={(e) => setaddress(e.target.value)} className="addressinput" required />
                  <h4>Please select your payment method</h4>
                  <div className='paymthd'>
                    <label htmlFor="offline"><input type="radio" id="offline" name="method" onFocus={() => { setmethod("COD") }} value="cod" required />Cash on Delivery</label>
                    <label htmlFor="online"><input type="radio" id="online" name="method" onFocus={() => { setmethod("online") }} value="online" required />Online</label><br />
                  </div>
                  <button className="paybtn">Proceed to Pay</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>

  );
}

export default CartItem;
