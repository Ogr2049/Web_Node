const express = require('express');
const app = express();
const PORT = 3000;

let expenses = [];
let dailyLimit = {};

app.use(express.json());


app.post('/expenses', (req, res) => {
  const { name, category, price, date } = req.body;
  const expense = { name, category, price, date: new Date(date) };

  
  if (dailyLimit[date] && dailyLimit[date] < price) {
    return res.status(400).json({ message: `Daily limit exceeded for ${date}` });
  }

  
  if (name === '' || category === '' || price === 0 || date === '') {
    return res.status(400).json({ message: `Not all required fields found` });
  }

  expenses.push(expense);
  res.status(201).json(expense);
});


app.get('/expenses', (req, res) => {
  res.json(expenses);
});


app.post('/expenses/search', (req, res) => {
  const { date } = req.body;
  const filteredExpenses = expenses.filter(expense => {
    return expense.date.toDateString() === new Date(date).toDateString();
  });
  res.json(filteredExpenses);
});


app.post('/daily-limit', (req, res) => {
  const { date, limit } = req.body;
 
  if (limit < 0) {
    return res.status(400).json({ message: `Daily limit can not be less than 0` });
  }
  dailyLimit[date] = limit;
  res.status(201).json({ message: `Daily limit set for ${date}` });
});


app.get('/daily-limit/:date', (req, res) => {
  const { date } = req.params;
  const limit = dailyLimit[date] || 0;
  res.json({ limit });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
