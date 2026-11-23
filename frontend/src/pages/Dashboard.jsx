import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const content = {
    patient: ["Live virtual queue", "Daily treatment checklist", "Weekly adherence progress"],
    receptionist: ["Virtual queue control", "Patient join/leave queue", "Next patient action"],
    doctor: ["Treatment plan templates", "Patient assignment", "Adherence overview"]
  };

  return (
    <main className="page">
      <section className="card">
        <h1>Welcome, {user?.name}</h1>
        <p>CareTracker role: <strong>{user?.role}</strong></p>
        <div className="feature-grid">
          {(content[user?.role] || []).map((feature) => (
            <article className="feature" key={feature}>{feature}</article>
          ))}
        </div>
      </section>
    </main>
  );
}
