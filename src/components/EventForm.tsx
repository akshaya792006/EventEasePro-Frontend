/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createEvent, getDepartments, getEvent, updateEvent } from "../api";
import { Alert, Loading, PageHeader } from "./common";

const empty = { title: "", description: "", department: "", venue: "", eventDate: "" };

export function EventForm({ id }: { id?: string }) {
  const nav = useNavigate();
  const [form, setForm] = useState<any>(empty);
  const [depts, setDepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getDepartments().then((d) => setDepts(Array.isArray(d) ? d : [])).catch(() => {});
    if (id) getEvent(id)
      .then((e) => setForm({ ...empty, ...e, department: e.department?.departmentName ?? e.department ?? "", eventDate: (e.eventDate || "").slice(0, 10) }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    const body = { title: form.title, description: form.description, department: form.department, venue: form.venue, eventDate: form.eventDate };
    try {
      const saved = id ? await updateEvent(id, body) : await createEvent(body);
      setSuccess(id ? "Event updated!" : "Event created!");
      setTimeout(() => nav({ to: "/events/$id", params: { id: String(saved?.id ?? id) } }), 700);
    } catch (err: any) { setError(err.message); } finally { setSaving(false); }
  };

  if (loading) return <Loading />;
  return (
    <>
      <PageHeader title={id ? "Edit Event" : "Add Event"} subtitle="Fill in the event details." />
      <div className="card">
        <Alert type="error">{error}</Alert>
        <Alert type="success">{success}</Alert>
        <form className="form" onSubmit={submit}>
          <div className="field full"><label>Title</label><input required value={form.title} onChange={set("title")} /></div>
          <div className="field full"><label>Description</label><textarea rows={4} value={form.description} onChange={set("description")} /></div>
          <div className="field"><label>Department</label>
            <input required list="dept-list" value={form.department} onChange={set("department")} />
            <datalist id="dept-list">{depts.map((d) => <option key={d.id} value={d.departmentName} />)}</datalist>
          </div>
          <div className="field"><label>Venue</label><input required value={form.venue} onChange={set("venue")} /></div>
          <div className="field"><label>Event date</label><input required type="date" value={form.eventDate} onChange={set("eventDate")} /></div>
          <div className="full actions">
            <button className="btn" disabled={saving}>{saving ? "Saving…" : id ? "Save changes" : "Create event"}</button>
            <button type="button" className="btn btn-outline" onClick={() => history.back()}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}
