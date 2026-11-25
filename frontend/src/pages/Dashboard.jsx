import { useState, useEffect } from "react";
import PatientDashboard from "./PatientDashboard";
import { useAuth } from "../context/AuthContext";
import AppointmentCard from "../components/AppointmentCard";
import { getAppointments, bookAppointment } from "../services/careService";
import { Plus, Calendar, Clock, CheckCircle2, Activity, Search } from "lucide-react";

const sampleAppointments = [
  { id: 1, patient: "John Doe", time: "10:00 AM", date: "Nov 24, 2026", reason: "General Check-up", doctor: "Dr. Elena Vance", status: "Waiting" },
  { id: 2, patient: "Jane Smith", time: "11:00 AM", date: "Nov 24, 2026", reason: "Cardiology Follow-up", doctor: "Dr. Marcus Johnson", status: "Confirmed" },
  { id: 3, patient: "Emily Davis", time: "12:00 PM", date: "Nov 24, 2026", reason: "Diagnostic MRI Review", doctor: "Dr. Sarah Brown", status: "Completed" },
  { id: 4, patient: "Michael Brown", time: "01:30 PM", date: "Nov 24, 2026", reason: "Comprehensive Blood Panel", doctor: "Dr. Elena Vance", status: "Waiting" },
  { id: 5, patient: "Sarah White", time: "02:45 PM", date: "Nov 24, 2026", reason: "Post-Op Consultation", doctor: "Dr. David Green", status: "Confirmed" }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ patient: "", date: "", time: "", reason: "", doctor: "" });
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data && data.length > 0 ? data : sampleAppointments);
      } catch {
        setAppointments(sampleAppointments);
      }
    };
    fetchAppointments();
  }, []);

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (!newAppointment.patient.trim()) return;
    try {
      const created = await bookAppointment(newAppointment);
      setAppointments([...appointments, created]);
    } catch {
      setAppointments([
        ...appointments,
        {
          id: Date.now(),
          ...newAppointment,
          time: newAppointment.time || "03:30 PM",
          date: newAppointment.date || "Nov 24, 2026",
          doctor: newAppointment.doctor || "Dr. Elena Vance",
          status: "Confirmed"
        }
      ]);
    }
    setShowForm(false);
    setNewAppointment({ patient: "", date: "", time: "", reason: "", doctor: "" });
  };

  const handleUpdateStatus = (id, status) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment
      )
    );
  };

  const [previewRole, setPreviewRole] = useState(user?.role === "doctor" ? "doctor" : "patient");

  const totalCount = appointments.length;
  const waitingCount = appointments.filter((a) => a.status === "Waiting").length;
  const confirmedCount = appointments.filter((a) => a.status === "Confirmed").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter !== "All" && appointment.status !== filter) return false;
    if (
      searchQuery &&
      !appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !appointment.reason.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <main className="bg-[#F6F8F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-1">
              Clinical Operations
            </p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, <span className="text-[#0f766e]">{user?.name || "Dr. Elena Vance"}</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">{todayFormatted}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#0f766e] text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center space-x-2 shadow-xs hover:bg-[#115e59] transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-[#0f766e]/10 text-[#0f766e] p-2.5 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                {totalCount}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">Total Appointments</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-amber-50 text-amber-700 p-2.5 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                {waitingCount}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">In Waiting Room</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                {confirmedCount}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">Confirmed</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-slate-100 text-slate-700 p-2.5 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                {completedCount}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">Completed</p>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Today&apos;s Schedule</h2>
              <p className="text-xs text-slate-500">Manage patient check-ins, confirmations, and visit status</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="inline-flex rounded-xl bg-slate-100 p-1">
                {["All", "Waiting", "Confirmed", "Completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      filter === status
                        ? "bg-[#0f766e] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patient or reason..."
                  className="w-full sm:w-64 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e]"
                />
              </div>
            </div>
          </div>

          {filteredAppointments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
              <p className="text-sm font-medium text-slate-600">No appointments match this filter.</p>
              <p className="text-xs text-slate-400 mt-1">Try clearing your search or switching status tabs.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleAddAppointment}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-1">Book New Appointment</h2>
            <p className="text-xs text-slate-500 mb-5">Schedule a patient visit on today&apos;s clinical board.</p>

            <div className="space-y-4">
              <div>
                <label htmlFor="patient" className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patient"
                  required
                  placeholder="e.g., Clara Oswald"
                  value={newAppointment.patient}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patient: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="date" className="block text-xs font-semibold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    id="date"
                    placeholder="Nov 24, 2026"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e]"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-xs font-semibold text-slate-700 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    id="time"
                    placeholder="03:30 PM"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reason" className="block text-xs font-semibold text-slate-700 mb-1">
                  Visit Reason
                </label>
                <input
                  type="text"
                  id="reason"
                  placeholder="e.g., Routine Check-up"
                  value={newAppointment.reason}
                  onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e]"
                />
              </div>

              <div>
                <label htmlFor="doctor" className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Doctor
                </label>
                <input
                  type="text"
                  id="doctor"
                  placeholder="e.g., Dr. Elena Vance"
                  value={newAppointment.doctor}
                  onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#0f766e] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#115e59] transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
