import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/my");
      setComplaints(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <h2>Welcome {user?.name}</h2>

      <button onClick={() => navigate("/create-complaint")}>
        Create Complaint
      </button>

      <button onClick={handleLogout}>Logout</button>

      <h3>My Complaints</h3>

      {complaints.length === 0 && <p>No complaints yet.</p>}

    {complaints.map((complaint) => (
      <div
        key={complaint._id}
        style={{
          border: "1px solid gray",
          margin: "10px",
          padding: "10px",
        }}
      >
        <h4>{complaint.title}</h4>
        <p>{complaint.description}</p>

        <p>
          <strong>Category:</strong> {complaint.category}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span
            style={{
              color:
                complaint.status === "Pending"
                  ? "orange"
                  : complaint.status === "In Progress"
                  ? "blue"
                  : "green",
            }}
          >
            {complaint.status}
          </span>
        </p>

        {/* ✅ Admin Comment Added Here */}
        {complaint.adminComment && (
          <p>
            <strong>Admin Comment:</strong> {complaint.adminComment}
          </p>
        )}

        <img
          src={complaint.imageUrl}
          alt="Complaint"
          width="200"
        />
      </div>
      ))}
    </div>
  );
};

export default UserDashboard;