import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap" style={{ paddingTop: 60 }}>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 22 }}>여긴 아직 길이 아니야</h1>
      <p style={{ color: "var(--ink-dim)" }}>이 자리는 지우지 않았어 — 다만 아직 닿지 않은 곳.</p>
      <Link href="/ko" style={{ color: "var(--accent)" }}>처음으로 →</Link>
    </main>
  );
}
