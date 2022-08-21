import image from "../images/male.png";

class DashboardView {
  #data;
  #parentElement = document.body;

  _generateMarkup(data) {
    this.#data = data;
    const markup = `
    <main class="main__content--wrapper">
    <section class="dashboard__wrapper">
        <div class="dashboard__cont">
          <div class="dashboard__child participians__wrapper">
            <header class="main__header--cont">
              <h1 class="main__header">Gentle Quiz</h1>
            </header>
            <div class="participians__cont">
              <h2 class="participians__header">Participians</h2>
              <div class="participians">
                
              </div>
            </div>
          </div>
          <div class="dashboard__child content__wrapper">
          <div class="nav__bar--cont">
              <header class="main__header--cont-hidden">
                <h1 class="main__header">G-Quiz</h1>
              </header>
            <div class="content__child nav__bar">
              <div class="nav__items">
                <button class="general__setting--btn setting__btn">
                  <i class="las la-cog"></i>
                </button>
              </div>
              <div class="nav__items active__user--cont">
                <h2 class="active__user--name">${
                  data.activeUser.accountName
                }</h2>
                <h2 class="active__user--namemin">${data.activeUser.accountName.slice(
                  0,
                  7
                )}..</h2>
                <div class="active__user--image-cont">
                  <img src="${image}" alt="Alfred Ngwayah" />
                </div>
              </div>
              <div class="nav__items"></div>
            </div>
            </div>
            <div class="content__child game__joke--wrapper">
              <div class="game__joke--child game__cont">
                <div class="hd__score--cont">
                <h3 class="quiz__header">Quiz </h3>
                <p class="quiz__highest--score-p" title="Highest Score">H-Score: <span class="quiz__highest--score">${
                  this.#data.activeUser.highestScore
                }%</span></p>
                </div>

                <div class="quiz__main">
                  <div class="quiz__play--btn-cont">
                    <button class="quiz__play--btn">Start a new Quiz</button>
                  </div>
                </div>
              </div>
              <div class="game__joke--child joke__cont">
                <h3 class="joke__header">Jokes of today</h3>
                <p class="joke__content">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit
                  dolores doloremque numquam, quibusdam quis dignissimos aliquam
                  eveniet sequi fuga voluptatum laborum illum ipsa architecto
                  quas odit deleniti aspernatur officiis distinctio!
                </p>
                <p class="joke__emoji">😁 😆 😅 😂 🤣</p>
              </div>
            </div>
          </>
        </div>
      </section>
      <p class="copyright">Build with 😍😍LOVE😍😍 at Duport Road by Logic.</p>
      </main>
      <button class="participians__view--btn">View Players</button>
        `;

    return markup;
  }

  renderDashboard(
    data,
    handleJokesRender,
    handleAccountSetting,
    handleGetAllUsers
  ) {
    this.#parentElement.innerHTML = "";
    this.#parentElement.insertAdjacentHTML(
      "beforeend",
      this._generateMarkup(data)
    );

    this._displayAccountSetting(handleAccountSetting);

    handleJokesRender();
    handleGetAllUsers();
    this._toggleParticipiansView();
  }

  renderHighestScore(score) {
    this.#parentElement.querySelector(
      ".quiz__highest--score"
    ).textContent = `${score}%`;
  }

  _displayAccountSetting(handleAccountSetting) {
    const settingBtn = document.querySelector(".general__setting--btn");
    settingBtn.addEventListener("click", function () {
      handleAccountSetting();
    });
  }

  _toggleParticipiansView() {
    const toggleBtn = this.#parentElement.querySelector(
      ".participians__view--btn"
    );

    toggleBtn.addEventListener(
      "click",
      function () {
        toggleBtn.classList.toggle("participians__view--btntf");
        if (toggleBtn.textContent === "View Players") {
          toggleBtn.textContent = "Close View";
        } else {
          toggleBtn.textContent = "View Players";
        }
        this.#parentElement
          .querySelector(".participians__wrapper")
          .classList.toggle("participians__wrapper__show");
      }.bind(this)
    );
  }
}

export default new DashboardView();
