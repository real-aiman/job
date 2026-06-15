/**
 * ============================================================
 * JOBIE — AI-Powered Job Portal
 * Mobile-First | Light / Dark Mode | Full CRUD | Role-Based Dashboards
 * Enhanced: Mobile nav, responsive grids, working apply flow,
 * swipe-friendly cards, toast fixes, smooth transitions
 * ============================================================
 */

import {
  useState, useEffect, useCallback, useRef,
  createContext, useContext, useReducer, useMemo,
} from "react";

/* ============================================================
   THEME CONTEXT
   ============================================================ */
const ThemeContext = createContext(null);
const useTheme = () => useContext(ThemeContext);

const makeTokens = (dark) => ({
  mint: "#00C9A7",
  mintLight: dark ? "#00C9A718" : "#E0FBF5",
  mintDark: dark ? "#00E5C4" : "#00A389",
  emerald: "#059669",
  bg: dark ? "#0D1F1C" : "#F8FFFE",
  surface: dark ? "#132420" : "#F0FEFA",
  card: dark ? "#1A2E2A" : "#FFFFFF",
  border: dark ? "#2A4A44" : "#C8EDE6",
  text: dark ? "#E8FBF7" : "#0D2926",
  textMuted: dark ? "#7ABFB5" : "#4A6B64",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  accent: "#00E5C4",
});

/* ============================================================
   AUTH CONTEXT
   ============================================================ */
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": return { ...state, user: action.payload, isAuth: true };
    case "LOGOUT": return { user: null, isAuth: false };
    case "UPDATE": return { ...state, user: { ...state.user, ...action.payload } };
    default: return state;
  }
};

/* ============================================================
   RESPONSIVE HOOK
   ============================================================ */
const useIsMobile = () => {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
};

/* ============================================================
   INITIAL DATA
   ============================================================ */
const INITIAL_JOBS = [
  { id: 1, title: "Senior AI Engineer", company: "NeuralSync", location: "Remote", salary: "PKR 800K–1.2M/mo", type: "Full-time", category: "AI/ML", experience: "Senior", logo: "N", color: "#00C9A7", posted: "2 days ago", applicants: 47, views: 1240, match: 94, desc: "Build next-gen AI systems at the frontier of machine intelligence. Work with LLMs, computer vision, and reinforcement learning.", skills: ["Python", "PyTorch", "LLMs", "MLOps"] },
  { id: 2, title: "Full Stack Developer", company: "CodeVault", location: "Lahore, PK", salary: "PKR 400K–600K/mo", type: "Full-time", category: "Engineering", experience: "Mid", logo: "C", color: "#059669", posted: "1 day ago", applicants: 83, views: 2100, match: 88, desc: "Join our engineering team to build scalable SaaS platforms. React, Node.js, PostgreSQL stack.", skills: ["React", "Node.js", "TypeScript", "PostgreSQL"] },
  { id: 3, title: "Product Designer (UI/UX)", company: "Lumos Design", location: "Karachi, PK", salary: "PKR 350K–550K/mo", type: "Full-time", category: "Design", experience: "Mid", logo: "L", color: "#8B5CF6", posted: "3 days ago", applicants: 29, views: 890, match: 76, desc: "Shape the visual identity of our B2B SaaS tools. Figma, Framer, design systems expertise required.", skills: ["Figma", "Framer", "Design Systems", "Prototyping"] },
  { id: 4, title: "DevOps / Cloud Architect", company: "SkyLayer", location: "Remote", salary: "PKR 700K–1M/mo", type: "Contract", category: "Infrastructure", experience: "Senior", logo: "S", color: "#F59E0B", posted: "5 days ago", applicants: 18, views: 670, match: 71, desc: "Architect cloud-native infrastructure on AWS/GCP. Kubernetes, Terraform, CI/CD pipelines.", skills: ["AWS", "Kubernetes", "Terraform", "Docker"] },
  { id: 5, title: "Mobile Engineer (React Native)", company: "MotionApp", location: "Islamabad, PK", salary: "PKR 450K–700K/mo", type: "Full-time", category: "Mobile", experience: "Mid", logo: "M", color: "#EF4444", posted: "1 week ago", applicants: 61, views: 1560, match: 82, desc: "Build beautiful cross-platform mobile apps with React Native. Performance optimization and native modules.", skills: ["React Native", "TypeScript", "iOS", "Android"] },
  { id: 6, title: "Data Scientist", company: "Quanta Analytics", location: "Remote", salary: "PKR 600K–900K/mo", type: "Full-time", category: "Data", experience: "Senior", logo: "Q", color: "#3B82F6", posted: "4 days ago", applicants: 35, views: 980, match: 68, desc: "Turn raw data into business intelligence. Python, SQL, ML modeling, and data visualization.", skills: ["Python", "SQL", "Scikit-learn", "Tableau"] },
];

const INITIAL_APPLICANTS = [
  { id: 1, name: "Aiman Shafiq", role: "Frontend Dev", score: 94, status: "Interview", applied: "2 days ago", avatar: "AS", jobId: 1 },
  { id: 2, name: "Hassan Ali", role: "Full Stack", score: 88, status: "Screening", applied: "3 days ago", avatar: "HA", jobId: 2 },
  { id: 3, name: "Sara Khan", role: "React Dev", score: 92, status: "Offer", applied: "1 day ago", avatar: "SK", jobId: 1 },
  { id: 4, name: "Bilal Ahmed", role: "Backend", score: 74, status: "Rejected", applied: "5 days ago", avatar: "BA", jobId: 3 },
  { id: 5, name: "Nadia Malik", role: "UI/UX", score: 81, status: "Screening", applied: "4 days ago", avatar: "NM", jobId: 2 },
  { id: 6, name: "Usman Tariq", role: "DevOps", score: 77, status: "Applied", applied: "1 day ago", avatar: "UT", jobId: 4 },
];

/* ============================================================
   HOOKS
   ============================================================ */
const useDebounce = (value, delay = 400) => {
  const [d, setD] = useState(value);
  useEffect(() => { const t = setTimeout(() => setD(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return d;
};

/* ============================================================
   UI PRIMITIVES
   ============================================================ */
const Badge = ({ children, color, bg }) => {
  const C = useTheme();
  return (
    <span style={{ background: bg || C.mintLight, color: color || C.mintDark, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: `1px solid ${(color || C.mint)}30`, whiteSpace: "nowrap", display: "inline-block" }}>
      {children}
    </span>
  );
};

const Avatar = ({ initials, color, size = 40 }) => {
  const C = useTheme();
  const c = color || C.mint;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `${c}20`, color: c, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: size * 0.33, flexShrink: 0, border: `2px solid ${c}40` }}>
      {initials}
    </div>
  );
};

const MatchRing = ({ score }) => {
  const C = useTheme();
  const color = score >= 85 ? C.emerald : score >= 70 ? C.mint : C.warning;
  const r = 22, circ = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <svg width={56} height={56} viewBox="0 0 56 56">
        <circle cx={28} cy={28} r={r} fill="none" stroke={`${color}25`} strokeWidth={5} />
        <circle cx={28} cy={28} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)}
          strokeLinecap="round" transform="rotate(-90 28 28)" style={{ transition: "stroke-dashoffset 1s ease" }} />
        <text x={28} y={32} textAnchor="middle" fontSize={11} fontWeight={800} fill={color}>{score}%</text>
      </svg>
      <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>AI Match</span>
    </div>
  );
};

const StatCard = ({ icon, label, value, delta, color }) => {
  const C = useTheme();
  const c = color || C.mint;
  const [h, setH] = useState(false);
  return (
    <div style={{ background: C.card, border: `1.5px solid ${h ? c : C.border}`, borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: h ? `0 8px 28px ${c}18` : "0 2px 10px rgba(0,0,0,0.04)", transition: "all 0.25s", cursor: "default" }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <div style={{ width: 46, height: 46, borderRadius: 13, background: `${c}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, lineHeight: 1 }}>{value}</div>
        {delta && <div style={{ fontSize: 11, color: C.emerald, marginTop: 3, fontWeight: 600 }}>{delta}</div>}
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder, type = "text", multiline }) => {
  const C = useTheme();
  const [f, setF] = useState(false);
  const base = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${f ? C.mint : C.border}`, fontSize: 14, outline: "none", color: C.text, background: C.card, transition: "border 0.2s", resize: "vertical", fontFamily: "inherit", WebkitAppearance: "none" };
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>}
      {multiline
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} style={base} onFocus={() => setF(true)} onBlur={() => setF(false)} />
        : <input value={value} onChange={onChange} placeholder={placeholder} type={type} style={base} onFocus={() => setF(true)} onBlur={() => setF(false)} />}
    </div>
  );
};

