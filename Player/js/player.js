// Tạo element
var progressBar = document.querySelector(".progress-bar");
var progress = progressBar.querySelector(".progress");
var progressSpan = progress.querySelector("span");
var timeLine = progressBar.querySelector(".timeline");

var progressBarWidth = progressBar.clientWidth;
var valueMove;
var initialClientX;
var currentValue = 0;
var value;
var recentTime;
var isDrag = false;
var currentTimeUpdate = 0;
var current;
var checkTimeUpdate = false;
var flag = false;
var repeatCheck = false;

var musicImage = document.querySelector(".image-music");

progressBar.addEventListener("mousedown", function (e) {
  if (e.which === 1) {
    value = (e.offsetX * 100) / progressBarWidth;
    progress.style.width = `${value}%`;
    // console.log(value);
    handleChange(value);
    document.addEventListener("mousemove", handleDrag);
    initialClientX = e.clientX;
    currentValue = value;
  }
});

var handleDrag = function (e) {
  isDrag = true;
  valueMove = e.clientX - initialClientX;
  value = (valueMove * 100) / progressBarWidth + currentValue;
  if (value < 0) {
    value = 0;
  }

  if (value > 100) {
    value = 100;
  }
  // console.log(value);
  progress.style.width = `${value}%`;
  handleInput(valueMove);
  checkTimeUpdate = true;
};

progressSpan.addEventListener("mousedown", function (e) {
  e.stopPropagation();
  e.preventDefault();
  document.addEventListener("mousemove", handleDrag);
  initialClientX = e.clientX;
  recentTime = audio.currentTime;
  flag = true;
});

document.addEventListener("mouseup", function () {
  // checkTime = true;
  isDrag = false;
  document.removeEventListener("mousemove", handleDrag);
  currentValue = value;
  if (checkTimeUpdate) {
    audio.currentTime = currentTimeUpdate;
  }
  checkTimeUpdate = false;
  flag = false;
});

// Nhận giá trị khi kéo, khi bấm chuột xuống
// 1.Nhả chuột
var handleChange = function (value) {
  var timeUpdate = (value * audio.duration) / 100;
  audio.currentTime = timeUpdate;
  recentTime = timeUpdate;
};

// 2. Bấm chuột xuống và kéo
var handleInput = function (valueMove) {
  var timeChange = (valueMove * 100) / progressBarWidth;
  timeChange = (timeChange * audio.duration) / 100 + recentTime;
  if (timeChange > audio.duration) {
    timeChange = audio.duration;
  }
  if (timeChange < 0) {
    timeChange = 0;
  }
  currentTimeEl.innerText = getTime(timeChange);
  currentTimeUpdate = timeChange;
  var value = (timeChange * 100) / audio.duration;
  // console.log(value);
  if (value < 0) {
    value = 0;
  }

  if (value > 100) {
    value = 100;
  }
  progress.style.width = `${value}%`;
  if (!isDrag) {
    audio.currentTime = timeChange;
  }
};

var mark = function () {
  return Math.floor(Math.random() * 100);
};

var getComment = function (mark) {
  if (80 < mark && mark <= 100) {
    return `WOW! Amazing GÚT CHÓP. 
        Đề nghị hát thêm bài nữa`;
  } else if (60 < mark && mark <= 80) {
    return `Bạn hát cũng tạm được đó`;
  } else if (40 < mark && mark <= 60) {
    return `Bạn hát không hay cần cải thiện`;
  } else if (20 < mark && mark <= 40) {
    return `Bỏ đi bạn ơi!`;
  } else if (mark <= 20) {
    return `1 CỐC`;
  }
};

var audio = document.querySelector(".audio");
var currentTimeEl = progressBar.previousElementSibling;
var durationEl = progressBar.nextElementSibling;

currentTimeEl.style.color = "purple";
durationEl.style.color = "purple";

var playBtn = document.querySelector(".play-btn");

var pauseIcon = `<i class="fa-solid fa-pause"></i>`;

var playIcon = `<i class="fa-solid fa-play"></i>`;

var getTime = function (seconds) {
  var mins = Math.floor(seconds / 60);
  seconds = Math.floor(seconds - mins * 60);
  return `${mins < 10 ? "0" + mins : mins}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
};

audio.addEventListener("loadeddata", function () {
  durationEl.innerText = getTime(audio.duration);
});

playBtn.addEventListener("click", function () {
  if (audio.paused) {
    audio.play();
    this.innerHTML = pauseIcon;
    musicImage.classList.add("effect");
  } else {
    audio.pause();
    this.innerHTML = playIcon;
    musicImage.classList.remove("effect");
  }
});

audio.addEventListener("timeupdate", function () {
  if (!isDrag) {
    currentTimeEl.innerText = getTime(audio.currentTime);
    durationEl.innerText = getTime(audio.duration);
    var value = (audio.currentTime * 100) / audio.duration;
    progress.style.width = `${value}%`;
    currentTimeUpdate = audio.currentTime;
  }
});

audio.addEventListener("pause", function () {
  playBtn.innerHTML = playIcon;
  musicImage.classList.remove("effect");
  clearInterval(getSentencesMusic);
});
var getSentencesMusic;
audio.addEventListener("play", function () {
  playBtn.innerHTML = pauseIcon;
  musicImage.classList.add("effect");
  getSentencesMusic = setInterval(renderSentences, 0);
});

progressBar.addEventListener("mousemove", function (e) {
  if (!flag) {
    var barRate = (e.offsetX * 100) / progressBarWidth;
    var timeShow = (barRate * audio.duration) / 100;
    timeLine.style.display = "block";
    timeLine.innerText = getTime(timeShow);
    timeLine.style.left = `${e.offsetX}px`;
    timeLine.style.transform = `translateX(-50%)`;
    e.stopPropagation();
  }
});

audio.addEventListener("ended", function () {
  progress.style.width = 0;
  playBtn.innerHTML = playIcon;
  audio.currentTime = 0;
  currentTimeUpdate = 0;
  value = 0;
  if (repeatCheck) {
    setTimeout(function () {
      audio.play();
    }, 500);
  }
  var markVoice = mark();
  var comment = getComment(markVoice);
  karaokeContent.children[0].innerHTML = `${markVoice} Điểm`;
  karaokeContent.children[1].innerHTML = comment;
});

progressBar.addEventListener("mouseout", function () {
  timeLine.style.display = "";
});

progressSpan.addEventListener("mousemove", function (e) {
  timeLine.style.display = "";
  e.stopPropagation();
});

var count = 0;

var playList = [
  `./music/lonroiconkhocnhe.mp3`,
  `./music/cay da quan doc.mp3`,
  `./music/Cho ngay cuoi em.mp3`,
  `./music/kia bong dang ai.mp3`,
];

var imageList = [
  `./images/lonkhocnhe.jpg`,
  `./images/cay da quan doc.jpg`,
  `./images/cho ngay cuoi  em.jpg`,
  `./images/Kia bong dang ai.jpg`,
];

var musicNameList = [
  `Lớn Rồi Còn Khóc Nhè`,
  `Cây Đa Quán Dốc`,
  `Chờ Ngày Cưới Em`,
  `Kìa Bóng Dáng Ai`,
];

var singers = [`Lưu Anh Quân`, `Tạ Hoàng An`, `Đặng Ngọc Khải`, `Lê Đức Nam`];

var downloadLinks = [
  `https://vnno-zn-5-tf-a128-zmp3.zmdcdn.me/2bffcdf100535fc0c9a0f0a967cca1e1?authen=exp=1695827632~acl=/2bffcdf100535fc0c9a0f0a967cca1e1/*~hmac=072c7fa3482ba117f3d20bcfa466966f`,
  `https://a128-zmp3.zmdcdn.me/01dfa81eac14d450eff35d7159c71198?authen=exp=1695873182~acl=/01dfa81eac14d450eff35d7159c71198/*~hmac=87e4c9f7ea45416ccc0db763808af87d`,
  `https://vnno-pt-2-tf-a128-zmp3.zmdcdn.me/95273c28abe224d412e608abd1f3113b?authen=exp=1695269118~acl=/95273c28abe224d412e608abd1f3113b/*~hmac=71d841d08e90c4804e0b1bb925d61abe`,
  `https://vnno-zn-5-tf-a128-zmp3.zmdcdn.me/441908d84c9e3c3f6044bc3f0e629465?authen=exp=1695268895~acl=/441908d84c9e3c3f6044bc3f0e629465/*~hmac=5a7167734d4792f194eff6bbb91b2ea2`,
];

