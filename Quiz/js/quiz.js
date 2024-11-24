import { client } from "./client.js";
import { config } from "./config.js";

const quizizz = document.querySelector(".quizizz");
const start = document.querySelector(".start");
const countDown = document.querySelector(".count-down");
const quizizzStart = document.querySelector(".quizizz-start");
const congrat = document.querySelector(".congrat");
const decry = document.querySelector(".decry");
const loading = document.querySelector(".loading");

let currentNumQues = 0;
let totalQuestion = null;
let idGotList = [];
let checkChoose = 0;
let chooseIdList = [];
let time = 100;
let stopProgress = false;
let total = 0;
let point = 300;
let streak = 0;
let percent = 100 / 3;
let checkChooseCorrect = 0;
let lenStreakProgress = 0;
let element;

let correctNum = 0;
let incorrectNum = 0;

const getTotalQues = async function () {
  const { response } = await client.get(`/questions?_page=1&_limit=1`);
  return response.headers.get("x-total-count");
};

totalQuestion = await getTotalQues();

const randomQues = function () {
  let value = Math.floor(Math.random() * totalQuestion) + 1;
  if (idGotList.includes(value)) {
    // console.log('ok');
    // console.log(currentNumQues, totalQuestion);
    if (currentNumQues < totalQuestion) {
      return randomQues();
    }
  } else {
    let temp = value;
    idGotList.push(value);
    return temp;
  }
};

const getQuestion = async function () {
  let id = randomQues();
  const { data: question } = await client.get(`/questions/${id}`);
  return question;
};

const stripHtml = (html) => html.toString().replace(/(<([^>]+)>)/gi, "");

const renderResult = function () {
  loading.style.display = "";
  const endGame = document.createElement("div");
  endGame.classList.add("quizizz-end");
  endGame.innerHTML = `
  <img src="./img/chelsea.jpg" alt="">
  <div class="result">
      <div class="result-detail">
          <span>Game Performance</span>
          <div class="correct-percent">
              <span>Accuracy</span>
              <div class="percent-bar">
                  <div class="percent-progress"><span>${
                    (correctNum / totalQuestion) * 100
                  }%</span></div>
              </div>
          </div>
          <div class="result-desc">
              <div>
                  <div class="desc-score">
                      <span>${total}</span>
                      <span>Score</span>
                  </div>
                  <div class="desc-streak">
                      <span>${streak / 100}</span>
                      <span>Streak</span>
                  </div>
              </div>
              <div>
                  <div class="desc-correct">
                      <span>${correctNum}</span>
                      <span>Correct</span>
                  </div>
                  <div class="desc-incorrect">
                      <span>${incorrectNum}</span>
                      <span>Incorrect</span>
                  </div>
              </div>
          </div>
          <button class="play-again">
              Play Again
          </button>
      </div>
  </div>
  `;
  element = endGame;
  quizizz.append(endGame);
  const percentProgress = document.querySelector(".percent-progress");
  percentProgress.style.width = `${(correctNum / totalQuestion) * 100}%`;
  const playAgain = document.querySelector(".play-again");
  playAgain.addEventListener("click", function () {
    quizizz.removeChild(element);
    currentNumQues = 0;
    idGotList = [];
    checkChoose = 0;
    chooseIdList = [];
    time = 100;
    stopProgress = false;
    total = 0;
    point = 300;
    streak = 0;
    percent = 100 / 3;
    checkChooseCorrect = 0;
    lenStreakProgress = 0;
    element;
    correctNum = 0;
    incorrectNum = 0;
    quizizzStart.style.display = "block";
    start.style.display = "block";
    countDown.innerText = "3";
    countDown.style.display = "none";
  });
};

const handleProgress = function () {
  // console.log('ok');
  if (time > 0) {
    // console.log(time);
    if (stopProgress) {
      return;
    }
    time -= 2;
    const progress = document.querySelector(".progress");
    progress.style.width = `${time}%`;
    setTimeout(function () {
      handleProgress();
    }, 100);
  } else {
    if (currentNumQues < totalQuestion) {
      quizizz.removeChild(element);
      time = 100;
      stopProgress = false;
      checkChoose = 0;
      chooseIdList = [];
      checkChooseCorrect = 0;
      loading.style.display = "flex";
      renderQuizizz();
    } else {
      setTimeout(() => {
        quizizz.removeChild(element);
        loading.style.display = "flex";
      }, 7000);
      setTimeout(function () {
        renderResult();
      }, 10000);
    }
  }
};

