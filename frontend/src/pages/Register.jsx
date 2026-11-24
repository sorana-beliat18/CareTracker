import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Bell } from "lucide-react";

const CustomLogo = () => (
  <svg className="w-8 h-8 text-teal-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2zm-1 8h4v2h-4z" fill="currentColor" />
  </svg>
);

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient"
  });
  const [error, setError] = useState("");
  const { saveSession } = useAuth();
  const navigate = useNavigate();

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/register", form);
      saveSession(data);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-10 flex flex-col justify-center items-center">
        <CustomLogo />
        <h1 className="text-white font-bold text-3xl mt-4">Seamless Patient-Doctor Care</h1>
        <p className="text-white text-center mt-2">Effortlessly manage appointments and treatments.</p>
      </div>
      <div className="bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Create account</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form className="space-y-4" onSubmit={submit}>
            <div className="relative">
              <label className="block text-slate-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={update}
                required
                placeholder="Enter your full name"
                className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 w-full"
              />
            </div>
            <div className="relative">
              <label className="block text-slate-700 font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                required
                placeholder="Enter your email"
                className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 w-full"
              />
            </div>
            <div className="relative">
              <label className="block text-slate-700 font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={update}
                minLength="8"
                required
                placeholder="Enter your password"
                className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 w-full"
              />
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "patient" })}
                className={`w-full py-3 rounded-lg text-center ${form.role === "patient" ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "doctor" })}
                className={`w-full py-3 rounded-lg text-center ${form.role === "doctor" ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                Doctor
              </button>
            </div>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl w-full"
            >
              Register
            </button>
          </form>
          <p className="text-center mt-4">
            Already registered? <Link to="/login" className="text-teal-600 hover:text-teal-700">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
