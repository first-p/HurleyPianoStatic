
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());  // Enable CORS for all routes

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cyzFoj-bys)',
    database: 'mydatabase'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    res.json({ success: true });
                } else {
                    res.json({ success: false, message: 'Incorrect login' });
                }
            });
        } else {
            res.json({ success: false, message: 'Incorrect login' });
        }
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000...');
});

