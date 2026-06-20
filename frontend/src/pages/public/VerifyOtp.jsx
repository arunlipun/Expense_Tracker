import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../api/authApi";
import { toast } from "react-toastify";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <div style={styles.center}>
        <h3 style={{ color: "#fff" }}>No email found. Please register again.</h3>
      </div>
    );
  }

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      toast.success("Account verified successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email });
      toast.success("OTP resent successfully");
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div style={styles.page}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        `}
      </style>

      <div style={styles.card}>
        <div style={styles.glow}></div>

        <h2 style={styles.title}>Verify Your Account</h2>
        <p style={styles.sub}>
          OTP sent to <b>{email}</b>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          style={styles.input}
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button onClick={handleResend} style={styles.linkBtn}>
          Resend OTP
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
    fontFamily: "'Inter', sans-serif",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
  },

  card: {
    width: 360,
    padding: 30,
    borderRadius: 16,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.15)",
    position: "relative",
    color: "#fff",
    textAlign: "center",
  },

  glow: {
    position: "absolute",
    top: "-40px",
    left: "50%",
    transform: "translateX(-50%)",
    width: 120,
    height: 120,
    background: "#2D5BE3",
    filter: "blur(80px)",
    opacity: 0.6,
    zIndex: 0,
  },

  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 22,
    marginBottom: 8,
  },

  sub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(0,0,0,0.3)",
    color: "#fff",
    outline: "none",
    textAlign: "center",
    fontSize: 16,
    letterSpacing: "4px",
    marginBottom: 20,
  },

  button: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(90deg, #2D5BE3, #7C3AED)",
    color: "#fff",
    fontWeight: 600,
    marginBottom: 12,
    transition: "0.3s",
  },

  linkBtn: {
    background: "transparent",
    border: "none",
    color: "#60A5FA",
    cursor: "pointer",
    fontSize: 13,
  },
};

export default VerifyOtp;