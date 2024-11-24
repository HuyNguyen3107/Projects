import React, { useEffect, useRef, useState } from "react";
import "./InputGuess.css";
import { regexNumber } from "../../helper/regex.js";
import { useSelector, useDispatch } from "react-redux";
import { Fragment } from "react";
import {
  notifyInfo,
  notifySuccess,
  notifyWarning,
  notifyError,
} from "../../helper/toast.js";

function InputGuess() {
  const dispatch = useDispatch();
  const maxNum = useSelector((state) => state.range.maxValue);
  const count = useSelector((state) => state.progress.count);
  const maxTimes = useSelector((state) => state.timesPlay.maxTimes);
  const correctNum = useSelector((state) => state.random.correctNum);
  const history = useSelector((state) => state.histories.history);
  const inputRef = useRef();
  const btnRef = useRef();
  const checkRef = useRef(true);
  const arrCheck = useSelector((state) => state.compare.arr);
  const [isEnd, setEnd] = useState(false);
  const handleChange = (value) => {
    if (+value) {
      inputRef.current.value = regexNumber(maxNum, value);
    } else {
      inputRef.current.value = "";
    }
  };
  const handleSubmit = () => {
    if (count <= +maxTimes) {
      if (!isEnd) {
        if (+inputRef.current.value > maxNum) {
          notifyWarning("Giá trị nhập vào đang bị quá giới hạn đó nha");
        } else if (!+inputRef.current.value) {
          notifyError("Nhập giá trị vào nghen");
        } else {
          if (!arrCheck.includes(+inputRef.current.value)) {
            dispatch({
              type: "remain/decrease",
            });
            dispatch({
              type: "progress/update",
              payload: maxTimes,
            });
            dispatch({
              type: "compare/push",
              payload: +inputRef.current.value,
            });
            dispatch({
              type: "histories/add",
              payload:
                count === 1
                  ? {
                      number: +inputRef.current.value,
                      maxTime: maxTimes,
                      isCorrect:
                        correctNum === +inputRef.current.value ? true : false,
                    }
                  : {
                      number: +inputRef.current.value,
                      isCorrect:
                        correctNum === +inputRef.current.value ? true : false,
                    },
            });
            if (correctNum > +inputRef.current.value) {
              console.log(correctNum);
              if (count === +maxTimes) {
                dispatch({
                  type: "compare",
                  payload:
                    "Đáng lẽ ra anh Quân nên tăng thêm xíu nữa. Buồn anh Quân",
                });
                notifyInfo(
                  "Đáng lẽ ra anh Quân nên tăng thêm xíu nữa. Buồn anh Quân"
                );
              } else {
                dispatch({
                  type: "compare",
                  payload: "Hmmm... tăng thêm xíu đi anh Quân",
                });
                notifyInfo("Hmmm... tăng thêm xíu đi anh Quân");
              }
            } else if (correctNum < +inputRef.current.value) {
              if (count === +maxTimes) {
                dispatch({
                  type: "compare",
                  payload:
                    "Đáng lẽ ra anh Quân nên giảm thêm xíu nữa. Buồn anh Quân",
                });
                notifyInfo(
                  "Đáng lẽ ra anh Quân nên giảm thêm xíu nữa. Buồn anh Quân"
                );
              } else {
                dispatch({
                  type: "compare",
                  payload: "Hmmm... giảm xíu nữa đi anh Quân",
                });
                notifyInfo("Hmmm... giảm xíu nữa đi anh Quân");
              }
            } else {
              dispatch({
                type: "compare",
                payload: "Hi hi! Đúng rùi đẳng cấp đấy chứ nhỉ",
              });
              notifySuccess("Hi hi! Đúng rùi đẳng cấp đấy chứ nhỉ");
              setEnd(true);
            }
          } else {
            notifyWarning("Giá trị này đã nhập rồi nghen");
          }
        }
      }
    }
    if (count === +maxTimes && !isEnd) {
      setEnd(true);
    }
    if (isEnd) {
      setEnd(false);
      dispatch({
        type: "progress/reset",
      });
      dispatch({
        type: "remain/reset",
        payload: maxTimes,
      });
      dispatch({
        type: "compare/reset",
      });
      dispatch({
        type: "correct/update",
      });
      dispatch({
        type: "histories/update",
        payload: history,
      });
      dispatch({
        type: "histories/remove",
      });
      dispatch({
        type: "update",
      });
    }
  };
  useEffect(() => {
    document.onkeyup = (e) => {
      if (+e.key >= 0 && +e.key <= 9) {
        if (inputRef.current) {
          inputRef.current.focus();
        }
        if (checkRef.current) {
          inputRef.current.value = +e.key;
          checkRef.current = false;
        }
      }
      if (e.key === "ArrowUp") {
        if (inputRef.current) {
          inputRef.current.focus();
        }
        if (checkRef.current && inputRef.current.value) {
          inputRef.current.value = 1;
          checkRef.current = false;
        } else {
          if (inputRef.current) {
            inputRef.current.value++;
          }
        }
      }
      if (e.key === "ArrowDown") {
        if (inputRef.current) {
          inputRef.current.focus();
        }
        if (checkRef.current && inputRef.current.value) {
          inputRef.current.value--;
          checkRef.current = false;
        } else if (+inputRef.current.value > 0) {
          inputRef.current.value--;
        }
      }
    };
  }, []);

  useEffect(() => {
    if (btnRef.current) {
      btnRef.current.focus();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEnd, maxNum]);
  return (
    <Fragment>
      <form
        className="input-guess"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {isEnd ? (
          <button className="btn-replay" ref={btnRef}>
            Play Again
          </button>
        ) : (
          <div>
            <label htmlFor="guess">Hãy nhập thử một số</label>
            <input
              autoComplete="off"
              type="text"
              placeholder="Thử một số"
              name="guess"
              onInput={(e) => {
                handleChange(e.target.value);
              }}
              onBlur={() => {
                checkRef.current = true;
              }}
              ref={inputRef}
            />
          </div>
        )}
      </form>
    </Fragment>
  );
}

export default InputGuess;
