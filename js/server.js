const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const crypto = require('crypto');
const mailgun = require('mailgun-js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes

// Database connection
const db = mysql.createConnection({
    host: 'localhost', // Replace with your database host
    user: 'fred_5_10_24', // Replace with your database user
    password: 'HdiS*@b82!13', // Replace with your database password
    database: 'newdatabase' // Replace with your database name
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Mailgun setup
const DOMAIN = "sandbox9cbb0eb1fb1d41b183f40f56b53724a0.mailgun.org";
const mg = mailgun({apiKey: "YOUR_PRIVATE_API_KEY", domain: DOMAIN});

// Login endpoint 
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

// Request password reset endpoint
app.post('/request-reset', (req, res) => {
    const { email } = req.body;

    // Check if email exists
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.json({ message: 'Email not found' });
        }

        const user = results[0];
        const token = crypto.randomBytes(20).toString('hex');
        const expires = Date.now() + 3600000; // 1 hour

        // Store the token and expiration in the database
        const updateQuery = 'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?';
        db.query(updateQuery, [token, expires, email], (err, result) => {
            if (err) {
                console.error('Error updating user:', err.stack);
                return res.status(500).json({ message: 'Internal server error' });
            }

            const mailOptions = {
                from: 'noreply@hurleypiano.com',
                to: user.email,
                subject: 'Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                      `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                      `http://secretbeachsolutions.com/reset/${token}\n\n` +
                      `If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };

            mg.messages().send(mailOptions, (err, body) => {
                if (err) {
                    console.error('Error sending email:', err.stack);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                res.json({ message: 'An email has been sent to ' + user.email + ' with further instructions.' });
            });
        });
    });
});

// Password reset endpoint
app.post('/reset/:token', (req, res) => {
    const { password } = req.body;
    const token = req.params.token;

    // Check if the token is valid and not expired
    const query = 'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > ?';
    db.query(query, [token, Date.now()], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.json({ message: 'Password reset token is invalid or has expired.' });
        }

        const user = results[0];

        // Hash the new password
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err.stack);
                return res.status(500).json({ message: 'Internal server error' });
            }

            // Update the user's password and clear the reset token and expiration
            const updateQuery = 'UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE email = ?';
            db.query(updateQuery, [hash, user.email], (err, result) => {
                if (err) {
                    console.error('Error updating user:', err.stack);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                res.json({ success: true, message: 'Password has been reset successfully.' });
            });
        });
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000...');
});