var lyricList = [
  `{
          "err": 0,
          "msg": "Success",
          "data": {
              "sentences": [
                  {
                      "words": [
                          {
                              "startTime": 18020,
                              "endTime": 18280,
                              "data": "Ngày"
                          },
                          {
                              "startTime": 18280,
                              "endTime": 18550,
                              "data": "thơ"
                          },
                          {
                              "startTime": 18550,
                              "endTime": 18820,
                              "data": "bé"
                          },
                          {
                              "startTime": 18820,
                              "endTime": 19080,
                              "data": "có"
                          },
                          {
                              "startTime": 19080,
                              "endTime": 19620,
                              "data": "cánh"
                          },
                          {
                              "startTime": 19620,
                              "endTime": 20140,
                              "data": "đồng"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 20140,
                              "endTime": 20410,
                              "data": "Trưa"
                          },
                          {
                              "startTime": 20410,
                              "endTime": 20680,
                              "data": "nắng"
                          },
                          {
                              "startTime": 20680,
                              "endTime": 20940,
                              "data": "bên"
                          },
                          {
                              "startTime": 20940,
                              "endTime": 21210,
                              "data": "bờ"
                          },
                          {
                              "startTime": 21210,
                              "endTime": 22010,
                              "data": "sông"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 22010,
                              "endTime": 22280,
                              "data": "Thời"
                          },
                          {
                              "startTime": 22280,
                              "endTime": 22810,
                              "data": "tôi"
                          },
                          {
                              "startTime": 22810,
                              "endTime": 23070,
                              "data": "chưa"
                          },
                          {
                              "startTime": 23070,
                              "endTime": 23330,
                              "data": "biết"
                          },
                          {
                              "startTime": 23330,
                              "endTime": 23590,
                              "data": "vâng"
                          },
                          {
                              "startTime": 23590,
                              "endTime": 24130,
                              "data": "lời"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 24130,
                              "endTime": 24390,
                              "data": "Chỉ"
                          },
                          {
                              "startTime": 24390,
                              "endTime": 24660,
                              "data": "biết"
                          },
                          {
                              "startTime": 24660,
                              "endTime": 24930,
                              "data": "chơi"
                          },
                          {
                              "startTime": 24930,
                              "endTime": 25200,
                              "data": "và"
                          },
                          {
                              "startTime": 25200,
                              "endTime": 25930,
                              "data": "cười"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 25930,
                              "endTime": 26190,
                              "data": "Lời"
                          },
                          {
                              "startTime": 26190,
                              "endTime": 26730,
                              "data": "mẹ"
                          },
                          {
                              "startTime": 26730,
                              "endTime": 27260,
                              "data": "nói"
                          },
                          {
                              "startTime": 27260,
                              "endTime": 27790,
                              "data": "không"
                          },
                          {
                              "startTime": 27790,
                              "endTime": 28580,
                              "data": "nghe"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 28580,
                              "endTime": 28860,
                              "data": "Cho"
                          },
                          {
                              "startTime": 28860,
                              "endTime": 29120,
                              "data": "rằng"
                          },
                          {
                              "startTime": 29120,
                              "endTime": 29380,
                              "data": "luôn"
                          },
                          {
                              "startTime": 29380,
                              "endTime": 29920,
                              "data": "khắt"
                          },
                          {
                              "startTime": 29920,
                              "endTime": 30650,
                              "data": "khe"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 30650,
                              "endTime": 30920,
                              "data": "Mẹ"
                          },
                          {
                              "startTime": 30920,
                              "endTime": 31720,
                              "data": "nói"
                          },
                          {
                              "startTime": 31720,
                              "endTime": 31980,
                              "data": "con"
                          },
                          {
                              "startTime": 31980,
                              "endTime": 32240,
                              "data": "trai"
                          },
                          {
                              "startTime": 32240,
                              "endTime": 32510,
                              "data": "đừng"
                          },
                          {
                              "startTime": 32510,
                              "endTime": 33040,
                              "data": "khóc"
                          },
                          {
                              "startTime": 33040,
                              "endTime": 34290,
                              "data": "nhè"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 34290,
                              "endTime": 34570,
                              "data": "Ngu"
                          },
                          {
                              "startTime": 34570,
                              "endTime": 34830,
                              "data": "ngơ"
                          },
                          {
                              "startTime": 34830,
                              "endTime": 35090,
                              "data": "chạy"
                          },
                          {
                              "startTime": 35090,
                              "endTime": 35630,
                              "data": "theo"
                          },
                          {
                              "startTime": 35630,
                              "endTime": 36160,
                              "data": "đám"
                          },
                          {
                              "startTime": 36160,
                              "endTime": 36680,
                              "data": "bạn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 36680,
                              "endTime": 36960,
                              "data": "Tôi"
                          },
                          {
                              "startTime": 36960,
                              "endTime": 37480,
                              "data": "đàn"
                          },
                          {
                              "startTime": 37480,
                              "endTime": 38560,
                              "data": "ca"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 38560,
                              "endTime": 38830,
                              "data": "Ấy"
                          },
                          {
                              "startTime": 38830,
                              "endTime": 39090,
                              "data": "thế"
                          },
                          {
                              "startTime": 39090,
                              "endTime": 39360,
                              "data": "mà"
                          },
                          {
                              "startTime": 39360,
                              "endTime": 39620,
                              "data": "khiếu"
                          },
                          {
                              "startTime": 39620,
                              "endTime": 40150,
                              "data": "văn"
                          },
                          {
                              "startTime": 40150,
                              "endTime": 40690,
                              "data": "nghệ"
                          },
                          {
                              "startTime": 40690,
                              "endTime": 41220,
                              "data": "nhất"
                          },
                          {
                              "startTime": 41220,
                              "endTime": 42290,
                              "data": "nhà"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 42290,
                              "endTime": 42810,
                              "data": "Bạn"
                          },
                          {
                              "startTime": 42810,
                              "endTime": 43350,
                              "data": "bè"
                          },
                          {
                              "startTime": 43350,
                              "endTime": 43880,
                              "data": "cố"
                          },
                          {
                              "startTime": 43880,
                              "endTime": 44400,
                              "data": "bao"
                          },
                          {
                              "startTime": 44400,
                              "endTime": 45200,
                              "data": "che"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 45200,
                              "endTime": 45460,
                              "data": "Câu"
                          },
                          {
                              "startTime": 45460,
                              "endTime": 45740,
                              "data": "nào"
                          },
                          {
                              "startTime": 45740,
                              "endTime": 46000,
                              "data": "cũng"
                          },
                          {
                              "startTime": 46000,
                              "endTime": 46260,
                              "data": "dễ"
                          },
                          {
                              "startTime": 46260,
                              "endTime": 47330,
                              "data": "nghe"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 47330,
                              "endTime": 47590,
                              "data": "Nó"
                          },
                          {
                              "startTime": 47590,
                              "endTime": 48390,
                              "data": "nói"
                          },
                          {
                              "startTime": 48390,
                              "endTime": 48650,
                              "data": "hay"
                          },
                          {
                              "startTime": 48650,
                              "endTime": 48920,
                              "data": "hơn"
                          },
                          {
                              "startTime": 48920,
                              "endTime": 49190,
                              "data": "lời"
                          },
                          {
                              "startTime": 49190,
                              "endTime": 49450,
                              "data": "của"
                          },
                          {
                              "startTime": 49450,
                              "endTime": 52450,
                              "data": "mẹ"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 59270,
                              "endTime": 59550,
                              "data": "Tôi"
                          },
                          {
                              "startTime": 59550,
                              "endTime": 60070,
                              "data": "ôm"
                          },
                          {
                              "startTime": 60070,
                              "endTime": 60340,
                              "data": "đàn"
                          },
                          {
                              "startTime": 60340,
                              "endTime": 60600,
                              "data": "và"
                          },
                          {
                              "startTime": 60600,
                              "endTime": 61340,
                              "data": "hát"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 61340,
                              "endTime": 61610,
                              "data": "Đi"
                          },
                          {
                              "startTime": 61610,
                              "endTime": 61870,
                              "data": "xa"
                          },
                          {
                              "startTime": 61870,
                              "endTime": 62420,
                              "data": "cùng"
                          },
                          {
                              "startTime": 62420,
                              "endTime": 62690,
                              "data": "bè"
                          },
                          {
                              "startTime": 62690,
                              "endTime": 63770,
                              "data": "bạn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 63770,
                              "endTime": 64030,
                              "data": "Ước"
                          },
                          {
                              "startTime": 64030,
                              "endTime": 64290,
                              "data": "mơ"
                          },
                          {
                              "startTime": 64290,
                              "endTime": 64560,
                              "data": "con"
                          },
                          {
                              "startTime": 64560,
                              "endTime": 64830,
                              "data": "là"
                          },
                          {
                              "startTime": 64830,
                              "endTime": 65090,
                              "data": "vòng"
                          },
                          {
                              "startTime": 65090,
                              "endTime": 65360,
                              "data": "quanh"
                          },
                          {
                              "startTime": 65360,
                              "endTime": 65890,
                              "data": "thế"
                          },
                          {
                              "startTime": 65890,
                              "endTime": 67480,
                              "data": "gian"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 67480,
                              "endTime": 67740,
                              "data": "Tôi"
                          },
                          {
                              "startTime": 67740,
                              "endTime": 68280,
                              "data": "vô"
                          },
                          {
                              "startTime": 68280,
                              "endTime": 68540,
                              "data": "tình"
                          },
                          {
                              "startTime": 68540,
                              "endTime": 68820,
                              "data": "là"
                          },
                          {
                              "startTime": 68820,
                              "endTime": 69360,
                              "data": "thế"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 69360,
                              "endTime": 69630,
                              "data": "Hay"
                          },
                          {
                              "startTime": 69630,
                              "endTime": 70150,
                              "data": "quên"
                          },
                          {
                              "startTime": 70150,
                              "endTime": 70690,
                              "data": "gọi"
                          },
                          {
                              "startTime": 70690,
                              "endTime": 70950,
                              "data": "về"
                          },
                          {
                              "startTime": 70950,
                              "endTime": 72010,
                              "data": "mẹ"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 72010,
                              "endTime": 72280,
                              "data": "Ước"
                          },
                          {
                              "startTime": 72280,
                              "endTime": 72550,
                              "data": "mơ"
                          },
                          {
                              "startTime": 72550,
                              "endTime": 72810,
                              "data": "của"
                          },
                          {
                              "startTime": 72810,
                              "endTime": 73080,
                              "data": "mẹ"
                          },
                          {
                              "startTime": 73080,
                              "endTime": 73340,
                              "data": "là"
                          },
                          {
                              "startTime": 73340,
                              "endTime": 73880,
                              "data": "thấy"
                          },
                          {
                              "startTime": 73880,
                              "endTime": 74140,
                              "data": "con"
                          },
                          {
                              "startTime": 74140,
                              "endTime": 75740,
                              "data": "về"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 75740,
                              "endTime": 76000,
                              "data": "Tôi"
                          },
                          {
                              "startTime": 76000,
                              "endTime": 76530,
                              "data": "ôm"
                          },
                          {
                              "startTime": 76530,
                              "endTime": 77060,
                              "data": "đàn"
                          },
                          {
                              "startTime": 77060,
                              "endTime": 77330,
                              "data": "và"
                          },
                          {
                              "startTime": 77330,
                              "endTime": 77850,
                              "data": "hát"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 77850,
                              "endTime": 78120,
                              "data": "Đi"
                          },
                          {
                              "startTime": 78120,
                              "endTime": 78650,
                              "data": "xa"
                          },
                          {
                              "startTime": 78650,
                              "endTime": 78930,
                              "data": "cùng"
                          },
                          {
                              "startTime": 78930,
                              "endTime": 79190,
                              "data": "bè"
                          },
                          {
                              "startTime": 79190,
                              "endTime": 80250,
                              "data": "bạn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 80250,
                              "endTime": 80510,
                              "data": "Ước"
                          },
                          {
                              "startTime": 80510,
                              "endTime": 80780,
                              "data": "mơ"
                          },
                          {
                              "startTime": 80780,
                              "endTime": 81050,
                              "data": "con"
                          },
                          {
                              "startTime": 81050,
                              "endTime": 81310,
                              "data": "là"
                          },
                          {
                              "startTime": 81310,
                              "endTime": 81580,
                              "data": "vòng"
                          },
                          {
                              "startTime": 81580,
                              "endTime": 81840,
                              "data": "quanh"
                          },
                          {
                              "startTime": 81840,
                              "endTime": 82640,
                              "data": "thế"
                          },
                          {
                              "startTime": 82640,
                              "endTime": 83960,
                              "data": "gian"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 83960,
                              "endTime": 84240,
                              "data": "Tôi"
                          },
                          {
                              "startTime": 84240,
                              "endTime": 84760,
                              "data": "vô"
                          },
                          {
                              "startTime": 84760,
                              "endTime": 85290,
                              "data": "tình"
                          },
                          {
                              "startTime": 85290,
                              "endTime": 85570,
                              "data": "là"
                          },
                          {
                              "startTime": 85570,
                              "endTime": 86090,
                              "data": "thế"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 86090,
                              "endTime": 86350,
                              "data": "Hay"
                          },
                          {
                              "startTime": 86350,
                              "endTime": 86890,
                              "data": "quên"
                          },
                          {
                              "startTime": 86890,
                              "endTime": 87420,
                              "data": "gọi"
                          },
                          {
                              "startTime": 87420,
                              "endTime": 87690,
                              "data": "về"
                          },
                          {
                              "startTime": 87690,
                              "endTime": 88750,
                              "data": "mẹ"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 88750,
                              "endTime": 89020,
                              "data": "Ước"
                          },
                          {
                              "startTime": 89020,
                              "endTime": 89020,
                              "data": "mơ"
                          },
                          {
                              "startTime": 89020,
                              "endTime": 89540,
                              "data": "của"
                          },
                          {
                              "startTime": 89540,
                              "endTime": 89810,
                              "data": "mẹ"
                          },
                          {
                              "startTime": 89810,
                              "endTime": 90080,
                              "data": "là"
                          },
                          {
                              "startTime": 90080,
                              "endTime": 90340,
                              "data": "thấy"
                          },
                          {
                              "startTime": 90340,
                              "endTime": 90880,
                              "data": "con"
                          },
                          {
                              "startTime": 90880,
                              "endTime": 92420,
                              "data": "về"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 92420,
                              "endTime": 92680,
                              "data": "Rồi"
                          },
                          {
                              "startTime": 92680,
                              "endTime": 92960,
                              "data": "tôi"
                          },
                          {
                              "startTime": 92960,
                              "endTime": 93220,
                              "data": "xơ"
                          },
                          {
                              "startTime": 93220,
                              "endTime": 93480,
                              "data": "xác"
                          },
                          {
                              "startTime": 93480,
                              "endTime": 94020,
                              "data": "đi"
                          },
                          {
                              "startTime": 94020,
                              "endTime": 94550,
                              "data": "nhiều"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 94550,
                              "endTime": 94810,
                              "data": "Khi"
                          },
                          {
                              "startTime": 94810,
                              "endTime": 95070,
                              "data": "mới"
                          },
                          {
                              "startTime": 95070,
                              "endTime": 95340,
                              "data": "quen"
                          },
                          {
                              "startTime": 95340,
                              "endTime": 95610,
                              "data": "người"
                          },
                          {
                              "startTime": 95610,
                              "endTime": 96670,
                              "data": "yêu"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 96670,
                              "endTime": 96940,
                              "data": "Thời"
                          },
                          {
                              "startTime": 96940,
                              "endTime": 97210,
                              "data": "tôi"
                          },
                          {
                              "startTime": 97210,
                              "endTime": 97470,
                              "data": "mới"
                          },
                          {
                              "startTime": 97470,
                              "endTime": 97730,
                              "data": "biết"
                          },
                          {
                              "startTime": 97730,
                              "endTime": 98270,
                              "data": "đi"
                          },
                          {
                              "startTime": 98270,
                              "endTime": 98800,
                              "data": "làm"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 98800,
                              "endTime": 99060,
                              "data": "Em"
                          },
                          {
                              "startTime": 99060,
                              "endTime": 99330,
                              "data": "cứ"
                          },
                          {
                              "startTime": 99330,
                              "endTime": 99600,
                              "data": "hay"
                          },
                          {
                              "startTime": 99600,
                              "endTime": 99860,
                              "data": "càm"
                          },
                          {
                              "startTime": 99860,
                              "endTime": 100120,
                              "data": "ràm"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 100120,
                              "endTime": 100650,
                              "data": "Người"
                          },
                          {
                              "startTime": 100650,
                              "endTime": 101180,
                              "data": "yêu"
                          },
                          {
                              "startTime": 101180,
                              "endTime": 101980,
                              "data": "nói"
                          },
                          {
                              "startTime": 101980,
                              "endTime": 102250,
                              "data": "tôi"
                          },
                          {
                              "startTime": 102250,
                              "endTime": 102780,
                              "data": "nghe"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 102780,
                              "endTime": 103310,
                              "data": "Tuy"
                          },
                          {
                              "startTime": 103310,
                              "endTime": 103570,
                              "data": "lời"
                          },
                          {
                              "startTime": 103570,
                              "endTime": 103850,
                              "data": "hơi"
                          },
                          {
                              "startTime": 103850,
                              "endTime": 104370,
                              "data": "khó"
                          },
                          {
                              "startTime": 104370,
                              "endTime": 105170,
                              "data": "nghe"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 105170,
                              "endTime": 105440,
                              "data": "Em"
                          },
                          {
                              "startTime": 105440,
                              "endTime": 106240,
                              "data": "nói"
                          },
                          {
                              "startTime": 106240,
                              "endTime": 106500,
                              "data": "hay"
                          },
                          {
                              "startTime": 106500,
                              "endTime": 106760,
                              "data": "hơn"
                          },
                          {
                              "startTime": 106760,
                              "endTime": 107020,
                              "data": "lời"
                          },
                          {
                              "startTime": 107020,
                              "endTime": 107560,
                              "data": "của"
                          },
                          {
                              "startTime": 107560,
                              "endTime": 108840,
                              "data": "mẹ"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 108840,
                              "endTime": 109100,
                              "data": "Thấm"
                          },
                          {
                              "startTime": 109100,
                              "endTime": 109370,
                              "data": "thoát"
                          },
                          {
                              "startTime": 109370,
                              "endTime": 109640,
                              "data": "lại"
                          },
                          {
                              "startTime": 109640,
                              "endTime": 110170,
                              "data": "thấy"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 110170,
                              "endTime": 110690,
                              "data": "Tôi"
                          },
                          {
                              "startTime": 110690,
                              "endTime": 110970,
                              "data": "chẳng"
                          },
                          {
                              "startTime": 110970,
                              "endTime": 111510,
                              "data": "thiếu"
                          },
                          {
                              "startTime": 111510,
                              "endTime": 112050,
                              "data": "điều"
                          },
                          {
                              "startTime": 112050,
                              "endTime": 112840,
                              "data": "chi"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 112840,
                              "endTime": 113120,
                              "data": "Lắm"
                          },
                          {
                              "startTime": 113120,
                              "endTime": 113370,
                              "data": "lúc"
                          },
                          {
                              "startTime": 113370,
                              "endTime": 113640,
                              "data": "lại"
                          },
                          {
                              "startTime": 113640,
                              "endTime": 114170,
                              "data": "thấy"
                          },
                          {
                              "startTime": 114170,
                              "endTime": 114700,
                              "data": "tôi"
                          },
                          {
                              "startTime": 114700,
                              "endTime": 115230,
                              "data": "chẳng"
                          },
                          {
                              "startTime": 115230,
                              "endTime": 115760,
                              "data": "có"
                          },
                          {
                              "startTime": 115760,
                              "endTime": 116820,
                              "data": "gì"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 116820,
                              "endTime": 117350,
                              "data": "Phải"
                          },
                          {
                              "startTime": 117350,
                              "endTime": 117890,
                              "data": "chăng"
                          },
                          {
                              "startTime": 117890,
                              "endTime": 118410,
                              "data": "lớn"
                          },
                          {
                              "startTime": 118410,
                              "endTime": 118680,
                              "data": "khôn"
                          },
                          {
                              "startTime": 118680,
                              "endTime": 119480,
                              "data": "hơn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 119480,
                              "endTime": 120010,
                              "data": "Hay"
                          },
                          {
                              "startTime": 120010,
                              "endTime": 120280,
                              "data": "càng"
                          },
                          {
                              "startTime": 120280,
                              "endTime": 120550,
                              "data": "ngu"
                          },
                          {
                              "startTime": 120550,
                              "endTime": 120810,
                              "data": "ngốc"
                          },
                          {
                              "startTime": 120810,
                              "endTime": 121870,
                              "data": "hơn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 121870,
                              "endTime": 122140,
                              "data": "Tôi"
                          },
                          {
                              "startTime": 122140,
                              "endTime": 122670,
                              "data": "muốn"
                          },
                          {
                              "startTime": 122670,
                              "endTime": 122940,
                              "data": "nghe"
                          },
                          {
                              "startTime": 122940,
                              "endTime": 123200,
                              "data": "thêm"
                          },
                          {
                              "startTime": 123200,
                              "endTime": 123470,
                              "data": "lời"
                          },
                          {
                              "startTime": 123470,
                              "endTime": 124000,
                              "data": "của"
                          },
                          {
                              "startTime": 124000,
                              "endTime": 127000,
                              "data": "mẹ"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 133770,
                              "endTime": 134030,
                              "data": "Tôi"
                          },
                          {
                              "startTime": 134030,
                              "endTime": 134300,
                              "data": "ôm"
                          },
                          {
                              "startTime": 134300,
                              "endTime": 135100,
                              "data": "đàn"
                          },
                          {
                              "startTime": 135100,
                              "endTime": 135100,
                              "data": "và"
                          },
                          {
                              "startTime": 135100,
                              "endTime": 135590,
                              "data": "hát"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 135590,
                              "endTime": 135850,
                              "data": "Đi"
                          },
                          {
                              "startTime": 135850,
                              "endTime": 136390,
                              "data": "xa"
                          },
                          {
                              "startTime": 136390,
                              "endTime": 136910,
                              "data": "cùng"
                          },
                          {
                              "startTime": 136910,
                              "endTime": 137180,
                              "data": "bè"
                          },
                          {
                              "startTime": 137180,
                              "endTime": 138240,
                              "data": "bạn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 138240,
                              "endTime": 138510,
                              "data": "Ước"
                          },
                          {
                              "startTime": 138510,
                              "endTime": 138780,
                              "data": "mơ"
                          },
                          {
                              "startTime": 138780,
                              "endTime": 139040,
                              "data": "con"
                          },
                          {
                              "startTime": 139040,
                              "endTime": 139300,
                              "data": "là"
                          },
                          {
                              "startTime": 139300,
                              "endTime": 139580,
                              "data": "vòng"
                          },
                          {
                              "startTime": 139580,
                              "endTime": 139840,
                              "data": "quanh"
                          },
                          {
                              "startTime": 139840,
                              "endTime": 140360,
                              "data": "thế"
                          },
                          {
                              "startTime": 140360,
                              "endTime": 141970,
                              "data": "gian"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 141970,
                              "endTime": 142230,
                              "data": "Tôi"
                          },
                          {
                              "startTime": 142230,
                              "endTime": 142750,
                              "data": "vô"
                          },
                          {
                              "startTime": 142750,
                              "endTime": 143030,
                              "data": "tình"
                          },
                          {
                              "startTime": 143030,
                              "endTime": 143290,
                              "data": "là"
                          },
                          {
                              "startTime": 143290,
                              "endTime": 143830,
                              "data": "thế"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 143830,
                              "endTime": 144090,
                              "data": "Hay"
                          },
                          {
                              "startTime": 144090,
                              "endTime": 144620,
                              "data": "quên"
                          },
                          {
                              "startTime": 144620,
                              "endTime": 145150,
                              "data": "gọi"
                          },
                          {
                              "startTime": 145150,
                              "endTime": 145420,
                              "data": "về"
                          },
                          {
                              "startTime": 145420,
                              "endTime": 146480,
                              "data": "mẹ"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 146480,
                              "endTime": 146740,
                              "data": "Ước"
                          },
                          {
                              "startTime": 146740,
                              "endTime": 147000,
                              "data": "mơ"
                          },
                          {
                              "startTime": 147000,
                              "endTime": 147280,
                              "data": "của"
                          },
                          {
                              "startTime": 147280,
                              "endTime": 147540,
                              "data": "mẹ"
                          },
                          {
                              "startTime": 147540,
                              "endTime": 147810,
                              "data": "là"
                          },
                          {
                              "startTime": 147810,
                              "endTime": 148340,
                              "data": "thấy"
                          },
                          {
                              "startTime": 148340,
                              "endTime": 148870,
                              "data": "con"
                          },
                          {
                              "startTime": 148870,
                              "endTime": 150190,
                              "data": "về"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 150190,
                              "endTime": 150470,
                              "data": "Tôi"
                          },
                          {
                              "startTime": 150470,
                              "endTime": 150990,
                              "data": "ôm"
                          },
                          {
                              "startTime": 150990,
                              "endTime": 151530,
                              "data": "đàn"
                          },
                          {
                              "startTime": 151530,
                              "endTime": 151790,
                              "data": "và"
                          },
                          {
                              "startTime": 151790,
                              "endTime": 152050,
                              "data": "hát"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 152050,
                              "endTime": 152590,
                              "data": "Đi"
                          },
                          {
                              "startTime": 152590,
                              "endTime": 152850,
                              "data": "xa"
                          },
                          {
                              "startTime": 152850,
                              "endTime": 153380,
                              "data": "cùng"
                          },
                          {
                              "startTime": 153380,
                              "endTime": 153650,
                              "data": "bè"
                          },
                          {
                              "startTime": 153650,
                              "endTime": 154720,
                              "data": "bạn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 154720,
                              "endTime": 154980,
                              "data": "Ước"
                          },
                          {
                              "startTime": 154980,
                              "endTime": 155240,
                              "data": "mơ"
                          },
                          {
                              "startTime": 155240,
                              "endTime": 155510,
                              "data": "con"
                          },
                          {
                              "startTime": 155510,
                              "endTime": 155780,
                              "data": "là"
                          },
                          {
                              "startTime": 155780,
                              "endTime": 156040,
                              "data": "vòng"
                          },
                          {
                              "startTime": 156040,
                              "endTime": 156310,
                              "data": "quanh"
                          },
                          {
                              "startTime": 156310,
                              "endTime": 156830,
                              "data": "thế"
                          },
                          {
                              "startTime": 156830,
                              "endTime": 158430,
                              "data": "gian"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 158430,
                              "endTime": 158690,
                              "data": "Tôi"
                          },
                          {
                              "startTime": 158690,
                              "endTime": 159230,
                              "data": "vô"
                          },
                          {
                              "startTime": 159230,
                              "endTime": 159760,
                              "data": "tình"
                          },
                          {
                              "startTime": 159760,
                              "endTime": 160020,
                              "data": "là"
                          },
                          {
                              "startTime": 160020,
                              "endTime": 160560,
                              "data": "thế"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 160560,
                              "endTime": 160820,
                              "data": "Hay"
                          },
                          {
                              "startTime": 160820,
                              "endTime": 161090,
                              "data": "quên"
                          },
                          {
                              "startTime": 161090,
                              "endTime": 161880,
                              "data": "gọi"
                          },
                          {
                              "startTime": 161880,
                              "endTime": 161880,
                              "data": "về"
                          },
                          {
                              "startTime": 161880,
                              "endTime": 163220,
                              "data": "mẹ"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 163220,
                              "endTime": 163220,
                              "data": "Ước"
                          },
                          {
                              "startTime": 163220,
                              "endTime": 163480,
                              "data": "mơ"
                          },
                          {
                              "startTime": 163480,
                              "endTime": 163750,
                              "data": "của"
                          },
                          {
                              "startTime": 163750,
                              "endTime": 164030,
                              "data": "mẹ"
                          },
                          {
                              "startTime": 164030,
                              "endTime": 164270,
                              "data": "là"
                          },
                          {
                              "startTime": 164270,
                              "endTime": 164810,
                              "data": "thấy"
                          },
                          {
                              "startTime": 164810,
                              "endTime": 165330,
                              "data": "con"
                          },
                          {
                              "startTime": 165330,
                              "endTime": 168330,
                              "data": "về"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 183660,
                              "endTime": 183660,
                              "data": "Giờ"
                          },
                          {
                              "startTime": 183660,
                              "endTime": 183930,
                              "data": "tôi"
                          },
                          {
                              "startTime": 183930,
                              "endTime": 184200,
                              "data": "nhớ"
                          },
                          {
                              "startTime": 184200,
                              "endTime": 184460,
                              "data": "những"
                          },
                          {
                              "startTime": 184460,
                              "endTime": 185000,
                              "data": "cánh"
                          },
                          {
                              "startTime": 185000,
                              "endTime": 185520,
                              "data": "đồng"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 185520,
                              "endTime": 185790,
                              "data": "Trưa"
                          },
                          {
                              "startTime": 185790,
                              "endTime": 186060,
                              "data": "nắng"
                          },
                          {
                              "startTime": 186060,
                              "endTime": 186320,
                              "data": "bên"
                          },
                          {
                              "startTime": 186320,
                              "endTime": 186590,
                              "data": "bờ"
                          },
                          {
                              "startTime": 186590,
                              "endTime": 187650,
                              "data": "sông"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 187650,
                              "endTime": 187910,
                              "data": "Giờ"
                          },
                          {
                              "startTime": 187910,
                              "endTime": 188190,
                              "data": "tôi"
                          },
                          {
                              "startTime": 188190,
                              "endTime": 188450,
                              "data": "mới"
                          },
                          {
                              "startTime": 188450,
                              "endTime": 188710,
                              "data": "biết"
                          },
                          {
                              "startTime": 188710,
                              "endTime": 189240,
                              "data": "vâng"
                          },
                          {
                              "startTime": 189240,
                              "endTime": 189770,
                              "data": "lời"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 189770,
                              "endTime": 190040,
                              "data": "Thương"
                          },
                          {
                              "startTime": 190040,
                              "endTime": 190300,
                              "data": "lắm"
                          },
                          {
                              "startTime": 190300,
                              "endTime": 190570,
                              "data": "khi"
                          },
                          {
                              "startTime": 190570,
                              "endTime": 190840,
                              "data": "mẹ"
                          },
                          {
                              "startTime": 190840,
                              "endTime": 191370,
                              "data": "cười"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 191370,
                              "endTime": 191640,
                              "data": "Giờ"
                          },
                          {
                              "startTime": 191640,
                              "endTime": 192160,
                              "data": "tôi"
                          },
                          {
                              "startTime": 192160,
                              "endTime": 192700,
                              "data": "muốn"
                          },
                          {
                              "startTime": 192700,
                              "endTime": 193220,
                              "data": "lắng"
                          },
                          {
                              "startTime": 193220,
                              "endTime": 193760,
                              "data": "nghe"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 193760,
                              "endTime": 194290,
                              "data": "Cho"
                          },
                          {
                              "startTime": 194290,
                              "endTime": 194550,
                              "data": "dù"
                          },
                          {
                              "startTime": 194550,
                              "endTime": 194830,
                              "data": "lời"
                          },
                          {
                              "startTime": 194830,
                              "endTime": 195350,
                              "data": "khắt"
                          },
                          {
                              "startTime": 195350,
                              "endTime": 196150,
                              "data": "khe"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 196150,
                              "endTime": 196410,
                              "data": "Không"
                          },
                          {
                              "startTime": 196410,
                              "endTime": 197210,
                              "data": "biết"
                          },
                          {
                              "startTime": 197210,
                              "endTime": 197480,
                              "data": "bao"
                          },
                          {
                              "startTime": 197480,
                              "endTime": 197740,
                              "data": "lâu"
                          },
                          {
                              "startTime": 197740,
                              "endTime": 198010,
                              "data": "còn"
                          },
                          {
                              "startTime": 198010,
                              "endTime": 198540,
                              "data": "có"
                          },
                          {
                              "startTime": 198540,
                              "endTime": 199600,
                              "data": "mẹ"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 199600,
                              "endTime": 200140,
                              "data": "Ngày"
                          },
                          {
                              "startTime": 200140,
                              "endTime": 200670,
                              "data": "thơ"
                          },
                          {
                              "startTime": 200670,
                              "endTime": 201200,
                              "data": "bé"
                          },
                          {
                              "startTime": 201200,
                              "endTime": 201460,
                              "data": "ngu"
                          },
                          {
                              "startTime": 201460,
                              "endTime": 202250,
                              "data": "ngơ"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 202250,
                              "endTime": 202790,
                              "data": "Ai"
                          },
                          {
                              "startTime": 202790,
                              "endTime": 203050,
                              "data": "chẳng"
                          },
                          {
                              "startTime": 203050,
                              "endTime": 203330,
                              "data": "hay"
                          },
                          {
                              "startTime": 203330,
                              "endTime": 203590,
                              "data": "khóc"
                          },
                          {
                              "startTime": 203590,
                              "endTime": 204580,
                              "data": "nhè"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 204580,
                              "endTime": 204840,
                              "data": "Nay"
                          },
                          {
                              "startTime": 204840,
                              "endTime": 205640,
                              "data": "lớn"
                          },
                          {
                              "startTime": 205640,
                              "endTime": 205900,
                              "data": "cớ"
                          },
                          {
                              "startTime": 205900,
                              "endTime": 206170,
                              "data": "sao"
                          },
                          {
                              "startTime": 206170,
                              "endTime": 206440,
                              "data": "lại"
                          },
                          {
                              "startTime": 206440,
                              "endTime": 206700,
                              "data": "khóc"
                          },
                          {
                              "startTime": 206700,
                              "endTime": 207700,
                              "data": "nhè"
                          }
                      ]
                  }
              ],
              "file": "https://static-zmp3.zmdcdn.me/lyrics/8/d/7/0/8d7026c4f951df210dc7f3af5f71b442.lrc",
              "enabledVideoBG": true,
              "defaultIBGUrls": [
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/c/0/5/3c05c10ae36f6361f9af0874bb7c4851.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/b/b/e/0/bbe01e4bf6d8e23101fcb6db44df311d.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/a/1/f/3/a1f34293d1dc92735be8c3f9082c4acf.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/6/e/9/5/6e95b598e1e14a187ee779bcd888e75c.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/1/c/8/1/1c81e957a6270eba91571d822a47e7c5.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/0/0/0/d/000d9d0679bbbb564a191a6801d7f19d.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/6/4/f/e64f4fd6f53caebabc1c26d592093cfa.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/d/e/3/1/de315c40b537d40b7409a6702f446631.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/1/4/6/2/1462efc7378bed3f98ace411e11eab45.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/5/b/f/a/5bfa05533ed7975035e69a4508c82fd6.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/f/2/b/1/f2b1b91fa64e0c354150c86fd96c249c.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/5/1/f/b/51fbcd4ae32096ffe2dd89cd36bb6ed9.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/6/2/3/9/62392463eab1eb1aaa2d1f3bd0f758bb.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/1/2/f/0/12f01e12d6e13e263ef76f3fdb65d66e.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/8/8/2/4/8824ef8e3e3aa3e302f03879a1f9d7d3.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/4/3/4/9/43491e9d95a9942015548bd2a061250d.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/9/8/7/5/987517940ce71a96bab9c0c88d5b6b95.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/8/e/2/4/8e24305fde744814083af980a593e8c2.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/f/1/2/7/f1270dd1bed79b527228e3351d2b67ae.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/0/a/3/0/0a301934881ee4e2de30dc8f41bc55f9.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/c/c/9/f/cc9fce8719364ba9d8a846984c590a0e.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/5/d/e/e5de86acd7567465f54a6b9307076947.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/6/4/b/b/64bb19c5f971b4e4f16f3bfdff64a396.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/0/3/2/0/03206606d461843e22451747a9b60769.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/b/d/4/4/bd4485d6dfef80764869a4d88d9b0475.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/8/6/8/e86817d147315d9d644835f60d17ae41.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/b/b/4/7/bb477f2f56f162b13426f70c9858c732.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/c/5/3/6/c536ff6ab992e36be24ca0adf8e86ae0.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/6/c/f/c/6cfc1e6e3b94c62cded257659602f00b.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/2/5/d/6/25d6adaa11b4e932d61309ed635d57fa.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/d/2/a/e/d2ae42243ccd4fec321fc60692a5a2dc.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/b/8/0/e/b80e5777c7eec332c882bf79bd692056.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/7/b/a/e7ba1207018f1d2fa7048598c7d627df.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/f/4/0/3f40bd0d6d8cbcf833c72ab050f19e6a.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/a/d/a/d/adad060e15f8409ec2e7670cf943c202.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/d/1/7/ed17742d63b635725e6071a9bee362c5.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/a/e/8/3ae816de233a9eae0116b4b5a21af43e.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/d/7/f/1/d7f15e3996e7923ffc2a64d1f8e43448.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/0/0/7/e/007e6b48696aab4a61ca46a10d980f63.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/d/9/f/5/d9f592437d80e358a76e32798ce2d294.jpg"
              ],
              "BGMode": 0
          },
          "timestamp": 1695699898940
      }`,
  `{
          "err": 0,
          "msg": "Success",
          "data": {
              "sentences": [
                  {
                      "words": [
                          {
                              "startTime": 4900,
                              "endTime": 5290,
                              "data": "Cùng"
                          },
                          {
                              "startTime": 5290,
                              "endTime": 5290,
                              "data": "nhau"
                          },
                          {
                              "startTime": 5290,
                              "endTime": 5690,
                              "data": "trèo"
                          },
                          {
                              "startTime": 5690,
                              "endTime": 6090,
                              "data": "lên"
                          },
                          {
                              "startTime": 6090,
                              "endTime": 6090,
                              "data": "quán"
                          },
                          {
                              "startTime": 6090,
                              "endTime": 6480,
                              "data": "dốc"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 6480,
                              "endTime": 6880,
                              "data": "Lốc"
                          },
                          {
                              "startTime": 6880,
                              "endTime": 6880,
                              "data": "ca"
                          },
                          {
                              "startTime": 6880,
                              "endTime": 7280,
                              "data": "lốc"
                          },
                          {
                              "startTime": 7280,
                              "endTime": 7690,
                              "data": "cốc"
                          },
                          {
                              "startTime": 7690,
                              "endTime": 8100,
                              "data": "tìm"
                          },
                          {
                              "startTime": 8100,
                              "endTime": 8100,
                              "data": "gốc"
                          },
                          {
                              "startTime": 8100,
                              "endTime": 8470,
                              "data": "cây"
                          },
                          {
                              "startTime": 8470,
                              "endTime": 9290,
                              "data": "đa"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 9290,
                              "endTime": 9670,
                              "data": "Dừng"
                          },
                          {
                              "startTime": 9670,
                              "endTime": 10080,
                              "data": "chân"
                          },
                          {
                              "startTime": 10080,
                              "endTime": 10480,
                              "data": "têm"
                          },
                          {
                              "startTime": 10480,
                              "endTime": 10880,
                              "data": "ba"
                          },
                          {
                              "startTime": 10880,
                              "endTime": 10880,
                              "data": "miếng"
                          },
                          {
                              "startTime": 10880,
                              "endTime": 11260,
                              "data": "trầu"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 11260,
                              "endTime": 11680,
                              "data": "Gối"
                          },
                          {
                              "startTime": 11680,
                              "endTime": 12080,
                              "data": "đầu"
                          },
                          {
                              "startTime": 12080,
                              "endTime": 12080,
                              "data": "tay"
                          },
                          {
                              "startTime": 12080,
                              "endTime": 12460,
                              "data": "không"
                          },
                          {
                              "startTime": 12460,
                              "endTime": 12870,
                              "data": "để"
                          },
                          {
                              "startTime": 12870,
                              "endTime": 13260,
                              "data": "ngắm"
                          },
                          {
                              "startTime": 13260,
                              "endTime": 13660,
                              "data": "sao"
                          },
                          {
                              "startTime": 13660,
                              "endTime": 14470,
                              "data": "trời"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 14470,
                              "endTime": 14860,
                              "data": "Nhà"
                          },
                          {
                              "startTime": 14860,
                              "endTime": 15260,
                              "data": "ai"
                          },
                          {
                              "startTime": 15260,
                              "endTime": 15260,
                              "data": "có"
                          },
                          {
                              "startTime": 15260,
                              "endTime": 15660,
                              "data": "con"
                          },
                          {
                              "startTime": 15660,
                              "endTime": 16050,
                              "data": "chim"
                          },
                          {
                              "startTime": 16050,
                              "endTime": 16450,
                              "data": "khách"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 16450,
                              "endTime": 16850,
                              "data": "Lách"
                          },
                          {
                              "startTime": 16850,
                              "endTime": 16850,
                              "data": "ca"
                          },
                          {
                              "startTime": 16850,
                              "endTime": 17240,
                              "data": "lách"
                          },
                          {
                              "startTime": 17240,
                              "endTime": 17640,
                              "data": "cách"
                          },
                          {
                              "startTime": 17640,
                              "endTime": 18040,
                              "data": "tìm"
                          },
                          {
                              "startTime": 18040,
                              "endTime": 18440,
                              "data": "đến"
                          },
                          {
                              "startTime": 18440,
                              "endTime": 18440,
                              "data": "chim"
                          },
                          {
                              "startTime": 18440,
                              "endTime": 19250,
                              "data": "kêu"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 19250,
                              "endTime": 19650,
                              "data": "Rằng"
                          },
                          {
                              "startTime": 19650,
                              "endTime": 20440,
                              "data": "a"
                          },
                          {
                              "startTime": 20440,
                              "endTime": 20440,
                              "data": "có"
                          },
                          {
                              "startTime": 20440,
                              "endTime": 20830,
                              "data": "ba"
                          },
                          {
                              "startTime": 20830,
                              "endTime": 21240,
                              "data": "cô"
                          },
                          {
                              "startTime": 21240,
                              "endTime": 21630,
                              "data": "nàng"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 21630,
                              "endTime": 22030,
                              "data": "Má"
                          },
                          {
                              "startTime": 22030,
                              "endTime": 22030,
                              "data": "đỏ"
                          },
                          {
                              "startTime": 22030,
                              "endTime": 22420,
                              "data": "môi"
                          },
                          {
                              "startTime": 22420,
                              "endTime": 22820,
                              "data": "hồng"
                          },
                          {
                              "startTime": 22820,
                              "endTime": 23240,
                              "data": "chúm"
                          },
                          {
                              "startTime": 23240,
                              "endTime": 23240,
                              "data": "chím"
                          },
                          {
                              "startTime": 23240,
                              "endTime": 23620,
                              "data": "đồng"
                          },
                          {
                              "startTime": 23620,
                              "endTime": 24820,
                              "data": "tiền"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 24820,
                              "endTime": 24820,
                              "data": "Hỏi"
                          },
                          {
                              "startTime": 24820,
                              "endTime": 25210,
                              "data": "cây"
                          },
                          {
                              "startTime": 25210,
                              "endTime": 25610,
                              "data": "đa"
                          },
                          {
                              "startTime": 25610,
                              "endTime": 26010,
                              "data": "sao"
                          },
                          {
                              "startTime": 26010,
                              "endTime": 26400,
                              "data": "vắng"
                          },
                          {
                              "startTime": 26400,
                              "endTime": 26800,
                              "data": "gió"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 26800,
                              "endTime": 26800,
                              "data": "Mỗi"
                          },
                          {
                              "startTime": 26800,
                              "endTime": 27210,
                              "data": "khi"
                          },
                          {
                              "startTime": 27210,
                              "endTime": 27620,
                              "data": "đêm"
                          },
                          {
                              "startTime": 27620,
                              "endTime": 28010,
                              "data": "về"
                          },
                          {
                              "startTime": 28010,
                              "endTime": 28010,
                              "data": "tang"
                          },
                          {
                              "startTime": 28010,
                              "endTime": 28410,
                              "data": "tính"
                          },
                          {
                              "startTime": 28410,
                              "endTime": 28800,
                              "data": "tình"
                          },
                          {
                              "startTime": 28800,
                              "endTime": 29600,
                              "data": "tang"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 29600,
                              "endTime": 29990,
                              "data": "Gốc"
                          },
                          {
                              "startTime": 29990,
                              "endTime": 30390,
                              "data": "đa"
                          },
                          {
                              "startTime": 30390,
                              "endTime": 30390,
                              "data": "nghiêng"
                          },
                          {
                              "startTime": 30390,
                              "endTime": 30810,
                              "data": "bóng"
                          },
                          {
                              "startTime": 30810,
                              "endTime": 31200,
                              "data": "đầu"
                          },
                          {
                              "startTime": 31200,
                              "endTime": 31600,
                              "data": "làng"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 31600,
                              "endTime": 32000,
                              "data": "Nối"
                          },
                          {
                              "startTime": 32000,
                              "endTime": 32000,
                              "data": "dây"
                          },
                          {
                              "startTime": 32000,
                              "endTime": 32380,
                              "data": "tơ"
                          },
                          {
                              "startTime": 32380,
                              "endTime": 32790,
                              "data": "hồng"
                          },
                          {
                              "startTime": 32790,
                              "endTime": 33180,
                              "data": "để"
                          },
                          {
                              "startTime": 33180,
                              "endTime": 33580,
                              "data": "ai"
                          },
                          {
                              "startTime": 33580,
                              "endTime": 33580,
                              "data": "ngóng"
                          },
                          {
                              "startTime": 33580,
                              "endTime": 34770,
                              "data": "trông"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 34770,
                              "endTime": 35170,
                              "data": "Rằng"
                          },
                          {
                              "startTime": 35170,
                              "endTime": 35570,
                              "data": "ai"
                          },
                          {
                              "startTime": 35570,
                              "endTime": 35570,
                              "data": "đi"
                          },
                          {
                              "startTime": 35570,
                              "endTime": 35970,
                              "data": "qua"
                          },
                          {
                              "startTime": 35970,
                              "endTime": 36360,
                              "data": "quán"
                          },
                          {
                              "startTime": 36360,
                              "endTime": 36760,
                              "data": "dốc"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 36760,
                              "endTime": 37180,
                              "data": "Nhớ"
                          },
                          {
                              "startTime": 37180,
                              "endTime": 37180,
                              "data": "chân"
                          },
                          {
                              "startTime": 37180,
                              "endTime": 37560,
                              "data": "quay"
                          },
                          {
                              "startTime": 37560,
                              "endTime": 37970,
                              "data": "về"
                          },
                          {
                              "startTime": 37970,
                              "endTime": 38370,
                              "data": "têm"
                          },
                          {
                              "startTime": 38370,
                              "endTime": 38370,
                              "data": "miếng"
                          },
                          {
                              "startTime": 38370,
                              "endTime": 38770,
                              "data": "trầu"
                          },
                          {
                              "startTime": 38770,
                              "endTime": 39570,
                              "data": "cay"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 39570,
                              "endTime": 39950,
                              "data": "Gốc"
                          },
                          {
                              "startTime": 39950,
                              "endTime": 40350,
                              "data": "đa"
                          },
                          {
                              "startTime": 40350,
                              "endTime": 40760,
                              "data": "soi"
                          },
                          {
                              "startTime": 40760,
                              "endTime": 41160,
                              "data": "bóng"
                          },
                          {
                              "startTime": 41160,
                              "endTime": 41550,
                              "data": "từng"
                          },
                          {
                              "startTime": 41550,
                              "endTime": 41550,
                              "data": "ngày"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 41550,
                              "endTime": 41950,
                              "data": "Đợi"
                          },
                          {
                              "startTime": 41950,
                              "endTime": 42350,
                              "data": "ai"
                          },
                          {
                              "startTime": 42350,
                              "endTime": 42740,
                              "data": "ai"
                          },
                          {
                              "startTime": 42740,
                              "endTime": 43140,
                              "data": "chờ"
                          },
                          {
                              "startTime": 43140,
                              "endTime": 43540,
                              "data": "đợi"
                          },
                          {
                              "startTime": 43540,
                              "endTime": 45130,
                              "data": "ai"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 45130,
                              "endTime": 45130,
                              "data": "Cây"
                          },
                          {
                              "startTime": 45130,
                              "endTime": 45530,
                              "data": "đa"
                          },
                          {
                              "startTime": 45530,
                              "endTime": 46340,
                              "data": "chờ"
                          },
                          {
                              "startTime": 46340,
                              "endTime": 46340,
                              "data": "mắt"
                          },
                          {
                              "startTime": 46340,
                              "endTime": 46740,
                              "data": "em"
                          },
                          {
                              "startTime": 46740,
                              "endTime": 47530,
                              "data": "buồn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 47530,
                              "endTime": 47530,
                              "data": "Tang"
                          },
                          {
                              "startTime": 47530,
                              "endTime": 47930,
                              "data": "tình"
                          },
                          {
                              "startTime": 47930,
                              "endTime": 48320,
                              "data": "tang"
                          },
                          {
                              "startTime": 48320,
                              "endTime": 48720,
                              "data": "tính"
                          },
                          {
                              "startTime": 48720,
                              "endTime": 48720,
                              "data": "tình"
                          },
                          {
                              "startTime": 48720,
                              "endTime": 49520,
                              "data": "tang"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 49520,
                              "endTime": 49920,
                              "data": "Cây"
                          },
                          {
                              "startTime": 49920,
                              "endTime": 50310,
                              "data": "đa"
                          },
                          {
                              "startTime": 50310,
                              "endTime": 50720,
                              "data": "chờ"
                          },
                          {
                              "startTime": 50720,
                              "endTime": 51110,
                              "data": "mắt"
                          },
                          {
                              "startTime": 51110,
                              "endTime": 51520,
                              "data": "em"
                          },
                          {
                              "startTime": 51520,
                              "endTime": 52310,
                              "data": "buồn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 52310,
                              "endTime": 52710,
                              "data": "Tang"
                          },
                          {
                              "startTime": 52710,
                              "endTime": 53110,
                              "data": "tình"
                          },
                          {
                              "startTime": 53110,
                              "endTime": 53110,
                              "data": "tang"
                          },
                          {
                              "startTime": 53110,
                              "endTime": 53500,
                              "data": "tính"
                          },
                          {
                              "startTime": 53500,
                              "endTime": 53900,
                              "data": "tình"
                          },
                          {
                              "startTime": 53900,
                              "endTime": 56900,
                              "data": "tang"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 77860,
                              "endTime": 77860,
                              "data": "Cùng"
                          },
                          {
                              "startTime": 77860,
                              "endTime": 78250,
                              "data": "nhau"
                          },
                          {
                              "startTime": 78250,
                              "endTime": 78650,
                              "data": "trèo"
                          },
                          {
                              "startTime": 78650,
                              "endTime": 79050,
                              "data": "lên"
                          },
                          {
                              "startTime": 79050,
                              "endTime": 79050,
                              "data": "quán"
                          },
                          {
                              "startTime": 79050,
                              "endTime": 79850,
                              "data": "dốc"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 79850,
                              "endTime": 79850,
                              "data": "Lốc"
                          },
                          {
                              "startTime": 79850,
                              "endTime": 80250,
                              "data": "ca"
                          },
                          {
                              "startTime": 80250,
                              "endTime": 80650,
                              "data": "lốc"
                          },
                          {
                              "startTime": 80650,
                              "endTime": 80650,
                              "data": "cốc"
                          },
                          {
                              "startTime": 80650,
                              "endTime": 81040,
                              "data": "tìm"
                          },
                          {
                              "startTime": 81040,
                              "endTime": 81440,
                              "data": "gốc"
                          },
                          {
                              "startTime": 81440,
                              "endTime": 81840,
                              "data": "cây"
                          },
                          {
                              "startTime": 81840,
                              "endTime": 82940,
                              "data": "đa"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 82940,
                              "endTime": 83330,
                              "data": "Dừng"
                          },
                          {
                              "startTime": 83330,
                              "endTime": 83730,
                              "data": "chân"
                          },
                          {
                              "startTime": 83730,
                              "endTime": 83730,
                              "data": "têm"
                          },
                          {
                              "startTime": 83730,
                              "endTime": 84130,
                              "data": "ba"
                          },
                          {
                              "startTime": 84130,
                              "endTime": 84130,
                              "data": "miếng"
                          },
                          {
                              "startTime": 84130,
                              "endTime": 84930,
                              "data": "trầu"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 84930,
                              "endTime": 84930,
                              "data": "Gối"
                          },
                          {
                              "startTime": 84930,
                              "endTime": 85320,
                              "data": "đầu"
                          },
                          {
                              "startTime": 85320,
                              "endTime": 85740,
                              "data": "tay"
                          },
                          {
                              "startTime": 85740,
                              "endTime": 86130,
                              "data": "không"
                          },
                          {
                              "startTime": 86130,
                              "endTime": 86130,
                              "data": "để"
                          },
                          {
                              "startTime": 86130,
                              "endTime": 86530,
                              "data": "ngắm"
                          },
                          {
                              "startTime": 86530,
                              "endTime": 86920,
                              "data": "sao"
                          },
                          {
                              "startTime": 86920,
                              "endTime": 87720,
                              "data": "trời"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 87720,
                              "endTime": 88120,
                              "data": "Nhà"
                          },
                          {
                              "startTime": 88120,
                              "endTime": 88510,
                              "data": "ai"
                          },
                          {
                              "startTime": 88510,
                              "endTime": 88910,
                              "data": "có"
                          },
                          {
                              "startTime": 88910,
                              "endTime": 88910,
                              "data": "con"
                          },
                          {
                              "startTime": 88910,
                              "endTime": 89310,
                              "data": "chim"
                          },
                          {
                              "startTime": 89310,
                              "endTime": 89720,
                              "data": "khách"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 89720,
                              "endTime": 90100,
                              "data": "Lách"
                          },
                          {
                              "startTime": 90100,
                              "endTime": 90520,
                              "data": "ca"
                          },
                          {
                              "startTime": 90520,
                              "endTime": 90520,
                              "data": "lách"
                          },
                          {
                              "startTime": 90520,
                              "endTime": 90920,
                              "data": "cách"
                          },
                          {
                              "startTime": 90920,
                              "endTime": 91340,
                              "data": "tìm"
                          },
                          {
                              "startTime": 91340,
                              "endTime": 91740,
                              "data": "đến"
                          },
                          {
                              "startTime": 91740,
                              "endTime": 91740,
                              "data": "chim"
                          },
                          {
                              "startTime": 91740,
                              "endTime": 92920,
                              "data": "kêu"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 92920,
                              "endTime": 93320,
                              "data": "Rằng"
                          },
                          {
                              "startTime": 93320,
                              "endTime": 93720,
                              "data": "a"
                          },
                          {
                              "startTime": 93720,
                              "endTime": 93720,
                              "data": "có"
                          },
                          {
                              "startTime": 93720,
                              "endTime": 94110,
                              "data": "ba"
                          },
                          {
                              "startTime": 94110,
                              "endTime": 94510,
                              "data": "cô"
                          },
                          {
                              "startTime": 94510,
                              "endTime": 94910,
                              "data": "nàng"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 94910,
                              "endTime": 95320,
                              "data": "Má"
                          },
                          {
                              "startTime": 95320,
                              "endTime": 95720,
                              "data": "đỏ"
                          },
                          {
                              "startTime": 95720,
                              "endTime": 95720,
                              "data": "môi"
                          },
                          {
                              "startTime": 95720,
                              "endTime": 96120,
                              "data": "hồng"
                          },
                          {
                              "startTime": 96120,
                              "endTime": 96510,
                              "data": "chúm"
                          },
                          {
                              "startTime": 96510,
                              "endTime": 96910,
                              "data": "chím"
                          },
                          {
                              "startTime": 96910,
                              "endTime": 96910,
                              "data": "đồng"
                          },
                          {
                              "startTime": 96910,
                              "endTime": 98100,
                              "data": "tiền"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 98100,
                              "endTime": 98100,
                              "data": "Hỏi"
                          },
                          {
                              "startTime": 98100,
                              "endTime": 98500,
                              "data": "cây"
                          },
                          {
                              "startTime": 98500,
                              "endTime": 98890,
                              "data": "đa"
                          },
                          {
                              "startTime": 98890,
                              "endTime": 99290,
                              "data": "sao"
                          },
                          {
                              "startTime": 99290,
                              "endTime": 99690,
                              "data": "vắng"
                          },
                          {
                              "startTime": 99690,
                              "endTime": 100100,
                              "data": "gió"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 100100,
                              "endTime": 100100,
                              "data": "Mỗi"
                          },
                          {
                              "startTime": 100100,
                              "endTime": 100490,
                              "data": "khi"
                          },
                          {
                              "startTime": 100490,
                              "endTime": 100900,
                              "data": "đêm"
                          },
                          {
                              "startTime": 100900,
                              "endTime": 101290,
                              "data": "về"
                          },
                          {
                              "startTime": 101290,
                              "endTime": 101290,
                              "data": "tang"
                          },
                          {
                              "startTime": 101290,
                              "endTime": 101680,
                              "data": "tính"
                          },
                          {
                              "startTime": 101680,
                              "endTime": 102090,
                              "data": "tình"
                          },
                          {
                              "startTime": 102090,
                              "endTime": 102880,
                              "data": "tang"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 102880,
                              "endTime": 103280,
                              "data": "Gốc"
                          },
                          {
                              "startTime": 103280,
                              "endTime": 103670,
                              "data": "đa"
                          },
                          {
                              "startTime": 103670,
                              "endTime": 104070,
                              "data": "nghiêng"
                          },
                          {
                              "startTime": 104070,
                              "endTime": 104070,
                              "data": "bóng"
                          },
                          {
                              "startTime": 104070,
                              "endTime": 104470,
                              "data": "đầu"
                          },
                          {
                              "startTime": 104470,
                              "endTime": 104870,
                              "data": "làng"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 104870,
                              "endTime": 105290,
                              "data": "Nối"
                          },
                          {
                              "startTime": 105290,
                              "endTime": 105670,
                              "data": "dây"
                          },
                          {
                              "startTime": 105670,
                              "endTime": 105670,
                              "data": "tơ"
                          },
                          {
                              "startTime": 105670,
                              "endTime": 106070,
                              "data": "hồng"
                          },
                          {
                              "startTime": 106070,
                              "endTime": 106460,
                              "data": "để"
                          },
                          {
                              "startTime": 106460,
                              "endTime": 106880,
                              "data": "ai"
                          },
                          {
                              "startTime": 106880,
                              "endTime": 106880,
                              "data": "ngóng"
                          },
                          {
                              "startTime": 106880,
                              "endTime": 107680,
                              "data": "trông"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 107680,
                              "endTime": 108070,
                              "data": "Rằng"
                          },
                          {
                              "startTime": 108070,
                              "endTime": 108450,
                              "data": "ai"
                          },
                          {
                              "startTime": 108450,
                              "endTime": 108850,
                              "data": "đi"
                          },
                          {
                              "startTime": 108850,
                              "endTime": 109270,
                              "data": "qua"
                          },
                          {
                              "startTime": 109270,
                              "endTime": 109660,
                              "data": "quán"
                          },
                          {
                              "startTime": 109660,
                              "endTime": 110060,
                              "data": "dốc"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 110060,
                              "endTime": 110460,
                              "data": "Nhớ"
                          },
                          {
                              "startTime": 110460,
                              "endTime": 110460,
                              "data": "chân"
                          },
                          {
                              "startTime": 110460,
                              "endTime": 110860,
                              "data": "quay"
                          },
                          {
                              "startTime": 110860,
                              "endTime": 111250,
                              "data": "về"
                          },
                          {
                              "startTime": 111250,
                              "endTime": 111650,
                              "data": "têm"
                          },
                          {
                              "startTime": 111650,
                              "endTime": 111650,
                              "data": "miếng"
                          },
                          {
                              "startTime": 111650,
                              "endTime": 112040,
                              "data": "trầu"
                          },
                          {
                              "startTime": 112040,
                              "endTime": 113130,
                              "data": "cay"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 113130,
                              "endTime": 113530,
                              "data": "Gốc"
                          },
                          {
                              "startTime": 113530,
                              "endTime": 113920,
                              "data": "đa"
                          },
                          {
                              "startTime": 113920,
                              "endTime": 113920,
                              "data": "soi"
                          },
                          {
                              "startTime": 113920,
                              "endTime": 114320,
                              "data": "bóng"
                          },
                          {
                              "startTime": 114320,
                              "endTime": 114740,
                              "data": "từng"
                          },
                          {
                              "startTime": 114740,
                              "endTime": 115110,
                              "data": "ngày"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 115110,
                              "endTime": 115530,
                              "data": "Đợi"
                          },
                          {
                              "startTime": 115530,
                              "endTime": 115930,
                              "data": "ai"
                          },
                          {
                              "startTime": 115930,
                              "endTime": 116330,
                              "data": "ai"
                          },
                          {
                              "startTime": 116330,
                              "endTime": 116730,
                              "data": "chờ"
                          },
                          {
                              "startTime": 116730,
                              "endTime": 117120,
                              "data": "đợi"
                          },
                          {
                              "startTime": 117120,
                              "endTime": 117920,
                              "data": "ai"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 117920,
                              "endTime": 118320,
                              "data": "Cây"
                          },
                          {
                              "startTime": 118320,
                              "endTime": 118710,
                              "data": "đa"
                          },
                          {
                              "startTime": 118710,
                              "endTime": 119110,
                              "data": "chờ"
                          },
                          {
                              "startTime": 119110,
                              "endTime": 119500,
                              "data": "mắt"
                          },
                          {
                              "startTime": 119500,
                              "endTime": 119900,
                              "data": "em"
                          },
                          {
                              "startTime": 119900,
                              "endTime": 120700,
                              "data": "buồn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 120700,
                              "endTime": 121100,
                              "data": "Tang"
                          },
                          {
                              "startTime": 121100,
                              "endTime": 121100,
                              "data": "tình"
                          },
                          {
                              "startTime": 121100,
                              "endTime": 121490,
                              "data": "tang"
                          },
                          {
                              "startTime": 121490,
                              "endTime": 121890,
                              "data": "tính"
                          },
                          {
                              "startTime": 121890,
                              "endTime": 122290,
                              "data": "tình"
                          },
                          {
                              "startTime": 122290,
                              "endTime": 122690,
                              "data": "tang"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 122690,
                              "endTime": 123080,
                              "data": "Cây"
                          },
                          {
                              "startTime": 123080,
                              "endTime": 123480,
                              "data": "đa"
                          },
                          {
                              "startTime": 123480,
                              "endTime": 124280,
                              "data": "chờ"
                          },
                          {
                              "startTime": 124280,
                              "endTime": 124690,
                              "data": "mắt"
                          },
                          {
                              "startTime": 124690,
                              "endTime": 124690,
                              "data": "em"
                          },
                          {
                              "startTime": 124690,
                              "endTime": 125490,
                              "data": "buồn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 125490,
                              "endTime": 125490,
                              "data": "Tang"
                          },
                          {
                              "startTime": 125490,
                              "endTime": 125900,
                              "data": "tình"
                          },
                          {
                              "startTime": 125900,
                              "endTime": 126300,
                              "data": "tang"
                          },
                          {
                              "startTime": 126300,
                              "endTime": 126690,
                              "data": "tính"
                          },
                          {
                              "startTime": 126690,
                              "endTime": 127090,
                              "data": "tình"
                          },
                          {
                              "startTime": 127090,
                              "endTime": 130090,
                              "data": "tang"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 131120,
                              "endTime": 131520,
                              "data": "Hỏi"
                          },
                          {
                              "startTime": 131520,
                              "endTime": 131520,
                              "data": "cây"
                          },
                          {
                              "startTime": 131520,
                              "endTime": 131910,
                              "data": "đa"
                          },
                          {
                              "startTime": 131910,
                              "endTime": 132310,
                              "data": "sao"
                          },
                          {
                              "startTime": 132310,
                              "endTime": 132310,
                              "data": "vắng"
                          },
                          {
                              "startTime": 132310,
                              "endTime": 132710,
                              "data": "gió"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 132710,
                              "endTime": 133110,
                              "data": "Mỗi"
                          },
                          {
                              "startTime": 133110,
                              "endTime": 133510,
                              "data": "khi"
                          },
                          {
                              "startTime": 133510,
                              "endTime": 133910,
                              "data": "đêm"
                          },
                          {
                              "startTime": 133910,
                              "endTime": 133910,
                              "data": "về"
                          },
                          {
                              "startTime": 133910,
                              "endTime": 134290,
                              "data": "tang"
                          },
                          {
                              "startTime": 134290,
                              "endTime": 134700,
                              "data": "tính"
                          },
                          {
                              "startTime": 134700,
                              "endTime": 134700,
                              "data": "tình"
                          },
                          {
                              "startTime": 134700,
                              "endTime": 135490,
                              "data": "tang"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 135490,
                              "endTime": 135890,
                              "data": "Gốc"
                          },
                          {
                              "startTime": 135890,
                              "endTime": 136310,
                              "data": "đa"
                          },
                          {
                              "startTime": 136310,
                              "endTime": 136710,
                              "data": "nghiêng"
                          },
                          {
                              "startTime": 136710,
                              "endTime": 137100,
                              "data": "bóng"
                          },
                          {
                              "startTime": 137100,
                              "endTime": 137500,
                              "data": "đầu"
                          },
                          {
                              "startTime": 137500,
                              "endTime": 137900,
                              "data": "làng"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 137900,
                              "endTime": 137900,
                              "data": "Nối"
                          },
                          {
                              "startTime": 137900,
                              "endTime": 138300,
                              "data": "dây"
                          },
                          {
                              "startTime": 138300,
                              "endTime": 138710,
                              "data": "tơ"
                          },
                          {
                              "startTime": 138710,
                              "endTime": 139110,
                              "data": "hồng"
                          },
                          {
                              "startTime": 139110,
                              "endTime": 139510,
                              "data": "để"
                          },
                          {
                              "startTime": 139510,
                              "endTime": 139510,
                              "data": "ai"
                          },
                          {
                              "startTime": 139510,
                              "endTime": 139900,
                              "data": "ngóng"
                          },
                          {
                              "startTime": 139900,
                              "endTime": 140680,
                              "data": "trông"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 140680,
                              "endTime": 141100,
                              "data": "Rằng"
                          },
                          {
                              "startTime": 141100,
                              "endTime": 141500,
                              "data": "ai"
                          },
                          {
                              "startTime": 141500,
                              "endTime": 141900,
                              "data": "đi"
                          },
                          {
                              "startTime": 141900,
                              "endTime": 141900,
                              "data": "qua"
                          },
                          {
                              "startTime": 141900,
                              "endTime": 142290,
                              "data": "quán"
                          },
                          {
                              "startTime": 142290,
                              "endTime": 142690,
                              "data": "dốc"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 142690,
                              "endTime": 143090,
                              "data": "Nhớ"
                          },
                          {
                              "startTime": 143090,
                              "endTime": 143490,
                              "data": "chân"
                          },
                          {
                              "startTime": 143490,
                              "endTime": 143490,
                              "data": "quay"
                          },
                          {
                              "startTime": 143490,
                              "endTime": 143880,
                              "data": "về"
                          },
                          {
                              "startTime": 143880,
                              "endTime": 144270,
                              "data": "têm"
                          },
                          {
                              "startTime": 144270,
                              "endTime": 144690,
                              "data": "miếng"
                          },
                          {
                              "startTime": 144690,
                              "endTime": 145080,
                              "data": "trầu"
                          },
                          {
                              "startTime": 145080,
                              "endTime": 145870,
                              "data": "cay"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 145870,
                              "endTime": 146270,
                              "data": "Gốc"
                          },
                          {
                              "startTime": 146270,
                              "endTime": 146670,
                              "data": "đa"
                          },
                          {
                              "startTime": 146670,
                              "endTime": 147070,
                              "data": "soi"
                          },
                          {
                              "startTime": 147070,
                              "endTime": 147070,
                              "data": "bóng"
                          },
                          {
                              "startTime": 147070,
                              "endTime": 147460,
                              "data": "từng"
                          },
                          {
                              "startTime": 147460,
                              "endTime": 147880,
                              "data": "ngày"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 147880,
                              "endTime": 148250,
                              "data": "Đợi"
                          },
                          {
                              "startTime": 148250,
                              "endTime": 148250,
                              "data": "ai"
                          },
                          {
                              "startTime": 148250,
                              "endTime": 149070,
                              "data": "ai"
                          },
                          {
                              "startTime": 149070,
                              "endTime": 149460,
                              "data": "chờ"
                          },
                          {
                              "startTime": 149460,
                              "endTime": 149460,
                              "data": "đợi"
                          },
                          {
                              "startTime": 149460,
                              "endTime": 151050,
                              "data": "ai"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 151050,
                              "endTime": 151050,
                              "data": "Cây"
                          },
                          {
                              "startTime": 151050,
                              "endTime": 151450,
                              "data": "đa"
                          },
                          {
                              "startTime": 151450,
                              "endTime": 152240,
                              "data": "chờ"
                          },
                          {
                              "startTime": 152240,
                              "endTime": 152640,
                              "data": "mắt"
                          },
                          {
                              "startTime": 152640,
                              "endTime": 152640,
                              "data": "em"
                          },
                          {
                              "startTime": 152640,
                              "endTime": 153470,
                              "data": "buồn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 153470,
                              "endTime": 153870,
                              "data": "Tang"
                          },
                          {
                              "startTime": 153870,
                              "endTime": 153870,
                              "data": "tình"
                          },
                          {
                              "startTime": 153870,
                              "endTime": 154280,
                              "data": "tang"
                          },
                          {
                              "startTime": 154280,
                              "endTime": 154680,
                              "data": "tính"
                          },
                          {
                              "startTime": 154680,
                              "endTime": 155080,
                              "data": "tình"
                          },
                          {
                              "startTime": 155080,
                              "endTime": 155870,
                              "data": "tang"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 155870,
                              "endTime": 156270,
                              "data": "Cây"
                          },
                          {
                              "startTime": 156270,
                              "endTime": 156670,
                              "data": "đa"
                          },
                          {
                              "startTime": 156670,
                              "endTime": 157070,
                              "data": "chờ"
                          },
                          {
                              "startTime": 157070,
                              "endTime": 157460,
                              "data": "mắt"
                          },
                          {
                              "startTime": 157460,
                              "endTime": 157880,
                              "data": "em"
                          },
                          {
                              "startTime": 157880,
                              "endTime": 158670,
                              "data": "buồn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 158670,
                              "endTime": 158670,
                              "data": "Tang"
                          },
                          {
                              "startTime": 158670,
                              "endTime": 159060,
                              "data": "tình"
                          },
                          {
                              "startTime": 159060,
                              "endTime": 159470,
                              "data": "tang"
                          },
                          {
                              "startTime": 159470,
                              "endTime": 159870,
                              "data": "tính"
                          },
                          {
                              "startTime": 159870,
                              "endTime": 159870,
                              "data": "tình"
                          },
                          {
                              "startTime": 159870,
                              "endTime": 160670,
                              "data": "tang"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 160670,
                              "endTime": 161060,
                              "data": "Cây"
                          },
                          {
                              "startTime": 161060,
                              "endTime": 161450,
                              "data": "đa"
                          },
                          {
                              "startTime": 161450,
                              "endTime": 161870,
                              "data": "chờ"
                          },
                          {
                              "startTime": 161870,
                              "endTime": 162260,
                              "data": "mắt"
                          },
                          {
                              "startTime": 162260,
                              "endTime": 162660,
                              "data": "em"
                          },
                          {
                              "startTime": 162660,
                              "endTime": 163450,
                              "data": "buồn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 163450,
                              "endTime": 163860,
                              "data": "Tang"
                          },
                          {
                              "startTime": 163860,
                              "endTime": 163860,
                              "data": "tình"
                          },
                          {
                              "startTime": 163860,
                              "endTime": 164250,
                              "data": "tang"
                          },
                          {
                              "startTime": 164250,
                              "endTime": 164650,
                              "data": "tính"
                          },
                          {
                              "startTime": 164650,
                              "endTime": 165050,
                              "data": "tình"
                          },
                          {
                              "startTime": 165050,
                              "endTime": 165850,
                              "data": "tang"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 165850,
                              "endTime": 166250,
                              "data": "Cây"
                          },
                          {
                              "startTime": 166250,
                              "endTime": 166640,
                              "data": "đa"
                          },
                          {
                              "startTime": 166640,
                              "endTime": 167040,
                              "data": "chờ"
                          },
                          {
                              "startTime": 167040,
                              "endTime": 167430,
                              "data": "mắt"
                          },
                          {
                              "startTime": 167430,
                              "endTime": 167830,
                              "data": "em"
                          },
                          {
                              "startTime": 167830,
                              "endTime": 168220,
                              "data": "buồn"
                          }
                      ]
                  },
                  {
                      "words": [
                          {
                              "startTime": 168220,
                              "endTime": 168640,
                              "data": "Tang"
                          },
                          {
                              "startTime": 168640,
                              "endTime": 169040,
                              "data": "tình"
                          },
                          {
                              "startTime": 169040,
                              "endTime": 169430,
                              "data": "tang"
                          },
                          {
                              "startTime": 169430,
                              "endTime": 169830,
                              "data": "tính"
                          },
                          {
                              "startTime": 169830,
                              "endTime": 169830,
                              "data": "tình"
                          },
                          {
                              "startTime": 169830,
                              "endTime": 170830,
                              "data": "tang"
                          }
                      ]
                  }
              ],
              "file": "https://static-zmp3.zmdcdn.me/lyrics/5/2/3/f/523f227322edb2d9919c6066bc0ae88d.lrc",
              "enabledVideoBG": true,
              "defaultIBGUrls": [
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/c/0/5/3c05c10ae36f6361f9af0874bb7c4851.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/b/b/e/0/bbe01e4bf6d8e23101fcb6db44df311d.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/a/1/f/3/a1f34293d1dc92735be8c3f9082c4acf.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/6/e/9/5/6e95b598e1e14a187ee779bcd888e75c.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/1/c/8/1/1c81e957a6270eba91571d822a47e7c5.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/0/0/0/d/000d9d0679bbbb564a191a6801d7f19d.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/6/4/f/e64f4fd6f53caebabc1c26d592093cfa.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/d/e/3/1/de315c40b537d40b7409a6702f446631.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/1/4/6/2/1462efc7378bed3f98ace411e11eab45.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/5/b/f/a/5bfa05533ed7975035e69a4508c82fd6.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/f/2/b/1/f2b1b91fa64e0c354150c86fd96c249c.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/5/1/f/b/51fbcd4ae32096ffe2dd89cd36bb6ed9.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/6/2/3/9/62392463eab1eb1aaa2d1f3bd0f758bb.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/1/2/f/0/12f01e12d6e13e263ef76f3fdb65d66e.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/8/8/2/4/8824ef8e3e3aa3e302f03879a1f9d7d3.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/4/3/4/9/43491e9d95a9942015548bd2a061250d.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/9/8/7/5/987517940ce71a96bab9c0c88d5b6b95.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/8/e/2/4/8e24305fde744814083af980a593e8c2.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/f/1/2/7/f1270dd1bed79b527228e3351d2b67ae.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/0/a/3/0/0a301934881ee4e2de30dc8f41bc55f9.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/c/c/9/f/cc9fce8719364ba9d8a846984c590a0e.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/5/d/e/e5de86acd7567465f54a6b9307076947.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/6/4/b/b/64bb19c5f971b4e4f16f3bfdff64a396.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/0/3/2/0/03206606d461843e22451747a9b60769.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/b/d/4/4/bd4485d6dfef80764869a4d88d9b0475.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/8/6/8/e86817d147315d9d644835f60d17ae41.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/b/b/4/7/bb477f2f56f162b13426f70c9858c732.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/c/5/3/6/c536ff6ab992e36be24ca0adf8e86ae0.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/6/c/f/c/6cfc1e6e3b94c62cded257659602f00b.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/2/5/d/6/25d6adaa11b4e932d61309ed635d57fa.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/d/2/a/e/d2ae42243ccd4fec321fc60692a5a2dc.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/b/8/0/e/b80e5777c7eec332c882bf79bd692056.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/7/b/a/e7ba1207018f1d2fa7048598c7d627df.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/f/4/0/3f40bd0d6d8cbcf833c72ab050f19e6a.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/a/d/a/d/adad060e15f8409ec2e7670cf943c202.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/d/1/7/ed17742d63b635725e6071a9bee362c5.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/a/e/8/3ae816de233a9eae0116b4b5a21af43e.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/d/7/f/1/d7f15e3996e7923ffc2a64d1f8e43448.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/0/0/7/e/007e6b48696aab4a61ca46a10d980f63.jpg",
                  "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/d/9/f/5/d9f592437d80e358a76e32798ce2d294.jpg"
              ],
              "BGMode": 0
          },
          "timestamp": 1695700420950
      }
      `,
  `{
      "err": 0,
      "msg": "Success",
      "data": {
          "sentences": [
              {
                  "words": [
                      {
                          "startTime": 12230,
                          "endTime": 12480,
                          "data": "Chờ"
                      },
                      {
                          "startTime": 12480,
                          "endTime": 12480,
                          "data": "đợi"
                      },
                      {
                          "startTime": 12480,
                          "endTime": 12740,
                          "data": "em"
                      },
                      {
                          "startTime": 12740,
                          "endTime": 12980,
                          "data": "bấy"
                      },
                      {
                          "startTime": 12980,
                          "endTime": 13490,
                          "data": "lâu"
                      },
                      {
                          "startTime": 13490,
                          "endTime": 13990,
                          "data": "nay"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 13990,
                          "endTime": 14240,
                          "data": "Để"
                      },
                      {
                          "startTime": 14240,
                          "endTime": 14500,
                          "data": "kêu"
                      },
                      {
                          "startTime": 14500,
                          "endTime": 14740,
                          "data": "anh"
                      },
                      {
                          "startTime": 14740,
                          "endTime": 15240,
                          "data": "bằng"
                      },
                      {
                          "startTime": 15240,
                          "endTime": 15490,
                          "data": "chồng"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 15490,
                          "endTime": 15750,
                          "data": "Trọn"
                      },
                      {
                          "startTime": 15750,
                          "endTime": 15990,
                          "data": "đời"
                      },
                      {
                          "startTime": 15990,
                          "endTime": 16250,
                          "data": "anh"
                      },
                      {
                          "startTime": 16250,
                          "endTime": 16750,
                          "data": "hứa"
                      },
                      {
                          "startTime": 16750,
                          "endTime": 17000,
                          "data": "sẽ"
                      },
                      {
                          "startTime": 17000,
                          "endTime": 17500,
                          "data": "không"
                      },
                      {
                          "startTime": 17500,
                          "endTime": 17750,
                          "data": "hai"
                      },
                      {
                          "startTime": 17750,
                          "endTime": 19010,
                          "data": "lòng"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 19010,
                          "endTime": 19510,
                          "data": "Kết"
                      },
                      {
                          "startTime": 19510,
                          "endTime": 19770,
                          "data": "thông"
                      },
                      {
                          "startTime": 19770,
                          "endTime": 20010,
                          "data": "gia"
                      },
                      {
                          "startTime": 20010,
                          "endTime": 20270,
                          "data": "hai"
                      },
                      {
                          "startTime": 20270,
                          "endTime": 20520,
                          "data": "nhà"
                      },
                      {
                          "startTime": 20520,
                          "endTime": 21020,
                          "data": "ta"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 21020,
                          "endTime": 21270,
                          "data": "Tùng"
                      },
                      {
                          "startTime": 21270,
                          "endTime": 21520,
                          "data": "dinh"
                      },
                      {
                          "startTime": 21520,
                          "endTime": 21770,
                          "data": "tùng"
                      },
                      {
                          "startTime": 21770,
                          "endTime": 22030,
                          "data": "dinh"
                      },
                      {
                          "startTime": 22030,
                          "endTime": 22030,
                          "data": "qua"
                      },
                      {
                          "startTime": 22030,
                          "endTime": 22530,
                          "data": "rước"
                      },
                      {
                          "startTime": 22530,
                          "endTime": 22780,
                          "data": "dâu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 22780,
                          "endTime": 23020,
                          "data": "Bằng"
                      },
                      {
                          "startTime": 23020,
                          "endTime": 23280,
                          "data": "lòng"
                      },
                      {
                          "startTime": 23280,
                          "endTime": 23530,
                          "data": "anh"
                      },
                      {
                          "startTime": 23530,
                          "endTime": 23780,
                          "data": "sang"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 23780,
                          "endTime": 24030,
                          "data": "Anh"
                      },
                      {
                          "startTime": 24030,
                          "endTime": 24030,
                          "data": "mang"
                      },
                      {
                          "startTime": 24030,
                          "endTime": 24290,
                          "data": "bưng"
                      },
                      {
                          "startTime": 24290,
                          "endTime": 24540,
                          "data": "theo"
                      },
                      {
                          "startTime": 24540,
                          "endTime": 24780,
                          "data": "cau"
                      },
                      {
                          "startTime": 24780,
                          "endTime": 26310,
                          "data": "trầu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 26310,
                          "endTime": 26550,
                          "data": "Mãi"
                      },
                      {
                          "startTime": 26550,
                          "endTime": 27050,
                          "data": "mãi"
                      },
                      {
                          "startTime": 27050,
                          "endTime": 27310,
                          "data": "không"
                      },
                      {
                          "startTime": 27310,
                          "endTime": 27560,
                          "data": "đổi"
                      },
                      {
                          "startTime": 27560,
                          "endTime": 28080,
                          "data": "thay"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 28080,
                          "endTime": 28330,
                          "data": "Tình"
                      },
                      {
                          "startTime": 28330,
                          "endTime": 28580,
                          "data": "này"
                      },
                      {
                          "startTime": 28580,
                          "endTime": 28830,
                          "data": "nguyện"
                      },
                      {
                          "startTime": 28830,
                          "endTime": 29090,
                          "data": "trao"
                      },
                      {
                          "startTime": 29090,
                          "endTime": 29330,
                          "data": "em"
                      },
                      {
                          "startTime": 29330,
                          "endTime": 29580,
                          "data": "đắm"
                      },
                      {
                          "startTime": 29580,
                          "endTime": 29830,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 29830,
                          "endTime": 30340,
                          "data": "Cưới"
                      },
                      {
                          "startTime": 30340,
                          "endTime": 30590,
                          "data": "em"
                      },
                      {
                          "startTime": 30590,
                          "endTime": 30850,
                          "data": "về"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 30850,
                          "endTime": 31340,
                          "data": "Sẽ"
                      },
                      {
                          "startTime": 31340,
                          "endTime": 31340,
                          "data": "không"
                      },
                      {
                          "startTime": 31340,
                          "endTime": 31590,
                          "data": "bao"
                      },
                      {
                          "startTime": 31590,
                          "endTime": 31840,
                          "data": "giờ"
                      },
                      {
                          "startTime": 31840,
                          "endTime": 32100,
                          "data": "để"
                      },
                      {
                          "startTime": 32100,
                          "endTime": 32340,
                          "data": "em"
                      },
                      {
                          "startTime": 32340,
                          "endTime": 33590,
                          "data": "khóc"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 33590,
                          "endTime": 33850,
                          "data": "Nếu"
                      },
                      {
                          "startTime": 33850,
                          "endTime": 34100,
                          "data": "như"
                      },
                      {
                          "startTime": 34100,
                          "endTime": 34350,
                          "data": "một"
                      },
                      {
                          "startTime": 34350,
                          "endTime": 34600,
                          "data": "ngày"
                      },
                      {
                          "startTime": 34600,
                          "endTime": 35100,
                          "data": "em"
                      },
                      {
                          "startTime": 35100,
                          "endTime": 35350,
                          "data": "buồn"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 35350,
                          "endTime": 35850,
                          "data": "Anh"
                      },
                      {
                          "startTime": 35850,
                          "endTime": 36110,
                          "data": "sẽ"
                      },
                      {
                          "startTime": 36110,
                          "endTime": 36350,
                          "data": "làm"
                      },
                      {
                          "startTime": 36350,
                          "endTime": 36610,
                          "data": "cả"
                      },
                      {
                          "startTime": 36610,
                          "endTime": 36860,
                          "data": "bầu"
                      },
                      {
                          "startTime": 36860,
                          "endTime": 37100,
                          "data": "trời"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 37100,
                          "endTime": 37360,
                          "data": "Để"
                      },
                      {
                          "startTime": 37360,
                          "endTime": 37610,
                          "data": "cho"
                      },
                      {
                          "startTime": 37610,
                          "endTime": 38110,
                          "data": "em"
                      },
                      {
                          "startTime": 38110,
                          "endTime": 38610,
                          "data": "thấy"
                      },
                      {
                          "startTime": 38610,
                          "endTime": 39120,
                          "data": "không"
                      },
                      {
                          "startTime": 39120,
                          "endTime": 39360,
                          "data": "chơi"
                      },
                      {
                          "startTime": 39360,
                          "endTime": 42360,
                          "data": "vơi"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 43330,
                          "endTime": 43580,
                          "data": "Cuộc"
                      },
                      {
                          "startTime": 43580,
                          "endTime": 44080,
                          "data": "đời"
                      },
                      {
                          "startTime": 44080,
                          "endTime": 44330,
                          "data": "rắc"
                      },
                      {
                          "startTime": 44330,
                          "endTime": 44330,
                          "data": "rối"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 44330,
                          "endTime": 44580,
                          "data": "Lắm"
                      },
                      {
                          "startTime": 44580,
                          "endTime": 44830,
                          "data": "lúc"
                      },
                      {
                          "startTime": 44830,
                          "endTime": 45090,
                          "data": "thăng"
                      },
                      {
                          "startTime": 45090,
                          "endTime": 45330,
                          "data": "trầm"
                      },
                      {
                          "startTime": 45330,
                          "endTime": 45840,
                          "data": "mỗi"
                      },
                      {
                          "startTime": 45840,
                          "endTime": 46340,
                          "data": "tối"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 46340,
                          "endTime": 46840,
                          "data": "Chỉ"
                      },
                      {
                          "startTime": 46840,
                          "endTime": 47090,
                          "data": "ước"
                      },
                      {
                          "startTime": 47090,
                          "endTime": 47330,
                          "data": "mong"
                      },
                      {
                          "startTime": 47330,
                          "endTime": 47590,
                          "data": "sao"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 47590,
                          "endTime": 47830,
                          "data": "Để"
                      },
                      {
                          "startTime": 47830,
                          "endTime": 48090,
                          "data": "mau"
                      },
                      {
                          "startTime": 48090,
                          "endTime": 48340,
                          "data": "được"
                      },
                      {
                          "startTime": 48340,
                          "endTime": 48840,
                          "data": "giàu"
                      },
                      {
                          "startTime": 48840,
                          "endTime": 50370,
                          "data": "lên"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 50370,
                          "endTime": 50610,
                          "data": "Nhờ"
                      },
                      {
                          "startTime": 50610,
                          "endTime": 51110,
                          "data": "người"
                      },
                      {
                          "startTime": 51110,
                          "endTime": 51360,
                          "data": "mai"
                      },
                      {
                          "startTime": 51360,
                          "endTime": 51620,
                          "data": "mối"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 51620,
                          "endTime": 51860,
                          "data": "Để"
                      },
                      {
                          "startTime": 51860,
                          "endTime": 52120,
                          "data": "rước"
                      },
                      {
                          "startTime": 52120,
                          "endTime": 52360,
                          "data": "em"
                      },
                      {
                          "startTime": 52360,
                          "endTime": 52610,
                          "data": "về"
                      },
                      {
                          "startTime": 52610,
                          "endTime": 52870,
                          "data": "mỗi"
                      },
                      {
                          "startTime": 52870,
                          "endTime": 53370,
                          "data": "tối"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 53370,
                          "endTime": 53870,
                          "data": "Nằm"
                      },
                      {
                          "startTime": 53870,
                          "endTime": 54370,
                          "data": "cạnh"
                      },
                      {
                          "startTime": 54370,
                          "endTime": 54620,
                          "data": "bên"
                      },
                      {
                          "startTime": 54620,
                          "endTime": 54870,
                          "data": "em"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 54870,
                          "endTime": 55120,
                          "data": "Để"
                      },
                      {
                          "startTime": 55120,
                          "endTime": 55370,
                          "data": "kêu"
                      },
                      {
                          "startTime": 55370,
                          "endTime": 55630,
                          "data": "em"
                      },
                      {
                          "startTime": 55630,
                          "endTime": 55880,
                          "data": "vợ"
                      },
                      {
                          "startTime": 55880,
                          "endTime": 57630,
                          "data": "ơi"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 57630,
                          "endTime": 57890,
                          "data": "Bởi"
                      },
                      {
                          "startTime": 57890,
                          "endTime": 58140,
                          "data": "quá"
                      },
                      {
                          "startTime": 58140,
                          "endTime": 58640,
                          "data": "thương"
                      },
                      {
                          "startTime": 58640,
                          "endTime": 59140,
                          "data": "em"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 59140,
                          "endTime": 59390,
                          "data": "Nên"
                      },
                      {
                          "startTime": 59390,
                          "endTime": 59650,
                          "data": "anh"
                      },
                      {
                          "startTime": 59650,
                          "endTime": 59890,
                          "data": "ráng"
                      },
                      {
                          "startTime": 59890,
                          "endTime": 60140,
                          "data": "sang"
                      },
                      {
                          "startTime": 60140,
                          "endTime": 60900,
                          "data": "năm"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 60900,
                          "endTime": 61140,
                          "data": "Mần"
                      },
                      {
                          "startTime": 61140,
                          "endTime": 61400,
                          "data": "ăn"
                      },
                      {
                          "startTime": 61400,
                          "endTime": 61650,
                          "data": "lên"
                      },
                      {
                          "startTime": 61650,
                          "endTime": 61890,
                          "data": "anh"
                      },
                      {
                          "startTime": 61890,
                          "endTime": 62150,
                          "data": "hốt"
                      },
                      {
                          "startTime": 62150,
                          "endTime": 62400,
                          "data": "em"
                      },
                      {
                          "startTime": 62400,
                          "endTime": 62650,
                          "data": "về"
                      },
                      {
                          "startTime": 62650,
                          "endTime": 63160,
                          "data": "làm"
                      },
                      {
                          "startTime": 63160,
                          "endTime": 64910,
                          "data": "dâu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 64910,
                          "endTime": 65160,
                          "data": "Chút"
                      },
                      {
                          "startTime": 65160,
                          "endTime": 65680,
                          "data": "yêu"
                      },
                      {
                          "startTime": 65680,
                          "endTime": 66180,
                          "data": "thương"
                      },
                      {
                          "startTime": 66180,
                          "endTime": 66420,
                          "data": "thêm"
                      },
                      {
                          "startTime": 66420,
                          "endTime": 66940,
                          "data": "chút"
                      },
                      {
                          "startTime": 66940,
                          "endTime": 67440,
                          "data": "mê"
                      },
                      {
                          "startTime": 67440,
                          "endTime": 67690,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 67690,
                          "endTime": 67970,
                          "data": "Làm"
                      },
                      {
                          "startTime": 67970,
                          "endTime": 68470,
                          "data": "lòng"
                      },
                      {
                          "startTime": 68470,
                          "endTime": 68730,
                          "data": "em"
                      },
                      {
                          "startTime": 68730,
                          "endTime": 68970,
                          "data": "chắc"
                      },
                      {
                          "startTime": 68970,
                          "endTime": 69230,
                          "data": "chắn"
                      },
                      {
                          "startTime": 69230,
                          "endTime": 69480,
                          "data": "sẽ"
                      },
                      {
                          "startTime": 69480,
                          "endTime": 69730,
                          "data": "là"
                      },
                      {
                          "startTime": 69730,
                          "endTime": 70250,
                          "data": "ngất"
                      },
                      {
                          "startTime": 70250,
                          "endTime": 73250,
                          "data": "ngây"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 73510,
                          "endTime": 73760,
                          "data": "Chờ"
                      },
                      {
                          "startTime": 73760,
                          "endTime": 73760,
                          "data": "đợi"
                      },
                      {
                          "startTime": 73760,
                          "endTime": 74040,
                          "data": "em"
                      },
                      {
                          "startTime": 74040,
                          "endTime": 74530,
                          "data": "bấy"
                      },
                      {
                          "startTime": 74530,
                          "endTime": 74790,
                          "data": "lâu"
                      },
                      {
                          "startTime": 74790,
                          "endTime": 75290,
                          "data": "nay"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 75290,
                          "endTime": 75540,
                          "data": "Để"
                      },
                      {
                          "startTime": 75540,
                          "endTime": 75800,
                          "data": "kêu"
                      },
                      {
                          "startTime": 75800,
                          "endTime": 76040,
                          "data": "anh"
                      },
                      {
                          "startTime": 76040,
                          "endTime": 76550,
                          "data": "bằng"
                      },
                      {
                          "startTime": 76550,
                          "endTime": 76790,
                          "data": "chồng"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 76790,
                          "endTime": 77050,
                          "data": "Trọn"
                      },
                      {
                          "startTime": 77050,
                          "endTime": 77300,
                          "data": "đời"
                      },
                      {
                          "startTime": 77300,
                          "endTime": 77550,
                          "data": "anh"
                      },
                      {
                          "startTime": 77550,
                          "endTime": 78050,
                          "data": "hứa"
                      },
                      {
                          "startTime": 78050,
                          "endTime": 78300,
                          "data": "sẽ"
                      },
                      {
                          "startTime": 78300,
                          "endTime": 78810,
                          "data": "không"
                      },
                      {
                          "startTime": 78810,
                          "endTime": 79050,
                          "data": "hai"
                      },
                      {
                          "startTime": 79050,
                          "endTime": 80310,
                          "data": "lòng"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 80310,
                          "endTime": 80560,
                          "data": "Kết"
                      },
                      {
                          "startTime": 80560,
                          "endTime": 81080,
                          "data": "thông"
                      },
                      {
                          "startTime": 81080,
                          "endTime": 81570,
                          "data": "gia"
                      },
                      {
                          "startTime": 81570,
                          "endTime": 81570,
                          "data": "hai"
                      },
                      {
                          "startTime": 81570,
                          "endTime": 81840,
                          "data": "nhà"
                      },
                      {
                          "startTime": 81840,
                          "endTime": 82360,
                          "data": "ta"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 82360,
                          "endTime": 82600,
                          "data": "Tùng"
                      },
                      {
                          "startTime": 82600,
                          "endTime": 82850,
                          "data": "dinh"
                      },
                      {
                          "startTime": 82850,
                          "endTime": 83110,
                          "data": "tùng"
                      },
                      {
                          "startTime": 83110,
                          "endTime": 83350,
                          "data": "dinh"
                      },
                      {
                          "startTime": 83350,
                          "endTime": 83350,
                          "data": "qua"
                      },
                      {
                          "startTime": 83350,
                          "endTime": 83860,
                          "data": "rước"
                      },
                      {
                          "startTime": 83860,
                          "endTime": 84110,
                          "data": "dâu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 84110,
                          "endTime": 84360,
                          "data": "Bằng"
                      },
                      {
                          "startTime": 84360,
                          "endTime": 84610,
                          "data": "lòng"
                      },
                      {
                          "startTime": 84610,
                          "endTime": 84860,
                          "data": "anh"
                      },
                      {
                          "startTime": 84860,
                          "endTime": 85110,
                          "data": "sang"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 85110,
                          "endTime": 85370,
                          "data": "Anh"
                      },
                      {
                          "startTime": 85370,
                          "endTime": 85610,
                          "data": "mang"
                      },
                      {
                          "startTime": 85610,
                          "endTime": 85870,
                          "data": "bưng"
                      },
                      {
                          "startTime": 85870,
                          "endTime": 86110,
                          "data": "theo"
                      },
                      {
                          "startTime": 86110,
                          "endTime": 86370,
                          "data": "cau"
                      },
                      {
                          "startTime": 86370,
                          "endTime": 87630,
                          "data": "trầu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 87630,
                          "endTime": 87870,
                          "data": "Mãi"
                      },
                      {
                          "startTime": 87870,
                          "endTime": 88130,
                          "data": "mãi"
                      },
                      {
                          "startTime": 88130,
                          "endTime": 88620,
                          "data": "không"
                      },
                      {
                          "startTime": 88620,
                          "endTime": 89130,
                          "data": "đổi"
                      },
                      {
                          "startTime": 89130,
                          "endTime": 89380,
                          "data": "thay"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 89380,
                          "endTime": 89630,
                          "data": "Tình"
                      },
                      {
                          "startTime": 89630,
                          "endTime": 89880,
                          "data": "này"
                      },
                      {
                          "startTime": 89880,
                          "endTime": 90130,
                          "data": "nguyện"
                      },
                      {
                          "startTime": 90130,
                          "endTime": 90380,
                          "data": "trao"
                      },
                      {
                          "startTime": 90380,
                          "endTime": 90630,
                          "data": "em"
                      },
                      {
                          "startTime": 90630,
                          "endTime": 90880,
                          "data": "đắm"
                      },
                      {
                          "startTime": 90880,
                          "endTime": 91390,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 91390,
                          "endTime": 91640,
                          "data": "Cưới"
                      },
                      {
                          "startTime": 91640,
                          "endTime": 91890,
                          "data": "em"
                      },
                      {
                          "startTime": 91890,
                          "endTime": 92410,
                          "data": "về"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 92410,
                          "endTime": 92650,
                          "data": "Sẽ"
                      },
                      {
                          "startTime": 92650,
                          "endTime": 92650,
                          "data": "không"
                      },
                      {
                          "startTime": 92650,
                          "endTime": 92910,
                          "data": "bao"
                      },
                      {
                          "startTime": 92910,
                          "endTime": 93160,
                          "data": "giờ"
                      },
                      {
                          "startTime": 93160,
                          "endTime": 93410,
                          "data": "để"
                      },
                      {
                          "startTime": 93410,
                          "endTime": 93660,
                          "data": "em"
                      },
                      {
                          "startTime": 93660,
                          "endTime": 94910,
                          "data": "khóc"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 94910,
                          "endTime": 95170,
                          "data": "Nếu"
                      },
                      {
                          "startTime": 95170,
                          "endTime": 95420,
                          "data": "như"
                      },
                      {
                          "startTime": 95420,
                          "endTime": 95660,
                          "data": "một"
                      },
                      {
                          "startTime": 95660,
                          "endTime": 95920,
                          "data": "ngày"
                      },
                      {
                          "startTime": 95920,
                          "endTime": 96420,
                          "data": "em"
                      },
                      {
                          "startTime": 96420,
                          "endTime": 96930,
                          "data": "buồn"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 96930,
                          "endTime": 97170,
                          "data": "Anh"
                      },
                      {
                          "startTime": 97170,
                          "endTime": 97420,
                          "data": "sẽ"
                      },
                      {
                          "startTime": 97420,
                          "endTime": 97680,
                          "data": "làm"
                      },
                      {
                          "startTime": 97680,
                          "endTime": 97920,
                          "data": "cả"
                      },
                      {
                          "startTime": 97920,
                          "endTime": 98180,
                          "data": "bầu"
                      },
                      {
                          "startTime": 98180,
                          "endTime": 98680,
                          "data": "trời"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 98680,
                          "endTime": 98930,
                          "data": "Để"
                      },
                      {
                          "startTime": 98930,
                          "endTime": 99180,
                          "data": "cho"
                      },
                      {
                          "startTime": 99180,
                          "endTime": 99430,
                          "data": "em"
                      },
                      {
                          "startTime": 99430,
                          "endTime": 99940,
                          "data": "thấy"
                      },
                      {
                          "startTime": 99940,
                          "endTime": 100440,
                          "data": "không"
                      },
                      {
                          "startTime": 100440,
                          "endTime": 100930,
                          "data": "chơi"
                      },
                      {
                          "startTime": 100930,
                          "endTime": 103930,
                          "data": "vơi"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 120750,
                          "endTime": 121010,
                          "data": "Rước"
                      },
                      {
                          "startTime": 121010,
                          "endTime": 121250,
                          "data": "con"
                      },
                      {
                          "startTime": 121250,
                          "endTime": 121540,
                          "data": "dâu"
                      },
                      {
                          "startTime": 121540,
                          "endTime": 121780,
                          "data": "hiền"
                      },
                      {
                          "startTime": 121780,
                          "endTime": 122040,
                          "data": "ngoan"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 122040,
                          "endTime": 122290,
                          "data": "Để"
                      },
                      {
                          "startTime": 122290,
                          "endTime": 122530,
                          "data": "rồi"
                      },
                      {
                          "startTime": 122530,
                          "endTime": 122790,
                          "data": "pháo"
                      },
                      {
                          "startTime": 122790,
                          "endTime": 123040,
                          "data": "hoa"
                      },
                      {
                          "startTime": 123040,
                          "endTime": 123290,
                          "data": "theo"
                      },
                      {
                          "startTime": 123290,
                          "endTime": 123540,
                          "data": "tràn"
                      },
                      {
                          "startTime": 123540,
                          "endTime": 124040,
                          "data": "lan"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 124040,
                          "endTime": 124290,
                          "data": "Rượu"
                      },
                      {
                          "startTime": 124290,
                          "endTime": 124290,
                          "data": "mừng"
                      },
                      {
                          "startTime": 124290,
                          "endTime": 124810,
                          "data": "uống"
                      },
                      {
                          "startTime": 124810,
                          "endTime": 125070,
                          "data": "cho"
                      },
                      {
                          "startTime": 125070,
                          "endTime": 125310,
                          "data": "sang"
                      },
                      {
                          "startTime": 125310,
                          "endTime": 125570,
                          "data": "thiệt"
                      },
                      {
                          "startTime": 125570,
                          "endTime": 125820,
                          "data": "sang"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 125820,
                          "endTime": 125820,
                          "data": "Họ"
                      },
                      {
                          "startTime": 125820,
                          "endTime": 126070,
                          "data": "hàng"
                      },
                      {
                          "startTime": 126070,
                          "endTime": 126570,
                          "data": "chúc"
                      },
                      {
                          "startTime": 126570,
                          "endTime": 126830,
                          "data": "cho"
                      },
                      {
                          "startTime": 126830,
                          "endTime": 127070,
                          "data": "ta"
                      },
                      {
                          "startTime": 127070,
                          "endTime": 127330,
                          "data": "rùm"
                      },
                      {
                          "startTime": 127330,
                          "endTime": 127580,
                          "data": "rang"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 127580,
                          "endTime": 127820,
                          "data": "Lòng"
                      },
                      {
                          "startTime": 127820,
                          "endTime": 127820,
                          "data": "mừng"
                      },
                      {
                          "startTime": 127820,
                          "endTime": 128090,
                          "data": "vì"
                      },
                      {
                          "startTime": 128090,
                          "endTime": 128340,
                          "data": "có"
                      },
                      {
                          "startTime": 128340,
                          "endTime": 128610,
                          "data": "em"
                      },
                      {
                          "startTime": 128610,
                          "endTime": 128860,
                          "data": "bên"
                      },
                      {
                          "startTime": 128860,
                          "endTime": 129110,
                          "data": "đời"
                      },
                      {
                          "startTime": 129110,
                          "endTime": 129360,
                          "data": "anh"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 129360,
                          "endTime": 129610,
                          "data": "Cùng"
                      },
                      {
                          "startTime": 129610,
                          "endTime": 129860,
                          "data": "nhau"
                      },
                      {
                          "startTime": 129860,
                          "endTime": 130110,
                          "data": "mình"
                      },
                      {
                          "startTime": 130110,
                          "endTime": 130370,
                          "data": "sánh"
                      },
                      {
                          "startTime": 130370,
                          "endTime": 130370,
                          "data": "bạc"
                      },
                      {
                          "startTime": 130370,
                          "endTime": 130610,
                          "data": "mái"
                      },
                      {
                          "startTime": 130610,
                          "endTime": 130860,
                          "data": "đầu"
                      },
                      {
                          "startTime": 130860,
                          "endTime": 131120,
                          "data": "xanh"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 131120,
                          "endTime": 131360,
                          "data": "Hẹn"
                      },
                      {
                          "startTime": 131360,
                          "endTime": 131620,
                          "data": "lòng"
                      },
                      {
                          "startTime": 131620,
                          "endTime": 131870,
                          "data": "nguyện"
                      },
                      {
                          "startTime": 131870,
                          "endTime": 131870,
                          "data": "ước"
                      },
                      {
                          "startTime": 131870,
                          "endTime": 132120,
                          "data": "trăm"
                      },
                      {
                          "startTime": 132120,
                          "endTime": 132370,
                          "data": "năm"
                      },
                      {
                          "startTime": 132370,
                          "endTime": 132620,
                          "data": "thành"
                      },
                      {
                          "startTime": 132620,
                          "endTime": 132870,
                          "data": "đôi"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 132870,
                          "endTime": 133120,
                          "data": "Giờ"
                      },
                      {
                          "startTime": 133120,
                          "endTime": 133380,
                          "data": "mình"
                      },
                      {
                          "startTime": 133380,
                          "endTime": 133620,
                          "data": "cùng"
                      },
                      {
                          "startTime": 133620,
                          "endTime": 133880,
                          "data": "tính"
                      },
                      {
                          "startTime": 133880,
                          "endTime": 133880,
                          "data": "đi"
                      },
                      {
                          "startTime": 133880,
                          "endTime": 134150,
                          "data": "ôi"
                      },
                      {
                          "startTime": 134150,
                          "endTime": 134390,
                          "data": "dồi"
                      },
                      {
                          "startTime": 134390,
                          "endTime": 134650,
                          "data": "ôi"
                      },
                      {
                          "startTime": 134650,
                          "endTime": 135150,
                          "data": "vô"
                      },
                      {
                          "startTime": 135150,
                          "endTime": 137150,
                          "data": "rồi"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 137150,
                          "endTime": 137150,
                          "data": "Bởi"
                      },
                      {
                          "startTime": 137150,
                          "endTime": 137410,
                          "data": "quá"
                      },
                      {
                          "startTime": 137410,
                          "endTime": 137910,
                          "data": "thương"
                      },
                      {
                          "startTime": 137910,
                          "endTime": 138410,
                          "data": "em"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 138410,
                          "endTime": 138660,
                          "data": "Nên"
                      },
                      {
                          "startTime": 138660,
                          "endTime": 138910,
                          "data": "anh"
                      },
                      {
                          "startTime": 138910,
                          "endTime": 139170,
                          "data": "ráng"
                      },
                      {
                          "startTime": 139170,
                          "endTime": 139660,
                          "data": "sang"
                      },
                      {
                          "startTime": 139660,
                          "endTime": 139920,
                          "data": "năm"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 139920,
                          "endTime": 140430,
                          "data": "Mần"
                      },
                      {
                          "startTime": 140430,
                          "endTime": 140680,
                          "data": "ăn"
                      },
                      {
                          "startTime": 140680,
                          "endTime": 140930,
                          "data": "lên"
                      },
                      {
                          "startTime": 140930,
                          "endTime": 141180,
                          "data": "anh"
                      },
                      {
                          "startTime": 141180,
                          "endTime": 141430,
                          "data": "hốt"
                      },
                      {
                          "startTime": 141430,
                          "endTime": 141680,
                          "data": "em"
                      },
                      {
                          "startTime": 141680,
                          "endTime": 141930,
                          "data": "về"
                      },
                      {
                          "startTime": 141930,
                          "endTime": 142430,
                          "data": "làm"
                      },
                      {
                          "startTime": 142430,
                          "endTime": 144440,
                          "data": "dâu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 144440,
                          "endTime": 144690,
                          "data": "Chút"
                      },
                      {
                          "startTime": 144690,
                          "endTime": 144940,
                          "data": "yêu"
                      },
                      {
                          "startTime": 144940,
                          "endTime": 145440,
                          "data": "thương"
                      },
                      {
                          "startTime": 145440,
                          "endTime": 145960,
                          "data": "thêm"
                      },
                      {
                          "startTime": 145960,
                          "endTime": 146210,
                          "data": "chút"
                      },
                      {
                          "startTime": 146210,
                          "endTime": 146710,
                          "data": "mê"
                      },
                      {
                          "startTime": 146710,
                          "endTime": 147210,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 147210,
                          "endTime": 147460,
                          "data": "Làm"
                      },
                      {
                          "startTime": 147460,
                          "endTime": 147710,
                          "data": "lòng"
                      },
                      {
                          "startTime": 147710,
                          "endTime": 148210,
                          "data": "em"
                      },
                      {
                          "startTime": 148210,
                          "endTime": 148460,
                          "data": "chắc"
                      },
                      {
                          "startTime": 148460,
                          "endTime": 148720,
                          "data": "chắn"
                      },
                      {
                          "startTime": 148720,
                          "endTime": 148960,
                          "data": "sẽ"
                      },
                      {
                          "startTime": 148960,
                          "endTime": 149220,
                          "data": "là"
                      },
                      {
                          "startTime": 149220,
                          "endTime": 149470,
                          "data": "ngất"
                      },
                      {
                          "startTime": 149470,
                          "endTime": 152470,
                          "data": "ngây"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 152750,
                          "endTime": 153000,
                          "data": "Chờ"
                      },
                      {
                          "startTime": 153000,
                          "endTime": 153240,
                          "data": "đợi"
                      },
                      {
                          "startTime": 153240,
                          "endTime": 153500,
                          "data": "em"
                      },
                      {
                          "startTime": 153500,
                          "endTime": 153750,
                          "data": "bấy"
                      },
                      {
                          "startTime": 153750,
                          "endTime": 154250,
                          "data": "lâu"
                      },
                      {
                          "startTime": 154250,
                          "endTime": 154510,
                          "data": "nay"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 154510,
                          "endTime": 155010,
                          "data": "Để"
                      },
                      {
                          "startTime": 155010,
                          "endTime": 155010,
                          "data": "kêu"
                      },
                      {
                          "startTime": 155010,
                          "endTime": 155510,
                          "data": "anh"
                      },
                      {
                          "startTime": 155510,
                          "endTime": 155770,
                          "data": "bằng"
                      },
                      {
                          "startTime": 155770,
                          "endTime": 156270,
                          "data": "chồng"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 156270,
                          "endTime": 156510,
                          "data": "Trọn"
                      },
                      {
                          "startTime": 156510,
                          "endTime": 156770,
                          "data": "đời"
                      },
                      {
                          "startTime": 156770,
                          "endTime": 157020,
                          "data": "anh"
                      },
                      {
                          "startTime": 157020,
                          "endTime": 157260,
                          "data": "hứa"
                      },
                      {
                          "startTime": 157260,
                          "endTime": 157760,
                          "data": "sẽ"
                      },
                      {
                          "startTime": 157760,
                          "endTime": 158020,
                          "data": "không"
                      },
                      {
                          "startTime": 158020,
                          "endTime": 158530,
                          "data": "hai"
                      },
                      {
                          "startTime": 158530,
                          "endTime": 160020,
                          "data": "lòng"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 160020,
                          "endTime": 160280,
                          "data": "Kết"
                      },
                      {
                          "startTime": 160280,
                          "endTime": 160530,
                          "data": "thông"
                      },
                      {
                          "startTime": 160530,
                          "endTime": 160770,
                          "data": "gia"
                      },
                      {
                          "startTime": 160770,
                          "endTime": 161030,
                          "data": "hai"
                      },
                      {
                          "startTime": 161030,
                          "endTime": 161280,
                          "data": "nhà"
                      },
                      {
                          "startTime": 161280,
                          "endTime": 161780,
                          "data": "ta"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 161780,
                          "endTime": 162040,
                          "data": "Tùng"
                      },
                      {
                          "startTime": 162040,
                          "endTime": 162040,
                          "data": "dinh"
                      },
                      {
                          "startTime": 162040,
                          "endTime": 162280,
                          "data": "tùng"
                      },
                      {
                          "startTime": 162280,
                          "endTime": 162530,
                          "data": "dinh"
                      },
                      {
                          "startTime": 162530,
                          "endTime": 162790,
                          "data": "qua"
                      },
                      {
                          "startTime": 162790,
                          "endTime": 163030,
                          "data": "rước"
                      },
                      {
                          "startTime": 163030,
                          "endTime": 163540,
                          "data": "dâu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 163540,
                          "endTime": 163790,
                          "data": "Bằng"
                      },
                      {
                          "startTime": 163790,
                          "endTime": 164040,
                          "data": "lòng"
                      },
                      {
                          "startTime": 164040,
                          "endTime": 164290,
                          "data": "anh"
                      },
                      {
                          "startTime": 164290,
                          "endTime": 164540,
                          "data": "sang"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 164540,
                          "endTime": 164540,
                          "data": "Anh"
                      },
                      {
                          "startTime": 164540,
                          "endTime": 164800,
                          "data": "mang"
                      },
                      {
                          "startTime": 164800,
                          "endTime": 165060,
                          "data": "bưng"
                      },
                      {
                          "startTime": 165060,
                          "endTime": 165300,
                          "data": "theo"
                      },
                      {
                          "startTime": 165300,
                          "endTime": 165810,
                          "data": "cau"
                      },
                      {
                          "startTime": 165810,
                          "endTime": 167060,
                          "data": "trầu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 167060,
                          "endTime": 167320,
                          "data": "Mãi"
                      },
                      {
                          "startTime": 167320,
                          "endTime": 167810,
                          "data": "mãi"
                      },
                      {
                          "startTime": 167810,
                          "endTime": 168060,
                          "data": "không"
                      },
                      {
                          "startTime": 168060,
                          "endTime": 168570,
                          "data": "đổi"
                      },
                      {
                          "startTime": 168570,
                          "endTime": 169070,
                          "data": "thay"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 169070,
                          "endTime": 169320,
                          "data": "Tình"
                      },
                      {
                          "startTime": 169320,
                          "endTime": 169320,
                          "data": "này"
                      },
                      {
                          "startTime": 169320,
                          "endTime": 169580,
                          "data": "nguyện"
                      },
                      {
                          "startTime": 169580,
                          "endTime": 169840,
                          "data": "trao"
                      },
                      {
                          "startTime": 169840,
                          "endTime": 170080,
                          "data": "em"
                      },
                      {
                          "startTime": 170080,
                          "endTime": 170340,
                          "data": "đắm"
                      },
                      {
                          "startTime": 170340,
                          "endTime": 170840,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 170840,
                          "endTime": 171090,
                          "data": "Cưới"
                      },
                      {
                          "startTime": 171090,
                          "endTime": 171330,
                          "data": "em"
                      },
                      {
                          "startTime": 171330,
                          "endTime": 171850,
                          "data": "về"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 171850,
                          "endTime": 172100,
                          "data": "Sẽ"
                      },
                      {
                          "startTime": 172100,
                          "endTime": 172350,
                          "data": "không"
                      },
                      {
                          "startTime": 172350,
                          "endTime": 172350,
                          "data": "bao"
                      },
                      {
                          "startTime": 172350,
                          "endTime": 172610,
                          "data": "giờ"
                      },
                      {
                          "startTime": 172610,
                          "endTime": 172850,
                          "data": "để"
                      },
                      {
                          "startTime": 172850,
                          "endTime": 173100,
                          "data": "em"
                      },
                      {
                          "startTime": 173100,
                          "endTime": 174360,
                          "data": "khóc"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 174360,
                          "endTime": 174610,
                          "data": "Nếu"
                      },
                      {
                          "startTime": 174610,
                          "endTime": 174850,
                          "data": "như"
                      },
                      {
                          "startTime": 174850,
                          "endTime": 175110,
                          "data": "một"
                      },
                      {
                          "startTime": 175110,
                          "endTime": 175360,
                          "data": "ngày"
                      },
                      {
                          "startTime": 175360,
                          "endTime": 175860,
                          "data": "em"
                      },
                      {
                          "startTime": 175860,
                          "endTime": 176360,
                          "data": "buồn"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 176360,
                          "endTime": 176610,
                          "data": "Anh"
                      },
                      {
                          "startTime": 176610,
                          "endTime": 176870,
                          "data": "sẽ"
                      },
                      {
                          "startTime": 176870,
                          "endTime": 177120,
                          "data": "làm"
                      },
                      {
                          "startTime": 177120,
                          "endTime": 177370,
                          "data": "cả"
                      },
                      {
                          "startTime": 177370,
                          "endTime": 177620,
                          "data": "bầu"
                      },
                      {
                          "startTime": 177620,
                          "endTime": 177880,
                          "data": "trời"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 177880,
                          "endTime": 178120,
                          "data": "Để"
                      },
                      {
                          "startTime": 178120,
                          "endTime": 178620,
                          "data": "cho"
                      },
                      {
                          "startTime": 178620,
                          "endTime": 178870,
                          "data": "em"
                      },
                      {
                          "startTime": 178870,
                          "endTime": 179130,
                          "data": "thấy"
                      },
                      {
                          "startTime": 179130,
                          "endTime": 179880,
                          "data": "không"
                      },
                      {
                          "startTime": 179880,
                          "endTime": 180130,
                          "data": "chơi"
                      },
                      {
                          "startTime": 180130,
                          "endTime": 183130,
                          "data": "vơi"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 183620,
                          "endTime": 183880,
                          "data": "Thương"
                      },
                      {
                          "startTime": 183880,
                          "endTime": 184380,
                          "data": "anh"
                      },
                      {
                          "startTime": 184380,
                          "endTime": 184620,
                          "data": "mấy"
                      },
                      {
                          "startTime": 184620,
                          "endTime": 185130,
                          "data": "núi"
                      },
                      {
                          "startTime": 185130,
                          "endTime": 185380,
                          "data": "em"
                      },
                      {
                          "startTime": 185380,
                          "endTime": 185870,
                          "data": "cũng"
                      },
                      {
                          "startTime": 185870,
                          "endTime": 186380,
                          "data": "trèo"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 186380,
                          "endTime": 186640,
                          "data": "Mấy"
                      },
                      {
                          "startTime": 186640,
                          "endTime": 186880,
                          "data": "sông"
                      },
                      {
                          "startTime": 186880,
                          "endTime": 187140,
                          "data": "em"
                      },
                      {
                          "startTime": 187140,
                          "endTime": 187630,
                          "data": "cũng"
                      },
                      {
                          "startTime": 187630,
                          "endTime": 187890,
                          "data": "lội"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 187890,
                          "endTime": 188150,
                          "data": "Mấy"
                      },
                      {
                          "startTime": 188150,
                          "endTime": 188650,
                          "data": "đèo"
                      },
                      {
                          "startTime": 188650,
                          "endTime": 188900,
                          "data": "em"
                      },
                      {
                          "startTime": 188900,
                          "endTime": 189400,
                          "data": "cũng"
                      },
                      {
                          "startTime": 189400,
                          "endTime": 190910,
                          "data": "qua"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 190910,
                          "endTime": 191160,
                          "data": "Thương"
                      },
                      {
                          "startTime": 191160,
                          "endTime": 191660,
                          "data": "anh"
                      },
                      {
                          "startTime": 191660,
                          "endTime": 191920,
                          "data": "cái"
                      },
                      {
                          "startTime": 191920,
                          "endTime": 192170,
                          "data": "tính"
                      },
                      {
                          "startTime": 192170,
                          "endTime": 192420,
                          "data": "anh"
                      },
                      {
                          "startTime": 192420,
                          "endTime": 192910,
                          "data": "thật"
                      },
                      {
                          "startTime": 192910,
                          "endTime": 193420,
                          "data": "thà"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 193420,
                          "endTime": 193670,
                          "data": "Trai"
                      },
                      {
                          "startTime": 193670,
                          "endTime": 193920,
                          "data": "quê"
                      },
                      {
                          "startTime": 193920,
                          "endTime": 194180,
                          "data": "mà"
                      },
                      {
                          "startTime": 194180,
                          "endTime": 194690,
                          "data": "chân"
                      },
                      {
                          "startTime": 194690,
                          "endTime": 195210,
                          "data": "chất"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 195210,
                          "endTime": 195460,
                          "data": "Mượt"
                      },
                      {
                          "startTime": 195460,
                          "endTime": 195710,
                          "data": "mà"
                      },
                      {
                          "startTime": 195710,
                          "endTime": 196210,
                          "data": "sao"
                      },
                      {
                          "startTime": 196210,
                          "endTime": 196720,
                          "data": "dễ"
                      },
                      {
                          "startTime": 196720,
                          "endTime": 199720,
                          "data": "thương"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 199970,
                          "endTime": 199970,
                          "data": "Chờ"
                      },
                      {
                          "startTime": 199970,
                          "endTime": 200230,
                          "data": "đợi"
                      },
                      {
                          "startTime": 200230,
                          "endTime": 200470,
                          "data": "em"
                      },
                      {
                          "startTime": 200470,
                          "endTime": 200980,
                          "data": "bấy"
                      },
                      {
                          "startTime": 200980,
                          "endTime": 201220,
                          "data": "lâu"
                      },
                      {
                          "startTime": 201220,
                          "endTime": 201480,
                          "data": "nay"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 201480,
                          "endTime": 201980,
                          "data": "Để"
                      },
                      {
                          "startTime": 201980,
                          "endTime": 201980,
                          "data": "kêu"
                      },
                      {
                          "startTime": 201980,
                          "endTime": 202250,
                          "data": "anh"
                      },
                      {
                          "startTime": 202250,
                          "endTime": 202750,
                          "data": "bằng"
                      },
                      {
                          "startTime": 202750,
                          "endTime": 203000,
                          "data": "chồng"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 203000,
                          "endTime": 203260,
                          "data": "Trọn"
                      },
                      {
                          "startTime": 203260,
                          "endTime": 203500,
                          "data": "đời"
                      },
                      {
                          "startTime": 203500,
                          "endTime": 203760,
                          "data": "anh"
                      },
                      {
                          "startTime": 203760,
                          "endTime": 204260,
                          "data": "hứa"
                      },
                      {
                          "startTime": 204260,
                          "endTime": 204750,
                          "data": "sẽ"
                      },
                      {
                          "startTime": 204750,
                          "endTime": 205010,
                          "data": "không"
                      },
                      {
                          "startTime": 205010,
                          "endTime": 205510,
                          "data": "hai"
                      },
                      {
                          "startTime": 205510,
                          "endTime": 206770,
                          "data": "lòng"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 206770,
                          "endTime": 207010,
                          "data": "Kết"
                      },
                      {
                          "startTime": 207010,
                          "endTime": 207520,
                          "data": "thông"
                      },
                      {
                          "startTime": 207520,
                          "endTime": 207770,
                          "data": "gia"
                      },
                      {
                          "startTime": 207770,
                          "endTime": 208020,
                          "data": "hai"
                      },
                      {
                          "startTime": 208020,
                          "endTime": 208270,
                          "data": "nhà"
                      },
                      {
                          "startTime": 208270,
                          "endTime": 208520,
                          "data": "ta"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 208520,
                          "endTime": 208770,
                          "data": "Tùng"
                      },
                      {
                          "startTime": 208770,
                          "endTime": 209030,
                          "data": "dinh"
                      },
                      {
                          "startTime": 209030,
                          "endTime": 209270,
                          "data": "tùng"
                      },
                      {
                          "startTime": 209270,
                          "endTime": 209530,
                          "data": "dinh"
                      },
                      {
                          "startTime": 209530,
                          "endTime": 209770,
                          "data": "qua"
                      },
                      {
                          "startTime": 209770,
                          "endTime": 210020,
                          "data": "rước"
                      },
                      {
                          "startTime": 210020,
                          "endTime": 210280,
                          "data": "dâu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 210280,
                          "endTime": 210520,
                          "data": "Bằng"
                      },
                      {
                          "startTime": 210520,
                          "endTime": 210780,
                          "data": "lòng"
                      },
                      {
                          "startTime": 210780,
                          "endTime": 211030,
                          "data": "anh"
                      },
                      {
                          "startTime": 211030,
                          "endTime": 211290,
                          "data": "sang"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 211290,
                          "endTime": 211530,
                          "data": "Anh"
                      },
                      {
                          "startTime": 211530,
                          "endTime": 211780,
                          "data": "mang"
                      },
                      {
                          "startTime": 211780,
                          "endTime": 212040,
                          "data": "bưng"
                      },
                      {
                          "startTime": 212040,
                          "endTime": 212280,
                          "data": "theo"
                      },
                      {
                          "startTime": 212280,
                          "endTime": 212780,
                          "data": "cau"
                      },
                      {
                          "startTime": 212780,
                          "endTime": 213790,
                          "data": "trầu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 213790,
                          "endTime": 214300,
                          "data": "Mãi"
                      },
                      {
                          "startTime": 214300,
                          "endTime": 214540,
                          "data": "mãi"
                      },
                      {
                          "startTime": 214540,
                          "endTime": 215050,
                          "data": "không"
                      },
                      {
                          "startTime": 215050,
                          "endTime": 215300,
                          "data": "đổi"
                      },
                      {
                          "startTime": 215300,
                          "endTime": 215800,
                          "data": "thay"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 215800,
                          "endTime": 216060,
                          "data": "Tình"
                      },
                      {
                          "startTime": 216060,
                          "endTime": 216310,
                          "data": "này"
                      },
                      {
                          "startTime": 216310,
                          "endTime": 216560,
                          "data": "nguyện"
                      },
                      {
                          "startTime": 216560,
                          "endTime": 216560,
                          "data": "trao"
                      },
                      {
                          "startTime": 216560,
                          "endTime": 216830,
                          "data": "em"
                      },
                      {
                          "startTime": 216830,
                          "endTime": 217070,
                          "data": "đắm"
                      },
                      {
                          "startTime": 217070,
                          "endTime": 217590,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 217590,
                          "endTime": 217840,
                          "data": "Cưới"
                      },
                      {
                          "startTime": 217840,
                          "endTime": 218340,
                          "data": "em"
                      },
                      {
                          "startTime": 218340,
                          "endTime": 218590,
                          "data": "về"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 218590,
                          "endTime": 218840,
                          "data": "Sẽ"
                      },
                      {
                          "startTime": 218840,
                          "endTime": 219100,
                          "data": "không"
                      },
                      {
                          "startTime": 219100,
                          "endTime": 219340,
                          "data": "bao"
                      },
                      {
                          "startTime": 219340,
                          "endTime": 219600,
                          "data": "giờ"
                      },
                      {
                          "startTime": 219600,
                          "endTime": 219600,
                          "data": "để"
                      },
                      {
                          "startTime": 219600,
                          "endTime": 220110,
                          "data": "em"
                      },
                      {
                          "startTime": 220110,
                          "endTime": 221360,
                          "data": "khóc"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 221360,
                          "endTime": 221610,
                          "data": "Nếu"
                      },
                      {
                          "startTime": 221610,
                          "endTime": 221610,
                          "data": "như"
                      },
                      {
                          "startTime": 221610,
                          "endTime": 221860,
                          "data": "một"
                      },
                      {
                          "startTime": 221860,
                          "endTime": 222360,
                          "data": "ngày"
                      },
                      {
                          "startTime": 222360,
                          "endTime": 222610,
                          "data": "em"
                      },
                      {
                          "startTime": 222610,
                          "endTime": 223120,
                          "data": "buồn"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 223120,
                          "endTime": 223360,
                          "data": "Anh"
                      },
                      {
                          "startTime": 223360,
                          "endTime": 223620,
                          "data": "sẽ"
                      },
                      {
                          "startTime": 223620,
                          "endTime": 223870,
                          "data": "làm"
                      },
                      {
                          "startTime": 223870,
                          "endTime": 224110,
                          "data": "cả"
                      },
                      {
                          "startTime": 224110,
                          "endTime": 224370,
                          "data": "bầu"
                      },
                      {
                          "startTime": 224370,
                          "endTime": 224870,
                          "data": "trời"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 224870,
                          "endTime": 224870,
                          "data": "Để"
                      },
                      {
                          "startTime": 224870,
                          "endTime": 225380,
                          "data": "cho"
                      },
                      {
                          "startTime": 225380,
                          "endTime": 225880,
                          "data": "em"
                      },
                      {
                          "startTime": 225880,
                          "endTime": 226380,
                          "data": "thấy"
                      },
                      {
                          "startTime": 226380,
                          "endTime": 226640,
                          "data": "không"
                      },
                      {
                          "startTime": 226640,
                          "endTime": 227140,
                          "data": "chơi"
                      },
                      {
                          "startTime": 227140,
                          "endTime": 228140,
                          "data": "vơi"
                      }
                  ]
              }
          ],
          "file": "https://static-zmp3.zmdcdn.me/lyrics/3/5/8/d/358d14c61079baee165f3931da6d450b.lrc",
          "enabledVideoBG": true,
          "defaultIBGUrls": [
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/c/0/5/3c05c10ae36f6361f9af0874bb7c4851.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/b/b/e/0/bbe01e4bf6d8e23101fcb6db44df311d.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/a/1/f/3/a1f34293d1dc92735be8c3f9082c4acf.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/6/e/9/5/6e95b598e1e14a187ee779bcd888e75c.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/1/c/8/1/1c81e957a6270eba91571d822a47e7c5.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/0/0/0/d/000d9d0679bbbb564a191a6801d7f19d.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/6/4/f/e64f4fd6f53caebabc1c26d592093cfa.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/d/e/3/1/de315c40b537d40b7409a6702f446631.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/1/4/6/2/1462efc7378bed3f98ace411e11eab45.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/5/b/f/a/5bfa05533ed7975035e69a4508c82fd6.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/f/2/b/1/f2b1b91fa64e0c354150c86fd96c249c.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/5/1/f/b/51fbcd4ae32096ffe2dd89cd36bb6ed9.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/6/2/3/9/62392463eab1eb1aaa2d1f3bd0f758bb.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/1/2/f/0/12f01e12d6e13e263ef76f3fdb65d66e.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/8/8/2/4/8824ef8e3e3aa3e302f03879a1f9d7d3.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/4/3/4/9/43491e9d95a9942015548bd2a061250d.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/9/8/7/5/987517940ce71a96bab9c0c88d5b6b95.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/8/e/2/4/8e24305fde744814083af980a593e8c2.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/f/1/2/7/f1270dd1bed79b527228e3351d2b67ae.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/0/a/3/0/0a301934881ee4e2de30dc8f41bc55f9.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/c/c/9/f/cc9fce8719364ba9d8a846984c590a0e.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/5/d/e/e5de86acd7567465f54a6b9307076947.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/6/4/b/b/64bb19c5f971b4e4f16f3bfdff64a396.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/0/3/2/0/03206606d461843e22451747a9b60769.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/b/d/4/4/bd4485d6dfef80764869a4d88d9b0475.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/8/6/8/e86817d147315d9d644835f60d17ae41.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/b/b/4/7/bb477f2f56f162b13426f70c9858c732.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/c/5/3/6/c536ff6ab992e36be24ca0adf8e86ae0.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/6/c/f/c/6cfc1e6e3b94c62cded257659602f00b.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/2/5/d/6/25d6adaa11b4e932d61309ed635d57fa.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/d/2/a/e/d2ae42243ccd4fec321fc60692a5a2dc.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/b/8/0/e/b80e5777c7eec332c882bf79bd692056.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/7/b/a/e7ba1207018f1d2fa7048598c7d627df.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/f/4/0/3f40bd0d6d8cbcf833c72ab050f19e6a.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/a/d/a/d/adad060e15f8409ec2e7670cf943c202.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/d/1/7/ed17742d63b635725e6071a9bee362c5.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/a/e/8/3ae816de233a9eae0116b4b5a21af43e.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/d/7/f/1/d7f15e3996e7923ffc2a64d1f8e43448.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/0/0/7/e/007e6b48696aab4a61ca46a10d980f63.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/d/9/f/5/d9f592437d80e358a76e32798ce2d294.jpg"
          ],
          "BGMode": 0
      },
      "timestamp": 1695700854072
  }
    `,
  `{
      "err": 0,
      "msg": "Success",
      "data": {
          "sentences": [
              {
                  "words": [
                      {
                          "startTime": 9750,
                          "endTime": 10040,
                          "data": "Kìa"
                      },
                      {
                          "startTime": 10040,
                          "endTime": 10560,
                          "data": "bóng"
                      },
                      {
                          "startTime": 10560,
                          "endTime": 11090,
                          "data": "dáng"
                      },
                      {
                          "startTime": 11090,
                          "endTime": 11580,
                          "data": "ai"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 11580,
                          "endTime": 11850,
                          "data": "Vụt"
                      },
                      {
                          "startTime": 11850,
                          "endTime": 11850,
                          "data": "qua"
                      },
                      {
                          "startTime": 11850,
                          "endTime": 12360,
                          "data": "đây,"
                      },
                      {
                          "startTime": 12360,
                          "endTime": 12630,
                          "data": "vụt"
                      },
                      {
                          "startTime": 12630,
                          "endTime": 12910,
                          "data": "qua"
                      },
                      {
                          "startTime": 12910,
                          "endTime": 13910,
                          "data": "đây"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 13910,
                          "endTime": 14180,
                          "data": "Mà"
                      },
                      {
                          "startTime": 14180,
                          "endTime": 14720,
                          "data": "ai"
                      },
                      {
                          "startTime": 14720,
                          "endTime": 15240,
                          "data": "thao"
                      },
                      {
                          "startTime": 15240,
                          "endTime": 15510,
                          "data": "thức"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 15510,
                          "endTime": 15800,
                          "data": "Cả"
                      },
                      {
                          "startTime": 15800,
                          "endTime": 16060,
                          "data": "đêm"
                      },
                      {
                          "startTime": 16060,
                          "endTime": 16590,
                          "data": "ngày,"
                      },
                      {
                          "startTime": 16590,
                          "endTime": 16850,
                          "data": "cả"
                      },
                      {
                          "startTime": 16850,
                          "endTime": 17120,
                          "data": "đêm"
                      },
                      {
                          "startTime": 17120,
                          "endTime": 18180,
                          "data": "ngày"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 18180,
                          "endTime": 18450,
                          "data": "Kìa"
                      },
                      {
                          "startTime": 18450,
                          "endTime": 18980,
                          "data": "bóng"
                      },
                      {
                          "startTime": 18980,
                          "endTime": 19510,
                          "data": "dáng"
                      },
                      {
                          "startTime": 19510,
                          "endTime": 19770,
                          "data": "ai"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 19770,
                          "endTime": 20040,
                          "data": "Vụt"
                      },
                      {
                          "startTime": 20040,
                          "endTime": 20310,
                          "data": "qua"
                      },
                      {
                          "startTime": 20310,
                          "endTime": 20840,
                          "data": "đây,"
                      },
                      {
                          "startTime": 20840,
                          "endTime": 21100,
                          "data": "vụt"
                      },
                      {
                          "startTime": 21100,
                          "endTime": 21370,
                          "data": "qua"
                      },
                      {
                          "startTime": 21370,
                          "endTime": 22430,
                          "data": "đây"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 22430,
                          "endTime": 22700,
                          "data": "Mà"
                      },
                      {
                          "startTime": 22700,
                          "endTime": 23230,
                          "data": "ai"
                      },
                      {
                          "startTime": 23230,
                          "endTime": 23490,
                          "data": "thao"
                      },
                      {
                          "startTime": 23490,
                          "endTime": 24020,
                          "data": "thức"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 24020,
                          "endTime": 24290,
                          "data": "Tôi"
                      },
                      {
                          "startTime": 24290,
                          "endTime": 24560,
                          "data": "không"
                      },
                      {
                          "startTime": 24560,
                          "endTime": 24560,
                          "data": "muốn"
                      },
                      {
                          "startTime": 24560,
                          "endTime": 24830,
                          "data": "nói"
                      },
                      {
                          "startTime": 24830,
                          "endTime": 25090,
                          "data": "là"
                      },
                      {
                          "startTime": 25090,
                          "endTime": 25350,
                          "data": "mê"
                      },
                      {
                          "startTime": 25350,
                          "endTime": 26080,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 26080,
                          "endTime": 26340,
                          "data": "Ờ"
                      },
                      {
                          "startTime": 26340,
                          "endTime": 26340,
                          "data": "thì"
                      },
                      {
                          "startTime": 26340,
                          "endTime": 26890,
                          "data": "là"
                      },
                      {
                          "startTime": 26890,
                          "endTime": 27160,
                          "data": "mình"
                      },
                      {
                          "startTime": 27160,
                          "endTime": 27420,
                          "data": "thì"
                      },
                      {
                          "startTime": 27420,
                          "endTime": 27420,
                          "data": "vẫn"
                      },
                      {
                          "startTime": 27420,
                          "endTime": 27700,
                          "data": "cứ"
                      },
                      {
                          "startTime": 27700,
                          "endTime": 28710,
                          "data": "lướt"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 28710,
                          "endTime": 28970,
                          "data": "Anh"
                      },
                      {
                          "startTime": 28970,
                          "endTime": 29500,
                          "data": "thì"
                      },
                      {
                          "startTime": 29500,
                          "endTime": 29500,
                          "data": "ngồi"
                      },
                      {
                          "startTime": 29500,
                          "endTime": 29770,
                          "data": "phía"
                      },
                      {
                          "startTime": 29770,
                          "endTime": 30790,
                          "data": "trước"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 30790,
                          "endTime": 31050,
                          "data": "Giọng"
                      },
                      {
                          "startTime": 31050,
                          "endTime": 31580,
                          "data": "ngoài"
                      },
                      {
                          "startTime": 31580,
                          "endTime": 31840,
                          "data": "đời"
                      },
                      {
                          "startTime": 31840,
                          "endTime": 32110,
                          "data": "chua"
                      },
                      {
                          "startTime": 32110,
                          "endTime": 32590,
                          "data": "chát"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 32590,
                          "endTime": 32850,
                          "data": "Nhưng"
                      },
                      {
                          "startTime": 32850,
                          "endTime": 33110,
                          "data": "mà"
                      },
                      {
                          "startTime": 33110,
                          "endTime": 33380,
                          "data": "khi"
                      },
                      {
                          "startTime": 33380,
                          "endTime": 33650,
                          "data": "gặp"
                      },
                      {
                          "startTime": 33650,
                          "endTime": 33650,
                          "data": "anh"
                      },
                      {
                          "startTime": 33650,
                          "endTime": 33930,
                          "data": "sẽ"
                      },
                      {
                          "startTime": 33930,
                          "endTime": 34660,
                          "data": "khác"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 34660,
                          "endTime": 34920,
                          "data": "Vì"
                      },
                      {
                          "startTime": 34920,
                          "endTime": 35190,
                          "data": "chỉ"
                      },
                      {
                          "startTime": 35190,
                          "endTime": 35720,
                          "data": "hát"
                      },
                      {
                          "startTime": 35720,
                          "endTime": 35980,
                          "data": "vang,"
                      },
                      {
                          "startTime": 35980,
                          "endTime": 36250,
                          "data": "làm"
                      },
                      {
                          "startTime": 36250,
                          "endTime": 36520,
                          "data": "nát"
                      },
                      {
                          "startTime": 36520,
                          "endTime": 37050,
                          "data": "tan"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 37050,
                          "endTime": 37310,
                          "data": "Con"
                      },
                      {
                          "startTime": 37310,
                          "endTime": 37580,
                          "data": "tim"
                      },
                      {
                          "startTime": 37580,
                          "endTime": 37580,
                          "data": "này"
                      },
                      {
                          "startTime": 37580,
                          "endTime": 37840,
                          "data": "trở"
                      },
                      {
                          "startTime": 37840,
                          "endTime": 38110,
                          "data": "nên"
                      },
                      {
                          "startTime": 38110,
                          "endTime": 38640,
                          "data": "yếu"
                      },
                      {
                          "startTime": 38640,
                          "endTime": 39110,
                          "data": "mềm"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 39110,
                          "endTime": 39370,
                          "data": "Chỉ"
                      },
                      {
                          "startTime": 39370,
                          "endTime": 39640,
                          "data": "muốn"
                      },
                      {
                          "startTime": 39640,
                          "endTime": 39900,
                          "data": "nói"
                      },
                      {
                          "startTime": 39900,
                          "endTime": 40430,
                          "data": "ra"
                      },
                      {
                          "startTime": 40430,
                          "endTime": 40700,
                          "data": "hết"
                      },
                      {
                          "startTime": 40700,
                          "endTime": 41200,
                          "data": "thôi"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 41200,
                          "endTime": 41340,
                          "data": "Từng"
                      },
                      {
                          "startTime": 41340,
                          "endTime": 41600,
                          "data": "phút,"
                      },
                      {
                          "startTime": 41600,
                          "endTime": 41870,
                          "data": "từng"
                      },
                      {
                          "startTime": 41870,
                          "endTime": 42370,
                          "data": "giây"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 42370,
                          "endTime": 42500,
                          "data": "Tôi"
                      },
                      {
                          "startTime": 42500,
                          "endTime": 42640,
                          "data": "yêu"
                      },
                      {
                          "startTime": 42640,
                          "endTime": 42900,
                          "data": "anh"
                      },
                      {
                          "startTime": 42900,
                          "endTime": 43170,
                          "data": "nhiều"
                      },
                      {
                          "startTime": 43170,
                          "endTime": 43380,
                          "data": "thêm"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 43380,
                          "endTime": 43940,
                          "data": "Bóng"
                      },
                      {
                          "startTime": 43940,
                          "endTime": 44460,
                          "data": "dáng"
                      },
                      {
                          "startTime": 44460,
                          "endTime": 44990,
                          "data": "ai"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 44990,
                          "endTime": 44990,
                          "data": "Vụt"
                      },
                      {
                          "startTime": 44990,
                          "endTime": 45260,
                          "data": "qua"
                      },
                      {
                          "startTime": 45260,
                          "endTime": 45790,
                          "data": "đây,"
                      },
                      {
                          "startTime": 45790,
                          "endTime": 46060,
                          "data": "vụt"
                      },
                      {
                          "startTime": 46060,
                          "endTime": 46320,
                          "data": "qua"
                      },
                      {
                          "startTime": 46320,
                          "endTime": 47320,
                          "data": "đây"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 47320,
                          "endTime": 47600,
                          "data": "Mà"
                      },
                      {
                          "startTime": 47600,
                          "endTime": 48120,
                          "data": "ai"
                      },
                      {
                          "startTime": 48120,
                          "endTime": 48650,
                          "data": "thao"
                      },
                      {
                          "startTime": 48650,
                          "endTime": 49190,
                          "data": "thức"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 49190,
                          "endTime": 49190,
                          "data": "Cả"
                      },
                      {
                          "startTime": 49190,
                          "endTime": 49460,
                          "data": "đêm"
                      },
                      {
                          "startTime": 49460,
                          "endTime": 49980,
                          "data": "ngày,"
                      },
                      {
                          "startTime": 49980,
                          "endTime": 50240,
                          "data": "cả"
                      },
                      {
                          "startTime": 50240,
                          "endTime": 50510,
                          "data": "đêm"
                      },
                      {
                          "startTime": 50510,
                          "endTime": 51570,
                          "data": "ngày"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 51570,
                          "endTime": 51840,
                          "data": "Kìa"
                      },
                      {
                          "startTime": 51840,
                          "endTime": 52370,
                          "data": "bóng"
                      },
                      {
                          "startTime": 52370,
                          "endTime": 52900,
                          "data": "dáng"
                      },
                      {
                          "startTime": 52900,
                          "endTime": 53170,
                          "data": "ai"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 53170,
                          "endTime": 53430,
                          "data": "Vụt"
                      },
                      {
                          "startTime": 53430,
                          "endTime": 53700,
                          "data": "qua"
                      },
                      {
                          "startTime": 53700,
                          "endTime": 54230,
                          "data": "đây,"
                      },
                      {
                          "startTime": 54230,
                          "endTime": 54490,
                          "data": "vụt"
                      },
                      {
                          "startTime": 54490,
                          "endTime": 54490,
                          "data": "qua"
                      },
                      {
                          "startTime": 54490,
                          "endTime": 55570,
                          "data": "đây"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 55570,
                          "endTime": 56100,
                          "data": "Mà"
                      },
                      {
                          "startTime": 56100,
                          "endTime": 56370,
                          "data": "ai"
                      },
                      {
                          "startTime": 56370,
                          "endTime": 56900,
                          "data": "thao"
                      },
                      {
                          "startTime": 56900,
                          "endTime": 57430,
                          "data": "thức"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 57430,
                          "endTime": 57430,
                          "data": "Tôi"
                      },
                      {
                          "startTime": 57430,
                          "endTime": 57700,
                          "data": "không"
                      },
                      {
                          "startTime": 57700,
                          "endTime": 57970,
                          "data": "muốn"
                      },
                      {
                          "startTime": 57970,
                          "endTime": 58230,
                          "data": "nói"
                      },
                      {
                          "startTime": 58230,
                          "endTime": 58490,
                          "data": "là"
                      },
                      {
                          "startTime": 58490,
                          "endTime": 58760,
                          "data": "mê"
                      },
                      {
                          "startTime": 58760,
                          "endTime": 59390,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 59390,
                          "endTime": 59660,
                          "data": "Mê"
                      },
                      {
                          "startTime": 59660,
                          "endTime": 60190,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 60190,
                          "endTime": 60450,
                          "data": "Mẹ"
                      },
                      {
                          "startTime": 60450,
                          "endTime": 60720,
                          "data": "căn"
                      },
                      {
                          "startTime": 60720,
                          "endTime": 60980,
                          "data": "dặn"
                      },
                      {
                          "startTime": 60980,
                          "endTime": 61120,
                          "data": "là"
                      },
                      {
                          "startTime": 61120,
                          "endTime": 61250,
                          "data": "cần"
                      },
                      {
                          "startTime": 61250,
                          "endTime": 61520,
                          "data": "phải"
                      },
                      {
                          "startTime": 61520,
                          "endTime": 61780,
                          "data": "về"
                      },
                      {
                          "startTime": 61780,
                          "endTime": 62010,
                          "data": "nhà"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 62010,
                          "endTime": 62250,
                          "data": "Và"
                      },
                      {
                          "startTime": 62250,
                          "endTime": 62400,
                          "data": "đâu"
                      },
                      {
                          "startTime": 62400,
                          "endTime": 62530,
                          "data": "được"
                      },
                      {
                          "startTime": 62530,
                          "endTime": 62790,
                          "data": "rề"
                      },
                      {
                          "startTime": 62790,
                          "endTime": 63060,
                          "data": "rà"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 63060,
                          "endTime": 63190,
                          "data": "Trước"
                      },
                      {
                          "startTime": 63190,
                          "endTime": 63320,
                          "data": "lúc"
                      },
                      {
                          "startTime": 63320,
                          "endTime": 63590,
                          "data": "mười"
                      },
                      {
                          "startTime": 63590,
                          "endTime": 63720,
                          "data": "giờ"
                      },
                      {
                          "startTime": 63720,
                          "endTime": 64080,
                          "data": "tối"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 64080,
                          "endTime": 64080,
                          "data": "Vậy"
                      },
                      {
                          "startTime": 64080,
                          "endTime": 64220,
                          "data": "nên"
                      },
                      {
                          "startTime": 64220,
                          "endTime": 64350,
                          "data": "là"
                      },
                      {
                          "startTime": 64350,
                          "endTime": 64610,
                          "data": "ta"
                      },
                      {
                          "startTime": 64610,
                          "endTime": 64880,
                          "data": "tăng"
                      },
                      {
                          "startTime": 64880,
                          "endTime": 65140,
                          "data": "ga"
                      },
                      {
                          "startTime": 65140,
                          "endTime": 65410,
                          "data": "tăng"
                      },
                      {
                          "startTime": 65410,
                          "endTime": 65910,
                          "data": "tốc"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 65910,
                          "endTime": 66040,
                          "data": "Nhưng"
                      },
                      {
                          "startTime": 66040,
                          "endTime": 66180,
                          "data": "mà"
                      },
                      {
                          "startTime": 66180,
                          "endTime": 66440,
                          "data": "em"
                      },
                      {
                          "startTime": 66440,
                          "endTime": 66710,
                          "data": "vẫn"
                      },
                      {
                          "startTime": 66710,
                          "endTime": 66840,
                          "data": "có"
                      },
                      {
                          "startTime": 66840,
                          "endTime": 66970,
                          "data": "nhiều"
                      },
                      {
                          "startTime": 66970,
                          "endTime": 67240,
                          "data": "điều"
                      },
                      {
                          "startTime": 67240,
                          "endTime": 67500,
                          "data": "để"
                      },
                      {
                          "startTime": 67500,
                          "endTime": 68000,
                          "data": "nói"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 68000,
                          "endTime": 68130,
                          "data": "Như"
                      },
                      {
                          "startTime": 68130,
                          "endTime": 68630,
                          "data": "là"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 68630,
                          "endTime": 68890,
                          "data": "Đưa"
                      },
                      {
                          "startTime": 68890,
                          "endTime": 69030,
                          "data": "về"
                      },
                      {
                          "startTime": 69030,
                          "endTime": 69300,
                          "data": "ngõ"
                      },
                      {
                          "startTime": 69300,
                          "endTime": 69440,
                          "data": "nhưng"
                      },
                      {
                          "startTime": 69440,
                          "endTime": 69570,
                          "data": "mà"
                      },
                      {
                          "startTime": 69570,
                          "endTime": 69830,
                          "data": "không"
                      },
                      {
                          "startTime": 69830,
                          "endTime": 70100,
                          "data": "dám"
                      },
                      {
                          "startTime": 70100,
                          "endTime": 70590,
                          "data": "vào"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 70590,
                          "endTime": 70850,
                          "data": "Mẹ"
                      },
                      {
                          "startTime": 70850,
                          "endTime": 71120,
                          "data": "anh"
                      },
                      {
                          "startTime": 71120,
                          "endTime": 71390,
                          "data": "khó"
                      },
                      {
                          "startTime": 71390,
                          "endTime": 71520,
                          "data": "nên"
                      },
                      {
                          "startTime": 71520,
                          "endTime": 71650,
                          "data": "rất"
                      },
                      {
                          "startTime": 71650,
                          "endTime": 71920,
                          "data": "khó"
                      },
                      {
                          "startTime": 71920,
                          "endTime": 72190,
                          "data": "bày"
                      },
                      {
                          "startTime": 72190,
                          "endTime": 72820,
                          "data": "tỏ"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 72820,
                          "endTime": 72950,
                          "data": "Ba"
                      },
                      {
                          "startTime": 72950,
                          "endTime": 73210,
                          "data": "em"
                      },
                      {
                          "startTime": 73210,
                          "endTime": 73480,
                          "data": "khó"
                      },
                      {
                          "startTime": 73480,
                          "endTime": 73610,
                          "data": "nên"
                      },
                      {
                          "startTime": 73610,
                          "endTime": 73750,
                          "data": "cũng"
                      },
                      {
                          "startTime": 73750,
                          "endTime": 74010,
                          "data": "khó"
                      },
                      {
                          "startTime": 74010,
                          "endTime": 74140,
                          "data": "về"
                      },
                      {
                          "startTime": 74140,
                          "endTime": 74410,
                          "data": "khuya"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 74410,
                          "endTime": 74540,
                          "data": "Nên"
                      },
                      {
                          "startTime": 74540,
                          "endTime": 74810,
                          "data": "thời"
                      },
                      {
                          "startTime": 74810,
                          "endTime": 75070,
                          "data": "gian"
                      },
                      {
                          "startTime": 75070,
                          "endTime": 75340,
                          "data": "cho"
                      },
                      {
                          "startTime": 75340,
                          "endTime": 75580,
                          "data": "nhau"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 75580,
                          "endTime": 75710,
                          "data": "Đừng"
                      },
                      {
                          "startTime": 75710,
                          "endTime": 75840,
                          "data": "cãi"
                      },
                      {
                          "startTime": 75840,
                          "endTime": 76110,
                          "data": "nhau"
                      },
                      {
                          "startTime": 76110,
                          "endTime": 76370,
                          "data": "lia"
                      },
                      {
                          "startTime": 76370,
                          "endTime": 76880,
                          "data": "lịa"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 76880,
                          "endTime": 77150,
                          "data": "Bà"
                      },
                      {
                          "startTime": 77150,
                          "endTime": 77410,
                          "data": "em"
                      },
                      {
                          "startTime": 77410,
                          "endTime": 77680,
                          "data": "bắt"
                      },
                      {
                          "startTime": 77680,
                          "endTime": 77810,
                          "data": "em"
                      },
                      {
                          "startTime": 77810,
                          "endTime": 77940,
                          "data": "phải"
                      },
                      {
                          "startTime": 77940,
                          "endTime": 78210,
                          "data": "đi"
                      },
                      {
                          "startTime": 78210,
                          "endTime": 78470,
                          "data": "ngủ"
                      },
                      {
                          "startTime": 78470,
                          "endTime": 78720,
                          "data": "sớm"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 78720,
                          "endTime": 78850,
                          "data": "Thì"
                      },
                      {
                          "startTime": 78850,
                          "endTime": 79120,
                          "data": "em"
                      },
                      {
                          "startTime": 79120,
                          "endTime": 79250,
                          "data": "đang"
                      },
                      {
                          "startTime": 79250,
                          "endTime": 79510,
                          "data": "trùm"
                      },
                      {
                          "startTime": 79510,
                          "endTime": 79780,
                          "data": "chăn"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 79780,
                          "endTime": 79910,
                          "data": "Để"
                      },
                      {
                          "startTime": 79910,
                          "endTime": 80050,
                          "data": "mà"
                      },
                      {
                          "startTime": 80050,
                          "endTime": 80310,
                          "data": "chờ"
                      },
                      {
                          "startTime": 80310,
                          "endTime": 80580,
                          "data": "tin"
                      },
                      {
                          "startTime": 80580,
                          "endTime": 81080,
                          "data": "nhắn"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 81080,
                          "endTime": 81340,
                          "data": "Cô"
                      },
                      {
                          "startTime": 81340,
                          "endTime": 81610,
                          "data": "em"
                      },
                      {
                          "startTime": 81610,
                          "endTime": 81870,
                          "data": "bảo"
                      },
                      {
                          "startTime": 81870,
                          "endTime": 82010,
                          "data": "đang"
                      },
                      {
                          "startTime": 82010,
                          "endTime": 82140,
                          "data": "tuổi"
                      },
                      {
                          "startTime": 82140,
                          "endTime": 82400,
                          "data": "ăn"
                      },
                      {
                          "startTime": 82400,
                          "endTime": 82540,
                          "data": "tuổi"
                      },
                      {
                          "startTime": 82540,
                          "endTime": 82800,
                          "data": "lớn"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 82800,
                          "endTime": 82930,
                          "data": "Nên"
                      },
                      {
                          "startTime": 82930,
                          "endTime": 83200,
                          "data": "là"
                      },
                      {
                          "startTime": 83200,
                          "endTime": 83330,
                          "data": "gặp"
                      },
                      {
                          "startTime": 83330,
                          "endTime": 83600,
                          "data": "được"
                      },
                      {
                          "startTime": 83600,
                          "endTime": 83860,
                          "data": "nhau"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 83860,
                          "endTime": 84000,
                          "data": "Thì"
                      },
                      {
                          "startTime": 84000,
                          "endTime": 84130,
                          "data": "đó"
                      },
                      {
                          "startTime": 84130,
                          "endTime": 84400,
                          "data": "là"
                      },
                      {
                          "startTime": 84400,
                          "endTime": 84530,
                          "data": "may"
                      },
                      {
                          "startTime": 84530,
                          "endTime": 85130,
                          "data": "mắn"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 85130,
                          "endTime": 85390,
                          "data": "Giận"
                      },
                      {
                          "startTime": 85390,
                          "endTime": 85660,
                          "data": "hờn"
                      },
                      {
                          "startTime": 85660,
                          "endTime": 85930,
                          "data": "đừng"
                      },
                      {
                          "startTime": 85930,
                          "endTime": 86190,
                          "data": "vô"
                      },
                      {
                          "startTime": 86190,
                          "endTime": 86710,
                          "data": "cớ"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 86710,
                          "endTime": 86980,
                          "data": "Lỡ"
                      },
                      {
                          "startTime": 86980,
                          "endTime": 87240,
                          "data": "không"
                      },
                      {
                          "startTime": 87240,
                          "endTime": 87510,
                          "data": "thương"
                      },
                      {
                          "startTime": 87510,
                          "endTime": 87780,
                          "data": "đừng"
                      },
                      {
                          "startTime": 87780,
                          "endTime": 88040,
                          "data": "gieo"
                      },
                      {
                          "startTime": 88040,
                          "endTime": 88310,
                          "data": "thương"
                      },
                      {
                          "startTime": 88310,
                          "endTime": 88780,
                          "data": "nhớ"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 88780,
                          "endTime": 89040,
                          "data": "Nắm"
                      },
                      {
                          "startTime": 89040,
                          "endTime": 89310,
                          "data": "tay"
                      },
                      {
                          "startTime": 89310,
                          "endTime": 89680,
                          "data": "nhau"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 89680,
                          "endTime": 89810,
                          "data": "Chẳng"
                      },
                      {
                          "startTime": 89810,
                          "endTime": 89940,
                          "data": "để"
                      },
                      {
                          "startTime": 89940,
                          "endTime": 90080,
                          "data": "va"
                      },
                      {
                          "startTime": 90080,
                          "endTime": 90210,
                          "data": "vào"
                      },
                      {
                          "startTime": 90210,
                          "endTime": 90470,
                          "data": "giai"
                      },
                      {
                          "startTime": 90470,
                          "endTime": 90740,
                          "data": "điệu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 90740,
                          "endTime": 90870,
                          "data": "Vì"
                      },
                      {
                          "startTime": 90870,
                          "endTime": 91000,
                          "data": "ta"
                      },
                      {
                          "startTime": 91000,
                          "endTime": 91230,
                          "data": "biết"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 91230,
                          "endTime": 91500,
                          "data": "Câu"
                      },
                      {
                          "startTime": 91500,
                          "endTime": 91760,
                          "data": "chuyện"
                      },
                      {
                          "startTime": 91760,
                          "endTime": 91900,
                          "data": "này"
                      },
                      {
                          "startTime": 91900,
                          "endTime": 92160,
                          "data": "chẳng"
                      },
                      {
                          "startTime": 92160,
                          "endTime": 92290,
                          "data": "ai"
                      },
                      {
                          "startTime": 92290,
                          "endTime": 93330,
                          "data": "hiểu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 93330,
                          "endTime": 93600,
                          "data": "Kìa"
                      },
                      {
                          "startTime": 93600,
                          "endTime": 94120,
                          "data": "bóng"
                      },
                      {
                          "startTime": 94120,
                          "endTime": 94380,
                          "data": "dáng"
                      },
                      {
                          "startTime": 94380,
                          "endTime": 94910,
                          "data": "ai"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 94910,
                          "endTime": 95200,
                          "data": "Vụt"
                      },
                      {
                          "startTime": 95200,
                          "endTime": 95460,
                          "data": "qua"
                      },
                      {
                          "startTime": 95460,
                          "endTime": 95730,
                          "data": "đây,"
                      },
                      {
                          "startTime": 95730,
                          "endTime": 95990,
                          "data": "vụt"
                      },
                      {
                          "startTime": 95990,
                          "endTime": 96260,
                          "data": "qua"
                      },
                      {
                          "startTime": 96260,
                          "endTime": 97500,
                          "data": "đây"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 97500,
                          "endTime": 97770,
                          "data": "Mà"
                      },
                      {
                          "startTime": 97770,
                          "endTime": 98310,
                          "data": "ai"
                      },
                      {
                          "startTime": 98310,
                          "endTime": 98830,
                          "data": "thao"
                      },
                      {
                          "startTime": 98830,
                          "endTime": 99090,
                          "data": "thức"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 99090,
                          "endTime": 99360,
                          "data": "Cả"
                      },
                      {
                          "startTime": 99360,
                          "endTime": 99620,
                          "data": "đêm"
                      },
                      {
                          "startTime": 99620,
                          "endTime": 100150,
                          "data": "ngày,"
                      },
                      {
                          "startTime": 100150,
                          "endTime": 100420,
                          "data": "cả"
                      },
                      {
                          "startTime": 100420,
                          "endTime": 100690,
                          "data": "đêm"
                      },
                      {
                          "startTime": 100690,
                          "endTime": 101480,
                          "data": "ngày"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 101480,
                          "endTime": 102010,
                          "data": "Kìa"
                      },
                      {
                          "startTime": 102010,
                          "endTime": 102280,
                          "data": "bóng"
                      },
                      {
                          "startTime": 102280,
                          "endTime": 102810,
                          "data": "dáng"
                      },
                      {
                          "startTime": 102810,
                          "endTime": 103340,
                          "data": "ai"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 103340,
                          "endTime": 103340,
                          "data": "Vụt"
                      },
                      {
                          "startTime": 103340,
                          "endTime": 103610,
                          "data": "qua"
                      },
                      {
                          "startTime": 103610,
                          "endTime": 104140,
                          "data": "đây,"
                      },
                      {
                          "startTime": 104140,
                          "endTime": 104400,
                          "data": "vụt"
                      },
                      {
                          "startTime": 104400,
                          "endTime": 104670,
                          "data": "qua"
                      },
                      {
                          "startTime": 104670,
                          "endTime": 105730,
                          "data": "đây"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 105730,
                          "endTime": 106000,
                          "data": "Mà"
                      },
                      {
                          "startTime": 106000,
                          "endTime": 106530,
                          "data": "ai"
                      },
                      {
                          "startTime": 106530,
                          "endTime": 107060,
                          "data": "thao"
                      },
                      {
                          "startTime": 107060,
                          "endTime": 107530,
                          "data": "thức"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 107530,
                          "endTime": 107530,
                          "data": "Tôi"
                      },
                      {
                          "startTime": 107530,
                          "endTime": 107800,
                          "data": "không"
                      },
                      {
                          "startTime": 107800,
                          "endTime": 108060,
                          "data": "muốn"
                      },
                      {
                          "startTime": 108060,
                          "endTime": 108320,
                          "data": "nói"
                      },
                      {
                          "startTime": 108320,
                          "endTime": 108590,
                          "data": "là"
                      },
                      {
                          "startTime": 108590,
                          "endTime": 108850,
                          "data": "mê"
                      },
                      {
                          "startTime": 108850,
                          "endTime": 109610,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 109610,
                          "endTime": 109610,
                          "data": "Mê"
                      },
                      {
                          "startTime": 109610,
                          "endTime": 110610,
                          "data": "say,"
                      },
                      {
                          "startTime": 110610,
                          "endTime": 110860,
                          "data": "mê"
                      },
                      {
                          "startTime": 110860,
                          "endTime": 111670,
                          "data": "say,"
                      },
                      {
                          "startTime": 111670,
                          "endTime": 111920,
                          "data": "mê"
                      },
                      {
                          "startTime": 111920,
                          "endTime": 112720,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 112720,
                          "endTime": 112990,
                          "data": "Mê"
                      },
                      {
                          "startTime": 112990,
                          "endTime": 113780,
                          "data": "say,"
                      },
                      {
                          "startTime": 113780,
                          "endTime": 114050,
                          "data": "mê"
                      },
                      {
                          "startTime": 114050,
                          "endTime": 114850,
                          "data": "say,"
                      },
                      {
                          "startTime": 114850,
                          "endTime": 115110,
                          "data": "mê"
                      },
                      {
                          "startTime": 115110,
                          "endTime": 115910,
                          "data": "say,"
                      },
                      {
                          "startTime": 115910,
                          "endTime": 116170,
                          "data": "mê"
                      },
                      {
                          "startTime": 116170,
                          "endTime": 117190,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 117190,
                          "endTime": 117470,
                          "data": "Tôi"
                      },
                      {
                          "startTime": 117470,
                          "endTime": 117730,
                          "data": "không"
                      },
                      {
                          "startTime": 117730,
                          "endTime": 118000,
                          "data": "muốn"
                      },
                      {
                          "startTime": 118000,
                          "endTime": 118270,
                          "data": "nói"
                      },
                      {
                          "startTime": 118270,
                          "endTime": 118540,
                          "data": "là"
                      },
                      {
                          "startTime": 118540,
                          "endTime": 118790,
                          "data": "mê"
                      },
                      {
                          "startTime": 118790,
                          "endTime": 119520,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 119520,
                          "endTime": 119790,
                          "data": "Mê"
                      },
                      {
                          "startTime": 119790,
                          "endTime": 120580,
                          "data": "say,"
                      },
                      {
                          "startTime": 120580,
                          "endTime": 120840,
                          "data": "mê"
                      },
                      {
                          "startTime": 120840,
                          "endTime": 121640,
                          "data": "say,"
                      },
                      {
                          "startTime": 121640,
                          "endTime": 121910,
                          "data": "mê"
                      },
                      {
                          "startTime": 121910,
                          "endTime": 124300,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 124300,
                          "endTime": 124560,
                          "data": "Nói"
                      },
                      {
                          "startTime": 124560,
                          "endTime": 124830,
                          "data": "thương"
                      },
                      {
                          "startTime": 124830,
                          "endTime": 125090,
                          "data": "nhau"
                      },
                      {
                          "startTime": 125090,
                          "endTime": 125360,
                          "data": "đến"
                      },
                      {
                          "startTime": 125360,
                          "endTime": 125620,
                          "data": "khi"
                      },
                      {
                          "startTime": 125620,
                          "endTime": 125890,
                          "data": "đầu"
                      },
                      {
                          "startTime": 125890,
                          "endTime": 126320,
                          "data": "bạc"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 126320,
                          "endTime": 126460,
                          "data": "Thì"
                      },
                      {
                          "startTime": 126460,
                          "endTime": 126590,
                          "data": "đừng"
                      },
                      {
                          "startTime": 126590,
                          "endTime": 126990,
                          "data": "vì"
                      },
                      {
                          "startTime": 126990,
                          "endTime": 127250,
                          "data": "nhau"
                      },
                      {
                          "startTime": 127250,
                          "endTime": 127520,
                          "data": "bạc"
                      },
                      {
                          "startTime": 127520,
                          "endTime": 127790,
                          "data": "cả"
                      },
                      {
                          "startTime": 127790,
                          "endTime": 128050,
                          "data": "mái"
                      },
                      {
                          "startTime": 128050,
                          "endTime": 128410,
                          "data": "đầu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 128410,
                          "endTime": 128670,
                          "data": "Em"
                      },
                      {
                          "startTime": 128670,
                          "endTime": 128670,
                          "data": "cũng"
                      },
                      {
                          "startTime": 128670,
                          "endTime": 128950,
                          "data": "không"
                      },
                      {
                          "startTime": 128950,
                          "endTime": 129210,
                          "data": "muốn"
                      },
                      {
                          "startTime": 129210,
                          "endTime": 129480,
                          "data": "đôi"
                      },
                      {
                          "startTime": 129480,
                          "endTime": 129740,
                          "data": "mình"
                      },
                      {
                          "startTime": 129740,
                          "endTime": 130010,
                          "data": "phải"
                      },
                      {
                          "startTime": 130010,
                          "endTime": 130490,
                          "data": "sầu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 130490,
                          "endTime": 130760,
                          "data": "Như"
                      },
                      {
                          "startTime": 130760,
                          "endTime": 131020,
                          "data": "là"
                      },
                      {
                          "startTime": 131020,
                          "endTime": 131020,
                          "data": "cực"
                      },
                      {
                          "startTime": 131020,
                          "endTime": 131310,
                          "data": "Bắc"
                      },
                      {
                          "startTime": 131310,
                          "endTime": 131570,
                          "data": "phương"
                      },
                      {
                          "startTime": 131570,
                          "endTime": 131840,
                          "data": "Nam"
                      },
                      {
                          "startTime": 131840,
                          "endTime": 132100,
                          "data": "trái"
                      },
                      {
                          "startTime": 132100,
                          "endTime": 132550,
                          "data": "nhau"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 132550,
                          "endTime": 132830,
                          "data": "Về"
                      },
                      {
                          "startTime": 132830,
                          "endTime": 133080,
                          "data": "câu"
                      },
                      {
                          "startTime": 133080,
                          "endTime": 133320,
                          "data": "chuyện"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 133320,
                          "endTime": 133450,
                          "data": "Mà"
                      },
                      {
                          "startTime": 133450,
                          "endTime": 133590,
                          "data": "chẳng"
                      },
                      {
                          "startTime": 133590,
                          "endTime": 133730,
                          "data": "phải"
                      },
                      {
                          "startTime": 133730,
                          "endTime": 133990,
                          "data": "đi"
                      },
                      {
                          "startTime": 133990,
                          "endTime": 134260,
                          "data": "tới"
                      },
                      {
                          "startTime": 134260,
                          "endTime": 134610,
                          "data": "đâu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 134610,
                          "endTime": 134750,
                          "data": "Vì"
                      },
                      {
                          "startTime": 134750,
                          "endTime": 134880,
                          "data": "em"
                      },
                      {
                          "startTime": 134880,
                          "endTime": 135010,
                          "data": "không"
                      },
                      {
                          "startTime": 135010,
                          "endTime": 135370,
                          "data": "muốn"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 135370,
                          "endTime": 135640,
                          "data": "Bên"
                      },
                      {
                          "startTime": 135640,
                          "endTime": 135770,
                          "data": "nhau"
                      },
                      {
                          "startTime": 135770,
                          "endTime": 136050,
                          "data": "bạc"
                      },
                      {
                          "startTime": 136050,
                          "endTime": 136310,
                          "data": "mái"
                      },
                      {
                          "startTime": 136310,
                          "endTime": 136810,
                          "data": "đầu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 136810,
                          "endTime": 137070,
                          "data": "Em"
                      },
                      {
                          "startTime": 137070,
                          "endTime": 137200,
                          "data": "cũng"
                      },
                      {
                          "startTime": 137200,
                          "endTime": 137340,
                          "data": "không"
                      },
                      {
                          "startTime": 137340,
                          "endTime": 137600,
                          "data": "muốn"
                      },
                      {
                          "startTime": 137600,
                          "endTime": 137870,
                          "data": "đôi"
                      },
                      {
                          "startTime": 137870,
                          "endTime": 138130,
                          "data": "mình"
                      },
                      {
                          "startTime": 138130,
                          "endTime": 138400,
                          "data": "phải"
                      },
                      {
                          "startTime": 138400,
                          "endTime": 138930,
                          "data": "sầu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 138930,
                          "endTime": 139060,
                          "data": "Như"
                      },
                      {
                          "startTime": 139060,
                          "endTime": 139200,
                          "data": "là"
                      },
                      {
                          "startTime": 139200,
                          "endTime": 139460,
                          "data": "cực"
                      },
                      {
                          "startTime": 139460,
                          "endTime": 139730,
                          "data": "Bắc"
                      },
                      {
                          "startTime": 139730,
                          "endTime": 139990,
                          "data": "phương"
                      },
                      {
                          "startTime": 139990,
                          "endTime": 140260,
                          "data": "Nam"
                      },
                      {
                          "startTime": 140260,
                          "endTime": 140520,
                          "data": "trái"
                      },
                      {
                          "startTime": 140520,
                          "endTime": 141030,
                          "data": "nhau"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 141030,
                          "endTime": 141300,
                          "data": "Về"
                      },
                      {
                          "startTime": 141300,
                          "endTime": 141560,
                          "data": "câu"
                      },
                      {
                          "startTime": 141560,
                          "endTime": 141660,
                          "data": "chuyện"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 141660,
                          "endTime": 141810,
                          "data": "Mà"
                      },
                      {
                          "startTime": 141810,
                          "endTime": 141930,
                          "data": "chẳng"
                      },
                      {
                          "startTime": 141930,
                          "endTime": 142070,
                          "data": "phải"
                      },
                      {
                          "startTime": 142070,
                          "endTime": 142330,
                          "data": "đi"
                      },
                      {
                          "startTime": 142330,
                          "endTime": 142600,
                          "data": "tới"
                      },
                      {
                          "startTime": 142600,
                          "endTime": 142820,
                          "data": "đâu"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 142820,
                          "endTime": 142950,
                          "data": "Vì"
                      },
                      {
                          "startTime": 142950,
                          "endTime": 143090,
                          "data": "em"
                      },
                      {
                          "startTime": 143090,
                          "endTime": 143350,
                          "data": "không"
                      },
                      {
                          "startTime": 143350,
                          "endTime": 143480,
                          "data": "muốn"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 143480,
                          "endTime": 143620,
                          "data": "Kìa"
                      },
                      {
                          "startTime": 143620,
                          "endTime": 144150,
                          "data": "bóng"
                      },
                      {
                          "startTime": 144150,
                          "endTime": 144550,
                          "data": "dáng"
                      },
                      {
                          "startTime": 144550,
                          "endTime": 145010,
                          "data": "ai"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 145010,
                          "endTime": 145280,
                          "data": "Vụt"
                      },
                      {
                          "startTime": 145280,
                          "endTime": 145540,
                          "data": "qua"
                      },
                      {
                          "startTime": 145540,
                          "endTime": 145830,
                          "data": "đây,"
                      },
                      {
                          "startTime": 145830,
                          "endTime": 146090,
                          "data": "vụt"
                      },
                      {
                          "startTime": 146090,
                          "endTime": 146360,
                          "data": "qua"
                      },
                      {
                          "startTime": 146360,
                          "endTime": 147430,
                          "data": "đây"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 147430,
                          "endTime": 147950,
                          "data": "Mà"
                      },
                      {
                          "startTime": 147950,
                          "endTime": 148220,
                          "data": "ai"
                      },
                      {
                          "startTime": 148220,
                          "endTime": 148750,
                          "data": "thao"
                      },
                      {
                          "startTime": 148750,
                          "endTime": 149280,
                          "data": "thức"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 149280,
                          "endTime": 149280,
                          "data": "Cả"
                      },
                      {
                          "startTime": 149280,
                          "endTime": 149550,
                          "data": "đêm"
                      },
                      {
                          "startTime": 149550,
                          "endTime": 150080,
                          "data": "ngày,"
                      },
                      {
                          "startTime": 150080,
                          "endTime": 150340,
                          "data": "cả"
                      },
                      {
                          "startTime": 150340,
                          "endTime": 150610,
                          "data": "đêm"
                      },
                      {
                          "startTime": 150610,
                          "endTime": 151670,
                          "data": "ngày"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 151670,
                          "endTime": 151930,
                          "data": "Kìa"
                      },
                      {
                          "startTime": 151930,
                          "endTime": 152470,
                          "data": "bóng"
                      },
                      {
                          "startTime": 152470,
                          "endTime": 153000,
                          "data": "dáng"
                      },
                      {
                          "startTime": 153000,
                          "endTime": 153260,
                          "data": "ai"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 153260,
                          "endTime": 153530,
                          "data": "Vụt"
                      },
                      {
                          "startTime": 153530,
                          "endTime": 153790,
                          "data": "qua"
                      },
                      {
                          "startTime": 153790,
                          "endTime": 154330,
                          "data": "đây,"
                      },
                      {
                          "startTime": 154330,
                          "endTime": 154590,
                          "data": "vụt"
                      },
                      {
                          "startTime": 154590,
                          "endTime": 154860,
                          "data": "qua"
                      },
                      {
                          "startTime": 154860,
                          "endTime": 155920,
                          "data": "đây"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 155920,
                          "endTime": 156180,
                          "data": "Mà"
                      },
                      {
                          "startTime": 156180,
                          "endTime": 156720,
                          "data": "ai"
                      },
                      {
                          "startTime": 156720,
                          "endTime": 156980,
                          "data": "thao"
                      },
                      {
                          "startTime": 156980,
                          "endTime": 157510,
                          "data": "thức"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 157510,
                          "endTime": 157780,
                          "data": "Tôi"
                      },
                      {
                          "startTime": 157780,
                          "endTime": 158040,
                          "data": "không"
                      },
                      {
                          "startTime": 158040,
                          "endTime": 158310,
                          "data": "muốn"
                      },
                      {
                          "startTime": 158310,
                          "endTime": 158580,
                          "data": "nói"
                      },
                      {
                          "startTime": 158580,
                          "endTime": 158840,
                          "data": "là"
                      },
                      {
                          "startTime": 158840,
                          "endTime": 158840,
                          "data": "mê"
                      },
                      {
                          "startTime": 158840,
                          "endTime": 159650,
                          "data": "say"
                      }
                  ]
              },
              {
                  "words": [
                      {
                          "startTime": 159650,
                          "endTime": 159920,
                          "data": "Mê"
                      },
                      {
                          "startTime": 159920,
                          "endTime": 160920,
                          "data": "say"
                      }
                  ]
              }
          ],
          "file": "https://static-zmp3.zmdcdn.me/lyrics/d/e/f/7/def789e49e5e3c0fd493e4efd6bed570.lrc",
          "enabledVideoBG": true,
          "defaultIBGUrls": [
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/2/b/6/d/2b6d42c84a31bdf884ba2400a993ec44.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/6/5/9/3659c15496eccc463d55660ad1fc0a4a.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/0/b/8/30b8a653a0416eba61f08a92e6f994cc.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/2/9/e/e/29ee66c582128a583d38cfc7a6ef37bd.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/c/b/1/7/cb17ce4585b0a65377787b06006744d7.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/4/3/c/2/43c23c9ef853539504cf96a70aecf231.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/f/6/6/4/f664360fa6303d2ccf31d773821e1bb4.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/a/0/0/9/a0091e927022e64f5b3352eb03007d10.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/c/9/7/3c97a9e39977ec349309f230ec0042ed.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/c/d/2/3cd27fa7e14f206234c0366e6ca0f076.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/9/2/d/1/92d1d10e51f52480ff524b1d368141ea.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/1/8/b/a/18ba461bddaa78421ffafa0b11a2afc6.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/8/3/c/e83c1224eec3ab7e09d42a439943fe30.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/e/3/f/8/e3f8293e94fb9817a6e0425bd5a097c1.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/0/4/0/5/040563d78ea9153bfc6278abda9631c5.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/7/5/2/6/752633adadc9df0b71ac57290c5e7f3c.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/1/b/8/6/1b86f887c0258258de826d4e35d4889f.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/c/b/d/4/cbd489c9790e544cf8995abcb5eb44e5.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/c/0/2/3/c023c6f3c26008662a1bd7c11b6530e2.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/f/4/a/2/f4a2a0dd740498451c427fec611e6edf.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/b/f/d/d/bfdd6a9aca52b4a4b745a80a292caeaf.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/5/e/c/e/5ece70b2dc27ee42180e9144e7697d39.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/9/6/6/3966a6edfb9810d50617ed59a1d7ea9f.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/a/8/d/b/a8dbf25d04e3a0f4df24f568ccebae2c.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/7/4/8/d/748da7bbaf9c31b24bf3be9995cbb979.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/f/0/7/7/f077e99b212e3b9a2afa16f479f680c2.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/2/5/5/2/2552084b67f1fc9496763b0e2a367b7a.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/3/3/e/8/33e8a476aee500a846d3b86868e80b05.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/8/e/8/f/8e8fd5d34183107f5be3025d9320121c.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/8/6/3/9/8639b3b6bd0c0e286175dd8519952d43.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/d/b/4/5/db45316e6d6789b72ab2e55570be19b7.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/7/1/9/4/719488ac45e5d18e8985f6cd5ee3fe52.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/c/d/e/a/cdeabb747cfd947916d1f14482372fe8.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/7/8/f/6/78f6cf444ef070a38924351b1a70a89b.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/a/c/a/b/acab3cf9839e05ab2eb0719a329fcd5e.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/0/0/c/f/00cf8bd1fe53f225bb8f493441126e6f.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/c/d/b/1/cdb11a946962f59be1aea9f688117d51.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/8/1/9/0/8190df4138926efe9247bf060ea96169.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/7/d/8/e/7d8ec16dd557a7c5130ad4f651b39fce.jpg",
              "https://photo-resize-zmp3.zmdcdn.me/w1920_r3x2_jpeg/cover/c/0/d/2/c0d2f71e5fcd6e4c6efc59a61c0c6654.jpg"
          ],
          "BGMode": 0
      },
      "timestamp": 1695700932915
  }
    `,
];

