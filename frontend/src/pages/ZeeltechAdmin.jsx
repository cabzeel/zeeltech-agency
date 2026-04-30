import { useState, useEffect, useCallback, useRef } from "react";

const BASE = import.meta.env.VITE_BACKEND_URL;

async function api(path, token, { method = "GET", body, params } = {}) {
  let url = `${BASE}${path}`;
  if (params) {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== "" && v !== undefined));
    if ([...q].length) url += `?${q}`;
  }
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return res.json();
}

const SECTIONS = [
  { id: "dashboard",     label: "Dashboard",     icon: "▪" },
  { id: "blogs",         label: "Blogs",          icon: "▤", group: "Content" },
  { id: "categories",   label: "Categories",     icon: "◫", group: "Content" },
  { id: "comments",     label: "Comments",       icon: "◷", group: "Content" },
  { id: "projects",     label: "Projects",       icon: "◪", group: "Work" },
  { id: "services",     label: "Services",       icon: "◆", group: "Work" },
  { id: "pricing",      label: "Pricing",        icon: "◑", group: "Work" },
  { id: "team",         label: "Team",           icon: "◎", group: "Work" },
  { id: "testimonials", label: "Testimonials",   icon: "◐", group: "Work" },
  { id: "contacts",     label: "Contacts",       icon: "◌", group: "Inbox" },
  { id: "subscribers",  label: "Subscribers",    icon: "◍", group: "Inbox" },
  { id: "notifications",label: "Notifications",  icon: "◉", group: "Inbox" },
  { id: "users",        label: "Users",          icon: "⊕", group: "Admin" },
  { id: "roles",        label: "Roles",          icon: "⊗", group: "Admin" },
];

const COLS = {
  blogs:         ["title", "status", "isFeatured", "views", "readTime"],
  categories:    ["name", "type", "slug"],
  comments:      ["guestName", "guestEmail", "status", "likes"],
  contacts:      ["name", "email", "subject", "status"],
  notifications: ["title", "type", "isRead", "createdAt"],
  pricing:       ["name", "status", "isPopular", "order"],
  projects:      ["title", "clientName", "status", "isFeatured"],
  roles:         ["title", "description"],
  services:      ["title", "status", "order"],
  subscribers:   ["email", "name", "status", "createdAt"],
  team:          ["name", "position", "isVisible", "order"],
  testimonials:  ["name", "company", "status", "rating", "isFeatured"],
  users:         ["username", "email", "isActive", "lastLogin"],
};

const FIELDS = {
  blogs: [
    { k: "title",      label: "Title",       type: "text",     req: true },
    { k: "slug",       label: "Slug",        type: "text",     hint: "auto-generated if empty" },
    { k: "excerpt",    label: "Excerpt",     type: "textarea", req: true, span: true },
    { k: "content",   label: "Content",     type: "textarea", req: true, span: true, rows: 8 },
    { k: "coverImage",label: "Cover Image URL", type: "text", req: true, span: true },
    { k: "category",  label: "Category ID", type: "text",     req: true },
    { k: "tags",      label: "Tags (comma-separated)", type: "text", span: true },
    { k: "status",    label: "Status",      type: "select",   opts: ["draft","published","archived"] },
    { k: "isFeatured",label: "Featured",    type: "bool" },
  ],
  categories: [
    { k: "name",        label: "Name",        type: "text",     req: true },
    { k: "slug",        label: "Slug",        type: "text",     hint: "auto-generated if empty" },
    { k: "description", label: "Description", type: "textarea", span: true },
    { k: "type",        label: "Type",        type: "select",   opts: ["blog","project","both"], req: true },
  ],
  comments: [
    { k: "guestName",  label: "Guest Name",  type: "text",   req: true },
    { k: "guestEmail", label: "Guest Email", type: "email",  req: true },
    { k: "content",    label: "Content",     type: "textarea", req: true, span: true },
    { k: "post",       label: "Blog ID",     type: "text",   req: true },
    { k: "status",     label: "Status",      type: "select", opts: ["pending","approved","rejected"] },
  ],
  contacts: [
    { k: "name",    label: "Name",    type: "text",     req: true },
    { k: "email",   label: "Email",   type: "email",    req: true },
    { k: "phone",   label: "Phone",   type: "text" },
    { k: "subject", label: "Subject", type: "text",     req: true, span: true },
    { k: "message", label: "Message", type: "textarea", req: true, span: true },
    { k: "status",  label: "Status",  type: "select",   opts: ["unread","read","replied","archived"] },
  ],
  pricing: [
    { k: "name",      label: "Tier",    type: "select", opts: ["Basic","Pro","Advanced","Premium"], req: true },
    { k: "cta",       label: "CTA Text", type: "text",  req: true },
    { k: "order",     label: "Order",   type: "number" },
    { k: "status",    label: "Status",  type: "select", opts: ["active","inactive"] },
    { k: "isPopular", label: "Popular", type: "bool" },
    { k: "features",  label: "Features (one per line)", type: "textarea", span: true },
  ],
  projects: [
    { k: "title",      label: "Title",        type: "text",     req: true },
    { k: "slug",       label: "Slug",         type: "text",     hint: "auto-generated if empty" },
    { k: "clientName", label: "Client",       type: "text",     req: true },
    { k: "coverImage", label: "Cover Image URL", type: "text", req: true, span: true },
    { k: "description",label: "Description",  type: "textarea", req: true, span: true },
    { k: "problem",    label: "Problem",      type: "textarea", req: true, span: true },
    { k: "solution",   label: "Solution",     type: "textarea", req: true, span: true },
    { k: "url",       label: "Url",         type: "textarea", req: true, span: true },
    { k: "cta",        label: "CTA Text",     type: "text",     req: true },
    { k: "category",   label: "Category ID",  type: "text",     req: true },
    { k: "status",     label: "Status",       type: "select",   opts: ["ongoing","completed","on-hold"] },
    { k: "isFeatured", label: "Featured",     type: "bool" },
    { k: "order",      label: "Order",        type: "number" },
  ],
  roles: [
    { k: "title",       label: "Title",       type: "select", opts: ["superadmin","editor","contributor"], req: true },
    { k: "description", label: "Description", type: "textarea", req: true, span: true },
  ],
  services: [
    { k: "title",          label: "Title",             type: "text",     req: true },
    { k: "slug",           label: "Slug",              type: "text",     hint: "auto-generated if empty" },
    { k: "subDescription", label: "Short Description", type: "textarea", req: true, span: true },
    { k: "fullDescription",label: "Full Description",  type: "textarea", req: true, span: true, rows: 6 },
    { k: "imgUrl",         label: "Image URL",         type: "text",     req: true, span: true },
    { k: "cta",            label: "CTA Text",          type: "text",     req: true },
    { k: "order",          label: "Order",             type: "number",   req: true },
    { k: "status",         label: "Status",            type: "select",   opts: ["active","inactive"] },
    { k: "tools",          label: "Tools (comma-separated)", type: "text", span: true },
  ],
  subscribers: [
    { k: "email",  label: "Email",  type: "email", req: true },
    { k: "name",   label: "Name",   type: "text" },
    { k: "status", label: "Status", type: "select", opts: ["active","unsubscribed"] },
  ],
  team: [
    { k: "name",     label: "Name",      type: "text",     req: true },
    { k: "slug",     label: "Slug",      type: "text",     hint: "auto-generated if empty" },
    { k: "position", label: "Position",  type: "text",     req: true },
    { k: "imgUrl",   label: "Image URL", type: "text",     req: true, span: true },
    { k: "bio",      label: "Bio",       type: "textarea", span: true },
    { k: "order",    label: "Order",     type: "number" },
    { k: "isVisible",label: "Visible",   type: "bool" },
  ],
  testimonials: [
    { k: "name",            label: "Name",        type: "text",     req: true },
    { k: "position",        label: "Position",    type: "text",     req: true },
    { k: "company",         label: "Company",     type: "text",     req: true },
    { k: "testimonialText", label: "Testimonial", type: "textarea", req: true, span: true },
    { k: "rating",          label: "Rating (1-5)", type: "number" },
    { k: "imgUrl",          label: "Image URL",   type: "text",     span: true },
    { k: "websiteUrl",      label: "Website URL", type: "text",     span: true },
    { k: "status",          label: "Status",      type: "select",   opts: ["pending","approved","rejected"] },
    { k: "isFeatured",      label: "Featured",    type: "bool" },
  ],
  users: [
    { k: "username", label: "Username", type: "text",     req: true },
    { k: "email",    label: "Email",    type: "email",    req: true },
    { k: "password", label: "Password", type: "password", req: true, createOnly: true },
    { k: "role",     label: "Role ID",  type: "text" },
    { k: "isActive", label: "Active",   type: "bool" },
  ],
};

