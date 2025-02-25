// server.js

const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Load environment variables

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files like index.html

dotenv.config(); // Load environment variables

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // If you have a password
    database: process.env.DB_NAME,
    port: process.env.DB_PORT // Add this line to specify the port
});  


// Connect to MySQL database
db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API endpoint to save questions and responses into the database
app.post('/save-to-db', (req, res) => {
  const { question, response } = req.body;

  if (!question || !response) {
    return res.status(400).json({ error: 'Both question and response are required' });
  }

  const query = 'INSERT INTO questions_reponses (question, reponse) VALUES (?, ?)';
  db.query(query, [question, response], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save to database' });
    }
    res.status(200).json({ message: 'Question and response saved successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
