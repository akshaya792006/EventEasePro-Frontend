// All backend API calls live here.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8081").replace(/\/$/, "");

async function request(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(API_BASE_URL + path, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(`Cannot reach the server at ${API_BASE_URL}. Is the backend running?`);
  }
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    let msg = typeof data === "string" && data ? data : data?.message || data?.error;
    if (data && typeof data === "object" && !msg) {
      const vals = Object.values(data).filter((v) => typeof v === "string");
      if (vals.length) msg = vals.join(", ");
    }
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return data;
}

// Events
export const getEvents = () => request("/api/events");
export const getEvent = (id) => request(`/api/events/${id}`);
export const createEvent = (e) => request("/api/events", { method: "POST", body: e });
export const updateEvent = (id, e) => request(`/api/events/${id}`, { method: "PUT", body: e });
export const deleteEvent = (id) => request(`/api/events/${id}`, { method: "DELETE" });

// Departments
export const getDepartments = () => request("/api/departments");
export const createDepartment = (d) => request("/api/departments", { method: "POST", body: d });
export const updateDepartment = (id, d) => request(`/api/departments/${id}`, { method: "PUT", body: d });
export const deleteDepartment = (id) => request(`/api/departments/${id}`, { method: "DELETE" });

// Students
export const getStudents = () => request("/api/students");
export const registerStudent = (s) => request("/api/students/register", { method: "POST", body: s });
export const deleteStudent = (id) => request(`/api/students/${id}`, { method: "DELETE" });
export const loginStudent = (email, password) =>
  request("/api/students/login", { method: "POST", body: { email, password } });

// QR
export const generateQr = (eventId) => request(`/api/qr/events/${eventId}/generate`, { method: "POST" });

// Attendance
export const markAttendance = (eventId, studentId, token) =>
  request(
    `/api/attendance/mark?eventId=${encodeURIComponent(eventId)}&studentId=${encodeURIComponent(studentId)}&token=${encodeURIComponent(token)}`,
    { method: "POST" },
  );
export const getAttendanceByEvent = (eventId) => request(`/api/attendance/event/${eventId}`);
export const getAttendanceByStudent = (studentId) => request(`/api/attendance/student/${studentId}`);
export const updateAttendanceStatus = (id, status) =>
  request(`/api/attendance/${id}/status`, { method: "PUT", body: { status } });
