import Popup from './Popup';
import Loader from "./Loader";
import "../Css/Popup.css";
import "../Css/Cart.css";
import { useEffect, useState } from "react";
import Header from "./Header";
import API_BASE_URL from './config';

function CartItem() {
  const [cartdata, setCartdata] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [charge, setCharge] = useState(50);
  const [price, setPrice] = useState(0);
  const [address, setAddress] = useState('');
  const [method, setMethod] = useState('COD');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // fetchData defined outside useEffect to be reusable
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCartdata(data);

      let total = 0;
      const quantities = {};
      data.forEach(item => {
        total += item.price * item.quantity;
        quantities[item.productid] = item.quantity;
      });
      setSelectedQuantities(quantities);
      setSubtotal(total);
      setPrice(total > 0 ? total + charge : 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quantity change handler for each product
  const handleQuantityChange = (productid, value) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productid]: parseInt(value),
    }));
  };

  const Addprod = async (e, id, brand, product, price, size) => {
    e.preventDefault();
    const quantity = selectedQuantities[id] || 1;
    const data = { productid: id, brand, product, price, quantity, size };

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/addproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      await fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const removeprod = async (e, id, size) => {
    e.preventDefault();
    const quantity = selectedQuantities[id] || 1;
    const data = { productid: id, quantity, size };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/removeproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          // Remove the item matching both productid and size
          setCartdata(prev => prev.filter(item => !(item.productid === id && item.size === size)));
          await fetchData();
        } else {
          console.error("Failed to remove product");
        }
      } else {
        console.error("Failed to remove product");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const book = async (e) => {
    e.preventDefault();
    const data = {
      total: parseInt(price),
      address: address,
      product: cartdata,
      method: method
    };
    try {
      if (method === "COD") {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/orderitem`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          setShowPopup(true);
          setPopupMessage("Your Order is Booked");
          setCartdata([]);
          await fetchData();
        } else {
          setShowPopup(true);
          setPopupMessage("Failed to book your order.");
        }
      } else {
        setShowPopup(true);
        setPopupMessage("Online Method Currently Not Available");
      }
    } catch (error) {
      console.log(error);
      setShowPopup(true);
      setPopupMessage("An error occurred while booking your order.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  return (
    <>
      <Header />
      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}

      {loading ? (
        <Loader />
      ) : (
        <div className='cartbody'>
          <div className='cartalign'>
            <div className='cartleft'>
              <div className="cart-detail-items">
                In cart: <strong>{cartdata.length}</strong>
              </div>
              {cartdata.length === 0 && (
                <div className="cart-empty">Your cart is empty.</div>
              )}
              {cartdata.map((item) => (
                <div className="cartlist" key={`${item.productid}-${item.size}`}>
                  <div className="fixed-height">
                    <div className="cart">
                      <div className="cartimg-wrap">
                        <img className="cartimg" src={item.image} alt={item.product} loading="lazy" />
                      </div>
                      <div className="cart-details">
                        <p className="cart-detail-brand">{item.brand}</p>
                        <h3 className="cart-detail-title">{item.product}</h3>

                        <div className="cart-detail-price-row">
                          <span className="cart-detail-price">₹{item.price}</span>
                          <span className="cart-detail-size-tag">Size: {item.size}</span>
                        </div>

                        <div className="cart-detail-divider"></div>

                        <div className="cart-detail-controls">
                          <div className="cart-detail-control-row">
                            <label htmlFor={`quantity-${item.productid}-${item.size}`}>Quantity</label>
                            <select
                              className="cart-detail-select"
                              name="quantity"
                              id={`quantity-${item.productid}-${item.size}`}
                              value={selectedQuantities[item.productid] || 1}
                              onChange={(e) => handleQuantityChange(item.productid, e.target.value)}
                            >
                              {[...Array(8)].map((_, index) => (
                                <option key={index + 1} value={index + 1}>{index + 1}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="cart-detail-actions">
                          <button
                            className="cart-detail-btn primary"
                            onClick={(e) => Addprod(e, item.productid, item.brand, item.product, item.price, item.size)}
                            type="button"
                          >
                            Add Product
                          </button>
                          <button
                            className="cart-detail-btn secondary"
                            onClick={(e) => removeprod(e, item.productid, item.size)}
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='cartright'>
              <div className='orderDetails'>
                <form className="right" onSubmit={book}>
                  <h2 className="order-heading">Order Summary</h2>

                  <div className="order-row">
                    <span className="order-row-label">Sub Total</span>
                    <span className="order-row-value">₹{subtotal}</span>
                  </div>
                  <div className="order-row">
                    <span className="order-row-label">Delivery Charges</span>
                    <span className="order-row-value">₹{charge}</span>
                  </div>

                  <div className="order-divider"></div>

                  <div className="order-row order-total">
                    <span className="order-row-label">Total</span>
                    <span className="order-row-value">₹{price}</span>
                  </div>

                  <div className="order-field">
                    <label className="order-field-label" htmlFor="address">Delivery Address</label>
                    <input
                      id="address"
                      type="text"
                      onChange={(e) => setAddress(e.target.value)}
                      className="addressinput"
                      placeholder="Enter your delivery address"
                      required
                    />
                  </div>

                  <div className="order-field">
                    <span className="order-field-label">Payment Method</span>
                    <div className='paymthd'>
                      <label htmlFor="offline" className="paymthd-option">
                        <input
                          type="radio"
                          id="offline"
                          name="method"
                          onFocus={() => setMethod("COD")}
                          value="cod"
                          required
                        />
                        Cash on Delivery
                      </label>
                      <label htmlFor="online" className="paymthd-option">
                        <input
                          type="radio"
                          id="online"
                          name="method"
                          onFocus={() => setMethod("online")}
                          value="online"
                          required
                        />
                        Online
                      </label>
                    </div>
                  </div>

                  <button className="paybtn" type="submit">Proceed to Pay</button>
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
