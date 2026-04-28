import { useState, useEffect, useCallback, useRef } from "react";

const BASE = "http://localhost:5000";

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

const PILL = {
  published: { bg:"#e6f4ed", c:"#1a6b3c" }, draft: { bg:"#fef9e7", c:"#9a7200" }, archived: { bg:"#f0f0f0", c:"#666" },
  active: { bg:"#e6f4ed", c:"#1a6b3c" }, inactive: { bg:"#fdecea", c:"#b52a2a" },
  approved: { bg:"#e6f4ed", c:"#1a6b3c" }, pending: { bg:"#fff3e0", c:"#b56a00" }, rejected: { bg:"#fdecea", c:"#b52a2a" },
  unread: { bg:"#fdecea", c:"#b52a2a" }, read: { bg:"#e6f4ed", c:"#1a6b3c" }, replied: { bg:"#e8f0fe", c:"#1a56a8" },
  unsubscribed: { bg:"#fdecea", c:"#b52a2a" },
  ongoing: { bg:"#e8f0fe", c:"#1a56a8" }, completed: { bg:"#e6f4ed", c:"#1a6b3c" }, "on-hold": { bg:"#fff3e0", c:"#b56a00" },
  superadmin: { bg:"#f3e8ff", c:"#6b21a8" }, editor: { bg:"#e8f0fe", c:"#1a56a8" }, contributor: { bg:"#e6f4ed", c:"#1a6b3c" },
  comment: { bg:"#f3e8ff", c:"#6b21a8" }, contact: { bg:"#e8f0fe", c:"#1a56a8" }, subscriber: { bg:"#e6f4ed", c:"#1a6b3c" }, system: { bg:"#fef9e7", c:"#9a7200" },
};

function CellVal({ v }) {
  if (v === null || v === undefined) return <span style={{ color:"#bbb", fontSize:12 }}>—</span>;
  if (typeof v === "boolean") return <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:20, background:v?"#e6f4ed":"#f0f0f0", color:v?"#1a6b3c":"#888" }}>{v?"Yes":"No"}</span>;
  const str = String(v);
  if (PILL[str]) return <span style={{ fontSize:11, fontWeight:600, padding:"2px 9px", borderRadius:20, background:PILL[str].bg, color:PILL[str].c }}>{str}</span>;
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) return <span style={{ fontSize:12, color:"#777" }}>{new Date(v).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</span>;
  if (str.length > 55) return <span style={{ fontSize:12, color:"#555" }}>{str.slice(0,52)}…</span>;
  return <span style={{ fontSize:13 }}>{str}</span>;
}

function Toast({ msg, ok }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, background:ok?"#1a3d2b":"#3d1a1a", color:"#f0ede6", padding:"11px 20px", borderRadius:10, fontSize:13, fontWeight:500, fontFamily:"'DM Mono',monospace", letterSpacing:0.3, boxShadow:"0 4px 24px rgba(0,0,0,0.25)", animation:"fadeUp 0.2s ease" }}>
      {ok ? "✓ " : "✕ "}{msg}
    </div>
  );
}

