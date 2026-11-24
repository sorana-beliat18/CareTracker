import { useState } from "react";
import { Check, X } from "lucide-react";
import { Calendar, Clock } from "lucide-react";

export default function AppointmentCard({ appointment, onUpdateStatus }) {
  const { id, patient, time, date, reason, doctor, status } = appointment;
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(status);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    await onUpdateStatus(id, newStatus);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewStatus(status);
  };

  const initials = patient.split(' ').map(name => name[0]).join('').toUpperCase();

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 hover:border-[#1b5e20]/40 hover:shadow-md transition-all flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-[#1b5e20]/10 text-[#1b5e20] font-semibold w-10 h-10 rounded-full flex items-center justify-center">
          {initials}
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#1b5e20]">{patient}</h3>
          <p className="text-sm text-slate-500">Reason: {reason}</p>
          <p className="text-sm text-slate-500">Doctor: {doctor}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-500 tabular-nums">{time}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-500 tabular-nums">{moment(date).format("MMMM Do, YYYY")}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 rounded-full text-sm font-semibold ${status === "Waiting" ? "bg-amber-500 text-white" : status === "Confirmed" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-700"}`}>
          {status}
        </span>
        <button onClick={() => onUpdateStatus(id, "Confirmed")} className="bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600">
          Confirm
        </button>
        <button onClick={() => onUpdateStatus(id, "Completed")} className="bg-slate-100 text-slate-700 px-3 py-1 rounded hover:bg-slate-200">
          Complete
        </button>
      </div>
    </div>
  );
}
