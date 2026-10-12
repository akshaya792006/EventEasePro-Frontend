/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { markAttendance } from "../api";
import { Alert, PageHeader, useAuth } from "../components/common";

export const Route = createFileRoute("/attendance/")({
  head: () => ({ meta: [{ title: "Attendance — EventEasePro" }, { name: "description", content: "Mark and view event attendance." }, { property: "og:title", content: "Attendance" }, { property: "og:description", content: "Mark and view event attendance." }] }),
  component: Attendance,
});

function Attendance() {
  const { student } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ eventId: "", studentId: student?.id ? String(student.id) : "", token: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ ok: "", err: "" });
  const [lookE, setLookE] = useState("");
  const [lookS, setLookS] = useState("");
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg({ ok: "", err: "" });
    try { await markAttendance(f.eventId.trim(), f.studentId.trim(), f.token.trim()); setMsg({ ok: "Attendance marked as PRESENT ✔", err: "" }); setF({ ...f, token: "" }); }
    catch (err: any) { setMsg({ ok: "", err: err.message }); } finally { setBusy(false); }
  };

  return (
    <>
      <PageHeader title="Attendance" subtitle="Mark attendance with the event's QR token, or look up records." />
      <div className="card">
        <h2>Mark attendance</h2>
        <Alert type="success">{msg.ok}</Alert>
        <Alert type="error">{msg.err}</Alert>
        <form className="form" onSubmit={submit}>
          <div className="field"><label>Event ID</label><input required value={f.eventId} onChange={set("eventId")} /></div>
          <div className="field"><label>Student ID</label><input required value={f.studentId} onChange={set("studentId")} /></div>
          <div className="field full"><label>QR token</label><input required value={f.token} onChange={set("token")} /></div>
          <div className="full"><button className="btn" disabled={busy}>{busy ? "Submitting…" : "Mark attendance"}</button></div>
        </form>
      </div>
      <div className="card">
        <h2>View attendance</h2>
        <div className="form">
          <form className="field" onSubmit={(e) => { e.preventDefault(); if (lookE) nav({ to: "/attendance/event/$eventId", params: { eventId: lookE.trim() } }); }}>
            <label>By event ID</label>
            <div className="actions"><input required value={lookE} onChange={(e) => setLookE(e.target.value)} style={{ flex: 1 }} /><button className="btn btn-outline">View</button></div>
          </form>
          <form className="field" onSubmit={(e) => { e.preventDefault(); if (lookS) nav({ to: "/attendance/student/$studentId", params: { studentId: lookS.trim() } }); }}>
            <label>By student ID</label>
            <div className="actions"><input required value={lookS} onChange={(e) => setLookS(e.target.value)} style={{ flex: 1 }} /><button className="btn btn-outline">View</button></div>
          </form>
        </div>
      </div>
    </>
  );
}
