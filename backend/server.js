const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const DATA_FILE = "tasks.json";

// Get all tasks
app.get("/tasks", (req, res) => {
  fs.readFile(DATA_FILE, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading file" });
    res.json(JSON.parse(data || "[]"));
  });
});

// Add new task
app.post("/tasks", (req, res) => {
  const newTask = req.body;
  fs.readFile(DATA_FILE, "utf-8", (err, data) => {
    let tasks = JSON.parse(data || "[]");
    tasks.push(newTask);
    fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Error saving task" });
      res.json(newTask);
    });
  });
});

// Update task (complete / toggle)
app.put("/tasks/:index", (req, res) => {
  const index = req.params.index;
  fs.readFile(DATA_FILE, "utf-8", (err, data) => {
    let tasks = JSON.parse(data || "[]");
    if (!tasks[index]) return res.status(404).json({ error: "Task not found" });
    tasks[index] = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Error updating task" });
      res.json(tasks[index]);
    });
  });
});

// Delete task
app.delete("/tasks/:index", (req, res) => {
  const index = req.params.index;
  fs.readFile(DATA_FILE, "utf-8", (err, data) => {
    let tasks = JSON.parse(data || "[]");
    if (!tasks[index]) return res.status(404).json({ error: "Task not found" });
    tasks.splice(index, 1);
    fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Error deleting task" });
      res.json({ success: true });
    });
  });
});

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