var nextMusic = document.querySelector(".forward-right");
var prevMusic = document.querySelector(".forward-left");
var musicName = document.querySelector(".music-name");
var playListMusic = document.querySelector(".play-list");
var playItems = playListMusic.querySelectorAll(".play-item");
var playItemImage = document.querySelector(".play-item-image");
var itemName = document.querySelector(".item-name");
var repeat = document.querySelector(".repeat-music");
var downloadMusic = document.querySelector(".download-music");
var downloadLink = document.querySelector(".link-download");
var lyric = lyricList[0];
lyric = JSON.parse(lyric).data.sentences;
var countName = 0;

nextMusic.addEventListener("click", function () {
  if (count < playList.length - 1) {
    musicImage.children[0].src = imageList[++count];
    audio.src = playList[count];
    musicName.innerText = musicNameList[count];
    progress.style.width = 0;
    playBtn.innerHTML = playIcon;
    audio.currentTime = 0;
    currentTimeUpdate = 0;
    value = 0;
    musicImage.classList.remove("effect");
    playListMusic.children[count].classList.add("select-music");
    playListMusic.children[count].previousElementSibling.classList.remove(
      "select-music"
    );
    downloadLink.href = downloadLinks[count];
    lyric = lyricList[count];
    lyric = JSON.parse(lyric).data.sentences;
    countName = count;
  }
});
prevMusic.addEventListener("click", function () {
  if (count > 0) {
    musicImage.children[0].src = imageList[--count];
    audio.src = playList[count];
    musicName.innerText = musicNameList[count];
    progress.style.width = 0;
    playBtn.innerHTML = playIcon;
    audio.currentTime = 0;
    currentTimeUpdate = 0;
    value = 0;
    musicImage.classList.remove("effect");
    playListMusic.children[count].classList.add("select-music");
    playListMusic.children[count].nextElementSibling.classList.remove(
      "select-music"
    );
    downloadLink.href = downloadLinks[count];
    lyric = lyricList[count];
    lyric = JSON.parse(lyric).data.sentences;
    countName = count;
  }
});

