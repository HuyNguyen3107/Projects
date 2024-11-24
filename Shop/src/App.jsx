import React, { useEffect } from "react";
import Layout from "./core/Layout";
import "primeicons/primeicons.css";
import "./assets/css/App.css";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { paginateSlice } from "./redux/slice/paginateSlice";

const { change } = paginateSlice.actions;

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (location.pathname.includes("product")) {
      dispatch(
        change(location.pathname.slice(location.pathname.lastIndexOf("/") + 1))
      );
    }
  }, [location.pathname]);
  return (
    <div>
      <Layout />
    </div>
  );
}

export default App;
