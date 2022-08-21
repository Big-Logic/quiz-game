class SettingView {
  #data;
  #parentElement = document.body;

  _generateMarkup() {
    const markup = `
        <section class="account__setup--main popup">
        <div class="account__setupmain--wrapper">
          <button type="button" class="accountsetup__close--btn">
            <i class="las la-times-circle"></i>
          </button>
          <div class="account__setup">
            <header class="account__setup--header">
              <h2>Setting</h2>
            </header>

            <div class="accountname__setup account__setup--div">
              <label for="accountname">Full Name</label>
              <input
                type="text"
                id="accountname"
                name="accountName"
                value="${this.#data.activeUser.accountName}"
                required
              />
            </div>
            <div class="accountusername__setup account__setup--div">
              <label for="accountusername">USER Name</label>
              <input
                type="text"
                id="accountusername"
                name="accountUserName"
                value="${this.#data.activeUser.username}"
                required
              />
            </div>
            <p class="error__cont"></p>
            <div class="account__setup--div account__setup--btn-cont">
              <button type="button" class="account__submit--btn account__setup--btn">
                Save
              </button>
            </div>
          </div>
          <header class="account__setup--header">
              <h2>Score</h2>
            </header>

            <div class="accountscore__setup account__setup--div">
                <div class="highest__score--cont">
                <p class="highest__score">${
                  this.#data.activeUser.highestScore
                }%</p>
                <p class="highest__score--text">Highest Score</p>
                </div>
                <div class="highest__score--resetcont">
                    <button class="highest__score--resetbtn score__reset--btn">Reset</button>
                </div>
            </div>
            <header class="account__setup--header">
              <h2 class="account__delete--head">Danger Zone</h2>
            </header>
            <div class="account__delete--cont account__setup--div">
                <button class="highest__score--resetbtn account__delete--btn">Delete Account</button>
            </div>
        </div>
      </section>
        `;

    return markup;
  }

  renderMarkup(data, handleAccountUpdate, handleAccountDelete) {
    this.#data = data;

    this.#parentElement.insertAdjacentHTML("beforeend", this._generateMarkup());
    this._disableAll();
    this._quitSetup();
    this._addEventToInput();
    handleAccountUpdate();
    handleAccountDelete();
  }

  _quitSetup() {
    const parentEl = this.#parentElement.querySelector(".account__setup--main");
    const settingCloseBtn = parentEl.querySelector(".accountsetup__close--btn");
    settingCloseBtn.addEventListener(
      "click",
      function () {
        this.#parentElement.removeChild(parentEl);
      }.bind(this)
    );
  }

  _disableAll(inp = "inp", saveValue = "inp") {
    const updateBtn = document.querySelector(".account__submit--btn");
    if (inp !== saveValue) {
      updateBtn.disabled = false;
      updateBtn.style.cursor = "pointer";
      updateBtn.style.backgroundColor = "#0096ff";
      updateBtn.style.color = "#fff";

      return;
    }

    updateBtn.disabled = true;
    updateBtn.style.cursor = "not-allowed";
    updateBtn.style.backgroundColor = "#f1f1f1";
    updateBtn.style.color = "#333";
  }

  _addEventToInput() {
    const parentEl = this.#parentElement.querySelector(".account__setup--main");
    const inputs = parentEl.querySelectorAll("input");
    inputs.forEach((inp) => {
      inp.addEventListener(
        "input",
        function (e) {
          if (e.target === inputs[0]) {
            this._disableAll(
              inputs[0].value,
              this.#data.activeUser.accountName
            );
          } else {
            this._disableAll(inputs[1].value, this.#data.activeUser.username);
          }
        }.bind(this)
      );
    });
  }

  updateNameUsr(updateAccount) {
    const parentEl = this.#parentElement.querySelector(".account__setup--main");
    const fullNameInput = parentEl.querySelector("#accountname");
    const userNameInput = parentEl.querySelector("#accountusername");
    const updateBtn = parentEl.querySelector(".account__submit--btn");
    const errP = parentEl.querySelector(".error__cont");
    const dealWithUpdate = async function () {
      errP.textContent = "";
      updateBtn.disabled = true;
      updateBtn.textContent = "Saving...";
      updateBtn.style.cursor = "not-allowed";
      try {
        await updateAccount(fullNameInput.value, userNameInput.value);
        updateBtn.disabled = false;
        updateBtn.textContent = "Save";
        updateBtn.style.cursor = "pointer";
        this.#parentElement.querySelector(".active__user--name").textContent =
          this.#data.activeUser.accountName;
      } catch (err) {
        updateBtn.disabled = false;
        updateBtn.textContent = "Save";
        updateBtn.style.cursor = "pointer";
        errP.textContent = err.message;
        errP.style.color = "red";
        console.log(err);
      }
    }.bind(this);
    updateBtn.addEventListener(
      "click",
      function () {
        if (
          fullNameInput.value === this.#data.activeUser.accountName &&
          userNameInput.value === this.#data.activeUser.username
        ) {
          return;
        }
        dealWithUpdate();
      }.bind(this)
    );
  }

  resetScore(resetHighScore, handleRenderHighestScore) {
    const parentEl = this.#parentElement.querySelector(".account__setup--main");
    const resetBtn = parentEl.querySelector(".score__reset--btn");
    const scoreP = parentEl.querySelector(".highest__score");

    const dealWithReset = async function () {
      resetBtn.disabled = true;
      resetBtn.textContent = "Reseting...";
      resetBtn.style.cursor = "not-allowed";

      try {
        await resetHighScore();
        scoreP.textContent = `${this.#data.activeUser.highestScore}%`;
        handleRenderHighestScore();
        resetBtn.disabled = false;
        resetBtn.textContent = "Reset";
        resetBtn.style.cursor = "pointer";
      } catch (err) {
        resetBtn.disabled = false;
        resetBtn.textContent = "Reset";
        resetBtn.style.cursor = "pointer";
      }
    }.bind(this);

    resetBtn.addEventListener(
      "click",
      function () {
        if (this.#data.activeUser.highestScore === 0) {
          return;
        }

        dealWithReset();
      }.bind(this)
    );
  }

  deleteAccount(deleteUser) {
    const parentEl = this.#parentElement.querySelector(".account__setup--main");
    const deleteBtn = parentEl.querySelector(".account__delete--btn");
    const dealWithDelete = async function () {
      deleteBtn.disabled = true;
      deleteBtn.textContent = "Deleting...";
      deleteBtn.style.cursor = "not-allowed";
      try {
        await deleteUser();
        deleteBtn.textContent = "Deleted";
        location.reload();
      } catch (err) {
        deleteBtn.disabled = false;
        deleteBtn.textContent = "Delete";
        deleteBtn.style.cursor = "pointer";
        console.log(err);
      }
    }.bind(this);

    deleteBtn.addEventListener(
      "click",
      function () {
        dealWithDelete();
      }.bind(this)
    );
  }
}

export default new SettingView();
