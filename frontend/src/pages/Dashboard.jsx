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
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AppointmentCard from "../components/AppointmentCard";
import { getAppointments, bookAppointment } from "../services/careService";
import { Plus } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ patient: "", date: "", reason: "", doctor: "" });

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getAppointments();
      setAppointments(data);
    };
    fetchAppointments();
  }, []);

  const handleAddAppointment = async () => {
    const createdAppointment = await bookAppointment(newAppointment);
    setAppointments([...appointments, createdAppointment]);
    setShowForm(false);
    setNewAppointment({ patient: "", date: "", reason: "", doctor: "" });
  };

  const handleUpdateStatus = async (id, status) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, status } : appointment
    );
    setAppointments(updatedAppointments);
  };

  return (
    <main className="bg-[#F6F8F7] min-h-screen">
      <section className="card p-6">
        <h1 className="text-2xl font-bold text-teal-600">Dashboard</h1>
        <p className="text-sm text-slate-500">Welcome, {user?.name}</p>
        <div className="flex items-center justify-between mt-4">
          <button onClick={() => setShowForm(true)} className="bg-teal-600 text-white px-4 py-2 rounded flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        </div>
        {showForm && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Patient Name"
              value={newAppointment.patient}
              onChange={(e) => setNewAppointment({ ...newAppointment, patient: e.target.value })}
              className="border border-slate-300 rounded px-2 py-1 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Date"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
              className="border border-slate-300 rounded px-2 py-1 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Reason"
              value={newAppointment.reason}
              onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
              className="border border-slate-300 rounded px-2 py-1 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Doctor"
              value={newAppointment.doctor}
              onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
              className="border border-slate-300 rounded px-2 py-1 w-full mb-2"
            />
            <button onClick={handleAddAppointment} className="bg-teal-600 text-white px-4 py-2 rounded">
              Add Appointment
            </button>
          </div>
        )}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-teal-600">Appointments</h2>
          <div className="mt-4">
            {appointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} onUpdateStatus={handleUpdateStatus} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
