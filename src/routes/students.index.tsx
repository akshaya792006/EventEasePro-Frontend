/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { deleteStudent, getStudents } from "../api";
import { Alert, Loading, PageHeader, useLoad } from "../components/common";

export const Route = createFileRoute("/students/")({
  head: () => ({ meta: [{ title: "Students — EventEasePro" }, { name: "description", content: "Registered students." }, { property: "og:title", content: "Students" }, { property: "og:description", content: "Registered students." }] }),
  component: Students,
});

function Students() {
  const { data, loading, error, setData } = useLoad<any[]>(getStudents);
  const [msg, setMsg] = useState({ ok: "", err: "" });
  const remove = async (s: any) => {
    if (!confirm(`Delete student "${s.fullName}"?`)) return;
    try { await deleteStudent(s.id); setData((data || []).filter((x) => x.id !== s.id)); setMsg({ ok: "Student deleted.", err: "" }); }
    catch (err: any) { setMsg({ ok: "", err: err.message }); }
  };
  return (
    <>
      <PageHeader title="Students" subtitle="Everyone registered on EventEasePro." action={<Link to="/students/register" className="btn btn-accent">+ Register Student</Link>} />
      <Alert type="success">{msg.ok}</Alert>
      <Alert type="error">{error || msg.err}</Alert>
      <div className="card">
        {loading ? <Loading /> : !data?.length ? <p className="empty">No students yet.</p> : (
          <div className="table-wrap"><table>
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Roll No.</th><th>Department</th><th>Phone</th><th></th></tr></thead>
            <tbody>{data.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td><td><strong>{s.fullName}</strong></td><td>{s.email}</td><td>{s.rollNumber}</td>
                <td>{s.department?.departmentName ?? s.department}</td><td>{s.phoneNumber}</td>
                <td><div className="actions">
                  <Link to="/attendance/student/$studentId" params={{ studentId: String(s.id) }} className="btn btn-sm btn-outline">Attendance</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(s)}>Delete</button>
                </div></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </>
  );
}
