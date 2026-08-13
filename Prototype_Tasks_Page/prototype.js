let tasks = [];

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach(function (task) {
    const li = document.createElement("li");
    if (task.completed) {
      li.classList.add("completed");
    }

    const span = document.createElement("span");
    span.textContent = task.title;

    const buttonGroup = document.createElement("div");

    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.addEventListener("click", function () {
      task.completed = !task.completed;
      renderTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      tasks = tasks.filter(function (t) {
        return t.id !== task.id;
      });
      renderTasks();
    });

    buttonGroup.appendChild(completeBtn);
    buttonGroup.appendChild(deleteBtn);
    li.appendChild(span);
    li.appendChild(buttonGroup);
    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = taskInput.value.trim();
  if (title === "") return;

  tasks.push({
    id: Date.now(),
    title: title,
    completed: false,
  });

  taskInput.value = "";
  renderTasks();
});
