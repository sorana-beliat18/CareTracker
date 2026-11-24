# CareLoop Frontend Design System & Architecture
- Stack: React (Vite), JSX, Tailwind CSS v4 (`@import "tailwindcss";` in `src/index.css` — NEVER create `tailwind.config.js`), `lucide-react`, and `react-router-dom`.
- Preserve Existing Architecture:
  - Keep `src/api/client.js` (default export `api`, token key `caretracker_token`), `src/context/AuthContext.jsx`, and `src/components/ProtectedRoute.jsx` intact and compatible with existing auth/notification endpoints.
  - Place mock data and async helpers for unbuilt endpoints (appointments, live clinic queue, appointment history, doctor treatments) inside `src/services/careService.js`.
- Visual Style (2026 Clinical SaaS): Editorial light-mode interface (`bg-slate-50` canvas, crisp `bg-white` cards with `border-slate-200/80 shadow-xs`, `teal-600` primary actions, `emerald-600` completed states, `amber-500` waiting/queue badges, `rounded-2xl` cards, `p-6` padding, responsive mobile-first layouts).
- User Roles (`patient` and `doctor`):
  - Both roles access Home/Dashboard ("Make an Appointment" + navigation cards to Live Queue, Treatments, Appointment History), Live Queue, Appointment History, Treatments, and Profile.
  - Users with `role === "doctor"` get an additional "Add Consultation Treatment" section on the Treatments page to prescribe diagnosis, medication, dosage, and consultation notes.
- Quality: Write complete, working components with realistic sample data. Never leave placeholder `// TODO` comments.
