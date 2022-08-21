class ScoreView {
  #data;
  #parentElement = document.body;
  _passState = 0;
  _failState = 0;

  _generateScoreMarkup(gameSetupObj) {
    const markup = `
      <div class="quiz__detail--wrapper">
        <div class="quiz__detail--cont">
          <p>${gameSetupObj.category.name}</p>
          <p>Category</p>
        </div>
        <div class="quiz__detail--cont">
          <p>${gameSetupObj.difficulty}</p>
          <p>Difficulty</p>
        </div>
        <div class="quiz__detail--cont quiz__detail--passfail-wrapper">
          <div class="quiz__detail--passfail-cont">
            <div class="pass__fail--cont pass__fail--passct" >
            </div>
            <div>
                <p class ="pass__fail pass__fail--pass">${this._passState}</p>
            </div>
          </div>
          <div class="quiz__detail--passfail-cont">
            <div class="pass__fail--cont pass__fail--failct" >
            </div>
            <div>
                <p class ="pass__fail pass__fail--fail">${this._failState}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    return markup;
  }

  renderScoreMarkup(state, updateSetupObj) {
    this.#data = state;
    this._passState = 0;
    this._failState = 0;
    const parentEl = this.#parentElement.querySelector(".quiz__main--wrapper");
    parentEl.insertAdjacentHTML(
      "afterbegin",
      this._generateScoreMarkup(updateSetupObj)
    );
  }

  updateScore(userAns, updateFinal) {
    const parentEl = this.#parentElement.querySelector(
      ".quiz__detail--passfail-wrapper"
    );
    if (userAns === this.#data.activeQuestion.correctAns) {
      this._passState += 1;
      parentEl.querySelector(".pass__fail--pass").textContent = this._passState;
      updateFinal();
    } else {
      this._failState += 1;
      parentEl.querySelector(".pass__fail--fail").textContent = this._failState;
    }
  }
}

export default new ScoreView();
