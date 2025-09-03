const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".filter");

const API_URL = "http://localhost:5000/tasks";

// Fetch and render tasks
async function renderTasks(filter = "all") {
  const res = await fetch(API_URL);
  let tasks = await res.json();

  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    if (filter === "completed" && !task.completed) return;
    if (filter === "pending" && task.completed) return;

    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;
    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button class="complete-btn">✔</button>
        <button class="delete-btn">✖</button>
      </div>
    `;

    // Complete task
    li.querySelector(".complete-btn").addEventListener("click", async () => {
      task.completed = !task.completed;
      await fetch(`${API_URL}/${index}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      renderTasks(filter);
    });

    // Delete task
    li.querySelector(".delete-btn").addEventListener("click", async () => {
      await fetch(`${API_URL}/${index}`, { method: "DELETE" });
      renderTasks(filter);
    });

    taskList.appendChild(li);
  });
}

// Add new task
addBtn.addEventListener("click", async () => {
  const text = taskInput.value.trim();
  if (text) {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, completed: false }),
    });
    taskInput.value = "";
    renderTasks();
  }
});

// Filter tasks
filters.forEach(btn => {
  btn.addEventListener("click", () => renderTasks(btn.dataset.filter));
});

// Initial load
renderTasks();
