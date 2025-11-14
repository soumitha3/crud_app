const express = require('express');
const path = require('path');
const app = express();

app.use(express.json()); // parse JSON bodies

// Serve frontend static files
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

// In-memory "database"
let students = [];
let nextId = 1;

/**
 * Student:
 * { id: number, name: string, age: number, course: string }
 */

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// GET all
app.get('/students', (req, res) => res.json(students));

// POST create
app.post('/students', (req, res) => {
  const { name, age, course } = req.body;
  if (!name || age === undefined || !course) {
    return res.status(400).json({ message: 'name, age, and course are required' });
  }
  const student = { id: nextId++, name, age: Number(age), course };
  students.push(student);
  res.status(201).json(student);
});

// PATCH update
app.patch('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const s = students.find(x => x.id === id);
  if (!s) return res.status(404).json({ message: 'Student not found' });
  const { name, age, course } = req.body;
  if (name !== undefined) s.name = name;
  if (age !== undefined) s.age = Number(age);
  if (course !== undefined) s.course = course;
  res.json(s);
});

// DELETE
app.delete('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = students.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Student not found' });
  students.splice(idx, 1);
  res.status(204).send();
});

// Fallback to frontend app for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));

module.exports = app;
