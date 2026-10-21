
"use client";

import { useCallback, useEffect, useState } from "react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function Home() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/students`);
      if (!response.ok) throw new Error("Could not load students.");

      const data = await response.json();
      setStudents(data);
      setError(false);
    } catch (err) {
      setMessage(err.message || "Cannot connect to the backend.");
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add student.");
      }

      setName("");
      setEmail("");
      setMessage("Student added successfully!");
      setError(false);
      await loadStudents();
    } catch (err) {
      setMessage(err.message || "Something went wrong.");
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>SM</div>
          <div>
            <h1 style={styles.headerTitle}>Student Management</h1>
            <p style={styles.headerSubtitle}>Student records dashboard</p>
          </div>
        </div>
      </header>

      <div style={styles.container}>
        <section style={styles.intro}>
          <p style={styles.eyebrow}>DASHBOARD</p>
          <h2 style={styles.title}>Manage your students</h2>
          <p style={styles.description}>
            Add students and view the records stored in your database.
          </p>
        </section>

        <section style={styles.stats}>
          <div>
            <p style={styles.statLabel}>Total Students</p>
            <p style={styles.statNumber}>{students.length}</p>
          </div>
          <div style={styles.statIcon}>♙</div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Add New Student</h2>
          <p style={styles.cardDescription}>
            Enter the student details below.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label} htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />

            <label style={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />

            <button type="submit" disabled={saving} style={styles.button}>
              {saving ? "Saving..." : "+ Add Student"}
            </button>
          </form>

          {message && (
            <p
              role="status"
              style={{
                ...styles.message,
                color: error ? "#b42318" : "#18794e",
                background: error ? "#fef3f2" : "#ecfdf3",
              }}
            >
              {message}
            </p>
          )}
        </section>

        <section style={styles.card}>
          <div style={styles.listHeader}>
            <div>
              <h2 style={styles.cardTitle}>Student Records</h2>
              
            </div>
            <button
              type="button"
              onClick={loadStudents}
              style={styles.refreshButton}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p style={styles.empty}>Loading student records...</p>
          ) : students.length === 0 ? (
            <p style={styles.empty}>No students found. Add your first student above.</p>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>Email Address</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id || student.id}>
                      <td style={styles.td}>{student.name}</td>
                      <td style={styles.td}>{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer style={styles.footer}>
          Student Management System · Powered by Next.js, Express and MongoDB
        </footer>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    color: "#172033",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    background: "#172554",
    color: "white",
    padding: "20px 24px",
  },
  headerInner: {
    maxWidth: "1000px",
    margin: "auto",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  logo: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "#3b82f6",
    display: "grid",
    placeItems: "center",
    fontWeight: "bold",
  },
  headerTitle: { fontSize: "20px", margin: 0 },
  headerSubtitle: { color: "#cbd5e1", fontSize: "13px", margin: "5px 0 0" },
  container: { maxWidth: "900px", margin: "auto", padding: "32px 20px" },
  intro: { marginBottom: "24px" },
  eyebrow: {
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "1.5px",
  },
  title: { fontSize: "30px", margin: "8px 0" },
  description: { color: "#64748b", lineHeight: 1.6 },
  stats: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "22px",
    marginBottom: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: { color: "#64748b", margin: "0 0 8px", fontSize: "14px" },
  statNumber: { fontSize: "32px", fontWeight: "bold", margin: 0 },
  statIcon: {
    background: "#dbeafe",
    color: "#1d4ed8",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "25px",
  },
  card: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "22px",
  },
  cardTitle: { margin: 0, fontSize: "19px" },
  cardDescription: { color: "#64748b", fontSize: "14px", margin: "8px 0 20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  label: { fontWeight: "bold", fontSize: "14px", marginTop: "5px" },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "15px",
    background: "white",
    color: "#172033",
  },
  button: {
    marginTop: "10px",
    padding: "13px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  message: { padding: "12px", borderRadius: "8px", fontSize: "14px" },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  refreshButton: {
    padding: "9px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
  },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: {
    padding: "13px 10px",
    background: "#f8fafc",
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "13px",
  },
  td: { padding: "14px 10px", borderBottom: "1px solid #e2e8f0", fontSize: "14px" },
  empty: { color: "#64748b", padding: "20px 0", lineHeight: 1.5 },
  footer: { textAlign: "center", color: "#94a3b8", fontSize: "12px", padding: "12px" },
};
