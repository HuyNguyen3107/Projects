import React, { useEffect, useRef } from "react";
import "./ProgressBar.css";
import { useSelector, useDispatch } from "react-redux";

function ProgressBar() {
  const progressRef = useRef();
  const widthBar = useSelector((state) => state.progress.width);
  useEffect(() => {
    progressRef.current.style.width = `${widthBar}%`;
  }, [widthBar]);
  return (
    <div className="progress-bar">
      <div className="progress" ref={progressRef}></div>
    </div>
  );
}

export default ProgressBar;
