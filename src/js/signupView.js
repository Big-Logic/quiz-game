class SignupView {
  #parentElement = document.body;

  _generateMarkup() {
    const markup = `
            <section class="signup__wrapper form__wrapper">
      <div class="signup__cont form__cont">
        <div class="signup__image--cont form__image--cont">
          <i class="las la-user"></i>
        </div>
        <header class="signup__header--cont form__header--cont">
          <h2 class="signup__header">SIGNUP</h2>
        </header>

        <form action="#" class="signup__form main__form">
        <p class="signUperror__p"></p>
          <div class="signup__firstname--cont form__input--cont">
            <div class="signup__firstname--label-cont form__input--labelcont">
              <label for="signup__firstname"
                ><i class="las la-user-edit"></i
              ></label>
            </div>
            <div class="signup__firstname--cont">
              <input
                type="text"
                name="firstname"
                id="signup__firstname"
                required
                class="form__input"
                placeholder="First Name"
                pattern="^[a-zA-Z]+$"
                minlength="2"
                title="This input accepts only letters"
              />
            </div>
          </div>
          <div class="signup__surname--cont form__input--cont">
            <div class="signup__surname--label-cont form__input--labelcont">
              <label for="signup__surname"
                ><i class="las la-user-edit"></i
              ></label>
            </div>
            <div class="signup__surname--cont">
              <input
                type="text"
                name="surname"
                id="signup__surname"
                required
                class="form__input"
                placeholder="Surname"
                minlength="2"
                pattern="^[a-zA-Z]+$"
                title="This input accepts only letters"
              />
            </div>
          </div>
          <div class="signup__username--cont form__input--cont">
            <div class="signup__username--label-cont form__input--labelcont">
              <label for="signup__username"><i class="las la-user"></i></label>
            </div>
            <div class="signup__username--cont">
              <input
                type="text"
                name="username"
                id="signup__username"
                required
                class="form__input"
                placeholder="Username"
                minlength="6"
              />
            </div>
          </div>

          <button type="submit" class="login__btn form__submit--btn">
            signup
          </button>
          <div class="link__to--signupandfp-cont">
            <button type="button" class="link__to--signup-btn link__button">
              I have an account
            </button>
          </div>
        </form>
      </div>
    </section>
        `;

    return markup;
  }

  _generatePinMarkup(pin) {
    const markup = `
      <div>
        <h3>This is your login pincode</h3>
        <p class="generated__pin">${pin}</p>
        <button class="pin__copy--btn">Copy Pin</button>
        <button class="save__login--btn">Save and Login</button>
      </div>
    `;

    return markup;
  }

  renderMarkup(handleSignup) {
    this.#parentElement.innerHTML = "";
    this.#parentElement.insertAdjacentHTML("beforeend", this._generateMarkup());

    handleSignup();
  }

  dealWithSignup(createAccount, storeAccountToLocal, logUserIn) {
    const mainParent = this.#parentElement.querySelector(".signup__cont");
    const parentEl = this.#parentElement.querySelector(".signup__form");
    const firstNameInput = parentEl.querySelector("#signup__firstname");
    const surNameInput = parentEl.querySelector("#signup__surname");
    const userNameInput = parentEl.querySelector("#signup__username");
    const signupImageCont = this.#parentElement.querySelector(
      ".signup__image--cont"
    );
    const errorP = this.#parentElement.querySelector(".signUperror__p");

    const accountCreationFunc = async function () {
      signupImageCont.innerHTML = '<i class="las la-spinner"></i>';
      errorP.textContent = "";
      try {
        const id = await createAccount(
          firstNameInput.value,
          surNameInput.value,
          userNameInput.value
        );
        mainParent.removeChild(parentEl);
        mainParent.insertAdjacentHTML("beforeend", this._generatePinMarkup(id));
        signupImageCont.innerHTML = '<i class="las la-user"></i>';
        this._copyPin();
        this._saveAndLogin(storeAccountToLocal, logUserIn);
      } catch (err) {
        errorP.textContent = err.message;
        signupImageCont.innerHTML = '<i class="las la-user"></i>';
      }
    }.bind(this);
    parentEl.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();

        accountCreationFunc();
      }.bind(this)
    );
  }

  _copyPin() {
    const parentEl = this.#parentElement.querySelector(".signup__cont");
    const pinP = parentEl.querySelector(".generated__pin");
    const btnCopy = parentEl.querySelector(".pin__copy--btn");

    btnCopy.addEventListener(
      "click",
      function (e) {
        const selection = pinP.textContent;
        navigator.clipboard.writeText(selection);
        btnCopy.classList.add("pin__copy--btnshow");

        setTimeout(() => {
          btnCopy.classList.remove("pin__copy--btnshow");
        }, 1000);
      }.bind(this)
    );
  }

  _saveAndLogin(storeAccountToLocal, logUserIn) {
    const parentEl = this.#parentElement.querySelector(".signup__cont");
    const saveAndLoginBtn = parentEl.querySelector(".save__login--btn");

    saveAndLoginBtn.addEventListener("click", function () {
      storeAccountToLocal();
      logUserIn();
    });
  }
}

export default new SignupView();
