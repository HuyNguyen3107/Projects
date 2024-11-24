import React from "react";
import myPicture from "../assets/images/idolkorea.jpg";
import "./Header.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const cart = useSelector((state) => state.cart.cart);
  return (
    <header className="header">
      <div className="avatar">
        <Link to={`/product/1`}>
          <img src={myPicture} alt="" />
        </Link>
      </div>
      <div className="cart-icon">
        <Link to={"/cart"}>
          <i className="pi pi-shopping-bag"></i>
          <span className="quantity">
            {cart.reduce((total, product) => {
              return total + product.quantity;
            }, 0)}
          </span>
        </Link>
      </div>
    </header>
  );
}

export default Header;
