const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors')
const path = require('path');

const app = express();
const port = 3000;
const file = path.join(__dirname, 'data.json')
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist/assessment')));
console.log(file);
// Endpoint to get data
app.get('/data', (req, res) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to save data
app.post('/data', (req, res) => {
    const newData = req.body;
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading user data.');
        }
        let jsonData = JSON.parse(data);
        let numbers = jsonData.numbers;
        numbers=newData;
        jsonData.numbers = numbers;
        fs.writeFile(file, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error writing file');
                return;
            }
            res.status(200).send('Data saved');
        });
    });
});
app.post('/data/users', (req, res) => {
    const newUser = req.body;

    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading user data.');
        }
        let jsonData = JSON.parse(data);
        let users = jsonData.users;
        users.push(newUser);
        jsonData.users = users;
        fs.writeFile(file, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error saving user data.');
            }

            res.status(200).send('User added successfully');
        });
    });
});
app.get('*', (req, res) => {
    
    res.sendFile(path.join(__dirname, 'dist/assessment/index.html'));
  });
app.listen(port, () => {
    path.join(__dirname, 'dist/assessment/index.html');
    console.log(`Server running at http://localhost:${port}`);
});
