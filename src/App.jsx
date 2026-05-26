import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   FlowSync — Project Management SaaS Landing Page
   Built with MERN stack aesthetic (MongoDB green + dark theme)
   Sample site by Ahamed Shahmi | shahmiahamed123@gmail.com
───────────────────────────────────────────────────────────── */

const BRAND   = "#00C47A";   // MongoDB-ish green — your brand color
const BRAND2  = "#00A868";
const DARK    = "#070B0F";
const DARK2   = "#0D1117";
const DARK3   = "#161B22";
const DARK4   = "#21262D";
const BORDER  = "rgba(255,255,255,0.08)";
const MUTED   = "#8B949E";
const WHITE   = "#F0F6FC";

// ── Animate on scroll ──────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, up = true, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : up ? "translateY(32px)" : "translateX(-20px)",
      transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
      ...style
    }}>
      {children}
    </div>
  );
}

// ── Animated counter ──────────────────────────────────────
function Counter({ end, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 28);
    return () => clearInterval(timer);
  }, [visible, end]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ── Typing effect for hero ────────────────────────────────
function Typewriter({ words }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    const word = words[wordIdx];
    const delay = deleting ? 45 : 95;
    const timer = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, charIdx + 1));
        if (charIdx + 1 === word.length) {
          setTimeout(() => setDeleting(true), 1800);
        } else setCharIdx(c => c + 1);
      } else {
        setText(word.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx(i => (i + 1) % words.length);
          setCharIdx(0);
        } else setCharIdx(c => c - 1);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words]);
  return (
    <span style={{ color: BRAND }}>
      {text}
      <span style={{ animation: "blink 1s step-end infinite", color: BRAND }}>|</span>
    </span>
  );
}

// ── Pricing toggle ────────────────────────────────────────
const PLANS = [
  {
    name: "Starter",
    monthly: 0,
    annual: 0,
    desc: "Perfect for freelancers and solo builders.",
    color: MUTED,
    features: ["Up to 3 projects", "2 team members", "5GB storage", "Basic analytics", "Email support", "REST API access"],
    missing: ["Custom domains", "Advanced reports", "Priority support", "SSO / SAML"],
  },
  {
    name: "Pro",
    monthly: 29,
    annual: 23,
    desc: "Built for growing teams who ship fast.",
    color: BRAND,
    popular: true,
    features: ["Unlimited projects", "Up to 20 members", "50GB storage", "Advanced analytics", "Priority support", "REST API + Webhooks", "Custom domains", "Kanban + Gantt views"],
    missing: ["SSO / SAML"],
  },
  {
    name: "Enterprise",
    monthly: 79,
    annual: 63,
    desc: "For large orgs that need control at scale.",
    color: "#A78BFA",
    features: ["Everything in Pro", "Unlimited members", "500GB storage", "Custom reports", "Dedicated CSM", "SSO / SAML", "On-premise option", "SLA guarantee", "Audit logs"],
    missing: [],
  },
];

// ── FAQ ──────────────────────────────────────────────────
const FAQS = [
  { q: "Is there a free trial?", a: "Yes — the Starter plan is free forever with no credit card required. Pro and Enterprise plans include a 14-day free trial with full access." },
  { q: "Can I switch plans anytime?", a: "Absolutely. Upgrade, downgrade, or cancel at any time. Billing adjusts automatically at your next cycle." },
  { q: "What stack is FlowSync built on?", a: "FlowSync runs on a full MERN stack — MongoDB for data, Express + Node.js for the API, and React for the frontend. Deployed on AWS with auto-scaling." },
  { q: "Is my data secure?", a: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We're SOC 2 Type II certified and GDPR compliant." },
  { q: "Do you offer custom integrations?", a: "Enterprise plans include custom webhook integrations and our REST API supports any MERN, Python, or third-party stack." },
];

// ── Testimonials ─────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Sarah Chen", role: "CTO, NovaSpark", avatar: "SC", text: "FlowSync replaced Jira and Notion for us in one shot. The MERN backend is blazing fast — our team spun up 12 projects in under a day.", rating: 5 },
  { name: "Marcus Webb", role: "Product Lead, Loopline", avatar: "MW", text: "The Kanban + Gantt view combination is something we've wanted for years. Real-time sync across the team is genuinely flawless.", rating: 5 },
  { name: "Priya Nair", role: "Founder, Buildstack", avatar: "PN", text: "Migrated from Asana in 2 hours. The API is clean and well-documented — our devs integrated our CI/CD pipeline in an afternoon.", rating: 5 },
];

