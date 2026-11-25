import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Queue() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState("Patient Ticket");
  const [queue, setQueue] = useState([
    { ticket: "#A-14", status: "In Consultation", patient: "John Doe", department: "General Practice", waitTime: "10 min" },
    { ticket: "#A-15", status: "Next Up", patient: "Jane Smith", department: "Cardiology", waitTime: "5 min" },
    { ticket: "#A-16", status: "Waiting", patient: "Emily Johnson", department: "Dermatology", waitTime: "15 min" },
    { ticket: "#A-17", status: "You — Waiting", patient: "Alice Brown", department: "General Practice", waitTime: "18 min" },
    { ticket: "#A-18", status: "Waiting", patient: "Michael Davis", department: "Neurology", waitTime: "20 min" },
  ]);

  useEffect(() => {
    if (!user) {
      navigate("/patientdashboard");
    }
  }, [user, navigate]);

  const handleJoinQueue = () => {
    const newTicket = {
      ticket: `#A-${queue.length + 14}`,
      status: "Waiting",
      patient: "New Patient",
      department: "General Practice",
      waitTime: "0 min",
    };
    setQueue([...queue, newTicket]);
  };

  const handleCallNextPatient = () => {
    const updatedQueue = queue.map((item, index) => {
      if (item.status === "In Consultation") {
        return { ...item, status: "Completed" };
      } else if (item.status === "Next Up") {
        return { ...item, status: "In Consultation" };
      }
      return item;
    });
    setQueue(updatedQueue);
  };

  return (
    <main className="bg-off-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold">Live Waiting Room Queue</div>
        <div className="flex items-center">
          <div className="bg-clinical-teal text-white px-3 py-1 rounded mr-2 cursor-pointer hover:bg-clinical-teal-hover" onClick={() => setView("Patient Ticket")}>Patient Ticket</div>
          <div className="bg-clinical-teal text-white px-3 py-1 rounded cursor-pointer hover:bg-clinical-teal-hover" onClick={() => setView("Staff Desk")}>Staff Desk</div>
          <a href="/patientdashboard" className="ml-4 text-clinical-teal hover:text-clinical-teal-hover">← Back to Portal</a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
          <div className="text-xl font-bold mb-2">Now Serving</div>
          <div className="flex items-center mb-2">
            <div className="bg-clinical-teal text-white px-3 py-1 rounded mr-2">#A-14</div>
            <div>Room 2 • Dr. Elena Vance</div>
          </div>
          <div className="w-4 h-4 bg-clinical-teal rounded-full animate-pulse"></div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
          <div className="text-xl font-bold mb-2">Your Queue Position</div>
          <div className="flex items-center mb-2">
            <div className="bg-clinical-teal text-white px-3 py-1 rounded mr-2">#A-17</div>
            <div>3 patients ahead • Est. wait: ~18 min</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
          <div className="text-xl font-bold mb-2">Active Consultation Rooms</div>
          <div className="flex items-center mb-2">
            <div>4 / 5 Open</div>
            <div className="ml-2">Average turn time: 11 min</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6">
          <div className="bg-clinical-teal h-2 mb-4"></div>
          <div className="text-4xl font-bold mb-2">#A-17</div>
          <div className="text-lg mb-4">General Practice</div>
          <div className="text-lg mb-4">Assigned Doctor: Dr. Elena Vance</div>
          <button className="bg-clinical-teal text-white px-4 py-2 rounded" onClick={handleJoinQueue}>Join Queue / Take New Ticket</button>
        </div>
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold">Live Waiting List</div>
            {view === "Staff Desk" && (
              <button className="bg-clinical-teal text-white px-4 py-2 rounded" onClick={handleCallNextPatient}>Call Next Patient</button>
            )}
          </div>
          <ul className="space-y-4">
            {queue.map((item, index) => (
              <li key={index} className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center justify-between">
                <div>
                  <div className="bg-clinical-teal text-white px-3 py-1 rounded mr-2 tabular-nums">{item.ticket}</div>
                  <div className="text-lg font-bold">{item.patient}</div>
                  <div className="text-gray-600">{item.department}</div>
                  <div className="text-gray-600">Wait Time: {item.waitTime}</div>
                </div>
                <div className={`bg-${item.status === "In Consultation" ? "green" : item.status === "Completed" ? "gray" : "yellow"} text-white px-3 py-1 rounded`}>{item.status}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
