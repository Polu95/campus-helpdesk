import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true); setError("");
    try {
      await register(name, email, password);
      navigate("/");
    } catch { setError("Registration failed. Please try again."); }
    finally { setLoading(false); }
  };

  const getPwStrength = (pw) => {
    if (!pw) return null;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return [null,
      { label: "Weak",   color: "#EF4444", w: "25%" },
      { label: "Fair",   color: "#F59E0B", w: "50%" },
      { label: "Good",   color: "#4A90E2", w: "75%" },
      { label: "Strong", color: "#10B981", w: "100%" },
    ][s];
  };
  const pwStr = getPwStrength(password);

  return (
    <div className="pg">
      <div className="blob-side" /><div className="blob-tl" />
      <div className="card">
        <div className="brand">
          <div className="logo-ring">🏥</div>
          <div className="brand-name">Campus<span>Care</span></div>
          <div className="brand-tag">Create your account</div>
        </div>

        {error && <div className="err">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={`fld ${focused === "name" ? "focused" : ""}`}>
            <label className="fld-label">Full Name</label>
            <div className={`fld-inner ${focused === "name" ? "active" : ""}`}>
              <span className="fld-ico">👤</span>
              <input className="fld-inp" type="text" placeholder="Your full name"
                value={name} onChange={e => setName(e.target.value)}
                onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                required autoComplete="name" />
            </div>
          </div>

          <div className={`fld ${focused === "email" ? "focused" : ""}`}>
            <label className="fld-label">Email Address</label>
            <div className={`fld-inner ${focused === "email" ? "active" : ""}`}>
              <span className="fld-ico">✉️</span>
              <input className="fld-inp" type="email" placeholder="you@university.edu"
                value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                required autoComplete="email" />
            </div>
          </div>

          <div className={`fld ${focused === "pw" ? "focused" : ""}`}>
            <label className="fld-label">Password</label>
            <div className={`fld-inner ${focused === "pw" ? "active" : ""}`}>
              <span className="fld-ico">🔒</span>
              <input className="fld-inp" type={showPw ? "text" : "password"}
                placeholder="Create a strong password"
                value={password} onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused("pw")} onBlur={() => setFocused(null)}
                required autoComplete="new-password" />
              <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
            {pwStr && (
              <>
                <div className="pw-bar-wrap">
                  <div className="pw-bar-fill" style={{ width: pwStr.w, background: pwStr.color }} />
                </div>
                <div className="pw-hint" style={{ color: pwStr.color }}>{pwStr.label} password</div>
              </>
            )}
          </div>

          <div className="chk-row">
            <div className={`chk-box ${agreed ? "on" : ""}`}
              onClick={() => setAgreed(!agreed)}
              role="checkbox" aria-checked={agreed} tabIndex={0}
              onKeyDown={e => e.key === " " && setAgreed(!agreed)}>
              {agreed && <span className="chk-tick">✓</span>}
            </div>
            <span className="chk-lbl">
              I agree to the <a href="#">Terms of Service</a> &amp; <a href="#">Privacy Policy</a>
            </span>
          </div>

          <button type="submit" className="submit-btn" disabled={loading || !agreed}>
            {loading ? <><div className="spinner" /> Creating...</> : "Create Account →"}
          </button>
        </form>

        <div className="divider">
          <div className="div-line" />
          <span className="div-txt">Already have an account?</span>
          <div className="div-line" />
        </div>
        <Link to="/" className="outline-btn">Sign In Instead</Link>
        <div className="card-footer">© 2025 CampusCare · Secure Registration</div>
      </div>
    </div>
  );
};
export default Register;