/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export function Loading({ text = "Loading…" }: { text?: string }) {
  return <div className="loading"><span className="spinner" /> {text}</div>;
}

export function Alert({ type, children }: { type: "error" | "success" | "info"; children: ReactNode }) {
  if (!children) return null;
  return <div className={`alert alert-${type}`} role={type === "error" ? "alert" : "status"}>{children}</div>;
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Run an async loader on mount; returns data, loading, error and a reload fn. */
export function useLoad<T = any>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true); setError("");
    try { setData(await fn()); } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, loading, error, reload: load, setData };
}

export function fmtDateTime(v: any) {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d.getTime()) ? String(v) : d.toLocaleString();
}

type Student = { id: any; name: string } | null;
const AuthCtx = createContext<{ student: Student; setStudent: (s: Student) => void }>({ student: null, setStudent: () => {} });
export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student>(null);
  return <AuthCtx.Provider value={{ student, setStudent }}>{children}</AuthCtx.Provider>;
}
export const useAuth = () => useContext(AuthCtx);

export function AttendanceTable({ records, onToggle, busyId }: { records: any[]; onToggle?: (r: any) => void; busyId?: any }) {
  if (!records.length) return <p className="empty">No attendance records yet.</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>ID</th><th>Event</th><th>Student</th><th>Roll No.</th><th>Status</th><th>Time</th>{onToggle && <th></th>}</tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.eventTitle ?? r.eventId}</td>
              <td>{r.studentName ?? r.studentId}</td>
              <td>{r.rollNumber}</td>
              <td><span className={`badge ${r.status === "PRESENT" ? "badge-present" : "badge-absent"}`}>{r.status}</span></td>
              <td>{fmtDateTime(r.attendanceTime)}</td>
              {onToggle && (
                <td>
                  <button className="btn btn-sm btn-outline" disabled={busyId === r.id} onClick={() => onToggle(r)}>
                    {busyId === r.id ? "Saving…" : `Mark ${r.status === "PRESENT" ? "Absent" : "Present"}`}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
