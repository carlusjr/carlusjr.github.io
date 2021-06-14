const Main = {
  tasksList: [],

  init: function () {
    this.cacheTasks();
    this.cacheSelectors();
    this.bindEvents();
  },

  cacheSelectors: function () {
    this.$checkBoxes = document.querySelectorAll(".check");
    this.$inputTask = document.querySelector("#inputTask");
    this.$list = document.querySelector("#list");
    this.$removeButtons = document.querySelectorAll(".remove");
    this.$btnOk = document.querySelector("#btnOk");
  },

  cacheTasks: function () {
    const self = this;
    const storageTasks = localStorage.getItem("tasks");
    if (storageTasks) {
      this.tasksList = JSON.parse(storageTasks);
      if (this.tasksList.length > 0) {
        const newList = this.tasksList.map((item, index) => {
          return { id: index, task: item.task, done: item.done };
        });
        this.tasksList = newList;
        this.saveTasks();
      }

      this.tasksList.forEach((item) => {
        self.addTaskHTML(item.id, item.task, item.done);
      });
    }
  },

  addTask: function (task) {
    // Remonta id do objeto JSON
    if (this.tasksList.length > 0) {
      const newList = this.tasksList.map((item, index) => {
        return { id: index, task: item.task, done: item.done };
      });
      this.tasksList = newList;
    }
    const newId = this.tasksList.length;

    // adiciona tarefa
    this.tasksList.push({ id: newId, task: task, done: false });

    // sava objeto JSON no local storage
    this.saveTasks();

    // Remonta lista
    this.$list.innerHTML = "";
    this.init();
  },

  addTaskHTML: function (id, task, done) {
    const nomeCheckbox = "checkbox" + id;
    const idLabel = "label" + id;
    const classDone = done ? "done" : "";
    const checked = done ? "checked" : "";
    document.querySelector("#list").innerHTML += `
    <li data-idtask=${id}>
      <input type="checkbox" class="check" id="${nomeCheckbox}" ${checked}>          
      <label id=${idLabel} class=${classDone}>${task}</label>      
      <button class="remove">x</button>
    </li>`;
  },

  bindEvents: function () {
    const self = this;

    this.$checkBoxes.forEach(function (checkbox) {
      checkbox.onclick = self.Events.checkbox_click.bind(self);
    });

    // bind obriga que o 'this' seja o objeto parent (Main) e não o objeto invocado (input)
    this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this);

    this.$removeButtons.forEach(function (button) {
      button.onclick = self.Events.removeButton_click.bind(self);
    });

    this.$btnOk.onclick = self.Events.inputTask_btnOkClick.bind(this);
  },

  saveTasks: function () {
    const taskJSON = JSON.stringify(this.tasksList);
    localStorage.setItem("tasks", taskJSON);
  },

  Events: {
    checkbox_click: function (e) {
      const $li = e.target.parentElement;
      const task = e.target.parentElement.children[1].innerText;
      const id = $li.dataset.idtask;
      const index = this.tasksList.findIndex(
        (item) => item.id == id && item.task == task
      );
      const isDone = !this.tasksList[index].done;

      // Atualiza estado da tarefa no objeto
      this.tasksList[index].done = isDone;
      this.saveTasks();

      // Muda classe da tarefa no HTML
      const idLabel = "#label"+id;
      const lblTask = document.querySelector(idLabel);
      if (isDone) lblTask.classList.add("done");
      else lblTask.classList.remove("done");
    },

    inputTask_keypress: function (e) {
      const task = e.target.value;
      if (e.key === "Enter" && task) {
        e.target.value = "";
        this.addTask(task);
      }
    },

    inputTask_btnOkClick: function (e) {
      const task = this.$inputTask.value;
      if (task) {
        this.$inputTask.value = "";
        this.addTask(task);
      }
    },

    removeButton_click: function (e) {
      const $li = e.target.parentElement;
      const task = e.target.parentElement.children[1].innerText;
      const id = $li.dataset.idtask;
      const index = this.tasksList.findIndex(
        (item) => item.id == id && item.task == task
      );

      // remove item do HTML
      $li.classList.add("removed");

      // remove item do objeto JSON
      this.tasksList.splice(index, 1);

      // sava objeto JSON no local storage
      this.saveTasks();

      setTimeout(() => {
        $li.classList.add("hidden");
      }, 200);
    },
  },
};

Main.init();
