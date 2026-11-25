import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, DoorOpen, Ticket, UserCheck, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const initialQueue = [
  {
    ticket: "#A-14",
    status: "In Consultation",
    patient: "John Doe",
    department: "General Practice",
    doctor: "Dr. Elena Vance",
    room: "Room 2",
    waitTime: "Now"
  },
  {
    ticket: "#A-15",
    status: "Next Up",
    patient: "Jane Smith",
    department: "Cardiology",
    doctor: "Dr. Marcus Johnson",
    room: "Room 1",
    waitTime: "~5 min"
  },
  {
    ticket: "#A-16",
    status: "Waiting",
    patient: "Emily Johnson",
    department: "Dermatology",
    doctor: "Dr. David Green",
    room: "Room 4",
    waitTime: "~12 min"
  },
  {
    ticket: "#A-17",
    status: "You — Waiting",
    patient: "Clara Oswald",
    department: "General Practice",
    doctor: "Dr. Elena Vance",
    room: "Room 2",
    waitTime: "~18 min",
    isCurrentUser: true
  },
  {
    ticket: "#A-18",
    status: "Waiting",
    patient: "Michael Davis",
    department: "Diagnostics",
    doctor: "Dr. Sarah Brown",
    room: "Room 3",
    waitTime: "~25 min"
  }
];

