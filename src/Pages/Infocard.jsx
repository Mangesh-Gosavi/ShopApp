import React, { useEffect, useState } from "react";
import "../Css/Infocard.css";
import API_BASE_URL from './config';

function Infocard() {
  const [proddata, setProddata] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/allproducts`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setProddata(data);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) {
    return <p className="infocard-status">Loading products...</p>;
  }

  const items = Array.isArray(proddata) ? proddata : (proddata?.products ?? proddata?.data ?? []);

  if (items.length === 0) {
    return <p className="infocard-status">No products available.</p>;
  }

  return (
    <div className="infocard-container">
      {items.map((item, index) => {
        const id = item.productid ?? item._id;
        const stock = item.stock ?? item.stocks ?? 0;
        return (
          <div className="infocard-item" key={id ?? index}>
            <div className="infocard-image">
              <img src={item.image} alt={item.description} loading="lazy" />
              {item.discount > 0 && (
                <span className="infocard-badge">{item.discount}% OFF</span>
              )}
            </div>
            <div className="infocard-content">
              <span className="infocard-id">#{index + 1}</span>
              <p className="infocard-brand">{item.brand}</p>
              <h4 className="infocard-title">{item.description}</h4>
              <div className="infocard-price-row">
                <span className="infocard-price">₹{item.price}</span>
              </div>
              <div className="infocard-meta">
                <span><strong>Size:</strong> {item.size}</span>
                <span><strong>Stock:</strong> {stock > 0 ? stock : 0}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Infocard;
