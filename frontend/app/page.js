"use client";

import { useEffect, useState } from "react";

export default function Home() {
    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("Loading students...");
    const [loading, setLoading] = useState(false);

    async function loadStudents() {
        try {
            const response = await fetch(`${apiUrl}/api/students`);

            if (!response.ok) {
                throw new Error("Could not load students");
            }

            const data = await response.json();
            setStudents(data);
            setMessage("");
        } catch {
            setMessage("Cannot connect to the backend.");
        }
    }

    useEffect(() => {
        loadStudents();
    }, []);

    async function addStudent(event) {
        event.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(`${apiUrl}/api/students`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to add student");
            }

            setStudents((previous) => [...previous, data]);
            setName("");
            setEmail("");
            setMessage("Student added successfully!");
        } catch (error) {
            setMessage(error.message || "Backend connection failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container">
            <header className="hero">
                <h1>Student Management</h1>
                <p>Manage students.</p>
            </header>

            <section className="panel">
                <h2>Add a Student</h2>

                <form onSubmit={addStudent}>
                    <label htmlFor="name">Student Name</label>
                    <input
                        id="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter full name"
                        required
                    />

                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="student@example.com"
                        required
                    />

                    <button disabled={loading}>
                        {loading ? "Adding..." : "Add Student"}
                    </button>
                </form>

                {message && <p role="status">{message}</p>}
            </section>

            <section className="panel">
                <h2>Student Records</h2>
                <p>{students.length} student(s) registered</p>

                {students.length === 0 ? (
                    <p>No student records available.</p>
                ) : (
                    <div className="student-list">
                        {students.map((student) => (
                            <article className="student" key={student.id}>
                                <div>
                                    <h3>{student.name}</h3>
                                    <p>{student.email}</p>
                                </div>
                                <span>#{student.id}</span>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <footer>Student Management System</footer>
        </main>
    );
}