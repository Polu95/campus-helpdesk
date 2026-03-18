import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../index.css";

const FILTERS = [
  { key: "All", label: "All", cls: "f-all" },
  { key: "Pending", label: "Pending", cls: "f-pend" },
  { key: "In Progress", label: "In Progress", cls: "f-prog" },
  { key: "Resolved", label: "Resolved", cls: "f-res" },
];

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // ✅ NEW STATE FOR COUNTS
  const [counts, setCounts] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("user"));

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/complaints?page=${page}&limit=5&status=${filter}`
      );

      setComplaints(res.data.complaints);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.total);

      // ✅ IMPORTANT
      setCounts(res.data.counts);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, filter]);

  const handleUpdate = async (id, status, comment) => {
    try {
      await API.put(`/complaints/${id}`, { status, adminComment: comment });
      fetchComplaints();
    } catch (e) {
      console.error(e);
      alert("Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const visible = complaints;

  return (
    <div className="ud-root">
      <nav className="ud-nav">
        <div className="ud-nav-brand">
          <div className="ud-nav-icon">🏥</div>
          <span className="ud-nav-title">
            Campus<span>Care</span>
            <span className="ad-nav-badge">Admin</span>
          </span>
        </div>
        <div className="ud-nav-right">
          <span className="ud-greeting">
            Hello, <strong>{admin?.name}</strong>
          </span>
          <button className="ud-logout-btn" onClick={handleLogout}>
            ↩ Logout
          </button>
        </div>
      </nav>

      <div className="ud-main">
        <div className="ud-page-header">
          <div className="ud-page-title">Complaint Management</div>
          <div className="ud-page-sub">
            Review, respond and resolve all campus complaints
          </div>
        </div>

        {/* ✅ CORRECT STATS */}
        <div className="ud-stats">
          <div className="ud-stat-card">
            <div className="ud-stat-header">
              <span className="ud-stat-label">Total</span>
              <div className="ud-stat-icon all">📋</div>
            </div>
            <div className="ud-stat-num">{totalCount}</div>
          </div>

          <div className="ud-stat-card">
            <div className="ud-stat-header">
              <span className="ud-stat-label">Pending</span>
              <div className="ud-stat-icon pend">⏳</div>
            </div>
            <div className="ud-stat-num s-pend">{counts.pending}</div>
          </div>

          <div className="ud-stat-card">
            <div className="ud-stat-header">
              <span className="ud-stat-label">In Progress</span>
              <div className="ud-stat-icon prog">🔄</div>
            </div>
            <div className="ud-stat-num s-prog">{counts.inProgress}</div>
          </div>

          <div className="ud-stat-card">
            <div className="ud-stat-header">
              <span className="ud-stat-label">Resolved</span>
              <div className="ud-stat-icon res">✅</div>
            </div>
            <div className="ud-stat-num s-res">{counts.resolved}</div>
          </div>
        </div>

        {/* FILTER */}
        <div className="ud-toolbar">
          <div className="ud-filters">
            {FILTERS.map(({ key, label, cls }) => (
              <button
                key={key}
                className={`ud-filter-btn ${filter === key ? cls : ""}`}
                onClick={() => {
                  setFilter(key);
                  setPage(1);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="ud-section-title">
          {filter === "All"
            ? "All Complaints"
            : `${filter} Complaints`}
        </div>

        {loading && (
          <div className="ad-loading">
            <div className="ad-spinner" />
            <span>Loading complaints…</span>
          </div>
        )}

        {!loading && visible.length === 0 && (
          <div className="ud-empty">
            <div className="ud-empty-icon">🔍</div>
            <div className="ud-empty-title">No complaints found</div>
            <div className="ud-empty-sub">No complaints available.</div>
          </div>
        )}

        {!loading && visible.length > 0 && (
          <div className="ad-grid">
            {visible.map((c) => (
              <ComplaintCard
                key={c._id}
                complaint={c}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && complaints.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" }}>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Prev
            </button>

            <span>
              Page {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ComplaintCard = ({ complaint, onUpdate }) => {
  const [status, setStatus] = useState(complaint.status);
  const [comment, setComment] = useState(complaint.adminComment || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isNew =
    complaint.status === "Pending" && !complaint.adminComment;

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(complaint._id, status, comment);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className={`ad-card${isNew ? " ad-card-new" : ""}`}>
      {isNew && <div className="ad-new-ribbon">NEW</div>}

      {complaint.imageUrl ? (
        <img className="ud-card-img" src={complaint.imageUrl} alt="Complaint" />
      ) : (
        <div className="ud-card-img-ph">🖼️</div>
      )}

      <div className="ud-card-body">
        <div className="ud-card-top">
          <div className="ud-card-title">{complaint.title}</div>
          <span className={`ud-badge ${complaint.status.replace(" ", "-")}`}>
            {complaint.status}
          </span>
        </div>

        <p className="ud-card-desc">{complaint.description}</p>

        <div className="ud-card-meta">
          <span className="ud-chip">
            👤 {complaint.createdBy?.name || "Unknown"}
          </span>
          {complaint.category && (
            <span className="ud-chip">🗂️ {complaint.category}</span>
          )}
          <span className="ud-chip">
            📅 {new Date(complaint.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="ad-controls">
          <div className="ad-ctrl-row">
            <label className="ad-ctrl-label">Update Status</label>
            <select
              className={`ad-select ad-sel-${status.replace(" ", "-")}`}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">⏳ Pending</option>
              <option value="In Progress">🔄 In Progress</option>
              <option value="Resolved">✅ Resolved</option>
            </select>
          </div>

          <div className="ad-ctrl-row">
            <label className="ad-ctrl-label">Admin Comment</label>
            <textarea
              className="ad-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <button
            className={`ad-save-btn${saved ? " ad-saved" : ""}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;