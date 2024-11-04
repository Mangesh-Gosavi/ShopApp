import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importing BrowserRouter and Routes
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';
import Product from './Pages/Product';
import Order from './Pages/Orders';
import Cart from './Pages/Cart';
import Forgot from './Pages/Forgot';
import Newpass from './Pages/Newpass';
import Search from './Pages/search';
import Info from './Pages/Info';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Info />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Forgotpassword" element={<Forgot />} />
        <Route path="/Newpassword" element={<Newpass />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/Product/:id" element={<Product />} />
        <Route path="/Order/:userid" element={<Order />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
