import api from "../api/client";

const mockAppointments = [
  { id: 1, patient: "John Doe", date: "2026-11-25", status: "Scheduled" },
  { id: 2, patient: "Jane Smith", date: "2026-11-26", status: "Completed" }
];

const mockQueue = [
  { id: 1, patient: "Alice Johnson", position: 1 },
  { id: 2, patient: "Bob Brown", position: 2 }
];

const mockHistory = [
  { id: 1, patient: "Charlie Davis", date: "2026-11-24", status: "Completed" },
  { id: 2, patient: "Eve White", date: "2026-11-23", status: "Cancelled" }
];

const mockTreatments = [
  { id: 1, patient: "Frank Green", treatment: "Medication", notes: "Dosage: 10mg" },
  { id: 2, patient: "Grace Black", treatment: "Consultation", notes: "Diagnosis: Flu" }
];

export async function bookAppointment(appointment) {
  return api.post("/appointments", appointment);
}

export async function getLiveQueue() {
  return api.get("/queue").then(({ data }) => data);
}

export async function getAppointmentHistory() {
  return api.get("/history").then(({ data }) => data);
}

export async function manageTreatments(treatment) {
  return api.post("/treatments", treatment);
}
