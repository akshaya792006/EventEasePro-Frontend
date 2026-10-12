/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { getAttendanceByStudent } from "../api";
import { Alert, AttendanceTable, Loading, PageHeader, useLoad } from "../components/common";

export const Route = createFileRoute("/attendance/student/$studentId")({
  head: () => ({ meta: [{ title: "Student Attendance — EventEasePro" }, { name: "description", content: "Attendance history for a student." }, { property: "og:title", content: "Student Attendance" }, { property: "og:description", content: "Attendance history for a student." }] }),
  component: StudentAttendance,
});

function StudentAttendance() {
  const { studentId } = Route.useParams();
  const { data, loading, error } = useLoad<any[]>(() => getAttendanceByStudent(studentId), [studentId]);
  return (
    <>
      <PageHeader title="Student Attendance" subtitle={`Student #${studentId}`} action={<Link to="/students" className="btn btn-outline">← Students</Link>} />
      <Alert type="error">{error}</Alert>
      <div className="card">{loading ? <Loading /> : <AttendanceTable records={data || []} />}</div>
    </>
  );
}