// ── Nav links ─────────────────────────────────────────────
const NAV = ["Features", "Pricing", "Integrations", "Docs"];

// ── Feature cards ─────────────────────────────────────────
const FEATURES = [
  { icon: "⚡", title: "Real-time sync", desc: "Every update propagates to your entire team in under 80ms via WebSockets. No refresh needed — ever.", tag: "Node.js + Socket.io" },
  { icon: "🗂️", title: "Kanban & Gantt", desc: "Switch between board, list, timeline, and Gantt views with one click. Your data, your preferred layout.", tag: "React DnD" },
  { icon: "🍃", title: "MongoDB-powered", desc: "Flexible document model means your project schema evolves with your workflow — no painful migrations.", tag: "MongoDB Atlas" },
  { icon: "🔗", title: "REST API + Webhooks", desc: "Full REST API with 60+ endpoints. Trigger webhooks on any event — connect to Slack, GitHub, Zapier, or your own pipeline.", tag: "Express.js" },
  { icon: "📊", title: "Analytics dashboard", desc: "Burndown charts, velocity tracking, time-in-status breakdowns. All computed in real-time from your live data.", tag: "Recharts + Aggregation" },
  { icon: "🔒", title: "Role-based access", desc: "Owner, Admin, Member, and Guest roles with granular per-project permissions. SSO via SAML 2.0 on Enterprise.", tag: "JWT + OAuth 2.0" },
];

// ── Integration logos (text-based) ───────────────────────
const INTEGRATIONS = [
  { name: "GitHub", cat: "Code" }, { name: "Slack", cat: "Comms" },
  { name: "Figma", cat: "Design" }, { name: "Vercel", cat: "Deploy" },
  { name: "Stripe", cat: "Payments" }, { name: "Jira", cat: "Migration" },
  { name: "Notion", cat: "Docs" }, { name: "Linear", cat: "Issues" },
];

