import React, { useEffect, useRef, useState } from "react";
import InputGuess from "../components/InputGuess/InputGuess";
import Notice from "../components/Notice/Notice";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import RangeNumber from "../components/RangeNumber/RangeNumber";
import TableResult from "../components/TableResult/TableResult";
import "../assets/css/home.css";
import { useSelector, useDispatch } from "react-redux";
import { ToastBox, notifyInfo, notifySuccess } from "../helper/toast";

function Home() {
  const containerRef = useRef();
  const themeRef = useRef();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const maxNum = useSelector((state) => state.timesPlay.maxNum);
  const correctNum = useSelector((state) => state.random.correctNum);
  const histories = useSelector((state) => state.histories.histories);
  const dispatch = useDispatch();
  const flagRef = useRef(true);
  const handleTheme = () => {
    if (themeRef.current.getAttribute("data-theme") === "light") {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
      containerRef.current.style.backgroundColor = "#1a202c";
      notifySuccess("Đang ở chế độ đen tối");
    } else {
      notifySuccess("Đang ở chế độ trong sáng");
      setTheme("light");
      localStorage.setItem("theme", "light");
      containerRef.current.style.backgroundColor = "#fff";
    }
  };

  useEffect(() => {
    dispatch({
      type: "correct/random",
      payload: maxNum,
    });
    if (flagRef.current) {
      notifyInfo("Chào mừng bạn đến với trò chơi đoán số");
      flagRef.current = false;
    }
  }, []);

  return (
    <div
      className="container"
      ref={containerRef}
      style={{
        backgroundColor: theme === "light" ? "#fff" : "#1a202c",
      }}
    >
      <ProgressBar />
      <div className="game">
        <div
          className="theme"
          data-theme={theme}
          onClick={handleTheme}
          ref={themeRef}
        >
          {theme === "light" ? (
            <i className="pi pi-moon"></i>
          ) : (
            <i className="pi pi-sun"></i>
          )}
        </div>
        <Notice />
        <RangeNumber />
        <InputGuess />
        {histories.length ? <TableResult /> : ""}
      </div>
      <ToastBox />
    </div>
  );
}

export default Home;
