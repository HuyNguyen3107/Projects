import React, { useRef } from "react";
import "./Cart.css";
import NoCart from "./component/NoCart";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cartSlice } from "../../redux/slice/cartSlice";
import { useNavigate } from "react-router-dom";

const { decrement, add, remove, checkout } = cartSlice.actions;

function Cart() {
  const cart = useSelector((state) => state.cart.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef();
  return (
    <div className="cart">
      <h3>SHOPPING CART</h3>
      {cart.length === 0 ? (
        <NoCart />
      ) : (
        <>
          <div className="cart-product-list">
            {cart.map((item, index) => {
              return (
                <div className="cart-product" key={index + 1}>
                  <div className="cart-product-info">
                    <div className="cart-product-img">
                      <img
                        src={item.image}
                        alt=""
                        onClick={() => {
                          navigate(`/details/${item._id}`);
                        }}
                      />
                    </div>
                    <div>
                      <div>
                        <div className="cart-product-brand">{item.brand}</div>
                        <div className="cart-product-name">{item.name}</div>
                      </div>
                      <span className="cart-product-price">${item.price}</span>
                    </div>
                  </div>
                  <span className="rest-quantity">Rest: {item.amount}</span>
                  <div className="cart-edit">
                    <div className="quantity-change">
                      <button
                        className="decrease"
                        onClick={() => {
                          if (+inputRef.current.value > 1) {
                            inputRef.current.value = item.quantity;
                            inputRef.current.value--;
                            dispatch(decrement(item));
                          }
                        }}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        placeholder={item.quantity}
                        ref={inputRef}
                        disabled
                      />
                      <button
                        className="increase"
                        onClick={() => {
                          inputRef.current.value = item.quantity;
                          inputRef.current.value++;
                          dispatch(add(item));
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div>
                      <div className="product-price">
                        ${item.price * item.quantity}
                      </div>
                      <i
                        className="pi pi-trash"
                        onClick={() => {
                          dispatch(remove(item));
                        }}
                      ></i>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <span className="total-price">
            Total Price: $
            {cart.reduce((total, item) => {
              return total + item.price * item.quantity;
            }, 0)}
          </span>
          <div>
            <Link to={"/product/1"}>
              <button className="btn-home-page">Go Home</button>
            </Link>
            <button
              className="btn-checkout"
              onClick={() => {
                dispatch(checkout());
              }}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
