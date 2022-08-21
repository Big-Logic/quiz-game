import * as constants from "./constant";

export const state = {
  isLogin: false,
  isStoreToLocal: false,
  allPlayers: undefined,
  activeUser: undefined,
  activeUserJokes: "",
  quizQuestions: [],
  activeQuestion: {
    questionIndexNext: 0,
    question: "",
    answers: [],
    correctAns: "",
  },
  quizLength: 0,
  scorePerQuestion: 0,
  finalScore: 0,
};

export const gameSetupObj = {
  category: {
    num: "18",
    name: "Computers",
  },
  amount: 20,
  difficulty: "easy",
};

const createUser = async function (obj) {
  try {
    const response = await fetch(`${constants.API_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": constants.API_KEY,
        "X-Bin-Name": obj.username,
      },
      body: JSON.stringify({
        accoun: [obj],
      }),
    });
    if (response.ok) {
      const result = await response.json();
      const [data] = result.record.accoun;
      data.id = result.metadata.id;
      updataAllPlayers(data.accountName);

      return data;
    }
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const updateUser = async function (obj, pincode) {
  try {
    const response = await fetch(`${constants.API_ENDPOINT}${pincode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": constants.API_KEY,
        "X-Bin-Versioning": false,
      },
      body: JSON.stringify({
        accoun: [obj],
      }),
    });
  } catch (err) {
    throw new Error("An Error occur");
  }
};
const updateAllUser = async function (obj, pincode) {
  try {
    const response = await fetch(`${constants.API_ENDPOINT}${pincode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": constants.API_KEY,
        "X-Bin-Versioning": false,
      },
      body: JSON.stringify({
        allPlayers: obj,
      }),
    });

    // if (response.ok) {
    //   console.log('');
    // }
  } catch (err) {
    throw new Error("An Error occur");
  }
};

const fetchUser = async function (pincode) {
  try {
    const response = await fetch(`${constants.API_ENDPOINT}${pincode}`, {
      method: "GET",
      headers: {
        "X-Master-Key": constants.API_KEY,
        "X-ACCESS-KEY": constants.ACCESS_KEY,
      },
    });
    if (!response.ok) {
      throw new Error("Username or Pincode is incorrect!!");
    }
    const result = await response.json();
    const [data] = result.record.accoun;

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
const fetchAllUser = async function (pincode) {
  try {
    const response = await fetch(`${constants.API_ENDPOINT}${pincode}`, {
      method: "GET",
      headers: {
        "X-Master-Key": constants.API_KEY,
        "X-ACCESS-KEY": constants.ACCESS_KEY,
      },
    });
    if (!response.ok) {
      throw new Error("Username or Pincode is incorrect!!");
    }
    const result = await response.json();
    const data = result.record.allPlayers;

    return data;
  } catch (err) {
    throw new Error(
      "Unable to get participians!! An unexpected error occured!!"
    );
  }
};

export const deleteUser = async function () {
  try {
    const response = await fetch(
      `${constants.API_ENDPOINT}${state.activeUser.id}`,
      {
        method: "DELETE",
        headers: {
          "X-Master-Key": constants.API_KEY,
        },
      }
    );

    if (response.ok) {
      if (localStorage.getItem("activeUser")) {
        localStorage.clear();
      }
    }
  } catch (err) {
    throw new Error("An error Occured!!");
  }
};

export const login = async function (userName, pincode) {
  try {
    const userData = await fetchUser(pincode);
    console.log(userData);
    if (userData.username !== userName) {
      throw new Error("Username or Pincode is incorrect!!");
    }
    state.isLogin = true;
    state.activeUser = userData;
  } catch (err) {
    throw new Error(`${err.message}`);
  }
};

export const getJokes = async function () {
  try {
    const response = await fetch(constants.JOKE_ENDPOINT);

    if (response.ok) {
      const result = await response.json();
      const { jokes } = result;
      state.activeUserJokes = jokes;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

//the quiz game func

export const updateSetupObj = function (
  category,
  categoryName,
  amount,
  difficulty
) {
  (gameSetupObj.category.num = category),
    (gameSetupObj.category.name = categoryName),
    (gameSetupObj.amount = amount),
    (gameSetupObj.difficulty = difficulty);
};

export const fetchQuiz = async function () {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${gameSetupObj.amount}&category=${gameSetupObj.category.num}&difficulty=${gameSetupObj.difficulty}&type=multiple`
    );
    if (response.ok) {
      const result = await response.json();
      state.quizQuestions = result.results;
      resetStateData();
      state.quizLength = state.quizQuestions.length;
      state.scorePerQuestion = 100 / state.quizLength;

      setActiveQuestion();
    }
  } catch (err) {
    throw new Error(
      "We were unable to get your quiz please connect to the internet and try later"
    );
  }
};

