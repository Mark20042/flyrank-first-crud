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



// --- STAGE 3: Create Endpoint ---
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: "Title is required and cannot be empty" });
  }
  const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = { id: nextId, title: title.trim(), done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
});