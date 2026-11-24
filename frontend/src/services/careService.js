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

export async function getAppointments() {
  const appointments = localStorage.getItem("appointments");
  return appointments ? JSON.parse(appointments) : [];
}

export async function bookAppointment(appointment) {
  const appointments = await getAppointments();
  appointment.id = appointments.length + 1;
  appointments.push(appointment);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  return appointment;
}

export async function getLiveQueue() {
  const queue = localStorage.getItem("queue");
  return queue ? JSON.parse(queue) : [];
}

export async function getAppointmentHistory() {
  const history = localStorage.getItem("history");
  return history ? JSON.parse(history) : [];
}

export async function getTreatments() {
  const treatments = localStorage.getItem("treatments");
  return treatments ? JSON.parse(treatments) : [];
}

export async function addTreatment(treatment) {
  const treatments = await getTreatments();
  treatment.id = treatments.length + 1;
  treatments.push(treatment);
  localStorage.setItem("treatments", JSON.stringify(treatments));
  return treatment;
}
