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
    return <p>Loading products...</p>;
  }

  if (proddata.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <div className="infocard-container">
      {proddata.map((item) => (
        <div className="cardbg" key={item._id}>
          <div className="card">
            <div style={{ width: "100%" }}>
              <img
                className="cardimg"
                src={item.image}
                alt={item.description}
              />
              <h1>{item.brand}</h1>
              <h1>{item.description}</h1>
              <h2>
                Price: ₹{item.price} Discount: {item.discount}%
              </h2>
              <h2 style={{ color: item.stocks <= 20 ? "red" : "green" }}>
                {item.stocks > 0
                  ? `In Stock: ${item.stocks}`
                  : <h2 style={{ color: "red" }}>Out of Stock</h2>}
              </h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Infocard;
