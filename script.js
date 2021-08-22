const heading = document.querySelector(".heading");
const description = document.querySelector(".description");
const list = document.querySelector(".todo");
const form = document.querySelector(".form");
const trash = document.querySelector(".fa-trash-alt");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnClose = document.querySelector(".btn--close-modal");
const modalHeading = document.querySelector(".modal__heading");
const modalDescription = document.querySelector(".modal__description");
const btnUpdate = document.querySelector(".update");
const header = document.querySelector(".todo-intro");
const sort = document.querySelector(".sort");
const headerText = document.querySelector(".header__text");
const completedCount = document.querySelector(".summary__value--in");
const inprogressCount = document.querySelector(".summary__value--out");
// const submitBtn = document.querySelector(".form__btn");

//token - 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

class Todo {
  date = new Date();
  year = this.date.getFullYear();
  month = this.date.getMonth();
  day = this.date.getDate();
  hours = this.date.getHours();
  minutes = this.date.getMinutes();
  seconds = this.date.getSeconds();
  id = (Date.now() + "").slice(-10);
  completed = false;

  constructor(heading, description) {
    this.heading = heading;
    this.description = description;
  }
}

class App {
  #todos = [];
  #sortedTodos = [];
  #todoIndex;
  #todoUpdate;
  #completedCount = 0;
  #inprogressCount = 0;
  #sorted = false;

  constructor() {
    this._getLocalStorage();
    form.addEventListener("submit", this._newTodo.bind(this));
    list.addEventListener("click", this._removeTodo.bind(this));
    sort.addEventListener("click", this._sorting.bind(this));
  }
  _newTodo(e) {
    e.preventDefault();

    const headingtodo = heading.value;
    const descriptiontodo = description.value;

    let todo;

    todo = new Todo(headingtodo, descriptiontodo);

    this.#todos.push(todo);

    this._renderTodo(todo);
    let x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 2000);

    this._clearForm();
    heading.focus();
    ++this.#inprogressCount;
    this._setLocalStorage();
    this._summaryTodo(this.#completedCount, this.#inprogressCount);
  }

  _renderTodo(todo) {
    // const year = todo.date;
    // console.log(year);
    const todorender = `
          <div class="todo__list ${
            todo.completed ? "todo__completed" : "todo__progressing"
          }" data-id=${todo.id}>
          <div class="content">
          <div class="header">
          <div class="div1">
          <h2 class="${todo.completed ? "completed__text" : ""}">${
      todo.heading
    }</h2>
          </div>
          <div class="div2">
          <p>${todo.day}/${todo.month + 1}/${todo.year} ${todo.hours}:${
      todo.minutes
    }:${todo.seconds}</p>
          <i class="fa fa-check ${todo.completed ? "completed" : ""}" ></i>
          <i class="fas fa-trash-alt" aria-hidden="true"></i>
          <i class="fas fa-pen" aria-hidden="true"></i>
          
          </div>
          </div>
            <p>${todo.description}</p>
          </div>
        </div>
          `;
    list.insertAdjacentHTML("afterbegin", todorender);
  }

  _clearForm() {
    heading.value = description.value = "";
  }
  _removeTodo(e) {
    const todoEl = e.target.closest(".todo__list");

    if (!todoEl) return;

    if (e.target.className === "fas fa-trash-alt") {
      this.#todoIndex = this.#todos.findIndex(
        (todo) => todo.id === todoEl.dataset.id
      );
      this.#todos[this.#todoIndex].completed === true
        ? --this.#completedCount
        : --this.#inprogressCount;

      this.#todos.splice(this.#todoIndex, 1);

      this._setLocalStorage();

      location.reload();
    }

    if (e.target.className === "fas fa-pen") {
      e.preventDefault();
      modal.classList.remove("hidden");
      overlay.classList.remove("hidden");

      this.#todoIndex = this.#todos.findIndex(
        (todo) => todo.id === todoEl.dataset.id
      );

      this.#todoUpdate = this.#todos.find((todo, i) => i === this.#todoIndex);

      modalHeading.value = this.#todoUpdate.heading;
      modalDescription.value = this.#todoUpdate.description;

      btnUpdate.addEventListener("click", this._updateTodo.bind(this));

      btnClose.addEventListener("click", this._btnClosefn);
      overlay.addEventListener("click", this._btnClosefn);
    }

    if (e.target.className === "fa fa-check ") {
      e.preventDefault();
      //   console.log("check");

      this.#todoIndex = this.#todos.findIndex(
        (todo) => todo.id === todoEl.dataset.id
      );

      this.#todos[this.#todoIndex].completed = true;
      ++this.#completedCount;
      this.#inprogressCount > 0
        ? --this.#inprogressCount
        : this.#inprogressCount;

      this._setLocalStorage();

      location.reload();
    }
  }
  _btnClosefn() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  }

  _updateTodo(e) {
    e.preventDefault();

    this.#todos.forEach((_, i) => {
      if (i === this.#todoIndex) {
        this.#todos[i].heading = modalHeading.value;
        this.#todos[i].description = modalDescription.value;
        return;
      }
      this._btnClosefn();
    });

    this._setLocalStorage();

    location.reload();
  }

  _summaryTodo(summaryC, summaryP) {
    console.log(summaryC, summaryP);
    completedCount.textContent = summaryC;
    inprogressCount.textContent = summaryP;
  }

  _sortTodo() {
    this.#sortedTodos.sort((a, b) => {
      return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
    });
  }

  _sorting() {
    this.#sortedTodos = this.#todos;
    this._sortTodo();
    this.#sorted = true;
    this._setLocalStorage();
    location.reload();
  }

  _setLocalStorage() {
    console.log(this.#completedCount, this.#inprogressCount);
    localStorage.setItem("sorted", JSON.stringify(this.#sorted));
    // const sorted = JSON.parse(localStorage.getItem("sorted"));
    localStorage.setItem("todos", JSON.stringify(this.#todos));
    localStorage.setItem("completed", JSON.stringify(this.#completedCount));
    localStorage.setItem("inprogress", JSON.stringify(this.#inprogressCount));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("todos"));
    const summaryC = JSON.parse(localStorage.getItem("completed"));
    const summaryP = JSON.parse(localStorage.getItem("inprogress"));
    if (!data) return;

    this.#todos = data;
    this.#completedCount = summaryC;
    this.#inprogressCount = summaryP;

    this._summaryTodo(summaryC, summaryP);

    this.#todos.forEach((todo) => {
      this._renderTodo(todo);
    });
  }
}

const app = new App();
