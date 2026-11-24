import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AppointmentCard from "../components/AppointmentCard";
import { getAppointments, bookAppointment } from "../services/careService";
import { Plus } from "lucide-react";
import { Calendar, Clock, CheckCircle2, Activity } from "lucide-react";
import moment from "moment";

const sampleAppointments = [
  { id: 1, patient: "John Doe", time: "10:00", date: "2023-10-01", reason: "Check-up", doctor: "Dr. Smith", status: "Waiting" },
  { id: 2, patient: "Jane Smith", time: "11:00", date: "2023-10-01", reason: "Follow-up", doctor: "Dr. Johnson", status: "Confirmed" },
  { id: 3, patient: "Emily Davis", time: "12:00", date: "2023-10-01", reason: "MRI", doctor: "Dr. Brown", status: "Completed" },
  { id: 4, patient: "Michael Brown", time: "13:00", date: "2023-10-01", reason: "Blood Test", doctor: "Dr. White", status: "Waiting" },
  { id: 5, patient: "Sarah White", time: "14:00", date: "2023-10-01", reason: "Consultation", doctor: "Dr. Green", status: "Confirmed" }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ patient: "", date: "", reason: "", doctor: "" });
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        if (data.length === 0) {
          setAppointments(sampleAppointments);
        } else {
          setAppointments(data);
        }
      } catch (error) {
        setAppointments(sampleAppointments);
      }
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

  const filteredAppointments = appointments.filter(appointment => {
    if (filter !== "All" && appointment.status !== filter) return false;
    if (searchQuery && !appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) && !appointment.reason.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="bg-[#F6F8F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h6 className="text-sm font-semibold text-slate-500 uppercase">CLINICAL OPERATIONS</h6>
            <h1 className="text-3xl font-bold text-[#1b5e20]">Welcome back, {user?.name || "Dr. Elena Vance"}</h1>
            <p className="text-sm text-slate-500">Today: {moment().format("MMMM Do, YYYY")}</p>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-[#1b5e20] text-white px-4 py-2 rounded flex items-center space-x-2 shadow-sm hover:bg-[#144718] transition-colors">
            <Plus className="w-4 h-4" />
            <span>+ New Appointment</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-[#1b5e20]/10 text-[#1b5e20] p-2 rounded-full">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight tabular-nums">12</h3>
            </div>
            <p className="text-sm text-slate-500">Total Appointments</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-amber-50 text-amber-700 p-2 rounded-full">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight tabular-nums">3</h3>
            </div>
            <p className="text-sm text-slate-500">In Waiting Room</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-emerald-50 text-emerald-700 p-2 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight tabular-nums">4</h3>
            </div>
            <p className="text-sm text-slate-500">Confirmed</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-slate-100 text-slate-700 p-2 rounded-full">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight tabular-nums">5</h3>
            </div>
            <p className="text-sm text-slate-500">Completed</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <button onClick={() => setFilter("All")} className={`px-3 py-1 rounded-full text-sm font-semibold ${filter === "All" ? "bg-[#1b5e20] text-white" : "bg-slate-200 text-slate-700"}`}>All</button>
              <button onClick={() => setFilter("Waiting")} className={`px-3 py-1 rounded-full text-sm font-semibold ${filter === "Waiting" ? "bg-[#1b5e20] text-white" : "bg-slate-200 text-slate-700"}`}>Waiting</button>
              <button onClick={() => setFilter("Confirmed")} className={`px-3 py-1 rounded-full text-sm font-semibold ${filter === "Confirmed" ? "bg-[#1b5e20] text-white" : "bg-slate-200 text-slate-700"}`}>Confirmed</button>
              <button onClick={() => setFilter("Completed")} className={`px-3 py-1 rounded-full text-sm font-semibold ${filter === "Completed" ? "bg-[#1b5e20] text-white" : "bg-slate-200 text-slate-700"}`}>Completed</button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by patient or reason"
                className="border border-slate-300 rounded px-3 py-1 pr-8 focus:ring-2 focus:ring-[#1b5e20]/20 focus:border-[#1b5e20]"
              />
              <Search className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500" />
            </div>
          </div>
          {filteredAppointments.length > 0 ? (
            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4">
              {filteredAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} onUpdateStatus={handleUpdateStatus} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No appointments found.</p>
          )}
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#1b5e20] mb-4">New Appointment</h2>
            <div className="mb-4">
              <label htmlFor="patient" className="block text-sm font-medium text-slate-700">Patient Name</label>
              <input
                type="text"
                id="patient"
                value={newAppointment.patient}
                onChange={(e) => setNewAppointment({ ...newAppointment, patient: e.target.value })}
                className="mt-1 block w-full rounded-md border border-slate-300 focus:ring-2 focus:ring-[#1b5e20]/20 focus:border-[#1b5e20]"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
              <input
                type="text"
                id="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                className="mt-1 block w-full rounded-md border border-slate-300 focus:ring-2 focus:ring-[#1b5e20]/20 focus:border-[#1b5e20]"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="reason" className="block text-sm font-medium text-slate-700">Reason</label>
              <input
                type="text"
                id="reason"
                value={newAppointment.reason}
                onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                className="mt-1 block w-full rounded-md border border-slate-300 focus:ring-2 focus:ring-[#1b5e20]/20 focus:border-[#1b5e20]"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="doctor" className="block text-sm font-medium text-slate-700">Doctor</label>
              <input
                type="text"
                id="doctor"
                value={newAppointment.doctor}
                onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                className="mt-1 block w-full rounded-md border border-slate-300 focus:ring-2 focus:ring-[#1b5e20]/20 focus:border-[#1b5e20]"
              />
            </div>
            <div className="flex items-center justify-end space-x-2">
              <button onClick={() => setShowForm(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded hover:bg-slate-300">Cancel</button>
              <button onClick={handleAddAppointment} className="bg-[#1b5e20] text-white px-4 py-2 rounded hover:bg-[#144718]">Book Appointment</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
