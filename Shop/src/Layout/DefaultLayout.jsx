import React from "react";
import Header from "./Header";
import { Outlet, useOutlet } from "react-router-dom";
import Welcome from "../pages/Home/components/Welcome/Welcome";
import { ToastBox } from "../helper/toast";
import ScrollTop from "../components/ScrollTop/ScrollTop";

function DefaultLayout() {
  const outlet = useOutlet();
  return (
    <div>
      <Header />

      {!outlet && <Welcome />}
      <Outlet />
      <ToastBox />
      <ScrollTop />
    </div>
  );
}

export default DefaultLayout;
