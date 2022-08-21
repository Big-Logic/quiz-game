import { setHighScore } from "./model";

class QuizView {
  #data;
  #parentElement = document.body;
  _ansBtnClickState = false;
  _intervalX;
  _timeOut = 30;
  _ansBtnEventHandler;

  /* Quiz view */
  _generateQuizMarkup(question) {
    const markup = `
    <div class="quiz__main--wrapper">
                  <div class='quiz__mainEL'>
                    <p class="quiz__question">
                      ${question.questionIndexNext}. &nbsp; &nbsp; ${question.question}
                    </p>

                    <div class="answer1__wrapper">
                      <button class="answer1__btn answer__btn">
                        (A)
                        <span id="answer" data-answer="${question.answers[0]}">${question.answers[0]}</span>
                      </button>
                    </div>
                    <div class="answer2__wrapper">
                      <button class="answer2__btn answer__btn">
                        (B)
                        <span id="answer" data-answer="${question.answers[1]}">${question.answers[1]}</span>
                      </button>
                    </div>
                    <div class="answer3__wrapper">
                      <button class="answer3__btn answer__btn">
                        (C)
                        <span id="answer" data-answer="${question.answers[2]}">${question.answers[2]}</span>
                      </button>
                    </div>
                    <div class="answer4__wrapper">
                      <button class="answer4__btn answer__btn">
                        (D)
                        <span id="answer" data-answer="${question.answers[3]}">${question.answers[3]}</span>
                      </button>
                    </div>
                  </div>
                    <div class="question__next--btn-wrapperandtimeout">
                      <div>
                        <p class="question__timeout">
                          Remaining <span class="timout__main"></span>
                        </p>
                      </div>
                      <div>
                        <button class="question__next--btn">Next</button>
                      </div>
                    </div>
                    </div>
    `;

    return markup;
  }

  //quiz func
  renderQuiz(
    fetchQuiz,
    setActiveQuestion,
    data,
    handleAnsBtn,
    handleScoreView,
    handleScoreUpdate,
    handleQuizStartEvent,
    setHighScore,
    handleRenderHighestScore
  ) {
    this.#data = data;
    const playBtn = this.#parentElement.querySelector(".quiz__start--btn");
    if (!playBtn) return;

    const parentEl = this.#parentElement.querySelector(".quiz__main");

    //do this while getting quiz from the server
    const handleQuiz = async function () {
      parentEl.innerHTML =
        '<p class="quiz__loader">Loading Quiz <i class="las la-spinner"></i></p>';
      try {
        await fetchQuiz();
        const question = this.#data.activeQuestion;
        parentEl.innerHTML = "";
        parentEl.insertAdjacentHTML(
          "beforeend",
          this._generateQuizMarkup(question)
        );
        handleScoreView();
        handleAnsBtn();
        this._getRemainingTime(handleScoreUpdate);
        this._renderNewQuestion(
          setActiveQuestion,
          handleAnsBtn,
          handleScoreUpdate,
          handleQuizStartEvent,
          setHighScore,
          handleRenderHighestScore
        );
      } catch (err) {
        parentEl.innerHTML = `<p class="quiz__loader">${err.message}</p>`;
      }
    }.bind(this);
    //add eventlistener to the play button after rendering it
    playBtn.addEventListener(
      "click",
      function () {
        handleQuiz();
      }.bind(this)
    );
  }

  //generate a new html markup for rendering a new question
  _generateNewQuestionMarkup(question) {
    const markup = `
                    <p class="quiz__question">
                      ${question.questionIndexNext}. &nbsp; &nbsp; ${question.question}
                    </p>

                    <div class="answer1__wrapper">
                      <button class="answer1__btn answer__btn">
                        (A)
                        <span id="answer" data-answer="${question.answers[0]}">${question.answers[0]}</span>
                      </button>
                    </div>
                    <div class="answer2__wrapper">
                      <button class="answer2__btn answer__btn">
                        (B)
                        <span id="answer" data-answer="${question.answers[1]}">${question.answers[1]}</span>
                      </button>
                    </div>
                    <div class="answer3__wrapper">
                      <button class="answer3__btn answer__btn">
                        (C)
                        <span id="answer" data-answer="${question.answers[2]}">${question.answers[2]}</span>
                      </button>
                    </div>
                    <div class="answer4__wrapper">
                      <button class="answer4__btn answer__btn">
                        (D)
                        <span id="answer" data-answer="${question.answers[3]}">${question.answers[3]}</span>
                      </button>
                    </div>
    `;

    return markup;
  }

  _generateEndOfQuizMarkup() {}

