const apiKey = "sk_live_12345_secret_key";
const express = require('express');
const app = express();
app.get('/user', (req, res) => {
    const userInput = req.query.name;
    res.send(`Hello, ${userInput}`);
});
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    db.all(query, (err, rows) => {
        if (err) { res.status(500).send('Error'); } else { res.send(rows); }
    });
});
const { exec } = require('child_process');
app.get('/ping', (req, res) => {
    const host = req.query.host;
    exec(`ping ${host}`, (err, stdout) => {
        if (err) { res.status(500).send('Error'); } else { res.send(stdout); }
    });
});
app.listen(3000, () => { console.log('Server running on port 3000'); });
