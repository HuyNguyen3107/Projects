import { client } from "./client.js";
import { config } from "./config.js";
const { SERVER_API_AUTH } = config;

client.setUrl(SERVER_API_AUTH);
const stripHtml = (html) => html.replace(/(<([^>]+)>)/gi, "");

const loading = document.querySelector(".loading");
const alertDiv = document.querySelector(".alert");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress-bar");
const alertContent = document.querySelector(".alert-content");

let time = 100;
let checkRender = true;
let timeList = [];

const handleProgress = function () {
  setTimeout(function () {
    while (time > 0) {
      time -= 2;
      progress.style.width = `${time}%`;
      setTimeout(function () {
        handleProgress();
      }, 2000);
    }
  }, 2000);
  if (time === 0) {
    setTimeout(function () {
      time = 100;
      alertDiv.style.transform = "";
      progress.style.width = "";
      return;
    }, 2000);
  }
};

const blog = {
  root: document.querySelector("#root #blog"),
  isLogin: function () {
    const status =
      localStorage.getItem("access_token") ||
      localStorage.getItem("refresh_token")
        ? true
        : false;

    return status;
  },
  render: function () {
    if (blog.isLogin()) {
      blog.getProfile().then((user) => {
        if (user) {
          loading.style.display = "";
          let html;
          html = `
        <div class="logged-in-page">
        <div class="user-control">
            <div class="post-new">
                <h1 class="heading">Blogger</h1>
                <div class="info-user-main">
                    <div class="avatar"><a href="#">${stripHtml(
                      user.data.name.charAt(0)
                    )}</a></div>
                    <div class="user-name"><a href="#">${stripHtml(
                      user.data.name
                    )}</a></div>
                </div>
                <form action="">
                    <div class="title-field">
                        <label for="title">Enter Your Title</label>
                        <input type="text" placeholder="Please enter the title" id="title" required>
                    </div>
                    <div class="content-field">
                        <label for="content">Enter Your Content</label>
                        <textarea name="content" id="content" cols="30" rows="10"
                            placeholder="Please enter your content" style="resize: none;"></textarea>
                    </div>
                    <div class="time-field">
                    <label for="time-post">Set time to post!</label>
                    <input type="text" placeholder="MM/DD/YYYY" id="time-post" disabled>
                    <i class="fa-regular fa-calendar"></i>
                    <div class="calendar-container">
                        <div class="wrapper">
                            <div class="calendar-header">
                                <div class="present">
                                <p class="current-date"></p>
                                <i class="fa-solid fa-sort-down"></i>
                                </div>
                                <div class="icons">
                                    <span id="prev">
                                        <i class="fa-solid fa-chevron-left"></i>
                                    </span>
                                    <span id="next">
                                        <i class="fa-solid fa-chevron-right"></i>
                                    </span>
                                </div>
                                <ul class="years"></ul>
                            </div>
                            <div class="calendar">
                                <ul class="weeks">
                                    <li>Sun</li>
                                    <li>Mon</li>
                                    <li>Tue</li>
                                    <li>Wed</li>
                                    <li>Thu</li>
                                    <li>Fri</li>
                                    <li>Sat</li>
                                </ul>
                                <ul class="days"></ul>
                            </div>
                        </div>
                    </div>
                    </div>
                    <button class="btn-post-new">Write new!</button>
                </form>
            </div>
            <div><button class="btn-logout">Sign out</button></div>
        </div>
    </div>
        `;
          blog.root.innerHTML = html;
          blog.renderPosts();
          blog.handlePost();
          blog.handleLogout();
          blog.handleCalender();
          blog.handleMainProfile(user.data);
        }
      });
    } else {
      loading.style.display = "";
      let html;
      html = `
          <div class="page-start">
          <h1 class="heading">Blogger</h1>
          <button class="sign-in">Sign in</button>
      </div>
          `;
      this.root.innerHTML = html;
      this.signIn();
      blog.renderPosts();
    }
  },
  signIn: async function () {
    const signIn = document.querySelector(".sign-in");
    signIn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      let html;
      html = `
        <div class="sign-in-page">
        <div class="sign-in-note">
            <span class="note-title">Đăng nhập</span>
            <p class="note-content">
                Hãy nhập email và mật khẩu của bạn để truy cập vào nền tảng Blogger, nơi bạn có thể tạo và chia
                sẻ
                những bài viết độc đáo của mình. Nếu bạn chưa có tài khoản, hãy <a class="go-signup"
                    href="#">đăng ký ngay</a> để tham gia cộng đồng
                Blogger
            </p>
            <a class="go-home" href="#">Về trang chủ</a>
        </div>
        <div class="sign-in-form">
            <form action="">
                <div class="email-field">
                    <label for="email">Enter Your Email</label>
                    <input type="email" placeholder="Please enter the email" id="email" required>
                </div>
                <div class="password-field">
                    <label for="password">Enter Your Password</label>
                    <input type="password" placeholder="Please enter the password" id="password" required>
                </div>
                <div class="btn-list">
                    <button class="btn-sign-in">Sign in</button>
                    <button class="btn-sign-up">Sign up</button>
                </div>
            </form>
        </div>
    </div>
        `;
      blog.root.innerHTML = html;
      blog.signUp();
      //   blog.alertError();
      blog.login();
    });
  },
  signUp: async function () {
    const btnSignUp = document.querySelector(".btn-sign-up");
    const goSignUp = document.querySelector(".go-signup");
    const goHome = document.querySelector(".go-home");

    goHome.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      blog.render();
    });

    btnSignUp.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.preventDefault();
      let html;
      html = `
        <div class="sign-up-page">
        <div class="sign-up-note">
            <span class="note-title">Đăng ký</span>
            <p class="note-content">
                Bạn muốn tham gia cộng đồng Blogger, nơi bạn có thể tạo và chia sẻ những bài viết độc đáo của
                mình? Hãy điền thông tin của bạn vào biểu mẫu dưới đây để tạo tài khoản miễn phí. Bạn sẽ nhận
                được nhiều ưu đãi, thông tin mới nhất và cơ hội giao lưu với những blogger khác khi đăng ký.
                Đừng bỏ lỡ cơ hội này, hãy đăng ký ngay! Nếu bạn đã có tài khoản, <a class="go-signin"
                    href="#">Đăng nhập ngay!</a>
            </p>
            <a class="go-home" href="#">Về trang chủ</a>
        </div>
        <div class="sign-up-form">
            <form action="">
                <div class="name-field">
                    <label for="name">Enter Your Name</label>
                    <input type="text" placeholder="Please enter the name" id="name" required>
                </div>
                <div class="email-field">
                    <label for="email">Enter Your Email</label>
                    <input type="email" placeholder="Please enter the email" id="email" required>
                </div>
                <div class="password-field">
                    <label for="password">Enter Your Password</label>
                    <input type="password" placeholder="Please enter the password" id="password" required>
                </div>
                <div class="btn-list">
                    <button class="btn-sign-up">Sign up</button>
                </div>
            </form>
        </div>
    </div>
        `;
      blog.root.innerHTML = html;
      const goHome = document.querySelector(".go-home");

      goHome.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        blog.render();
      });
      blog.backLogin();
      blog.handleSignUp();
    });
    goSignUp.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      let html;
      html = `
          <div class="sign-up-page">
          <div class="sign-up-note">
              <span class="note-title">Đăng ký</span>
              <p class="note-content">
                  Bạn muốn tham gia cộng đồng Blogger, nơi bạn có thể tạo và chia sẻ những bài viết độc đáo của
                  mình? Hãy điền thông tin của bạn vào biểu mẫu dưới đây để tạo tài khoản miễn phí. Bạn sẽ nhận
                  được nhiều ưu đãi, thông tin mới nhất và cơ hội giao lưu với những blogger khác khi đăng ký.
                  Đừng bỏ lỡ cơ hội này, hãy đăng ký ngay! Nếu bạn đã có tài khoản, <a class="go-signin"
                      href="#">Đăng nhập ngay!</a>
              </p>
              <a class="go-home" href="#">Về trang chủ</a>
          </div>
          <div class="sign-up-form">
              <form action="">
                  <div class="name-field">
                      <label for="name">Enter Your Name</label>
                      <input type="text" placeholder="Please enter the name" id="name" required>
                  </div>
                  <div class="email-field">
                      <label for="email">Enter Your Email</label>
                      <input type="email" placeholder="Please enter the email" id="email" required>
                  </div>
                  <div class="password-field">
                      <label for="password">Enter Your Password</label>
                      <input type="password" placeholder="Please enter the password" id="password" required>
                  </div>
                  <div class="btn-list">
                      <button class="btn-sign-up">Sign up</button>
                  </div>
              </form>
          </div>
      </div>
          `;
      blog.root.innerHTML = html;
      const goHome = document.querySelector(".go-home");

      goHome.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        blog.render();
      });
      blog.backLogin();
      blog.handleSignUp();
    });
  },
  alertError: function (msg) {
    alertDiv.style.backgroundColor = "red";
    progressBar.style.backgroundColor = "red";
    progress.style.backgroundColor = "green";
    alertContent.innerText = msg;
    alertDiv.style.transform = "translateX(0)";
    handleProgress();
  },
  alertSuccess: function (msg) {
    alertDiv.style.backgroundColor = "green";
    progressBar.style.backgroundColor = "green";
    progress.style.backgroundColor = "yellow";
    alertContent.innerText = msg;
    alertDiv.style.transform = "translateX(0)";
    handleProgress();
  },
  login: function () {
    const btnSignIn = document.querySelector(".btn-sign-in");

    btnSignIn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const emailEl = document.querySelector("#email");
      const passwordEl = document.querySelector("#password");
      const email = emailEl.value;
      const password = passwordEl.value;
      blog.handleLogin({ email, password });
    });
  },
  handleLogin: async function (data) {
    try {
      if (!(data.email || data.password)) {
        throw new Error("Vui lòng nhập đủ các trường");
      }
      loading.style.display = "flex";
      const { response, data: token } = await client.post("/auth/login", data);
      if (response.ok) {
        localStorage.setItem("access_token", token.data.accessToken);
        localStorage.setItem("refresh_token", token.data.refreshToken);
        client.setToken(token.data.accessToken);
        // loading.style.display = "";
        blog.render();
      } else {
        loading.style.display = "";
        document.querySelector("#email").value = "";
        document.querySelector("#password").value = "";
        throw new Error("Tài khoản không tồn tại");
      }
    } catch (e) {
      blog.alertError(e.message);
    }
  },
  backLogin: function () {
    const goSignIn = document.querySelector(".go-signin");
    goSignIn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      let html;
      html = `
        <div class="sign-in-page">
        <div class="sign-in-note">
            <span class="note-title">Đăng nhập</span>
            <p class="note-content">
                Hãy nhập email và mật khẩu của bạn để truy cập vào nền tảng Blogger, nơi bạn có thể tạo và chia
                sẻ
                những bài viết độc đáo của mình. Nếu bạn chưa có tài khoản, hãy <a class="go-signup"
                    href="#">đăng ký ngay</a> để tham gia cộng đồng
                Blogger
            </p>
            <a class="go-home" href="#">Về trang chủ</a>
        </div>
        <div class="sign-in-form">
            <form action="">
                <div class="email-field">
                    <label for="email">Enter Your Email</label>
                    <input type="email" placeholder="Please enter the email" id="email" required>
                </div>
                <div class="password-field">
                    <label for="password">Enter Your Password</label>
                    <input type="password" placeholder="Please enter the password" id="password" required>
                </div>
                <div class="btn-list">
                    <button class="btn-sign-in">Sign in</button>
                    <button class="btn-sign-up">Sign up</button>
                </div>
            </form>
        </div>
    </div>
        `;
      blog.root.innerHTML = html;
      blog.signUp();
      blog.login();
    });
  },
  handleSignUp: async function () {
    const btnSignUp = document.querySelector(".btn-sign-up");
    btnSignUp.addEventListener("click", async function (e) {
      e.preventDefault();
      e.stopPropagation();
      btnSignUp.disabled = true;
      btnSignUp.style.cursor = "not-allowed";
      btnSignUp.style.transform = "scale(1)";
      const emailEl = document.querySelector("#email");
      const passwordEl = document.querySelector("#password");
      const nameEl = document.querySelector("#name");

      const email = emailEl.value;
      const password = passwordEl.value;
      const name = nameEl.value;

      let check1 = false;
      let check2 = false;
      let check3 = false;
      try {
        if (!(email || name || password)) {
          throw new Error("Vui lòng nhập đủ các trường");
        }
        if (!email.includes("@")) {
          throw new Error("Email không hợp lệ");
        }
        for (let i = 0; i < password.length; i++) {
          if (password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) {
            check1 = true;
          }
          if (password.charCodeAt(i) >= 97 && password.charCodeAt(i) <= 122) {
            check2 = true;
          }
          if (password.charCodeAt(i) >= 48 && password.charCodeAt(i) <= 57) {
            check3 = true;
          }
          if (i === password.length - 1) {
            if (!(check1 && check2 && check3)) {
              throw new Error(
                "Mật khẩu phải chứa ít nhất một chữ thường, một chữa hoa và một số"
              );
            }
          }
        }
        const { response } = await client.post("/auth/register", {
          email,
          password,
          name,
        });
        if (response.ok) {
          blog.alertSuccess("Đăng kí tài khoản thành công");
          nameEl.value = "";
          passwordEl.value = "";
          emailEl.value = "";
          btnSignUp.disabled = false;
          btnSignUp.style.cursor = "";
          btnSignUp.style.transform = "";
          setTimeout(function () {
            document.querySelector(".go-signin").click();
          }, 3000);
        } else {
          btnSignUp.disabled = false;
          throw new Error("Tài khoản đã tồn tại");
        }
      } catch (e) {
        btnSignUp.disabled = false;
        btnSignUp.style.cursor = "";
        btnSignUp.style.transform = "";
        blog.alertError(e.message);
      }
    });
  },
  handleLogout: function () {
    const btnLogout = document.querySelector(".btn-logout");
    btnLogout.addEventListener("click", async function (e) {
      e.preventDefault();
      e.stopPropagation();
      loading.style.display = "flex";
      const { response } = await client.post("/auth/logout", {});
      if (response.ok) {
        loading.style.display = 'flex';
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        client.token = null;
        blog.render();
      } else {
        blog.handleRefreshToken().then(async () => {
          const { response } = await client.post("/auth/logout", {});
          if (response.ok) {
            loading.style.display = 'flex';
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            client.token = null;
            blog.render();
          }
        });
      }
    });
  },
  //   getPosts: async function () {
  //     const { response, data } = client.get(`/blogs/get`);
  //   },
  renderPosts: async function () {
    // console.log('ok');
    timeList = [];
    const { response, data: posts } = await client.get("/blogs");
    // console.log('ok');
    if (response.ok) {
      let titleList = [];
      let contentList = [];
      let nameList = [];
      let listTime = [];
      let infoList = [];
      const postsEl = document.createElement("div");
      postsEl.classList.add("posts");
      posts.data.forEach(function (post) {
        const contentShow = post.content.slice(0, post.content.length / 2);
        const time = new Date(post.createdAt);
        const timeBefore = blog.handleTime(time);
        timeList.push(time);
        const postEl = document.createElement("div");
        postEl.classList.add("post");
        postEl.innerHTML = `
      <div class="posts">
      <div class="post">
          <div class="time">
              <div class="time-detail">
                  <span class="preiod">${timeBefore}
                      <span></span>
                  </span>
                  <div class="time-post">
                      <span class="hours">${time.getHours()} h</span>
                       <span class="minutes">${time.getMinutes()} minutes</span>
                  </div>
              </div>
              <span class="tag-name">@${stripHtml(post.userId.name)}</span>
          </div>
          <div class="post-detail">
              <div class="info-user">
                  <div class="avatar"><a href="#">${stripHtml(
                    post.userId.name.charAt(0)
                  )}</a></div>
                  <div class="user-name"><a href="#">${stripHtml(
                    post.userId.name
                  )}</a></div>
              </div>
              <h2 class="title">${stripHtml(post.title)}</h2>
              <p class="post-content">
                  ${blog.handleRegex(stripHtml(contentShow))}...
              </p>
              <div class="view-detail-post"><a href="#"># view more ${stripHtml(
                post.title.charAt(0)
              )}...</a></div>
              <div class="post-footer">
                  <div class="user-profile"><a href="#"># ${stripHtml(
                    post.userId.name
                  )}</a></div>
                  <div class="read-time">Khoảng ${blog.randomNum()} giây đọc</div>
              </div>
          </div>
      </div>
  </div>
      `;
        postsEl.append(postEl);
        titleList.push(post.title);
        contentList.push(post.content);
        nameList.push(post.userId.name);
        listTime.push(post.createdAt);
        infoList.push(post.userId);
      });
      blog.root.append(postsEl);
      setInterval(function () {
        blog.updatePeriod();
      }, 60000);
      blog.handleViewDetail(
        titleList,
        contentList,
        nameList,
        listTime,
        null,
        infoList
      );
      blog.handleViewProfile(infoList);
    }
  },
  renderPost: async function (name, title, content, time, userId) {
    const contentShow = content.slice(0, content.length / 2);
    timeList.unshift(time);
    const postsEl = document.querySelector(".posts");
    const postEl = document.createElement("div");
    const currentTime = new Date(time);
    const timeBefore = blog.handleTime(currentTime);
    postEl.classList.add("post");
    console.log(currentTime.getHours(), currentTime.getMinutes());
    postEl.innerHTML = `
    <div class="posts">
    <div class="post">
        <div class="time">
            <div class="time-detail">
                <span class="preiod">${timeBefore}
                    <span></span>
                </span>
                <div class="time-post">
                    <span class="hours">${currentTime.getHours()} h</span>
                     <span class="minutes">${currentTime.getMinutes()} minutes</span>
                </div>
            </div>
            <span class="tag-name">@${stripHtml(name)}</span>
        </div>
        <div class="post-detail">
            <div class="info-user">
                <div class="avatar"><a href="#">${stripHtml(
                  name.charAt(0)
                )}</a></div>
                <div class="user-name"><a href="#">${stripHtml(name)}</a></div>
            </div>
            <h2 class="title">${stripHtml(title)}</h2>
            <p class="post-content">
                ${blog.handleRegex(stripHtml(contentShow))}...
            </p>
            <div class="view-detail-post"><a href="#"># view more ${stripHtml(
              title.charAt(0)
            )}...</a></div>
            <div class="post-footer">
                <div class="user-profile"><a href="#"># ${stripHtml(
                  name
                )}</a></div>
                <div class="read-time">Khoảng ${blog.randomNum()} giây đọc</div>
            </div>
        </div>
    </div>
</div>
    `;
    postsEl.prepend(postEl);
    const detailPost = document.querySelector(".view-detail-post");
    detailPost.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      let html;
      html = `
      <div class="post-detail-page">
      <div class="post-detail-title">
          ${stripHtml(title)}
      </div>
      <div class="post-detail-content">
          ${blog.handleRegex(stripHtml(content))}
      </div>
      <div class="user-profile"><a href="#"># ${name}</a></div>
      <div class="post-detail-line"></div>
      <div class="period-time">${blog.handleTime(time)}</div>
      <div class="time-detail">${blog.formatDate(time)}</div>
      <button class="btn-go-home">Go Home Page</button>
  </div>
      `;
      blog.root.innerHTML = html;
      blog.handleGoHome();
    });
    const infoUser = document.querySelector(".info-user");
    const userProfile = document.querySelector(".user-profile");
    const { response, data: profile } = await client.get(
      `/users/${userId._id}`
    );
    let titleList = [];
    let contentList = [];
    let nameList = [];
    let listTime = [];

    let titleList2 = [];
    let contentList2 = [];
    let nameList2 = [];
    let listTime2 = [];
    infoUser.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      let html;
      html = `
            <div class="profile-page">
            <div class="profile">
                <h2>Personal profile: <a href="#"># ${stripHtml(
                  profile.data.name
                )}</a></h2>
                <button class="btn-go-home">Về trang chủ</button>
                <span>View user blog:</span>
            </div>
            <div class="posts">
            </div>
        </div>
            `;
      blog.root.innerHTML = html;
      blog.handleGoHome();
      const posts = document.querySelector(".posts");
      profile.data.blogs.forEach(function (item, index) {
        const contentShow = item.content.slice(0, item.content.length / 2);
        const time = new Date(item.createdAt);
        const timeBefore = blog.handleTime(time);
        let post = document.createElement("div");
        post.classList.add("post");
        post.innerHTML = `
                  <div class="posts">
                    <div class="post">
                    <div class="time">
                    <div class="time-detail">
                        <span class="preiod">${timeBefore}
                            <span></span>
                        </span>
                        <div class="time-post">
                            <span class="hours">${time.getHours()} h</span>
                            <span class="minutes">${time.getMinutes()} minutes</span>
                        </div>
                    </div>
                    <span class="tag-name">@${stripHtml(
                      profile.data.name
                    )}</span>
                </div>
                <div class="post-detail">
                    <div class="info-user">
                        <div class="avatar"><a href="#">${stripHtml(
                          profile.data.name.charAt(0)
                        )}</a></div>
                        <div class="user-name"><a href="#">${stripHtml(
                          profile.data.name
                        )}</a></div>
                    </div>
                    <h2 class="title">${stripHtml(item.title)}</h2>
                    <p class="post-content">${blog.handleRegex(
                      stripHtml(contentShow)
                    )}...</p>
                    <div class="view-detail-post"><a href="#"># view more ${stripHtml(
                      profile.data.name.charAt(0)
                    )}...</a></div>
                    <div class="post-footer">
                        <div class="user-profile"><a href="#"># ${stripHtml(
                          profile.data.name
                        )}</a></div>
                        <div class="read-time">Khoảng ${blog.randomNum()} giây đọc</div>
                    </div>
                </div>
                    </div>
                  </div>
                  `;
        posts.append(post);
        titleList.push(item.title);
        contentList.push(item.content);
        nameList.push(profile.data.name);
        listTime.push(item.createdAt);
      });
      blog.handleViewDetail(titleList, contentList, nameList, listTime, userId);
    });

    userProfile.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      let html;
      html = `
            <div class="profile-page">
            <div class="profile">
                <h2>Personal profile: <a href="#"># ${stripHtml(
                  profile.data.name
                )}</a></h2>
                <button class="btn-go-home">Về trang chủ</button>
                <span>View user blog:</span>
            </div>
            <div class="posts">
            </div>
        </div>
            `;
      blog.root.innerHTML = html;
      blog.handleGoHome();
      const posts = document.querySelector(".posts");
      profile.data.blogs.forEach(function (item, index) {
        const contentShow = item.content.slice(0, item.content.length / 2);
        const time = new Date(item.createdAt);
        const timeBefore = blog.handleTime(time);
        let post = document.createElement("div");
        post.classList.add("post");
        post.innerHTML = `
                  <div class="posts">
                    <div class="post">
                    <div class="time">
                    <div class="time-detail">
                        <span class="preiod">${timeBefore}
                            <span></span>
                        </span>
                        <div class="time-post">
                            <span class="hours">${time.getHours()} h</span>
                            <span class="minutes">${time.getMinutes()} minutes</span>
                        </div>
                    </div>
                    <span class="tag-name">@${stripHtml(
                      profile.data.name
                    )}</span>
                </div>
                <div class="post-detail">
                    <div class="info-user">
                        <div class="avatar"><a href="#">${stripHtml(
                          profile.data.name.charAt(0)
                        )}</a></div>
                        <div class="user-name"><a href="#">${stripHtml(
                          profile.data.name
                        )}</a></div>
                    </div>
                    <h2 class="title">${stripHtml(item.title)}</h2>
                    <p class="post-content">${blog.handleRegex(
                      stripHtml(contentShow)
                    )}...</p>
                    <div class="view-detail-post"><a href="#"># view more ${stripHtml(
                      profile.data.name.charAt(0)
                    )}...</a></div>
                    <div class="post-footer">
                        <div class="user-profile"><a href="#"># ${stripHtml(
                          profile.data.name
                        )}</a></div>
                        <div class="read-time">Khoảng ${blog.randomNum()} giây đọc</div>
                    </div>
                </div>
                    </div>
                  </div>
                  `;
        posts.append(post);
        titleList2.push(item.title);
        contentList2.push(item.content);
        nameList2.push(profile.data.name);
        listTime2.push(item.createdAt);
      });
      blog.handleViewDetail(
        titleList2,
        contentList2,
        nameList2,
        listTime2,
        userId
      );
    });
  },
  handleViewDetail: function (
    titleList,
    contentList,
    nameList,
    listTime,
    infoUser,
    infoList
  ) {
    const detailPostList = document.querySelectorAll(".view-detail-post");

    detailPostList.forEach(function (detailPost, index) {
      detailPost.addEventListener("click", async function (e) {
        e.preventDefault();
        e.stopPropagation();
        let html;
        html = `
        <div class="post-detail-page">
        <div class="post-detail-title">
            ${stripHtml(titleList[index])}
        </div>
        <div class="post-detail-content">
            ${blog.handleRegex(stripHtml(contentList[index]))}
        </div>
        <div class="user-profile"><a href="#"># ${stripHtml(
          nameList[index]
        )}</a></div>
        <div class="post-detail-line"></div>
        <div class="period-time">${blog.handleTime(listTime[index])}</div>
        <div class="time-detail">${blog.formatDate(listTime[index])}</div>
        <button class="btn-go-home">Go Home Page</button>
    </div>
        `;
        blog.root.innerHTML = html;
        blog.handleGoHome();
        if (infoUser) {
          const profileUser = document.querySelector(".user-profile");
          let titleList = [];
          let contentList = [];
          let nameList = [];
          let listTime = [];
          const { response, data: profile } = await client.get(
            `/users/${infoUser._id}`
          );
          profileUser.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            let html;
            html = `
      <div class="profile-page">
      <div class="profile">
          <h2>Personal profile: <a href="#"># ${stripHtml(
            profile.data.name
          )}</a></h2>
          <button class="btn-go-home">Về trang chủ</button>
          <span>View user blog:</span>
      </div>
      <div class="posts">
      </div>
  </div>
      `;
            blog.root.innerHTML = html;
            blog.handleGoHome();
            const posts = document.querySelector(".posts");
            profile.data.blogs.forEach(function (item, index) {
              const contentShow = item.content.slice(0, item.content.length / 2)
              const time = new Date(item.createdAt);
              const timeBefore = blog.handleTime(time);
              let post = document.createElement("div");
              post.classList.add("post");
              post.innerHTML = `
            <div class="posts">
              <div class="post">
              <div class="time">
              <div class="time-detail">
                  <span class="preiod">${timeBefore}
                      <span></span>
                  </span>
                  <div class="time-post">
                      <span class="hours">${time.getHours()} h</span>
                      <span class="minutes">${time.getMinutes()} minutes</span>
                  </div>
              </div>
              <span class="tag-name">@${stripHtml(profile.data.name)}</span>
          </div>
          <div class="post-detail">
              <div class="info-user">
                  <div class="avatar"><a href="#">${stripHtml(
                    profile.data.name.charAt(0)
                  )}</a></div>
                  <div class="user-name"><a href="#">${stripHtml(
                    profile.data.name
                  )}</a></div>
              </div>
              <h2 class="title">${stripHtml(item.title)}</h2>
              <p class="post-content">${blog.handleRegex(
                stripHtml(contentShow)
              )}...</p>
              <div class="view-detail-post"><a href="#"># view more ${stripHtml(
                profile.data.name.charAt(0)
              )}...</a></div>
              <div class="post-footer">
                  <div class="user-profile"><a href="#"># ${stripHtml(
                    profile.data.name
                  )}</a></div>
                  <div class="read-time">Khoảng ${blog.randomNum()} giây đọc</div>
              </div>
          </div>
              </div>
            </div>
            `;
              posts.append(post);
              titleList.push(item.title);
              contentList.push(item.content);
              nameList.push(profile.data.name);
              listTime.push(item.createdAt);
            });
            blog.handleViewDetail(
              titleList,
              contentList,
              nameList,
              listTime,
              infoUser
            );
          });
        }
        if (infoList) {
          const profileList = document.querySelectorAll(".user-profile");
          let titleList = [];
          let contentList = [];
          let nameList = [];
          let listTime = [];

          profileList.forEach(async function (item, index) {
            const { response, data: profile } = await client.get(
              `/users/${infoList[index]._id}`
            );
            if (response.ok) {
              item.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                let html;
                html = `
            <div class="profile-page">
            <div class="profile">
                <h2>Personal profile: <a href="#"># ${stripHtml(
                  profile.data.name
                )}</a></h2>
                <button class="btn-go-home">Về trang chủ</button>
                <span>View user blog:</span>
            </div>
            <div class="posts">
            </div>
        </div>
            `;
                blog.root.innerHTML = html;
                blog.handleGoHome();
                const posts = document.querySelector(".posts");
                profile.data.blogs.forEach(function (item, index) {
                  const contentShow = item.content.slice(0, item.content.length / 2)
                  const time = new Date(item.createdAt);
                  const timeBefore = blog.handleTime(time);
                  let post = document.createElement("div");
                  post.classList.add("post");
                  post.innerHTML = `
                  <div class="posts">
                    <div class="post">
                    <div class="time">
                    <div class="time-detail">
                        <span class="preiod">${timeBefore}
                            <span></span>
                        </span>
                        <div class="time-post">
                            <span class="hours">${time.getHours()} h</span>
                            <span class="minutes">${time.getMinutes()} minutes</span>
                        </div>
                    </div>
                    <span class="tag-name">@${stripHtml(
                      profile.data.name
                    )}</span>
                </div>
                <div class="post-detail">
                    <div class="info-user">
                        <div class="avatar"><a href="#">${stripHtml(
                          profile.data.name.charAt(0)
                        )}</a></div>
                        <div class="user-name"><a href="#">${stripHtml(
                          profile.data.name
                        )}</a></div>
                    </div>
                    <h2 class="title">${stripHtml(item.title)}</h2>
                    <p class="post-content">${blog.handleRegex(
                      stripHtml(contentShow)
                    )}...</p>
                    <div class="view-detail-post"><a href="#"># view more ${stripHtml(
                      profile.data.name.charAt(0)
                    )}...</a></div>
                    <div class="post-footer">
                        <div class="user-profile"><a href="#"># ${stripHtml(
                          profile.data.name
                        )}</a></div>
                        <div class="read-time">Khoảng ${blog.randomNum()} giây đọc</div>
                    </div>
                </div>
                    </div>
                  </div>
                  `;
                  posts.append(post);
                  titleList.push(item.title);
                  contentList.push(item.content);
                  nameList.push(profile.data.name);
                  listTime.push(item.createdAt);
                });
                blog.handleViewDetail(
                  titleList,
                  contentList,
                  nameList,
                  listTime,
                  infoList[index]
                );
              });
            }
          });
        }
      });
    });
  },
  handleMainProfile: async function (userId) {
    const infoUserMain = document.querySelector(".info-user-main");
    const { response, data: profile } = await client.get(
      `/users/${userId._id}`
    );
    let titleList = [];
    let contentList = [];
    let nameList = [];
    let listTime = [];

    infoUserMain.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      let html;
      html = `
      <div class="profile-page">
      <div class="profile">
          <h2>Personal profile: <a href="#"># ${stripHtml(
            profile.data.name
          )}</a></h2>
          <button class="btn-go-home">Về trang chủ</button>
          <span>View user blog:</span>
      </div>
      <div class="posts">
      </div>
  </div>
      `;
      blog.root.innerHTML = html;
      blog.handleGoHome();
      const posts = document.querySelector(".posts");
      profile.data.blogs.forEach(function (item, index) {
        const contentShow = item.content.slice(0, item.content.length / 2)
        const time = new Date(item.createdAt);
        const timeBefore = blog.handleTime(time);
        let post = document.createElement("div");
        post.classList.add("post");
        post.innerHTML = `
            <div class="posts">
              <div class="post">
              <div class="time">
              <div class="time-detail">
                  <span class="preiod">${timeBefore}
                      <span></span>
                  </span>
                  <div class="time-post">
                      <span class="hours">${time.getHours()} h</span>
                      <span class="minutes">${time.getMinutes()} minutes</span>
                  </div>
              </div>
              <span class="tag-name">@${stripHtml(profile.data.name)}</span>
          </div>
          <div class="post-detail">
              <div class="info-user">
                  <div class="avatar"><a href="#">${stripHtml(
                    profile.data.name.charAt(0)
                  )}</a></div>
                  <div class="user-name"><a href="#">${stripHtml(
                    profile.data.name
                  )}</a></div>
              </div>
              <h2 class="title">${stripHtml(item.title)}</h2>
              <p class="post-content">${blog.handleRegex(
                stripHtml(contentShow)
              )}...</p>
              <div class="view-detail-post"><a href="#"># view more ${stripHtml(
                profile.data.name.charAt(0)
              )}...</a></div>
              <div class="post-footer">
                  <div class="user-profile"><a href="#"># ${stripHtml(
                    profile.data.name
                  )}</a></div>
                  <div class="read-time">Khoảng ${blog.randomNum()} giây đọc</div>
              </div>
          </div>
              </div>
            </div>
            `;
        posts.append(post);
        titleList.push(item.title);
        contentList.push(item.content);
        nameList.push(profile.data.name);
        listTime.push(item.createdAt);
      });
      blog.handleViewDetail(titleList, contentList, nameList, listTime, userId);
    });
  },
  handleGoHome: function () {
    const btnGoHome = document.querySelector(".btn-go-home");
    btnGoHome.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      blog.render();
    });
  },
  handleViewProfile: async function (infoList) {
    const profileList = document.querySelectorAll(".user-profile");
    const infoUserList = document.querySelectorAll(".info-user");

    let titleList = [];
    let contentList = [];
    let nameList = [];
    let listTime = [];

    profileList.forEach(async function (item, index) {
      const { response, data: profile } = await client.get(
        `/users/${infoList[index]._id}`
      );
      if (response.ok) {
        item.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          let html;
          html = `
      <div class="profile-page">
      <div class="profile">
          <h2>Personal profile: <a href="#"># ${stripHtml(
            profile.data.name
          )}</a></h2>
          <button class="btn-go-home">Về trang chủ</button>
          <span>View user blog:</span>
      </div>
      <div class="posts">
      </div>
  </div>
      `;
          blog.root.innerHTML = html;
          blog.handleGoHome();
          const posts = document.querySelector(".posts");
          profile.data.blogs.forEach(function (item, index) {
            const contentShow = item.content.slice(0, item.content.length / 2)
            const time = new Date(item.createdAt);
            const timeBefore = blog.handleTime(time);
            let post = document.createElement("div");
            post.classList.add("post");
            post.innerHTML = `
            <div class="posts">
              <div class="post">
              <div class="time">
              <div class="time-detail">
                  <span class="preiod">${timeBefore}
                      <span></span>
                  </span>
                  <div class="time-post">
                      <span class="hours">${time.getHours()} h</span>
                      <span class="minutes">${time.getMinutes()} minutes</span>
                  </div>
              </div>
              <span class="tag-name">@${stripHtml(profile.data.name)}</span>
          </div>
          <div class="post-detail">
              <div class="info-user">
                  <div class="avatar"><a href="#">${stripHtml(
                    profile.data.name.charAt(0)
                  )}</a></div>
                  <div class="user-name"><a href="#">${stripHtml(
                    profile.data.name
                  )}</a></div>
              </div>
              <h2 class="title">${stripHtml(item.title)}</h2>
              <p class="post-content">${blog.handleRegex(
                stripHtml(contentShow)
              )}...</p>
              <div class="view-detail-post"><a href="#"># view more ${stripHtml(
                profile.data.name.charAt(0)
              )}...</a></div>
              <div class="post-footer">
                  <div class="user-profile"><a href="#"># ${stripHtml(
                    profile.data.name
                  )}</a></div>
                  <div class="read-time">Khoảng ${blog.randomNum()} giây đọc</div>
              </div>
          </div>
              </div>
            </div>
            `;
            posts.append(post);
            titleList.push(item.title);
            contentList.push(item.content);
            nameList.push(profile.data.name);
            listTime.push(item.createdAt);
          });
          blog.handleViewDetail(
            titleList,
            contentList,
            nameList,
            listTime,
            infoList[index]
          );
        });
      }
    });

    infoUserList.forEach(async function (item, index) {
      const { response, data: profile } = await client.get(
        `/users/${infoList[index]._id}`
      );
      if (response.ok) {
        item.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          let html;
          html = `
      <div class="profile-page">
      <div class="profile">
          <h2>Personal profile: <a href="#"># ${stripHtml(
            profile.data.name
          )}</a></h2>
          <button class="btn-go-home">Về trang chủ</button>
          <span>View user blog:</span>
      </div>
      <div class="posts">
      </div>
  </div>
      `;
          blog.root.innerHTML = html;
          blog.handleGoHome();
          const posts = document.querySelector(".posts");
          profile.data.blogs.forEach(function (item, index) {
            const contentShow = item.content.slice(0, item.content.length / 2)
            const time = new Date(item.createdAt);
            const timeBefore = blog.handleTime(time);
            let post = document.createElement("div");
            post.classList.add("post");
            post.innerHTML = `
            <div class="posts">
              <div class="post">
              <div class="time">
              <div class="time-detail">
                  <span class="preiod">${timeBefore}
                      <span></span>
                  </span>
                  <div class="time-post">
                      <span class="hours">${time.getHours()} h</span>
                      <span class="minutes">${time.getMinutes()} minutes</span>
                  </div>
              </div>
              <span class="tag-name">@${stripHtml(profile.data.name)}</span>
          </div>
          <div class="post-detail">
              <div class="info-user">
                  <div class="avatar"><a href="#">${stripHtml(
                    profile.data.name.charAt(0)
                  )}</a></div>
                  <div class="user-name"><a href="#">${stripHtml(
                    profile.data.name
                  )}</a></div>
              </div>
              <h2 class="title">${stripHtml(item.title)}</h2>
              <p class="post-content">${blog.handleRegex(
                stripHtml(contentShow)
              )}...</p>
              <div class="view-detail-post"><a href="#"># view more ${stripHtml(
                profile.data.name.charAt(0)
              )}...</a></div>
              <div class="post-footer">
                  <div class="user-profile"><a href="#"># ${stripHtml(
                    profile.data.name
                  )}</a></div>
                  <div class="read-time">Khoảng ${blog.randomNum()} giây đọc</div>
              </div>
          </div>
              </div>
            </div>
            `;
            posts.append(post);
            titleList.push(item.title);
            contentList.push(item.content);
            nameList.push(profile.data.name);
            listTime.push(item.createdAt);
          });
          blog.handleViewDetail(titleList, contentList, nameList, listTime);
        });
      }
    });
  },
  handlePost: async function () {
    const currentTime = new Date().getTime();
    const btnPostNew = document.querySelector(".btn-post-new");
    btnPostNew.addEventListener("click", async function (e) {
      e.preventDefault();
      e.stopPropagation();
      btnPostNew.disabled = true;
      btnPostNew.style.cursor = "not-allowed";
      btnPostNew.style.transform = "scale(1)";
      const titleEl = document.querySelector("#title");
      const contentEl = document.querySelector("#content");

      const title = titleEl.value;
      const content = contentEl.value;
      if (title && content) {
        if (!document.querySelector("#time-post").value) {
          const { response, data: post } = await client.post("/blogs", {
            title,
            content,
          });
          titleEl.value = "";
          contentEl.value = "";
          // console.log(post.data.createdAt);
          if (response.ok) {
            btnPostNew.disabled = false;
            btnPostNew.style.cursor = "";
            btnPostNew.style.transform = "";
            blog.renderPost(
              post.data.userId.name,
              title,
              content,
              post.data.createdAt,
              post.data.userId
            );
            blog.alertSuccess("Thêm bài viết thành công");
          } else {
            blog.handleRefreshToken().then(async () => {
              const { response, data: post } = await client.post("/blogs", {
                title,
                content,
              });
              if (response.ok) {
                btnPostNew.disabled = false;
                btnPostNew.style.cursor = "";
                btnPostNew.style.transform = "";
                blog.renderPost(
                  post.data.userId.name,
                  title,
                  content,
                  post.data.createdAt,
                  post.data.userId
                );
                blog.alertSuccess("Thêm bài viết thành công");
              }
            });
          }
        } else {
          btnPostNew.disabled = false;
          btnPostNew.style.cursor = "";
          btnPostNew.style.transform = "";
          let time = document.querySelector("#time-post").value.split("/");
          let timeSet = new Date(`${time[2]}-${time[0]}-${time[1]}`).getTime();
          if (timeSet <= currentTime) {
            blog.alertError("Vui lòng chọn lại thời gian đăng bài!");
          } else {
            titleEl.value = "";
            contentEl.value = "";
            document.querySelector("#time-post").value = ""; //`Bài viết của bạn sẽ được đăng vào ${}` `${time[2]}-${time[0]}-${time[1]}`
            blog.alertSuccess(
              `Bài viết của bạn sẽ được đăng vào ${blog.formatDate(
                `${time[2]}-${time[0]}-${time[1]}`
              )}`
            );
          }
        }
      } else {
        btnPostNew.disabled = false;
        btnPostNew.style.cursor = "";
        btnPostNew.style.transform = "";
        blog.alertError("Vui lòng nhập đủ các trường");
      }
    });
  },
  handleRefreshToken: async function () {
    let refresh_token = localStorage.getItem("refresh_token");
    const { response, data: tokens } = await client.post(
      "/auth/refresh-token",
      {
        refreshToken: refresh_token,
      }
    );
    // console.log(response, tokens.data.token.accessToken);
    if (response.ok) {
      localStorage.setItem("access_token", tokens.data.token.accessToken);
      localStorage.setItem("refresh_token", tokens.data.token.refreshToken);
      client.setToken(tokens.data.token.accessToken);
      return response;
    } else {
      blog.alertError("Vui lòng đăng nhập lại");
      setTimeout(function () {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        blog.render();
      }, 3000);
    }
  },
  getProfile: async function () {
    const { response, data: user } = await client.get("/users/profile");
    if (response.ok) {
      return user;
    } else {
      return blog.handleRefreshToken().then(async () => {
        const { response, data: user } = await client.get("/users/profile");
        if (response.ok) {
          return user;
        }
      });
    }
  },
  randomNum: function () {
    const num = Math.floor(Math.random() * 10) + 1;
    return num;
  },
  handleCalender: function () {
    const calendarContainer = document.querySelector(".calendar-container");
    const calendarIcon = document.querySelector(".fa-calendar");
    calendarIcon.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      if (calendarContainer.style.display === "") {
        calendarContainer.style.display = "block";
      } else {
        calendarContainer.style.display = "";
      }
    });
    calendarContainer.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
    });
    document.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      calendarContainer.style.display = "";
    });
    const timePost = document.querySelector("#time-post");
    const daysTag = document.querySelector(".days");
    const currentDate = document.querySelector(".current-date");
    const listIcon = document.querySelectorAll(".icons span");
    const years = document.querySelector(".years");
    const present = document.querySelector(".present");
    const icons = document.querySelector(".icons");
    const arrow = document.querySelector(".present i");
    // getting new date, current year and month
    let date = new Date();
    let currYear = date.getFullYear();
    let currMonth = date.getMonth();
    let currDate = date.getDate();
    let checkMonth = currMonth;
    let checkYear = currYear;

    // storing full name of all months in array
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const renderCalendar = () => {
      let firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
      let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
      let lastDayofMonth = new Date(
        currYear,
        currMonth,
        lastDateofMonth
      ).getDay();
      let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
      let liTag = "";

      for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
      }
      for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday =
          i === +currDate &&
          +currYear === +checkYear &&
          +currMonth === +checkMonth
            ? "active"
            : "";
        // console.log(isToday);
        // console.log(isToday);
        liTag += `<li class="${isToday}">${i}</li>`;
      }

      for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
      }
      currentDate.innerText = `${months[currMonth]} ${currYear}`;
      daysTag.innerHTML = liTag;
    };
    renderCalendar();
    listIcon.forEach((icon) => {
      icon.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
          date = new Date(currYear, currMonth);
          // console.log(date);
          currYear = date.getFullYear();
          currMonth = date.getMonth();
        } else {
          date = new Date(currYear, currMonth);
          // console.log(date);
        }
        // console.log(date);
        renderCalendar();
        const dayList = document.querySelectorAll(".days li");
        dayList.forEach(function (item) {
          item.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            e.target.classList.add("active");
            currDate = e.target.innerText;
            checkMonth = currMonth;
            checkYear = currYear;
            let monthShow;
            if (e.target.classList.contains("inactive")) {
              monthShow =
                Array.from(dayList).indexOf(e.target) > 20
                  ? currMonth + 1
                  : currMonth - 1;
            } else {
              monthShow = currMonth;
            }
            timePost.value = `${
              +(monthShow + 1) < 10 ? "0" + (monthShow + 1) : monthShow + 1
            }/${+currDate < 10 ? "0" + currDate : currDate}/${currYear}`;
            dayList.forEach(function (item) {
              if (item.classList.contains("active") && item !== e.target) {
                item.classList.remove("active");
              }
            });
          });
        });
      });
    });
    let yearLiList = "";
    for (let i = 1970; i <= 2300; i++) {
      let isYear = i === currYear ? "selected" : "";
      yearLiList += `<li class="${isYear}">${i}</li>`;
    }
    years.innerHTML = yearLiList;
    present.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      if (years.style.display === "") {
        years.style.display = "flex";
        icons.style.display = "none";
        arrow.style.transform = "rotate(180deg)";
      } else {
        years.style.display = "";
        icons.style.display = "";
        arrow.style.transform = "";
      }
    });
    const yearList = document.querySelectorAll(".years li");
    const dayList = document.querySelectorAll(".days li");
    dayList.forEach(function (item) {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        e.target.classList.add("active");
        currDate = e.target.innerText;
        checkMonth = currMonth;
        checkYear = currYear;
        let monthShow;
        if (e.target.classList.contains("inactive")) {
          monthShow =
            Array.from(dayList).indexOf(e.target) > 20
              ? currMonth + 1
              : currMonth - 1;
        } else {
          monthShow = currMonth;
        }
        timePost.value = `${
          +(monthShow + 1) < 10 ? "0" + (monthShow + 1) : monthShow + 1
        }/${+currDate < 10 ? "0" + currDate : currDate}/${currYear}`;
        dayList.forEach(function (item) {
          if (item.classList.contains("active") && item !== e.target) {
            item.classList.remove("active");
          }
        });
        let time = document.querySelector("#time-post").value.split("/");
        let currentTime = new Date().getTime();
        let timeSet = new Date(`${time[2]}-${time[0]}-${time[1]}`).getTime();
        calendarContainer.style.display = "";
        if (timeSet <= currentTime) {
          blog.alertError("Vui lòng chọ lại thời gian đăng bài");
        } else {
          blog.alertSuccess(
            `Bài viết của bạn sẽ được đăng vào ${blog.formatDate(
              `${time[2]}-${time[0]}-${time[1]}`
            )}`
          );
        }
      });
    });
    yearList.forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.classList.add("selected");
        yearList.forEach(function (item) {
          if (item.classList.contains("selected") && item !== e.target) {
            item.classList.remove("selected");
          }
        });
        years.style.display = "";
        icons.style.display = "";
        arrow.style.transform = "";
        currYear = +e.target.innerText;
        checkYear = currYear;
        let monthShow;
        if (e.target.classList.contains("inactive")) {
          monthShow =
            Array.from(dayList).indexOf(e.target) > 20
              ? currMonth + 1
              : currMonth - 1;
        } else {
          monthShow = currMonth;
        }
        timePost.value = `${
          +(monthShow + 1) < 10 ? "0" + (monthShow + 1) : monthShow + 1
        }/${+currDate < 10 ? "0" + currDate : currDate}/${currYear}`;
        renderCalendar();
        const dayList = document.querySelectorAll(".days li");
        dayList.forEach(function (item) {
          item.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            e.target.classList.add("active");
            currDate = e.target.innerText;
            checkMonth = currMonth;
            checkYear = currYear;
            let monthShow;
            if (e.target.classList.contains("inactive")) {
              monthShow =
                Array.from(dayList).indexOf(e.target) > 20
                  ? currMonth + 1
                  : currMonth - 1;
            } else {
              monthShow = currMonth;
            }
            timePost.value = `${
              +(monthShow + 1) < 10 ? "0" + (monthShow + 1) : monthShow + 1
            }/${+currDate < 10 ? "0" + currDate : currDate}/${currYear}`;
            dayList.forEach(function (item) {
              if (item.classList.contains("active") && item !== e.target) {
                item.classList.remove("active");
              }
            });
            let time = document.querySelector("#time-post").value.split("/");
            let currentTime = new Date().getTime();
            let timeSet = new Date(
              `${time[2]}-${time[0]}-${time[1]}`
            ).getTime();
            calendarContainer.style.display = "";
            if (timeSet <= currentTime) {
              blog.alertError("Vui lòng chọ lại thời gian đăng bài");
            } else {
              blog.alertSuccess(
                `Bài viết của bạn sẽ được đăng vào ${blog.formatDate(
                  `${time[2]}-${time[0]}-${time[1]}`
                )}`
              );
            }
          });
        });
        let time = document.querySelector("#time-post").value.split("/");
        let currentTime = new Date().getTime();
        let timeSet = new Date(`${time[2]}-${time[0]}-${time[1]}`).getTime();
        calendarContainer.style.display = "";
        if (timeSet <= currentTime) {
          blog.alertError("Vui lòng chọ lại thời gian đăng bài");
        } else {
          blog.alertSuccess(
            `Bài viết của bạn sẽ được đăng vào ${blog.formatDate(
              `${time[2]}-${time[0]}-${time[1]}`
            )}`
          );
        }
      });
    });
  },
  formatDate: function (time) {
    const date = new Date(time);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours} giờ ${minutes} phút ngày ${day} tháng ${
      month + 1
    } năm ${year}`;
  },
  handleTime: function (time) {
    const currentTime = new Date();
    const postedTime = new Date(time);
    const secondSub = (currentTime.getTime() - postedTime.getTime()) / 1000;
    // console.log(secondSub);
    if (secondSub < 60) {
      return `${Math.floor(secondSub)} giây trước`;
    } else if (secondSub < 3600) {
      return `${Math.floor(secondSub / 60)} phút trước`;
    } else if (secondSub < 3600 * 24) {
      return `${Math.floor(secondSub / 3600)} giờ trước`;
    } else if (secondSub < 3600 * 24 * 31) {
      return `${Math.floor(secondSub / (3600 * 24))} ngày trước`;
    } else if (secondSub < 3600 * 24 * 31 * 12) {
      return `${Math.floor(secondSub / (3600 * 24 * 31))} tháng trước`;
    } else if (secondSub < 3600 * 24 * 31 * 12 * 5) {
      return `${Math.floor(secondSub / (3600 * 24 * 31 * 12))} năm trước`;
    } else {
      return `Vài năm trước`;
    }
  },
  updatePeriod: () => {
    const posts = document.querySelector(".posts");
    if (posts) {
      Array.from(posts.children).forEach(function (post, index) {
        const period = post.querySelector(".preiod");
        const currentTime = new Date(timeList[index]);
        const timeBefore = blog.handleTime(currentTime);
        period.innerHTML = `
          ${timeBefore}
          <span></span>
        `;
      });
    }
  },
  handleRegex: function (content) {
    const result = blog.handleRegexPhone(content);
    const result2 = blog.handleRegexEmail(result);
    const result3 = blog.handleRegexLink(result2);
    const result4 = blog.handleRegexVideo(result3);
    const result5 = blog.handleRegexLine(result4);
    return blog.handleRegexSpace(result5);
  },
  handleRegexPhone: function (content) {
    const pattern = /((0|\+84)\d{9})/gi;
    return content.replace(
      pattern,
      ` <a href="tel:$1" target="_blank" class="phone-regex">$1</a> `
    );
  },
  handleRegexEmail: function (content) {
    const pattern = /(([\w\.-]{3,})@([\w\.-]{1,}\.[a-z]{2,}))/gi;
    return content.replace(
      pattern,
      `<a href="mailto:$1" target="_blank" class="mail-regex">$1</a>`
    );
  },
  handleRegexVideo: function (content) {
    const pattern =
      /<span>(?:www.|)(?:youtube.com\/watch\?v\=|youtu.be\/)([a-zA-Z0-9\_\-]+)(\&?[a-z0-9A-Z\=\-\_\.\/\+\?]+|)<\/span>/g;
    return content.replace(
      pattern,
      `<iframe src="https://www.youtube.com/embed/$1" width="500" height="300"></iframe>`
    );
  },
  handleRegexLink: function (content) {
    const pattern =
      /((?:http|https):\/\/(((?:[a-z0-9][a-z0-9-_\.]*\.|)[a-z0-9][a-z0-9-_\.]*\.[a-z]{2,}(?::\d{2,}|))(\/|)[a-zA-Z0-9\?\=\-\_\.\+]*))/g;
    return content.replace(
      pattern,
      `<a href="$1" target="_blank" class="link-regex"><span>$2</span></a>`
    );
  },
  handleRegexSpace: function (content) {
    const pattern = /\s+/g;
    return content.replace(pattern, " ");
  },
  handleRegexLine: function (content) {
    const pattern = /\n+/g;
    return content.replace(pattern, "\n");
  },
  start: function () {
    if (blog.isLogin()) {
      client.setToken(localStorage.getItem("access_token"));
    }
    this.render();
  },
};

blog.start();
