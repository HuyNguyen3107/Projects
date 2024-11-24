import React, { useEffect } from "react";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../../../../redux/middlewares/productMiddlewares";
import { Link } from "react-router-dom";
import { cartSlice } from "../../../../redux/slice/cartSlice";
import Loading from "../../../../components/Loading/Loading";

const { add } = cartSlice.actions;

function ProductList() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList.productList);
  const status = useSelector((state) => state.productList.status);
  const page = useSelector((state) => state.paginate.currentPage);
  useEffect(() => {
    dispatch(getProducts(page));
  }, []);
  useEffect(() => {
    console.log(page);
    dispatch(getProducts(page));
  }, [page]);
  const handleAddCart = (id) => {
    const item = productList.find((product) => {
      return product._id === id;
    });
    dispatch(add(item));
  };
  return (
    <div className="product-list">
      {console.log(productList)}
      <h2>PRODUCT LIST</h2>
      <ul>
        {productList.map((product, index) => {
          return (
            <li className="product-item" key={index + 1}>
              <Link to={`/details/${product._id}`}>
                <div className="product-img">
                  <img src={product.image} alt="" />
                </div>
                <div>
                  <h3 className="product-name">{product.name}</h3>
                </div>
              </Link>
              <div className="product-detail">
                <div>
                  <span className="price">${product.price}</span>
                  <i
                    className="pi pi-shopping-cart"
                    onClick={(e) => {
                      handleAddCart(product._id);
                    }}
                  ></i>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {status === "pending" ? <Loading isLoading={true} /> : ""}
    </div>
  );
}

export default ProductList;
