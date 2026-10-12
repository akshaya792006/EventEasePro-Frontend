import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getDepartments, getEvents, getStudents } from "../api";
import { Alert, useAuth } from "../components/common";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — EventEasePro" },
      { name: "description", content: "Manage college events, departments, students and QR attendance." },
      { property: "og:title", content: "EventEasePro Dashboard" },
      { property: "og:description", content: "College event registration and QR-based attendance." },
    ],
  }),
  component: Home,
});

function Home() {
  const { student } = useAuth();
  const [counts, setCounts] = useState<any>({ events: null, students: null, departments: null });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const entries = [["events", getEvents], ["students", getStudents], ["departments", getDepartments]] as const;
    Promise.allSettled(entries.map(([, fn]) => fn())).then((res) => {
      const c: any = {};
      const errs: string[] = [];
      res.forEach((r, i) => {
        const k = entries[i]![0];
        if (r.status === "fulfilled") c[k] = Array.isArray(r.value) ? r.value.length : 0;
        else { c[k] = null; errs.push(`${k}: ${r.reason?.message}`); }
      });
      setCounts(c); setErrors([...new Set(errs)]); setLoading(false);
    });
  }, []);

  const cards = [
    { to: "/events", icon: "📅", label: "Events", count: counts.events },
    { to: "/departments", icon: "🏛️", label: "Departments", count: counts.departments },
    { to: "/students", icon: "🎓", label: "Students", count: counts.students },
    { to: "/attendance", icon: "✅", label: "Attendance", count: undefined },
  ] as const;

  return (
    <>
      <section className="hero">
        <h1>{student ? `Welcome back, ${student.name}!` : "Welcome to EventEasePro"}</h1>
        <p>Register for college events, manage departments and students, and take attendance with secure, auto-refreshing QR codes.</p>
      </section>
      {errors.length > 0 && <Alert type="error">Couldn't load some counts — {errors.join(" · ")}</Alert>}
      <div className="grid">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="card stat-card">
            <div className="icon">{c.icon}</div>
            <div className="num">{c.count === undefined ? "→" : loading ? "…" : c.count ?? "—"}</div>
            <div className="label">{c.label}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
