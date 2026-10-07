const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "vijay@localhost",
    database: "studentdb"
});

// Test MySQL connection
db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("Connected to MySQL!");
});

// Get all students
app.get("/students", (req, res) => {

    const sql = "SELECT * FROM students";

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

// Add a student
app.post("/students", (req, res) => {

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            error: "Name and email are required"
        });
    }

    const sql =
        "INSERT INTO students (name, email) VALUES (?, ?)";

    db.query(sql, [name, email], (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            message: "Student added successfully!",
            id: result.insertId
        });
    });
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});