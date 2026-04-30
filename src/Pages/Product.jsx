import Header from "./Header";
import Popup from './Popup';
import Loader from "./Loader";
import "../Css/Popup.css";
import Footer from "./Footer";
import Review from "./Review";
import { useParams } from 'react-router-dom';
import "../Css/Product.css";
import "../Css/Card.css";
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import API_BASE_URL from './config';

function Product() {
    let { id } = useParams();
    const [cartdata, setCartdata] = useState([]);
    const [selectedQuantity, setselectedQuantity] = useState("1");
    const [product, setProduct] = useState("");
    const [size, setsize] = useState('');
    const [similarProducts, setSimilarProducts] = useState([]);
    const [prodsize, setProdsize] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
            const fetchData = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Product.jsx /product response:", data);
                        const item = Array.isArray(data)
                            ? data[0]
                            : (data?.product ?? data?.data ?? data);
                        const productId = item?.productid ?? item?._id;
                        if (item && productId != null) {
                            const normalized = {
                                ...item,
                                productid: productId,
                                stock: item.stock ?? item.stocks ?? 0,
                            };
                            setCartdata([normalized]);
                            setProdsize(item.size ? item.size.split(",") : []);
                            setProduct(item.product);
                        } else {
                            console.error("Unexpected data format:", data);
                        }
                    } else {
                        console.error("Failed to fetch product details:", response.status);
                    }
                } catch (error) {
                    console.error("Error fetching product details:", error);
                } finally {
                    setLoading(false);
                }
            };

            const similardata = async () => {
                try {
                    const token = localStorage.getItem('token');
                    console.log("Token retrieved:", token);
                    const response = await fetch(`${API_BASE_URL}/allproducts`, {
                        method: "GET",
                        headers: {
                            "Accept": "application/json",
                            "Authorization": `Bearer ${token}`

                        }
                    });

                    const data = await response.json();
                    const list = Array.isArray(data) ? data : (data?.products ?? data?.data ?? []);
                    const normalizedList = list.map(item => ({
                        ...item,
                        productid: item.productid ?? item._id,
                        stock: item.stock ?? item.stocks ?? 0,
                    }));
                    setSimilarProducts(normalizedList.filter(item => item.product == product && String(item.productid) !== String(id)));

                } catch (error) {
                    console.error(error);
                }
            };
            similardata();
            fetchData();
        }, 2000);

    }, [product, id]);

    const Addprod = async (e, image, productid, brand, product, price) => {
        e.preventDefault();

        const data = { "image": image, "productid": productid, "brand": brand, "product": product, "size": size, "price": price, "quantity": parseInt(selectedQuantity) };
        try {
            const token = localStorage.getItem('token');
            console.log("Token retrieved:", token);
            const response = await fetch(`${API_BASE_URL}/addproduct`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            setShowPopup(true);
            setPopupMessage("Product Added To Cart");
        }
        catch (error) {
            console.log(error);
        }
    };

    const removeprod = async (e, productid) => {
        e.preventDefault();
        const data = { "productid": productid, "quantity": parseInt(selectedQuantity), "size": size };
        try {
            const token = localStorage.getItem('token');
            console.log("Token retrieved:", token);
            const response = await fetch(`${API_BASE_URL}/removeproduct`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            setShowPopup(true);
            setPopupMessage("Product Removed From Cart");
        }
        catch (error) {
            console.log(error);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupMessage('');
    };

    return (
        <>
            <div>
                <Header />
                {loading ? (
                    <Loader />
                ) : (
                    <div className="productpage">
                        <div>{showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}</div>

                        <div className="product-align">
                            <div className="leftside">
                                <div className="product-list">
                                    {cartdata.length === 0 && (
                                        <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
                                            No product data. Check console — response shape may be unexpected.
                                        </div>
                                    )}
                                    {cartdata.map((item) => {
                                        const stockClass = item.stock <= 0 ? 'out' : item.stock <= 20 ? 'low' : 'in';
                                        const stockLabel = item.stock <= 0 ? 'Out of Stock' : `${item.stock} in stock`;
                                        const showSizeDropdown = ["Shirt", "Tshirt", "Salwar", "Jeans"].includes(item.product);
                                        const sizeOptions = prodsize;
                                        return (
                                            <div className="detail-card" key={item.productid}>
                                                <div className="detail-card-image">
                                                    <img src={item.image} alt={item.product} loading="lazy" />
                                                    {item.discount > 0 && (
                                                        <span className="product-card-badge">{item.discount}% OFF</span>
                                                    )}
                                                </div>
                                                <div className="detail-card-content">
                                                    <p className="detail-card-brand">{item.brand}</p>
                                                    <h2 className="detail-card-title">{item.description}</h2>

                                                    <div className="detail-card-price-row">
                                                        <span className="detail-card-price">₹{item.price}</span>
                                                        {item.discount > 0 && (
                                                            <span className="detail-card-discount-text">{item.discount}% off</span>
                                                        )}
                                                    </div>

                                                    <span className={`detail-card-stock ${stockClass}`}>{stockLabel}</span>

                                                    <div className="detail-card-divider"></div>

                                                    <div className="detail-card-controls">
                                                        {showSizeDropdown && (
                                                            <div className="detail-card-control-row">
                                                                <label htmlFor="size">Size</label>
                                                                <select className="detail-card-select" name="size" value={size} onChange={(e) => setsize(e.target.value)} id="size">
                                                                    <option value="">Select Size</option>
                                                                    {sizeOptions.map((s, index) => (
                                                                        <option key={index} value={s}>{s}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}

                                                        <div className="detail-card-control-row">
                                                            <label htmlFor="quantity">Quantity</label>
                                                            <select className="detail-card-select" name="quantity" value={selectedQuantity} onChange={(e) => setselectedQuantity(e.target.value)} id="quantity">
                                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                                                    <option key={n} value={n}>{n}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="detail-card-actions">
                                                        <button
                                                            className="detail-card-btn primary"
                                                            type="button"
                                                            disabled={item.stock <= 0}
                                                            onClick={(e) => Addprod(e, item.image, item.productid, item.brand, item.product, item.price)}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                        <button
                                                            className="detail-card-btn secondary"
                                                            type="button"
                                                            onClick={(e) => removeprod(e, item.productid)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="rightside">
                                <div className="similar-products">
                                    <h3>Similar Products For You</h3>
                                    <div className="rightscroll">
                                        <div className="rightcard">
                                            {similarProducts.map((similarProduct) => (
                                                <div className="product-card" key={similarProduct.productid}>
                                                    <div className="product-card-image">
                                                        <Link to={`/Product/${similarProduct.productid}`}>
                                                            <img src={similarProduct.image} alt={similarProduct.product} loading="lazy" />
                                                        </Link>
                                                        {similarProduct.discount > 0 && (
                                                            <span className="product-card-badge">{similarProduct.discount}% OFF</span>
                                                        )}
                                                    </div>
                                                    <div className="product-card-content">
                                                        <p className="product-card-brand">{similarProduct.brand}</p>
                                                        <Link to={`/Product/${similarProduct.productid}`} className="text">
                                                            <h4 className="product-card-title">{similarProduct.description}</h4>
                                                        </Link>
                                                        <div className="product-card-price-row">
                                                            <span className="product-card-price">₹{similarProduct.price}</span>
                                                        </div>
                                                        <div className="product-card-meta">
                                                            <span><strong>Size:</strong> {similarProduct.size}</span>
                                                            <span><strong>Stock:</strong> {similarProduct.stock > 0 ? similarProduct.stock : 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="productreview">
                            <Review productId={id} />
                            <Footer />
                        </div>
                    </div>
                )}
            </div>
        </>

    );
}

export default Product;
