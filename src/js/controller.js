"use strict";
import {
  state,
  login,
  getJokes,
  updateSetupObj,
  fetchQuiz,
  setActiveQuestion,
  updateFinal,
  setHighScore,
  gameSetupObj,
  updateAccount,
  resetHighScore,
  createAccount,
  storeAccountToLocal,
  checkLocal,
  deleteUser,
  getAllPlayers,
} from "./model";
import loginView from "./loginview";
import signupView from "./signupView";
import dashboardView from "./dashboardView";
import participiansView from "./participiansView";
import settingView from "./settingView";
import jokesview from "./jokesview";
import quizsetupView from "./quizsetupView";
import quizView from "./quizView";
import scoreview from "./scoreview";

const handleGetAllUsers = function () {
  participiansView.renderMarkup(state, getAllPlayers);
};

const logUserIn = function () {
  dashboardView.renderDashboard(
    state,
    handleJokesRender,
    handleAccountSetting,
    handleGetAllUsers
  );

  quizsetupView.renderQuizSetup(handleQuizStartEvent);
};

const handleSignup = function () {
  signupView.dealWithSignup(createAccount, storeAccountToLocal, logUserIn);
};

const handleSignupRender = function () {
  signupView.renderMarkup(handleSignup, logUserIn);
};

const handleAccountDelete = function () {
  settingView.deleteAccount(deleteUser);
};

const handleAccountSetting = function () {
  settingView.renderMarkup(state, handleAccountUpdate, handleAccountDelete);
};

const handleQuizStartEvent = function () {
  quizsetupView.quizStartEvent(hadleQuizSetup);
};

const handleJokesRender = function () {
  jokesview.renderJokes(getJokes, state);
};

const hadleQuizSetup = function () {
  quizsetupView.selectSetupEle(updateSetupObj, hadleQuizRender);
};

const handleRenderHighestScore = function () {
  dashboardView.renderHighestScore(state.activeUser.highestScore);
};

const handleAccountUpdate = function () {
  settingView.updateNameUsr(updateAccount);
  settingView.resetScore(resetHighScore, handleRenderHighestScore);
};

const hadleQuizRender = function () {
  quizView.renderQuiz(
    fetchQuiz,
    setActiveQuestion,
    state,
    handleAnsBtn,
    handleScoreView,
    handleScoreUpdate,
    handleQuizStartEvent,
    setHighScore,
    handleRenderHighestScore
  );
};

const handleAnsBtn = function () {
  quizView.addEvent(handleScoreUpdate);
};

const handleScoreView = function () {
  scoreview.renderScoreMarkup(state, gameSetupObj);
};

const handleScoreUpdate = function (playerAns) {
  scoreview.updateScore(playerAns, updateFinal);
};

const handleLocalCheck = async function () {
  document.body.innerHTML = `<div class="pre__loader"><p>Loading... <i class="las la-spinner"></i></p></div>`;
  await checkLocal();

  if (state.isStoreToLocal) {
    logUserIn();
  }

  if (!state.isStoreToLocal) {
    //
    loginView.renderLoginView(handleSignupRender);
    const handleLogin = async function (usr, psd) {
      try {
        console.log(usr, psd);
        await login(usr, psd);
        console.log(state.isLogin, "Hi");
        if (state.isLogin) {
          logUserIn();
        }
      } catch (err) {
        throw new Error(err.message);
      }
    };
    loginView.dealWithLogin(handleLogin);
  }
};

handleLocalCheck();

console.log("Copyright by Big Logic!!!");