const Btn = ({ children, onClick, variant = "primary", size = "md", disabled, style: extra }) => {
  const C = useTheme();
  const [h, setH] = useState(false);
  const sizes = { sm: "7px 12px", md: "10px 20px", lg: "14px 28px" };
  const fSizes = { sm: 12, md: 13, lg: 15 };
  const variants = {
    primary: { background: disabled ? C.border : h ? C.mintDark : `linear-gradient(135deg,${C.mint},${C.emerald})`, color: disabled ? C.textMuted : "#fff", border: "none", boxShadow: disabled ? "none" : h ? `0 8px 24px ${C.mint}40` : `0 4px 16px ${C.mint}30` },
    secondary: { background: h ? C.mintLight : C.card, color: C.mintDark, border: `1.5px solid ${C.mint}`, boxShadow: "none" },
    danger: { background: h ? "#FEE2E2" : C.card, color: C.danger, border: `1.5px solid ${C.danger}50`, boxShadow: "none" },
    ghost: { background: h ? C.surface : "transparent", color: C.textMuted, border: `1px solid ${h ? C.border : "transparent"}`, boxShadow: "none" },
    success: { background: h ? "#D1FAE5" : C.card, color: C.emerald, border: `1.5px solid ${C.emerald}50`, boxShadow: "none" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: sizes[size], borderRadius: 10, fontWeight: 700, fontSize: fSizes[size], cursor: disabled ? "default" : "pointer", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 6, WebkitTapHighlightColor: "transparent", touchAction: "manipulation", ...variants[variant], ...extra }}>
      {children}
    </button>
  );
};

