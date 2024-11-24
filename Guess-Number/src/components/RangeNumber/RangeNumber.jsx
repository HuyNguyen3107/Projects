import React, { useEffect, useRef } from "react";
import "./RangeNumber.css";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "../../helper/toast.js";

function RangeNumber() {
  const rangeBarRef = useRef();
  const rangeRef = useRef();
  const spanRef = useRef();
  const dispatch = useDispatch();
  let barWidth = useRef(0);
  let initialClientXRef = useRef(0);
  let currentValueRef = useRef(
    localStorage.getItem("range_rate")
      ? +localStorage.getItem("range_rate")
      : 30
  );
  let valueRef = useRef(0);
  let isDragRef = useRef(false);
  let maxRangeValueRef = useRef(
    Math.floor((currentValueRef.current / 100) * 2048)
  );
  let notifyValueRef = useRef();

  const handleDrag = (e) => {
    if (isDragRef.current) {
      const moveWidth = e.clientX - initialClientXRef.current;
      valueRef.current =
        (moveWidth * 100) / barWidth.current + currentValueRef.current;
      if (valueRef.current < 0.1) {
        valueRef.current = 0.1;
      }
      if (valueRef.current > 100) {
        valueRef.current = 100;
      }
      if (valueRef.current < 0) {
        valueRef.current = 0;
      }
      rangeRef.current.style.width = `${valueRef.current}%`;
      localStorage.setItem("range_rate", valueRef.current);
      notifyValueRef.current.innerText = `${Math.floor(
        (valueRef.current / 100) * 2048
      )}`;
    }
  };
  const handleRangeBar = (value) => {
    valueRef.current = (value / barWidth.current) * 100;
    if (valueRef.current < 0.1) {
      valueRef.current = 0.1;
    }
    rangeRef.current.style.width = `${valueRef.current}%`;
    localStorage.setItem("range_rate", valueRef.current);
    notifyValueRef.current.innerText = `${Math.floor(
      (valueRef.current / 100) * 2048
    )}`;
    document.addEventListener("mousemove", handleDrag);
    currentValueRef.current = valueRef.current;
    document.addEventListener("mouseup", () => {
      isDragRef.current = false;
      currentValueRef.current = valueRef.current;
      maxRangeValueRef.current = Math.floor(
        (currentValueRef.current / 100) * 2048
      );
      dispatch({
        type: "change/value",
        payload: currentValueRef.current,
      });
      dispatch({
        type: "update/times",
        payload: Math.floor((currentValueRef.current / 100) * 2048),
      });
      dispatch({
        type: "remain/update",
        payload: Math.floor((currentValueRef.current / 100) * 2048),
      });
      dispatch({
        type: "progress/reset",
      });
      dispatch({
        type: "compare/reset",
      });
      dispatch({
        type: "correct/random",
        payload: Math.floor((currentValueRef.current / 100) * 2048),
      });
      dispatch({
        type: "histories/remove",
      });
      localStorage.setItem(
        "range_number",
        Math.floor((currentValueRef.current / 100) * 2048)
      );
    });
  };
  useEffect(() => {
    barWidth.current = rangeBarRef.current.clientWidth;
    rangeRef.current.style.width = `${currentValueRef.current}%`;
  }, []);
  return (
    <Fragment>
      <div
        className="range-container"
        ref={rangeBarRef}
        onMouseDown={(e) => {
          initialClientXRef.current = e.clientX;
          isDragRef.current = true;
          handleRangeBar(e.nativeEvent.offsetX);
        }}
        onMouseOver={() => {
          notifyValueRef.current.style.visibility = "visible";
          notifyValueRef.current.style.opacity = 1;
        }}
        onMouseOut={() => {
          notifyValueRef.current.style.visibility = "";
          notifyValueRef.current.style.opacity = 0;
        }}
      >
        <div className="range" ref={rangeRef}>
          <span
            ref={spanRef}
            onMouseDown={(e) => {
              isDragRef.current = true;
              initialClientXRef.current = e.clientX;
              e.stopPropagation();
              document.addEventListener("mousemove", handleDrag);
              document.addEventListener("mouseup", () => {
                isDragRef.current = false;
                currentValueRef.current = valueRef.current;
                maxRangeValueRef.current = Math.floor(
                  (currentValueRef.current / 100) * 2048
                );
                dispatch({
                  type: "change/value",
                  payload: currentValueRef.current,
                });
                dispatch({
                  type: "update/times",
                  payload: Math.floor((currentValueRef.current / 100) * 2048),
                });
                dispatch({
                  type: "remain/update",
                  payload: Math.floor((currentValueRef.current / 100) * 2048),
                });
                dispatch({
                  type: "progress/reset",
                });
                dispatch({
                  type: "compare/reset",
                });
                dispatch({
                  type: "correct/random",
                  payload: Math.floor((currentValueRef.current / 100) * 2048),
                });
                dispatch({
                  type: "histories/remove",
                });
                localStorage.setItem(
                  "range_number",
                  Math.floor((currentValueRef.current / 100) * 2048)
                );
              });
            }}
          >
            <span className="current-value" ref={notifyValueRef}>
              {maxRangeValueRef.current}
            </span>
          </span>
        </div>
      </div>
      <div className="mile-stones">
        <ul>
          <li>
            <span>100</span>
            <span>512</span>
          </li>
          <li>1024</li>
          <li>1536</li>
          <li>2048</li>
        </ul>
      </div>
    </Fragment>
  );
}

export default RangeNumber;
