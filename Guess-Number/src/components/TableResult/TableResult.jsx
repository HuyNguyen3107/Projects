import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./TableResult.css";
import { useDispatch, useSelector } from "react-redux";
import DeleteHistories from "../DeleteHistories/DeleteHistories";
import { Fragment } from "react";
function TableResult() {
  const histories = useSelector((state) => state.histories.histories);
  const isDelete = useSelector((state) => state.histories.isDelete);
  const isUpdate = useSelector((state) => state.histories.isUpdate);
  const dispatch = useDispatch();
  const tableRef = useRef();
  const containerRef = useRef();
  const boxRef = useRef();
  const widthRef = useRef(1476);
  const checkRef = useRef(true);
  const checkNumRef = useRef(false);

  const handleScroll = (value) => {
    // console.log(value);
  };

  const handleDeleteHistories = () => {
    dispatch({
      type: "delete/toggle",
    });
  };

  useEffect(() => {
    if (checkRef.current) {
      widthRef.current = tableRef.current.clientWidth;
      checkRef.current = false;
    }
    boxRef.current.style.width = `${widthRef.current}px`;
    containerRef.current.style.width = `${
      widthRef.current * histories.length
    }px`;
    containerRef.current.style.display = "flex";
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        if (Math.ceil(boxRef.current.scrollLeft) % widthRef.current !== 0) {
          let num = Math.ceil(boxRef.current.scrollLeft / widthRef.current);
          console.log(num);
          boxRef.current.scroll({
            left: widthRef.current * num,
            behavior: "smooth",
          });
        } else {
          boxRef.current.scroll({
            left: boxRef.current.scrollLeft + widthRef.current,
            behavior: "smooth",
          });
        }
      }
      if (e.key === "ArrowLeft") {
        if (boxRef.current.scrollLeft >= widthRef.current) {
          if (Math.ceil(boxRef.current.scrollLeft) % widthRef.current !== 0) {
            let num = Math.floor(boxRef.current.scrollLeft / widthRef.current);
            console.log(num);
            boxRef.current.scroll({
              left: widthRef.current * num,
              behavior: "smooth",
            });
          } else {
            boxRef.current.scroll({
              left: boxRef.current.scrollLeft - widthRef.current,
              behavior: "smooth",
            });
          }
        } else {
          if (Math.ceil(boxRef.current.scrollLeft) % widthRef.current !== 0) {
            let num =
              Math.floor(boxRef.current.scrollLeft / widthRef.current) - 1;
            console.log(num);
            boxRef.current.scroll({
              left: widthRef.current * num,
              behavior: "smooth",
            });
          }
        }
      }
    });
  });

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scroll({
        left: 0,
        behavior: "smooth",
      });
    }
  }, [isUpdate]);

  return (
    <div
      className="box"
      ref={boxRef}
      onScroll={(e) => {
        handleScroll(boxRef.current.scrollLeft);
      }}
    >
      <div className="table-container" ref={containerRef}>
        <i className="pi pi-trash" onClick={handleDeleteHistories}></i>
        {histories.map((history, index) => {
          return (
            <div
              className="table-result"
              key={index + 1}
              ref={tableRef}
              style={
                widthRef.current
                  ? {
                      width: `${widthRef.current}px`,
                    }
                  : {}
              }
            >
              <table cellPadding={0} cellSpacing={10}>
                <thead>
                  <tr>
                    <th>Số lần nhập</th>
                    <th>Số nhập vào</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => {
                    return (
                      <tr key={index + 1}>
                        <td>{index + 1}</td>
                        <td>{item.number}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="info-result">
                <span className="play-times">
                  Lần chơi thứ {histories.length - index}/{histories.length}
                </span>
                <span className="max-input">
                  Số lần nhập tối đa:{" "}
                  <span className="max-value">{history[0].maxTime}</span>
                </span>
                <span className="correct-rate">
                  Tỷ lệ đúng:{" "}
                  {history.findIndex((item) => item.isCorrect) !== -1
                    ? ((history[0].maxTime - history.length + 1) /
                        history[0].maxTime) *
                      100
                    : 0}
                  %
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {isDelete ? <DeleteHistories /> : ""}
    </div>
  );
}

export default TableResult;
