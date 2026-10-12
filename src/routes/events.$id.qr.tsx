/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { generateQr } from "../api";
import { Alert, fmtDateTime, Loading, PageHeader } from "../components/common";

export const Route = createFileRoute("/events/$id/qr")({
  head: () => ({ meta: [{ title: "Event QR Code — EventEasePro" }, { name: "description", content: "Live attendance QR code." }, { property: "og:title", content: "Event QR Code" }, { property: "og:description", content: "Live attendance QR code." }] }),
  component: QrPage,
});

function QrPage() {
  const { id } = Route.useParams();
  const [qr, setQr] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [left, setLeft] = useState(0);
  const refresh = useRef<ReturnType<typeof setInterval> | null>(null);

  const generate = async () => {
    setLoading(true); setError("");
    try {
      const d = await generateQr(id);
      setQr(d); setLeft(d.validitySeconds ?? 300);
      if (refresh.current) clearInterval(refresh.current);
      refresh.current = setInterval(generate, (d.validitySeconds ?? 300) * 1000);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => { clearInterval(t); if (refresh.current) clearInterval(refresh.current); };
  }, []);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <>
      <PageHeader title="Attendance QR" subtitle={`Event #${id} — auto-refreshes every 5 minutes`} action={<Link to="/events/$id" params={{ id }} className="btn btn-outline">← Event</Link>} />
      <div className="card qr-box">
        <Alert type="error">{error}</Alert>
        {qr && <Alert type="success">QR code generated.</Alert>}
        {loading && !qr && <Loading text="Generating QR…" />}
        {qr && (
          <>
            <img src={`data:image/png;base64,${qr.qrImageBase64}`} alt="Attendance QR code" />
            <div className="countdown">{mm}:{ss}</div>
            <p className="muted">Expires at {fmtDateTime(qr.expiresAt)}</p>
            <p className="token">Token: {qr.token}</p>
          </>
        )}
        <button className="btn btn-accent" onClick={generate} disabled={loading}>{loading ? "Generating…" : qr ? "Regenerate now" : "Generate QR"}</button>
      </div>
    </>
  );
}
