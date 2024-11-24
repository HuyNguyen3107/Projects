import DefaultLayout from "../Layout/DefaultLayout";
import { Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import ProductDetail from "../pages/Detail/ProductDetail";
import Cart from "../pages/Cart/Cart";
export const publicRoutes = (
  <>
    <Route path="/" element={<DefaultLayout />}>
      <Route path="/product/:page" element={<Home />} />
      <Route path="/details/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
    </Route>
  </>
);
