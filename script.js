const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filters button");

// Load tasks when page loads
window.onload = loadTasks;

// Add task events
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filters button.active").classList.remove("active");
    btn.classList.add("active");
    applyFilter(btn.dataset.filter);
  });
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const task = { text: taskText, completed: false };
  saveTask(task);
  renderTask(task, true);

  taskInput.value = "";
}

function renderTask(task, animate = false) {
  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;

  const completeBtn = document.createElement("button");
  completeBtn.innerHTML = "✅";
  completeBtn.className = "btn complete";
  completeBtn.onclick = () => toggleComplete(task.text, li);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑";
  deleteBtn.className = "btn delete";
  deleteBtn.onclick = () => deleteTask(task.text, li);

  li.appendChild(span);
  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);

  taskList.appendChild(li);

  if (animate) {
    li.classList.add("adding");
    setTimeout(() => li.classList.remove("adding"), 300);
  }
}

function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => renderTask(task));
}

function toggleComplete(taskText, li) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(t => {
    if (t.text === taskText) t.completed = !t.completed;
    return t;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  li.classList.toggle("completed");
}

function deleteTask(taskText, li) {
  li.classList.add("removing");
  setTimeout(() => {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskList.removeChild(li);
  }, 300);
}

function applyFilter(filter) {
  const tasks = taskList.querySelectorAll("li");
  tasks.forEach(li => {
    switch (filter) {
      case "all": li.style.display = "flex"; break;
      case "completed": li.style.display = li.classList.contains("completed") ? "flex" : "none"; break;
      case "pending": li.style.display = !li.classList.contains("completed") ? "flex" : "none"; break;
    }
  });
}
