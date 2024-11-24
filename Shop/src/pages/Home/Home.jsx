import React from "react";
import ProductList from "./components/ProductList/ProductList";
import PaginatedItems from "../../components/Pagination/Pagination";

function Home() {
  return (
    <div>
      <ProductList />
      <PaginatedItems itemsPerPage={20} />
    </div>
  );
}

export default Home;
