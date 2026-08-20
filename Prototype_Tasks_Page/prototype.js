// Array to store all tasks
let tasks = [];

// Grab the form, input box, and list from the page
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Draws all tasks onto the page
function renderTasks() {
  // Clear the list before redrawing it
  taskList.innerHTML = "";

  tasks.forEach(function (task) {
    // Create a list item for this task
    const li = document.createElement("li");
    if (task.completed) {
      li.classList.add("completed"); // style it if done
    }

    // Text showing the task title
    const span = document.createElement("span");
    span.textContent = task.title;

    // Container to hold the buttons
    const buttonGroup = document.createElement("div");

    // Button to mark task complete/undo
    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.addEventListener("click", function () {
      task.completed = !task.completed; // flip completed status
      renderTasks(); // redraw list with updated status
    });

    // Button to delete the task
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      // Keep every task except the one that was clicked
      tasks = tasks.filter(function (t) {
        return t.id !== task.id;
      });
      renderTasks(); // redraw list without the deleted task
    });

    // Put buttons into their container
    buttonGroup.appendChild(completeBtn);
    buttonGroup.appendChild(deleteBtn);

    // Put text and buttons into the list item
    li.appendChild(span);
    li.appendChild(buttonGroup);

    // Add the finished list item to the page
    taskList.appendChild(li);
  });
}

// Runs when the form is submitted (user adds a new task)
taskForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop page from refreshing

  const title = taskInput.value.trim();
  if (title === "") return; // ignore empty input

  // Add the new task to the array
  tasks.push({
    id: Date.now(), // unique id based on current time
    title: title,
    completed: false,
  });

  taskInput.value = ""; // clear the input box
  renderTasks(); // redraw list with the new task
});
