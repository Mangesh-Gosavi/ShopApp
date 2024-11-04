import img from "../Images/shop.jpg"
import "../Css/Infocard.css"
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react"

function Infocard(){
    const [proddata, setProddata] = useState([])

    useEffect(() => {
        const init = async () => {
            try {
                const response = await fetch("http://localhost:3000/allproducts", {
                    method: "GET",
                    headers: { "Accept": "application/json" }
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
        <div className="infocard-container">
            {proddata.map((item) => (
                <div className="cardbg" key={item.productid}>
                    <div className="card">
                        <div style={{ width: "100%" }}>
                            <Link to={`/Product/${item.productid}`}>
                                <img className='cardimg' src={item.image} alt="img" />
                            </Link>
                            <h1>{item.brand}</h1>
                            <Link to={`/Product/${item.productid}`} style={{ maxWidth: "500px", color: "black", textDecoration: "none", textAlign: "center", whiteSpace: "nowrap" }}>
                                <h1>{item.description}</h1>
                            </Link>
                            <h2>Price: ₹{item.price} Discount: {item.discount}%</h2>
                            {item.stock <= 20 ? (
                                <h2 style={{ color: "red" }}>Instocks: {item.stock}</h2>
                            ) : (
                                <h2 style={{ color: "green" }}>Instocks: {item.stock}</h2>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Infocard;
