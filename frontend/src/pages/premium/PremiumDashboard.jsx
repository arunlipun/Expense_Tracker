// src/pages/premium/PremiumDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDashboard } from "../../api/dashboardApi";

import AiInsights from "./AiInsights";
import BudgetAdvisor from "./BudgetAdvisor";
import FinanceTips from "./FinanceTips";
import SuccessStories from "./SuccessStories";
import PdfReports from "./PdfReports";

const PremiumDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    loadDashboard();
  }, []);

  // Live countdown timer
  useEffect(() => {
    const tick = () => {
      const activatedAt = localStorage.getItem("premiumActivatedAt");
      // const plan = localStorage.getItem("premiumPlan") || "MONTHLY";
      const plan = dashboard?.planType || "FREE";

      if (!activatedAt) return;

      const start = new Date(activatedAt);
      const durationDays =  plan === "YEARLY"
    ? 365
    : plan === "MONTHLY"
    ? 30
    : 0;
      const expiry = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
      const diff = expiry - new Date();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [dashboard]);

  const loadDashboard = async () => {
    try {
      const response = await getUserDashboard();
      const data = response.data.data;
      if (!data.premiumUser) {
  navigate("/dashboard");
  return;
}
      setDashboard(data);

      localStorage.setItem(
  "premiumUser",
  JSON.stringify(data.premiumUser)
);

localStorage.setItem(
  "isPremium",
  String(data.premiumUser)
);

localStorage.setItem(
  "premiumPlan",
  data.planType || "FREE"
);

      // Agar API se plan info aaye toh localStorage mein save karo
      if (data.premiumActivatedAt) {
        localStorage.setItem("premiumActivatedAt", data.premiumActivatedAt);
      }
      if (data.planType) {
  localStorage.setItem("premiumPlan", data.planType);
}

      // Agar localStorage mein bilkul nahi hai toh abhi ka time set karo (fallback)
      if (!localStorage.getItem("premiumActivatedAt")) {
        localStorage.setItem("premiumActivatedAt", new Date().toISOString());
      }

    } catch (err) {
      console.log(err);
    }
  };

  if (!dashboard) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", flexDirection: "column", gap: 12,
      }}>
        <i className="ti ti-loader" style={{ fontSize: 32, color: "var(--color-text-tertiary)" }} />
        <p style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>Loading premium dashboard...</p>
      </div>
    );
  }

 const plan =
  localStorage.getItem("premiumPlan") ||
  dashboard?.planType ||
  "MONTHLY";

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary)", padding: "1.5rem" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #7C3AED, #DB2777)",
        borderRadius: "var(--border-radius-xl)",
        padding: "2rem",
        marginBottom: "1.5rem",
        color: "#fff",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <i className="ti ti-diamond" style={{ fontSize: 28, color: "#fff" }} aria-hidden="true" />
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 500, color: "#fff" }}>Premium Dashboard</h1>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.75)" }}>Smart Financial Intelligence</p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "0.5px solid rgba(255,255,255,0.3)",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: "var(--border-radius-md)",
              fontSize: 14,
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <i className="ti ti-arrow-left" style={{ fontSize: 15 }} />
            Dashboard
          </button>
        </div>

        {/* Plan badges */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "1.25rem" }}>
          {[
            { icon: "ti-crown", label: `Plan: ${plan}` },
            { icon: "ti-user-check", label: "Premium Member" },
          ].map((b, i) => (
            <span key={i} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.15)",
              border: "0.5px solid rgba(255,255,255,0.25)",
              padding: "6px 14px", borderRadius: 999,
              fontSize: 13, color: "#fff",
            }}>
              <i className={`ti ${b.icon}`} style={{ fontSize: 14 }} aria-hidden="true" />
              {b.label}
            </span>
          ))}
        </div>

        {/* Countdown timer */}
        <div style={{ marginTop: "1.25rem" }}>
          <p style={{ margin: "0 0 8px", fontSize: 12, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Plan expires in
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { value: timeLeft.days,    label: "days"    },
              { value: timeLeft.hours,   label: "hours"   },
              { value: timeLeft.minutes, label: "minutes" },
              { value: timeLeft.seconds, label: "seconds" },
            ].map((t, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.15)",
                border: "0.5px solid rgba(255,255,255,0.25)",
                borderRadius: "var(--border-radius-md)",
                padding: "8px 14px",
                textAlign: "center",
                minWidth: 56,
              }}>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 500, color: "#fff", lineHeight: 1 }}>
                  {String(t.value).padStart(2, "0")}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
                  {t.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        {[
          { icon: "ti-arrow-up-circle",   label: "Income",     value: `₹${dashboard.totalIncome.toLocaleString("en-IN")}`,                color: "var(--color-text-success)" },
          { icon: "ti-arrow-down-circle", label: "Expense",    value: `₹${dashboard.totalExpense.toLocaleString("en-IN")}`,               color: "var(--color-text-danger)"  },
          { icon: "ti-wallet",            label: "Balance",    value: `₹${dashboard.balance.toLocaleString("en-IN")}`,                    color: "var(--color-text-info)"    },
          { icon: "ti-percent",           label: "Expense %",  value: `${dashboard.expensePercentage.toFixed(1)}%`,                       color: "var(--color-text-warning)" },
        ].map((c, i) => (
          <div key={i} style={{
            background: "var(--color-background-primary)",
            borderRadius: "var(--border-radius-lg)",
            border: "0.5px solid var(--color-border-tertiary)",
            padding: "1rem 1.25rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <i className={`ti ${c.icon}`} style={{ fontSize: 16, color: c.color }} aria-hidden="true" />
              <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{c.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)" }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Premium components */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <AiInsights expenses={dashboard.expenses || []} income={dashboard.totalIncome || 0} />
        <BudgetAdvisor expenses={dashboard.expenses || []} income={dashboard.totalIncome || 0} />
        <FinanceTips expenses={dashboard.expenses || []} income={dashboard.totalIncome || 0} />
        <SuccessStories />
        <PdfReports dashboard={dashboard} />
      </div>

    </div>
  );
};

export default PremiumDashboard;