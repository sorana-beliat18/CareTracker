import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Pill, FileText, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { bookAppointment, getAppointments } from "../services/careService";
import AppointmentCard from "../components/AppointmentCard";

const samplePatientAppointments = [
  {
    id: 101,
    patient: "Clara Oswald",
    doctor: "Dr. Elena Vance",
    date: "Nov 27, 2026",
    time: "10:00 AM",
    reason: "General Check-up",
    status: "Confirmed"
  },
  {
    id: 102,
    patient: "Clara Oswald",
    doctor: "Dr. Marcus Johnson",
    date: "Dec 02, 2026",
    time: "01:30 PM",
    reason: "Cardiology Follow-up",
    status: "Waiting"
  }
];

export default function PatientDashboard() {
  const { user } = useAuth() || {};
  const [appointments, setAppointments] = useState(samplePatientAppointments);
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
        if (data && data.length > 0) {
          setAppointments(data);
        }
      } catch {
        // Keep sample appointments when backend is offline
      }
    };
    fetchAppointments();
  }, []);

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (
      !newAppointment.department ||
      !newAppointment.doctor ||
      !newAppointment.date ||
      !newAppointment.time ||
      !newAppointment.reason
    ) {
      return;
    }

    const fallbackEntry = {
      id: Date.now(),
      patient: user?.name || "Clara Oswald",
      doctor: newAppointment.doctor,
      date: newAppointment.date,
      time: newAppointment.time,
      reason: `${newAppointment.department}: ${newAppointment.reason}`,
      status: "Confirmed"
    };

    try {
      const created = await bookAppointment(fallbackEntry);
      setAppointments((prev) => [created || fallbackEntry, ...prev]);
    } catch {
      setAppointments((prev) => [fallbackEntry, ...prev]);
    }

    setConfirmation("Appointment booked successfully!");
    setTimeout(() => setConfirmation(""), 3000);
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
              Welcome back,{" "}
              <span className="text-[#0f766e]">
                {user?.name || "Clara Oswald"}
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">{todayFormatted}</p>
          </div>

          <Link
            to="/dashboard"
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-[#0f766e] hover:text-[#0f766e] transition-colors"
          >
            Switch to Doctor View →
          </Link>
        </div>

        {/* Quick-Navigation Action Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <Link
            to="/queue"
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-2 hover:border-[#0f766e] transition-colors"
          >
            <div className="bg-[#0f766e]/10 text-[#0f766e] p-2.5 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Live Queue</h2>
            <p className="text-sm text-slate-500">Check current wait times</p>
          </Link>
          <Link
            to="/treatments"
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-2 hover:border-[#0f766e] transition-colors"
          >
            <div className="bg-[#0f766e]/10 text-[#0f766e] p-2.5 rounded-xl">
              <Pill className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Treatments</h2>
            <p className="text-sm text-slate-500">Active prescriptions & plans</p>
          </Link>
          <Link
            to="/history"
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-2 hover:border-[#0f766e] transition-colors"
          >
            <div className="bg-[#0f766e]/10 text-[#0f766e] p-2.5 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Medical History</h2>
            <p className="text-sm text-slate-500">Past visits & lab results</p>
          </Link>
          <Link
            to="/profile"
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-2 hover:border-[#0f766e] transition-colors"
          >
            <div className="bg-[#0f766e]/10 text-[#0f766e] p-2.5 rounded-xl">
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
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Make an Appointment
              </h2>
              {confirmation && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 mb-4 rounded-xl text-sm font-medium">
                  {confirmation}
                </div>
              )}
              <form onSubmit={handleAddAppointment}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Department / Specialty
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "General Practice",
                      "Cardiology",
                      "Dermatology",
                      "Diagnostics"
                    ].map((dept) => (
                      <button
                        key={dept}
                        type="button"
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                          newAppointment.department === dept
                            ? "bg-[#0f766e] text-white"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-[#0f766e] hover:text-white"
                        }`}
                        onClick={() =>
                          setNewAppointment({
                            ...newAppointment,
                            department: dept
                          })
                        }
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="doctor"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Doctor
                  </label>
                  <select
                    id="doctor"
                    value={newAppointment.doctor}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        doctor: e.target.value
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e]"
                  >
                    <option value="">Select a doctor</option>
                    <option value="Dr. Elena Vance">Dr. Elena Vance</option>
                    <option value="Dr. Marcus Johnson">Dr. Marcus Johnson</option>
                    <option value="Dr. Sarah Brown">Dr. Sarah Brown</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={newAppointment.date}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        date: e.target.value
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Time
                  </label>
                  <div className="flex flex-wrap gap-2 tabular-nums">
                    {[
                      "09:30 AM",
                      "11:00 AM",
                      "01:30 PM",
                      "03:00 PM",
                      "04:30 PM"
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                          newAppointment.time === slot
                            ? "bg-[#0f766e] text-white"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-[#0f766e] hover:text-white"
                        }`}
                        onClick={() =>
                          setNewAppointment({ ...newAppointment, time: slot })
                        }
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Visit Reason
                  </label>
                  <input
                    type="text"
                    id="reason"
                    placeholder="e.g., Routine check-up, blood pressure follow-up..."
                    value={newAppointment.reason}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        reason: e.target.value
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0f766e] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#115e59] transition-colors"
                >
                  Confirm Appointment
                </button>
              </form>
            </div>
          </div>

          {/* Right - My Upcoming Appointments */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                My Upcoming Appointments
              </h2>
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
                  <p className="text-sm font-medium text-slate-600">
                    No upcoming appointments.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Book a new appointment to see your schedule.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}