  //perform this action after an option from the answer button is click
  /*
  it is for highlighting the right answer in green and
  the wrong answers in red
  */
  _chechCorrectAns(playerChosen = "none", handleScoreUpdate) {
    handleScoreUpdate(playerChosen);
    const corretAns = this.#data.activeQuestion.correctAns;

    const ansBtns = document.querySelectorAll(".answer__btn");
    if (this._timeOut === 0 && this._ansBtnClickState === false) {
      ansBtns.forEach((ele) => {
        if (
          ele.querySelector("span").dataset.answer ===
          this.#data.activeQuestion.correctAns
        ) {
          ele.style.color = "green";
          ele.style.borderColor = "green";
        } else {
          ele.style.color = "red";
          ele.style.borderColor = "red";
        }
      });
    }

    if (this._timeOut !== 0) {
      ansBtns.forEach((ele) => {
        if (ele.querySelector("span").dataset.answer === corretAns) {
          ele.style.color = "green";
          ele.style.borderColor = "green";
        }

        if (
          ele.querySelector("span").dataset.answer === playerChosen &&
          ele.querySelector("span").dataset.answer !== corretAns
        ) {
          ele.style.color = "red";
          ele.style.borderColor = "red";
        }
      });
    }
  }

  //remove event listener from answer buttons and questions container after the answers buttons is clicked
  _resetEvent(opt) {
    const parentEl = this.#parentElement.querySelector(".quiz__mainEL");
    parentEl.removeEventListener("click", this._ansBtnEventHandler);
    clearInterval(this._intervalX);
    this._ansBtnClickState = opt;
  }

  //add event listener to answer buttons and questions container that will travel down to the answers buttons
  addEvent(handleScoreUpdate) {
    const parentEl = this.#parentElement.querySelector(".quiz__mainEL");
    function answerBtnFun(e) {
      const targetEle = e.target.closest(".answer__btn");

      if (!targetEle) return;

      const playerAns = `${targetEle.querySelector("span").dataset.answer}`;
      this._chechCorrectAns(playerAns, handleScoreUpdate);
      this._resetEvent(true);
      //handleScoreUpdate(playerAns);
    }
    this._ansBtnEventHandler = answerBtnFun.bind(this);
    parentEl.addEventListener("click", this._ansBtnEventHandler);
  }

  //create timmer
  _getRemainingTime(handleScoreUpdate) {
    const parentEl = this.#parentElement.querySelector(".question__timeout");
    const timeOutELE = parentEl.querySelector(".timout__main");
    clearInterval(this._intervalX);
    timeOutELE.textContent = "";
    this._timeOut = 30;
    this._intervalX = setInterval(
      function () {
        const min = Math.floor(this._timeOut / 60);
        const sec = Math.floor(this._timeOut % 60);
        timeOutELE.textContent = `${min}:${
          this._timeOut < 10 ? "0" + sec : sec
        }`;
        if (this._timeOut === 0) {
          if (this._ansBtnClickState === false) {
            this._chechCorrectAns("_", handleScoreUpdate);
            this._resetEvent(true);
          }
        }
        this._timeOut--;
      }.bind(this),
      1000
    );
  }

  _renderNewQuestion(
    setActiveQuestion,
    handleAnsBtn,
    handleScoreUpdate,
    handleQuizStartEvent,
    setHighScore,
    handleRenderHighestScore
  ) {
    const parentEl = this.#parentElement.querySelector(".quiz__main");
    const nextBtn = parentEl.querySelector(".question__next--btn");

    nextBtn.addEventListener(
      "click",
      function () {
        if (this._ansBtnClickState === false) return;

        if (
          this.#data.activeQuestion.questionIndexNext ===
          this.#data.quizQuestions.length
        ) {
          const finalGd = Math.ceil(this.#data.finalScore);
          parentEl.innerHTML = `<div class="quiz__end--cont">
                      <h2 class="quiz__end--msg">Quiz Over</h2>
                      <div class="score__status--cont" title="Score">
                      <h2 class="score__status">${finalGd}%</h2>
                      </div>
                      
                    <button class="quiz__play--btn">Start another Quiz</button>
                  </div>`;
          if (finalGd < 70) {
            document.querySelector(".score__status--cont").style.borderColor =
              "red";
          } else {
            document.querySelector(".score__status--cont").style.borderColor =
              "green";
          }
          setHighScore();
          handleRenderHighestScore();
          const playBtn = this.#parentElement.querySelector(".quiz__play--btn");
          playBtn.addEventListener(
            "click",
            function () {
              clearInterval(this._intervalX);
              this._ansBtnClickState = false;
              this._timeOut = 30;
              handleQuizStartEvent();
            }.bind(this)
          );
          return;
        }
        setActiveQuestion();
        const quizCont = parentEl.querySelector(".quiz__mainEL");
        quizCont.innerHTML = "";
        quizCont.insertAdjacentHTML(
          "afterbegin",
          this._generateNewQuestionMarkup(this.#data.activeQuestion)
        );
        handleAnsBtn();
        this._ansBtnClickState = false;
        this._getRemainingTime(handleScoreUpdate);
      }.bind(this)
    );
  }
}

export default new QuizView();
