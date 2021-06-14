const Main = {

  tasksList: [],

  init: function() {
    this.cacheTasks();
    this.cacheSelectors();    
    this.bindEvents();
  },

  cacheSelectors: function() {
    this.$checkBoxes = document.querySelectorAll(".check");
    this.$inputTask = document.querySelector("#inputTask");
    this.$list = document.querySelector("#list");
    this.$removeButtons = document.querySelectorAll(".remove");
    this.$btnOk = document.querySelector("#btnOk");
  },

  cacheTasks: function() {
    const self = this;
    const storageTasks = localStorage.getItem("tasks");
    if (storageTasks) {
      this.tasksList = JSON.parse(storageTasks);
      this.tasksList.forEach( (item, index) => { self.addTaskHTML(item.task, index, item.done) }  );
    }
  },

  addTask: function(task, index) {
    // adiciona tarefa no HTML
    this.addTaskHTML(task, index)
    // adiciona tarefa no objeto JSON
    this.tasksList.push({task: task, done: false});
    // sava objeto JSON no local storage 
    this.saveTasks();
  },

  addTaskHTML: function(task, index, done) {
    const nomeCheckbox = "checkbox" + index;        
    const classDone = (done ? "done" : "");
    const checked = (done ? "checked" : "");
    document.querySelector("#list").innerHTML += `
    <li class=${classDone}>
      <input type="checkbox" class="check" id="${nomeCheckbox}" ${checked}>          
      <label class="task">${task}</label>      
      <button class="remove">x</button>
    </li>`;        
  },

  bindEvents: function() {
    const self = this;

    this.$checkBoxes.forEach(function(checkbox) {
      checkbox.onclick = self.Events.checkbox_click.bind(self);
    });

    // bind obriga que o 'this' seja o objeto parent (Main) e não o objeto invocado (input)
    this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this);

    this.$removeButtons.forEach( function(button) {
      button.onclick = self.Events.removeButton_click.bind(self);
    })

    this.$btnOk.onclick = self.Events.inputTask_btnOkClick.bind(this);
  },

  saveTasks: function() {
    const taskJSON = JSON.stringify(this.tasksList);
    localStorage.setItem('tasks', taskJSON);
  },  

  Events: {
    checkbox_click: function(e) {      
      const $li = e.target.parentElement;
      const task = e.target.parentElement.children[1].innerText;      
      const isDone = $li.classList.contains("done");      
      const index = this.tasksList.findIndex(i => i.task === task);

      // Atualiza estado da tarefa no objeto
      this.tasksList[index].done = !isDone;
      this.saveTasks();

      // Muda classe da tarefa no HTML
      if (!isDone) {
        $li.classList.add("done");        
        return;
      }
      $li.classList.remove("done");      
    },

    inputTask_keypress: function(e) {
      const task = e.target.value;
      if (e.key === "Enter" && task) {
        const index = this.$checkBoxes.length;
        this.addTask(task, index)
        e.target.value = "";
        this.cacheSelectors();
        this.bindEvents();
      }
      
    },

    inputTask_btnOkClick: function(e) {
      const task = this.$inputTask.value;    
      if (task) {
        const index = this.$checkBoxes.length;
        this.addTask(task, index)
        this.$inputTask.value = "";
        this.cacheSelectors();
        this.bindEvents();
      }  
    },

    removeButton_click: function(e) {
      const $li = e.target.parentElement; 
      const task = e.target.parentElement.children[1].innerText;      
      const index = this.tasksList.findIndex(i => i.task === task);
      
      // remove item do HTML
      $li.classList.add("removed");
      // remove item do objeto JSON
      this.tasksList.splice(index, 1);
      // sava objeto JSON no local storage 
      this.saveTasks();

      setTimeout(() => { $li.classList.add("hidden") }, 200);
    }
  },
};

Main.init();
