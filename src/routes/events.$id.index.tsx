import { createFileRoute, Link } from "@tanstack/react-router";
import { getEvent } from "../api";
import { Alert, Loading, PageHeader, useLoad } from "../components/common";

export const Route = createFileRoute("/events/$id/")({
  head: () => ({ meta: [{ title: "Event Details — EventEasePro" }, { name: "description", content: "Event details, QR and attendance." }, { property: "og:title", content: "Event Details" }, { property: "og:description", content: "Event details, QR and attendance." }] }),
  component: EventDetails,
});

function EventDetails() {
  const { id } = Route.useParams();
  const { data: e, loading, error } = useLoad(() => getEvent(id), [id]);
  if (loading) return <Loading />;
  if (error) return <Alert type="error">{error}</Alert>;
  return (
    <>
      <PageHeader title={e.title} subtitle={`Event #${e.id}`} action={<Link to="/events" className="btn btn-outline">← All events</Link>} />
      <div className="card">
        <p>{e.description || <span className="muted">No description.</span>}</p>
        <dl className="detail-list">
          <dt>Department</dt><dd>{e.department?.departmentName ?? e.department}</dd>
          <dt>Venue</dt><dd>{e.venue}</dd>
          <dt>Date</dt><dd>{e.eventDate}</dd>
        </dl>
        <div className="actions">
          <Link to="/events/$id/qr" params={{ id }} className="btn btn-accent">Generate QR</Link>
          <Link to="/attendance/event/$eventId" params={{ eventId: id }} className="btn">View Attendance</Link>
          <Link to="/events/$id/edit" params={{ id }} className="btn btn-outline">Edit</Link>
        </div>
      </div>
    </>
  );
}
