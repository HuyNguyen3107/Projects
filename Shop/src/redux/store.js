import { configureStore } from "@reduxjs/toolkit";
import { productSlice } from "./slice/productSlice";
import { productDetailSlice } from "./slice/productDetailSlice";
import { paginateSlice } from "./slice/paginateSlice";
import { cartSlice } from "./slice/cartSlice";

export const store = configureStore({
  reducer: {
    productList: productSlice.reducer,
    detail: productDetailSlice.reducer,
    paginate: paginateSlice.reducer,
    cart: cartSlice.reducer,
  },
});
