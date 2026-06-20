import React, { useEffect, useState } from "react";
import { dummyResponses, fallbackResponse } from "../../data/dummyData";

const iconMap = {
  "🚨": { icon: "ti-alert-triangle", color: "var(--color-text-danger)" },
  "⚠️": { icon: "ti-alert-circle", color: "var(--color-text-warning)" },
  "✅": { icon: "ti-circle-check", color: "var(--color-text-success)" },
  "📊": { icon: "ti-chart-pie", color: "var(--color-text-info)" },
  "💡": { icon: "ti-bulb", color: "var(--color-text-warning)" },
};

// const parseInsight = (text) => {
//   for (const [emoji, meta] of Object.entries(iconMap)) {
//     if (text.startsWith(emoji)) {
//       return {
//         icon: meta.icon,
//         color: meta.color,
//         text: text.replace(emoji, "").trim(),
//       };
//     }
//   }
//   return {
//     icon: "ti-info-circle",
//     color: "var(--color-text-secondary)",
//     text,
//   };
// };

const parseInsight = (text = "") => {
  for (const [emoji, meta] of Object.entries(iconMap)) {
    if (text.startsWith(emoji)) {
      return {
        icon: meta.icon,
        color: meta.color,
        text: text.replace(emoji, "").trim(),
      };
    }
  }

  return {
    icon: "ti-info-circle",
    color: "var(--color-text-secondary)",
    text,
  };
};


