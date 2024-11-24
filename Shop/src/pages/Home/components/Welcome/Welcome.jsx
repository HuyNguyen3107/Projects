import React from "react";
import "./Welcome.css";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();
  const handleView = () => {
    navigate("/product/1");
  };
  return (
    <div className="welcome">
      <h1 className="wel-header">Welcome to Huy'SHOP</h1>
      <p className="wel-desc">
        Let's click the button below to view our products!
      </p>
      <button className="btn-view" onClick={handleView}>
        View Products
      </button>
    </div>
  );
}

export default Welcome;
