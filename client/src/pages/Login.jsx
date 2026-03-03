import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
    } catch { setError("Invalid email or password."); }
    finally { setLoading(false); }
  };

  return (
    <div className="pg">
      <div className="blob-tr" /><div className="blob-mid" />
      <div className="card">
        <div className="brand">
          <div className="logo-ring">🏥</div>
          <div className="brand-name">Campus<span>Care</span></div>
          <div className="brand-tag">Campus Health and Issue Portal</div>
        </div>

        {error && <div className="err">{error}</div>}

        <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                value={password} onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused("pw")} onBlur={() => setFocused(null)}
                required autoComplete="current-password" />
              <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="forgot-row">
            <a href="#" className="forgot-lnk">Forgot password?</a>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><div className="spinner" /> Signing in...</> : "Sign In →"}
          </button>
        </form>

        <div className="divider">
          <div className="div-line" />
          <span className="div-txt">New to CampusCare?</span>
          <div className="div-line" />
        </div>
        <Link to="/register" className="outline-btn">Create an Account</Link>
        <div className="card-footer">© 2025 CampusCare · Secure Portal</div>
      </div>
    </div>
  );
};
export default Login;