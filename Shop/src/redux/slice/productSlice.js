import { createSlice } from "@reduxjs/toolkit";
import { getProducts } from "../middlewares/productMiddlewares";
const initialState = {
  productList: [],
  status: "idle",
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.status = "fulfilled";
      state.productList = action.payload;
    });
  },
});
