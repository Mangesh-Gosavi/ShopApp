import React, { useState, useEffect } from 'react';
import '../Css/Review.css'; 
import Popup from './Popup';
import '../Css/Popup.css'

function Review({ productId }) {
  const [user, setUser] = useState({});
  const [reviews, setReviews] = useState([]); 
  const [newReview, setNewReview] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');


  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem('token');
      console.log("Token retrieved:", token);
      const data = {"productid": parseInt(productId)};
      const response = await fetch('http://localhost:3000/reviews' , {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`

         },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const Data = await response.json(); // Update reviews state with new review
        setReviews(Data);
      } 
    };

    const init = async () => {
        try {
          const token = localStorage.getItem('token');
          console.log("Token retrieved:", token);
            const response = await fetch("http://localhost:3000/profile", {
                method: "GET",
                headers: 
                {                        
                  "Accept": "application/json",
                  "Authorization": `Bearer ${token}`

                }
            });

            const data = await response.json();
            setUser(data.email);
            const serializedData = btoa(JSON.stringify(data.email));
            setdata(serializedData);
        } catch (error) {
            console.error(error);
        }
    }
    init();
    fetchReviews();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log("Token retrieved:", token);
    const data = { "email": user, "productid": parseInt(productId), "text": newReview };
    const response = await fetch('http://localhost:3000/addreviews', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`

       },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const newReviewData = await response.json();
      setReviews([...reviews, newReviewData]); // Update reviews state with new review
      setNewReview(''); // Clear input field
      setShowPopup(true);
      setPopupMessage("Review Added successfully")
    } else {
      console.error('Error submitting review:', response.statusText);
      setShowPopup(true);
      setPopupMessage("Error submitting review")
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  return (
    <div className="review-page">
      <h2>User Reviews For Product</h2>

      <div className="reviews-container">
        <ul>
          { reviews.length === 0 ? <h4> No Comments Posted</h4> 
          : reviews.map((review) => (
            review.label === 1 ? <li style={{border:"0.5px solid rgb(192, 186, 186)",borderRadius:"5px"}}>
              <span className="email">{review.email}</span>
              <p className="review">This commment is inappropriate</p>
            </li> : 
            <li style={{border:"0.5px solid rgb(192, 186, 186)",borderRadius:"5px"}}>
              <span className="email">{review.email}</span>
              <p className="review">{review.review}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>{showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}</div>
      <form onSubmit={(e)=>{handleSubmit(e)}} className="new-review-form">
        <h2 htmlFor="new-review">Write a Review:</h2>
        <textarea
          id="new-review"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Enter your review here..."
          required
        />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}

export default Review;