// ── Dark/Gold pill colours ─────────────────────────────────────────────────
const PILL = {
  published:    { bg:"rgba(184,154,106,0.18)", c:"#D4B06A" },
  draft:        { bg:"rgba(120,120,120,0.18)", c:"#9A9A9A" },
  archived:     { bg:"rgba(80,80,80,0.2)",     c:"#666" },
  active:       { bg:"rgba(184,154,106,0.18)", c:"#D4B06A" },
  inactive:     { bg:"rgba(180,60,60,0.18)",   c:"#C07070" },
  approved:     { bg:"rgba(184,154,106,0.18)", c:"#D4B06A" },
  pending:      { bg:"rgba(180,140,60,0.18)",  c:"#C8A050" },
  rejected:     { bg:"rgba(180,60,60,0.18)",   c:"#C07070" },
  unread:       { bg:"rgba(180,60,60,0.18)",   c:"#C07070" },
  read:         { bg:"rgba(184,154,106,0.18)", c:"#D4B06A" },
  replied:      { bg:"rgba(80,140,200,0.18)",  c:"#7AAAD4" },
  unsubscribed: { bg:"rgba(180,60,60,0.18)",   c:"#C07070" },
  ongoing:      { bg:"rgba(80,140,200,0.18)",  c:"#7AAAD4" },
  completed:    { bg:"rgba(184,154,106,0.18)", c:"#D4B06A" },
  "on-hold":    { bg:"rgba(180,140,60,0.18)",  c:"#C8A050" },
  superadmin:   { bg:"rgba(184,154,106,0.25)", c:"#E8C870" },
  editor:       { bg:"rgba(80,140,200,0.18)",  c:"#7AAAD4" },
  contributor:  { bg:"rgba(100,160,100,0.18)", c:"#80C080" },
  comment:      { bg:"rgba(184,154,106,0.18)", c:"#D4B06A" },
  contact:      { bg:"rgba(80,140,200,0.18)",  c:"#7AAAD4" },
  subscriber:   { bg:"rgba(100,160,100,0.18)", c:"#80C080" },
  system:       { bg:"rgba(120,120,120,0.18)", c:"#9A9A9A" },
};

// ── Theme tokens ──────────────────────────────────────────────────────────
const T = {
  bg:          "#0E0E0C",
  bgCard:      "#141412",
  bgSurface:   "#1A1A17",
  bgHover:     "#1F1F1C",
  bgInput:     "#111110",
  border:      "rgba(184,154,106,0.12)",
  borderMid:   "rgba(184,154,106,0.22)",
  gold:        "#B89A6A",
  goldBright:  "#D4B06A",
  goldDim:     "rgba(184,154,106,0.45)",
  goldGlow:    "rgba(184,154,106,0.08)",
  text:        "#E8E4DC",
  textMid:     "#9A9488",
  textDim:     "#5A5650",
  danger:      "#C07070",
  dangerBg:    "rgba(180,60,60,0.12)",
  success:     "#80A870",
  successBg:   "rgba(100,160,80,0.12)",
  info:        "#7AAAD4",
  infoBg:      "rgba(80,140,200,0.12)",
  sidebar:     "#0A0A08",
  sidebarBorder:"rgba(184,154,106,0.08)",
  topbar:      "#0E0E0C",
};