function Modal({ title, onClose, wide, children }) {
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()} style={{ position:"fixed", inset:0, background:"rgba(10,10,10,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500, padding:20 }}>
      <div style={{ background:"#fafaf8", borderRadius:16, width:wide?"min(800px,95vw)":"min(580px,95vw)", maxHeight:"92vh", display:"flex", flexDirection:"column", border:"1px solid #e4e0d8", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ padding:"18px 24px", borderBottom:"1px solid #e8e4dc", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#f5f3ee", borderRadius:"16px 16px 0 0" }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, fontWeight:600, letterSpacing:0.5, color:"#1a1a1a" }}>{title.toUpperCase()}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"#888", lineHeight:1 }}>✕</button>
        </div>
        <div style={{ padding:"22px 24px", overflowY:"auto" }}>{children}</div>
      </div>
    </div>
  );
}

function RecordForm({ resource, init, onSubmit, onCancel, saving }) {
  const fields = FIELDS[resource] || [];
  const isEdit = !!init?._id;
  const [form, setForm] = useState(() => {
    const d = {};
    fields.forEach(f => {
      if (f.type==="bool") d[f.k] = init?.[f.k] ?? false;
      else if (f.k==="features" && Array.isArray(init?.features)) d[f.k] = init.features.join("\n");
      else if (f.k==="tools" && Array.isArray(init?.tools)) d[f.k] = init.tools.join(", ");
      else if (f.k==="tags" && Array.isArray(init?.tags)) d[f.k] = init.tags.join(", ");
      else d[f.k] = init?.[f.k] ?? "";
    });
    return d;
  });

  const inp = { width:"100%", fontSize:13, padding:"8px 11px", border:"1px solid #ddd", borderRadius:8, background:"#fff", color:"#1a1a1a", boxSizing:"border-box", fontFamily:"inherit", outline:"none" };

  const submit = () => {
    const out = { ...form };
    if (typeof out.features === "string") out.features = out.features.split("\n").map(s=>s.trim()).filter(Boolean);
    if (typeof out.tools === "string") out.tools = out.tools.split(",").map(s=>s.trim()).filter(Boolean);
    if (typeof out.tags === "string") out.tags = out.tags.split(",").map(s=>s.trim()).filter(Boolean);
    if (isEdit) delete out.password;
    onSubmit(out);
  };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {fields.filter(f => !(f.createOnly && isEdit)).map(f => (
          <div key={f.k} style={{ gridColumn: (f.span || f.type==="bool") ? "1/-1" : "auto" }}>
            {f.type !== "bool" && (
              <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#888", marginBottom:5, letterSpacing:0.5, fontFamily:"'DM Mono',monospace" }}>
                {f.label.toUpperCase()}{f.req && <span style={{ color:"#b52a2a" }}> *</span>}
                {f.hint && <span style={{ fontWeight:400, marginLeft:6, color:"#aaa" }}>({f.hint})</span>}
              </label>
            )}
            {f.type==="bool" ? (
              <label style={{ display:"flex", alignItems:"center", gap:9, fontSize:13, cursor:"pointer" }}>
                <input type="checkbox" checked={!!form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.checked}))} style={{ width:15, height:15, accentColor:"#1a3d2b" }} />
                <span style={{ fontWeight:500 }}>{f.label}</span>
              </label>
            ) : f.type==="select" ? (
              <select value={form[f.k]||""} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} style={inp}>
                <option value="">Select…</option>
                {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type==="textarea" ? (
              <textarea value={form[f.k]||""} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} rows={f.rows||3} style={{ ...inp, resize:"vertical" }} />
            ) : (
              <input type={f.type} value={form[f.k]||""} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} style={inp} />
            )}
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:10, marginTop:22, justifyContent:"flex-end" }}>
        <button onClick={onCancel} style={{ padding:"9px 20px", fontSize:13, borderRadius:8, border:"1px solid #ddd", background:"#fff", cursor:"pointer" }}>Cancel</button>
        <button onClick={submit} disabled={saving} style={{ padding:"9px 22px", fontSize:13, borderRadius:8, border:"none", background:"#1a1a1a", color:"#fff", cursor:"pointer", fontWeight:500, opacity:saving?0.6:1 }}>
          {saving ? "Saving…" : isEdit ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
}

