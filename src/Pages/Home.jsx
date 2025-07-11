import Header from "./Header"
import Footer from "./Footer"
import Loader from "./Loader";
import "../Css/Header.css"
import Card from "../Pages/Card"
import { useState, useEffect } from "react"

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    const handleBackButton = (event) => {
      event.preventDefault();
      window.history.forward();
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };

  }, []);

  return (
    <>
      <div className="home-container">
        <Header />
        {loading ? (
          <Loader />
        ) : (
          <div className="homealign">
            <div className="productList">
              <Card />
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>

  )
}

export default Home