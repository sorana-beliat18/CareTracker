import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get("/notifications").then(({ data }) => setNotifications(data));
  }, [user]);

  async function markRead(id) {
    await api.patch(`/notifications/${id}/read`);
    setNotifications((items) =>
      items.map((item) => item._id === id ? { ...item, read: true } : item)
    );
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <nav className="navbar">
      <Link className="brand" to="/dashboard">CareTracker</Link>
      {user && (
        <div className="nav-actions">
          <button className="bell" onClick={() => setOpen((value) => !value)} aria-label="Notifications">
            Bell <span className="badge">{unreadCount}</span>
          </button>
          {open && (
            <div className="notification-panel">
              {notifications.length === 0 && <p>No notifications</p>}
              {notifications.map((item) => (
                <button
                  className={item.read ? "notification read" : "notification"}
                  key={item._id}
                  onClick={() => markRead(item._id)}
                >
                  {item.message}
                </button>
              ))}
            </div>
          )}
          <Link to="/profile">Profile</Link>
          <button className="link-button" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
