import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { saveSession } = useAuth();
  const navigate = useNavigate();

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      saveSession(data);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    }
  }

  return (
    <main className="auth-layout">
      <form className="card auth-card" onSubmit={submit}>
        <h1>Welcome back</h1>
        {error && <p className="error">{error}</p>}
        <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
        <label>Password<input name="password" type="password" value={form.password} onChange={update} required /></label>
        <button className="primary" type="submit">Login</button>
        <p>New to CareTracker? <Link to="/register">Create an account</Link></p>
      </form>
    </main>
  );
}
