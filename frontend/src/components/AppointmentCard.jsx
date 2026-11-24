import { useState } from "react";
import { Check, X } from "lucide-react";

export default function AppointmentCard({ appointment, onUpdateStatus }) {
  const { id, patient, date, status } = appointment;
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

  return (
    <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-bold text-teal-600">{patient}</h3>
        <p className="text-sm text-slate-500">{date}</p>
        <p className="text-sm text-slate-500">Reason: {appointment.reason}</p>
        <p className="text-sm text-slate-500">Doctor: {appointment.doctor}</p>
        <div className="mt-2">
          <span className={`px-2 py-1 rounded-full text-sm font-semibold ${status === "Confirmed" ? "bg-emerald-600 text-white" : status === "Waiting" ? "bg-amber-500 text-white" : "bg-slate-400 text-white"}`}>
            {status}
          </span>
        </div>
      </div>
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="border border-slate-300 rounded px-2 py-1">
            <option value="Confirmed">Confirmed</option>
            <option value="Waiting">Waiting</option>
            <option value="Completed">Completed</option>
          </select>
          <button onClick={handleSave} className="bg-teal-600 text-white px-2 py-1 rounded">
            Save
          </button>
          <button onClick={handleCancel} className="bg-slate-400 text-white px-2 py-1 rounded">
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <button onClick={() => onUpdateStatus(id, "Confirmed")} className="bg-teal-600 text-white px-2 py-1 rounded">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={() => onUpdateStatus(id, "Completed")} className="bg-teal-600 text-white px-2 py-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
