

// pages/user/Dashboard.jsx
import { useEffect, useState } from "react";
import { getUserDashboard } from "../../api/dashboardApi";
import PremiumModal from "../../components/PremiumUpgradeModal";
import PremiumUpgradeModal from "../../components/PremiumUpgradeModal";

/* ─── Shared tokens (Ledger system) ───────────────────────────────
   Ground #FAFAF7 · Ink #1a1a2e · Rule #2D5BE3
   Green #16A34A · Red #E5532D · Purple #7C3AED
   Type: Sora (display) / Inter (body)
──────────────────────────────────────────────────────────────────── */

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');`;

// ── Stat card ────────────────────────────────────────────────────────
const StatCard = ({ label, value, accent, icon }) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid rgba(26,26,46,.07)",
      borderTop: `3px solid ${accent}`,
      borderRadius: 10,
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      transition: "transform .15s, box-shadow .15s",
      cursor: "default",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 6px 24px rgba(26,26,46,.08)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "";
      e.currentTarget.style.boxShadow = "";
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
        textTransform: "uppercase", color: "#9CA3AF",
        fontFamily: "'Sora', sans-serif",
      }}>{label}</span>
      <span style={{ fontSize: 20 }}>{icon}</span>
    </div>
    <span style={{
      fontFamily: "'Sora', sans-serif",
      fontSize: 26, fontWeight: 800,
      color: accent, letterSpacing: "-.5px",
    }}>{value}</span>
  </div>
);

// ── Type badge ───────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const isIncome = type === "INCOME";
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 9px",
      borderRadius: 20,
      fontSize: 11, fontWeight: 700,
      letterSpacing: ".03em",
      background: isIncome ? "#DCFCE7" : "#FEE2E2",
      color: isIncome ? "#16A34A" : "#E5532D",
      fontFamily: "'Sora', sans-serif",
    }}>
      {isIncome ? "▲" : "▼"} {type}
    </span>
  );
};

// ── Section heading ──────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "36px 0 18px" }}>
    <div style={{ width: 4, height: 18, background: "#2D5BE3", borderRadius: 4 }} />
    <h2 style={{
      margin: 0, fontFamily: "'Sora', sans-serif",
      fontSize: 16, fontWeight: 700, color: "#1a1a2e", letterSpacing: "-.2px",
    }}>{children}</h2>
  </div>
);

