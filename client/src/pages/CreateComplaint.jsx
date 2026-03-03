import { useState, useRef } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../index.css";

const CATEGORIES = [
  "Infrastructure",
  "Hygiene and Sanitation",
  "Electrical / Lighting",
  "Water Supply",
  "Internet / Wi-Fi",
  "Security",
  "Noise / Disturbance",
  "Classroom Facilities",
  "Hostel / Accommodation",
  "Other",
];

const CreateComplaint = () => {
  const navigate     = useNavigate();
  const fileInputRef = useRef(null);
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [category,    setCategory]    = useState("");
  const [image,       setImage]       = useState(null);
  const [preview,     setPreview]     = useState(null);
  const [dragging,    setDragging]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [error,       setError]       = useState("");

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const removeFile = () => {
    setImage(null); setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("category", category);
    if (image) fd.append("image", image);
    try {
      await API.post("/complaints", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(true);
      setTimeout(() => navigate("/user-dashboard"), 1800);
    } catch (err) {
      console.error(err); setError("Failed to submit. Please try again.");
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="cc-root">
      <div className="cc-success-wrap">
        <div className="cc-success-icon">✅</div>
        <div className="cc-success-title">Complaint Submitted!</div>
        <div className="cc-success-sub">Redirecting to your dashboard...</div>
      </div>
    </div>
  );

  return (
    <div className="cc-root">
      <div className="cc-topbar">
        <button className="cc-back-btn" type="button" onClick={() => navigate("/user-dashboard")}>
          ← Back
        </button>
        <div className="cc-topbar-brand">
          <div className="ud-nav-icon" style={{width:32,height:32,fontSize:16}}>🏥</div>
          <span className="ud-nav-title" style={{fontSize:16}}>Campus<span>Care</span></span>
        </div>
        <div style={{width:80}} />
      </div>

      <div className="cc-page">
        <h1 className="cc-main-title">Create Complaint</h1>
        <p className="cc-main-sub">Describe your issue and we will route it to the right team</p>

        {error && <div className="err cc-err">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="cc-card">
            <p className="cc-card-heading">Upload Image</p>
            <p className="cc-card-sub">Attach a photo of the issue (optional)</p>
            {!image ? (
              <div
                className={"cc-dropzone" + (dragging ? " cc-dz-over" : "")}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}>
                <div className="cc-dz-icon-box">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p className="cc-dz-title">Drag and drop image here</p>
                <p className="cc-dz-hint">or click to select a file</p>
              </div>
            ) : (
              <div className="cc-file-row">
                {preview
                  ? <img src={preview} className="cc-file-thumb" alt="preview" />
                  : <div className="cc-file-doc">📄</div>
                }
                <div className="cc-file-meta">
                  <span className="cc-file-name">{image.name}</span>
                  <span className="cc-file-size">{(image.size/1024).toFixed(1)} KB</span>
                </div>
                <button type="button" className="cc-file-rm" onClick={removeFile}>✕</button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*"
              style={{display:"none"}} onChange={(e) => handleFile(e.target.files[0])} />
          </div>

          <div className="cc-card">
            <p className="cc-card-heading">Details</p>
            <p className="cc-card-sub">Provide information about your complaint</p>

            <div className="cc-field">
              <label className="cc-label">Title</label>
              <input className="cc-input" type="text"
                placeholder="Brief title of the issue"
                value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="cc-field">
              <label className="cc-label">Description</label>
              <textarea className="cc-input"
                placeholder="Describe the issue in detail..."
                value={description} onChange={(e) => setDescription(e.target.value)}
                rows={5} required />
            </div>

            <div className="cc-field" style={{marginBottom:0}}>
              <label className="cc-label">Category</label>
              <select className="cc-input"
                value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="cc-submit-btn" disabled={loading}>
            {loading
              ? <><div className="cc-btn-spin" /> Submitting...</>
              : "Submit Complaint"
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;