function StatusModal({ resource, record, onClose, onDone, token, toast }) {
  const cfgMap = {
    comments:     { path: id=>`/api/comments/${id}/status`,     opts:["pending","approved","rejected"] },
    contacts:     { path: id=>`/api/contacts/${id}/status`,     opts:["unread","read","replied","archived"] },
    testimonials: { path: id=>`/api/testimonials/${id}/status`, opts:["pending","approved","rejected"] },
  };
  const cfg = cfgMap[resource];
  const [val, setVal] = useState(record.status || cfg.opts[0]);
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    const r = await api(cfg.path(record._id), token, { method:"PUT", body:{ status:val } });
    if (r.success) { toast("Status updated"); onDone(); onClose(); }
    else toast(r.message||"Error", false);
    setSaving(false);
  };
  return (
    <Modal title="Update status" onClose={onClose}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        {cfg.opts.map(o => {
          const p = PILL[o];
          return <button key={o} onClick={()=>setVal(o)} style={{ padding:"7px 16px", borderRadius:20, fontSize:13, cursor:"pointer", fontWeight:500, border:val===o?"2px solid #1a1a1a":"1px solid #ddd", background:p?p.bg:"#f5f5f5", color:p?p.c:"#333" }}>{o}</button>;
        })}
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        <button onClick={onClose} style={{ padding:"9px 20px", fontSize:13, borderRadius:8, border:"1px solid #ddd", background:"#fff", cursor:"pointer" }}>Cancel</button>
        <button onClick={submit} disabled={saving} style={{ padding:"9px 22px", fontSize:13, borderRadius:8, border:"none", background:"#1a1a1a", color:"#fff", cursor:"pointer", opacity:saving?0.6:1 }}>{saving?"…":"Save"}</button>
      </div>
    </Modal>
  );
}

function ReplyModal({ record, onClose, onDone, token, toast }) {
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    const r = await api(`/api/contacts/${record._id}/reply`, token, { method:"POST", body:{ replyMessage:msg } });
    if (r.success) { toast("Reply sent"); onDone(); onClose(); }
    else toast(r.message||"Error", false);
    setSaving(false);
  };
  return (
    <Modal title={`Reply to ${record.name}`} onClose={onClose}>
      <p style={{ fontSize:13, color:"#666", marginTop:0 }}>Re: <strong>{record.subject}</strong> — to <em>{record.email}</em></p>
      <div style={{ background:"#f5f3ee", borderRadius:8, padding:"12px 14px", marginBottom:14, fontSize:13, color:"#444", lineHeight:1.6 }}>{record.message}</div>
      <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={5} placeholder="Write your reply…"
        style={{ width:"100%", fontSize:13, padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, resize:"vertical", boxSizing:"border-box", fontFamily:"inherit" }} />
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:14 }}>
        <button onClick={onClose} style={{ padding:"9px 20px", fontSize:13, borderRadius:8, border:"1px solid #ddd", background:"#fff", cursor:"pointer" }}>Cancel</button>
        <button onClick={submit} disabled={saving||!msg.trim()} style={{ padding:"9px 22px", fontSize:13, borderRadius:8, border:"none", background:"#1a6b3c", color:"#fff", cursor:"pointer", opacity:(saving||!msg.trim())?0.5:1 }}>
          {saving?"Sending…":"Send reply"}
        </button>
      </div>
    </Modal>
  );
}

