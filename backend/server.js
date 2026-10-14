require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));

app.use(express.json());

let students = [
    { id: 1, name: "Rahul Patel", email: "rahul@example.com" },
    { id: 2, name: "Priya Shah", email: "priya@example.com" }
];

let nextId = 3;

app.get("/", (req, res) => {
    res.json({
        message: "Student Management API is running"
    });
});

app.get("/api/students", (req, res) => {
    res.json(students);
});

app.post("/api/students", (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    const student = {
        id: nextId++,
        name: name.trim(),
        email: email.trim()
    };

    students.push(student);

    res.status(201).json(student);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});