import { useState, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Service {
  name: string;
  description: string;
}

interface PageData {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  services: Service[];
  clients: string[];
  cta_title: string;
  cta_button: string;
}

type ServiceOption = "Web Design" | "Data Analytics" | "AI Training" | "AI Automation";
const SERVICES: ServiceOption[] = ["Web Design", "Data Analytics", "AI Training", "AI Automation"];

// ── Robin Logo (matches site — teal gradient knot + wordmark) ─────────────────
function RobinLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* Teal gradient SVG knot mark matching Robin logo */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <defs>
          <linearGradient id="robinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ecdc4" />
            <stop offset="50%" stopColor="#45b7d1" />
            <stop offset="100%" stopColor="#2196f3" />
          </linearGradient>
        </defs>
        {/* Stylized overlapping loops like the Robin mark */}
        <path d="M18 4 C10 4 5 9 5 14 C5 19 9 22 14 22 C18 22 21 20 22 17 C23 14 22 11 20 9 C18 7 15 6 13 7 C10 8 9 11 10 14 C11 17 14 19 17 19 C20 19 22 17 23 15 C24 12 23 9 21 7 C19 5 16 4 18 4Z" stroke="url(#robinGrad)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M18 32 C26 32 31 27 31 22 C31 17 27 14 22 14 C18 14 15 16 14 19 C13 22 14 25 16 27 C18 29 21 30 23 29 C26 28 27 25 26 22 C25 19 22 17 19 17 C16 17 14 19 13 21 C12 24 13 27 15 29 C17 31 20 32 18 32Z" stroke="url(#robinGrad)" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
      </svg>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 700,
        fontSize: 22,
        background: "linear-gradient(135deg, #4ecdc4, #45b7d1)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "-0.3px"
      }}>Robin</span>
    </div>
  );
}

// ── Service Icon (orange circle with icon) ────────────────────────────────────
function ServiceIcon({ index }: { index: number }) {
  const icons = [
    // System Redesign - gear/settings
    <path key="a" d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm-6.5 3.5a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z M10.5 2h3v3h-3zM10.5 19h3v3h-3zM2 10.5v3h3v-3zM19 10.5v3h3v-3z" fill="white" fillRule="evenodd" />,
    // Software - circuit/grid  
    <path key="b" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm2 2v10h12V7H6zm2 2h2v2H8V9zm4 0h2v2h-2V9zm-4 4h2v2H8v-2zm4 0h2v2h-2v-2z" fill="white" fillRule="evenodd" />,
    // Specialists - person/head
    <path key="c" d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 8a6 6 0 1112 0A6 6 0 016 8zm-2 9a4 4 0 014-4h8a4 4 0 014 4v1H4v-1z" fill="white" fillRule="evenodd" />,
  ];

  return (
    <div style={{
      width: 52, height: 52, borderRadius: "50%",
      background: "linear-gradient(135deg, #e8622a, #f07840)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, boxShadow: "0 4px 16px rgba(232,98,42,0.35)"
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        {icons[index % icons.length]}
      </svg>
    </div>
  );
}

// ── Pulse Loader ──────────────────────────────────────────────────────────────
function PulseLoader() {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "white", display: "inline-block",
          animation: "pulseDot 1.2s ease-in-out infinite",
          animationDelay: `${i * 0.2}s`
        }} />
      ))}
    </span>
  );
}

