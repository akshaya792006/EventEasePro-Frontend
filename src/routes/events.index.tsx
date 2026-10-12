/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { deleteEvent, getEvents } from "../api";
import { Alert, Loading, PageHeader, useLoad } from "../components/common";

export const Route = createFileRoute("/events/")({
  head: () => ({ meta: [{ title: "Events — EventEasePro" }, { name: "description", content: "All college events." }, { property: "og:title", content: "Events — EventEasePro" }, { property: "og:description", content: "All college events." }] }),
  component: Events,
});

function Events() {
  const { data, loading, error, setData } = useLoad<any[]>(getEvents);
  const [msg, setMsg] = useState({ ok: "", err: "" });

  const remove = async (e: any) => {
    if (!confirm(`Delete event "${e.title}"?`)) return;
    try { await deleteEvent(e.id); setData((data || []).filter((x) => x.id !== e.id)); setMsg({ ok: "Event deleted.", err: "" }); }
    catch (err: any) { setMsg({ ok: "", err: err.message }); }
  };

  return (
    <>
      <PageHeader title="Events" subtitle="Upcoming and past college events." action={<Link to="/events/new" className="btn btn-accent">+ Add Event</Link>} />
      <Alert type="success">{msg.ok}</Alert>
      <Alert type="error">{error || msg.err}</Alert>
      <div className="card">
        {loading ? <Loading /> : !data?.length ? <p className="empty">No events yet.</p> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Title</th><th>Department</th><th>Venue</th><th>Date</th><th></th></tr></thead>
            <tbody>{data.map((e) => (
              <tr key={e.id}>
                <td><strong>{e.title}</strong></td>
                <td>{e.department?.departmentName ?? e.department}</td>
                <td>{e.venue}</td>
                <td>{e.eventDate}</td>
                <td><div className="actions">
                  <Link to="/events/$id" params={{ id: String(e.id) }} className="btn btn-sm">View</Link>
                  <Link to="/events/$id/edit" params={{ id: String(e.id) }} className="btn btn-sm btn-outline">Edit</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(e)}>Delete</button>
                </div></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </>
  );
}