function CellVal({ v }) {
  if (v === null || v === undefined) return <span style={{ color: T.textDim, fontSize: 12 }}>—</span>;
  if (typeof v === "boolean") return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20,
      background: v ? "rgba(184,154,106,0.15)" : "rgba(80,80,80,0.2)",
      color: v ? T.goldBright : T.textDim, letterSpacing: 0.3 }}>
      {v ? "Yes" : "No"}
    </span>
  );
  const str = String(v);
  if (PILL[str]) return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
      background: PILL[str].bg, color: PILL[str].c, letterSpacing: 0.3 }}>
      {str}
    </span>
  );
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) return (
    <span style={{ fontSize: 12, color: T.textMid }}>
      {new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
    </span>
  );
  if (str.length > 55) return <span style={{ fontSize: 12, color: T.textMid }}>{str.slice(0, 52)}…</span>;
  return <span style={{ fontSize: 13, color: T.text }}>{str}</span>;
}

function Toast({ msg, ok }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: ok ? "#1A1A14" : "#1A1010",
      border: `1px solid ${ok ? T.borderMid : "rgba(180,80,80,0.3)"}`,
      color: ok ? T.goldBright : T.danger,
      padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500,
      fontFamily: "'DM Mono',monospace", letterSpacing: 0.3,
      boxShadow: `0 4px 32px rgba(0,0,0,0.5), 0 0 0 1px ${ok ? T.border : "transparent"}`,
      animation: "fadeUp 0.2s ease" }}>
      {ok ? "✓ " : "✕ "}{msg}
    </div>
  );
}

function Modal({ title, onClose, wide, children }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: 20,
        backdropFilter: "blur(4px)" }}>
      <div style={{ background: T.bgCard, borderRadius: 16,
        width: wide ? "min(820px,95vw)" : "min(580px,95vw)",
        maxHeight: "92vh", display: "flex", flexDirection: "column",
        border: `1px solid ${T.borderMid}`,
        boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${T.border}` }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${T.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: T.bgSurface, borderRadius: "16px 16px 0 0" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 600,
            letterSpacing: 1.2, color: T.gold }}>{title.toUpperCase()}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer",
            fontSize: 16, color: T.textMid, lineHeight: 1, transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = T.text}
            onMouseLeave={e => e.currentTarget.style.color = T.textMid}>✕</button>
        </div>
        <div style={{ padding: "22px 24px", overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", fontSize: 13, padding: "9px 12px",
  border: `1px solid ${T.border}`, borderRadius: 8,
  background: T.bgInput, color: T.text,
  boxSizing: "border-box", fontFamily: "inherit", outline: "none",
  transition: "border-color 0.15s",
};

function RecordForm({ resource, init, onSubmit, onCancel, saving }) {
  const fields = FIELDS[resource] || [];
  const isEdit = !!init?._id;
  const [form, setForm] = useState(() => {
    const d = {};
    fields.forEach(f => {
      if (f.type === "bool") d[f.k] = init?.[f.k] ?? false;
      else if (f.k === "features" && Array.isArray(init?.features)) d[f.k] = init.features.join("\n");
      else if (f.k === "tools" && Array.isArray(init?.tools)) d[f.k] = init.tools.join(", ");
      else if (f.k === "tags" && Array.isArray(init?.tags)) d[f.k] = init.tags.join(", ");
      else d[f.k] = init?.[f.k] ?? "";
    });
    return d;
  });

  const submit = () => {
    const out = { ...form };
    if (typeof out.features === "string") out.features = out.features.split("\n").map(s => s.trim()).filter(Boolean);
    if (typeof out.tools === "string") out.tools = out.tools.split(",").map(s => s.trim()).filter(Boolean);
    if (typeof out.tags === "string") out.tags = out.tags.split(",").map(s => s.trim()).filter(Boolean);
    if (isEdit) delete out.password;
    onSubmit(out);
  };

  const labelStyle = { display: "block", fontSize: 10, fontWeight: 600, color: T.textMid,
    marginBottom: 5, letterSpacing: 0.8, fontFamily: "'DM Mono',monospace" };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {fields.filter(f => !(f.createOnly && isEdit)).map(f => (
          <div key={f.k} style={{ gridColumn: (f.span || f.type === "bool") ? "1/-1" : "auto" }}>
            {f.type !== "bool" && (
              <label style={labelStyle}>
                {f.label.toUpperCase()}
                {f.req && <span style={{ color: T.danger }}> *</span>}
                {f.hint && <span style={{ fontWeight: 400, marginLeft: 6, color: T.textDim }}>({f.hint})</span>}
              </label>
            )}
            {f.type === "bool" ? (
              <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, cursor: "pointer", color: T.text }}>
                <input type="checkbox" checked={!!form[f.k]}
                  onChange={e => setForm(p => ({ ...p, [f.k]: e.target.checked }))}
                  style={{ width: 15, height: 15, accentColor: T.gold }} />
                <span style={{ fontWeight: 500 }}>{f.label}</span>
              </label>
            ) : f.type === "select" ? (
              <select value={form[f.k] || ""} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                <option value="">Select…</option>
                {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === "textarea" ? (
              <textarea value={form[f.k] || ""} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                rows={f.rows || 3} style={{ ...inputStyle, resize: "vertical" }} />
            ) : (
              <input type={f.type} value={form[f.k] || ""} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                style={inputStyle} />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
        <button onClick={onCancel}
          style={{ padding: "9px 20px", fontSize: 13, borderRadius: 8,
            border: `1px solid ${T.border}`, background: "transparent",
            color: T.textMid, cursor: "pointer", fontFamily: "inherit",
            transition: "border-color 0.15s, color 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}>
          Cancel
        </button>
        <button onClick={submit} disabled={saving}
          style={{ padding: "9px 22px", fontSize: 13, borderRadius: 8, border: "none",
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldBright})`,
            color: "#0E0E0C", cursor: "pointer", fontWeight: 600,
            opacity: saving ? 0.6 : 1, fontFamily: "inherit", letterSpacing: 0.3 }}>
          {saving ? "Saving…" : isEdit ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
}

