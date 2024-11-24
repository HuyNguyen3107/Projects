import ReactPaginate from "react-paginate";
import React, { useEffect, useState } from "react";
import "./Pagination.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function PaginatedItems({ itemsPerPage }) {
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const page = useSelector((state) => state.paginate.currentPage);
  const navigate = useNavigate();

  useEffect(() => {
    setPageCount(Math.ceil(25000 / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % 25000;
    setItemOffset(newOffset);
    navigate(`/product/${event.selected + 1}`);
  };

  return (
    <>
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-num"
        previousClassName="page-item"
        previousLinkClassName="page-num"
        nextClassName="page-item"
        nextLinkClassName="page-num"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-num"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
        forcePage={+page - 1}
      />
    </>
  );
}
