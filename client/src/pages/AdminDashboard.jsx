import { useEffect, useState } from "react";
import API from "../api/axios";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdate = async (id, status, comment) => {
    try {
      await API.put(`/complaints/${id}`, {
        status,
        adminComment: comment,
      });

      fetchComplaints(); // Refresh data
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {complaints.map((c) => (
        <ComplaintCard
          key={c._id}
          complaint={c}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
};

const ComplaintCard = ({ complaint, onUpdate }) => {
  const [status, setStatus] = useState(complaint.status);
  const [comment, setComment] = useState(complaint.adminComment || "");

  return (
    <div style={{ border: "1px solid gray", margin: "15px", padding: "10px" }}>
      <h3>{complaint.title}</h3>
      <p>{complaint.description}</p>

      <p>
        <strong>User:</strong> {complaint.createdBy?.name}
      </p>

      <p>
        <strong>Current Status:</strong>{" "}
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

      <img src={complaint.imageUrl} width="200" alt="complaint" />

      <hr />

      <label>Status:</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
      </select>

      <br />

      <label>Admin Comment:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <br />

      <button onClick={() => onUpdate(complaint._id, status, comment)}>
        Update
      </button>
    </div>
  );
};

export default AdminDashboard;