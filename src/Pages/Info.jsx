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
        <Loader />
      ) : (
        <div className="body">
          <div className="logo-container">
            <img className="logoimage" src={Image} alt="Loading" />
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-text">
                  <h1>Pooja Collection</h1>
                </div>
              </div>
            </div>
          </div>


          <h2>Shop By Category</h2>
          <div className="offer">
            {Object.values(category).map((item, index) => (
              <div className="offer-card-container" key={index}>
                <div className="offer-card">
                  <h2>{item.text}</h2>
                  <img className="offercardimg" src={item.image} alt={item.text} />
                  <div className="offer-card-btn-container">
                    <button>Best Deal</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cardimage">
            <img className="cardimg" src={info} alt="Loadings" />
            <img className="cardimg" src={styles} alt="Loading" />
          </div>

          <h2>Latest Products</h2>
          <div className="infocard">
            <Infocard />
          </div>

          <h2>WELCOME REGISTER</h2>
          <div>
            <Signup />
          </div>

          <div>
            <Footer />
          </div>
        </div>
      )}

    </>
  );
}

export default Info;
