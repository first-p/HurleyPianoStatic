
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


//Login endpoint 
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

// Sign up endpoint
app.post('/signup', (req, res) => {
    const { name, username, email, password } = req.body;

    // Check if username or email already exists
    const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkQuery, [username, email], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length > 0) {
            return res.json({ success: false, message: 'Username or email already exists.' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err.stack);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            // Insert new user into the database
            const insertQuery = 'INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [name, username, email, hash], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err.stack);
                    return res.status(500).json({ success: false, message: 'Internal server error' });
                }
                res.json({ success: true });
            });
        });
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000...');
});




