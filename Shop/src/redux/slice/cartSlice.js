import { createSlice } from "@reduxjs/toolkit";
import { notifySuccess } from "../../helper/toast";

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add: (state, action) => {
      const productList = JSON.parse(localStorage.getItem("cart"));
      console.log(productList);
      if (productList) {
        const check = productList.find(
          (product) => product._id === action.payload._id
        );
        if (!check) {
          const item = {
            ...action.payload,
            amount: action.payload.quantity,
            quantity: 1,
          };
          state.cart = [...state.cart, item];
          notifySuccess(
            `Đã thêm ${action.payload.name} vào giỏ hàng thành công`
          );
          localStorage.setItem("cart", JSON.stringify(state.cart));
        } else {
          const updateList = productList.map((product) => {
            if (product._id === check._id) {
              return {
                ...product,
                quantity: check.quantity + 1,
                amount: check.amount - 1,
              };
            } else {
              return product;
            }
          });
          state.cart = updateList;
          localStorage.setItem("cart", JSON.stringify(updateList));
        }
      } else {
        const item = {
          ...action.payload,
          amount: action.payload.quantity,
          quantity: 1,
        };
        state.cart = [item];
        notifySuccess(`Đã thêm ${action.payload.name} vào giỏ hàng thành công`);
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
    decrement: (state, action) => {
      const productList = JSON.parse(localStorage.getItem("cart"));
      if (productList) {
        const check = productList.find(
          (product) => product._id === action.payload._id
        );
        if (check) {
          if (check.quantity > 1) {
            const updateList = productList.map((product) => {
              if (product._id === check._id) {
                return {
                  ...product,
                  quantity: check.quantity - 1,
                  amount: check.amount + 1,
                };
              } else {
                return product;
              }
            });
            state.cart = updateList;
            localStorage.setItem("cart", JSON.stringify(updateList));
          }
        }
      }
    },
    remove: (state, action) => {
      const productList = JSON.parse(localStorage.getItem("cart"));
      if (productList) {
        const updateList = productList.filter((product) => {
          if (product._id === action.payload._id) {
            return false;
          } else {
            return true;
          }
        });
        state.cart = updateList;
        notifySuccess(`Xóa ${action.payload.name} khỏi giỏ hàng thành công`);
        localStorage.setItem("cart", JSON.stringify(updateList));
      }
    },
    checkout: (state, action) => {
      localStorage.removeItem("cart");
      state.cart = [];
      notifySuccess("Thanh toán thành công");
    },
  },
});
