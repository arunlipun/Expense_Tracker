import React from "react";

const stories = [
  {
    name: "Rahul Sharma",
    initials: "RS",
    tag: "Saved for bike",
    tagColor: { bg: "rgba(34,197,94,0.12)", color: "#4ade80" },
    avatarColor: { bg: "#16382D", color: "#86efac" },
    story:
      "I reduced my monthly expenses by 40% using expense tracking and saved for my first bike.",
    stat: "40% less expenses",
    statIcon: "ti-trending-down",
    statColor: "#4ade80",
    rating: 4.9,
    message: "Tracking daily spending changed everything for me.",
  },
  {
    name: "Anjali Verma",
    initials: "AV",
    tag: "Debt free",
    tagColor: { bg: "rgba(56,189,248,0.12)", color: "#38bdf8" },
    avatarColor: { bg: "#331C28", color: "#f9a8d4" },
    story:
      "The budgeting tips helped me clear my credit card debt in just 3 months.",
    stat: "3 months to clear debt",
    statIcon: "ti-credit-card-off",
    statColor: "#38bdf8",
    rating: 4.8,
    message: "Budget discipline helped me close my debt loop fast.",
  },
  {
    name: "Amit Das",
    initials: "AD",
    tag: "Now investing",
    tagColor: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24" },
    avatarColor: { bg: "#3A2B12", color: "#fde68a" },
    story:
      "I started investing after tracking expenses and now I have a strong savings habit.",
    stat: "Strong savings habit",
    statIcon: "ti-plant",
    statColor: "#fbbf24",
    rating: 4.9,
    message: "Small changes in spending gave me confidence to invest.",
  },
];

const financeInspiration = [
  {
    name: "Priyanka Personal Finance",
    type: "Finance Educator",
    insta: "@priyankafinance",
    linkedin: "priyankapersonalfinance",
    email: "contact@priyankapersonalfinance.com",
    note: "Public contact page shares beginner-friendly finance education channels.",
    color: "#38bdf8",
    icon: "ti-brand-instagram",
  },
  {
    name: "Srishti Gosavi",
    type: "CA & Finance Educator",
    insta: "@nerd_in_you",
    linkedin: "srishti-gosavi-8a860ba7",
    email: "funancenerd@gmail.com",
    note: "Public LinkedIn mentions her finance education work and Instagram handle.",
    color: "#f472b6",
    icon: "ti-school",
  },
  {
    name: "1% Club / Sharan Hegde",
    type: "Finance Creator Platform",
    insta: "@financewithsharan",
    linkedin: "sharanhegde95",
    email: "Public email not confirmed here",
    note: "LinkedIn highlights Sharan Hegde as Founder & CEO of 1% Club focused on financial independence.",
    color: "#22c55e",
    icon: "ti-target-arrow",
  },
  {
    name: "Financial Literacy Advisory Body India",
    type: "Financial Literacy Group",
    insta: "Instagram not confirmed here",
    linkedin: "financial-literacy-advisory-body-flab-india",
    email: "Use official website contact",
    note: "LinkedIn describes it as an organization conducting investor awareness and financial literacy sessions.",
    color: "#f59e0b",
    icon: "ti-users-group",
  },
  {
    name: "Cerebro Team",
    type: "Financial Literacy Academy",
    insta: "Check official channels",
    linkedin: "cerebroteamofficial",
    email: "Use official website contact",
    note: "LinkedIn presents it as a financial literacy academy with learners across multiple countries.",
    color: "#a78bfa",
    icon: "ti-brain",
  },
];

const premiumCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "22px",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
};

const sectionLabel = {
  margin: "0 0 12px",
  fontSize: 11,
  color: "rgba(255,255,255,0.56)",
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  fontWeight: 700,
};

