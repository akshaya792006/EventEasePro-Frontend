/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from "../api";
import { Alert, Loading, PageHeader, useLoad } from "../components/common";

export const Route = createFileRoute("/departments")({
  head: () => ({ meta: [{ title: "Departments — EventEasePro" }, { name: "description", content: "Manage college departments and coordinators." }, { property: "og:title", content: "Departments" }, { property: "og:description", content: "Manage college departments." }] }),
  component: Departments,
});

const empty = { departmentName: "", coordinatorName: "", coordinatorEmail: "", contactNumber: "" };

function Departments() {
  const { data, loading, error, reload } = useLoad<any[]>(getDepartments);
  const [form, setForm] = useState<any>(empty);
  const [editId, setEditId] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ ok: "", err: "" });
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.contactNumber && !/^\d{10}$/.test(form.contactNumber)) return setMsg({ ok: "", err: "Contact number must be exactly 10 digits." });
    setSaving(true); setMsg({ ok: "", err: "" });
    const body = { ...form, contactNumber: form.contactNumber || null };
    try {
      if (editId) await updateDepartment(editId, body); else await createDepartment(body);
      setMsg({ ok: editId ? "Department updated." : "Department added.", err: "" });
      setForm(empty); setEditId(null); reload();
    } catch (err: any) { setMsg({ ok: "", err: err.message }); } finally { setSaving(false); }
  };

  const remove = async (d: any) => {
    if (!confirm(`Delete department "${d.departmentName}"?`)) return;
    try { await deleteDepartment(d.id); setMsg({ ok: "Department deleted.", err: "" }); reload(); }
    catch (err: any) { setMsg({ ok: "", err: err.message }); }
  };

  return (
    <>
      <PageHeader title="Departments" subtitle="Departments and their event coordinators." />
      <Alert type="success">{msg.ok}</Alert>
      <Alert type="error">{msg.err}</Alert>
      <div className="card">
        <h2>{editId ? "Edit department" : "Add department"}</h2>
        <form className="form" onSubmit={submit}>
          <div className="field"><label>Department name</label><input required value={form.departmentName} onChange={set("departmentName")} /></div>
          <div className="field"><label>Coordinator name</label><input required value={form.coordinatorName} onChange={set("coordinatorName")} /></div>
          <div className="field"><label>Coordinator email</label><input required type="email" value={form.coordinatorEmail} onChange={set("coordinatorEmail")} /></div>
          <div className="field"><label>Contact number</label><input inputMode="numeric" maxLength={10} value={form.contactNumber ?? ""} onChange={set("contactNumber")} /><span className="hint">Optional, 10 digits</span></div>
          <div className="full actions">
            <button className="btn" disabled={saving}>{saving ? "Saving…" : editId ? "Save changes" : "Add department"}</button>
            {editId && <button type="button" className="btn btn-outline" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="card">
        <Alert type="error">{error}</Alert>
        {loading ? <Loading /> : !data?.length ? <p className="empty">No departments yet.</p> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>Coordinator</th><th>Email</th><th>Contact</th><th></th></tr></thead>
            <tbody>{data.map((d) => (
              <tr key={d.id}>
                <td><strong>{d.departmentName}</strong></td><td>{d.coordinatorName}</td><td>{d.coordinatorEmail}</td><td>{d.contactNumber || "—"}</td>
                <td><div className="actions">
                  <button className="btn btn-sm btn-outline" onClick={() => { setEditId(d.id); setForm({ ...empty, ...d, contactNumber: d.contactNumber ?? "" }); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(d)}>Delete</button>
                </div></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </>
  );
}
