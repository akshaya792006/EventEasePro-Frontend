import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "./common";

const links = [
  { to: "/", label: "Home", exact: true },
  { to: "/events", label: "Events" },
  { to: "/departments", label: "Departments" },
  { to: "/students", label: "Students", exact: true },
  { to: "/students/register", label: "Register" },
  { to: "/attendance", label: "Attendance" },
] as const;

export function Navbar() {
  const { student, setStudent } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">Event<span>Ease</span>Pro</Link>
        <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
        <nav className={`nav-links ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: "exact" in l }} activeProps={{ className: "active" }}>
              {l.label}
            </Link>
          ))}
          {student ? (
            <span className="nav-user">
              👤 {student.name} <small>#{student.id}</small>
              <button className="btn btn-sm btn-ghost" onClick={() => setStudent(null)}>Logout</button>
            </span>
          ) : (
            <Link to="/login" activeProps={{ className: "active" }}>Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
