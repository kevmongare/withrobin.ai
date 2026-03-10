import { useState, useEffect, useRef } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
// n8n flow: Webhook → Gemini Agent → Render HTML → Save to Sheets → Return HTML
// The app POSTs { Role, Service, "More Details" } and receives back a full HTML page.
const N8N_WEBHOOK = "https://robinwithrobin.app.n8n.cloud/webhook/ai-landing";

type ServiceOption = "Web Design" | "Data Analytics" | "AI Training" | "AI Automation";
const SERVICES: ServiceOption[] = ["Web Design", "Data Analytics", "AI Training", "AI Automation"];

// ── Robin Logo ────────────────────────────────────────────────────────────────
function RobinLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <defs>
          <linearGradient id="robinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ecdc4" />
            <stop offset="50%" stopColor="#45b7d1" />
            <stop offset="100%" stopColor="#2196f3" />
          </linearGradient>
        </defs>
        <path d="M18 4 C10 4 5 9 5 14 C5 19 9 22 14 22 C18 22 21 20 22 17 C23 14 22 11 20 9 C18 7 15 6 13 7 C10 8 9 11 10 14 C11 17 14 19 17 19 C20 19 22 17 23 15 C24 12 23 9 21 7 C19 5 16 4 18 4Z" stroke="url(#robinGrad)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M18 32 C26 32 31 27 31 22 C31 17 27 14 22 14 C18 14 15 16 14 19 C13 22 14 25 16 27 C18 29 21 30 23 29 C26 28 27 25 26 22 C25 19 22 17 19 17 C16 17 14 19 13 21 C12 24 13 27 15 29 C17 31 20 32 18 32Z" stroke="url(#robinGrad)" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
      </svg>
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 22,
        background: "linear-gradient(135deg, #4ecdc4, #45b7d1)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        letterSpacing: "-0.3px"
      }}>Robin</span>
    </div>
  );
}

// ── Pulse Loader ──────────────────────────────────────────────────────────────
function PulseLoader() {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "white",
          display: "inline-block",
          animation: "pulseDot 1.2s ease-in-out infinite",
          animationDelay: `${i * 0.2}s`
        }} />
      ))}
    </span>
  );
}

