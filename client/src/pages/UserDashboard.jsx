import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../index.css";

const FILTERS = [
  { key: "All",         label: "All",         cls: "f-all"  },
  { key: "Pending",     label: "Pending",     cls: "f-pend" },
  { key: "In Progress", label: "In Progress", cls: "f-prog" },
  { key: "Resolved",    label: "Resolved",    cls: "f-res"  },
];

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    API.get("/complaints/my").then(r => setComplaints(r.data)).catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const count = (s) => complaints.filter(c => c.status === s).length;
  const visible = filter === "All" ? complaints : complaints.filter(c => c.status === filter);

  return (
    <div className="ud-root">
      <nav className="ud-nav">
        <div className="ud-nav-brand">
          <div className="ud-nav-icon">🏥</div>
          <span className="ud-nav-title">Campus<span>Care</span></span>
        </div>
        <div className="ud-nav-right">
          <span className="ud-greeting">Welcome, <strong>{user?.name}</strong></span>
          <button className="ud-logout-btn" onClick={handleLogout}>↩ Logout</button>
        </div>
      </nav>

      <div className="ud-main">
        <div className="ud-page-header">
          <div className="ud-page-title">My Complaints</div>
          <div className="ud-page-sub">Track and manage all your submitted issues</div>
        </div>

        <div className="ud-stats">
          <div className="ud-stat-card">
            <div className="ud-stat-header">
              <span className="ud-stat-label">Total</span>
              <div className="ud-stat-icon all">📋</div>
            </div>
            <div className="ud-stat-num">{complaints.length}</div>
          </div>
          <div className="ud-stat-card">
            <div className="ud-stat-header">
              <span className="ud-stat-label">Pending</span>
              <div className="ud-stat-icon pend">⏳</div>
            </div>
            <div className="ud-stat-num s-pend">{count("Pending")}</div>
          </div>
          <div className="ud-stat-card">
            <div className="ud-stat-header">
              <span className="ud-stat-label">In Progress</span>
              <div className="ud-stat-icon prog">🔄</div>
            </div>
            <div className="ud-stat-num s-prog">{count("In Progress")}</div>
          </div>
          <div className="ud-stat-card">
            <div className="ud-stat-header">
              <span className="ud-stat-label">Resolved</span>
              <div className="ud-stat-icon res">✅</div>
            </div>
            <div className="ud-stat-num s-res">{count("Resolved")}</div>
          </div>
        </div>

        <div className="ud-toolbar">
          <div className="ud-filters">
            {FILTERS.map(({ key, label, cls }) => (
              <button key={key}
                className={`ud-filter-btn ${filter === key ? cls : ""}`}
                onClick={() => setFilter(key)}>
                {label}
              </button>
            ))}
          </div>
          <button className="ud-new-btn" onClick={() => navigate("/create-complaint")}>
            + New Complaint
          </button>
        </div>

        <div className="ud-section-title">
          {filter === "All" ? "All Complaints" : `${filter} Complaints`}
        </div>

        {visible.length === 0 ? (
          <div className="ud-empty">
            <div className="ud-empty-icon">{filter === "All" ? "📭" : "🔍"}</div>
            <div className="ud-empty-title">No complaints found</div>
            <div className="ud-empty-sub">
              {filter === "All"
                ? "Submit your first complaint to get started."
                : `No complaints with status "${filter}" yet.`}
            </div>
          </div>
        ) : (
          <div className="ud-grid">
            {visible.map(c => (
              <div key={c._id} className="ud-card">
                {c.imageUrl
                  ? <img className="ud-card-img" src={c.imageUrl} alt="Complaint" />
                  : <div className="ud-card-img-ph">🖼️</div>
                }
                <div className="ud-card-body">
                  <div className="ud-card-top">
                    <div className="ud-card-title">{c.title}</div>
                    <span className={`ud-badge ${c.status.replace(" ", "-")}`}>{c.status}</span>
                  </div>
                  <p className="ud-card-desc">{c.description}</p>
                  <div className="ud-card-meta">
                    <span className="ud-chip">🗂️ {c.category}</span>
                    <span className="ud-chip">📅 {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  {c.adminComment && (
                    <div className="ud-comment">
                      <div>
                        <div className="ud-comment-lbl">Admin Response</div>
                        <div className="ud-comment-txt">{c.adminComment}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default UserDashboard;