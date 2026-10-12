import { createFileRoute } from "@tanstack/react-router";
import { EventForm } from "../components/EventForm";

export const Route = createFileRoute("/events/new")({
  head: () => ({ meta: [{ title: "Add Event — EventEasePro" }, { name: "description", content: "Create a new college event." }, { property: "og:title", content: "Add Event" }, { property: "og:description", content: "Create a new college event." }] }),
  component: () => <EventForm />,
});