// ── Generated Landing Page ────────────────────────────────────────────────────
function GeneratedPage({ data, onReset }: { data: PageData; onReset: () => void }) {
  const { hero_title, hero_subtitle, hero_description, services, clients, cta_title, cta_button } = data;

  return (
    <div style={{ minHeight: "100vh", background: "#0d2b3e", fontFamily: "'DM Sans', sans-serif", color: "white" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px", borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}>
        <RobinLogo />
        <button
          onClick={onReset}
          style={{
            background: "#e8622a", color: "white", border: "none",
            borderRadius: 24, padding: "10px 22px", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, fontSize: 14, cursor: "pointer"
          }}
        >
          ← New Page
        </button>
      </nav>

      {/* Hero — split layout */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
        {/* Left */}
        <div>
          <h1 style={{ fontSize: 38, fontWeight: 700, color: "#e8622a", marginBottom: 20, lineHeight: 1.25, marginTop: 0 }}>
            {hero_title}
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.75)", marginBottom: 8 }}>
            {hero_subtitle}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.75)", marginBottom: 40 }}>
            {hero_description}
          </p>

          {/* Services list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {services.slice(0, 3).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                <ServiceIcon index={i} />
                <div>
                  <h3 style={{ color: "#e8622a", fontWeight: 600, fontSize: 17, margin: "0 0 6px" }}>{s.name}</h3>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA inline */}
          <div style={{ marginTop: 40, padding: "20px 24px", background: "rgba(255,255,255,0.04)", borderRadius: 8, borderLeft: "3px solid #e8622a" }}>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: "white" }}>{cta_title}</strong>
            </p>
          </div>
        </div>

        {/* Right — abstract visual placeholder styled like Robin */}
        <div>
          <div style={{
            background: "linear-gradient(135deg, rgba(78,205,196,0.12), rgba(69,183,209,0.08))",
            borderRadius: 12, aspectRatio: "1", display: "flex", alignItems: "center",
            justifyContent: "center", border: "1px solid rgba(78,205,196,0.15)", overflow: "hidden"
          }}>
            {/* Abstract knot SVG inspired by Robin hero image */}
            <svg width="320" height="320" viewBox="0 0 320 320" fill="none" style={{ opacity: 0.75 }}>
              <defs>
                <linearGradient id="knotGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#b0c8d4" />
                  <stop offset="100%" stopColor="#dce8ec" />
                </linearGradient>
                <linearGradient id="knotGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#94b8c4" />
                  <stop offset="100%" stopColor="#c8dce4" />
                </linearGradient>
              </defs>
              {/* Toroidal knot paths */}
              <ellipse cx="160" cy="160" rx="110" ry="60" stroke="url(#knotGrad1)" strokeWidth="18" fill="none" strokeLinecap="round" transform="rotate(-20 160 160)" opacity="0.9"/>
              <ellipse cx="160" cy="160" rx="80" ry="110" stroke="url(#knotGrad2)" strokeWidth="18" fill="none" strokeLinecap="round" transform="rotate(10 160 160)" opacity="0.75"/>
              <ellipse cx="160" cy="160" rx="100" ry="40" stroke="url(#knotGrad1)" strokeWidth="14" fill="none" strokeLinecap="round" transform="rotate(60 160 160)" opacity="0.6"/>
              <ellipse cx="160" cy="160" rx="50" ry="100" stroke="url(#knotGrad2)" strokeWidth="14" fill="none" strokeLinecap="round" transform="rotate(-50 160 160)" opacity="0.5"/>
              {/* Tiny figures */}
              <circle cx="220" cy="100" r="4" fill="rgba(255,255,255,0.6)" />
              <line x1="220" y1="104" x2="220" y2="116" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
              <circle cx="130" cy="230" r="3.5" fill="rgba(255,255,255,0.5)" />
              <line x1="130" y1="233.5" x2="130" y2="244" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
              {/* Sparkle dots */}
              {[[260,140],[240,200],[100,120],[80,190],[180,260]].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 2 : 1.5} fill="rgba(255,200,100,0.5)" />
              ))}
            </svg>
          </div>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 13, fontStyle: "italic", marginTop: 12 }}>
            Every superhero needs a sidekick
          </p>

          {/* Trusted by */}
          {clients.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>Trusted by</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {clients.map((c, i) => (
                  <span key={i} style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 20, padding: "5px 14px", fontSize: 13, color: "rgba(255,255,255,0.55)"
                  }}>{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mailing list strip — matching Robin */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "48px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontWeight: 700, fontSize: 16, color: "white", marginBottom: 24 }}>
            Join our mailing list for insights, tips, and updates on the work Robin is doing to transform the way we work with AI.
          </p>
          <div style={{ display: "flex", gap: 0, maxWidth: 500 }}>
            <input
              placeholder="Enter your Email Address"
              style={{
                flex: 1, background: "white", border: "none", borderRadius: "6px 0 0 6px",
                padding: "12px 16px", fontSize: 14, color: "#1a1a1a", outline: "none"
              }}
            />
            <button style={{
              background: "#e8622a", color: "white", border: "none",
              borderRadius: "0 6px 6px 0", padding: "12px 24px",
              fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
            }}>
              {cta_button || "Join Now"}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 40px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Copyright © 2026 Robin | Powered by Robin</p>
      </footer>
    </div>
  );
}

// ── Main Form App ─────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState<string>("");
  const [service, setService] = useState<ServiceOption>("AI Automation");
  const [details, setDetails] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pageData, setPageData] = useState<PageData | null>(null);
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
    setPageData(null);

    const prompt = `You are a conversion-focused website copywriter for a premium AI services company called Robin (withrobin.ai).
Their tagline is "Our Solution Is All About Service". Write in a clear, outcome-focused, human-first tone. No hype. No jargon.

User Info:
Role: ${role}
Service: ${service}
Details: ${details}

Generate a full homepage structure.

Return ONLY valid JSON, no markdown, no backticks:
{
 "hero_title":"",
 "hero_subtitle":"",
 "hero_description":"",
 "services":[
  {"name":"","description":""},
  {"name":"","description":""},
  {"name":"","description":""}
 ],
 "clients":["","",""],
 "cta_title":"",
 "cta_button":""
}`;

    try {
      const res = await fetch("https://robinwithrobin.app.n8n.cloud/webhook-test/ai-landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text: string = data.content?.map((b: { text?: string }) => b.text ?? "").join("") ?? "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed: PageData = JSON.parse(clean);
      setPageData(parsed);
    } catch (err) {
      setError("Something went wrong generating the page. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (pageData) return <GeneratedPage data={pageData} onReset={() => setPageData(null)} />;

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
                AI is redefining business workflows. Describe your role and goals — Robin generates your personalised homepage in seconds.
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
                    color: "white", fontFamily: "'DM Sans', sans-serif",
                    transition: "border-color 0.2s"
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
                  {SERVICES.map(s => <option key={s} value={s} style={{ background: "#0d2b3e" }}>{s}</option>)}
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
                    resize: "vertical", lineHeight: 1.6,
                    transition: "border-color 0.2s"
                  }}
                />
              </div>

              {error && (
                <div style={{ fontSize: 13, color: "#e8622a", background: "rgba(232,98,42,0.1)", border: "1px solid rgba(232,98,42,0.25)", borderRadius: 6, padding: "10px 14px" }}>
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
                    width: "100%", background: loading ? "rgba(232,98,42,0.4)" : "#e8622a",
                    color: "white", border: "none", borderRadius: 8,
                    padding: "14px", fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "background 0.2s"
                  }}
                >
                  {loading ? <><PulseLoader /><span style={{ opacity: 0.7 }}>Generating your page…</span></> : "Generate AI Page"}
                </button>
              </div>

              <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)", margin: 0 }}>
                Powered by Robin · Built on Claude
              </p>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 40px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, margin: 0 }}>Copyright © 2026 Robin | Powered by Robin</p>
      </footer>
    </div>
  );
}
