import React, { useState, useEffect } from "react";
import "../Css/Info.css";
import Loader from '../Pages/Loader';
import Image from "../Images/image.png";
import women from "../Images/women.jpg";
import kid from "../Images/kid.jpg";
import men from "../Images/men.jpg";
import Footer from "../Pages/Footer";
import info from "../Images/info.png";
import styles from "../Images/styles.png";
import Infocard from "../Pages/Infocard";
import Signup from "../Pages/Signup";

function Info() {
  const [loading, setLoading] = useState(true);
  
  const category = {
    0: { text: "Women Clothes", image: women },
    1: { text: "Kid Clothes", image: kid },
    2: { text: "Men Clothes", image: men },
  };
  
  const data = {
    0: { text: "Best Shipping Method", image: women },
    1: { text: "Secure Payment System", image: kid },
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); 
    }, 2000); 
  }, []);

  return (
    <>
      {loading ? (
        <Loader/>
      ) : (
        <div className="body">
          <div style={{ position: "relative", width: "100%" }}>
            <img className="logoimage" src={Image} alt="Loading" />
            <div style={{ position: "absolute", bottom: "0", width: "100%" }}>
              <div className="" style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                <div style={{ position: "absolute", color: "black", bottom: "0", height: "100px", width: "100%", background: "black", opacity: "0.5" }}></div>
                <div style={{ position: "absolute", color: "white", fontSize: "20px", bottom: "0", display: "flex", justifyContent: "center" }}>
                  <h1>Pooja Collection</h1>
                </div>
              </div>
            </div>
          </div>

          <h2>Shop By Category</h2>
          <div className="offer">
            {Object.values(category).map((item, index) => (
              <div style={{ width: "300px", gap: "10px" }} key={index}>
                <div style={{ background: "light-gray", padding: "15px", borderRadius: "20px", border: "1px solid rgb(204, 201, 201)" }}>
                  <h2>{item.text}</h2>
                  <img className="cardimg" src={item.image} alt={item.text} />
                  <div style={{ marginTop: "10px" }}>
                    <button>Best Deal</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cardimage">
            <img style={{ marginBottom: "20px" }} src={info} alt="Loadings" />
            <img style={{ marginBottom: "20px" }} src={styles} alt="Loading" />
          </div>

          <h2>Latest Products</h2>
          <div className="infocard">
            <Infocard />
          </div>
          
          <h2>WELCOME REGISTER</h2>
          <div style={{ width: "100svw", marginBottom: "50px", display: "flex", justifyContent: "center" }}>
            <Signup />
          </div>
          
          <div style={{ width: "100svw", marginRight: "-11px" }}>
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}

export default Info;
