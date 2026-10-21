
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Allow the local frontend and deployed frontend
const allowedOrigins = [
    "http://localhost:3000",
    ...(process.env.FRONTEND_URL || "")
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("CORS origin not allowed"));
    }
}));

app.use(express.json());

// Student schema for MongoDB
const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        }
    },
    { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Student Management API is running"
    });
});

// Get all students
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        console.error("Fetch students error:", error.message);
        res.status(500).json({
            message: "Unable to fetch students"
        });
    }
});

// Add a student
app.post("/api/students", async (req, res) => {
    try {
        const { name, email } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof email !== "string" ||
            !email.trim()
        ) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const student = await Student.create({
            name: name.trim(),
            email: email.trim()
        });

        res.status(201).json({
            message: "Student added successfully",
            student
        });
    } catch (error) {
        console.error("Add student error:", error.message);
        res.status(500).json({
            message: "Unable to add student"
        });
    }
});

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from backend/.env");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB Atlas");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Backend startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
