/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getAttendanceByEvent, updateAttendanceStatus } from "../api";
import { Alert, AttendanceTable, Loading, PageHeader, useLoad } from "../components/common";

export const Route = createFileRoute("/attendance/event/$eventId")({
  head: () => ({ meta: [{ title: "Event Attendance — EventEasePro" }, { name: "description", content: "Attendance records for an event." }, { property: "og:title", content: "Event Attendance" }, { property: "og:description", content: "Attendance records for an event." }] }),
  component: EventAttendance,
});

function EventAttendance() {
  const { eventId } = Route.useParams();
  const { data, loading, error, setData } = useLoad<any[]>(() => getAttendanceByEvent(eventId), [eventId]);
  const [busyId, setBusyId] = useState<any>(null);
  const [msg, setMsg] = useState({ ok: "", err: "" });
  const toggle = async (r: any) => {
    const status = r.status === "PRESENT" ? "ABSENT" : "PRESENT";
    setBusyId(r.id); setMsg({ ok: "", err: "" });
    try {
      const u = await updateAttendanceStatus(r.id, status);
      setData((data || []).map((x) => (x.id === r.id ? { ...x, ...(u && typeof u === "object" ? u : {}), status } : x)));
      setMsg({ ok: `${r.studentName ?? "Student"} marked ${status}.`, err: "" });
    } catch (e: any) { setMsg({ ok: "", err: e.message }); } finally { setBusyId(null); }
  };
  return (
    <>
      <PageHeader title="Event Attendance" subtitle={`Event #${eventId}`} action={<Link to="/events/$id" params={{ id: eventId }} className="btn btn-outline">← Event</Link>} />
      <Alert type="success">{msg.ok}</Alert>
      <Alert type="error">{error || msg.err}</Alert>
      <div className="card">{loading ? <Loading /> : <AttendanceTable records={data || []} onToggle={toggle} busyId={busyId} />}</div>
    </>
  );
}
