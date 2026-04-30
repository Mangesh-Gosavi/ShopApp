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

    const items = Array.isArray(proddata) ? proddata : (proddata?.products ?? proddata?.data ?? []);

    return (
        <div className="product-cards">
            {items.map((item, index) => {
                const id = item.productid ?? item._id;
                const stock = item.stock ?? item.stocks ?? 0;
                return (
                    <div className="product-card" key={id ?? index}>
                        <div className="product-card-image">
                            <Link to={`/Product/${id}`}>
                                <img src={item.image} alt={item.product} loading="lazy" />
                            </Link>
                            {item.discount > 0 && (
                                <span className="product-card-badge">{item.discount}% OFF</span>
                            )}
                        </div>
                        <div className="product-card-content">
                            <p className="product-card-brand">{item.brand}</p>
                            <Link to={`/Product/${id}`} className="text">
                                <h4 className="product-card-title">{item.description}</h4>
                            </Link>
                            <div className="product-card-price-row">
                                <span className="product-card-price">₹{item.price}</span>
                            </div>
                            <div className="product-card-meta">
                                <span><strong>Size:</strong> {item.size}</span>
                                <span><strong>Stock:</strong> {stock > 0 ? stock : 0}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default Card