function NewsletterModal({ onClose, token, toast }) {
  const [form, setForm] = useState({ subject:"", html:"" });
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    const r = await api("/api/subscribers/send-newsletter", token, { method:"POST", body:form });
    if (r.success) { toast(r.message||"Newsletter sent"); onClose(); }
    else toast(r.message||"Error", false);
    setSaving(false);
  };
  const inp = { width:"100%", fontSize:13, padding:"8px 11px", border:"1px solid #ddd", borderRadius:8, background:"#fff", boxSizing:"border-box", fontFamily:"inherit", marginBottom:14 };
  return (
    <Modal title="Send newsletter" onClose={onClose}>
      <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#888", marginBottom:5, letterSpacing:0.5, fontFamily:"'DM Mono',monospace" }}>SUBJECT *</label>
      <input value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} style={inp} />
      <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#888", marginBottom:5, letterSpacing:0.5, fontFamily:"'DM Mono',monospace" }}>HTML BODY *</label>
      <textarea value={form.html} onChange={e=>setForm(p=>({...p,html:e.target.value}))} rows={8} style={{ ...inp, resize:"vertical", marginBottom:0 }} />
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:14 }}>
        <button onClick={onClose} style={{ padding:"9px 20px", fontSize:13, borderRadius:8, border:"1px solid #ddd", background:"#fff", cursor:"pointer" }}>Cancel</button>
        <button onClick={submit} disabled={saving||!form.subject||!form.html} style={{ padding:"9px 22px", fontSize:13, borderRadius:8, border:"none", background:"#1a6b3c", color:"#fff", cursor:"pointer", opacity:(saving||!form.subject||!form.html)?0.5:1 }}>
          {saving?"Sending…":"Send newsletter"}
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
    blogs:"/api/blogs", categories:"/api/categories", comments:"/api/comments",
    contacts:"/api/contacts", notifications:"/api/notifications", pricing:"/api/pricing",
    projects:"/api/projects", roles:"/api/roles", services:"/api/services",
    subscribers:"/api/subscribers", team:"/api/team", testimonials:"/api/testimonials", users:"/api/users",
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
    const path = resource === "subscribers" ? "/api/subscribers/subscribe" : ep;
    const r = await api(path, token, { method:"POST", body:form });
    if (r.success) { showToast("Created successfully"); load(); setModal(null); }
    else showToast(r.message||"Failed to create", false);
    setSaving(false);
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    const r = await api(`${ep}/${modal._id}`, token, { method:"PUT", body:form });
    if (r.success) { showToast("Updated successfully"); load(); setModal(null); }
    else showToast(r.message||"Failed to update", false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this record? This cannot be undone.")) return;
    const r = await api(`${ep}/${id}`, token, { method:"DELETE" });
    if (r.success) { showToast("Deleted"); load(); }
    else showToast(r.message||"Failed to delete", false);
  };

  const markAllRead = async () => {
    const r = await api("/api/notifications/read-all", token, { method:"PUT" });
    if (r.success) { showToast("All marked as read"); load(); }
  };
  const clearAll = async () => {
    if (!confirm("Clear all notifications?")) return;
    const r = await api("/api/notifications/clear-all", token, { method:"DELETE" });
    if (r.success) { showToast("Cleared"); load(); }
  };
  const markOneRead = async (id) => {
    await api(`/api/notifications/${id}/read`, token, { method:"PUT" });
    load();
  };

  const filtered = search
    ? data.filter(row => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()))
    : data;

  const hasStatus = ["comments","contacts","testimonials"].includes(resource);
  const hasReply = resource === "contacts";

  const btnBase = { padding:"7px 14px", fontSize:13, borderRadius:8, border:"1px solid #e0dcd4", background:"#fff", cursor:"pointer", fontFamily:"inherit" };

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…"
          style={{ fontSize:13, padding:"7px 13px", border:"1px solid #e0dcd4", borderRadius:8, background:"#fff", width:200, outline:"none", fontFamily:"inherit" }} />
        <button onClick={load} style={btnBase}>↺</button>

        {resource==="notifications" && (
          <>
            <button onClick={markAllRead} style={btnBase}>Mark all read</button>
            <button onClick={clearAll} style={{ ...btnBase, background:"#fdecea", border:"1px solid #fad4d4", color:"#b52a2a" }}>Clear all</button>
          </>
        )}
        {resource==="subscribers" && (
          <button onClick={()=>setNewsletter(true)} style={{ ...btnBase, background:"#e6f4ed", border:"1px solid #c8e6d4", color:"#1a6b3c", fontWeight:500 }}>✉ Send newsletter</button>
        )}

        <div style={{ marginLeft:"auto" }}>
          {FIELDS[resource] && resource!=="notifications" && (
            <button onClick={()=>setModal("create")} style={{ padding:"7px 18px", fontSize:13, borderRadius:8, border:"none", background:"#1a1a1a", color:"#f0ede6", cursor:"pointer", fontWeight:500, fontFamily:"inherit" }}>
              + New
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"50px 0", color:"#bbb", fontSize:13 }}>Loading…</div>
      ) : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1.5px solid #e8e4dc" }}>
                {cols.map(c=>(
                  <th key={c} style={{ textAlign:"left", padding:"8px 14px", fontSize:10, fontWeight:700, color:"#999", whiteSpace:"nowrap", fontFamily:"'DM Mono',monospace", letterSpacing:0.6 }}>
                    {c.replace(/([A-Z])/g," $1").toUpperCase()}
                  </th>
                ))}
                <th style={{ minWidth: hasReply ? 190 : 120 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={cols.length+1} style={{ textAlign:"center", padding:"44px 0", color:"#ccc", fontSize:13 }}>No records found</td></tr>
              ) : filtered.map(row => (
                <tr key={row._id} style={{ borderBottom:"1px solid #f0ede6" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#faf9f6"}
                  onMouseLeave={e=>e.currentTarget.style.background=""}>
                  {cols.map(c => {
                    let v = row[c];
                    if (v && typeof v==="object" && !Array.isArray(v)) v = v.title||v.name||v._id;
                    return <td key={c} style={{ padding:"10px 14px", verticalAlign:"middle" }}><CellVal v={v} /></td>;
                  })}
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                      {resource==="notifications" && !row.isRead && (
                        <button onClick={()=>markOneRead(row._id)} style={{ fontSize:11, padding:"4px 9px", borderRadius:6, border:"1px solid #ddd", background:"#fff", cursor:"pointer" }}>Read</button>
                      )}
                      {hasStatus && (
                        <button onClick={()=>setStatusModal(row)} style={{ fontSize:11, padding:"4px 9px", borderRadius:6, border:"1px solid #e0dcd4", background:"#fff", cursor:"pointer" }}>Status</button>
                      )}
                      {hasReply && (
                        <button onClick={()=>setReplyModal(row)} style={{ fontSize:11, padding:"4px 9px", borderRadius:6, border:"1px solid #c8e6d4", background:"#e6f4ed", color:"#1a6b3c", cursor:"pointer" }}>Reply</button>
                      )}
                      {FIELDS[resource] && resource!=="notifications" && (
                        <button onClick={()=>setModal(row)} style={{ fontSize:11, padding:"4px 9px", borderRadius:6, border:"1px solid #ddd", background:"#fff", cursor:"pointer" }}>Edit</button>
                      )}
                      <button onClick={()=>handleDelete(row._id)} style={{ fontSize:11, padding:"4px 9px", borderRadius:6, border:"1px solid #fad4d4", background:"#fdecea", color:"#b52a2a", cursor:"pointer" }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal==="create" ? `New ${resource.slice(0,-1)}` : "Edit record"} onClose={()=>setModal(null)} wide>
          <RecordForm resource={resource} init={modal==="create"?null:modal}
            onSubmit={modal==="create"?handleCreate:handleUpdate}
            onCancel={()=>setModal(null)} saving={saving} />
        </Modal>
      )}
      {statusModal && <StatusModal resource={resource} record={statusModal} onClose={()=>setStatusModal(null)} onDone={load} token={token} toast={showToast} />}
      {replyModal && <ReplyModal record={replyModal} onClose={()=>setReplyModal(null)} onDone={load} token={token} toast={showToast} />}
      {newsletter && <NewsletterModal onClose={()=>setNewsletter(false)} token={token} toast={showToast} />}
    </div>
  );
}

function Dashboard({ token }) {
  const [counts, setCounts] = useState({});
  const [me, setMe] = useState(null);

  useEffect(() => {
    api("/api/auth/me", token).then(r=>setMe(r.data)).catch(()=>{});
    [["blogs","/api/blogs"],["projects","/api/projects"],["services","/api/services"],
     ["contacts","/api/contacts"],["subscribers","/api/subscribers"],["users","/api/users"],
     ["notifications","/api/notifications"],["comments","/api/comments"],
     ["testimonials","/api/testimonials"],["team","/api/team"],
     ["pricing","/api/pricing"],["categories","/api/categories"]]
      .forEach(([k,p]) => api(p,token).then(r=>setCounts(c=>({...c,[k]:r.total??r.count??(Array.isArray(r.data)?r.data.length:"—")}))).catch(()=>{}));
  }, [token]);

  const cards = [
    {k:"blogs",label:"Blog posts",accent:"#e8f0fe"},{k:"projects",label:"Projects",accent:"#e6f4ed"},
    {k:"services",label:"Services",accent:"#f3e8ff"},{k:"contacts",label:"Contacts",accent:"#fff3e0"},
    {k:"subscribers",label:"Subscribers",accent:"#e6f4ed"},{k:"comments",label:"Comments",accent:"#fef9e7"},
    {k:"testimonials",label:"Testimonials",accent:"#f3e8ff"},{k:"team",label:"Team",accent:"#e8f0fe"},
    {k:"users",label:"Users",accent:"#fdecea"},{k:"notifications",label:"Notifications",accent:"#f5f3ee"},
    {k:"pricing",label:"Pricing plans",accent:"#e6f4ed"},{k:"categories",label:"Categories",accent:"#fff3e0"},
  ];

  return (
    <div>
      {me && (
        <div style={{ marginBottom:28, padding:"16px 20px", background:"#f5f3ee", borderRadius:12, border:"1px solid #e8e4dc", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:"#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ color:"#f0ede6", fontFamily:"'Lora',serif", fontSize:16, fontWeight:700 }}>{(me.username||"?")[0].toUpperCase()}</span>
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:600 }}>{me.username}</div>
            <div style={{ fontSize:12, color:"#888" }}>{me.email} · <span style={{ background: PILL[me.role?.title]?.bg||"#f0f0f0", color: PILL[me.role?.title]?.c||"#666", padding:"1px 7px", borderRadius:10, fontSize:11, fontWeight:600 }}>{me.role?.title||"—"}</span></div>
          </div>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(148px, 1fr))", gap:12 }}>
        {cards.map(c=>(
          <div key={c.k} style={{ background:c.accent, borderRadius:12, padding:"16px 18px", border:"1px solid rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#777", letterSpacing:0.6, fontFamily:"'DM Mono',monospace", marginBottom:10 }}>{c.label.toUpperCase()}</div>
            <div style={{ fontSize:28, fontWeight:700, color:"#1a1a1a", letterSpacing:-1 }}>
              {counts[c.k]!==undefined ? counts[c.k] : <span style={{ fontSize:14, color:"#ccc" }}>…</span>}
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
    if (!email||!password) return;
    setLoading(true); setError("");
    const r = await api("/api/v1/auth/login", null, { method:"POST", body:{ email, password } });
    if (r.success && r.token) onLogin(r.token);
    else setError(r.message||"Invalid credentials");
    setLoading(false);
  };

  const sendForgot = async () => {
    setLoading(true);
    const r = await api("/api/auth/forgot-password", null, { method:"POST", body:{ email:forgotEmail } });
    if (r.success) setForgotSent(true);
    else setError(r.message||"Error sending reset link");
    setLoading(false);
  };

  const inp = { width:"100%", fontSize:14, padding:"11px 14px", border:"1px solid #e0dcd4", borderRadius:10, background:"#fff", color:"#1a1a1a", boxSizing:"border-box", fontFamily:"'DM Mono',monospace", outline:"none", marginBottom:14 };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f0ede6", fontFamily:"'DM Mono',monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Lora:ital,wght@0,400;0,700;1,400&display=swap');`}</style>
      <div style={{ width:400 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:50, height:50, background:"#1a1a1a", borderRadius:13, marginBottom:14 }}>
            <span style={{ color:"#f0ede6", fontSize:22, fontWeight:700, fontFamily:"'Lora',serif" }}>Z</span>
          </div>
          <div style={{ fontFamily:"'Lora',serif", fontSize:22, fontWeight:700, color:"#1a1a1a", letterSpacing:-0.5 }}>Zeeltech</div>
          <div style={{ fontSize:11, color:"#aaa", marginTop:4, letterSpacing:1 }}>ADMIN PORTAL</div>
        </div>

        <div style={{ background:"#fafaf8", borderRadius:18, padding:"32px 30px", border:"1px solid #e4e0d8", boxShadow:"0 8px 40px rgba(0,0,0,0.08)" }}>
          {!forgot ? (
            <>
              <div style={{ fontFamily:"'Lora',serif", fontSize:16, fontWeight:600, marginBottom:22, color:"#1a1a1a" }}>Sign in to continue</div>
              {error && <div style={{ background:"#fdecea", color:"#b52a2a", borderRadius:8, padding:"9px 13px", fontSize:12, marginBottom:14 }}>{error}</div>}
              <label style={{ display:"block", fontSize:10, fontWeight:600, color:"#999", marginBottom:5, letterSpacing:0.8 }}>EMAIL ADDRESS</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={inp} />
              <label style={{ display:"block", fontSize:10, fontWeight:600, color:"#999", marginBottom:5, letterSpacing:0.8 }}>PASSWORD</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={{ ...inp, marginBottom:20 }} />
              <button onClick={submit} disabled={loading||!email||!password}
                style={{ width:"100%", padding:"12px", fontSize:12, fontWeight:600, background:"#1a1a1a", color:"#f0ede6", border:"none", borderRadius:10, cursor:"pointer", letterSpacing:1, opacity:(loading||!email||!password)?0.55:1 }}>
                {loading?"SIGNING IN…":"SIGN IN →"}
              </button>
              <button onClick={()=>{setForgot(true);setError("");}} style={{ width:"100%", marginTop:12, padding:"8px", fontSize:12, color:"#aaa", background:"none", border:"none", cursor:"pointer" }}>
                Forgot password?
              </button>
            </>
          ) : (
            <>
              <div style={{ fontFamily:"'Lora',serif", fontSize:16, fontWeight:600, marginBottom:6, color:"#1a1a1a" }}>Reset your password</div>
              {forgotSent ? (
                <div style={{ background:"#e6f4ed", color:"#1a6b3c", borderRadius:8, padding:"12px 14px", fontSize:13 }}>
                  Reset link sent — check your inbox.
                </div>
              ) : (
                <>
                  {error && <div style={{ background:"#fdecea", color:"#b52a2a", borderRadius:8, padding:"9px 13px", fontSize:12, marginBottom:14 }}>{error}</div>}
                  <p style={{ fontSize:12, color:"#aaa", marginTop:4, marginBottom:18 }}>Enter your email and we'll send a 15-minute reset link.</p>
                  <label style={{ display:"block", fontSize:10, fontWeight:600, color:"#999", marginBottom:5, letterSpacing:0.8 }}>EMAIL ADDRESS</label>
                  <input type="email" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} style={{ ...inp, marginBottom:20 }} />
                  <button onClick={sendForgot} disabled={loading||!forgotEmail}
                    style={{ width:"100%", padding:"12px", fontSize:12, fontWeight:600, background:"#1a1a1a", color:"#f0ede6", border:"none", borderRadius:10, cursor:"pointer", letterSpacing:1, opacity:(loading||!forgotEmail)?0.55:1 }}>
                    {loading?"SENDING…":"SEND RESET LINK →"}
                  </button>
                </>
              )}
              <button onClick={()=>{setForgot(false);setForgotSent(false);setError("");}} style={{ width:"100%", marginTop:12, padding:"8px", fontSize:12, color:"#aaa", background:"none", border:"none", cursor:"pointer" }}>
                ← Back to sign in
              </button>
            </>
          )}
        </div>
        <div style={{ textAlign:"center", marginTop:18, fontSize:11, color:"#c0bbb4", letterSpacing:0.3 }}>{BASE}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(()=>{ try { return localStorage.getItem("zt_token")||""; } catch { return ""; } });
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback((msg, ok=true) => {
    clearTimeout(timer.current);
    setToast({ msg, ok });
    timer.current = setTimeout(()=>setToast(null), 3200);
  }, []);

  const login = t => { try { localStorage.setItem("zt_token",t); } catch {} setToken(t); };
  const logout = async () => {
    await api("/api/auth/logout", token, { method:"POST" }).catch(()=>{});
    try { localStorage.removeItem("zt_token"); } catch {}
    setToken("");
  };

  if (!token) return <Login onLogin={login} />;

  const groups = [...new Set(SECTIONS.filter(s=>s.group).map(s=>s.group))];
  const SW = collapsed ? 58 : 212;

  return (
    <div style={{ display:"flex", height:"100vh", background:"#f0ede6", fontFamily:"'DM Mono',monospace", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Lora:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#d0ccc4;border-radius:10px}
      `}</style>

      {/* Sidebar */}
      <div style={{ width:SW, flexShrink:0, background:"#161614", display:"flex", flexDirection:"column", transition:"width 0.18s ease", overflow:"hidden" }}>
        <div style={{ padding: collapsed?"18px 0":"18px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid #252522", justifyContent: collapsed?"center":"flex-start" }}>
          <div style={{ width:28, height:28, background:"#f0ede6", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ fontFamily:"'Lora',serif", fontSize:14, fontWeight:700, color:"#161614" }}>Z</span>
          </div>
          {!collapsed && <span style={{ fontFamily:"'Lora',serif", fontSize:14, fontWeight:700, color:"#f0ede6", whiteSpace:"nowrap" }}>Zeeltech</span>}
        </div>

        <nav style={{ flex:1, overflowY:"auto", padding:"10px 6px" }}>
          <button onClick={()=>setActive("dashboard")} title="Dashboard"
            style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding: collapsed?"9px 0":"8px 11px", justifyContent: collapsed?"center":"flex-start", borderRadius:8, marginBottom:4, background: active==="dashboard"?"#252522":"transparent", border:"none", cursor:"pointer", color: active==="dashboard"?"#f0ede6":"#666", fontWeight:500, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", transition:"background 0.1s" }}>
            <span style={{ fontSize:13, flexShrink:0 }}>▪</span>{!collapsed&&"Dashboard"}
          </button>

          {groups.map(g=>(
            <div key={g}>
              {!collapsed && <div style={{ fontSize:9, fontWeight:700, color:"#3a3a38", letterSpacing:1.2, padding:"14px 11px 5px" }}>{g.toUpperCase()}</div>}
              {collapsed && <div style={{ height:12 }}/>}
              {SECTIONS.filter(s=>s.group===g).map(s=>(
                <button key={s.id} onClick={()=>setActive(s.id)} title={s.label}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding: collapsed?"9px 0":"8px 11px", justifyContent: collapsed?"center":"flex-start", borderRadius:8, marginBottom:2, background: active===s.id?"#252522":"transparent", border:"none", cursor:"pointer", color: active===s.id?"#f0ede6":"#555", fontWeight: active===s.id?500:400, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", transition:"background 0.1s, color 0.1s" }}>
                  <span style={{ fontSize:12, flexShrink:0 }}>{s.icon}</span>{!collapsed&&s.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding:"8px 6px", borderTop:"1px solid #252522" }}>
          <button onClick={()=>setCollapsed(p=>!p)} title="Toggle" style={{ width:"100%", display:"flex", alignItems:"center", justifyContent: collapsed?"center":"flex-start", gap:9, padding: collapsed?"9px 0":"8px 11px", borderRadius:8, background:"none", border:"none", cursor:"pointer", color:"#444", fontSize:14, marginBottom:4, transition:"color 0.1s" }}
            onMouseEnter={e=>e.currentTarget.style.color="#888"} onMouseLeave={e=>e.currentTarget.style.color="#444"}>
            <span>{collapsed?"›":"‹"}</span>{!collapsed&&<span style={{ fontSize:12 }}>Collapse</span>}
          </button>
          <button onClick={logout} title="Sign out" style={{ width:"100%", display:"flex", alignItems:"center", justifyContent: collapsed?"center":"flex-start", gap:9, padding: collapsed?"9px 0":"8px 11px", borderRadius:8, background:"none", border:"none", cursor:"pointer", color:"#7a3030", fontSize:13 }}>
            <span style={{ fontSize:14 }}>⊗</span>{!collapsed&&"Sign out"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>
        <div style={{ padding:"0 26px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fafaf8", borderBottom:"1px solid #e8e4dc", flexShrink:0 }}>
          <div style={{ fontFamily:"'Lora',serif", fontSize:15, fontWeight:700, color:"#1a1a1a" }}>
            {SECTIONS.find(s=>s.id===active)?.label||"Dashboard"}
          </div>
          <div style={{ fontSize:11, color:"#c0bbb4", background:"#f0ede6", padding:"3px 11px", borderRadius:20, letterSpacing:0.3 }}>{BASE}</div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"24px 26px" }}>
          <div style={{ background:"#fafaf8", borderRadius:14, border:"1px solid #e8e4dc", padding:"22px 24px", minHeight:"calc(100% - 0px)" }}>
            {active==="dashboard"
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