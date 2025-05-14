import Header from "./Header";
import Popup from './Popup';
import Loader from "./Loader";
import "../Css/Popup.css";
import Footer from "./Footer";
import Review from "./Review";
import { useParams } from 'react-router-dom';
import "../Css/Product.css";
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
                        if (data && data._id) {
                            setCartdata([data]);
                            setProdsize(data.size ? data.size.split(" ") : []);
                            setProduct(data.product);
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
                    setSimilarProducts(data.filter(item => item.product == product && item._id != id));

                } catch (error) {
                    console.error(error);
                }
            };
            similardata();
            fetchData();
        }, 2000);

    }, [product, id]);

    const Addprod = async (e, image, _id, brand, product, price) => {
        e.preventDefault();

        const data = { "image": image, "productid": _id, "brand": brand, "product": product, "size": size, "price": price, "quantity": parseInt(selectedQuantity) };
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

    const removeprod = async (e, _id) => {
        e.preventDefault();
        const data = { "productid": _id, "quantity": parseInt(selectedQuantity), "size": size };
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
                                    {cartdata.map((item) => (
                                        <div className="productcard" key={item._id}>
                                            <img className="productimg" src={item.image} alt="img" />
                                            <div className="product-details">
                                                <h2>{item.brand}</h2>
                                                <h2>{item.description}</h2>
                                                {item.product === "Shirt" || item.product === "Tshirt" || item.product === "Salwar" ? (
                                                    <h3>Size:
                                                        <select name="size" value={size} onChange={(e) => setsize(e.target.value)} id="size">
                                                            <option value="">Select Size</option>
                                                            {prodsize.map((item, index) => (
                                                                <option key={index} value={item}>{item}</option>
                                                            ))}
                                                        </select>
                                                    </h3>
                                                ) : item.product === "Jeans" ? (
                                                    <h3>Size:
                                                        <select name="size" value={size} onChange={(e) => setsize(e.target.value)} id="size">
                                                            <option value="">Select Size</option>
                                                            <option value="28">28</option>
                                                            <option value="30">30</option>
                                                            <option value="32">32</option>
                                                            <option value="34">34</option>
                                                            <option value="36">36</option>
                                                            <option value="38">38</option>
                                                            <option value="40">40</option>
                                                            <option value="42">42</option>
                                                        </select>
                                                    </h3>
                                                ) : null}
                                                <h3>Price: ₹{item.price}</h3>
                                                <h2 className={item.stocks <= 20 ? 'out-of-stock' : 'in-stock'}>In stock: {item.stocks}</h2>
                                                <h3>Quantity:
                                                    <select name="quantity" value={selectedQuantity} onChange={(e) => setselectedQuantity(e.target.value)} id="quantity">
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                        <option value="6">6</option>
                                                        <option value="7">7</option>
                                                        <option value="8">8</option>
                                                    </select>
                                                </h3>
                                                <div className="button-group">
                                                    <button className="productbtn" onClick={(e) => Addprod(e, item.image, item._id, item.brand, item.product, item.price)} type="button">Add Product</button>
                                                    <button className="productbtn" onClick={(e) => removeprod(e, item._id)} type="button">Remove Product</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rightside">
                                <div className="similar-products">
                                    <h3>Similar Products For You</h3>
                                    <div className="rightscroll">
                                        <div className="rightcard">
                                            {similarProducts.map((similarProduct) => (
                                                <div className="similar-product" key={similarProduct._id}>
                                                    <Link to={`/Product/${similarProduct._id}`}>
                                                        <img className="cardimg" src={similarProduct.image} alt="img" />
                                                    </Link>
                                                    <span>{similarProduct.brand}</span>
                                                    <span>
                                                        <Link to={`/Product/${similarProduct._id}`} className="text">
                                                            {similarProduct.description}
                                                        </Link>
                                                    </span>
                                                    <span>Price: ₹{similarProduct.price} Discount: {similarProduct.discount}%</span>
                                                    <h2 className={similarProduct.stocks <= 20 ? 'out-of-stock' : 'in-stock'}>
                                                        In stock: {similarProduct.stocks}
                                                    </h2>
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