const Modal = ({ open, onClose, title, children }) => {
  const C = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? 0 : 20 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div style={{ position: "relative", background: C.card, borderRadius: isMobile ? "20px 20px 0 0" : 20, padding: isMobile ? "24px 20px 32px" : "28px 32px", width: "100%", maxWidth: isMobile ? "100%" : 520, border: `1.5px solid ${C.border}`, boxShadow: `0 24px 80px rgba(0,0,0,0.25)`, zIndex: 1, maxHeight: isMobile ? "90vh" : "90vh", overflowY: "auto" }}>
        {isMobile && <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 20px" }} />}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontWeight: 800, fontSize: 17, color: C.text, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: C.textMuted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Toast = ({ toasts }) => {
  const C = useTheme();
  const isMobile = useIsMobile();
  return (
    <div style={{ position: "fixed", bottom: isMobile ? 80 : 24, right: isMobile ? 12 : 24, left: isMobile ? 12 : "auto", zIndex: 99999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{ background: t.type === "success" ? C.emerald : t.type === "danger" ? C.danger : C.info, color: "#fff", padding: "12px 18px", borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", animation: "slideIn 0.3s ease", display: "flex", alignItems: "center", gap: 8 }}>
          <span>{t.type === "success" ? "✓" : t.type === "danger" ? "✗" : "ℹ"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
};

/* ============================================================
   APPLICATION MODAL — Full working apply flow
   ============================================================ */
const ApplyModal = ({ open, onClose, job, onSubmit, user }) => {
  const C = useTheme();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    experience: "",
    coverLetter: "",
    portfolio: "",
    noticePeriod: "Immediately",
    salary: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    onSubmit(job.id);
    onClose();
    setStep(1);
  };

  if (!open || !job) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Apply — ${job.title}`}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? `linear-gradient(90deg,${C.mint},${C.emerald})` : C.border, transition: "background 0.3s" }} />
        ))}
      </div>
      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 16, fontWeight: 600 }}>
        Step {step} of 3 · {step === 1 ? "Personal Info" : step === 2 ? "Experience" : "Review & Submit"}
      </div>

      {step === 1 && (
        <div>
          <Input label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
          <Input label="Email Address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" type="email" />
          <Input label="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+92 300 1234567" type="tel" />
          <Input label="Portfolio / LinkedIn URL" value={form.portfolio} onChange={e => setForm({ ...form, portfolio: e.target.value })} placeholder="https://yourportfolio.com" />
          <Btn onClick={() => { if (!form.name || !form.email) return; setStep(2); }} style={{ width: "100%" }}>
            Next: Experience →
          </Btn>
        </div>
      )}

      {step === 2 && (
        <div>
          <Input label="Years of Experience *" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 3 years" />
          <Input label="Expected Salary (PKR/month)" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="e.g. 500,000" />
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 6, textTransform: "uppercase" }}>Notice Period</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Immediately", "2 Weeks", "1 Month", "3 Months"].map(n => (
                <button key={n} onClick={() => setForm({ ...form, noticePeriod: n })}
                  style={{ padding: "8px 14px", borderRadius: 9, border: `1.5px solid ${form.noticePeriod === n ? C.mint : C.border}`, background: form.noticePeriod === n ? C.mintLight : C.card, color: form.noticePeriod === n ? C.mintDark : C.textMuted, fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}>{n}</button>
              ))}
            </div>
          </div>
          <Input label="Cover Letter" value={form.coverLetter} onChange={e => setForm({ ...form, coverLetter: e.target.value })} placeholder="Tell us why you're a great fit for this role..." multiline />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" onClick={() => setStep(1)}>← Back</Btn>
            <Btn onClick={() => { if (!form.experience) return; setStep(3); }} style={{ flex: 1 }}>Review Application →</Btn>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ background: C.surface, borderRadius: 14, padding: 16, marginBottom: 18, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>📋 Application Summary</div>
            {[
              ["Applying for", job.title],
              ["Company", job.company],
              ["Name", form.name],
              ["Email", form.email],
              ["Phone", form.phone || "—"],
              ["Experience", form.experience],
              ["Expected Salary", form.salary ? `PKR ${form.salary}/mo` : "—"],
              ["Notice Period", form.noticePeriod],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}`, gap: 10 }}>
                <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 12, color: C.text, fontWeight: 700, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: `${C.mint}10`, border: `1.5px solid ${C.mint}30`, borderRadius: 12, padding: "12px 14px", marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.mintDark, marginBottom: 4 }}>🤖 Jobie AI Match Score</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, height: 6, background: C.border, borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${job.match}%`, background: `linear-gradient(90deg,${C.mint},${C.emerald})`, borderRadius: 3, transition: "width 1s ease" }} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 900, color: C.emerald }}>{job.match}%</span>
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>Your profile is a strong match for this role!</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" onClick={() => setStep(2)}>← Back</Btn>
            <button onClick={handleSubmit} disabled={submitting}
              style={{ flex: 1, padding: "13px 0", background: submitting ? C.border : `linear-gradient(135deg,${C.mint},${C.emerald})`, color: submitting ? C.textMuted : "#fff", border: "none", borderRadius: 11, fontSize: 14, fontWeight: 800, cursor: submitting ? "default" : "pointer", transition: "all 0.3s", boxShadow: submitting ? "none" : `0 6px 24px ${C.mint}40`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {submitting ? (
                <>
                  <div style={{ width: 16, height: 16, border: "2px solid #fff4", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Submitting...
                </>
              ) : "🚀 Submit Application"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

/* ============================================================
   JOB CARD
   ============================================================ */
const JobCard = ({ job, onApply, onSave, onView, savedJobs, appliedJobs }) => {
  const C = useTheme();
  const [h, setH] = useState(false);
  const saved = savedJobs?.includes(job.id);
  const applied = appliedJobs?.includes(job.id);

  return (
    <div onClick={() => onView(job)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: C.card, border: `1.5px solid ${h ? C.mint : C.border}`, borderRadius: 18, padding: "18px 18px", cursor: "pointer", transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)", transform: h ? "translateY(-3px)" : "none", boxShadow: h ? `0 12px 36px ${C.mint}18` : "0 2px 8px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: h ? `linear-gradient(90deg,${job.color},${C.mint})` : "transparent", transition: "background 0.3s" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flex: 1, minWidth: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${job.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: job.color, border: `1.5px solid ${job.color}30`, flexShrink: 0 }}>{job.logo}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.title}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{job.company} · {job.location}</div>
          </div>
        </div>
        <MatchRing score={job.match} />
      </div>
      <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6, margin: "0 0 12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{job.desc}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {job.skills.slice(0, 3).map(s => <Badge key={s}>{s}</Badge>)}
        {job.skills.length > 3 && <Badge color={C.textMuted} bg={C.surface}>+{job.skills.length - 3}</Badge>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.emerald }}>{job.salary}</span>
          <Badge color={C.info} bg={`${C.info}15`}>{job.type}</Badge>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={e => { e.stopPropagation(); onSave(job.id); }}
            style={{ background: saved ? `${C.mint}15` : "transparent", border: `1px solid ${saved ? C.mint : C.border}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14, color: saved ? C.mint : C.textMuted, transition: "all 0.2s", WebkitTapHighlightColor: "transparent" }}>
            {saved ? "♥" : "♡"}
          </button>
          <button onClick={e => { e.stopPropagation(); onApply(job); }} disabled={applied}
            style={{ background: applied ? `${C.mint}15` : C.mint, color: applied ? C.mintDark : "#fff", border: `1.5px solid ${C.mint}`, borderRadius: 9, padding: "7px 16px", cursor: applied ? "default" : "pointer", fontWeight: 700, fontSize: 12, transition: "all 0.2s", WebkitTapHighlightColor: "transparent", whiteSpace: "nowrap" }}>
            {applied ? "✓ Applied" : "Apply Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   LANDING PAGE
   ============================================================ */
const LandingPage = ({ onNavigate }) => {
  const C = useTheme();
  const isMobile = useIsMobile();
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const companies = ["Google", "Meta", "Amazon", "Microsoft", "Tesla", "OpenAI", "Stripe", "Figma", "Vercel", "GitHub"];

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ minHeight: isMobile ? "auto" : "88vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: isMobile ? "48px 20px 40px" : "60px 24px 40px", background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${C.mintLight} 0%, ${C.bg} 60%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: `${C.mint}06`, pointerEvents: "none" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.mint}15`, border: `1px solid ${C.mint}40`, borderRadius: 30, padding: "6px 16px", marginBottom: 24, fontSize: 12, fontWeight: 700, color: C.mintDark }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.mint, display: "inline-block", flexShrink: 0 }} />
          AI-Powered Job Platform
        </div>

        <h1 style={{ fontSize: isMobile ? 36 : "clamp(38px, 7vw, 82px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 20, maxWidth: 860, background: `linear-gradient(135deg,${C.text} 0%,${C.mintDark} 55%,${C.emerald} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Your Career,<br />Powered by AI
        </h1>

        <p style={{ fontSize: isMobile ? 15 : "clamp(15px, 2.2vw, 18px)", color: C.textMuted, maxWidth: 520, lineHeight: 1.75, marginBottom: 32, padding: "0 8px" }}>
          Jobie matches you to 50,000+ jobs using intelligent AI. Score your resume, discover best-fit roles, and apply in one click.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: isMobile ? 40 : 60 }}>
          <Btn size={isMobile ? "md" : "lg"} onClick={() => onNavigate("register")}>🚀 Get Started Free</Btn>
          <Btn size={isMobile ? "md" : "lg"} variant="secondary" onClick={() => onNavigate("jobs")}>Browse Jobs →</Btn>
        </div>

        {/* Floating cards — hide on very small screens */}
        {!isMobile && (
          <div style={{ position: "relative", width: "100%", maxWidth: 860, height: 170 }}>
            <div style={{ position: "absolute", left: "4%", top: 0, background: C.card, borderRadius: 16, padding: "14px 18px", border: `1.5px solid ${C.border}`, boxShadow: `0 8px 32px ${C.mint}12`, display: "flex", alignItems: "center", gap: 12, minWidth: 240, animation: "floatA 4s ease-in-out infinite" }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: `${C.mint}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: C.mint }}>N</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>Senior AI Engineer</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>NeuralSync · Remote</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.emerald, marginTop: 3 }}>PKR 1.2M/mo · 94% match</div>
              </div>
            </div>
            <div style={{ position: "absolute", right: "4%", top: 18, background: C.card, borderRadius: 16, padding: "14px 18px", border: `1.5px solid ${C.border}`, boxShadow: `0 8px 32px ${C.mint}12`, minWidth: 200, animation: "floatB 4s ease-in-out 1.5s infinite" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 12 }}>🤖</span>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.mintDark }}>Jobie AI Resume Score</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.text }}>94<span style={{ fontSize: 14, color: C.textMuted }}>/100</span></div>
              <div style={{ marginTop: 6, height: 5, background: C.border, borderRadius: 3 }}>
                <div style={{ height: "100%", width: "94%", background: `linear-gradient(90deg,${C.mint},${C.emerald})`, borderRadius: 3 }} />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Marquee */}
      <div style={{ background: `${C.mint}08`, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "12px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", animation: "marquee 22s linear infinite", width: "max-content" }}>
          {[...companies, ...companies].map((c, i) => (
            <span key={i} style={{ marginRight: 44, fontSize: 12, fontWeight: 700, color: C.textMuted, whiteSpace: "nowrap", opacity: 0.65 }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section ref={ref} style={{ padding: isMobile ? "48px 20px" : "80px 24px", textAlign: "center", background: C.bg }}>
        <h2 style={{ fontSize: isMobile ? 24 : "clamp(26px, 4vw, 40px)", fontWeight: 800, color: C.text, marginBottom: 10 }}>Trusted by the Best</h2>
        <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 40 }}>Numbers that speak for themselves</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, maxWidth: 680, margin: "0 auto" }}>
          {[{ n: "50K+", l: "Active Jobs" }, { n: "200K+", l: "Candidates" }, { n: "8,500+", l: "Companies" }, { n: "94%", l: "Hire Rate" }].map((s, i) => (
            <div key={i} style={{ padding: isMobile ? "22px 16px" : "28px 20px", background: C.card, borderRadius: 18, border: `1.5px solid ${C.border}`, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: `all 0.6s ease ${i * 0.1}s` }}>
              <div style={{ fontSize: isMobile ? 30 : 38, fontWeight: 900, color: C.mint, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 13, color: C.textMuted, marginTop: 8, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: isMobile ? "32px 20px 56px" : "40px 24px 80px", background: C.surface }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: isMobile ? 22 : "clamp(24px, 3.5vw, 38px)", fontWeight: 800, color: C.text, marginBottom: 10 }}>Built for the Future of Work</h2>
          <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 36 }}>Jobie AI at every step of your journey</p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, textAlign: "left" }}>
            {[
              { icon: "🤖", title: "Jobie AI Matching", desc: "Compatibility score for every job. AI reads your skills, experience, and career trajectory." },
              { icon: "📄", title: "Smart Resume Builder", desc: "Build or upload your resume. Get instant feedback and ATS-optimization with Jobie AI." },
              { icon: "🎯", title: "1-Click Apply", desc: "Apply to multiple jobs instantly. Your AI-curated profile does the heavy lifting." },
              { icon: "📊", title: "Application Tracker", desc: "See where every application stands with real-time status updates from recruiters." },
              { icon: "🏢", title: "Recruiter Tools", desc: "Post jobs, screen candidates with AI, and manage your entire hiring pipeline in one place." },
              { icon: "🔔", title: "Smart Alerts", desc: "Get notified the moment a matching job goes live. Never miss an opportunity." },
            ].map((f, i) => {
              const [hov, setHov] = useState(false);
              return (
                <div key={i} style={{ background: C.card, borderRadius: 16, padding: "22px 20px", border: `1.5px solid ${hov ? C.mint : C.border}`, transition: "all 0.25s", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? `0 10px 32px ${C.mint}12` : "none", cursor: "default" }}
                  onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? "56px 20px" : "80px 24px", background: `linear-gradient(135deg,${C.mintDark} 0%,${C.emerald} 100%)`, textAlign: "center" }}>
        <h2 style={{ fontSize: isMobile ? 24 : "clamp(26px, 4vw, 44px)", fontWeight: 800, color: "#fff", marginBottom: 12 }}>Ready to Land Your Dream Job?</h2>
        <p style={{ color: "#fff", opacity: 0.85, fontSize: 16, marginBottom: 28 }}>Join 200,000+ professionals on Jobie</p>
        <button onClick={() => onNavigate("register")} style={{ background: "#fff", color: C.mintDark, border: "none", borderRadius: 14, padding: isMobile ? "13px 32px" : "15px 42px", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", transition: "transform 0.2s", WebkitTapHighlightColor: "transparent" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
          🚀 Start for Free Today
        </button>
      </section>
    </div>
  );
};

/* ============================================================
   AUTH PAGE
   ============================================================ */
const AuthPage = ({ mode, onNavigate, onLogin }) => {
  const C = useTheme();
  const isMobile = useIsMobile();
  const [tab, setTab] = useState(mode === "login" ? "login" : "register");
  const [role, setRole] = useState("candidate");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    if (tab === "register" && !form.name) { setError("Full name is required."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    onLogin({ name: form.name || "Aiman Shafiq", email: form.email, role, avatar: (form.name || "AS").slice(0, 2).toUpperCase() });
  };

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse 70% 70% at 50% 0%,${C.mintLight} 0%,${C.bg} 60%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "24px 16px" : 24 }}>
      <div style={{ background: C.card, borderRadius: 22, padding: isMobile ? "28px 20px" : "36px 32px", width: "100%", maxWidth: 420, border: `1.5px solid ${C.border}`, boxShadow: `0 24px 80px ${C.mint}15` }}>
        <div onClick={() => onNavigate("home")} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, cursor: "pointer" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${C.mint},${C.emerald})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>⚡</div>
          <span style={{ fontSize: 19, fontWeight: 800, color: C.text }}>Jobie</span>
        </div>

        <div style={{ display: "flex", background: C.surface, borderRadius: 11, padding: 3, marginBottom: 24 }}>
          {["login", "register"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 0", borderRadius: 9, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, background: tab === t ? C.card : "transparent", color: tab === t ? C.mintDark : C.textMuted, boxShadow: tab === t ? `0 2px 8px ${C.mint}20` : "none", transition: "all 0.2s", WebkitTapHighlightColor: "transparent" }}>
              {t === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {tab === "register" && (
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>I am a</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ id: "candidate", label: "👤 Candidate" }, { id: "recruiter", label: "🏢 Recruiter" }, { id: "admin", label: "🔑 Admin" }].map(r => (
                <button key={r.id} onClick={() => setRole(r.id)} style={{ flex: 1, padding: "10px 6px", borderRadius: 9, border: `1.5px solid ${role === r.id ? C.mint : C.border}`, background: role === r.id ? C.mintLight : C.card, color: role === r.id ? C.mintDark : C.textMuted, fontWeight: 600, fontSize: 11, cursor: "pointer", transition: "all 0.2s", WebkitTapHighlightColor: "transparent" }}>{r.label}</button>
              ))}
            </div>
          </div>
        )}

        {tab === "register" && <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Aiman Shafiq" />}
        <Input label="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="aiman@example.com" type="email" />
        <Input label="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" type="password" />

        {error && <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 9, padding: "9px 13px", fontSize: 12, color: "#DC2626", marginBottom: 14 }}>{error}</div>}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", padding: "14px 0", background: loading ? C.border : `linear-gradient(135deg,${C.mint},${C.emerald})`, color: loading ? C.textMuted : "#fff", border: "none", borderRadius: 11, fontSize: 14, fontWeight: 800, cursor: loading ? "default" : "pointer", transition: "all 0.2s", boxShadow: loading ? "none" : `0 6px 24px ${C.mint}40`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, WebkitTapHighlightColor: "transparent", marginBottom: 14 }}>
          {loading ? (
            <>
              <div style={{ width: 16, height: 16, border: "2px solid #fff4", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Authenticating...
            </>
          ) : tab === "login" ? "Sign In →" : "Create Account →"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: C.textMuted, marginBottom: 16 }}>
          {tab === "login" ? "No account? " : "Already a member? "}
          <span onClick={() => setTab(tab === "login" ? "register" : "login")} style={{ color: C.mintDark, fontWeight: 700, cursor: "pointer" }}>
            {tab === "login" ? "Sign up free" : "Sign in"}
          </span>
        </p>

        <div style={{ padding: "11px 14px", background: C.surface, borderRadius: 11, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.mintDark, marginBottom: 4 }}>🚀 Quick Demo</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>Enter any email + password to explore as <strong>{role}</strong>. Try all 3 roles!</div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   JOB DETAIL PAGE
   ============================================================ */
const JobDetailPage = ({ job, onBack, user, onApply, appliedJobs }) => {
  const C = useTheme();
  const isMobile = useIsMobile();
  const applied = appliedJobs?.includes(job.id);
  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: isMobile ? "16px 14px" : "28px 20px" }}>
        <Btn variant="secondary" onClick={onBack} size="sm">← Back</Btn>
        <div style={{ marginTop: 18, background: C.card, borderRadius: isMobile ? 16 : 22, border: `1.5px solid ${C.border}`, overflow: "hidden", boxShadow: `0 8px 40px ${C.mint}10` }}>
          <div style={{ background: `linear-gradient(135deg,${C.mintLight} 0%,${C.surface} 100%)`, padding: isMobile ? "24px 18px 20px" : "36px 36px 28px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: isMobile ? 52 : 68, height: isMobile ? 52 : 68, borderRadius: 15, background: `${job.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 22 : 28, fontWeight: 800, color: job.color, border: `2px solid ${job.color}30`, flexShrink: 0 }}>{job.logo}</div>
                <div>
                  <h1 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 800, color: C.text, marginBottom: 4 }}>{job.title}</h1>
                  <div style={{ fontSize: 13, color: C.textMuted }}>{job.company} · {job.location}</div>
                  <div style={{ display: "flex", gap: 7, marginTop: 10, flexWrap: "wrap" }}>
                    <Badge color={C.info} bg={`${C.info}12`}>{job.type}</Badge>
                    <Badge color={C.emerald} bg={`${C.emerald}12`}>{job.experience}</Badge>
                    <Badge color={job.color} bg={`${job.color}12`}>{job.category}</Badge>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: isMobile ? "center" : "flex-end", gap: 10 }}>
                <MatchRing score={job.match} />
                <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 800, color: C.emerald }}>{job.salary}</div>
              </div>
            </div>
          </div>
          <div style={{ padding: isMobile ? "18px 16px" : 36 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
              {[{ icon: "👁️", label: "Views", val: job.views.toLocaleString() }, { icon: "👥", label: "Applicants", val: job.applicants }, { icon: "📅", label: "Posted", val: job.posted }].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", background: C.surface, borderRadius: 11, border: `1px solid ${C.border}` }}>
                  <span>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{s.val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 10 }}>About the Role</h2>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.8 }}>{job.desc}</p>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.8, marginTop: 10 }}>You'll collaborate with a world-class team to push the boundaries of what's possible. This role offers competitive compensation, remote flexibility, and the chance to work on problems that matter.</p>
            </div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 10 }}>Required Skills</h2>
              <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                {job.skills.map(s => <div key={s} style={{ padding: "9px 14px", background: C.mintLight, border: `1.5px solid ${C.mint}40`, borderRadius: 11, fontSize: 13, fontWeight: 600, color: C.mintDark }}>{s}</div>)}
              </div>
            </div>
            <div style={{ background: `${C.mint}08`, border: `1.5px solid ${C.mint}30`, borderRadius: 14, padding: "16px 18px", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span>🤖</span>
                <span style={{ fontWeight: 700, color: C.mintDark, fontSize: 13 }}>Jobie AI Analysis</span>
              </div>
              <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>
                Your profile shows a <strong style={{ color: C.emerald }}>{job.match}% compatibility</strong> with this role. Your skills in React and TypeScript are strong matches. Consider strengthening your {job.skills[2]} experience to improve your chances further.
              </p>
            </div>
            <button onClick={() => onApply(job)} disabled={applied}
              style={{ width: "100%", padding: "15px 0", background: applied ? C.surface : `linear-gradient(135deg,${C.mint},${C.emerald})`, color: applied ? C.mint : "#fff", border: `2px solid ${applied ? C.mint : "transparent"}`, borderRadius: 13, fontSize: 15, fontWeight: 800, cursor: applied ? "default" : "pointer", transition: "all 0.2s", boxShadow: applied ? "none" : `0 8px 28px ${C.mint}40`, WebkitTapHighlightColor: "transparent" }}>
              {applied ? "✓ Application Submitted" : "🚀 Apply Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   JOBS PAGE
   ============================================================ */
const JobsPage = ({ user, jobs, onApply, onSave, savedJobs, appliedJobs }) => {
  const C = useTheme();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "All", type: "All", experience: "All" });
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const dq = useDebounce(search);
  useEffect(() => { setTimeout(() => setLoading(false), 600); }, []);

  const filtered = useMemo(() => jobs.filter(j => {
    const q = dq.toLowerCase();
    const ms = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.skills.some(s => s.toLowerCase().includes(q));
    const mc = filters.category === "All" || j.category === filters.category;
    const mt = filters.type === "All" || j.type === filters.type;
    const me = filters.experience === "All" || j.experience === filters.experience;
    return ms && mc && mt && me;
  }), [jobs, dq, filters]);

  const cats = ["All", ...new Set(jobs.map(j => j.category))];

  if (selectedJob) return <JobDetailPage job={selectedJob} onBack={() => setSelectedJob(null)} user={user} onApply={onApply} appliedJobs={appliedJobs} />;

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div style={{ background: `linear-gradient(135deg,${C.mintLight} 0%,${C.bg} 100%)`, padding: isMobile ? "32px 16px 24px" : "50px 20px 36px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: isMobile ? 26 : "clamp(26px,4vw,44px)", fontWeight: 800, color: C.text, marginBottom: 6 }}>Find Your Next Opportunity</h1>
          <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 22 }}>Jobie AI matches you to the perfect role</p>
          <div style={{ display: "flex", gap: 8, background: C.card, border: `2px solid ${C.mint}`, borderRadius: 14, padding: "5px 5px 5px 16px", boxShadow: `0 8px 28px ${C.mint}18`, maxWidth: 680, margin: "0 auto" }}>
            <span style={{ fontSize: 16 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Job title, skills, company..." style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: C.text, background: "transparent", minWidth: 0 }} />
            {isMobile && (
              <button onClick={() => setShowFilters(!showFilters)} style={{ background: showFilters ? C.mintLight : C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 10px", cursor: "pointer", fontSize: 13, color: C.mintDark, fontWeight: 700, flexShrink: 0 }}>⚙️</button>
            )}
            <button style={{ background: `linear-gradient(135deg,${C.mint},${C.emerald})`, color: "#fff", border: "none", borderRadius: 11, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0, WebkitTapHighlightColor: "transparent" }}>Search</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: isMobile ? "16px 14px" : "28px 20px" }}>
        {/* Filters — desktop always shown, mobile collapsible */}
        {(!isMobile || showFilters) && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
              {cats.map(c => (
                <button key={c} onClick={() => setFilters({ ...filters, category: c })} style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${filters.category === c ? C.mint : C.border}`, background: filters.category === c ? C.mintLight : C.card, color: filters.category === c ? C.mintDark : C.textMuted, fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.2s", WebkitTapHighlightColor: "transparent" }}>{c}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["type", "experience"].map(key => (
                <select key={key} value={filters[key]} onChange={e => setFilters({ ...filters, [key]: e.target.value })} style={{ padding: "8px 14px", borderRadius: 20, border: `1.5px solid ${C.border}`, background: C.card, fontSize: 12, color: C.textMuted, cursor: "pointer", outline: "none" }}>
                  <option>All</option>
                  {key === "type" ? ["Full-time", "Contract", "Part-time"].map(v => <option key={v}>{v}</option>) : ["Junior", "Mid", "Senior"].map(v => <option key={v}>{v}</option>)}
                </select>
              ))}
            </div>
          </div>
        )}

        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16, fontWeight: 600 }}>{filtered.length} jobs found{dq && ` for "${dq}"`}</div>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
            {[1,2,3,4].map(i => <div key={i} style={{ background: C.card, borderRadius: 18, height: 200, border: `1.5px solid ${C.border}`, opacity: 0.4 }} />)}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
            {filtered.map(job => <JobCard key={job.id} job={job} onApply={onApply} onSave={onSave} onView={setSelectedJob} savedJobs={savedJobs} appliedJobs={appliedJobs} />)}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
                <h3 style={{ fontWeight: 700, color: C.text, fontSize: 18 }}>No jobs found</h3>
                <p style={{ color: C.textMuted, marginTop: 8 }}>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   CANDIDATE DASHBOARD
   ============================================================ */
const CandidateDashboard = ({ user, jobs, appliedJobs, savedJobs }) => {
  const C = useTheme();
  const isMobile = useIsMobile();
  const myApps = jobs.filter(j => appliedJobs.includes(j.id));
  const mySaved = jobs.filter(j => savedJobs.includes(j.id));
  const statusColor = { Interview: C.info, Screening: C.warning, Applied: C.textMuted, Offer: C.emerald, Rejected: C.danger };
  const appStatuses = ["Interview", "Screening", "Applied", "Offer"];

  const appDetails = myApps.map((j, i) => ({
    job: j.title, company: j.company, status: appStatuses[i % appStatuses.length], date: `Jun ${15 - i}`,
  }));

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: isMobile ? "18px 16px" : "24px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: C.text }}>Welcome back, {user.name} 👋</h1>
            <p style={{ color: C.textMuted, fontSize: 12, marginTop: 3 }}>Your AI-powered career hub</p>
          </div>
          <div style={{ padding: "8px 14px", background: C.surface, borderRadius: 11, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600, color: C.mintDark }}>🟢 Profile Active</div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: isMobile ? "16px 14px" : "28px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 22 }}>
          <StatCard icon="📋" label="Applications" value={myApps.length} delta={`${myApps.length} submitted`} color={C.mint} />
          <StatCard icon="👁️" label="Profile Views" value="284" delta="↑ 22%" color={C.info} />
          <StatCard icon="💼" label="Saved Jobs" value={mySaved.length} color={C.warning} />
          <StatCard icon="🎯" label="Interviews" value="2" delta="upcoming" color={C.emerald} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: 18, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Application Tracker */}
            <div style={{ background: C.card, borderRadius: 18, border: `1.5px solid ${C.border}`, overflow: "hidden" }}>
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Application Tracker</h2>
                <Badge>{appDetails.length} active</Badge>
              </div>
              <div style={{ padding: 12 }}>
                {appDetails.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "28px 0", color: C.textMuted, fontSize: 13 }}>No applications yet. <span style={{ color: C.mintDark, fontWeight: 700 }}>Browse jobs →</span></div>
                ) : appDetails.map((app, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 12px", borderRadius: 11, marginBottom: 7, background: C.surface, border: `1px solid ${C.border}`, transition: "all 0.2s", gap: 10 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.mint; e.currentTarget.style.background = C.mintLight; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.job}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{app.company} · {app.date}</div>
                    </div>
                    <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${statusColor[app.status]}15`, color: statusColor[app.status], border: `1px solid ${statusColor[app.status]}30`, flexShrink: 0 }}>{app.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            <div style={{ background: C.card, borderRadius: 18, border: `1.5px solid ${C.border}`, overflow: "hidden" }}>
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                <span>🤖</span>
                <h2 style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Jobie AI Suggestions</h2>
                <Badge>AI</Badge>
              </div>
              <div style={{ padding: 16 }}>
                {[
                  { icon: "🎯", tip: "Add 'Kubernetes' to your profile — required in 68% of jobs matching your level.", action: "Update Skills" },
                  { icon: "📄", tip: "Your resume lacks quantifiable achievements. Add metrics to boost your AI score by ~12 points.", action: "Edit Resume" },
                  { icon: "🚀", tip: "3 new Senior React roles posted today match your profile at 85%+.", action: "View Jobs" },
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                    <span style={{ fontSize: 18 }}>{t.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6, marginBottom: 7 }}>{t.tip}</p>
                      <Btn size="sm" variant="secondary">{t.action} →</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Resume Score */}
            <div style={{ background: C.card, borderRadius: 18, border: `1.5px solid ${C.border}`, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Resume Score</h3>
                <span style={{ fontSize: 24, fontWeight: 900, color: C.emerald }}>78</span>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 4, marginBottom: 14 }}>
                <div style={{ height: "100%", width: "78%", background: `linear-gradient(90deg,${C.mint},${C.emerald})`, borderRadius: 4 }} />
              </div>
              {[{ label: "Formatting", val: 90 }, { label: "Keywords", val: 72 }, { label: "Experience", val: 85 }, { label: "Achievements", val: 60 }].map((item, i) => (
                <div key={i} style={{ marginBottom: 9 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: item.val >= 80 ? C.emerald : item.val >= 65 ? C.warning : C.danger }}>{item.val}%</span>
                  </div>
                  <div style={{ height: 4, background: C.border, borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${item.val}%`, background: item.val >= 80 ? C.emerald : item.val >= 65 ? C.warning : C.danger, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
              <button style={{ width: "100%", marginTop: 10, padding: "10px 0", background: C.mintLight, color: C.mintDark, border: `1.5px solid ${C.mint}40`, borderRadius: 11, fontWeight: 700, fontSize: 12, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>✨ Improve with Jobie AI</button>
            </div>

            {/* Upcoming Interviews */}
            <div style={{ background: C.card, borderRadius: 18, border: `1.5px solid ${C.border}`, padding: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 14 }}>📅 Upcoming Interviews</h3>
              {[{ company: "NeuralSync", time: "Tomorrow, 3:00 PM", type: "Video Call" }, { company: "CodeVault", time: "Jun 18, 10:00 AM", type: "Technical" }].map((iv, i) => (
                <div key={i} style={{ padding: "12px", background: C.surface, borderRadius: 11, marginBottom: 9, border: `1px solid ${C.border}` }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{iv.company}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2, marginBottom: 5 }}>{iv.time}</div>
                  <Badge color={C.info} bg={`${C.info}12`}>{iv.type}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   RECRUITER DASHBOARD — Full CRUD
   ============================================================ */
const emptyJob = { title: "", company: "", location: "", salary: "", type: "Full-time", category: "Engineering", experience: "Mid", desc: "", skills: "" };

const RecruiterDashboard = ({ user, jobs, setJobs, applicants, setApplicants, addToast }) => {
  const C = useTheme();
  const isMobile = useIsMobile();
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyJob);
  const [delConfirm, setDelConfirm] = useState(null);
  const [tab, setTab] = useState("jobs");

  const openNew = () => { setForm(emptyJob); setEditTarget(null); setShowForm(true); };
  const openEdit = (job) => { setForm({ ...job, skills: job.skills.join(", ") }); setEditTarget(job.id); setShowForm(true); };

  const saveJob = () => {
    if (!form.title || !form.company) { addToast("Title and company required.", "danger"); return; }
    const skillsArr = form.skills.split(",").map(s => s.trim()).filter(Boolean);
    if (editTarget) {
      setJobs(prev => prev.map(j => j.id === editTarget ? { ...j, ...form, skills: skillsArr } : j));
      addToast("Job updated!", "success");
    } else {
      const newJob = { ...form, id: Date.now(), logo: form.company[0].toUpperCase(), color: C.mint, posted: "Just now", applicants: 0, views: 0, match: Math.floor(Math.random() * 20) + 70, skills: skillsArr };
      setJobs(prev => [newJob, ...prev]);
      addToast("Job posted!", "success");
    }
    setShowForm(false);
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    setApplicants(prev => prev.filter(a => a.jobId !== id));
    setDelConfirm(null);
    addToast("Job deleted.", "danger");
  };

  const updateStatus = (appId, status) => {
    setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    addToast(status === "Offer" ? "Offer sent!" : status === "Rejected" ? "Applicant rejected." : "Status updated.", status === "Offer" ? "success" : status === "Rejected" ? "danger" : "info");
  };

  const statusColor = { Interview: C.info, Screening: C.warning, Applied: C.textMuted, Offer: C.emerald, Rejected: C.danger };

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: isMobile ? "16px 14px" : "22px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: C.text }}>Recruiter Dashboard</h1>
            <p style={{ color: C.textMuted, fontSize: 12, marginTop: 3 }}>{user.name} · Jobie Recruiter</p>
          </div>
          <Btn onClick={openNew} size={isMobile ? "sm" : "md"}>+ Post Job</Btn>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: isMobile ? "14px 14px" : "28px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 20 }}>
          <StatCard icon="📋" label="Active Listings" value={jobs.length} color={C.mint} />
          <StatCard icon="👥" label="Applicants" value={applicants.length} color={C.info} />
          <StatCard icon="✅" label="Offers Made" value={applicants.filter(a => a.status === "Offer").length} color={C.emerald} />
          <StatCard icon="⏱️" label="Avg. Hire Time" value="12d" delta="↓ 3 days" color={C.warning} />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
          {[["jobs", "💼 My Jobs"], ["applicants", "👥 Applicants"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: "9px 18px", borderRadius: 11, border: `1.5px solid ${tab === id ? C.mint : C.border}`, background: tab === id ? C.mintLight : C.card, color: tab === id ? C.mintDark : C.textMuted, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s", WebkitTapHighlightColor: "transparent" }}>{label}</button>
          ))}
        </div>

        {tab === "jobs" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
            {jobs.map(j => (
              <div key={j.id} style={{ background: C.card, borderRadius: 16, border: `1.5px solid ${C.border}`, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", minWidth: 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: `${j.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: j.color, flexShrink: 0 }}>{j.logo}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{j.title}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{j.company} · {j.location}</div>
                    </div>
                  </div>
                  <Badge color={j.color} bg={`${j.color}15`}>{j.applicants} apps</Badge>
                </div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10, lineHeight: 1.5 }}>{j.desc.slice(0, 80)}...</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {j.skills.slice(0, 3).map(s => <Badge key={s}>{s}</Badge>)}
                </div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 12 }}>👁️ {j.views.toLocaleString()} views · {j.posted}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn variant="secondary" size="sm" onClick={() => openEdit(j)}>✏️ Edit</Btn>
                  <Btn variant="danger" size="sm" onClick={() => setDelConfirm(j.id)}>🗑️ Delete</Btn>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 20px", color: C.textMuted }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>📋</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>No jobs posted yet</div>
                <div style={{ fontSize: 13, marginTop: 8, marginBottom: 18 }}>Post your first job to start receiving applications</div>
                <Btn onClick={openNew}>+ Post Your First Job</Btn>
              </div>
            )}
          </div>
        )}

        {tab === "applicants" && (
          <div style={{ background: C.card, borderRadius: 18, border: `1.5px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}` }}>
              <h2 style={{ fontWeight: 700, fontSize: 15, color: C.text }}>All Applicants · {applicants.length} total</h2>
            </div>
            <div style={{ padding: 12 }}>
              {applicants.map(a => {
                const sc = a.score;
                const scoreColor = sc >= 90 ? C.emerald : sc >= 80 ? C.mint : sc >= 70 ? C.warning : C.danger;
                const stColor = statusColor[a.status] || C.textMuted;
                const jobName = jobs.find(j => j.id === a.jobId)?.title || "Unknown Job";
                return (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", borderRadius: 11, marginBottom: 8, background: C.surface, border: `1px solid ${C.border}`, transition: "all 0.2s", flexWrap: isMobile ? "wrap" : "nowrap" }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.mintLight; e.currentTarget.style.borderColor = C.mint; }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = C.border; }}>
                    <Avatar initials={a.avatar} size={38} />
                    <div style={{ flex: 1, minWidth: 120 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{a.role} · {a.applied}</div>
                      <div style={{ fontSize: 10, color: C.mintDark, marginTop: 1, fontWeight: 600 }}>{jobName}</div>
                    </div>
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: scoreColor }}>{a.score}</div>
                      <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 600 }}>AI Score</div>
                    </div>
                    <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${stColor}15`, color: stColor, border: `1px solid ${stColor}30`, flexShrink: 0 }}>{a.status}</span>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      <Btn size="sm" variant="success" onClick={() => updateStatus(a.id, "Offer")}>✓ Accept</Btn>
                      <Btn size="sm" onClick={() => updateStatus(a.id, "Interview")} style={{ background: `${C.info}12`, color: C.info, border: `1px solid ${C.info}30` }}>Interview</Btn>
                      <Btn size="sm" variant="danger" onClick={() => updateStatus(a.id, "Rejected")}>✗ Reject</Btn>
                    </div>
                  </div>
                );
              })}
              {applicants.length === 0 && <div style={{ textAlign: "center", padding: "36px", color: C.textMuted, fontSize: 13 }}>No applicants yet.</div>}
            </div>
          </div>
        )}
      </div>

      {/* Post/Edit Job Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editTarget ? "✏️ Edit Job" : "📝 Post New Job"}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0 14px" }}>
          <Input label="Job Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Frontend Engineer" />
          <Input label="Company *" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. TechCorp" />
          <Input label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Remote / Lahore" />
          <Input label="Salary Range" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="e.g. PKR 500K–800K/mo" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "0 14px" }}>
          {[
            { label: "Type", key: "type", opts: ["Full-time", "Part-time", "Contract", "Freelance"] },
            { label: "Category", key: "category", opts: ["Engineering", "Design", "AI/ML", "Data", "Mobile", "Infrastructure", "Marketing"] },
            { label: "Experience", key: "experience", opts: ["Junior", "Mid", "Senior", "Lead"] },
          ].map(({ label, key, opts }) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 6, textTransform: "uppercase" }}>{label}</label>
              <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.text, background: C.card, outline: "none" }}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <Input label="Skills (comma separated)" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, TypeScript, Node.js, AWS" />
        <Input label="Job Description" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Describe the role, responsibilities, and requirements..." multiline />
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={saveJob} style={{ flex: 1 }}>{editTarget ? "💾 Save Changes" : "🚀 Publish Job"}</Btn>
          <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancel</Btn>
        </div>
      </Modal>

      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="⚠️ Delete Job">
        <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>Are you sure? This job and all associated applicants will be permanently removed.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="danger" onClick={() => deleteJob(delConfirm)} style={{ flex: 1 }}>🗑️ Yes, Delete</Btn>
          <Btn variant="ghost" onClick={() => setDelConfirm(null)}>Cancel</Btn>
        </div>
      </Modal>
    </div>
  );
};

/* ============================================================
   ADMIN PANEL
   ============================================================ */
const AdminPanel = ({ user, jobs, applicants, setApplicants, addToast }) => {
  const C = useTheme();
  const isMobile = useIsMobile();
  const [recruiters, setRecruiters] = useState([
    { id: 1, name: "TechNova Ltd", jobs: 12, status: "Verified", since: "Nov 2024" },
    { id: 2, name: "CloudPeak", jobs: 7, status: "Pending", since: "Dec 2024" },
    { id: 3, name: "DataSphere", jobs: 5, status: "Verified", since: "Oct 2024" },
    { id: 4, name: "FutureCode", jobs: 3, status: "Flagged", since: "Dec 2024" },
  ]);
  const [reports, setReports] = useState([
    { id: 1, type: "Spam Job Listing", from: "Anonymous", severity: "High", time: "2h ago" },
    { id: 2, type: "Fake Company Profile", from: "User #2841", severity: "Medium", time: "5h ago" },
    { id: 3, type: "Inappropriate Content", from: "User #1204", severity: "Low", time: "1d ago" },
  ]);

  const verifyRecruiter = (id) => { setRecruiters(prev => prev.map(r => r.id === id ? { ...r, status: "Verified" } : r)); addToast("Recruiter verified!", "success"); };
  const removeRecruiter = (id) => { setRecruiters(prev => prev.filter(r => r.id !== id)); addToast("Recruiter removed.", "danger"); };
  const dismissReport = (id) => { setReports(prev => prev.filter(r => r.id !== id)); addToast("Report dismissed.", "info"); };

  const sevColor = { High: C.danger, Medium: C.warning, Low: C.info };
  const stColor = { Verified: C.emerald, Pending: C.warning, Flagged: C.danger };

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: isMobile ? "16px 14px" : "22px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: C.text }}>Admin Control Panel</h1>
          <Badge color={C.danger} bg={`${C.danger}12`}>ADMIN</Badge>
          <span style={{ color: C.textMuted, fontSize: 12, marginLeft: "auto" }}>{user.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: isMobile ? "14px 14px" : "28px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 20 }}>
          <StatCard icon="👥" label="Total Users" value="204K+" delta="↑ 12% this month" color={C.mint} />
          <StatCard icon="💼" label="Total Jobs" value={jobs.length} color={C.info} />
          <StatCard icon="🏢" label="Companies" value={recruiters.filter(r => r.status === "Verified").length} delta="Verified" color={C.emerald} />
          <StatCard icon="✅" label="Placements" value="18,320" delta="↑ 22%" color={C.warning} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
          {/* Recruiter Verification */}
          <div style={{ background: C.card, borderRadius: 18, border: `1.5px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Recruiter Verification</h2>
              <Badge color={C.warning} bg={`${C.warning}12`}>{recruiters.filter(r => r.status === "Pending").length} Pending</Badge>
            </div>
            <div style={{ padding: 12 }}>
              {recruiters.map(r => (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: 11, marginBottom: 7, background: C.surface, border: `1px solid ${C.border}`, gap: 8, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{r.jobs} jobs · Since {r.since}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${stColor[r.status]}15`, color: stColor[r.status], border: `1px solid ${stColor[r.status]}30` }}>{r.status}</span>
                    {r.status === "Pending" && <Btn size="sm" variant="success" onClick={() => verifyRecruiter(r.id)}>Verify</Btn>}
                    {r.status === "Flagged" && <Btn size="sm" variant="danger" onClick={() => removeRecruiter(r.id)}>Remove</Btn>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reports */}
          <div style={{ background: C.card, borderRadius: 18, border: `1.5px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Platform Reports</h2>
              <Badge color={C.danger} bg={`${C.danger}12`}>{reports.length} open</Badge>
            </div>
            <div style={{ padding: 12 }}>
              {reports.map(r => (
                <div key={r.id} style={{ padding: "13px", background: C.surface, borderRadius: 11, marginBottom: 9, border: `1px solid ${C.border}`, borderLeft: `3px solid ${sevColor[r.severity]}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{r.type}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: sevColor[r.severity], background: `${sevColor[r.severity]}15`, padding: "2px 8px", borderRadius: 20, flexShrink: 0 }}>{r.severity}</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 9 }}>Reported by {r.from} · {r.time}</div>
                  <div style={{ display: "flex", gap: 7 }}>
                    <Btn size="sm" variant="danger">Remove Content</Btn>
                    <Btn size="sm" variant="ghost" onClick={() => dismissReport(r.id)}>Dismiss</Btn>
                  </div>
                </div>
              ))}
              {reports.length === 0 && <div style={{ textAlign: "center", padding: "28px", color: C.textMuted, fontSize: 13 }}>🎉 No open reports!</div>}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, background: C.card, borderRadius: 18, border: `1.5px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}` }}>
            <h2 style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Recent Applicants (Platform-wide)</h2>
          </div>
          <div style={{ padding: 12 }}>
            {applicants.slice(0, 5).map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px", borderRadius: 11, marginBottom: 7, background: C.surface, border: `1px solid ${C.border}` }}>
                <Avatar initials={a.avatar} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{a.role} · {a.applied}</div>
                </div>
                <span style={{ fontWeight: 800, fontSize: 15, color: a.score >= 85 ? C.emerald : C.warning, flexShrink: 0 }}>{a.score}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: `${C.info}15`, color: C.info, border: `1px solid ${C.info}30`, flexShrink: 0, display: isMobile ? "none" : "inline" }}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   NAVBAR — Mobile hamburger + drawer
   ============================================================ */
const Navbar = ({ user, currentPage, onNavigate, onLogout, dark, setDark }) => {
  const C = useTheme();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = user
    ? user.role === "recruiter" ? [{ label: "Dashboard", page: "recruiter" }, { label: "Browse Jobs", page: "jobs" }]
      : user.role === "admin" ? [{ label: "Admin Panel", page: "admin" }, { label: "Jobs", page: "jobs" }]
        : [{ label: "Dashboard", page: "candidate" }, { label: "Find Jobs", page: "jobs" }]
    : [{ label: "Jobs", page: "jobs" }, { label: "For Recruiters", page: "register" }];

  const handleNav = (page) => { onNavigate(page); setMenuOpen(false); };

  return (
    <>
      <nav style={{ position: "sticky", top: 0, zIndex: 1000, background: scrolled ? `${C.card}ee` : C.card, backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: `1px solid ${C.border}`, boxShadow: scrolled ? `0 4px 24px ${C.mint}10` : "none", transition: "all 0.3s" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => handleNav("home")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${C.mint},${C.emerald})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
            <span style={{ fontSize: 17, fontWeight: 800, color: C.text }}>Jo<span style={{ color: C.mint }}>bie</span></span>
          </div>

          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {navLinks.map(l => (
                <button key={l.page} onClick={() => handleNav(l.page)} style={{ background: currentPage === l.page ? C.mintLight : "transparent", color: currentPage === l.page ? C.mintDark : C.textMuted, border: "none", borderRadius: 9, padding: "7px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { if (currentPage !== l.page) { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.text; } }}
                  onMouseLeave={e => { if (currentPage !== l.page) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMuted; } }}>
                  {l.label}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setDark(!dark)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: "7px 10px", cursor: "pointer", fontSize: 14, WebkitTapHighlightColor: "transparent" }} title={dark ? "Light mode" : "Dark mode"}>
              {dark ? "☀️" : "🌙"}
            </button>

            {!isMobile && user && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 12px", background: C.surface, borderRadius: 11, border: `1px solid ${C.border}` }}>
                  <Avatar initials={user.avatar} size={24} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{user.name}</span>
                  <Badge>{user.role}</Badge>
                </div>
                <button onClick={onLogout} style={{ background: "transparent", color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: 9, padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Sign out</button>
              </div>
            )}

            {!isMobile && !user && (
              <>
                <button onClick={() => handleNav("login")} style={{ background: "transparent", color: C.text, border: "none", borderRadius: 9, padding: "7px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Sign In</button>
                <Btn onClick={() => handleNav("register")}>Get Started</Btn>
              </>
            )}

            {isMobile && (
              <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 11px", cursor: "pointer", fontSize: 16, color: C.text, WebkitTapHighlightColor: "transparent", lineHeight: 1 }}>
                {menuOpen ? "✕" : "☰"}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {isMobile && menuOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 998, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(3px)" }} onClick={() => setMenuOpen(false)} />
          <div style={{ position: "fixed", top: 60, right: 0, bottom: 0, width: 260, zIndex: 999, background: C.card, borderLeft: `1px solid ${C.border}`, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 6, overflowY: "auto" }}>
            {user && (
              <div style={{ padding: "14px", background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar initials={user.avatar} size={36} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{user.name}</div>
                  <Badge>{user.role}</Badge>
                </div>
              </div>
            )}
            {navLinks.map(l => (
              <button key={l.page} onClick={() => handleNav(l.page)} style={{ background: currentPage === l.page ? C.mintLight : "transparent", color: currentPage === l.page ? C.mintDark : C.text, border: `1.5px solid ${currentPage === l.page ? C.mint : "transparent"}`, borderRadius: 11, padding: "12px 16px", fontWeight: 600, fontSize: 14, cursor: "pointer", textAlign: "left", transition: "all 0.2s", WebkitTapHighlightColor: "transparent" }}>
                {l.label}
              </button>
            ))}
            <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
              {user ? (
                <button onClick={() => { onLogout(); setMenuOpen(false); }} style={{ width: "100%", background: `${C.danger}12`, color: C.danger, border: `1px solid ${C.danger}30`, borderRadius: 11, padding: "12px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>Sign Out</button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => handleNav("login")} style={{ background: C.surface, color: C.text, border: `1px solid ${C.border}`, borderRadius: 11, padding: "12px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Sign In</button>
                  <button onClick={() => handleNav("register")} style={{ background: `linear-gradient(135deg,${C.mint},${C.emerald})`, color: "#fff", border: "none", borderRadius: 11, padding: "12px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Get Started Free</button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
const ScrollToTop = () => {
  const C = useTheme();
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} title="Back to top"
      style={{ position: "fixed", bottom: isMobile ? 84 : 28, left: 28, zIndex: 9998, width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${C.mint},${C.emerald})`, color: "#fff", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 24px ${C.mint}50`, opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.7)", transition: "opacity 0.3s, transform 0.3s", pointerEvents: visible ? "auto" : "none" }}>↑</button>
  );
};

/* ============================================================
   ROOT APP
   ============================================================ */
export default function App() {
  const [dark, setDark] = useState(true);
  const C = makeTokens(dark);

  const [authState, dispatch] = useReducer(authReducer, { user: null, isAuth: false });
  const [page, setPage] = useState("home");

  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [savedJobs, setSavedJobs] = useState([2, 5]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Apply modal state
  const [applyModal, setApplyModal] = useState({ open: false, job: null });

  const addToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const navigate = useCallback((to) => setPage(to), []);

  const login = useCallback((userData) => {
    dispatch({ type: "LOGIN", payload: userData });
    if (userData.role === "recruiter") setPage("recruiter");
    else if (userData.role === "admin") setPage("admin");
    else setPage("candidate");
    addToast(`Welcome back, ${userData.name}! 🎉`, "success");
  }, [addToast]);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    setPage("home");
    addToast("Signed out successfully.", "info");
  }, [addToast]);

  // onApply now receives a job object (or id for direct apply)
  const handleApply = useCallback((jobOrId) => {
    if (!authState.isAuth) { setPage("login"); return; }
    const jobId = typeof jobOrId === "object" ? jobOrId.id : jobOrId;
    const job = jobs.find(j => j.id === jobId);
    if (appliedJobs.includes(jobId)) { addToast("Already applied to this job.", "info"); return; }
    // Open the apply modal
    setApplyModal({ open: true, job });
  }, [authState, appliedJobs, jobs, addToast]);

  const handleApplySubmit = useCallback((jobId) => {
    setAppliedJobs(prev => [...prev, jobId]);
    const job = jobs.find(j => j.id === jobId);
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applicants: j.applicants + 1 } : j));
    const newApp = {
      id: Date.now(), name: authState.user.name, role: "Candidate",
      score: Math.floor(Math.random() * 20) + 75, status: "Applied",
      applied: "Just now", avatar: authState.user.avatar, jobId
    };
    setApplicants(prev => [...prev, newApp]);
    addToast(`Application submitted for ${job?.title}! 🎉`, "success");
  }, [authState, jobs, addToast]);

  const handleSave = useCallback((jobId) => {
    setSavedJobs(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
  }, []);

  const renderPage = () => {
    switch (page) {
      case "home": return <LandingPage onNavigate={navigate} />;
      case "login": return <AuthPage mode="login" onNavigate={navigate} onLogin={login} />;
      case "register": return <AuthPage mode="register" onNavigate={navigate} onLogin={login} />;
      case "jobs": return <JobsPage user={authState.user} jobs={jobs} onApply={handleApply} onSave={handleSave} savedJobs={savedJobs} appliedJobs={appliedJobs} />;
      case "candidate": return authState.isAuth ? <CandidateDashboard user={authState.user} jobs={jobs} appliedJobs={appliedJobs} savedJobs={savedJobs} /> : <AuthPage mode="login" onNavigate={navigate} onLogin={login} />;
      case "recruiter": return authState.isAuth ? <RecruiterDashboard user={authState.user} jobs={jobs} setJobs={setJobs} applicants={applicants} setApplicants={setApplicants} addToast={addToast} /> : <AuthPage mode="login" onNavigate={navigate} onLogin={login} />;
      case "admin": return authState.isAuth ? <AdminPanel user={authState.user} jobs={jobs} applicants={applicants} setApplicants={setApplicants} addToast={addToast} /> : <AuthPage mode="login" onNavigate={navigate} onLogin={login} />;
      default: return (
        <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
          <div style={{ fontSize: 80, fontWeight: 900, color: C.mint }}>404</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 12 }}>Page not found</h2>
          <Btn onClick={() => navigate("home")}>← Back to Home</Btn>
        </div>
      );
    }
  };

  return (
    <ThemeContext.Provider value={C}>
      <AuthContext.Provider value={{ ...authState, login, logout }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, sans-serif; }
          body { background: ${C.bg}; transition: background 0.3s; overflow-x: hidden; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-thumb { background: ${C.mint}55; border-radius: 4px; }
          @keyframes floatA { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes floatB { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          select option { background: ${C.card}; color: ${C.text}; }
          input, textarea, select { font-size: 16px !important; }
          button { -webkit-tap-highlight-color: transparent; }
          @media (max-width: 480px) {
            input, textarea { font-size: 16px !important; }
          }
        `}</style>
        <div style={{ background: C.bg, minHeight: "100vh", transition: "background 0.3s" }}>
          <Navbar user={authState.user} currentPage={page} onNavigate={navigate} onLogout={logout} dark={dark} setDark={setDark} />
          <main>{renderPage()}</main>
        </div>

        {/* Apply Modal — global, works everywhere */}
        <ApplyModal
          open={applyModal.open}
          onClose={() => setApplyModal({ open: false, job: null })}
          job={applyModal.job}
          onSubmit={handleApplySubmit}
          user={authState.user}
        />

        <Toast toasts={toasts} />
        <ScrollToTop />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}