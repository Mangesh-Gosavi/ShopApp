import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../Css/Search.css';
import API_BASE_URL from './config';

function Search({ prodData, onResultClick }) {
    const [prodlist, setProdlist] = useState([]);
    const [searchbg, setsearchbg] = useState(false);


    useEffect(() => {
        const init = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/allproducts`, {
                    method: "GET",
                    headers: { "Accept": "application/json" }
                });

                const data = await response.json();

                if (prodData && prodData.trim()) {
                    setProdlist(data.filter(item =>
                        item.description.toLowerCase().includes(prodData.trim()) ||
                        item.brand.toLowerCase().includes(prodData.trim()) ||
                        item.product.toLowerCase().includes(prodData.trim())
                    ));
                    setsearchbg(true);
                } else {
                    setProdlist([]);
                    setsearchbg(false);
                }

            } catch (error) {
                console.error(error);
            }
        };
        init();
    }, [prodData]);

    return (
        <>
            {searchbg && prodlist.length > 0 && (
                <div className="prodlist-container">
                    {prodlist.map((item, index) => (
                        <Link to={`/Product/${item.productid}`} className="prod-description" onClick={onResultClick} key={index}>
                            <div className="prod-item">
                                <div className="prod-card">
                                    <div className="prod-card-content">
                                        <img className="prod-img" src={item.image} alt="img" />
                                        <div className="prod-details">
                                            <h1>{item.brand}</h1>
                                            <h1>{item.description}</h1>
                                            <h2>Price: ₹{item.price}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>

    );
}

export default Search;
