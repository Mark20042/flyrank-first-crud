const express = require('express');


const app = express();
app.use(express.json());

// In-memory Database
let tasks = [
  { id: 1, title: 'Complete Stage 0 setup', done: true },
  { id: 2, title: 'Build CRUD endpoints', done: false },
  { id: 3, title: 'Publish code to GitHub', done: false }
];


app.get('/', (req, res) => {
  res.json({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

app.get('/tasks', (req, res) => {
  let result = tasks;
  if (req.query.done !== undefined) {
    const isDone = req.query.done === 'true';
    result = result.filter(t => t.done === isDone);
  }
  if (req.query.search) {
    const term = req.query.search.toLowerCase();
    result = result.filter(t => t.title.toLowerCase().includes(term));
  }
  res.json(result);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: `Task ${id} not found` });
  res.json(task);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
});