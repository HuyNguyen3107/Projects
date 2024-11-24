import React, { useRef } from "react";
import "./Notice.css";
import { useSelector } from "react-redux";

function Notice() {
  const maxValue = useSelector((state) => state.range.maxValue);
  const maxTimes = useSelector((state) => state.timesPlay.maxTimes);
  const remainTimes = useSelector((state) => state.remain.remainTimes);
  const message = useSelector((state) => state.compare.message);
  return (
    <div className="notice">
      <h2 className="notice-header">{message}</h2>
      <span className="remaining-plays">
        Còn <span className="remain">{remainTimes}</span> /{" "}
        <span className="max-times">{maxTimes}</span> lần chơi
      </span>
      <span className="notice-range">
        Bạn cần tìm kiếm một số từ 1 đến{" "}
        <span className="max-range-value">{maxValue}</span>
      </span>
    </div>
  );
}

export default Notice;
