import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: localStorage.getItem("page") ? +localStorage.getItem("page") : 1,
};

export const paginateSlice = createSlice({
  name: "paginate",
  initialState,
  reducers: {
    change: (state, action) => {
      localStorage.setItem("page", action.payload);
      state.currentPage = action.payload;
    },
  },
});