// ── Rendered HTML Page (inside srcdoc iframe so styles are isolated) ───────────
function RenderedPage({ html, onReset }: { html: string; onReset: () => void }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(800);

  // Resize iframe to match content height
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {
      try {
        const h = iframe.contentDocument?.body?.scrollHeight;
        if (h) setIframeHeight(h + 32);
      } catch { /* cross-origin guard */ }
    };
    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [html]);

  return (
    <div style={{ minHeight: "100vh", background: "#0d2b3e", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 32px", borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "#0a2233", position: "sticky", top: 0, zIndex: 10
      }}>
        <RobinLogo />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
            ✓ Generated &amp; saved to Sheets
          </span>
          <button
            onClick={onReset}
            style={{
              background: "#e8622a", color: "white", border: "none", borderRadius: 24,
              padding: "9px 20px", fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, fontSize: 13, cursor: "pointer"
            }}
          >
            ← New Page
          </button>
        </div>
      </div>

      {/* n8n-rendered HTML injected as srcdoc */}
      <iframe
        ref={iframeRef}
        srcDoc={html}
        style={{
          width: "100%", height: iframeHeight, border: "none",
          display: "block"
        }}
        title="Generated Landing Page"
      />
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState<string>("");
  const [service, setService] = useState<ServiceOption>("AI Automation");
  const [details, setDetails] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [renderedHtml, setRenderedHtml] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => { setMounted(true); }, []);

  const generate = async (): Promise<void> => {
    if (!role.trim() || !details.trim()) {
      setError("Please fill in your role and details to continue.");
      return;
    }
    setError("");
    setLoading(true);
    setRenderedHtml(null);

    try {
      // POST exactly the shape your n8n webhook expects
      const res = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Role: role,
          Service: service,
          "More Details": details,
        }),
      });

      if (!res.ok) throw new Error(`n8n responded with ${res.status}`);

      // n8n's "Return HTML" node sends back the rendered HTML string
      const html = await res.text();
      setRenderedHtml(html);
    } catch (err) {
      setError("Could not reach the n8n workflow. Make sure it's active and the webhook URL is correct.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Show the n8n-generated page
  if (renderedHtml) {
    return <RenderedPage html={renderedHtml} onReset={() => setRenderedHtml(null)} />;
  }

  // Form
  return (
    <div style={{ minHeight: "100vh", background: "#0d2b3e", fontFamily: "'DM Sans', sans-serif", color: "white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes pulseDot { 0%,80%,100%{opacity:0.25;transform:scale(0.75)} 40%{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-a { animation: fadeUp 0.55s ease both; }
        .fade-b { animation: fadeUp 0.55s 0.1s ease both; }
        .fade-c { animation: fadeUp 0.55s 0.2s ease both; }
        .fade-d { animation: fadeUp 0.55s 0.3s ease both; }
        .fade-e { animation: fadeUp 0.55s 0.4s ease both; }
        .field-focus:focus { outline: none; border-color: #e8622a !important; }
        .btn-gen:hover:not(:disabled) { background: #d4561f !important; }
      `}</style>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px", borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}>
        <RobinLogo />
        <button style={{
          background: "#e8622a", color: "white", border: "none", borderRadius: 24,
          padding: "10px 22px", fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, fontSize: 14, cursor: "pointer"
        }}>
          Contact Us
        </button>
      </nav>

      {/* Form */}
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "64px 24px" }}>
        {mounted && (
          <>
            <div className="fade-a" style={{ marginBottom: 36 }}>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "#e8622a", margin: "0 0 12px", lineHeight: 1.2 }}>
                Our Solution Is All About Service
              </h1>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 }}>
                AI is redefining business workflows. Describe your role and goals — Robin helps you turn AI into outcomes, with a personalized, human-first service model.

              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Role */}
              <div className="fade-b">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Your Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="e.g. Founder, Marketing Director, Consultant"
                  className="field-focus"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.12)",
                    borderRadius: 8, padding: "12px 14px", fontSize: 14,
                    color: "white", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s"
                  }}
                />
              </div>

              {/* Service */}
              <div className="fade-c">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Service Needed
                </label>
                <select
                  value={service}
                  onChange={e => setService(e.target.value as ServiceOption)}
                  className="field-focus"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "#0d2b3e", border: "1.5px solid rgba(255,255,255,0.12)",
                    borderRadius: 8, padding: "12px 14px", fontSize: 14,
                    color: "white", fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer", transition: "border-color 0.2s"
                  }}
                >
                  {SERVICES.map(s => (
                    <option key={s} value={s} style={{ background: "#0d2b3e" }}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Details */}
              <div className="fade-d">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  More Details
                </label>
                <textarea
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  rows={4}
                  placeholder="Tell us about your business, target audience, and goals..."
                  className="field-focus"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.12)",
                    borderRadius: 8, padding: "12px 14px", fontSize: 14,
                    color: "white", fontFamily: "'DM Sans', sans-serif",
                    resize: "vertical", lineHeight: 1.6, transition: "border-color 0.2s"
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  fontSize: 13, color: "#e8622a",
                  background: "rgba(232,98,42,0.1)", border: "1px solid rgba(232,98,42,0.25)",
                  borderRadius: 6, padding: "10px 14px"
                }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="fade-e">
                <button
                  onClick={generate}
                  disabled={loading}
                  className="btn-gen"
                  style={{
                    width: "100%",
                    background: loading ? "rgba(232,98,42,0.4)" : "#e8622a",
                    color: "white", border: "none", borderRadius: 8,
                    padding: "14px", fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600, fontSize: 15,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "background 0.2s"
                  }}
                >
                  {loading
                    ? <><PulseLoader /><span style={{ opacity: 0.7 }}>Generating your page…</span></>
                    : "Generate AI Page"
                  }
                </button>
              </div>

              <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)", margin: 0 }}>
                Powered by Robin · n8n 
              </p>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 40px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, margin: 0 }}>
          Copyright © 2026 Robin | Powered by Robin
        </p>
      </footer>
    </div>
  );
}