// console.log(playItems);

playItems.forEach(function (item, index) {
  var temp = item;
  item.addEventListener("click", function () {
    item.classList.add("select-music");
    playItems.forEach(function (item) {
      if (item !== temp) {
        if (item.classList.contains("select-music")) {
          item.classList.remove("select-music");
        }
      }
    });
    musicImage.children[0].src = imageList[index];
    audio.src = playList[index];
    musicName.innerText = musicNameList[index];
    progress.style.width = 0;
    playBtn.innerHTML = playIcon;
    audio.currentTime = 0;
    currentTimeUpdate = 0;
    value = 0;
    musicImage.classList.remove("effect");
    downloadLink.href = downloadLinks[index];
    count = index;
    lyric = lyricList[count];
    lyric = JSON.parse(lyric).data.sentences;
    countName = count;
  });
});

repeat.addEventListener("click", function () {
  if (repeat.style.color === "") {
    repeat.style.color = "#c850c0";
    repeatCheck = true;
  } else {
    repeat.style.color = "";
    repeatCheck = false;
  }
});

downloadMusic.addEventListener("click", function () {
  downloadLink.click();
  // console.log('huy');
});

var karaoke = document.querySelector(".karaoke");
var playKaraoke = document.querySelector(".play-karaoke");
var closeKaraoke = document.querySelector(".close-karaoke");
var karaokeContent = document.querySelector(".karaoke-content");

