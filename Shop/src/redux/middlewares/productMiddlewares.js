import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../config/client.js";

export const getProducts = createAsyncThunk("getProducts", async (page) => {
  const response = await client.get(`/products?limit=20&page=${page}`);
  return response.data.data.listProduct;
});

export const getProductDetail = createAsyncThunk(
  "getProductDetail",
  async (id) => {
    const response = await client.get(`/products/${id}`);
    return response.data.data;
  }
);
