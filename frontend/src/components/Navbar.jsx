import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Heart, Menu } from "lucide-react";

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
        items.map((item) => item._id === id ? { ...item, read: true } : item)
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
    <nav className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-50 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Heart className="text-teal-600" />
        <h1 className="text-teal-600 font-bold text-xl">CareTracker</h1>
      </div>
      {user && (
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-4">
            <Link className="text-slate-700 hover:text-teal-600" to="/dashboard">Dashboard</Link>
            <Link className="text-slate-700 hover:text-teal-600" to="/queue">Queue</Link>
            <Link className="text-slate-700 hover:text-teal-600" to="/treatments">Treatments</Link>
            <Link className="text-slate-700 hover:text-teal-600" to="/history">History</Link>
            <Link className="text-slate-700 hover:text-teal-600" to="/profile">Profile</Link>
          </nav>
          <button className="md:hidden text-teal-600 hover:text-teal-700" onClick={() => setOpen((value) => !value)}>
            <Menu className="w-6 h-6" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 shadow-lg rounded-lg">
              <nav className="flex flex-col space-y-2 p-4">
                <Link className="text-slate-700 hover:text-teal-600" to="/dashboard">Dashboard</Link>
                <Link className="text-slate-700 hover:text-teal-600" to="/queue">Queue</Link>
                <Link className="text-slate-700 hover:text-teal-600" to="/treatments">Treatments</Link>
                <Link className="text-slate-700 hover:text-teal-600" to="/history">History</Link>
                <Link className="text-slate-700 hover:text-teal-600" to="/profile">Profile</Link>
                <button className="text-teal-600 hover:text-teal-700" onClick={handleLogout}>Logout</button>
              </nav>
            </div>
          )}
          <span className="bg-teal-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
            Role: {user.role}
          </span>
          <button className="relative" onClick={() => setOpen((value) => !value)}>
            <Heart className="text-teal-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 shadow-lg rounded-lg">
              {notifications.length === 0 && <p className="p-4 text-center text-slate-500">No notifications</p>}
              {notifications.map((item) => (
                <button
                  key={item._id}
                  className={`w-full px-4 py-3 text-left ${item.read ? 'bg-slate-100' : 'bg-white'}`}
                  onClick={() => markRead(item._id)}
                >
                  {item.message}
                </button>
              ))}
            </div>
          )}
          <button className="text-teal-600 hover:text-teal-700" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