const SuccessStories = () => {
  return (
    <div
      style={{
        padding: "1.5rem",
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.16), transparent 22%), radial-gradient(circle at top right, rgba(245,158,11,0.12), transparent 18%), linear-gradient(180deg, #050816 0%, #0b1020 50%, #05070f 100%)",
        borderRadius: "28px",
        border: "1px solid rgba(255,255,255,0.08)",
        marginBottom: "1rem",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
      }}
    >
      {/* Floating bubbles */}
      <div
        style={{
          position: "absolute",
          top: 28,
          right: 30,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.14), rgba(255,255,255,0.02))",
          filter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 130,
          right: 120,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "rgba(56,189,248,0.16)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 36,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "rgba(245,158,11,0.18)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 60,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(34,197,94,0.12)",
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.4rem", position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "14px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i className="ti ti-award" style={{ fontSize: 18, color: "#f8fafc" }} aria-hidden="true" />
        </div>

        <div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "rgba(255,255,255,0.62)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontWeight: 700,
            }}
          >
            Success stories
          </p>
          <h3
            style={{
              margin: "4px 0 0",
              fontSize: "1.15rem",
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            Member wins & money transformation
          </h3>
        </div>

        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontWeight: 600,
          }}
        >
          {stories.length} members
        </span>
      </div>

      {/* Hero top row with floating profile bubbles */}
      <div
        style={{
          ...premiumCard,
          padding: "18px",
          marginBottom: "1.2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p style={sectionLabel}>Trusted community vibe</p>
            <h4 style={{ margin: "0 0 8px", color: "#fff", fontSize: "1.1rem" }}>
              Real people. Real habits. Real progress.
            </h4>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 1.6, maxWidth: 520 }}>
              Expense discipline, debt reduction, and savings consistency are the most visible themes across these stories.
            </p>
          </div>

          <div style={{ position: "relative", width: 220, height: 110 }}>
            {stories.map((s, i) => {
              const positions = [
                { top: 10, left: 0 },
                { top: 36, left: 72 },
                { top: 4, left: 145 },
              ];
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    ...positions[i],
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    background: s.avatarColor.bg,
                    color: s.avatarColor.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                    border: "2px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.25)",
                  }}
                >
                  {s.initials}
                </div>
              );
            })}
            <div
              style={{
                position: "absolute",
                right: 10,
                bottom: 2,
                padding: "7px 11px",
                borderRadius: 999,
                fontSize: 11,
                color: "#fde68a",
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.18)",
                fontWeight: 600,
              }}
            >
              Premium stories
            </div>
          </div>
        </div>
      </div>

      {/* Story cards */}
      <div style={{ display: "grid", gap: 12, marginBottom: "1.25rem" }}>
        {stories.map((s, i) => (
          <div
            key={i}
            style={{
              ...premiumCard,
              padding: "18px",
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: s.avatarColor.bg,
                  color: s.avatarColor.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                {s.initials}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>{s.name}</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                  Verified member story
                </p>
              </div>

              <span
                style={{
                  fontSize: 11,
                  padding: "5px 10px",
                  borderRadius: 999,
                  background: s.tagColor.bg,
                  color: s.tagColor.color,
                  fontWeight: 700,
                }}
              >
                {s.tag}
              </span>
            </div>

            {/* Story */}
            <p
              style={{
                margin: "0 0 12px",
                fontSize: 13.5,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.7,
              }}
            >
              “{s.story}”
            </p>

            {/* Rating + review message */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 12,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.52)" }}>Review message</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#e5e7eb", lineHeight: 1.5 }}>
                  {s.message}
                </p>
              </div>

              <div
                style={{
                  minWidth: 90,
                  textAlign: "center",
                  padding: "10px 12px",
                  borderRadius: "16px",
                  background: "rgba(250,204,21,0.08)",
                  border: "1px solid rgba(250,204,21,0.16)",
                }}
              >
                <div style={{ color: "#facc15", fontSize: 14, marginBottom: 4 }}>
                  ★★★★★
                </div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{s.rating}/5</div>
              </div>
            </div>

            {/* Stat row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                paddingTop: 12,
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <i className={`ti ${s.statIcon}`} style={{ fontSize: 15, color: s.statColor }} aria-hidden="true" />
              <span style={{ fontSize: 12.5, color: s.statColor, fontWeight: 700 }}>{s.stat}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mini messages under photos/reviews vibe */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={sectionLabel}>Community messages</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
          {[
            "Started tracking chai and food deliveries — huge difference in monthly cash flow.",
            "I finally understood where my money was leaking every weekend.",
            "The savings reminders made me more consistent than motivation ever did.",
          ].map((msg, i) => (
            <div
              key={i}
              style={{
                ...premiumCard,
                padding: "14px 16px",
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#cbd5e1",
                    flexShrink: 0,
                  }}
                >
                  <i className="ti ti-message-circle" aria-hidden="true" />
                </div>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.6 }}>
                  {msg}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspiration section */}
      <div>
        <p style={sectionLabel}>Inspired by educators & literacy groups</p>
        <div style={{ display: "grid", gap: 12 }}>
          {financeInspiration.map((item, i) => (
            <div
              key={i}
              style={{
                ...premiumCard,
                padding: "16px 18px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        background: `${item.color}18`,
                        border: `1px solid ${item.color}33`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.color,
                        flexShrink: 0,
                      }}
                    >
                      <i className={`ti ${item.icon}`} aria-hidden="true" />
                    </div>
                    <div>
                      <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 14 }}>{item.name}</p>
                      <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.52)", fontSize: 12 }}>{item.type}</p>
                    </div>
                  </div>

                  <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", fontSize: 13, lineHeight: 1.6 }}>
                    {item.note}
                  </p>
                </div>

                <div
                  style={{
                    minWidth: 240,
                    display: "grid",
                    gap: 8,
                    alignSelf: "center",
                  }}
                >
                  <div
                    style={{
                      padding: "8px 10px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#e5e7eb",
                      fontSize: 12.5,
                    }}
                  >
                    <strong style={{ color: "#94a3b8" }}>Instagram:</strong> {item.insta}
                  </div>

                  <div
                    style={{
                      padding: "8px 10px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#e5e7eb",
                      fontSize: 12.5,
                    }}
                  >
                    <strong style={{ color: "#94a3b8" }}>LinkedIn:</strong> {item.linkedin}
                  </div>

                  <div
                    style={{
                      padding: "8px 10px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#e5e7eb",
                      fontSize: 12.5,
                    }}
                  >
                    <strong style={{ color: "#94a3b8" }}>Email:</strong> {item.email}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;