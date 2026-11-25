import { Calendar, Clock, Stethoscope, CheckCircle2, Play } from "lucide-react";

const statusStyles = {
  Waiting: "bg-amber-50 text-amber-700 border-amber-200/80",
  Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  Completed: "bg-slate-100 text-slate-600 border-slate-200/80"
};

export default function AppointmentCard({ appointment, onUpdateStatus }) {
  const { id, patient = "Patient", time, date, reason, doctor, status = "Waiting" } = appointment || {};

  const initials = patient
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 hover:border-[#0f766e]/40 hover:shadow-md transition-all flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0f766e]/10 text-[#0f766e] font-semibold text-sm flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{patient}</h3>
            <p className="text-xs text-slate-500">{reason}</p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
            statusStyles[status] || statusStyles.Waiting
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-3 tabular-nums">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {time}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
            {doctor}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {status === "Waiting" && (
            <button
              onClick={() => onUpdateStatus(id, "Confirmed")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0f766e]/10 text-[#0f766e] font-semibold hover:bg-[#0f766e] hover:text-white transition-colors"
            >
              <Play className="w-3 h-3" />
              Confirm
            </button>
          )}
          {status !== "Completed" && (
            <button
              onClick={() => onUpdateStatus(id, "Completed")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
            >
              <CheckCircle2 className="w-3 h-3" />
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}