function StatusModal({ resource, record, onClose, onDone, token, toast }) {
  const cfgMap = {
    comments:     { path: id => `/api/v1/comments/${id}/status`,     opts: ["pending","approved","rejected"] },
    contacts:     { path: id => `/api/v1/contacts/${id}/status`,     opts: ["unread","read","replied","archived"] },
    testimonials: { path: id => `/api/v1/testimonials/${id}/status`, opts: ["pending","approved","rejected"] },
  };
  const cfg = cfgMap[resource];
  const [val, setVal] = useState(record.status || cfg.opts[0]);
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    const r = await api(cfg.path(record._id), token, { method: "PUT", body: { status: val } });
    if (r.success) { toast("Status updated"); onDone(); onClose(); }
    else toast(r.message || "Error", false);
    setSaving(false);
  };
  return (
    <Modal title="Update status" onClose={onClose}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {cfg.opts.map(o => {
          const p = PILL[o];
          const isSelected = val === o;
          return (
            <button key={o} onClick={() => setVal(o)}
              style={{ padding: "7px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontWeight: 500,
                border: isSelected ? `2px solid ${T.gold}` : `1px solid ${T.border}`,
                background: isSelected ? p?.bg || T.goldGlow : "transparent",
                color: p ? p.c : T.text, transition: "all 0.15s", fontFamily: "inherit" }}>
              {o}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onClose}
          style={{ padding: "9px 20px", fontSize: 13, borderRadius: 8, border: `1px solid ${T.border}`,
            background: "transparent", color: T.textMid, cursor: "pointer", fontFamily: "inherit" }}>
          Cancel
        </button>
        <button onClick={submit} disabled={saving}
          style={{ padding: "9px 22px", fontSize: 13, borderRadius: 8, border: "none",
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldBright})`,
            color: "#0E0E0C", cursor: "pointer", fontWeight: 600, opacity: saving ? 0.6 : 1, fontFamily: "inherit" }}>
          {saving ? "…" : "Save"}
        </button>
      </div>
    </Modal>
  );
}

function ReplyModal({ record, onClose, onDone, token, toast }) {
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    const r = await api(`/api/v1/contacts/${record._id}/reply`, token, { method: "POST", body: { replyMessage: msg } });
    if (r.success) { toast("Reply sent"); onDone(); onClose(); }
    else toast(r.message || "Error", false);
    setSaving(false);
  };
  return (
    <Modal title={`Reply to ${record.name}`} onClose={onClose}>
      <p style={{ fontSize: 13, color: T.textMid, marginTop: 0, marginBottom: 12 }}>
        Re: <strong style={{ color: T.text }}>{record.subject}</strong> — <em style={{ color: T.goldDim }}>{record.email}</em>
      </p>
      <div style={{ background: T.bgSurface, borderRadius: 8, padding: "12px 14px", marginBottom: 14,
        fontSize: 13, color: T.textMid, lineHeight: 1.7, border: `1px solid ${T.border}` }}>
        {record.message}
      </div>
      <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={5} placeholder="Write your reply…"
        style={{ ...inputStyle, resize: "vertical", marginBottom: 0 }} />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14 }}>
        <button onClick={onClose}
          style={{ padding: "9px 20px", fontSize: 13, borderRadius: 8, border: `1px solid ${T.border}`,
            background: "transparent", color: T.textMid, cursor: "pointer", fontFamily: "inherit" }}>
          Cancel
        </button>
        <button onClick={submit} disabled={saving || !msg.trim()}
          style={{ padding: "9px 22px", fontSize: 13, borderRadius: 8, border: "none",
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldBright})`,
            color: "#0E0E0C", cursor: "pointer", fontWeight: 600,
            opacity: (saving || !msg.trim()) ? 0.4 : 1, fontFamily: "inherit" }}>
          {saving ? "Sending…" : "Send reply"}
        </button>
      </div>
    </Modal>
  );
}

