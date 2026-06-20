import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../api/adminApi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#6366f1",
  "#f43f5e",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
];

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

// ── Reusable stat card ──────────────────────────────────────────────
const StatCard = ({ label, value, accent, icon }) => (
  <div
    style={{
      background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: 18,
      padding: "20px 20px",
      boxShadow: "0 8px 24px rgba(15,23,42,.06)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      border: "1px solid rgba(226,232,240,0.9)",
      transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
      minHeight: 118,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = "0 14px 30px rgba(15,23,42,.10)";
      e.currentTarget.style.borderColor = accent;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "";
      e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,.06)";
      e.currentTarget.style.borderColor = "rgba(226,232,240,0.9)";
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: "#94a3b8",
          lineHeight: 1.5,
        }}
      >
        {label}
      </span>

      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          background: `${accent}15`,
          display: "grid",
          placeItems: "center",
          fontSize: 20,
        }}
      >
        {icon}
      </div>
    </div>

    <span
      style={{
        fontSize: 28,
        fontWeight: 800,
        color: "#0f172a",
        letterSpacing: "-.6px",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </span>
  </div>
);

// ── Section wrapper ─────────────────────────────────────────────────
const Card = ({ title, subtitle, children, style = {} }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(8px)",
      borderRadius: 20,
      padding: "24px",
      boxShadow: "0 10px 30px rgba(15,23,42,.06)",
      border: "1px solid rgba(226,232,240,.8)",
      ...style,
    }}
  >
    {title && (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginBottom: 22,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 6,
              height: 24,
              background: "linear-gradient(180deg, #6366f1 0%, #06b6d4 100%)",
              borderRadius: 999,
              display: "block",
            }}
          />
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-.3px",
            }}
          >
            {title}
          </h2>
        </div>

        {subtitle && (
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: 13,
              paddingLeft: 16,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    )}
    {children}
  </div>
);

// ── Custom tooltip for charts ────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: 12,
        padding: "12px 14px",
        color: "#fff",
        fontSize: 13,
        boxShadow: "0 10px 25px rgba(2,6,23,.25)",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      {label && (
        <p
          style={{
            margin: "0 0 6px",
            fontWeight: 700,
            color: "#cbd5e1",
            fontSize: 12,
            letterSpacing: ".04em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
      )}

      {payload.map((p, i) => (
        <p
          key={i}
          style={{
            margin: "4px 0",
            color: p.color || "#fff",
            fontWeight: 500,
          }}
        >
          {p.name}: <strong>{formatCurrency(p.value)}</strong>
        </p>
      ))}
    </div>
  );
};

// ── Type badge ───────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const isIncome = type?.toLowerCase() === "income";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: isIncome ? "#dcfce7" : "#fee2e2",
        color: isIncome ? "#15803d" : "#dc2626",
        letterSpacing: ".02em",
      }}
    >
      {isIncome ? "▲" : "▼"} {type}
    </span>
  );
};

// ── Loading skeleton ─────────────────────────────────────────────────
const Skeleton = () => (
  <div
    style={{
      padding: "40px 32px",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      background: "#f8fafc",
      minHeight: "100vh",
    }}
  >
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          height: 34,
          width: 260,
          background: "#e2e8f0",
          borderRadius: 10,
          marginBottom: 32,
          animation: "pulse 1.5s infinite",
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              height: 120,
              background: "#e2e8f0",
              borderRadius: 18,
              animation: "pulse 1.5s infinite",
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 18,
        }}
      >
        <div
          style={{
            height: 320,
            background: "#e2e8f0",
            borderRadius: 20,
            animation: "pulse 1.5s infinite",
          }}
        />
        <div
          style={{
            height: 320,
            background: "#e2e8f0",
            borderRadius: 20,
            animation: "pulse 1.5s infinite",
          }}
        />
      </div>
    </div>

    <style>{`
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.55} }
    `}</style>
  </div>
);

