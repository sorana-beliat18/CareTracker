import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Pill, FileText, UserCircle } from "lucide-react";
import { bookAppointment } from "../services/careService";
import AppointmentCard from "../components/AppointmentCard";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    department: "",
    doctor: "",
    date: "",
    time: "",
    reason: ""
  });
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data && data.length > 0 ? data : []);
      } catch {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (!newAppointment.department || !newAppointment.doctor || !newAppointment.date || !newAppointment.time || !newAppointment.reason) return;
    try {
      const created = await bookAppointment(newAppointment);
      setAppointments([...appointments, created]);
      setConfirmation("Appointment booked successfully!");
      setTimeout(() => setConfirmation(""), 3000);
    } catch {
      setConfirmation("Failed to book appointment. Please try again.");
      setTimeout(() => setConfirmation(""), 3000);
    }
    setNewAppointment({
      department: "",
      doctor: "",
      date: "",
      time: "",
      reason: ""
    });
  };

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
              PATIENT PORTAL
            </p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, <span className="text-[#1b5e20]">{user?.name || "Clara Oswald"}</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">{todayFormatted}</p>
          </div>
        </div>

        {/* Quick-Navigation Action Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <Link
            to="/queue"
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col items-center justify-center space-y-2 hover:border-[#1b5e20] transition-colors"
          >
            <div className="bg-[#1b5e20]/10 text-[#1b5e20] p-2.5 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Live Queue</h2>
            <p className="text-sm text-slate-500">Check current wait times</p>
          </Link>
          <Link
            to="/treatments"
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col items-center justify-center space-y-2 hover:border-[#1b5e20] transition-colors"
          >
            <div className="bg-[#1b5e20]/10 text-[#1b5e20] p-2.5 rounded-xl">
              <Pill className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Treatments</h2>
            <p className="text-sm text-slate-500">Active prescriptions & plans</p>
          </Link>
          <Link
            to="/history"
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col items-center justify-center space-y-2 hover:border-[#1b5e20] transition-colors"
          >
            <div className="bg-[#1b5e20]/10 text-[#1b5e20] p-2.5 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Medical History</h2>
            <p className="text-sm text-slate-500">Past visits & lab results</p>
          </Link>
          <Link
            to="/profile"
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col items-center justify-center space-y-2 hover:border-[#1b5e20] transition-colors"
          >
            <div className="bg-[#1b5e20]/10 text-[#1b5e20] p-2.5 rounded-xl">
              <UserCircle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">My Profile</h2>
            <p className="text-sm text-slate-500">Personal & insurance info</p>
          </Link>
        </div>

        {/* Main 2-Column Bento Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left - Make an Appointment Section */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Make an Appointment</h2>
              {confirmation && (
                <div className="bg-green-100 text-green-800 p-4 mb-4 rounded">
                  {confirmation}
                </div>
              )}
              <form onSubmit={handleAddAppointment}>
                <div className="mb-4">
                  <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">
                    Department / Specialty
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        newAppointment.department === "General Practice"
                          ? "bg-[#1b5e20] text-white"
                          : "bg-white border border-slate-200 hover:bg-[#1b5e20] hover:text-white"
                      }`}
                      onClick={() => setNewAppointment({ ...newAppointment, department: "General Practice" })}
                    >
                      General Practice
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        newAppointment.department === "Cardiology"
                          ? "bg-[#1b5e20] text-white"
                          : "bg-white border border-slate-200 hover:bg-[#1b5e20] hover:text-white"
                      }`}
                      onClick={() => setNewAppointment({ ...newAppointment, department: "Cardiology" })}
                    >
                      Cardiology
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        newAppointment.department === "Dermatology"
                          ? "bg-[#1b5e20] text-white"
                          : "bg-white border border-slate-200 hover:bg-[#1b5e20] hover:text-white"
                      }`}
                      onClick={() => setNewAppointment({ ...newAppointment, department: "Dermatology" })}
                    >
                      Dermatology
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        newAppointment.department === "Diagnostics"
                          ? "bg-[#1b5e20] text-white"
                          : "bg-white border border-slate-200 hover:bg-[#1b5e20] hover:text-white"
                      }`}
                      onClick={() => setNewAppointment({ ...newAppointment, department: "Diagnostics" })}
                    >
                      Diagnostics
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="doctor" className="block text-sm font-medium text-slate-700 mb-1">
                    Doctor
                  </label>
                  <select
                    id="doctor"
                    value={newAppointment.doctor}
                    onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]/20 focus:border-[#1b5e20]"
                  >
                    <option value="">Select a doctor</option>
                    <option value="Dr. Elena Vance">Dr. Elena Vance</option>
                    <option value="Dr. Marcus Johnson">Dr. Marcus Johnson</option>
                    <option value="Dr. Sarah Brown">Dr. Sarah Brown</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]/20 focus:border-[#1b5e20]"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-1">
                    Time
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        newAppointment.time === "09:30 AM"
                          ? "bg-[#1b5e20] text-white"
                          : "bg-white border border-slate-200 hover:bg-[#1b5e20] hover:text-white"
                      }`}
                      onClick={() => setNewAppointment({ ...newAppointment, time: "09:30 AM" })}
                    >
                      09:30 AM
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        newAppointment.time === "11:00 AM"
                          ? "bg-[#1b5e20] text-white"
                          : "bg-white border border-slate-200 hover:bg-[#1b5e20] hover:text-white"
                      }`}
                      onClick={() => setNewAppointment({ ...newAppointment, time: "11:00 AM" })}
                    >
                      11:00 AM
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        newAppointment.time === "01:30 PM"
                          ? "bg-[#1b5e20] text-white"
                          : "bg-white border border-slate-200 hover:bg-[#1b5e20] hover:text-white"
                      }`}
                      onClick={() => setNewAppointment({ ...newAppointment, time: "01:30 PM" })}
                    >
                      01:30 PM
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        newAppointment.time === "03:00 PM"
                          ? "bg-[#1b5e20] text-white"
                          : "bg-white border border-slate-200 hover:bg-[#1b5e20] hover:text-white"
                      }`}
                      onClick={() => setNewAppointment({ ...newAppointment, time: "03:00 PM" })}
                    >
                      03:00 PM
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        newAppointment.time === "04:30 PM"
                          ? "bg-[#1b5e20] text-white"
                          : "bg-white border border-slate-200 hover:bg-[#1b5e20] hover:text-white"
                      }`}
                      onClick={() => setNewAppointment({ ...newAppointment, time: "04:30 PM" })}
                    >
                      04:30 PM
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">
                    Visit Reason
                  </label>
                  <input
                    type="text"
                    id="reason"
                    value={newAppointment.reason}
                    onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b5e20]/20 focus:border-[#1b5e20]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1b5e20] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#144718] transition-colors"
                >
                  Confirm Appointment
                </button>
              </form>
            </div>
          </div>

          {/* Right - My Upcoming Appointments */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-4">My Upcoming Appointments</h2>
              {appointments.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {appointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onUpdateStatus={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-sm font-medium text-slate-600">No upcoming appointments.</p>
                  <p className="text-xs text-slate-400 mt-1">Book a new appointment to see your schedule.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
