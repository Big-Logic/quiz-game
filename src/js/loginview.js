class LoginView {
  #data;
  #parentElement = document.body;

  _generateLoginMarkup() {
    const markup = `
            <section class="login__wrapper form__wrapper">
      <div class="login__cont form__cont">
        <div class="login__image--cont form__image--cont">
          <i class="las la-user"></i>
        </div>
        <header class="login__header--cont form__header--cont">
          <h2 class="login__header">LOGIN</h2>
        </header>

        <form action="#" class="login__form main__form">
        <p class="error__p"></p>
          <div class="login__username--cont form__input--cont">
            <div class="login__username--label-cont form__input--labelcont">
              <label for="login__username" class="login_label"><i class="las la-user"></i></label>
            </div>
            <div class="login__username--cont">
              <input
                type="text"
                name="username"
                id="login__username"
                required
                class="form__input"
                placeholder="Username"
              />
            </div>
          </div>
          <div class="login__password--cont form__input--cont">
            <div class="login__password--label-cont form__input--labelcont">
              <label for="login__password" class="login_label"><i class="las la-lock"></i></label>
            </div>
            <div class="login__password--cont">
              <input
                type="password"
                name="password"
                id="login__password"
                required
                class="form__input"
                placeholder="pincode"
              />
            </div>
          </div>

          <button type="submit" class="login__btn form__submit--btn">
            LogIn
          </button>
          <div class="link__to--signupandfp-cont">
            <button type="button" class="link__to--signup-btn link__button">
              I don't have an account
            </button>
          </div>
        </form>
      </div>
    </section>
        `;

    return markup;
  }

  //render Login
  renderLoginView(handleSignupRender) {
    this.#parentElement.innerHTML = "";
    this.#parentElement.insertAdjacentHTML(
      "beforeend",
      this._generateLoginMarkup()
    );
    this._renderSignup(handleSignupRender);
  }

  dealWithLogin(handleLogin) {
    const formLoginElement = this.#parentElement.querySelector(".login__form");

    //select all elements
    const loginUsernameCont = this.#parentElement.querySelector(
      ".login__username--cont"
    );
    const loginPasswordCont = this.#parentElement.querySelector(
      ".login__password--cont"
    );
    const loginLabel = this.#parentElement.querySelectorAll(".login_label");
    const loginUsername = document.querySelector("#login__username");
    const loginPassword = document.querySelector("#login__password");

    const loginImageCont = document.querySelector(".login__image--cont");
    const errorP = this.#parentElement.querySelector(".error__p");

    //handle login after submit button is click
    const makeLogin = async function (userName, password) {
      //add spinner while checking is user exist
      loginImageCont.innerHTML = '<i class="las la-spinner"></i>';
      try {
        //While checking if user exist, do this
        loginUsernameCont.classList.remove("invalid_cre");
        loginPasswordCont.classList.remove("invalid_cre");
        loginLabel.forEach((ele) => {
          ele.style.color = "#333";
        });
        errorP.textContent = "";
        await handleLogin(userName.value, password.value);
      } catch (err) {
        //if user doesn't exist, do this
        loginUsernameCont.classList.add("invalid_cre");
        loginPasswordCont.classList.add("invalid_cre");
        loginLabel.forEach((ele) => {
          ele.style.color = "#d61c4e";
        });
        loginImageCont.innerHTML = '<i class="las la-user"></i>';
        errorP.textContent = err.message;
      }
    }.bind(this);

    formLoginElement.addEventListener("submit", function (e) {
      e.preventDefault();
      makeLogin(loginUsername, loginPassword);
    });
  }

  _renderSignup(func) {
    const parentEl = this.#parentElement.querySelector(".login__form");
    const noAccountBtn = parentEl.querySelector(".link__to--signup-btn");

    noAccountBtn.addEventListener("click", function () {
      func();
    });
  }
}

export default new LoginView();
