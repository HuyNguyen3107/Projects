import React, { useEffect } from "react";
import "./ProductDetail.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetail } from "../../redux/middlewares/productMiddlewares";
import { useLocation } from "react-router-dom";
import { cartSlice } from "../../redux/slice/cartSlice";
import Loading from "../../components/Loading/Loading";

const { add } = cartSlice.actions;

function ProductDetail() {
  const product = useSelector((state) => state.detail.productDetail);
  const page = useSelector((state) => state.paginate.currentPage);
  const status = useSelector((state) => state.detail.status);
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(
      getProductDetail(
        location.pathname.slice(location.pathname.lastIndexOf("/") + 1)
      )
    );
  }, []);

  return (
    <div className="product-detail-info">
      <div className="product-info-img">
        <img src={product.image} alt="" />
      </div>
      <div className="product-info">
        <h3 className="product-brand">{product.brand}</h3>
        <h4 className="product-info-name">{product.name}</h4>
        <p className="product-desc">{product.description}</p>
        <span className="product-category">Category: {product.category}</span>
        <div>
          <div>
            <Link to={`/product/${page}`}>
              <button className="btn-go-home">Go Home</button>
            </Link>
          </div>
          <div>
            <span className="product-detail-price">${product.price}</span>
            <button
              className="btn-add-cart"
              onClick={() => {
                dispatch(add(product));
              }}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
      {status === "pending" ? <Loading isLoading={true} /> : ""}
    </div>
  );
}

export default ProductDetail;
