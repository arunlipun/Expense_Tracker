

// pages/public/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import { toast } from "react-toastify";

/* Same LedgerInput as Login — same design language throughout */
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
          padding: "10px 0",
          fontSize: 15,
          color: "#1a1a2e",
          fontFamily: "'Inter', sans-serif",
          outline: "none",
          boxSizing: "border-box",
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

/* Password strength hint — minimal, useful */
const StrengthHint = ({ password }) => {
  if (!password) return null;
  const len = password.length;
  const score = len < 6 ? 1 : len < 10 ? 2 : 3;
  const labels = ["", "Weak", "Fair", "Strong"];
  const colors = ["", "#E5532D", "#F59E0B", "#16A34A"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: -16, marginBottom: 20 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          height: 3, flex: 1, borderRadius: 2,
          background: i <= score ? colors[score] : "#E5E5E0",
          transition: "background .3s",
        }} />
      ))}
      <span style={{ fontSize: 11, color: colors[score], fontWeight: 600, width: 40 }}>{labels[score]}</span>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     await registerUser(formData);
  //     toast.success("Account created — sign in to continue");
  //     navigate("/login");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Registration failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await registerUser(formData);

    toast.success("OTP sent to your email");
    toast.success(`OTP: ${response.data.data.otp}`);

    navigate("/verify-otp", {
      state: { email: formData.email }
      
    });
    

  } catch (error) {
    console.error(error);
    toast.error("Registration failed");
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

        .reg-submit {
          width: 100%;
          background: #16A34A;
          color: #fff;
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
        .reg-submit:hover:not(:disabled) { background: #15803D; transform: translateY(-1px); }
        .reg-submit:disabled { opacity: .6; cursor: not-allowed; }

        @media (max-width: 768px) {
          .reg-right-panel { padding: 40px 28px !important; border-left: none !important; }
          .reg-left { display: none !important; }
        }
      `}</style>

      {/* ── Form panel (LEFT this time — variation from Login) ───── */}
      <div className="reg-right-panel" style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 64px",
        borderRight: "1px solid rgba(26,26,46,.07)",
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <div style={{
              width: 32, height: 32, background: "#2D5BE3",
              borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>₹</span>
            </div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}>Kharcha</span>
          </div>

          <p style={{
            margin: "0 0 8px",
            fontSize: 11, fontWeight: 700,
            letterSpacing: ".1em", textTransform: "uppercase",
            color: "#16A34A", fontFamily: "'Sora', sans-serif",
          }}>New account</p>
          <h1 style={{
            margin: "0 0 40px",
            fontFamily: "'Sora', sans-serif",
            fontSize: 30, fontWeight: 800,
            color: "#1a1a2e", letterSpacing: "-1px",
          }}>Open your ledger</h1>

          <form onSubmit={handleSubmit}>
            <LedgerInput
              label="Full name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Arjun Sharma"
              autoComplete="name"
            />
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
              autoComplete="new-password"
            />
            <StrengthHint password={formData.password} />

            <button type="submit" className="reg-submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </form>

          <p style={{ marginTop: 28, fontSize: 14, color: "#9CA3AF", textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2D5BE3", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right panel — visual context ────────────────────────── */}
      <div className="reg-left" style={{
        flex: "0 0 44%",
        background: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 56px",
        position: "relative",
        overflow: "hidden",
      }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", left: 0, right: 0,
            top: `${(i + 1) * 5.5}%`, height: 1,
            background: "rgba(255,255,255,0.03)",
          }} />
        ))}

        <div style={{ position: "relative" }}>
          <div style={{ width: 36, height: 2, background: "#16A34A", marginBottom: 24 }} />
          <h2 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 38, fontWeight: 800, color: "#fff",
            lineHeight: 1.12, letterSpacing: "-1px", margin: "0 0 20px",
          }}>
            Start fresh.<br />
            <span style={{ fontWeight: 300, color: "rgba(255,255,255,.4)" }}>Know where it goes.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,.3)", fontSize: 14, lineHeight: 1.75, maxWidth: 280 }}>
            Most people don't know their biggest expense category. You will, after your first week.
          </p>
        </div>

        {/* Simple visual: a donut made of colored segments — category distribution */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: ".12em",
            color: "rgba(255,255,255,.3)", textTransform: "uppercase", marginBottom: 16,
          }}>What others track</div>

          {[
            { label: "Housing",       pct: 34, color: "#F87171" },
            { label: "Food",          pct: 22, color: "#FBBF24" },
            { label: "Transport",     pct: 14, color: "#60A5FA" },
            { label: "Savings",       pct: 20, color: "#4ADE80" },
            { label: "Other",         pct: 10, color: "#A78BFA" },
          ].map(({ label, pct, color }) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>{label}</span>
                <span style={{ fontSize: 12, color, fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>{pct}%</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,.07)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{
          position: "relative",
          borderTop: "1px solid rgba(255,255,255,.08)",
          paddingTop: 20,
          fontSize: 12,
          color: "rgba(255,255,255,.25)",
          lineHeight: 1.6,
        }}>
          Free to use. No credit card. No subscriptions.
        </div>
      </div>
    </div>
  );
};

export default Register;