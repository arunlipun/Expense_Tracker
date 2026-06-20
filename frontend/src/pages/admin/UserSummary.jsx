



import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../api/adminApi";

// ── Balance chip ─────────────────────────────────────────────────────
const BalanceChip = ({ value }) => {
  const num = parseFloat(value);
  const positive = num >= 0;
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 20,
      background: positive ? "#dcfce7" : "#fee2e2",
      color: positive ? "#16a34a" : "#dc2626",
      fontWeight: 700,
      fontSize: 13,
    }}>
      {positive ? "▲" : "▼"} ₹{Math.abs(num).toLocaleString()}
    </span>
  );
};

// ── Empty state ──────────────────────────────────────────────────────
const EmptyState = () => (
  <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
    <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: "#64748b" }}>No users found</p>
    <p style={{ margin: "4px 0 0", fontSize: 13 }}>User data will appear here once available.</p>
  </div>
);

// ── Avatar initials ──────────────────────────────────────────────────
const Avatar = ({ name }) => {
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  const hue = (name?.charCodeAt(0) || 0) * 47 % 360;
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: `hsl(${hue},65%,55%)`,
      color: "#fff", fontWeight: 700, fontSize: 14,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>{initials}</div>
  );
};

// ════════════════════════════════════════════════════════════════════
const UserSummary = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await getAdminDashboard();
      setUsers(res.data.data.userWiseSummary);
    } catch (error) {
      console.log(error);
    }
  };

  // ── Totals ───────────────────────────────────────────────────────
  const totalIncome = users.reduce((s, u) => s + (u.totalIncome || 0), 0);
  const totalExpense = users.reduce((s, u) => s + (u.totalExpense || 0), 0);
  const totalTxns = users.reduce((s, u) => s + (u.totalTransactions || 0), 0);

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "32px 24px 48px" }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "#94a3b8", letterSpacing: ".08em", textTransform: "uppercase" }}>
          Users
        </p>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-.5px" }}>
          User Summary
        </h1>
      </div>

      {/* ── Quick stats ─────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))",
        gap: 14,
        marginBottom: 24,
      }}>
        {[
          { label: "Total Users",    value: users.length,                        icon: "👥", accent: "#6366f1" },
          { label: "Combined Income",  value: `₹${totalIncome.toLocaleString()}`, icon: "💰", accent: "#10b981" },
          { label: "Combined Expense", value: `₹${totalExpense.toLocaleString()}`,icon: "📤", accent: "#f43f5e" },
          { label: "Total Transactions", value: totalTxns,                       icon: "📋", accent: "#f59e0b" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#fff",
            borderRadius: 14,
            padding: "18px 20px",
            boxShadow: "0 1px 3px rgba(0,0,0,.06)",
            borderTop: `3px solid ${s.accent}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "#94a3b8" }}>{s.label}</span>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.accent }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      <div style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)",
        overflow: "hidden",
      }}>
        {users.length === 0 ? <EmptyState /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["User", "Email", "Income", "Expense", "Net Balance", "Transactions", "Subscription",
  "Plan"].map(h => (
                    <th key={h} style={{
                      padding: "12px 16px", textAlign: "left",
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: ".07em", textTransform: "uppercase",
                      color: "#94a3b8", borderBottom: "1px solid #f1f5f9",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId}
                    style={{ transition: "background .1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    {/* User col with avatar */}
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={user.userName} />
                        <span style={{ fontWeight: 600, color: "#1e293b" }}>{user.userName}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#64748b", borderBottom: "1px solid #f1f5f9" }}>{user.email}</td>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#10b981", borderBottom: "1px solid #f1f5f9" }}>
                      ₹{user.totalIncome?.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#f43f5e", borderBottom: "1px solid #f1f5f9" }}>
                      ₹{user.totalExpense?.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                      <BalanceChip value={user.netBalance} />
                    </td>
                    <td style={{ padding: "14px 16px", color: "#1e293b", fontWeight: 600, borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{
                        display: "inline-block", minWidth: 32,
                        padding: "3px 10px", borderRadius: 8,
                        background: "#f1f5f9", textAlign: "center",
                      }}>
                        {user.totalTransactions}
                      </span>
                    </td>
                    <td
  style={{
    padding: "14px 16px",
    borderBottom: "1px solid #f1f5f9",
  }}
>
  <span
    style={{
      background: user.premiumUser ? "#dcfce7" : "#fee2e2",
      color: user.premiumUser ? "#16a34a" : "#dc2626",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "700",
    }}
  >
    {user.premiumUser ? "Premium" : "Free"}
  </span>
</td>

<td
  style={{
    padding: "14px 16px",
    borderBottom: "1px solid #f1f5f9",
  }}
>
  <span
    style={{
      background: "#eff6ff",
      color: "#2563eb",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "700",
    }}
  >
    {user.planType}
  </span>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSummary;