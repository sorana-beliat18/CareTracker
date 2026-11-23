import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  async function submit(event) {
    event.preventDefault();
    await api.patch("/auth/me", { name });
    setMessage("Profile updated");
  }

  return (
    <main className="page">
      <section className="card profile-card">
        <h1>User Profile</h1>
        {message && <p className="success">{message}</p>}
        <form onSubmit={submit}>
          <label>Name<input value={name} onChange={(event) => setName(event.target.value)} required /></label>
          <label>Email<input value={user?.email || ""} disabled /></label>
          <label>Role<input value={user?.role || ""} disabled /></label>
          <button className="primary" type="submit">Save</button>
        </form>
      </section>
    </main>
  );
}
