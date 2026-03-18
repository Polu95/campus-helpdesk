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

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [counts, setCounts] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchComplaints = async () => {
    try {
      const res = await API.get(
        `/complaints/my?page=${page}&limit=5&status=${filter}`
      );

      console.log("API RESPONSE:", res.data);

      setComplaints(res.data?.complaints || []);
      setTotalPages(res.data?.totalPages || 1);
      setTotalCount(res.data?.total || 0);

      setCounts(
        res.data?.counts || {
          pending: 0,
          inProgress: 0,
          resolved: 0,
        }
      );

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FIXED (added filter)
  useEffect(() => {
    fetchComplaints();
  }, [page, filter]);

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
          </span>
        </div>
        <div className="ud-nav-right">
          <span className="ud-greeting">
            Welcome, <strong>{user?.name}</strong>
          </span>
          <button className="ud-logout-btn" onClick={handleLogout}>
            ↩ Logout
          </button>
        </div>
      </nav>

      <div className="ud-main">
        <div className="ud-page-header">
          <div className="ud-page-title">My Complaints</div>
          <div className="ud-page-sub">
            Track and manage all your submitted issues
          </div>
        </div>

        {/* STATS */}
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
            <div className="ud-stat-num s-pend">
              {counts?.pending || 0}
            </div>
          </div>

          <div className="ud-stat-card">
            <div className="ud-stat-header">
              <span className="ud-stat-label">In Progress</span>
              <div className="ud-stat-icon prog">🔄</div>
            </div>
            <div className="ud-stat-num s-prog">
              {counts?.inProgress || 0}
            </div>
          </div>

          <div className="ud-stat-card">
            <div className="ud-stat-header">
              <span className="ud-stat-label">Resolved</span>
              <div className="ud-stat-icon res">✅</div>
            </div>
            <div className="ud-stat-num s-res">
              {counts?.resolved || 0}
            </div>
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
                  setPage(1); // reset page
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            className="ud-new-btn"
            onClick={() => navigate("/create-complaint")}
          >
            + New Complaint
          </button>
        </div>

        <div className="ud-section-title">
          {filter === "All"
            ? "All Complaints"
            : `${filter} Complaints`}
        </div>

        {visible.length === 0 ? (
          <div className="ud-empty">
            <div className="ud-empty-icon">
              {filter === "All" ? "📭" : "🔍"}
            </div>
            <div className="ud-empty-title">No complaints found</div>
            <div className="ud-empty-sub">No complaints available.</div>
          </div>
        ) : (
          <div className="ud-grid">
            {visible.map((c) => (
              <div key={c._id} className="ud-card">
                {c.imageUrl ? (
                  <img className="ud-card-img" src={c.imageUrl} alt="Complaint" />
                ) : (
                  <div className="ud-card-img-ph">🖼️</div>
                )}

                <div className="ud-card-body">
                  <div className="ud-card-top">
                    <div className="ud-card-title">{c.title}</div>
                    <span className={`ud-badge ${c.status.replace(" ", "-")}`}>
                      {c.status}
                    </span>
                  </div>

                  <p className="ud-card-desc">{c.description}</p>

                  <div className="ud-card-meta">
                    <span className="ud-chip">🗂️ {c.category}</span>
                    <span className="ud-chip">
                      📅 {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {c.adminComment && (
                    <div className="ud-comment">
                      <div>
                        <div className="ud-comment-lbl">Admin Response</div>
                        <div className="ud-comment-txt">
                          {c.adminComment}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {complaints.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" }}>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Prev
            </button>

            <span>Page {page} / {totalPages}</span>

            <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;