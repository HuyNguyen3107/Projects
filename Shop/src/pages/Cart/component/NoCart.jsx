import React from "react";
import "./NoCart.css";
import { useNavigate } from "react-router-dom";

function NoCart() {
  const navigate = useNavigate();
  return (
    <div className="no-cart">
      <h3>There is no product in your cart</h3>
      <i className="pi pi-bitcoin"></i>
      <button
        onClick={() => {
          navigate("/product/1");
        }}
      >
        Go Home
      </button>
    </div>
  );
}

export default NoCart;