export const storeAccountToLocal = function () {
  localStorage.setItem("activeUser", JSON.stringify(state.activeUser));
};

export const checkLocal = async function () {
  if (!localStorage.getItem("activeUser")) return;

  state.isStoreToLocal = true;
  state.activeUser = JSON.parse(localStorage.getItem("activeUser"));
  state.activeUser = await fetchUser(state.activeUser.id);
};

//set question to display
export const setActiveQuestion = function () {
  const activeQues =
    state.quizQuestions[state.activeQuestion.questionIndexNext];
  state.activeQuestion.question = activeQues.question;
  state.activeQuestion.correctAns = activeQues.correct_answer;

  const answers = activeQues.incorrect_answers;
  answers.push(activeQues.correct_answer);

  const mainAns = [];

  //get a random answer array
  while (mainAns.length < 4) {
    const randomInt = Math.floor(Math.random() * (4 - 0) + 0);
    if (mainAns.includes(answers[randomInt])) {
      continue;
    }
    mainAns.push(answers[randomInt]);
  }

  state.activeQuestion.answers = mainAns;
  state.activeQuestion.questionIndexNext += 1;
};

export const updateFinal = function () {
  state.finalScore += state.scorePerQuestion;
};

const resetStateData = function () {
  state.activeQuestion.questionIndexNext = 0;
  state.finalScore = 0;
};

export const updateAccount = async function (accountName, accountUserName) {
  state.activeUser.accountName = accountName;
  state.activeUser.username = accountUserName;

  try {
    await updateUser(state.activeUser, state.activeUser.id);
    state.activeUser = await fetchUser(state.activeUser.id);
  } catch (err) {
    throw new Error("An Error occured!!");
  }
};

export const setHighScore = async function () {
  if (state.finalScore <= state.activeUser.highestScore) return;

  state.activeUser.highestScore = Math.ceil(state.finalScore);
  updateUser(state.activeUser, state.activeUser.id);
};

export const resetHighScore = async function () {
  state.activeUser.highestScore = 0;
  try {
    await updateUser(state.activeUser, state.activeUser.id);
    state.activeUser = await fetchUser(state.activeUser.id);
  } catch (err) {
    throw new Error(err.message);
  }
};

export const createAccount = async function (firstname, lastname, username) {
  const acc = {
    accountName: `${firstname} ${lastname}`,
    username: username,
    password: "",
    highestScore: 0,
    favouriteJokes: [],
  };

  try {
    const response = await createUser(acc);
    state.activeUser = response;
    await updateUser(state.activeUser, state.activeUser.id);
    console.log();
    return state.activeUser.id;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

export const getAllPlayers = async function () {
  try {
    state.allPlayers = await fetchAllUser("62f89634e13e6063dc7a0b13");
  } catch (err) {
    throw new Error(err.message);
  }
};

const updataAllPlayers = async function (data) {
  try {
    const users = await fetchAllUser("62f89634e13e6063dc7a0b13");
    users.push(data);
    await updateAllUser(users, "62f89634e13e6063dc7a0b13");
  } catch (err) {
    console.log(err);
  }
};
