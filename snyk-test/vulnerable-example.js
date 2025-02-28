// File: snyk-test/vulnerable-example.js

const express = require('express');
const app = express();

// XSS vulnerability
app.get('/user', (req, res) => {
    const userInput = req.query.name;
    res.send('<script>' + userInput + '</script>');  // Explicit XSS
});

// SQL Injection vulnerability (using a mock DB for simplicity)
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

app.post('/login', (req, res) => {
    const username = req.query.username;  // Using query for simplicity
    const password = req.query.password;
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;  // Clear SQL injection
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).send('Error');
        } else {
            res.send(rows);
        }
    });
});

// Command Injection vulnerability
const { exec } = require('child_process');
app.get('/ping', (req, res) => {
    const host = req.query.host;
    exec('ls ' + host, (err, stdout) => {  // Explicit command injection
        if (err) {
            res.status(500).send('Error');
        } else {
            res.send(stdout);
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
