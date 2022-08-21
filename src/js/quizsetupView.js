class QuizSetupView {
  #data;
  #parentElement = document.body;

  _generateQuizSetup() {
    const markup = `
    <section class="quiz__setup--main popup">
        <div class="quiz__setupmain--wrapper">
          <button type="button" class="setup__close--btn">
            <i class="las la-times-circle"></i>
          </button>
          <form action="#" class="game__setup">
            <header class="game__setup--header">
              <h2>Before You Start</h2>
            </header>

            <div class="category__setup game__setup--div">
              <label for="category">Category</label>
              <select id="category" name="category" required>
                <option value="9">General Knowledge</option>
                <option value="10">Books</option>
                <option value="11">Film</option>
                <option value="12">Music</option>
                <option value="14">Television</option>
                <option value="15">Video Games</option>
                <option value="17">Science & Nature</option>
                <option value="18">Computers</option>
                <option value="21">Sports</option>
                <option value="22">Geography</option>
                <option value="23">History</option>
              </select>
            </div>

            <div class="difficulty__setup game__setup--div">
              <label for="difficulty">difficulty</label>
              <select id="difficulty" name="difficulty" required>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div class="questionamount__setup game__setup--div">
              <label for="questionamount">How many questions?</label>
              <input
                type="number"
                id="questionamount"
                name="amount-of-question"
                min="15"
                max="20"
                required
              />
            </div>
            <div class="game__setup--div game__setup--btn-cont">
              <button type="button" class="setup__skip--btn game__setup--btn">
                skip
              </button>
              <button type="submit" class="setup__submit--btn game__setup--btn">
                Continue
              </button>
            </div>
          </form>
        </div>
      </section>
    `;

    return markup;
  }

  renderQuizSetup(handleQuizStartEvent) {
    const quizPlayBtn = this.#parentElement.querySelector(".quiz__play--btn");

    //the start a new quiz button
    quizPlayBtn.addEventListener(
      "click",
      function () {
        handleQuizStartEvent();
      }.bind(this)
    );
  }

  quizStartEvent(hadleQuizSetup) {
    this.#parentElement
      .querySelector(".main__content--wrapper")
      .insertAdjacentHTML("beforeend", this._generateQuizSetup());
    hadleQuizSetup();
  }

  /////////////////////////////

  //select and handle all game setup form elements
  selectSetupEle(updateSetupObj, hadleQuizRender) {
    const parentEl = this.#parentElement.querySelector(
      ".main__content--wrapper"
    );
    const setupForm = document.querySelector(".game__setup");
    const setupWrapper = parentEl.querySelector(".quiz__setup--main");
    const setupCategory = parentEl.querySelector("#category");
    const setupDifficulty = parentEl.querySelector("#difficulty");
    const setupQuestionAmount = parentEl.querySelector("#questionamount");
    const setupSaveBtn = parentEl.querySelector(".setup__submit--btn");
    const setupSkipBtn = parentEl.querySelector(".setup__skip--btn");
    const setupCloseBtn = parentEl.querySelector(".setup__close--btn");
    setupForm.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        const selectedOption =
          setupCategory.options[setupCategory.selectedIndex].text;
        updateSetupObj(
          setupCategory.value,
          selectedOption,
          setupQuestionAmount.value,
          setupDifficulty.value
        );
        this._skipSetup(hadleQuizRender);
        this._quitSetup(parentEl, setupWrapper);
      }.bind(this)
    );

    //button to close setup form
    setupCloseBtn.addEventListener(
      "click",
      function () {
        this._quitSetup(parentEl, setupWrapper);
      }.bind(this)
    );

    //button to skip quiz setup
    setupSkipBtn.addEventListener(
      "click",
      function () {
        this._skipSetup(hadleQuizRender);
        this._quitSetup(parentEl, setupWrapper);
      }.bind(this)
    );
  }

  //skip setup func
  _skipSetup(hadleQuizRender) {
    const markup = `
    <div class="quiz__play--btn-cont">
                    <button class="quiz__start--btn">Play Now</button>
                  </div>
    `;

    const parentEl = this.#parentElement.querySelector(".quiz__main");
    parentEl.innerHTML = "";
    parentEl.insertAdjacentHTML("beforeend", markup);
    hadleQuizRender();
  }

  //quit setup func
  _quitSetup(parentEl, ele) {
    parentEl.removeChild(ele);
  }
}

export default new QuizSetupView();
