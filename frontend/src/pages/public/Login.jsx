

// pages/public/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/authApi.js";
import { toast } from "react-toastify";

/* ─── Design tokens (same system as Home) ──────────────────────────
   Ground: #FAFAF7  Ink: #1a1a2e  Rule: #2D5BE3  Muted: #6B7280
   Signature on this page: the form fields have an animated ink-fill
   bottom border instead of a box — feels like writing in a ledger.
──────────────────────────────────────────────────────────────────── */

const LedgerInput = ({ label, type, name, value, onChange, placeholder, autoComplete }) => (
  <div style={{ marginBottom: 24 }}>
    <label style={{
      display: "block",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: "#9CA3AF",
      marginBottom: 8,
      fontFamily: "'Sora', sans-serif",
    }}>{label}</label>
    <div style={{ position: "relative" }}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          borderBottom: "1.5px solid #E5E5E0",
          padding: "10px 0 10px 0",
          fontSize: 15,
          color: "#1a1a2e",
          fontFamily: "'Inter', sans-serif",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color .2s",
        }}
        onFocus={e => {
          e.target.style.borderBottomColor = "#2D5BE3";
          e.target.nextSibling.style.transform = "scaleX(1)";
        }}
        onBlur={e => {
          e.target.style.borderBottomColor = "#E5E5E0";
          e.target.nextSibling.style.transform = "scaleX(0)";
        }}
      />
      {/* Animated blue fill rule — the ledger ink signature */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0,
        width: "100%", height: 2,
        background: "#2D5BE3",
        transformOrigin: "left center",
        transform: "scaleX(0)",
        transition: "transform .25s cubic-bezier(.4,0,.2,1)",
        pointerEvents: "none",
      }} />
    </div>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
     const startTime = performance.now();
    try {
      const response = await loginUser(formData);
       const endTime = performance.now();

    console.log(
      `Login API Time: ${(endTime - startTime).toFixed(2)} ms`
    );
      const data = response.data.data;
      


     

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("roles", JSON.stringify(data.roles));
      localStorage.setItem("userId", data.userId);

      

      if (data.roles.includes("ROLE_ADMIN")) {
        navigate("/admin/dashboard");
        toast.success("Admin Login Successful");
      } else {
        toast.success("User Login Successful");
        navigate("/dashboard");
        localStorage.getItem("premiumUser")
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAF7",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      alignItems: "stretch",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

        .login-submit {
          width: 100%;
          background: #1a1a2e;
          color: #FAFAF7;
          border: none;
          padding: 15px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: .05em;
          border-radius: 4px;
          cursor: pointer;
          transition: background .2s, transform .15s;
          margin-top: 8px;
        }
        .login-submit:hover:not(:disabled) { background: #2D5BE3; transform: translateY(-1px); }
        .login-submit:disabled { opacity: .6; cursor: not-allowed; }

        @media (max-width: 768px) {
          .login-left { display: none !important; }
          .login-right { border-left: none !important; padding: 40px 28px !important; }
        }
      `}</style>

      {/* ── Left panel — sparse, typographic, no gradient ───────── */}
      <div className="login-left" style={{
        flex: "0 0 44%",
        background: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 56px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle ruled lines on dark ground */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: 0, right: 0,
            top: `${(i + 1) * 5.5}%`,
            height: 1,
            background: "rgba(255,255,255,0.03)",
          }} />
        ))}

        {/* Logo */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: "#2D5BE3",
            borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>₹</span>
          </div>
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", letterSpacing: "-.2px" }}>
            Kharcha
          </span>
        </div>

        {/* Center copy */}
        <div style={{ position: "relative" }}>
          <div style={{ width: 36, height: 2, background: "#2D5BE3", marginBottom: 24 }} />
          <h2 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 38, fontWeight: 800,
            color: "#fff", lineHeight: 1.12,
            letterSpacing: "-1px", margin: "0 0 20px",
          }}>
            Back to<br />
            <span style={{ fontWeight: 300, color: "rgba(255,255,255,.45)" }}>your ledger.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,.35)", fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
            Your entries are waiting. Pick up exactly where you left off.
          </p>
        </div>

        {/* Bottom month summary */}
        <div style={{
          position: "relative",
          borderTop: "1px solid rgba(255,255,255,.08)",
          paddingTop: 24,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", color: "rgba(255,255,255,.3)", textTransform: "uppercase", marginBottom: 14 }}>
            June at a glance
          </div>
          {[
            { label: "Income logged",  val: "₹73,000", color: "#4ADE80" },
            { label: "Spent so far",   val: "₹41,350", color: "#F87171" },
            { label: "On track",       val: "₹31,650", color: "#60A5FA" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.4)", fontWeight: 400 }}>{label}</span>
              <span style={{ fontSize: 13, color, fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — the form ───────────────────────────────── */}
      <div className="login-right" style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 64px",
        borderLeft: "1px solid rgba(26,26,46,.07)",
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          {/* Heading */}
          <div style={{ marginBottom: 44 }}>
            <p style={{
              margin: "0 0 8px",
              fontSize: 11, fontWeight: 700,
              letterSpacing: ".1em", textTransform: "uppercase",
              color: "#2D5BE3", fontFamily: "'Sora', sans-serif",
            }}>Sign in</p>
            <h1 style={{
              margin: 0,
              fontFamily: "'Sora', sans-serif",
              fontSize: 30, fontWeight: 800,
              color: "#1a1a2e", letterSpacing: "-1px",
            }}>Welcome back</h1>
          </div>

          {/* Fields */}
          <form onSubmit={handleSubmit}>
            <LedgerInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <LedgerInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>

          <p style={{ marginTop: 28, fontSize: 14, color: "#9CA3AF", textAlign: "center" }}>
            New here?{" "}
            <Link to="/register" style={{ color: "#2D5BE3", fontWeight: 600, textDecoration: "none" }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;