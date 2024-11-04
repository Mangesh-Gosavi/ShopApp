import Header from "./Header"
import Popup from './Popup'; 
import Loader from "./Loader";
import "../Css/Popup.css"
import Footer from "./Footer"
import Review from "./Review";
import { useParams } from 'react-router-dom';
import { useNavigate} from "react-router-dom";
import "../Css/Product.css"
import { Link } from 'react-router-dom'
import {useEffect, useState } from "react";

function Product(){
    let { id } = useParams();
    const [cartdata, setCartdata] = useState([]);
    const [selectedQuantity, setselectedQuantity] = useState("1");
    const [product, setProduct] = useState("");
    const [size, setsize] = useState('');
    const [similarProducts, setSimilarProducts] = useState([]);
    const [prodsize, setProdsize] = useState([]);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const token = localStorage.getItem('token');
            console.log("Token retrieved:", token);
            const response = await fetch(`http://localhost:3000/product/${id}`, {
              method: "GET",
              headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
              }
            }
            );
            const data = await response.json();
            setCartdata(data);
            setProdsize(data[0].size.split(' '))
            console.log("Sizes",prodsize)
            setProduct(data[0].product)

          } catch (error) {
            console.error(error);
          }
        };
        fetchData();

        const similardata = async () => {
          try {
            const token = localStorage.getItem('token');
            console.log("Token retrieved:", token);
            const response = await fetch("http://localhost:3000/allproducts", {
              method: "GET",
              headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`

              }
            });
  
            const data = await response.json();
            setSimilarProducts(data.filter(item => item.product == product && item.productid != id));
  
          } catch (error) {
            console.error(error);
          }
        };
        similardata();

        setTimeout(() => {
          setLoading(false); 
        }, 2000); 
        
        const handleBackButton = (event) => {
          event.preventDefault();
          navigate("/Home");
        };
      
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', handleBackButton);
      
        return () => {
          window.removeEventListener('popstate', handleBackButton);
        };
      }, [product, id]);

    const Addprod = async(e,image,id,brand,product,price) =>{
        e.preventDefault();

        const data = {"image":image,"productid":id,"brand":brand,"product":product,"size":size,"price":price,"quantity": parseInt(selectedQuantity) }
        try{
          const token = localStorage.getItem('token');
          console.log("Token retrieved:", token);
           const response = await fetch("http://localhost:3000/addproduct",{
                method:"POST",
                headers:{
                   "Content-Type": "application/json",
                   "Authorization": `Bearer ${token}`

                },
                body:JSON.stringify(data) 
               })
              setShowPopup(true);
              setPopupMessage("Product Added To Cart")
        }
        catch(error){
            console.log(error);
        }
      }
    
      const removeprod = async(e,id) =>{
        e.preventDefault();
        const data = {"productid":id,"quantity": parseInt(selectedQuantity),"size":size}
        try{
          const token = localStorage.getItem('token');
          console.log("Token retrieved:", token);
          const response = await fetch("http://localhost:3000/removeproduct",{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`

            },
            body:JSON.stringify(data) 
            })
        setShowPopup(true);
        setPopupMessage("Product Removed From Cart")   
            
        }
        catch(error){
            console.log(error);
        }
    }

    const closePopup = () => {
      setShowPopup(false);
      setPopupMessage('');
    };
    
    return (
      <>
      <div>
        <div className="header"><Header/></div>
      {loading ? (
        <Loader/>
      ) :
        (<div className="productpage"> 
        <div>{showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}</div>
        
          <div className="leftside" >
            <div className="productalign" >
              <div style={{flexGrow : "1",marginBottom:"20px"}} >
              {cartdata.map((item) => (
                    <div className="productcard">
                        <img className="productimg" src={item.image} alt="img" />
                        <div style={{display :"flex",fontSize:"15px",flexDirection : "column",alignItems : "center",justifyContent: "center"}}>
                        <h2>{item.brand}</h2>
                        <h2>{item.description}</h2>
                          {item.product === "Shirt" || item.product === "Tshirt" || item.product === "Salwar" ? (
                            <h3>Size:
                            <select name="size" value={size} onChange={(e)=>{setsize(e.target.value)}} id="size">
                                <option value="">Select Size</option>
                                {prodsize.map((item)=>{
                                  return <option value={item}>{item}</option>
                                })}
                                
                            </select>
                          </h3>
                            ) : item.product === "Jeans"? (
                            <h3>Size:
                                <select name="size" value={size} onChange={(e)=>{setsize(e.target.value)}} id="size">
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
                            ) : null }
                          <h3>Price:₹{item.price}</h3>
                          {item.stock <=20 ? (
                          <h3 style={{color:"red"}}>Instocks:{item.stock}</h3>
                          ) : item.stock > 20 ? (
                            <h3 style={{color:"green"}}>Instocks:{item.stock}</h3>
                          ) : null }
                          <h3>Quantity:<select name="quantity" value={selectedQuantity} onChange={(e)=>{setselectedQuantity(e.target.value)}} id="quantity">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option></select></h3>
                        <div style={{display : "flex",flexDirection  :"column"}}>
                        <button className="productbtn" onClick={(e) => Addprod(e,item.image,item.productid,item.brand,item.product,item.price)} type="button">Add Product</button> 
                        <button className="productbtn" onClick={(e) => removeprod(e,item.productid)} type="button">Remove Product</button></div>
                        </div>
                        
                    </div>
                  ))} 
            </div>
             
            <div>
            <h3 style={{color:"#1f285e",marginTop:"-15px",backgroundColor :"transparent",textAlign:"center"}}>Similar Products For You</h3>
            <div className="rightscroll">
              <div className="rightside">
                {
                  similarProducts.map((similarProduct)=>{
                    return(
                      <div style={{display:"flex",alignItems:"center",textAlign:"center",flexDirection:"column",gap:"15px",flexWrap:"wrap",borderRadius:"30px",border: "0.5px solid rgb(192, 186, 186)", padding:"20px"}}>
                        <Link to={`/Product/${similarProduct.productid}`}><img className= 'cardimg' src={similarProduct.image} alt="img"/></Link>
                        <span>{similarProduct.brand}</span>
                        <span><Link to={`/Product/${similarProduct.productid}`} className="text">{similarProduct.description}</Link></span>
                        <span>Price:₹{similarProduct.price} Discount:{similarProduct.discount}%</span>
                        {similarProduct.stock <=20 ? (
                          <h2 style={{color:"red",fontSize:"17px"}}>Instocks:{similarProduct.stock}</h2>
                          ) : similarProduct.stock > 20 ? (
                            <h2 style={{color:"green",fontSize:"17px"}}>Instocks:{similarProduct.stock}</h2>
                          ) : null }
                      </div>
                     
                    )
                  })
                }
              </div>
            </div>
            </div>
          </div>
        </div>
        <div className="productreview">
        <Review productId={id}/>
        <Footer/>
        </div>
        </div>)
      } 
      </div>
      </>
     )
}

export default Product