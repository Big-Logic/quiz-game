import image from "../images/male.png";

class ParticipiansView {
  #data;
  #parentElement = document.body;
  #participians;

  _generateMarkup(participian) {
    const markup = `
      <div class="participian">
                  <img
                    src="${image}"
                    alt="Alfred"
                    class="participian__image"
                  />
                  <p>${participian}</p>
                </div>
      `;

    return markup;
  }

  renderMarkup(data, getAllUsers) {
    this.#data = data;
    const parentEl = this.#parentElement.querySelector(".participians");
    let allM = ``;

    const dealWithGetAllUsers = async function () {
      parentEl.innerHTML =
        '<p class="quiz__loader">Loading <i class="las la-spinner"></i></p>';

      try {
        await getAllUsers();
        const allPlayersSort = this.#data.allPlayers.sort();
        allPlayersSort.forEach((ele) => {
          allM += this._generateMarkup(ele);
        });

        parentEl.innerHTML = "";
        parentEl.insertAdjacentHTML("beforeend", allM);
      } catch (err) {
        parentEl.innerHTML = `<p class="quiz__loader">${err.message}</p>`;
      }
    }.bind(this);

    dealWithGetAllUsers();
  }
}

export default new ParticipiansView();