function NewsletterModal({ onClose, token, toast }) {
  const [form, setForm] = useState({ subject: "", html: "" });
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    const r = await api("/api/v1/subscribers/send-newsletter", token, { method: "POST", body: form });
    if (r.success) { toast(r.message || "Newsletter sent"); onClose(); }
    else toast(r.message || "Error", false);
    setSaving(false);
  };
  const labelStyle = { display: "block", fontSize: 10, fontWeight: 600, color: T.textMid,
    marginBottom: 5, letterSpacing: 0.8, fontFamily: "'DM Mono',monospace" };
  return (
    <Modal title="Send newsletter" onClose={onClose}>
      <label style={labelStyle}>SUBJECT *</label>
      <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
        style={{ ...inputStyle, marginBottom: 14 }} />
      <label style={labelStyle}>HTML BODY *</label>
      <textarea value={form.html} onChange={e => setForm(p => ({ ...p, html: e.target.value }))}
        rows={8} style={{ ...inputStyle, resize: "vertical" }} />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14 }}>
        <button onClick={onClose}
          style={{ padding: "9px 20px", fontSize: 13, borderRadius: 8, border: `1px solid ${T.border}`,
            background: "transparent", color: T.textMid, cursor: "pointer", fontFamily: "inherit" }}>
          Cancel
        </button>
        <button onClick={submit} disabled={saving || !form.subject || !form.html}
          style={{ padding: "9px 22px", fontSize: 13, borderRadius: 8, border: "none",
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldBright})`,
            color: "#0E0E0C", cursor: "pointer", fontWeight: 600,
            opacity: (saving || !form.subject || !form.html) ? 0.4 : 1, fontFamily: "inherit" }}>
          {saving ? "Sending…" : "Send newsletter"}
        </button>
      </div>
    </Modal>
  );
}

function ResourcePage({ resource, token, showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [replyModal, setReplyModal] = useState(null);
  const [newsletter, setNewsletter] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const EP = {
    blogs: "/api/v1/blogs", categories: "/api/v1/categories", comments: "/api/v1/comments",
    contacts: "/api/v1/contacts", notifications: "/api/v1/notifications", pricing: "/api/v1/pricing",
    projects: "/api/v1/projects", roles: "/api/v1/roles", services: "/api/v1/services",
    subscribers: "/api/v1/subscribers", team: "/api/v1/team", testimonials: "/api/v1/testimonials", users: "/api/v1/users",
  };
  const ep = EP[resource];
  const cols = COLS[resource] || [];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api(ep, token, { params: search ? { search } : {} });
      setData(r.data || []);
    } catch { showToast("Failed to load", false); }
    setLoading(false);
  }, [ep, token, search]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (form) => {
    setSaving(true);
    const path = resource === "subscribers" ? "/api/v1/subscribers/subscribe" : ep;
    const r = await api(path, token, { method: "POST", body: form });
    if (r.success) { showToast("Created successfully"); load(); setModal(null); }
    else showToast(r.message || "Failed to create", false);
    setSaving(false);
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    const r = await api(`${ep}/${modal._id}`, token, { method: "PUT", body: form });
    if (r.success) { showToast("Updated successfully"); load(); setModal(null); }
    else showToast(r.message || "Failed to update", false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this record? This cannot be undone.")) return;
    const r = await api(`${ep}/${id}`, token, { method: "DELETE" });
    if (r.success) { showToast("Deleted"); load(); }
    else showToast(r.message || "Failed to delete", false);
  };

  const markAllRead = async () => {
    const r = await api("/api/v1/notifications/read-all", token, { method: "PUT" });
    if (r.success) { showToast("All marked as read"); load(); }
  };
  const clearAll = async () => {
    if (!confirm("Clear all notifications?")) return;
    const r = await api("/api/v1/notifications/clear-all", token, { method: "DELETE" });
    if (r.success) { showToast("Cleared"); load(); }
  };
  const markOneRead = async (id) => {
    await api(`/api/v1/notifications/${id}/read`, token, { method: "PUT" });
    load();
  };

  const filtered = search
    ? data.filter(row => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()))
    : data;

  const hasStatus = ["comments","contacts","testimonials"].includes(resource);
  const hasReply = resource === "contacts";

  const actionBtn = (label, onClick, variant = "default") => {
    const styles = {
      default: { border: `1px solid ${T.border}`, bg: "transparent", color: T.textMid, hoverBorder: T.gold, hoverColor: T.text },
      danger:  { border: `1px solid rgba(180,60,60,0.3)`, bg: T.dangerBg, color: T.danger, hoverBorder: T.danger, hoverColor: T.danger },
      success: { border: `1px solid rgba(184,154,106,0.25)`, bg: T.goldGlow, color: T.gold, hoverBorder: T.gold, hoverColor: T.goldBright },
    };
    const s = styles[variant];
    return (
      <button onClick={onClick}
        style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: s.border,
          background: s.bg, color: s.color, cursor: "pointer", fontFamily: "inherit",
          transition: "all 0.15s", letterSpacing: 0.2 }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = s.hoverBorder; e.currentTarget.style.color = s.hoverColor; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = s.border.split(" ").pop(); e.currentTarget.style.color = s.color; }}>
        {label}
      </button>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
          style={{ ...inputStyle, width: 200 }}
          onFocus={e => e.currentTarget.style.borderColor = T.goldDim}
          onBlur={e => e.currentTarget.style.borderColor = T.border} />
        <button onClick={load}
          style={{ padding: "7px 14px", fontSize: 13, borderRadius: 8, border: `1px solid ${T.border}`,
            background: "transparent", color: T.textMid, cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}>
          ↺
        </button>

        {resource === "notifications" && (
          <>
            <button onClick={markAllRead}
              style={{ padding: "7px 14px", fontSize: 13, borderRadius: 8, border: `1px solid ${T.border}`,
                background: "transparent", color: T.textMid, cursor: "pointer", fontFamily: "inherit" }}>
              Mark all read
            </button>
            <button onClick={clearAll}
              style={{ padding: "7px 14px", fontSize: 13, borderRadius: 8, border: `1px solid rgba(180,60,60,0.3)`,
                background: T.dangerBg, color: T.danger, cursor: "pointer", fontFamily: "inherit" }}>
              Clear all
            </button>
          </>
        )}
        {resource === "subscribers" && (
          <button onClick={() => setNewsletter(true)}
            style={{ padding: "7px 16px", fontSize: 13, borderRadius: 8,
              border: `1px solid ${T.borderMid}`, background: T.goldGlow,
              color: T.gold, cursor: "pointer", fontWeight: 500, fontFamily: "inherit", transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(184,154,106,0.14)"}
            onMouseLeave={e => e.currentTarget.style.background = T.goldGlow}>
            ✉ Send newsletter
          </button>
        )}

        <div style={{ marginLeft: "auto" }}>
          {FIELDS[resource] && resource !== "notifications" && (
            <button onClick={() => setModal("create")}
              style={{ padding: "8px 20px", fontSize: 13, borderRadius: 8, border: "none",
                background: `linear-gradient(135deg, ${T.gold}, ${T.goldBright})`,
                color: "#0E0E0C", cursor: "pointer", fontWeight: 600,
                fontFamily: "inherit", letterSpacing: 0.3, transition: "opacity 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              + New
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: T.textDim, fontSize: 13 }}>
          <span style={{ animation: "pulse 1.4s ease infinite", display: "inline-block" }}>Loading…</span>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {cols.map(c => (
                  <th key={c} style={{ textAlign: "left", padding: "8px 14px", fontSize: 9, fontWeight: 700,
                    color: T.goldDim, whiteSpace: "nowrap", fontFamily: "'DM Mono',monospace", letterSpacing: 1 }}>
                    {c.replace(/([A-Z])/g, " $1").toUpperCase()}
                  </th>
                ))}
                <th style={{ minWidth: hasReply ? 200 : 130 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={cols.length + 1}
                  style={{ textAlign: "center", padding: "52px 0", color: T.textDim, fontSize: 13 }}>
                  No records found
                </td></tr>
              ) : filtered.map(row => (
                <tr key={row._id} style={{ borderBottom: `1px solid ${T.border}`, transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bgHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  {cols.map(c => {
                    let v = row[c];
                    if (v && typeof v === "object" && !Array.isArray(v)) v = v.title || v.name || v._id;
                    return <td key={c} style={{ padding: "10px 14px", verticalAlign: "middle" }}><CellVal v={v} /></td>;
                  })}
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {resource === "notifications" && !row.isRead && actionBtn("Read", () => markOneRead(row._id))}
                      {hasStatus && actionBtn("Status", () => setStatusModal(row))}
                      {hasReply && actionBtn("Reply", () => setReplyModal(row), "success")}
                      {FIELDS[resource] && resource !== "notifications" && actionBtn("Edit", () => setModal(row))}
                      {actionBtn("Del", () => handleDelete(row._id), "danger")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === "create" ? `New ${resource.slice(0, -1)}` : "Edit record"} onClose={() => setModal(null)} wide>
          <RecordForm resource={resource} init={modal === "create" ? null : modal}
            onSubmit={modal === "create" ? handleCreate : handleUpdate}
            onCancel={() => setModal(null)} saving={saving} />
        </Modal>
      )}
      {statusModal && <StatusModal resource={resource} record={statusModal} onClose={() => setStatusModal(null)} onDone={load} token={token} toast={showToast} />}
      {replyModal && <ReplyModal record={replyModal} onClose={() => setReplyModal(null)} onDone={load} token={token} toast={showToast} />}
      {newsletter && <NewsletterModal onClose={() => setNewsletter(false)} token={token} toast={showToast} />}
    </div>
  );
}

function Dashboard({ token }) {
  const [counts, setCounts] = useState({});
  const [me, setMe] = useState(null);

  useEffect(() => {
    api("/api/v1/auth/me", token).then(r => setMe(r.data)).catch(() => {});
    [
      ["blogs","/api/v1/blogs"], ["projects","/api/v1/projects"], ["services","/api/v1/services"],
      ["contacts","/api/v1/contacts"], ["subscribers","/api/v1/subscribers"], ["users","/api/v1/users"],
      ["notifications","/api/v1/notifications"], ["comments","/api/v1/comments"],
      ["testimonials","/api/v1/testimonials"], ["team","/api/v1/team"],
      ["pricing","/api/v1/pricing"], ["categories","/api/v1/categories"],
    ].forEach(([k, p]) =>
      api(p, token).then(r => setCounts(c => ({ ...c, [k]: r.total ?? r.count ?? (Array.isArray(r.data) ? r.data.length : "—") }))).catch(() => {})
    );
  }, [token]);

  const cards = [
    { k: "blogs",         label: "Blog posts",    accent: "rgba(80,140,200,0.08)",  border: "rgba(80,140,200,0.15)" },
    { k: "projects",      label: "Projects",      accent: T.goldGlow,               border: T.border },
    { k: "services",      label: "Services",      accent: "rgba(140,100,200,0.08)", border: "rgba(140,100,200,0.15)" },
    { k: "contacts",      label: "Contacts",      accent: "rgba(180,140,60,0.08)",  border: "rgba(180,140,60,0.15)" },
    { k: "subscribers",   label: "Subscribers",   accent: T.goldGlow,               border: T.border },
    { k: "comments",      label: "Comments",      accent: "rgba(80,140,200,0.08)",  border: "rgba(80,140,200,0.15)" },
    { k: "testimonials",  label: "Testimonials",  accent: "rgba(140,100,200,0.08)", border: "rgba(140,100,200,0.15)" },
    { k: "team",          label: "Team",          accent: T.goldGlow,               border: T.border },
    { k: "users",         label: "Users",         accent: "rgba(180,60,60,0.08)",   border: "rgba(180,60,60,0.15)" },
    { k: "notifications", label: "Notifications", accent: "rgba(80,80,80,0.1)",     border: "rgba(80,80,80,0.2)" },
    { k: "pricing",       label: "Pricing plans", accent: T.goldGlow,               border: T.border },
    { k: "categories",    label: "Categories",    accent: "rgba(180,140,60,0.08)",  border: "rgba(180,140,60,0.15)" },
  ];

  return (
    <div>
      {me && (
        <div style={{ marginBottom: 28, padding: "16px 20px",
          background: T.bgSurface, borderRadius: 12, border: `1px solid ${T.borderMid}`,
          display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%",
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldBright})`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#0E0E0C", fontFamily: "'Lora',serif", fontSize: 17, fontWeight: 700 }}>
              {(me.username || "?")[0].toUpperCase()}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{me.username}</div>
            <div style={{ fontSize: 12, color: T.textMid, marginTop: 2 }}>
              {me.email} ·{" "}
              <span style={{ background: PILL[me.role?.title]?.bg || "rgba(80,80,80,0.2)",
                color: PILL[me.role?.title]?.c || T.textMid,
                padding: "1px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>
                {me.role?.title || "—"}
              </span>
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 0.8, fontFamily: "'DM Mono',monospace" }}>CONNECTED TO</div>
            <div style={{ fontSize: 12, color: T.goldDim, marginTop: 2 }}>{BASE}</div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(148px, 1fr))", gap: 10 }}>
        {cards.map(c => (
          <div key={c.k} style={{ background: c.accent, borderRadius: 12, padding: "18px 18px",
            border: `1px solid ${c.border}`, transition: "transform 0.15s, border-color 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = T.goldDim; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = c.border; }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: T.textDim, letterSpacing: 1,
              fontFamily: "'DM Mono',monospace", marginBottom: 12 }}>{c.label.toUpperCase()}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: T.gold, letterSpacing: -1,
              fontFamily: "'Lora',serif" }}>
              {counts[c.k] !== undefined ? counts[c.k] : <span style={{ fontSize: 14, color: T.textDim }}>…</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgot, setForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const submit = async () => {
    if (!email || !password) return;
    setLoading(true); setError("");
    const r = await api("/api/v1/auth/login", null, { method: "POST", body: { email, password } });
    if (r.success && r.token) onLogin(r.token);
    else setError(r.message || "Invalid credentials");
    setLoading(false);
  };

  const sendForgot = async () => {
    setLoading(true);
    const r = await api("/api/v1/auth/forgot-password", null, { method: "POST", body: { email: forgotEmail } });
    if (r.success) setForgotSent(true);
    else setError(r.message || "Error sending reset link");
    setLoading(false);
  };

  const inp = { ...inputStyle, marginBottom: 14, padding: "12px 14px", fontSize: 14 };
  const labelStyle = { display: "block", fontSize: 10, fontWeight: 600, color: T.textDim,
    marginBottom: 5, letterSpacing: 0.8, fontFamily: "'DM Mono',monospace" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: T.bg, fontFamily: "'DM Mono',monospace", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Lora:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        *{box-sizing:border-box}
        input,select,textarea { color-scheme: dark; }
        option { background: #141412; color: #E8E4DC; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(184,154,106,0.2);border-radius:10px}
      `}</style>

      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(184,154,106,0.06) 0%, transparent 70%)",
        pointerEvents: "none" }} />

      <div style={{ width: 400, position: "relative", animation: "fadeUp 0.4s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 52, height: 52, borderRadius: 14, marginBottom: 14,
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldBright})`,
            boxShadow: `0 0 32px rgba(184,154,106,0.3)` }}>
            <span style={{ color: "#0E0E0C", fontSize: 24, fontWeight: 700, fontFamily: "'Lora',serif" }}>Z</span>
          </div>
          <div style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: -0.5 }}>Zeeltech</div>
          <div style={{ fontSize: 10, color: T.textDim, marginTop: 4, letterSpacing: 2 }}>ADMIN PORTAL</div>
        </div>

        <div style={{ background: T.bgCard, borderRadius: 18, padding: "32px 30px",
          border: `1px solid ${T.borderMid}`,
          boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px ${T.border}` }}>
          {!forgot ? (
            <>
              <div style={{ fontFamily: "'Lora',serif", fontSize: 16, fontWeight: 600, marginBottom: 22, color: T.text }}>
                Sign in to continue
              </div>
              {error && (
                <div style={{ background: T.dangerBg, color: T.danger, borderRadius: 8,
                  padding: "9px 13px", fontSize: 12, marginBottom: 14,
                  border: `1px solid rgba(180,80,80,0.2)` }}>{error}</div>
              )}
              <label style={labelStyle}>EMAIL ADDRESS</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()} style={inp}
                onFocus={e => e.currentTarget.style.borderColor = T.goldDim}
                onBlur={e => e.currentTarget.style.borderColor = T.border} />
              <label style={labelStyle}>PASSWORD</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()} style={{ ...inp, marginBottom: 20 }}
                onFocus={e => e.currentTarget.style.borderColor = T.goldDim}
                onBlur={e => e.currentTarget.style.borderColor = T.border} />
              <button onClick={submit} disabled={loading || !email || !password}
                style={{ width: "100%", padding: "13px", fontSize: 12, fontWeight: 600,
                  background: `linear-gradient(135deg, ${T.gold}, ${T.goldBright})`,
                  color: "#0E0E0C", border: "none", borderRadius: 10, cursor: "pointer",
                  letterSpacing: 1.2, opacity: (loading || !email || !password) ? 0.45 : 1,
                  transition: "opacity 0.15s", fontFamily: "'DM Mono',monospace" }}>
                {loading ? "SIGNING IN…" : "SIGN IN →"}
              </button>
              <button onClick={() => { setForgot(true); setError(""); }}
                style={{ width: "100%", marginTop: 12, padding: "8px", fontSize: 12, color: T.textDim,
                  background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono',monospace",
                  transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = T.gold}
                onMouseLeave={e => e.currentTarget.style.color = T.textDim}>
                Forgot password?
              </button>
            </>
          ) : (
            <>
              <div style={{ fontFamily: "'Lora',serif", fontSize: 16, fontWeight: 600, marginBottom: 6, color: T.text }}>
                Reset your password
              </div>
              {forgotSent ? (
                <div style={{ background: T.goldGlow, color: T.goldBright, borderRadius: 8,
                  padding: "12px 14px", fontSize: 13, border: `1px solid ${T.border}` }}>
                  Reset link sent — check your inbox.
                </div>
              ) : (
                <>
                  {error && <div style={{ background: T.dangerBg, color: T.danger, borderRadius: 8,
                    padding: "9px 13px", fontSize: 12, marginBottom: 14,
                    border: `1px solid rgba(180,80,80,0.2)` }}>{error}</div>}
                  <p style={{ fontSize: 12, color: T.textDim, marginTop: 4, marginBottom: 18 }}>
                    Enter your email and we'll send a 15-minute reset link.
                  </p>
                  <label style={labelStyle}>EMAIL ADDRESS</label>
                  <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                    style={{ ...inp, marginBottom: 20 }}
                    onFocus={e => e.currentTarget.style.borderColor = T.goldDim}
                    onBlur={e => e.currentTarget.style.borderColor = T.border} />
                  <button onClick={sendForgot} disabled={loading || !forgotEmail}
                    style={{ width: "100%", padding: "13px", fontSize: 12, fontWeight: 600,
                      background: `linear-gradient(135deg, ${T.gold}, ${T.goldBright})`,
                      color: "#0E0E0C", border: "none", borderRadius: 10, cursor: "pointer",
                      letterSpacing: 1.2, opacity: (loading || !forgotEmail) ? 0.45 : 1,
                      fontFamily: "'DM Mono',monospace" }}>
                    {loading ? "SENDING…" : "SEND RESET LINK →"}
                  </button>
                </>
              )}
              <button onClick={() => { setForgot(false); setForgotSent(false); setError(""); }}
                style={{ width: "100%", marginTop: 12, padding: "8px", fontSize: 12, color: T.textDim,
                  background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono',monospace",
                  transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = T.gold}
                onMouseLeave={e => e.currentTarget.style.color = T.textDim}>
                ← Back to sign in
              </button>
            </>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 11, color: T.textDim, letterSpacing: 0.3 }}>{BASE}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(() => { try { return localStorage.getItem("zt_token") || ""; } catch { return ""; } });
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback((msg, ok = true) => {
    clearTimeout(timer.current);
    setToast({ msg, ok });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const login = t => { try { localStorage.setItem("zt_token", t); } catch {} setToken(t); };
  const logout = async () => {
    await api("/api/v1/auth/logout", token, { method: "POST" }).catch(() => {});
    try { localStorage.removeItem("zt_token"); } catch {}
    setToken("");
  };

  if (!token) return <Login onLogin={login} />;

  const groups = [...new Set(SECTIONS.filter(s => s.group).map(s => s.group))];
  const SW = collapsed ? 56 : 210;

  const navBtn = (id, label, icon, isActive) => (
    <button key={id} onClick={() => setActive(id)} title={label}
      style={{ width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: collapsed ? "9px 0" : "8px 12px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 8, marginBottom: 2,
        background: isActive ? "rgba(184,154,106,0.1)" : "transparent",
        border: isActive ? `1px solid rgba(184,154,106,0.2)` : "1px solid transparent",
        cursor: "pointer", transition: "all 0.12s",
        color: isActive ? T.gold : T.textDim,
        fontWeight: isActive ? 500 : 400, fontSize: 13,
        whiteSpace: "nowrap", overflow: "hidden" }}
      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = T.textMid; e.currentTarget.style.background = "rgba(184,154,106,0.05)"; } }}
      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = T.textDim; e.currentTarget.style.background = "transparent"; } }}>
      <span style={{ fontSize: 12, flexShrink: 0, color: isActive ? T.gold : T.textDim }}>{icon}</span>
      {!collapsed && label}
    </button>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg,
      fontFamily: "'DM Mono',monospace", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Lora:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        *{box-sizing:border-box}
        input,select,textarea { color-scheme:dark; }
        option { background: #141412; color: #E8E4DC; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(184,154,106,0.18);border-radius:10px}
        ::-webkit-scrollbar-track{background:transparent}
      `}</style>

      {/* Sidebar */}
      <div style={{ width: SW, flexShrink: 0, background: T.sidebar,
        display: "flex", flexDirection: "column",
        transition: "width 0.18s ease", overflow: "hidden",
        borderRight: `1px solid ${T.sidebarBorder}` }}>

        {/* Logo */}
        <div style={{ padding: collapsed ? "18px 0" : "18px 14px",
          display: "flex", alignItems: "center", gap: 10,
          borderBottom: `1px solid ${T.sidebarBorder}`,
          justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ width: 28, height: 28, flexShrink: 0,
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldBright})`,
            borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Lora',serif", fontSize: 14, fontWeight: 700, color: "#0A0A08" }}>Z</span>
          </div>
          {!collapsed && (
            <span style={{ fontFamily: "'Lora',serif", fontSize: 14, fontWeight: 700,
              color: T.text, whiteSpace: "nowrap" }}>Zeeltech</span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "10px 6px" }}>
          {navBtn("dashboard", "Dashboard", "▪", active === "dashboard")}

          {groups.map(g => (
            <div key={g}>
              {!collapsed && (
                <div style={{ fontSize: 8, fontWeight: 700, color: T.textDim, letterSpacing: 1.5,
                  padding: "14px 12px 5px", textTransform: "uppercase" }}>{g}</div>
              )}
              {collapsed && <div style={{ height: 10 }} />}
              {SECTIONS.filter(s => s.group === g).map(s => navBtn(s.id, s.label, s.icon, active === s.id))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "8px 6px", borderTop: `1px solid ${T.sidebarBorder}` }}>
          <button onClick={() => setCollapsed(p => !p)} title="Toggle"
            style={{ width: "100%", display: "flex", alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 10, padding: collapsed ? "9px 0" : "8px 12px",
              borderRadius: 8, background: "none", border: "1px solid transparent",
              cursor: "pointer", color: T.textDim, fontSize: 14, marginBottom: 4,
              transition: "color 0.12s", fontFamily: "inherit" }}
            onMouseEnter={e => e.currentTarget.style.color = T.textMid}
            onMouseLeave={e => e.currentTarget.style.color = T.textDim}>
            <span>{collapsed ? "›" : "‹"}</span>
            {!collapsed && <span style={{ fontSize: 12 }}>Collapse</span>}
          </button>
          <button onClick={logout} title="Sign out"
            style={{ width: "100%", display: "flex", alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 10, padding: collapsed ? "9px 0" : "8px 12px",
              borderRadius: 8, background: "none", border: "1px solid transparent",
              cursor: "pointer", color: T.danger, fontSize: 13, fontFamily: "inherit",
              transition: "background 0.12s" }}
            onMouseEnter={e => e.currentTarget.style.background = T.dangerBg}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ fontSize: 14 }}>⊗</span>
            {!collapsed && "Sign out"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ padding: "0 26px", height: 52, display: "flex", alignItems: "center",
          justifyContent: "space-between", background: T.topbar,
          borderBottom: `1px solid ${T.sidebarBorder}`, flexShrink: 0 }}>
          <div style={{ fontFamily: "'Lora',serif", fontSize: 15, fontWeight: 700, color: T.text }}>
            {SECTIONS.find(s => s.id === active)?.label || "Dashboard"}
          </div>
          <div style={{ fontSize: 11, color: T.textDim, background: T.bgSurface,
            padding: "3px 12px", borderRadius: 20, letterSpacing: 0.3,
            border: `1px solid ${T.border}` }}>
            {BASE}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px" }}>
          <div style={{ background: T.bgCard, borderRadius: 14,
            border: `1px solid ${T.border}`, padding: "22px 24px",
            minHeight: "100%" }}>
            {active === "dashboard"
              ? <Dashboard token={token} />
              : <ResourcePage key={active} resource={active} token={token} showToast={showToast} />
            }
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </div>
  );
}