export default function Queue() {
  const { user } = useAuth() || {};
  const [view, setView] = useState("Patient Ticket");
  const [queue, setQueue] = useState(initialQueue);
  const [joinedMessage, setJoinedMessage] = useState("");

  const nowServing =
    queue.find((item) => item.status === "In Consultation") || queue[0];
  const userTicket =
    queue.find((item) => item.isCurrentUser) || queue[queue.length - 1];
  const activeIndex = queue.findIndex((item) => item.status === "In Consultation");
  const userIndex = queue.findIndex((item) => item.ticket === userTicket?.ticket);
  const patientsAhead = Math.max(0, userIndex - activeIndex);

  const handleJoinQueue = () => {
    const nextNumber = 14 + queue.length;
    const newTicket = {
      ticket: `#A-${nextNumber}`,
      status: "You — Waiting",
      patient: user?.name || "Clara Oswald",
      department: "General Practice",
      doctor: "Dr. Elena Vance",
      room: "Room 2",
      waitTime: `~${(patientsAhead + 1) * 6} min`,
      isCurrentUser: true
    };

    setQueue((prev) => [
      ...prev.map((item) =>
        item.isCurrentUser
          ? { ...item, isCurrentUser: false, status: "Waiting" }
          : item
      ),
      newTicket
    ]);
    setJoinedMessage(`Ticket ${newTicket.ticket} issued!`);
    setTimeout(() => setJoinedMessage(""), 3000);
  };

  const handleCallNextPatient = () => {
    setQueue((prev) => {
      let promotedNext = false;
      return prev.map((item) => {
        if (item.status === "In Consultation") {
          return { ...item, status: "Completed", waitTime: "Done" };
        }
        if (item.status === "Next Up") {
          return { ...item, status: "In Consultation", waitTime: "Now" };
        }
        if (
          !promotedNext &&
          (item.status === "Waiting" || item.status === "You — Waiting")
        ) {
          promotedNext = true;
          return { ...item, status: "Next Up", waitTime: "~5 min" };
        }
        return item;
      });
    });
  };

  const getStatusBadgeStyle = (status) => {
    if (status === "In Consultation") {
      return "bg-teal-50 text-[#0f766e] border-teal-200";
    }
    if (status === "Next Up") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (status === "You — Waiting") {
      return "bg-[#0f766e] text-white border-[#0f766e]";
    }
    if (status === "Completed") {
      return "bg-slate-100 text-slate-500 border-slate-200";
    }
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <main className="min-h-screen bg-[#F6F8F7] text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#0f766e] bg-[#0f766e]/10 px-2.5 py-1 rounded-full mb-2">
              Clinic Flow
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Live Waiting Room Queue
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time consultation status and estimated wait times
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
              {["Patient Ticket", "Staff Desk"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setView(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    view === mode
                      ? "bg-[#0f766e] text-white"
                      : "text-slate-600 hover:text-[#0f766e]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <Link
              to="/patientdashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-[#0f766e] hover:text-[#0f766e] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Portal
            </Link>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Now Serving
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f766e]">
                <span className="w-2 h-2 rounded-full bg-[#0f766e] animate-pulse" />
                Live
              </span>
            </div>
            <div className="flex items-baseline gap-2.5 tabular-nums">
              <span className="text-2xl font-bold text-[#0f766e]">
                {nowServing?.ticket}
              </span>
              <span className="text-xs text-slate-500">
                {nowServing?.room} • {nowServing?.doctor}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Your Queue Position
              </span>
              <Clock className="w-4 h-4 text-[#0f766e]" />
            </div>
            <div className="flex items-baseline gap-2.5 tabular-nums">
              <span className="text-2xl font-bold text-slate-900">
                {userTicket?.ticket}
              </span>
              <span className="text-xs text-slate-500">
                {patientsAhead} ahead • Est. ~{patientsAhead * 6} min
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Consultation Rooms
              </span>
              <DoorOpen className="w-4 h-4 text-[#0f766e]" />
            </div>
            <div className="flex items-baseline gap-2.5 tabular-nums">
              <span className="text-2xl font-bold text-slate-900">
                4 / 5 Open
              </span>
              <span className="text-xs text-slate-500">
                Avg. turn time: 11 min
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Digital Queue Pass */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="bg-[#0f766e] h-2" />
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Digital Queue Pass
                  </p>
                  <p className="text-4xl font-bold text-[#0f766e] tabular-nums mt-1">
                    {userTicket?.ticket}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#0f766e]/10 text-[#0f766e] flex items-center justify-center">
                  <Ticket className="w-6 h-6" />
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient</span>
                  <span className="font-semibold text-slate-800">
                    {userTicket?.patient}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department</span>
                  <span className="font-semibold text-slate-800">
                    {userTicket?.department}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Doctor</span>
                  <span className="font-semibold text-slate-800">
                    {userTicket?.doctor}
                  </span>
                </div>
              </div>

              {joinedMessage && (
                <div className="rounded-xl bg-teal-50 border border-teal-200 px-3.5 py-2.5 text-xs font-semibold text-[#0f766e]">
                  {joinedMessage}
                </div>
              )}

              <button
                type="button"
                onClick={handleJoinQueue}
                className="w-full bg-[#0f766e] hover:bg-[#115e59] text-white font-semibold text-sm py-3 px-4 rounded-xl transition-colors"
              >
                Join Queue / Take New Ticket
              </button>
            </div>
          </div>

          {/* Right: Live Waiting List */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0f766e]" />
                <h2 className="text-lg font-bold text-slate-900">
                  Live Waiting List
                </h2>
              </div>

              {view === "Staff Desk" && (
                <button
                  type="button"
                  onClick={handleCallNextPatient}
                  className="inline-flex items-center gap-1.5 bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  Call Next Patient
                </button>
              )}
            </div>

            <ul className="space-y-3">
              {queue.map((item) => (
                <li
                  key={item.ticket}
                  className={`rounded-xl border p-4 flex items-center justify-between gap-4 transition-colors ${
                    item.isCurrentUser
                      ? "border-[#0f766e] bg-[#0f766e]/[0.03]"
                      : "border-slate-200/80 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="px-3 py-1.5 rounded-lg bg-[#0f766e]/10 text-[#0f766e] font-bold text-sm tabular-nums shrink-0">
                      {item.ticket}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {item.patient}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {item.department} • {item.doctor} • Wait: {item.waitTime}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${getStatusBadgeStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}