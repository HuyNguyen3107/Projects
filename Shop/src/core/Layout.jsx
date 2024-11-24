import React from "react";
import { publicRoutes } from "../routers/PublicRoutes";
import { Routes } from "react-router-dom";

function Layout() {
  return <Routes>{publicRoutes}</Routes>;
}

export default Layout;
