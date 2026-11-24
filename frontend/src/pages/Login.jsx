import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { CareLoopLogo } from "../components/CareLoopLogo";
import { ClinicalWorkflow } from "../components/ClinicalWorkflow";
import { TrustBadges } from "../components/TrustBadges";
import { Bell } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
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
      const { data } = await api.post("/auth/login", form);
      saveSession(data);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-10 flex flex-col justify-center items-center">
        <CareLoopLogo />
        <ClinicalWorkflow />
        <TrustBadges />
      </div>
      <div className="bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome back</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form className="space-y-4" onSubmit={submit}>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                required
                className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 w-full"
              />
            </div>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={update}
                required
                className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl w-full"
            >
              Login
            </button>
          </form>
          <p className="text-center mt-4">
            New to CareTracker? <Link to="/register" className="text-teal-600 hover:text-teal-700">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
