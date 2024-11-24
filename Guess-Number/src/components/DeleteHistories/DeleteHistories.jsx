import React, { useEffect } from "react";
import "./DeleteHistories.css";
import { useSelector, useDispatch } from "react-redux";
import { notifySuccess } from "../../helper/toast.js";

function DeleteHistories() {
  const dispatch = useDispatch();

  const handleRemain = () => {
    dispatch({
      type: "delete/toggle",
    });
  };

  const handleDelete = () => {
    dispatch({
      type: "histories/clear",
    });
    dispatch({
      type: "delete/toggle",
    });
    notifySuccess("Xóa lịch sử thành công gòi nghen");
  };
  useEffect(() => {
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        dispatch({
          type: "delete/toggle",
        });
      }
    });
  }, []);
  return (
    <div>
      <div className="overlay" onClick={handleRemain}></div>
      <div className="confirm-box">
        <span>Are your sure?</span>
        <div className="btn-list">
          <button className="btn-remain" onClick={handleRemain}>
            Thui
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteHistories;
