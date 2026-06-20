import React, { useEffect, useState } from "react";

const STATUS_META = {
  danger: {
    icon: "ti-alert-triangle",
    color: "var(--color-text-danger)",
    bg: "var(--color-background-danger)",
    badge: "Over budget",
    barColor: "var(--color-text-danger)",
    tone: "Critical",
  },
  warning: {
    icon: "ti-alert-circle",
    color: "var(--color-text-warning)",
    bg: "var(--color-background-warning)",
    badge: "Tight budget",
    barColor: "var(--color-text-warning)",
    tone: "Warning",
  },
  success: {
    icon: "ti-circle-check",
    color: "var(--color-text-success)",
    bg: "var(--color-background-success)",
    badge: "Safe zone",
    barColor: "var(--color-text-success)",
    tone: "Healthy",
  },
};

const BudgetAdvisor = ({ expenses = [], income = 0 }) => {
  const [advice, setAdvice] = useState([]);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("success");
  const [topCat, setTopCat] = useState(null);

  useEffect(() => {
    generateAdvice();
  }, [JSON.stringify(expenses), income]);

  const generateAdvice = () => {
    if (!income) {
      setAdvice([
        {
          icon: "ti-info-circle",
          color: "var(--color-text-secondary)",
          text: "Please add your monthly income first",
        },
      ]);
      setStats(null);
      setTopCat(null);
      return;
    }

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = income - totalExpense;
    const percentage = (totalExpense / income) * 100;

    let st =
      percentage >= 95 ? "danger" : percentage >= 80 ? "warning" : "success";

    setStatus(st);
    setStats({ remaining, percentage, totalExpense });

    const categoryMap = {};
    expenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });

    const highest = Object.keys(categoryMap).sort(
      (a, b) => categoryMap[b] - categoryMap[a]
    )[0];
    setTopCat(highest || null);

    let temp = [];
    if (st === "danger")
      temp.push({
        icon: "ti-alert-triangle",
        color: "var(--color-text-danger)",
        text: "You are over budget! Reduce unnecessary spending immediately",
      });
    if (st === "warning")
      temp.push({
        icon: "ti-alert-circle",
        color: "var(--color-text-warning)",
        text: "Budget is tight. Avoid luxury expenses",
      });
    if (st === "success")
      temp.push({
        icon: "ti-circle-check",
        color: "var(--color-text-success)",
        text: "You are within a safe budget range",
      });

    setAdvice(temp);
  };

  const meta = STATUS_META[status];
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = income - totalExpense;
  const dailySafe =
    remaining > 0 ? Math.max(Math.floor(remaining / 30), 0) : 0;
  const weeklySafe =
    remaining > 0 ? Math.max(Math.floor(remaining / 4), 0) : 0;
  const savingsTarget = income > 0 ? income * 0.2 : 0;
  const currentSavings = Math.max(remaining, 0);
  const savingsGap = Math.max(savingsTarget - currentSavings, 0);
  const topCategoryAmount = topCat
    ? expenses
        .filter((e) => e.category === topCat)
        .reduce((sum, e) => sum + e.amount, 0)
    : 0;
  const topCategoryPct =
    income > 0 ? ((topCategoryAmount / income) * 100).toFixed(1) : "0.0";

  const primaryAction =
    status === "danger"
      ? "Pause non-essential spending today"
      : status === "warning"
      ? "Limit wants spending for the rest of the month"
      : "Move remaining surplus to savings this week";

  const serviceNote =
    status === "danger"
      ? "Priority monitoring active"
      : status === "warning"
      ? "Smart budget watch enabled"
      : "Budget performing normally";

  const card = {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "13px 15px",
    borderRadius: "var(--border-radius-md)",
    background: "var(--color-background-secondary)",
    border: "0.5px solid var(--color-border-tertiary)",
  };

  const statCard = {
    background: "var(--color-background-secondary)",
    borderRadius: "var(--border-radius-md)",
    padding: "14px 16px",
    border: "0.5px solid var(--color-border-tertiary)",
    minWidth: 0,
  };

  const tinyLabel = {
    margin: "0 0 4px",
    fontSize: 11,
    color: "var(--color-text-tertiary)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: 500,
  };

  const bigValue = {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    color: "var(--color-text-primary)",
    lineHeight: 1.2,
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.16), transparent 26%), radial-gradient(circle at top right, rgba(245,158,11,0.12), transparent 22%), linear-gradient(180deg, #0b1220 0%, #0f172a 100%)",
        borderRadius: "28px",
        border: "1px solid rgba(148, 163, 184, 0.14)",
        boxShadow: "0 24px 80px rgba(2, 6, 23, 0.45)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "14px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i
            className="ti ti-calculator"
            style={{ fontSize: 16, color: "#dbeafe" }}
            aria-hidden="true"
          />
        </div>

        <div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "rgba(191,219,254,0.85)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 700,
            }}
          >
            Premium Budget Service
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 13,
              color: "rgba(226,232,240,0.72)",
            }}
          >
            Compact AI-led budget monitoring
          </p>
        </div>

        {stats && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 11,
              padding: "5px 10px",
              borderRadius: 999,
              background: meta.bg,
              color: meta.color,
              border: `0.5px solid ${meta.color}`,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {meta.badge}
          </span>
        )}
      </div>

      {/* Premium compact service strip */}
      {income > 0 && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "10px 12px",
            borderRadius: "var(--border-radius-md)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(148,163,184,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <i
              className={`ti ${meta.icon}`}
              style={{ color: meta.color, fontSize: 15 }}
              aria-hidden="true"
            />
            <span
              style={{
                fontSize: 12,
                color: "#e2e8f0",
                fontWeight: 500,
              }}
            >
              {serviceNote}
            </span>
          </div>

          <span
            style={{
              fontSize: 11,
              color: "rgba(226,232,240,0.7)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            AI monitoring enabled
          </span>
        </div>
      )}

      {/* Metric cards */}
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 10,
            marginBottom: "1rem",
          }}
        >
          <div style={statCard}>
            <p style={tinyLabel}>Remaining</p>
            <p style={bigValue}>₹{stats.remaining.toLocaleString("en-IN")}</p>
          </div>

          <div style={statCard}>
            <p style={tinyLabel}>Spent</p>
            <p style={bigValue}>{Math.round(stats.percentage)}%</p>
          </div>

          <div style={statCard}>
            <p style={tinyLabel}>Safe / day</p>
            <p style={bigValue}>₹{dailySafe.toLocaleString("en-IN")}</p>
          </div>

          <div style={statCard}>
            <p style={tinyLabel}>Safe / week</p>
            <p style={bigValue}>₹{weeklySafe.toLocaleString("en-IN")}</p>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {stats && (
        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 12, color: "rgba(226,232,240,0.68)" }}>
              Budget used
            </span>
            <span
              style={{
                fontSize: 12,
                color: "#e2e8f0",
                fontWeight: 500,
              }}
            >
              ₹{(income - stats.remaining).toLocaleString("en-IN")} / ₹
              {income.toLocaleString("en-IN")}
            </span>
          </div>

          <div
            style={{
              height: 8,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(stats.percentage, 100)}%`,
                background: meta.barColor,
                borderRadius: 999,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      )}

      {/* Premium compact highlights */}
      {income > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 10,
            marginBottom: "1rem",
          }}
        >
          <div style={card}>
            <i
              className="ti ti-bolt"
              style={{
                fontSize: 17,
                color: "var(--color-text-info)",
                marginTop: 1,
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 13,
                  color: "#f8fafc",
                  fontWeight: 600,
                }}
              >
                AI priority action
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "rgba(226,232,240,0.8)",
                  lineHeight: 1.5,
                }}
              >
                {primaryAction}
              </p>
            </div>
          </div>

          <div style={card}>
            <i
              className="ti ti-target-arrow"
              style={{
                fontSize: 17,
                color: "var(--color-text-success)",
                marginTop: 1,
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 13,
                  color: "#f8fafc",
                  fontWeight: 600,
                }}
              >
                Savings target
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "rgba(226,232,240,0.8)",
                  lineHeight: 1.5,
                }}
              >
                {savingsGap > 0
                  ? `Need ₹${savingsGap.toLocaleString(
                      "en-IN"
                    )} more to reach 20% monthly savings goal`
                  : "You are on track with your 20% savings goal"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Advice rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {advice.map((a, i) => (
          <div key={i} style={card}>
            <i
              className={`ti ${a.icon}`}
              style={{
                fontSize: 17,
                color: a.color,
                marginTop: 1,
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#e2e8f0",
                lineHeight: 1.55,
              }}
            >
              {a.text}
            </p>
          </div>
        ))}

        {/* 50/30/20 rule */}
        {income > 0 && (
          <div style={card}>
            <i
              className="ti ti-adjustments-horizontal"
              style={{
                fontSize: 17,
                color: "var(--color-text-info)",
                marginTop: 1,
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <div>
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: 14,
                  color: "#f8fafc",
                  lineHeight: 1.5,
                  fontWeight: 600,
                }}
              >
                Suggested split rule
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: 12,
                    padding: "3px 9px",
                    borderRadius: 999,
                    background: "var(--color-background-info)",
                    color: "var(--color-text-info)",
                    fontWeight: 500,
                  }}
                >
                  50% Needs
                </span>
                <span
                  style={{
                    fontSize: 12,
                    padding: "3px 9px",
                    borderRadius: 999,
                    background: "var(--color-background-warning)",
                    color: "var(--color-text-warning)",
                    fontWeight: 500,
                  }}
                >
                  30% Wants
                </span>
                <span
                  style={{
                    fontSize: 12,
                    padding: "3px 9px",
                    borderRadius: 999,
                    background: "var(--color-background-success)",
                    color: "var(--color-text-success)",
                    fontWeight: 500,
                  }}
                >
                  20% Savings
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Top category */}
        {topCat && (
          <div style={card}>
            <i
              className="ti ti-trending-down"
              style={{
                fontSize: 17,
                color: "var(--color-text-danger)",
                marginTop: 1,
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 14,
                  color: "#f8fafc",
                  lineHeight: 1.5,
                  fontWeight: 600,
                }}
              >
                Spending hotspot
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "rgba(226,232,240,0.8)",
                  lineHeight: 1.5,
                }}
              >
                Reduce spending on{" "}
                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--color-text-danger)",
                  }}
                >
                  {topCat}
                </span>{" "}
                — currently using {topCategoryPct}% of your income.
              </p>
            </div>
          </div>
        )}

        {/* Premium service CTA */}
        {income > 0 && (
          <div
            style={{
              ...card,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.09)",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(59,130,246,0.14)",
                  color: "#93c5fd",
                  flexShrink: 0,
                }}
              >
                <i className="ti ti-diamond" aria-hidden="true" />
              </div>

              <div>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: 13,
                    color: "#f8fafc",
                    fontWeight: 600,
                  }}
                >
                  Premium advisory active
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "rgba(226,232,240,0.7)",
                  }}
                >
                  Personalized budget tracking with compact AI guidance
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: 11,
                color: "#86efac",
                padding: "5px 10px",
                borderRadius: 999,
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.18)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Service live
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetAdvisor;