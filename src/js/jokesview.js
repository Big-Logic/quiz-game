class JokesView {
  renderJokes(getJokes, data) {
    const jokeContent = document.querySelector(".joke__content");

    const getAndDisplayJoke = function () {
      const [jokeObj] = data.activeUserJokes;
      jokeContent.innerHTML = "";
      jokeContent.textContent = jokeObj.joke;
      let counter = 0;
      setInterval(() => {
        if (counter === data.activeUserJokes.length) {
          counter = 0;
        }
        jokeContent.classList.add("joke__content--hide");
        jokeContent.textContent = data.activeUserJokes[counter].joke;
        counter += 1;
        setTimeout(() => {
          jokeContent.classList.remove("joke__content--hide");
        }, 500);
      }, 20000);
    };

    const handleJokes = async function () {
      jokeContent.innerHTML =
        '<p class="quiz__loader">Loading Joke <i class="las la-spinner"></i></p>';
      try {
        await getJokes();
        getAndDisplayJoke();
      } catch (err) {
        jokeContent.innerHTML =
          '<p class="quiz__loader">Unable to get jokes!! <br />An unexpected error occured!!</p>';
      }
    };

    handleJokes();
  }
}

export default new JokesView();
