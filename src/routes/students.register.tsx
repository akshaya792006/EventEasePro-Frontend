/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { registerStudent } from "../api";
import { Alert, PageHeader } from "../components/common";

export const Route = createFileRoute("/students/register")({
  head: () => ({ meta: [{ title: "Student Registration — EventEasePro" }, { name: "description", content: "Register as a student." }, { property: "og:title", content: "Student Registration" }, { property: "og:description", content: "Register as a student." }] }),
  component: Register,
});

const empty = { fullName: "", email: "", password: "", rollNumber: "", department: "", phoneNumber: "" };

function Register() {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ ok: "", err: "" });
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg({ ok: "", err: "" });
    try {
      const s = await registerStudent(form);
      setMsg({ ok: `Registered ${s?.fullName ?? form.fullName}${s?.id ? ` (student ID ${s.id})` : ""}.`, err: "" });
      setForm(empty);
    } catch (err: any) { setMsg({ ok: "", err: err.message }); } finally { setSaving(false); }
  };
  return (
    <>
      <PageHeader title="Student Registration" subtitle="Create a student account." />
      <div className="card">
        <Alert type="success">{msg.ok}</Alert>
        <Alert type="error">{msg.err}</Alert>
        <form className="form" onSubmit={submit}>
          <div className="field"><label>Full name</label><input required value={form.fullName} onChange={set("fullName")} /></div>
          <div className="field"><label>Email</label><input required type="email" value={form.email} onChange={set("email")} /></div>
          <div className="field"><label>Password</label><input required type="password" autoComplete="new-password" value={form.password} onChange={set("password")} /></div>
          <div className="field"><label>Roll number</label><input required value={form.rollNumber} onChange={set("rollNumber")} /></div>
          <div className="field"><label>Department</label><input required value={form.department} onChange={set("department")} /></div>
          <div className="field"><label>Phone number</label><input inputMode="numeric" value={form.phoneNumber} onChange={set("phoneNumber")} /></div>
          <div className="full"><button className="btn" disabled={saving}>{saving ? "Registering…" : "Register"}</button></div>
        </form>
      </div>
    </>
  );
}
