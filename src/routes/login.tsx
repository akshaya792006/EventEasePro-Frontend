/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginStudent } from "../api";
import { Alert, PageHeader, useAuth } from "../components/common";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Student Login — EventEasePro" }, { name: "description", content: "Log in as a student." }, { property: "og:title", content: "Student Login" }, { property: "og:description", content: "Log in as a student." }] }),
  component: Login,
});

function Login() {
  const { setStudent } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ ok: "", err: "" });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg({ ok: "", err: "" });
    try {
      const r = await loginStudent(email, password);
      const s = r?.student ?? r;
      setStudent({ id: s?.id ?? s?.studentId, name: s?.fullName ?? s?.name ?? email });
      setMsg({ ok: "Logged in!", err: "" });
      setTimeout(() => nav({ to: "/" }), 600);
    } catch (err: any) {
      setMsg({ ok: "", err: `Login failed: ${err.message}. (Login may not be available on the server yet.)` });
    } finally { setBusy(false); }
  };
  return (
    <div style={{ maxWidth: 460, margin: "0 auto" }}>
      <PageHeader title="Student Login" />
      <div className="card">
        <Alert type="success">{msg.ok}</Alert>
        <Alert type="error">{msg.err}</Alert>
        <form className="form" onSubmit={submit}>
          <div className="field full"><label>Email</label><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="field full"><label>Password</label><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div className="full"><button className="btn" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button></div>
        </form>
      </div>
    </div>
  );
}