export default function FlowSync() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };

  return (
    <div style={{ background: DARK, color: WHITE, fontFamily: "'Inter','Segoe UI',sans-serif", overflowX: "hidden", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${BRAND}33; color: ${BRAND}; }
        a { text-decoration: none; color: inherit; }
        button { cursor: pointer; font-family: inherit; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:none} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 ${BRAND}44} 100%{box-shadow:0 0 0 18px transparent} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes scroll-x { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .hover-lift { transition: transform 0.25s ease, border-color 0.25s ease; }
        .hover-lift:hover { transform: translateY(-4px); border-color: ${BRAND}55 !important; }
        .btn-primary { background: ${BRAND}; color: #070B0F; border: none; padding: 13px 28px; font-size: 15px; font-weight: 600; border-radius: 8px; transition: all 0.2s; letter-spacing: -0.01em; }
        .btn-primary:hover { background: ${BRAND2}; transform: translateY(-1px); box-shadow: 0 8px 24px ${BRAND}40; }
        .btn-ghost { background: transparent; color: ${WHITE}; border: 1px solid ${BORDER}; padding: 12px 24px; font-size: 14px; font-weight: 500; border-radius: 8px; transition: all 0.2s; }
        .btn-ghost:hover { border-color: ${BRAND}66; background: ${BRAND}0D; }
        .nav-link { color: ${MUTED}; font-size: 14px; font-weight: 400; cursor: pointer; transition: color 0.2s; border: none; background: none; font-family: inherit; }
        .nav-link:hover { color: ${WHITE}; }
        .badge { display: inline-flex; align-items: center; gap: 6px; background: ${BRAND}15; color: ${BRAND}; border: 1px solid ${BRAND}30; padding: 5px 12px; border-radius: 99px; font-size: 12px; font-weight: 500; letter-spacing: 0.02em; }
        .feature-card { background: ${DARK3}; border: 1px solid ${BORDER}; border-radius: 12px; padding: 28px; transition: all 0.3s; }
        .feature-card:hover { border-color: ${BRAND}44; background: ${DARK4}; transform: translateY(-3px); }
        .plan-card { background: ${DARK3}; border: 1px solid ${BORDER}; border-radius: 14px; padding: 32px; flex: 1; min-width: 240px; transition: border-color 0.3s; }
        .plan-popular { border: 2px solid ${BRAND}; position: relative; }
        .plan-popular::before { content: "Most Popular"; position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: ${BRAND}; color: #070B0F; font-size: 11px; font-weight: 700; padding: 3px 12px; border-radius: 99px; letter-spacing: 0.05em; white-space: nowrap; }
        .check { color: ${BRAND}; margin-right: 10px; font-weight: 700; }
        .cross { color: ${MUTED}44; margin-right: 10px; }
        .faq-item { border-bottom: 1px solid ${BORDER}; }
        .faq-q { padding: 20px 0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; gap: 16px; }
        .faq-q:hover p { color: ${WHITE}; }
        .input-field { background: ${DARK3}; border: 1px solid ${BORDER}; color: ${WHITE}; padding: 13px 16px; font-size: 14px; font-family: inherit; border-radius: 8px; outline: none; transition: border-color 0.2s; }
        .input-field:focus { border-color: ${BRAND}66; }
        .input-field::placeholder { color: ${MUTED}; }
        .tag-pill { background: ${DARK4}; color: ${MUTED}; font-size: 11px; font-family: 'JetBrains Mono', monospace; padding: 3px 9px; border-radius: 4px; border: 1px solid ${BORDER}; }
        .toggle-wrap { display: flex; align-items: center; gap: 12px; }
        .toggle { position: relative; width: 44px; height: 24px; background: ${BORDER}; border-radius: 99px; border: none; cursor: pointer; transition: background 0.2s; }
        .toggle.on { background: ${BRAND}; }
        .toggle-knob { position: absolute; width: 18px; height: 18px; background: white; border-radius: 50%; top: 3px; left: 3px; transition: left 0.2s; }
        .toggle.on .toggle-knob { left: 23px; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; background: ${BRAND}22; border: 1px solid ${BRAND}44; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: ${BRAND}; flex-shrink: 0; }
        .star { color: #F0C040; font-size: 13px; }
        .section-label { font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: ${BRAND}; margin-bottom: 14px; }
        .section-title { font-size: clamp(28px, 4vw, 42px); font-weight: 700; letter-spacing: -0.03em; color: ${WHITE}; line-height: 1.15; }
        .section-sub { font-size: 16px; color: ${MUTED}; line-height: 1.7; margin-top: 14px; max-width: 520px; }
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr; }
          .plan-row { flex-direction: column !important; }
        }
      `}</style>

      {/* ── NAV ──────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 40px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navScrolled ? `${DARK}F0` : "transparent",
        backdropFilter: navScrolled ? "blur(16px)" : "none",
        borderBottom: navScrolled ? `1px solid ${BORDER}` : "none",
        transition: "all 0.3s",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: BRAND, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h5M10 9h5M9 3v5M9 10v5" stroke="#070B0F" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.03em", color: WHITE }}>FlowSync</span>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {NAV.map(n => <button key={n} className="nav-link" onClick={() => scrollTo(n.toLowerCase())}>{n}</button>)}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="btn-ghost" style={{ padding: "9px 18px", fontSize: 13 }}>Log in</button>
          <button className="btn-primary" style={{ padding: "9px 20px", fontSize: 13 }}>Start free</button>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 40px 80px", position: "relative", overflow: "hidden" }}>
        {/* BG grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`, backgroundSize: "48px 48px", opacity: 0.4, pointerEvents: "none" }} />
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: "20%", left: "50%", width: 800, height: 500, borderRadius: "50%", background: `radial-gradient(ellipse, ${BRAND}18 0%, transparent 65%)`, transform: "translateX(-50%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1180, margin: "0 auto", width: "100%", position: "relative" }}>
          <div className="hero-grid">
            {/* Left */}
            <div>
              <div style={{ opacity: 0, animation: "fadeUp 0.9s ease 0.1s forwards" }}>
                <span className="badge">
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: BRAND, animation: "pulse-ring 1.5s infinite" }} />
                  Now with AI-powered task suggestions
                </span>
              </div>

              <h1 style={{ fontSize: "clamp(38px, 5vw, 62px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "24px 0 20px", opacity: 0, animation: "fadeUp 0.9s ease 0.25s forwards" }}>
                Ship projects<br />
                <Typewriter words={["faster.", "smarter.", "together.", "on time."]} />
              </h1>

              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.7, maxWidth: 460, marginBottom: 36, fontWeight: 300, opacity: 0, animation: "fadeUp 0.9s ease 0.4s forwards" }}>
                FlowSync is the MERN-powered project management platform that keeps your engineering team in sync — real-time, API-first, and beautifully simple.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.9s ease 0.55s forwards" }}>
                <button className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }} onClick={() => scrollTo("pricing")}>
                  Start free — no card needed
                </button>
                <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${BRAND}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: `9px solid ${BRAND}`, marginLeft: 2 }} />
                  </span>
                  Watch demo  (2 min)
                </button>
              </div>

              {/* Social proof */}
              <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 16, opacity: 0, animation: "fadeUp 0.9s ease 0.7s forwards" }}>
                <div style={{ display: "flex" }}>
                  {["SC", "MW", "PN", "AJ"].map((init, i) => (
                    <div key={init} style={{ width: 32, height: 32, borderRadius: "50%", background: `${BRAND}22`, border: `2px solid ${DARK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: BRAND, marginLeft: i > 0 ? -10 : 0 }}>{init}</div>
                  ))}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 2 }}>{"★★★★★".split("").map((s,i) => <span key={i} className="star">{s}</span>)}</div>
                  <p style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Loved by <strong style={{ color: WHITE }}>4,200+</strong> engineering teams</p>
                </div>
              </div>
            </div>

            {/* Right — App mockup */}
            <FadeIn delay={300} up={false}>
              <div style={{ background: DARK2, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden", boxShadow: `0 32px 80px ${DARK}CC`, animation: "float 5s ease-in-out infinite" }}>
                {/* Window chrome */}
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
                  {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
                  <div style={{ flex: 1, background: DARK3, borderRadius: 4, height: 22, display: "flex", alignItems: "center", paddingLeft: 10 }}>
                    <span style={{ fontSize: 11, color: MUTED }} className="mono">app.flowsync.io/dashboard</span>
                  </div>
                </div>
                {/* Sidebar + content */}
                <div style={{ display: "flex", height: 340 }}>
                  {/* Sidebar */}
                  <div style={{ width: 52, borderRight: `1px solid ${BORDER}`, padding: "16px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    {["⊞","◫","◱","⊙","⚙"].map((icon, i) => (
                      <div key={i} style={{ width: 32, height: 32, borderRadius: 7, background: i === 0 ? `${BRAND}22` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: i === 0 ? BRAND : MUTED, cursor: "pointer" }}>{icon}</div>
                    ))}
                  </div>
                  {/* Main area */}
                  <div style={{ flex: 1, padding: "16px", overflowY: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: WHITE }}>Sprint 14 — In Progress</span>
                      <span style={{ fontSize: 11, color: BRAND, background: `${BRAND}15`, padding: "2px 8px", borderRadius: 4 }}>Live</span>
                    </div>
                    {/* Kanban columns */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, height: 260 }}>
                      {[
                        { label: "To Do", color: MUTED, tasks: ["Design tokens #42", "API rate limiting", "Onboarding flow"] },
                        { label: "In Progress", color: BRAND, tasks: ["Auth refactor", "MongoDB indexes"] },
                        { label: "Done", color: "#60D490", tasks: ["WebSocket setup", "CI pipeline", "Dark mode", "Type safety"] },
                      ].map(col => (
                        <div key={col.label} style={{ background: DARK3, borderRadius: 8, padding: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: col.color }} />
                            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{col.label}</span>
                            <span style={{ marginLeft: "auto", fontSize: 11, color: MUTED }}>{col.tasks.length}</span>
                          </div>
                          {col.tasks.map(t => (
                            <div key={t} style={{ background: DARK2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 10px", marginBottom: 6, fontSize: 11, color: WHITE }}>
                              {t}
                              <div style={{ marginTop: 5, display: "flex", gap: 4 }}>
                                <div style={{ height: 3, flex: 1, background: DARK4, borderRadius: 99 }}>
                                  <div style={{ height: "100%", width: `${Math.random() * 80 + 20}%`, background: col.color, borderRadius: 99 }} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Ticker */}
          <div style={{ marginTop: 72, paddingTop: 40, borderTop: `1px solid ${BORDER}`, display: "flex", gap: 64, flexWrap: "wrap" }}>
            {[["4,200+", "Teams"], ["99.98%", "Uptime"], ["80ms", "Sync latency"], ["60+", "API endpoints"]].map(([n, l]) => (
              <div key={l} style={{ opacity: 0, animation: "fadeUp 0.8s ease 1s forwards" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: WHITE, letterSpacing: "-0.03em" }}>{n}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" style={{ padding: "100px 40px", background: DARK2, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <p className="section-label">Features</p>
              <h2 className="section-title">Everything your team needs.<br />Nothing it doesn't.</h2>
              <p className="section-sub" style={{ margin: "14px auto 0" }}>Built on a full MERN stack so every feature is real-time, API-accessible, and extensible by your own engineers.</p>
            </div>
          </FadeIn>
          <div className="grid-2">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 80}>
                <div className="feature-card hover-lift">
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 600, color: WHITE }}>{f.title}</h3>
                    <span className="tag-pill">{f.tag}</span>
                  </div>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK CALLOUT ─────────────────────────────────── */}
      <section style={{ padding: "80px 40px", background: DARK }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "48px 52px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
              <div>
                <p className="section-label">Under the hood</p>
                <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em", color: WHITE, lineHeight: 1.2, marginBottom: 16 }}>Built on MERN —<br />open, fast, scalable.</h2>
                <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginBottom: 28 }}>Every layer of FlowSync is built on the MERN stack — chosen for its performance, ecosystem, and developer experience. The API is fully public so your team can build on top of it.</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn-primary" style={{ fontSize: 13, padding: "10px 20px" }} onClick={() => scrollTo("docs")}>Read the docs</button>
                  <button className="btn-ghost" style={{ fontSize: 13, padding: "10px 20px" }}>View on GitHub</button>
                </div>
              </div>
              {/* Stack visualization */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { layer: "Frontend", tech: "React 18 + Vite", detail: "TypeScript · Tailwind · React Query · Socket.io-client", color: "#61DAFB" },
                  { layer: "Backend", tech: "Node.js + Express", detail: "REST API · JWT auth · WebSocket · Rate limiting", color: "#68A063" },
                  { layer: "Database", tech: "MongoDB Atlas", detail: "Aggregation pipeline · Change streams · Atlas Search", color: BRAND },
                  { layer: "Infra", tech: "AWS + Docker", detail: "EC2 · S3 · CloudFront · Auto-scaling · CI/CD", color: "#FF9900" },
                ].map(({ layer, tech, detail, color }) => (
                  <div key={layer} style={{ background: DARK4, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 8, background: `${color}15`, border: `1px solid ${color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>{layer}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: WHITE }}>{tech}</span>
                      </div>
                      <p style={{ fontSize: 11, color: MUTED, marginTop: 3 }} className="mono">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── INTEGRATIONS ──────────────────────────────────────── */}
      <section id="integrations" style={{ padding: "100px 40px", background: DARK2, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <p className="section-label">Integrations</p>
              <h2 className="section-title">Plays well with your stack.</h2>
              <p className="section-sub" style={{ margin: "14px auto 0" }}>Connect FlowSync to the tools your team already loves — via native integrations or our open REST API.</p>
            </div>
          </FadeIn>
          <div className="grid-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {INTEGRATIONS.map((int, i) => (
              <FadeIn key={int.name} delay={i * 60}>
                <div className="hover-lift" style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{int.cat}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: WHITE }}>{int.name}</div>
                  <div style={{ width: 24, height: 2, background: BRAND, borderRadius: 99, margin: "10px auto 0" }} />
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={200}>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <p style={{ fontSize: 14, color: MUTED }}>+ 40 more via our REST API and Zapier connector</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{ padding: "100px 40px", background: DARK, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p className="section-label">Testimonials</p>
              <h2 className="section-title">Teams that ship fast use FlowSync.</h2>
            </div>
          </FadeIn>
          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 100}>
                <div style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28 }}>
                  <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                    {"★★★★★".split("").map((s,j) => <span key={j} className="star">{s}</span>)}
                  </div>
                  <p style={{ fontSize: 15, color: WHITE, lineHeight: 1.7, marginBottom: 20, fontWeight: 300 }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="avatar">{t.avatar}</div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: WHITE }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: MUTED }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: "100px 40px", background: DARK2, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p className="section-label">Pricing</p>
              <h2 className="section-title">Simple, honest pricing.</h2>
              <p className="section-sub" style={{ margin: "14px auto 20px" }}>Start free. Scale as you grow. Cancel anytime.</p>
              {/* Toggle */}
              <div className="toggle-wrap" style={{ justifyContent: "center" }}>
                <span style={{ fontSize: 14, color: annual ? MUTED : WHITE }}>Monthly</span>
                <button className={`toggle ${annual ? "on" : ""}`} onClick={() => setAnnual(a => !a)}>
                  <div className="toggle-knob" />
                </button>
                <span style={{ fontSize: 14, color: annual ? WHITE : MUTED }}>Annual</span>
                <span style={{ background: `${BRAND}15`, color: BRAND, border: `1px solid ${BRAND}33`, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99 }}>Save 20%</span>
              </div>
            </div>
          </FadeIn>
          <div className="plan-row" style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 80} style={{ flex: 1, minWidth: 240 }}>
                <div className={`plan-card ${plan.popular ? "plan-popular" : ""}`}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: plan.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{plan.name}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "8px 0" }}>
                    <span style={{ fontSize: 36, fontWeight: 700, color: WHITE, letterSpacing: "-0.04em" }}>
                      ${annual ? plan.annual : plan.monthly}
                    </span>
                    {(plan.monthly > 0) && <span style={{ fontSize: 14, color: MUTED }}>/mo</span>}
                  </div>
                  <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>{plan.desc}</p>
                  <button className={plan.popular ? "btn-primary" : "btn-ghost"} style={{ width: "100%", marginBottom: 24, fontSize: 14 }}>
                    {plan.monthly === 0 ? "Get started free" : "Start 14-day trial"}
                  </button>
                  <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", marginBottom: 10, fontSize: 14, color: WHITE }}>
                        <span className="check">✓</span>{f}
                      </div>
                    ))}
                    {plan.missing?.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", marginBottom: 10, fontSize: 14, color: MUTED }}>
                        <span className="cross">—</span>{f}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: "100px 40px", background: DARK, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <p className="section-label">FAQ</p>
              <h2 className="section-title">Questions answered.</h2>
            </div>
          </FadeIn>
          {FAQS.map((faq, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div className="faq-item">
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <p style={{ fontSize: 16, fontWeight: 500, color: WHITE }}>{faq.q}</p>
                  <span style={{ fontSize: 20, color: BRAND, transition: "transform 0.3s", display: "block", transform: openFaq === i ? "rotate(45deg)" : "none", flexShrink: 0 }}>+</span>
                </div>
                {openFaq === i && (
                  <div style={{ paddingBottom: 20, animation: "fadeUp 0.3s ease" }}>
                    <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.75 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────── */}
      <section style={{ padding: "100px 40px", background: DARK2, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <div style={{ background: DARK3, border: `1px solid ${BRAND}33`, borderRadius: 20, padding: "60px 48px" }}>
              <div style={{ width: 52, height: 52, background: `${BRAND}15`, border: `1px solid ${BRAND}33`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <span style={{ fontSize: 24 }}>⚡</span>
              </div>
              <h2 style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em", color: WHITE, marginBottom: 14, lineHeight: 1.2 }}>
                Your team ships faster<br />starting today.
              </h2>
              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, marginBottom: 32 }}>
                Join 4,200+ teams already using FlowSync. Free forever on Starter — no credit card, no BS.
              </p>
              {submitted ? (
                <div style={{ background: `${BRAND}15`, border: `1px solid ${BRAND}33`, borderRadius: 10, padding: "16px 24px", color: BRAND, fontSize: 15, fontWeight: 500 }}>
                  ✓ You're on the list — check your inbox!
                </div>
              ) : (
                <div style={{ display: "flex", gap: 12, maxWidth: 420, margin: "0 auto", flexWrap: "wrap" }}>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="Enter your work email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ flex: 1, minWidth: 200 }}
                  />
                  <button
                    className="btn-primary"
                    onClick={() => { if (email) setSubmitted(true); }}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Get started free
                  </button>
                </div>
              )}
              <p style={{ fontSize: 12, color: MUTED, marginTop: 16 }}>Free forever · No credit card · Cancel anytime</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ padding: "52px 40px 32px", background: DARK, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, background: BRAND, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3 9h5M10 9h5M9 3v5M9 10v5" stroke="#070B0F" strokeWidth="2.2" strokeLinecap="round"/></svg>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: WHITE }}>FlowSync</span>
              </div>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, maxWidth: 260 }}>Project management for engineering teams who ship. MERN-powered, API-first.</p>
            </div>
            {[
              { label: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
              { label: "Developers", links: ["API docs", "Webhooks", "SDK", "Status"] },
              { label: "Company", links: ["About", "Blog", "Careers", "Contact"] },
            ].map(col => (
              <div key={col.label}>
                <p style={{ fontSize: 12, fontWeight: 600, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>{col.label}</p>
                {col.links.map(l => (
                  <p key={l} style={{ fontSize: 14, color: MUTED, marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = WHITE}
                    onMouseLeave={e => e.target.style.color = MUTED}>{l}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 13, color: MUTED }}>© 2026 FlowSync Inc. All rights reserved.</p>
            <p style={{ fontSize: 12, color: MUTED }}>Built by <span style={{ color: BRAND }}>Ahamed Shahmi</span> · shahmiahamed123@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}