// ── Table wrapper ────────────────────────────────────────────────────
const TableWrap = ({ heads, children, emptyMsg = "No data" }) => (
  <div style={{
    background: "#fff",
    border: "1px solid rgba(26,26,46,.07)",
    borderRadius: 10,
    overflow: "hidden",
  }}>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#F5F5F2" }}>
            {heads.map(h => (
              <th key={h} style={{
                padding: "11px 16px", textAlign: "left",
                fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
                textTransform: "uppercase", color: "#9CA3AF",
                borderBottom: "1px solid rgba(26,26,46,.06)",
                fontFamily: "'Sora', sans-serif",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  </div>
);

// ── Table row ────────────────────────────────────────────────────────
const TR = ({ cells }) => (
  <tr
    style={{ transition: "background .1s", borderBottom: "1px solid rgba(26,26,46,.04)" }}
    onMouseEnter={e => e.currentTarget.style.background = "#FAFAF7"}
    onMouseLeave={e => e.currentTarget.style.background = ""}
  >
    {cells.map((c, i) => (
      <td key={i} style={{ padding: "13px 16px", color: "#374151", verticalAlign: "middle" }}>{c}</td>
    ))}
  </tr>
);

// ── Skeleton ─────────────────────────────────────────────────────────
const Skeleton = () => (
  <div style={{ padding: "40px 32px", fontFamily: "'Inter', sans-serif" }}>
    <div style={{ height: 28, width: 200, background: "#F0F0EC", borderRadius: 6, marginBottom: 32, animation: "skpulse 1.4s infinite" }} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{ height: 90, background: "#F0F0EC", borderRadius: 10, animation: "skpulse 1.4s infinite" }} />
      ))}
    </div>
    <style>{`@keyframes skpulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
  </div>
);

// ════════════════════════════════════════════════════════════════════
const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
const isPremium = dashboard?.premiumUser === true;


  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const response = await getUserDashboard();
      const data = response.data.data;

      localStorage.setItem(
  "premiumUser",
  JSON.stringify(data.premiumUser || false)
);

localStorage.setItem(
  "isPremium",
  data.premiumUser ? "true" : "false"
);

localStorage.setItem(
  "premiumPlan",
  data.planType || "FREE"
);

      setDashboard(data);

      // 🔥 PREMIUM LOGIC HERE
      if (data.expensePercentage > 85) {
  setShowPremiumAlert(true);
} else {
  setShowPremiumAlert(false);
}

    } catch (error) {
      console.log(error);
    }
  };

  fetchDashboard();
}, []);


useEffect(() => {
  if (dashboard?.expensePercentage > 85) {
    setShowPremiumAlert(true);
  } else {
    setShowPremiumAlert(false);
  }
}, [dashboard?.expensePercentage]);

  if (!dashboard) return <Skeleton />;

  const stats = [
    { label: "Total Income",       value: `₹${dashboard.totalIncome?.toLocaleString()}`,       accent: "#16A34A", icon: "💰" },
    { label: "Total Expense",      value: `₹${dashboard.totalExpense?.toLocaleString()}`,      accent: "#E5532D", icon: "📤" },
    { label: "Balance",            value: `₹${dashboard.balance?.toLocaleString()}`,           accent: "#2D5BE3", icon: "🏦" },
    { label: "Total Transactions", value: dashboard.totalTransactions,                         accent: "#7C3AED", icon: "📋" },
  ];

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: "#FAFAF7",
      minHeight: "100vh",
      padding: "32px 28px 56px",
    }}>
      <style>{`${FONTS}
        @media(max-width:640px){
          .dash-grid{grid-template-columns:repeat(2,1fr)!important;}
          .dash-grid-cat{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* ── Page header ─────────────────────────────────────────── */}
{showPremiumAlert && !isPremium && (
  <div
    style={{
      margin: "20px 0",
      padding: "20px",
      borderRadius: "18px",
      background:
        "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)",
      color: "#fff",
      boxShadow: "0 10px 30px rgba(124,58,237,.25)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div style={{ fontSize: 26, marginBottom: 8 }}>
      💎 Premium Insights Available
    </div>

    <div
      style={{
        fontSize: 15,
        opacity: 0.95,
        lineHeight: 1.7,
      }}
    >
      You have already used{" "}
      <strong>{dashboard.expensePercentage?.toFixed(1)}%</strong>
      {" "}of your income.
      <br />
      Unlock AI-powered spending analysis, smart savings suggestions,
      and budget alerts.
    </div>

    <button
      onClick={() => setShowModal(true)}
      style={{
        marginTop: 16,
        background: "#fff",
        color: "#7C3AED",
        border: "none",
        padding: "12px 20px",
        borderRadius: 12,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      Upgrade to Premium →
    </button>
  </div>
)}


      <div style={{ marginBottom: 28 }}>
        <p style={{
          margin: "0 0 4px", fontSize: 11, fontWeight: 700,
          letterSpacing: ".1em", textTransform: "uppercase",
          color: "#2D5BE3", fontFamily: "'Sora', sans-serif",
        }}>Overview</p>
        <h1 style={{
          margin: 0, fontFamily: "'Sora', sans-serif",
          fontSize: 26, fontWeight: 800, color: "#1a1a2e", letterSpacing: "-.5px",
        }}>My Dashboard</h1>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────── */}
      <div className="dash-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 14,
      }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>


<div
  style={{
    marginTop: 20,
    padding: "14px 18px",
    borderRadius: 12,
    background:
      dashboard.expensePercentage <= 70
        ? "#DCFCE7"
        : dashboard.expensePercentage <= 85
        ? "#FEF3C7"
        : "#FEE2E2",
    color:
      dashboard.expensePercentage <= 70
        ? "#15803D"
        : dashboard.expensePercentage <= 85
        ? "#B45309"
        : "#DC2626",
    fontWeight: 700,
  }}
>
  {dashboard.expensePercentage <= 70 &&
    `✅ Safe your expense rate is (${dashboard.expensePercentage.toFixed(1)}%)`}

  {dashboard.expensePercentage > 70 &&
    dashboard.expensePercentage <= 85 &&
    `⚠ Warning your expense rate is  (${dashboard.expensePercentage.toFixed(1)}%) according to your income `}

  {dashboard.expensePercentage > 85 &&
    `🚨 Critical your expense rate is (${dashboard.expensePercentage.toFixed(1)}%) more than your income `}
</div>

     {/* ✅ FIX 1 + FIX 2: Correct component name + correct state setter */}
      {showModal && !isPremium &&  (
        <PremiumUpgradeModal
          user={dashboard.user}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowPremiumAlert(false); // ✅ FIX 2: was setShowPremium (wrong name)
            window.location.reload();
          },2000}
        />
      )}





      {showPremiumAlert && !isPremium &&  (
  <div
    style={{
      marginTop: 24,
      padding: "20px 24px",
      borderRadius: 16,
      background: "linear-gradient(135deg, #fff5f3 0%, #fff 60%)",
      border: "1.5px solid #fcd5cc",
      boxShadow: "0 4px 24px rgba(229,83,45,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 20,
      flexWrap: "wrap",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: "linear-gradient(135deg, #E5532D, #ff8c69)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        💎
      </div>

      <div>
        <div
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: "#1a1a2e",
            marginBottom: 3,
          }}
        >
          Premium Plan Recommended
        </div>

        <div style={{ fontSize: 13, color: "#6B7280" }}>
          You have used{" "}
          <strong>
            {dashboard.expensePercentage?.toFixed(1)}%
          </strong>{" "}
          of your income.
        </div>

        <div
          style={{
            color: "#dc2626",
            fontWeight: 700,
            marginTop: 6,
          }}
        >
          🚨 Critical Spending Level
        </div>

        <div
          style={{
            display: "flex",
            gap: 6,
            marginTop: 8,
            flexWrap: "wrap",
          }}
        >
          {["🤖 AI Tips", "📊 Budget Alerts", "📈 Savings Reports"].map(
            (tag) => (
              <span
                key={tag}
                style={{
                  background: "#FEE2E2",
                  color: "#E5532D",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 20,
                }}
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    </div>

    <button
      onClick={() => setShowModal(true)}
      style={{
        background: "linear-gradient(135deg, #E5532D, #ff6b45)",
        color: "#fff",
        border: "none",
        padding: "12px 22px",
        borderRadius: 12,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      Upgrade Now →
    </button>
  </div>
)}

      {/* ── Recent transactions ─────────────────────────────────── */}
      <SectionTitle>Recent Transactions</SectionTitle>
      <TableWrap heads={["Title", "Category", "Amount", "Type", "Date"]}>

         
     


        {dashboard.recentTransactions.map(item => (
          <TR key={item.id} cells={[
            <span style={{ fontWeight: 600, color: "#1a1a2e" }}>{item.title}</span>,
            <span style={{
              background: "#F0F0EC", borderRadius: 6,
              padding: "2px 8px", fontSize: 11, fontWeight: 600, color: "#6B7280",
              fontFamily: "'Sora', sans-serif",
            }}>{item.category}</span>,
            <span style={{ fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1a2e" }}>
              ₹{item.amount?.toLocaleString()}
            </span>,
            <TypeBadge type={item.type} />,
            <span style={{ color: "#9CA3AF", fontSize: 12 }}>
              {new Date(item.date).toLocaleDateString()}
            </span>,
          ]} />
        ))}
      </TableWrap>

      {/* ── Category wise ───────────────────────────────────────── */}
      <SectionTitle>Category Breakdown</SectionTitle>
      <div className="dash-grid-cat" style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14,
      }}>
        {dashboard.categoryWiseExpenses.map((item, index) => {
          // visual bar: percentage relative to largest category
          const max = Math.max(...dashboard.categoryWiseExpenses.map(c => c.totalAmount));
          const pct = max > 0 ? (item.totalAmount / max) * 100 : 0;
          return (
            <div key={index} style={{
              background: "#fff",
              border: "1px solid rgba(26,26,46,.07)",
              borderRadius: 10,
              padding: "18px 20px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontWeight: 600, color: "#1a1a2e", fontSize: 14 }}>{item.category}</span>
                <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 15, color: "#E5532D" }}>
                  ₹{item.totalAmount?.toLocaleString()}
                </span>
              </div>
              {/* Bar */}
              <div style={{ height: 4, background: "#F0F0EC", borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
                <div style={{
                  height: "100%", width: `${pct}%`,
                  background: "#2D5BE3", borderRadius: 2,
                  transition: "width .4s ease",
                }} />
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                {item.transactionCount} transaction{item.transactionCount !== 1 ? "s" : ""}
              </div>
            </div>
          );
        })}
      </div>


    </div>
    
  );
};

export default Dashboard;