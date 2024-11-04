import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../Css/Search.css';

function Search({ prodData }) {
    const [prodlist, setProdlist] = useState([]);
    const [searchbg, setsearchbg] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const response = await fetch("http://localhost:3000/allproducts", {
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

    useEffect(() => {
        if (searchbg) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [searchbg]);

    return (
        <>
            {searchbg && (
                <div style={{
                    position: "fixed",
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    top: 0,
                    left: 0,
                    zIndex: 1
                }}></div>
            )}

            {searchbg && prodlist.length > 0 && (  
                <div style={{
                    position: "fixed",
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "70px",
                    border: "1px solid rgb(192, 186, 186)",
                    borderRadius: "5px",
                    width: "400px",
                    maxHeight: "85vh",  
                    overflowY: "auto", 
                    backgroundColor: "white",
                    zIndex: 2,
                    padding: "10px",
                    boxSizing: "border-box"
                }}>
                    {prodlist.map((item, index) => (
                        <div className="bg" key={index} style={{ width: "100%" }}>
                            <div className="card">
                                <div style={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
                                    <Link to={`/Product/${item.productid}`}>
                                        <img className='img' src={item.image} alt="img" />
                                    </Link>
                                    <div style={{ marginLeft: "10px", textAlign: "left" }}>
                                        <h1>{item.brand}</h1>
                                        <Link to={`/Product/${item.productid}`} className="text">
                                            <h1>{item.description}</h1>
                                        </Link>
                                        <h2>Price: ₹{item.price}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Search;