start.addEventListener("click", function () {
  start.style.display = "none";
  countDown.style.display = "block";
  setTimeout(function () {
    countDown.innerText--;
    setTimeout(() => {
      countDown.innerText--;
      setTimeout(() => {
        countDown.innerText = "Go";
        setTimeout(() => {
          quizizzStart.style.display = "none";
          loading.style.display = "flex";
          renderQuizizz();
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
});

const renderQuizizz = async function (e) {
  let question = await getQuestion();
  loading.style.display = "";
  currentNumQues++;
  const quizizzBody = document.createElement("div");
  quizizzBody.classList.add("quizizz-body");
  quizizzBody.innerHTML = `
    <div class="progress-bar">
    <div class="progress"></div>
</div>
<div class="score">
    <div class="counting">
        <div class="total-question">
            ${stripHtml(currentNumQues)}/${stripHtml(totalQuestion)}
        </div>
        <div class="streak-point">
            <div class="point-progress">
                <span>Streak</span>
            </div>
        </div>
        <span class="point">+${streak}</span>
    </div>
    <div class="total-score">
        Score: ${total}
    </div>
</div>
<div class="main-quiz">
    <img src="./img/chelsea.jpg" alt="">
    <div class="question">
        <span>${stripHtml(question.question)}</span>
        <span>${
          question.correctId.length > 1
            ? `(You have to choose ${question.correctId.length} answers)`
            : ""
        }</span>
    </div>
    <div class="answers">
        <div class="answer"><span>${stripHtml(
          question.answers[0].answer
        )}</span></div>
        <div class="answer"><span>${stripHtml(
          question.answers[1].answer
        )}</span></div>
        <div class="answer"><span>${stripHtml(
          question.answers[2].answer
        )}</span></div>
        <div class="answer"><span>${stripHtml( 
          question.answers[3].answer
        )}</span></div>
    </div>
</div>
<div class="status"></div>
    `;
  element = quizizzBody;
  quizizz.append(quizizzBody);
  const answerList = document.querySelectorAll(".answer");
  const totalScore = document.querySelector(".total-score");
  const pointAdd = document.querySelector(".point");
  const pointProgress = document.querySelector(".point-progress");
  pointProgress.style.width = `${lenStreakProgress}%`;

  answerList.forEach(function (item, index) {
    if (question.correctId.includes(index + 1)) {
      item.addEventListener("click", function (e) {
        stopProgress = true;
        checkChooseCorrect++;
        chooseIdList.push(index + 1);
        item.style.backgroundColor = "green";
        checkChoose++;
        if (checkChoose === question.numberCorrect) {
          const status = document.querySelector(".status");
          status.style.display = "block";
          status.innerText = "Correct";
          status.style.backgroundColor = "green";
          answerList.forEach(function (item, index) {
            if (!question.correctId.includes(index + 1)) {
              if (!chooseIdList.includes(index + 1)) {
                item.style.opacity = 0;
              }
            } else {
              item.style.backgroundColor = "green";
            }
          });
          if (checkChooseCorrect === question.correctId.length) {
            lenStreakProgress += percent;
            lenStreakProgress =
            lenStreakProgress <= 100 ? lenStreakProgress : 100;
            pointProgress.style.width = `${lenStreakProgress}%`;
            streak += 100;
            streak = streak <= 300 ? streak : 300;
            pointAdd.innerText = `+${streak}`;
            total = total + streak + Math.ceil(((time/ 100) * point));
            totalScore.innerText = `Score: ${total}`;
            congrat.play();
            correctNum++;
          } else {
            lenStreakProgress = 0;
            pointProgress.style.width = `${lenStreakProgress}%`;
            streak = 0;
            pointAdd.innerText = `+${streak}`;
            total = total + streak + Math.ceil(((time/ 100) * point));
            decry.play();
            incorrectNum++;
          }
          if (currentNumQues < totalQuestion) {
            setTimeout(() => {
              quizizz.removeChild(element);
              time = 100;
              stopProgress = false;
              checkChoose = 0;
              chooseIdList = [];
              checkChooseCorrect = 0;
              loading.style.display = "flex";
              renderQuizizz();
            }, 7000);
          } else {
            setTimeout(() => {
              quizizz.removeChild(element);
              loading.style.display = "flex";
            }, 7000);
            setTimeout(function () {
              renderResult();
            }, 10000);
          }
        }
      });
    } else {
      item.addEventListener("click", function (e) {
        stopProgress = true;
        chooseIdList.push(index + 1);
        item.style.backgroundColor = "red";
        checkChoose++;
        if (checkChoose === question.numberCorrect) {
          answerList.forEach(function (item, index) {
            if (question.correctId.includes(index + 1)) {
              item.style.backgroundColor = "green";
            } else {
              if (!chooseIdList.includes(index + 1)) {
                item.style.opacity = 0;
              }
            }
          });
          const status = document.querySelector(".status");
          status.style.display = "block";
          status.innerText = "Incorrect";
          status.style.backgroundColor = "red";
          lenStreakProgress = 0;
          pointProgress.style.width = `${lenStreakProgress}%`;
          streak = 0;
          pointAdd.innerText = `+${streak}`;
          decry.play();
          incorrectNum++;
          if (currentNumQues < totalQuestion) {
            setTimeout(() => {
              quizizz.removeChild(element);
              time = 100;
              stopProgress = false;
              checkChoose = 0;
              chooseIdList = [];
              checkChooseCorrect = 0;
              loading.style.display = "flex";
              renderQuizizz();
            }, 5000);
          } else {
            setTimeout(() => {
              quizizz.removeChild(element);
              loading.style.display = "flex";
            }, 7000);
            setTimeout(function () {
              renderResult();
            }, 10000);
          }
        }
      });
    }
  });
  setTimeout(function () {
    handleProgress();
  }, 100);
};