const AiInsights = ({ expenses = [], income = 0 }) => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome to Premium AI Financial Assistant. How may I assist you today?",
    },
  ]);

  const [question, setQuestion] = useState("");
  const [conversationEnded, setConversationEnded] = useState(false);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    generateInsights();
  }, [JSON.stringify(expenses), income]);

  const generateInsights = () => {
    if (!income || expenses.length === 0) {
      setInsights(["Add income and expenses to get AI insights"]);
      return;
    }

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const percentage = (totalExpense / income) * 100;
    let temp = [];

    if (percentage >= 95) {
      temp.push("🚨 Critical: You are spending almost all your income!");
    } else if (percentage >= 80) {
      temp.push("⚠️ Warning: You have used more than 80% of your income");
    } else {
      temp.push("✅ Your spending is under control");
    }

    const topCategory = getTopCategory(expenses);
    if (topCategory) temp.push(`📊 Highest spending category: ${topCategory}`);
    temp.push("💡 Tip: Try to save at least 20% of your income monthly");
    setInsights(temp);
  };

  const getTopCategory = (expenses) => {
    const map = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.keys(map).reduce(
      (a, b) => (map[a] > map[b] ? a : b),
      Object.keys(map)[0]
    );
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const saved = Math.max(income - totalExpense, 0);
  const savingPct = income > 0 ? ((saved / income) * 100).toFixed(1) : "0.0";
  const spentPct = income > 0 ? ((totalExpense / income) * 100).toFixed(1) : "0.0";

  const categoryMap = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });
  const sortedCats = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  const weeklyBudget = income > 0 ? (income / 4).toFixed(0) : 0;
  const dailyBudget = income > 0 ? (income / 30).toFixed(0) : 0;
  const projectedAnnual = (saved * 12).toLocaleString("en-IN");

  const healthScore =
    income === 0
      ? 0
      : totalExpense / income >= 0.95
      ? 20
      : totalExpense / income >= 0.8
      ? 50
      : totalExpense / income >= 0.6
      ? 75
      : 95;

  const healthLabel =
    healthScore >= 90
      ? { text: "Excellent", color: "#22c55e" }
      : healthScore >= 70
      ? { text: "Good", color: "#38bdf8" }
      : healthScore >= 40
      ? { text: "Fair", color: "#f59e0b" }
      : { text: "Critical", color: "#ef4444" };

  const card = (extra = {}) => ({
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    boxShadow: "0 18px 50px rgba(2, 6, 23, 0.35)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderRadius: "24px",
    padding: "18px",
    ...extra,
  });

  const section = (mb = "1.4rem") => ({
    marginBottom: mb,
  });

  const label = {
    margin: "0 0 12px",
    fontSize: 11,
    color: "rgba(226, 232, 240, 0.68)",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  const chip = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#e2e8f0",
  };

  const handleAsk = () => {
    if (!question.trim()) return;

    const userQuestion = question.toLowerCase();
    let response = fallbackResponse;

    Object.values(dummyResponses).forEach((item) => {
      if (
        item.keywords.some((keyword) =>
          userQuestion.includes(keyword.toLowerCase())
        )
      ) {
        response = item.answer;
      }
    });

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: question,
      },
      {
        sender: "bot",
        text: response,
        askMore: true,
      },
    ]);

    setQuestion("");
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        borderRadius: "28px",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.16), transparent 26%), radial-gradient(circle at top right, rgba(245,158,11,0.12), transparent 22%), linear-gradient(180deg, #0b1220 0%, #0f172a 100%)",
        border: "1px solid rgba(148, 163, 184, 0.14)",
        boxShadow: "0 24px 80px rgba(2, 6, 23, 0.45)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "14px",
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(14,165,233,0.08))",
            border: "1px solid rgba(96,165,250,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <i
            className="ti ti-sparkles"
            style={{ fontSize: 18, color: "#dbeafe" }}
            aria-hidden="true"
          />
        </div>

        <div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "rgba(191,219,254,0.85)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Premium Intelligence
          </p>
          <h3
            style={{
              margin: "4px 0 0",
              fontSize: "1.1rem",
              color: "#f8fafc",
              fontWeight: 700,
            }}
          >
            AI Financial Insights Console
          </h3>
        </div>

        <span style={{ ...chip, marginLeft: "auto", color: "#fde68a" }}>
          <i className="ti ti-diamond" aria-hidden="true" />
          Premium
        </span>
      </div>

      {/* Top premium layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px, 1.2fr) minmax(280px, 0.8fr)",
          gap: "1.25rem",
          alignItems: "start",
          marginBottom: "1.4rem",
        }}
      >
        {/* Chatbot first - left upper priority */}
        <div
          style={{
            ...card({
              padding: 0,
              overflow: "hidden",
              position: "sticky",
              top: 12,
            }),
          }}
        >
          <div
            style={{
              padding: "18px 18px 16px",
              background:
                "linear-gradient(135deg, rgba(30,41,59,0.98), rgba(15,23,42,0.92))",
              borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.22), rgba(37,99,235,0.08))",
                  border: "1px solid rgba(96,165,250,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="ti ti-message-chatbot"
                  style={{ fontSize: 18, color: "#bfdbfe" }}
                  aria-hidden="true"
                />
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#f8fafc",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  Premium AI Assistant
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 12,
                    color: "rgba(148,163,184,0.95)",
                  }}
                >
                  Smart guidance for income, expenses and savings
                </p>
              </div>
            </div>

            <span
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                fontSize: 11,
                color: "#86efac",
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.18)",
                fontWeight: 600,
              }}
            >
              Live
            </span>
          </div>

          <div
            style={{
              height: "430px",
              overflowY: "auto",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              background:
                "linear-gradient(180deg, rgba(15,23,42,0.55), rgba(2,6,23,0.3))",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "13px 15px",
                    borderRadius: "18px",
                    background:
                      msg.sender === "user"
                        ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                        : "rgba(255,255,255,0.94)",
                    color: msg.sender === "user" ? "#fff" : "#0f172a",
                    boxShadow:
                      msg.sender === "user"
                        ? "0 12px 25px rgba(37,99,235,0.28)"
                        : "0 10px 30px rgba(15,23,42,0.14)",
                    border:
                      msg.sender === "user"
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "1px solid rgba(226,232,240,0.85)",
                    lineHeight: 1.55,
                    fontSize: 14,
                  }}
                >
                  {msg.text}

                  {msg.askMore && !conversationEnded && (
                    <div
                      style={{
                        marginTop: 12,
                        borderTop: "1px solid rgba(148,163,184,0.22)",
                        paddingTop: 10,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          marginBottom: 8,
                          color: "#64748b",
                          fontWeight: 500,
                        }}
                      >
                        Any more questions?
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          style={{
                            border: "1px solid rgba(37,99,235,0.18)",
                            background: "rgba(37,99,235,0.08)",
                            color: "#1d4ed8",
                            padding: "7px 14px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Yes
                        </button>

                        <button
                          onClick={() => {
                            setConversationEnded(true);
                            setMessages((prev) => [
                              ...prev,
                              {
                                sender: "bot",
                                text: "✅ Thank you for using Premium AI Assistant. Conversation ended.",
                              },
                            ]);
                          }}
                          style={{
                            border: "1px solid rgba(148,163,184,0.25)",
                            background: "#fff",
                            color: "#0f172a",
                            padding: "7px 14px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!conversationEnded && (
            <div
              style={{
                padding: 14,
                borderTop: "1px solid rgba(148, 163, 184, 0.12)",
                display: "flex",
                gap: 10,
                background: "rgba(15,23,42,0.9)",
              }}
            >
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAsk();
                }}
                placeholder="Ask about income, expenses, savings..."
                style={{
                  flex: 1,
                  padding: "13px 14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(148,163,184,0.18)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#f8fafc",
                  outline: "none",
                }}
              />

              <button
                onClick={handleAsk}
                style={{
                  border: "none",
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "#fff",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: 700,
                  boxShadow: "0 10px 24px rgba(37,99,235,0.28)",
                }}
              >
                Send
              </button>
            </div>
          )}
        </div>

        {/* Right side premium summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={card()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i
                  className="ti ti-heart-rate-monitor"
                  style={{ fontSize: 17, color: "#38bdf8" }}
                  aria-hidden="true"
                />
                <span
                  style={{
                    fontSize: 13,
                    color: "#cbd5e1",
                    fontWeight: 600,
                  }}
                >
                  Financial health score
                </span>
              </div>

              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: healthLabel.color,
                }}
              >
                {healthLabel.text}
              </span>
            </div>

            <div
              style={{
                height: 10,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 999,
                overflow: "hidden",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${healthScore}%`,
                  background: `linear-gradient(90deg, ${healthLabel.color}, rgba(255,255,255,0.9))`,
                  borderRadius: 999,
                  transition: "width 0.6s ease",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "rgba(148,163,184,0.92)",
                fontSize: 12,
              }}
            >
              <span>0 — Critical</span>
              <span style={{ color: "#f8fafc", fontWeight: 700 }}>
                {healthScore} / 100
              </span>
              <span>100 — Excellent</span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0,1fr))",
              gap: 10,
            }}
          >
            {[
              {
                icon: "ti-device-floppy",
                label: "Saved this month",
                value: `₹${saved.toLocaleString("en-IN")}`,
                color: "#22c55e",
              },
              {
                icon: "ti-percentage",
                label: "Saving rate",
                value: `${savingPct}%`,
                color: "#38bdf8",
              },
              {
                icon: "ti-flame",
                label: "Spent so far",
                value: `${spentPct}%`,
                color: "#f59e0b",
              },
              {
                icon: "ti-calendar",
                label: "Daily budget",
                value: `₹${Number(dailyBudget).toLocaleString("en-IN")}`,
                color: "#cbd5e1",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  ...card({
                    padding: "16px",
                    borderRadius: "20px",
                    minHeight: 116,
                  }),
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <i
                  className={`ti ${s.icon}`}
                  style={{ fontSize: 18, color: s.color }}
                  aria-hidden="true"
                />
                <div>
                  <p
                    style={{
                      margin: "8px 0 4px",
                      fontSize: 11,
                      color: "rgba(148,163,184,0.88)",
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#f8fafc",
                    }}
                  >
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {income > 0 && (
            <div style={card()}>
              <p style={label}>
                <i className="ti ti-calculator" aria-hidden="true" />
                Smart budget planner
              </p>

              <div style={{ display: "grid", gap: 10 }}>
                {[
                  {
                    icon: "ti-calendar-week",
                    label: "Weekly budget",
                    value: `₹${Number(weeklyBudget).toLocaleString("en-IN")}`,
                    sub: "Safe to spend/week",
                  },
                  {
                    icon: "ti-sun",
                    label: "Daily budget",
                    value: `₹${Number(dailyBudget).toLocaleString("en-IN")}`,
                    sub: "Safe to spend/day",
                  },
                  {
                    icon: "ti-trending-up",
                    label: "Annual savings",
                    value: `₹${projectedAnnual}`,
                    sub: "If you save same rate",
                  },
                ].map((b, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(148,163,184,0.12)",
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(59,130,246,0.12)",
                        border: "1px solid rgba(96,165,250,0.16)",
                        color: "#60a5fa",
                        flexShrink: 0,
                      }}
                    >
                      <i className={`ti ${b.icon}`} aria-hidden="true" />
                    </div>

                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 11,
                          color: "rgba(148,163,184,0.88)",
                        }}
                      >
                        {b.label}
                      </p>
                      <p
                        style={{
                          margin: "2px 0",
                          fontSize: 16,
                          color: "#f8fafc",
                          fontWeight: 700,
                        }}
                      >
                        {b.value}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 11,
                          color: "rgba(148,163,184,0.78)",
                        }}
                      >
                        {b.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI analysis */}
      <div style={section()}>
        <p style={label}>
          <i className="ti ti-robot" style={{ fontSize: 13 }} aria-hidden="true" />
          AI analysis
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {insights.map((item, index) => {
            const { icon, color, text } = parseInsight(item);
            return (
              <div
                key={index}
                style={{
                  ...card({
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "16px 18px",
                    borderRadius: "18px",
                  }),
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(148,163,184,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className={`ti ${icon}`}
                    style={{ fontSize: 18, color }}
                    aria-hidden="true"
                  />
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: "#e2e8f0",
                    lineHeight: 1.6,
                  }}
                >
                  {text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category breakdown */}
      {sortedCats.length > 0 && (
        <div style={section()}>
          <p style={label}>
            <i className="ti ti-chart-donut" style={{ fontSize: 13 }} aria-hidden="true" />
            Spending breakdown
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sortedCats.slice(0, 5).map(([cat, amt], i) => {
              const pct = income > 0 ? ((amt / income) * 100).toFixed(1) : 0;
              const barColors = ["#ef4444", "#f59e0b", "#38bdf8", "#22c55e", "#cbd5e1"];

              return (
                <div key={i} style={card()}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        color: "#f8fafc",
                        fontWeight: 700,
                      }}
                    >
                      {cat}
                    </span>

                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: 12,
                          color: "rgba(148,163,184,0.88)",
                        }}
                      >
                        {pct}%
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#f8fafc",
                        }}
                      >
                        ₹{amt.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      height: 7,
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(Number(pct), 100)}%`,
                        background: `linear-gradient(90deg, ${barColors[i]}, rgba(255,255,255,0.95))`,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Premium tips */}
      <div style={section("0")}>
        <p style={label}>
          <i className="ti ti-diamond" style={{ fontSize: 13 }} aria-hidden="true" />
          Exclusive premium tips
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 10,
          }}
        >
          {[
            {
              icon: "ti-building-bank",
              color: "#22c55e",
              text: "Park your monthly savings in a high-yield FD or liquid mutual fund the same day salary arrives — before you can spend it.",
            },
            {
              icon: "ti-credit-card",
              color: "#38bdf8",
              text: "Use a credit card with cashback for regular purchases, but pay the full bill every month to avoid interest.",
            },
            {
              icon: "ti-repeat",
              color: "#f59e0b",
              text: "Audit your recurring subscriptions every 3 months — the average person pays for 2–3 services they forgot about.",
            },
            {
              icon: "ti-shield-check",
              color: "#22c55e",
              text: "Build a 3-month emergency fund before starting investments — it prevents you from breaking long-term goals in a crisis.",
            },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                ...card({
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  minHeight: 170,
                }),
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(148,163,184,0.12)",
                }}
              >
                <i
                  className={`ti ${t.icon}`}
                  style={{ fontSize: 18, color: t.color }}
                  aria-hidden="true"
                />
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#cbd5e1",
                  lineHeight: 1.65,
                }}
              >
                {t.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiInsights;