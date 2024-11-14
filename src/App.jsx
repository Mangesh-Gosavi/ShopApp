import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import Product from "./Pages/Product";
import Order from "./Pages/Orders";
import Cart from "./Pages/Cart";
import Forgot from "./Pages/Forgot";
import Newpass from "./Pages/Newpass";
import Search from "./Pages/search";
import Info from "./Pages/Info";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Info />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<Forgot />} />
        <Route path="/newpassword" element={<Newpass />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/order/:userid" element={<Order />} />
      </Routes>
  );
}

export default App;
