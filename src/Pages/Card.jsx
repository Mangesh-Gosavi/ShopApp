import "../Css/Card.css"
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react"
import API_BASE_URL from './config';

function Card() {
    const [proddata, setProddata] = useState([])

    useEffect(() => {
        const init = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/allproducts`, {
                    method: "GET",
                    headers:
                    {
                        "Accept": "application/json",
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
            {proddata.map((item) => (
                <div className="cardbg" key={item._id}>
                    <div className="card">
                        <div className="card-content">
                            <Link to={`/Product/${item._id}`}>
                                <img className="cardimg" src={item.image} alt="img" />
                            </Link>
                            <h1 className="brand">{item.brand}</h1>
                            <Link to={`/Product/${item._id}`} className="text">
                                <h1 className="description">{item.description}</h1>
                            </Link>
                            <h2 className="price">Price: ₹{item.price} &nbsp; Discount: {item.discount}%</h2>
                            <h2 className={`stock ${item.stocks <= 0 ? "out" : item.stocks <= 20 ? "low" : "in"}`}>
                                {item.stocks > 0 ? `Instocks: ${item.stocks}` : "Out of Stock"}
                            </h2>
                        </div>
                    </div>
                </div>
            ))}
        </>

    )
}

export default Card