// ════════════════════════════════════════════════════════════════════
const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getAdminDashboard();
      setDashboard(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!dashboard) return <Skeleton />;

  const financialStats = [
    {
      label: "Total Income",
      value: formatCurrency(dashboard.totalIncome),
      accent: "#10b981",
      icon: "💰",
    },
    {
      label: "Total Expense",
      value: formatCurrency(dashboard.totalExpense),
      accent: "#f43f5e",
      icon: "📤",
    },
    {
      label: "Balance",
      value: formatCurrency(dashboard.balance),
      accent: "#6366f1",
      icon: "🏦",
    },
    {
      label: "Total Records",
      value: dashboard.totalRecords ?? 0,
      accent: "#64748b",
      icon: "📋",
    },
  ];

  const userStats = [
    {
      label: "Total Users",
      value: dashboard.totalUsers ?? 0,
      accent: "#06b6d4",
      icon: "👥",
    },
    {
      label: "Premium Users",
      value: dashboard.totalPremiumUsers ?? 0,
      accent: "#f59e0b",
      icon: "💎",
    },
    {
      label: "Free Users",
      value: dashboard.totalFreeUsers ?? 0,
      accent: "#64748b",
      icon: "🆓",
    },
    {
      label: "Monthly Plans",
      value: dashboard.monthlyPlanUsers ?? 0,
      accent: "#10b981",
      icon: "📅",
    },
    {
      label: "Yearly Plans",
      value: dashboard.yearlyPlanUsers ?? 0,
      accent: "#6366f1",
      icon: "👑",
    },
    {
      label: "Income Transactions",
      value: dashboard.totalIncomeRecords ?? 0,
      accent: "#10b981",
      icon: "📈",
    },
    {
      label: "Expense Transactions",
      value: dashboard.totalExpenseRecords ?? 0,
      accent: "#f43f5e",
      icon: "📉",
    },
  ];

  const monthlyAnalysisPie = [
    { name: "Income", value: dashboard.totalIncome || 0 },
    { name: "Expense", value: dashboard.totalExpense || 0 },
  ];

  const monthlyTrendData = Array.isArray(dashboard.monthlyTrend)
    ? dashboard.monthlyTrend
    : [];

  const categoryExpenseData = Array.isArray(dashboard.categoryWiseExpenses)
    ? dashboard.categoryWiseExpenses
    : [];

  const recentTransactions = Array.isArray(dashboard.recentTransactions)
    ? dashboard.recentTransactions
    : [];

  return (
    <div
      style={{
        fontFamily: "'Inter','Segoe UI',sans-serif",
        background:
          "radial-gradient(circle at top left, rgba(99,102,241,.10), transparent 28%), radial-gradient(circle at top right, rgba(6,182,212,.10), transparent 24%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
        minHeight: "100vh",
        padding: "32px 20px 48px",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        {/* ── Header ─────────────────────────────────────────────── */}
        <div
          style={{
            marginBottom: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 12,
                fontWeight: 800,
                color: "#6366f1",
                letterSpacing: ".12em",
                textTransform: "uppercase",
              }}
            >
              Overview
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: 32,
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-.8px",
              }}
            >
              Admin Dashboard
            </h1>
            <p
              style={{
                margin: "8px 0 0",
                color: "#64748b",
                fontSize: 14,
              }}
            >
              Monitor finance, subscriptions, users, and recent transactions in one place
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(226,232,240,.9)",
              padding: "12px 14px",
              borderRadius: 16,
              boxShadow: "0 6px 18px rgba(15,23,42,.05)",
              minWidth: 200,
            }}
          >
            <p
              style={{
                margin: "0 0 4px",
                color: "#94a3b8",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              Snapshot
            </p>
            <p
              style={{
                margin: 0,
                color: "#0f172a",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Balance: {formatCurrency(dashboard.balance)}
            </p>
          </div>
        </div>

        {/* ── Financial Overview ───────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <Card
            title="Financial Overview"
            subtitle="Primary finance metrics presented in a clean KPI layout"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              {financialStats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          </Card>
        </div>

        {/* ── Users & Plans ─────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <Card
            title="Users & Plans"
            subtitle="Subscription and user distribution metrics grouped separately for clarity"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              {userStats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          </Card>
        </div>

        {/* ── Charts row 1 ─────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr .95fr",
            gap: 20,
            marginBottom: 24,
          }}
          className="chart-grid-two"
        >
          <Card
            title="Monthly Trend"
            subtitle="Income and expense performance over time"
          >
            

            <ResponsiveContainer width="100%" height={320}>
  <AreaChart data={dashboard.monthlyTrend || []}>
    <defs>
      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#10b981" stopOpacity={0.32} />
        <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
      </linearGradient>
      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.28} />
        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.03} />
      </linearGradient>
    </defs>

    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
    <XAxis
      dataKey="month"
      tick={{ fontSize: 12, fill: "#94a3b8" }}
      axisLine={false}
      tickLine={false}
    />
    <YAxis
      tick={{ fontSize: 12, fill: "#94a3b8" }}
      axisLine={false}
      tickLine={false}
    />
    <Tooltip content={<CustomTooltip />} />
    <Legend />

    <Area
      type="monotone"
      dataKey="totalIncome"
      stroke="#10b981"
      fill="url(#incomeGradient)"
      strokeWidth={3}
      name="Income"
    />
    <Area
      type="monotone"
      dataKey="totalExpense"
      stroke="#f43f5e"
      fill="url(#expenseGradient)"
      strokeWidth={3}
      name="Expense"
    />
  </AreaChart>
</ResponsiveContainer>
          </Card>

          <Card
            title="Monthly Analysis"
            subtitle="Overall income and expense split"
          >
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={monthlyAnalysisPie}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={108}
                  innerRadius={58}
                  paddingAngle={4}
                >
                  {monthlyAnalysisPie.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* ── Charts row 2 ─────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 24,
          }}
          className="chart-grid-two"
        >
          <Card
            title="Expense by Category"
            subtitle="Category-wise expense comparison"
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={categoryExpenseData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                />
                <Bar
                  dataKey="totalAmount"
                  fill="#6366f1"
                  name="Expense Amount"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card
            title="Subscription Summary"
            subtitle="Premium plan distribution snapshot"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                height: "100%",
              }}
            >
              <div
                style={{
                  borderRadius: 18,
                  padding: 20,
                  background: "linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%)",
                  border: "1px solid #fed7aa",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 150,
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      color: "#9a3412",
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Premium Users
                  </p>
                  <h3
                    style={{
                      margin: "10px 0 6px",
                      fontSize: 34,
                      color: "#7c2d12",
                      fontWeight: 900,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {dashboard.totalPremiumUsers ?? 0}
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: "#9a3412" }}>
                    Total active premium accounts
                  </p>
                </div>
                <div
                  style={{
                    marginTop: 14,
                    height: 8,
                    width: "100%",
                    borderRadius: 999,
                    background: "rgba(245,158,11,.16)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${
                        dashboard.totalUsers
                          ? (dashboard.totalPremiumUsers / dashboard.totalUsers) * 100
                          : 0
                      }%`,
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #f59e0b 0%, #f97316 100%)",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  borderRadius: 18,
                  padding: 20,
                  background: "linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)",
                  border: "1px solid #bae6fd",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  minHeight: 150,
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      color: "#0f766e",
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Plan Split
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(255,255,255,.65)",
                    padding: "12px 14px",
                    borderRadius: 14,
                  }}
                >
                  <span style={{ color: "#475569", fontWeight: 700, fontSize: 14 }}>
                    Monthly
                  </span>
                  <span
                    style={{
                      color: "#0f172a",
                      fontWeight: 900,
                      fontSize: 18,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {dashboard.monthlyPlanUsers ?? 0}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(255,255,255,.65)",
                    padding: "12px 14px",
                    borderRadius: 14,
                  }}
                >
                  <span style={{ color: "#475569", fontWeight: 700, fontSize: 14 }}>
                    Yearly
                  </span>
                  <span
                    style={{
                      color: "#0f172a",
                      fontWeight: 900,
                      fontSize: 18,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {dashboard.yearlyPlanUsers ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Recent Transactions ───────────────────────────────── */}
        <Card
          title="Recent Transactions"
          subtitle="Latest financial activity across the platform"
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 8px",
                fontSize: 14,
                minWidth: 760,
              }}
            >
              <thead>
                <tr>
                  {["Title", "Category", "Amount", "Type", "Date"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 14px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        color: "#94a3b8",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {recentTransactions.map((item, index) => (
                  <tr
                    key={item.id || index}
                    style={{
                      background: "#ffffff",
                      boxShadow: "0 4px 14px rgba(15,23,42,.04)",
                    }}
                  >
                    <td
                      style={{
                        padding: "16px 14px",
                        color: "#0f172a",
                        fontWeight: 700,
                        borderTopLeftRadius: 14,
                        borderBottomLeftRadius: 14,
                        borderTop: "1px solid #eef2f7",
                        borderBottom: "1px solid #eef2f7",
                        borderLeft: "1px solid #eef2f7",
                      }}
                    >
                      {item.title}
                    </td>

                    <td
                      style={{
                        padding: "16px 14px",
                        color: "#475569",
                        borderTop: "1px solid #eef2f7",
                        borderBottom: "1px solid #eef2f7",
                      }}
                    >
                      <span
                        style={{
                          background: "#f8fafc",
                          borderRadius: 999,
                          padding: "5px 10px",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#475569",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        {item.category}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "16px 14px",
                        fontWeight: 800,
                        color: "#0f172a",
                        fontVariantNumeric: "tabular-nums",
                        borderTop: "1px solid #eef2f7",
                        borderBottom: "1px solid #eef2f7",
                      }}
                    >
                      {formatCurrency(item.amount)}
                    </td>

                    <td
                      style={{
                        padding: "16px 14px",
                        borderTop: "1px solid #eef2f7",
                        borderBottom: "1px solid #eef2f7",
                      }}
                    >
                      <TypeBadge type={item.type} />
                    </td>

                    <td
                      style={{
                        padding: "16px 14px",
                        color: "#64748b",
                        fontSize: 13,
                        borderTopRightRadius: 14,
                        borderBottomRightRadius: 14,
                        borderTop: "1px solid #eef2f7",
                        borderBottom: "1px solid #eef2f7",
                        borderRight: "1px solid #eef2f7",
                      }}
                    >
                      {item.date?.split("T")[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ── Responsive styles ─────────────────────────────────── */}
        <style>{`
          @media (max-width: 1024px) {
            .chart-grid-two {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            table {
              min-width: 680px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AdminDashboard;