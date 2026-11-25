import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Bell, Menu } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get("/notifications")
      .then(({ data }) => setNotifications(data))
      .catch(() => {
        console.error("Failed to fetch notifications");
      });
  }, [user]);

  async function markRead(id) {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((items) =>
        items.map((item) => (item._id === id ? { ...item, read: true } : item))
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <nav className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between">
      <Link
        to={user?.role === "patient" ? "/patientdashboard" : "/dashboard"}
        className="flex items-center space-x-2.5"
      >
        <svg
          viewBox="0 0 30 30"
          className="w-8 h-8 shrink-0"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ctTealTop" x1="10" y1="0" x2="20" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7ccbb5" />
              <stop offset="100%" stopColor="#2e7d67" />
            </linearGradient>
            <linearGradient id="ctTealLeft" x1="0" y1="15" x2="10" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6dc1aa" />
              <stop offset="100%" stopColor="#2c7963" />
            </linearGradient>
            <linearGradient id="ctTealRibbon" x1="10" y1="15" x2="30" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#94dec9" />
              <stop offset="45%" stopColor="#499b84" />
              <stop offset="100%" stopColor="#236b57" />
            </linearGradient>
            <linearGradient id="ctTealBottom" x1="10" y1="20" x2="20" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#226653" />
              <stop offset="55%" stopColor="#4fa089" />
              <stop offset="100%" stopColor="#7bc9b3" />
            </linearGradient>
          </defs>
          <path d="M10 0H20V10A10 10 0 0 1 10 0Z" fill="url(#ctTealTop)" />
          <path d="M0 10A10 10 0 0 1 10 20H0V10Z" fill="url(#ctTealLeft)" />
          <path d="M10 20H20V30H10V20Z" fill="url(#ctTealBottom)" />
          <path d="M10 20A10 10 0 0 1 20 10H30V20H10Z" fill="url(#ctTealRibbon)" />
        </svg>
        <span className="text-[#0f766e] font-bold text-xl tracking-tight">
          CareTracker
        </span>
      </Link>

      {user && (
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-4">
            <Link className="text-slate-700 hover:text-[#0f766e]" to="/dashboard">Dashboard</Link>
            <Link className="text-slate-700 hover:text-[#0f766e]" to="/queue">Queue</Link>
            <Link className="text-slate-700 hover:text-[#0f766e]" to="/treatments">Treatments</Link>
            <Link className="text-slate-700 hover:text-[#0f766e]" to="/history">History</Link>
            <Link className="text-slate-700 hover:text-[#0f766e]" to="/profile">Profile</Link>
          </nav>

          <button
            className="md:hidden text-[#0f766e] hover:text-[#115e59]"
            onClick={() => setOpen((value) => !value)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {open && (
            <div className="absolute right-4 top-12 w-64 bg-white border border-slate-200 shadow-lg rounded-lg">
              <nav className="flex flex-col space-y-2 p-4">
                <Link className="text-slate-700 hover:text-[#0f766e]" to="/dashboard">Dashboard</Link>
                <Link className="text-slate-700 hover:text-[#0f766e]" to="/queue">Queue</Link>
                <Link className="text-slate-700 hover:text-[#0f766e]" to="/treatments">Treatments</Link>
                <Link className="text-slate-700 hover:text-[#0f766e]" to="/history">History</Link>
                <Link className="text-slate-700 hover:text-[#0f766e]" to="/profile">Profile</Link>
                <button className="text-left text-[#0f766e] hover:text-[#115e59]" onClick={handleLogout}>
                  Logout
                </button>
              </nav>
            </div>
          )}

          <span className="bg-[#0f766e] text-white px-2.5 py-1 rounded-full text-xs font-semibold">
            Role: {user.role}
          </span>

          <button className="relative text-[#0f766e]" onClick={() => setOpen((value) => !value)}>
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-4 top-12 w-64 bg-white border border-slate-200 shadow-lg rounded-lg">
              {notifications.length === 0 && (
                <p className="p-4 text-center text-slate-500 text-sm">No notifications</p>
              )}
              {notifications.map((item) => (
                <button
                  key={item._id}
                  className={`w-full px-4 py-3 text-left text-sm ${item.read ? "bg-slate-100" : "bg-white"}`}
                  onClick={() => markRead(item._id)}
                >
                  {item.message}
                </button>
              ))}
            </div>
          )}

          <button className="text-sm font-medium text-[#0f766e] hover:text-[#115e59]" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}