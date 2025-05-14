import React, { useEffect, useState } from 'react';
import '../Css/Order.css';
import Loader from '../Pages/Loader';
import Header from './Header';
import API_BASE_URL from './config';

function Order() {
    const [userdata, setUserdata] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token retrieved:', token);

                const response = await fetch(`${API_BASE_URL}/userorder`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}, message: ${await response.text()}`);
                }

                const data = await response.json();
                console.log(data);
                setUserdata(data);
            } catch (error) {
                console.error('Error fetching orders:', error.message);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    return (
        <>
            <div>
                <Header />
                {loading ? (
                    <Loader />
                ) : (
                    <div className="order">
                        <h3>Orders</h3>
                        <div className="order-cards">
                            {userdata.map((item) => (
                                <div className="order-card" key={item.orderid}>
                                    <div className="order-row">
                                        <strong>Order ID:</strong>
                                        <span>{item.orderid}</span>
                                    </div>
                                    <div className="order-row">
                                        <strong>Total Amount:</strong>
                                        <span>{item.totalamount}</span>
                                    </div>
                                    <div className="order-row">
                                        <strong>Address:</strong>
                                        <span>{item.address}</span>
                                    </div>
                                    <div className="order-row">
                                        <strong>Booked Date:</strong>
                                        <span>
                                            {new Date(item.bookeddate).toLocaleDateString('en-GB')} {new Date(item.bookeddate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <div className="order-row">
                                        <strong>Status:</strong>
                                        <span>{item.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                )}
            </div>
        </>
    );
}

export default Order;