playKaraoke.addEventListener("click", function () {
  karaoke.classList.add("show");
});
closeKaraoke.addEventListener("click", function () {
  karaoke.classList.remove("show");
});

var countMinute = 0;

var getSentences = function (index) {
  return lyric[index].words
    .map(function (word) {
      return `<span>${word.data}<span>${word.data}</span></span>`;
    })
    .join(" ");
};

var currentIndex = -1;

var renderSentences = function () {
  var currentTime = audio.currentTime * 1000;
  var index = lyric.findIndex(function (item) {
    return (
      currentTime >= item.words[0].startTime &&
      currentTime <= item.words[item.words.length - 1].endTime
    );
  });
  if (index !== -1) {
    var indexWord = lyric[index].words.findIndex(function (item) {
      return currentTime >= item.startTime && currentTime <= item.endTime;
    });
    var rate;
    var wordTime =
      lyric[index].words[indexWord].endTime -
      lyric[index].words[indexWord].startTime;
    var runTime = currentTime - lyric[index].words[indexWord].startTime;
    rate = (runTime * 100) / wordTime;
    rate = Math.ceil(rate) + 2;
    if (index !== currentIndex) {
      currentIndex = index;
      if (index === 0) {
        var first = getSentences(index);
        karaokeContent.children[0].innerHTML = first;
        if (index < lyric.length - 1) {
          var second = getSentences(index + 1);
          karaokeContent.children[1].innerHTML = second;
        }
        karaokeContent.children[0].children[
          indexWord
        ].children[0].style.width = `${rate}%`;
        // karaokeContent.children[0].children[indexWord].style.width = `${rate}%`;
      } else {
        if (index % 2 !== 0) {
          var second = getSentences(index);
          karaokeContent.children[1].innerHTML = second;
          if (index < lyric.length - 1) {
            karaokeContent.children[0].style.opacity = 0;
            var first = getSentences(index + 1);
            setTimeout(function () {
              karaokeContent.children[0].innerHTML = first;
              karaokeContent.children[0].style.opacity = 1;
            }, 800);
          }
          karaokeContent.children[1].children[
            indexWord
          ].children[0].style.width = `${rate}%`;
        } else {
          var first = getSentences(index);
          karaokeContent.children[0].innerHTML = first;
          if (index < lyric.length - 1) {
            karaokeContent.children[1].style.opacity = 0;
            var second = getSentences(index + 1);
            setTimeout(function () {
              karaokeContent.children[1].innerHTML = second;
              karaokeContent.children[1].style.opacity = 1;
            }, 800);
          }
          karaokeContent.children[0].children[
            indexWord
          ].children[0].style.width = `${rate}%`;
        }
      }
    } else {
      if (index % 2 === 0) {
        karaokeContent.children[0].children[
          indexWord
        ].children[0].style.width = `${rate}%`;
      } else {
        karaokeContent.children[1].children[
          indexWord
        ].children[0].style.width = `${rate}%`;
      }
    }
    if (indexWord > 0) {
      if (
        lyric[index].words[indexWord - 1].startTime ===
        lyric[index].words[indexWord - 1].endTime
      ) {
        rate = 100;
        if (index % 2 === 0) {
          karaokeContent.children[0].children[
            indexWord - 1
          ].children[0].style.width = `${rate}%`;
        } else {
          karaokeContent.children[1].children[
            indexWord - 1
          ].children[0].style.width = `${rate}%`;
        }
      }
    }
  } else {
    countMinute++;
    if (countMinute >= 100) {
      karaokeContent.children[0].innerText = `${musicNameList[countName]}`;
      karaokeContent.children[1].innerText = `Ca sỹ: ${singers[countName]}`;
      countMinute = 0;
    }
  }
};
