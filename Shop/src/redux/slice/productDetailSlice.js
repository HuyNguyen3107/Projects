import { createSlice } from "@reduxjs/toolkit";
import { getProductDetail } from "../middlewares/productMiddlewares";
const initialState = {
  productDetail: {},
  status: "idle",
};

export const productDetailSlice = createSlice({
  name: "detail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProductDetail.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getProductDetail.fulfilled, (state, action) => {
      state.status = "fulfilled";
      state.productDetail = action.payload;
    });
  },
});
