import { createFileRoute } from "@tanstack/react-router";
import { EventForm } from "../components/EventForm";

export const Route = createFileRoute("/events/$id/edit")({
  head: () => ({ meta: [{ title: "Edit Event — EventEasePro" }, { name: "description", content: "Edit event details." }, { property: "og:title", content: "Edit Event" }, { property: "og:description", content: "Edit event details." }] }),
  component: EditEvent,
});

function EditEvent() {
  const { id } = Route.useParams();
  return <EventForm id={id} />;
}
