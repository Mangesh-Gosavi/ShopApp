import React, { useEffect, useState } from 'react';
import '../Css/Order.css';
import Loader from '../Pages/Loader';
import Header from './Header';
import API_BASE_URL from './config';

function Order() {
    const [userdata, setUserdata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);

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

    const downloadInvoice = async (orderid) => {
        setDownloadingId(orderid);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/invoice/${orderid}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/pdf',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to download invoice (status ${response.status})`);
            }

            const disposition = response.headers.get('Content-Disposition') || '';
            const match = disposition.match(/filename="?([^"]+)"?/i);
            const filename = match ? match[1] : `invoice-${orderid}.pdf`;

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading invoice:', error.message);
            alert('Could not download invoice. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <>
            <div>
                <Header />
                {loading ? (
                    <Loader />
                ) : (
                    <div className="order">
                        <div className="order-cards">
                        <h3>Orders</h3>
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

                                    <div className="order-actions">
                                        <button
                                            type="button"
                                            className="invoice-btn"
                                            onClick={() => downloadInvoice(item.orderid)}
                                            disabled={downloadingId === item.orderid}
                                        >
                                            {downloadingId === item.orderid ? 'Preparing…' : 'Download Invoice'}
                                        </button>
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
