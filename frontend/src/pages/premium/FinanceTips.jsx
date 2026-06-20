import React, { useEffect, useState } from "react";

const iconMap = {
  "⚠️": { icon: "ti-alert-circle", color: "var(--color-text-warning)" },
  "💡": { icon: "ti-bulb", color: "var(--color-text-warning)" },
  "✅": { icon: "ti-circle-check", color: "var(--color-text-success)" },
  "📌": { icon: "ti-pin", color: "var(--color-text-info)" },
  "📊": { icon: "ti-chart-bar", color: "var(--color-text-info)" },
  "💰": { icon: "ti-piggy-bank", color: "var(--color-text-success)" },
};

const parseTip = (text) => {
  for (const [emoji, meta] of Object.entries(iconMap)) {
    if (text.startsWith(emoji)) {
      return { ...meta, text: text.replace(emoji, "").trim() };
    }
  }
  return { icon: "ti-info-circle", color: "var(--color-text-secondary)", text };
};

const FinanceTips = ({ expenses = [], income = 0 }) => {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    generateTips();
  }, [JSON.stringify(expenses), income]);

  const generateTips = () => {
    let temp = [];

    if (!income) {
      setTips(["Add income to get personalized finance tips"]);
      return;
    }

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const percentage = (totalExpense / income) * 100;

    if (percentage >= 80) {
      temp.push("⚠️ Cut down on non-essential spending immediately");
      temp.push("💡 Avoid online impulsive shopping");
    } else {
      temp.push("✅ Great job! Keep maintaining your budget discipline");
    }

    temp.push("📌 Always track your daily expenses");
    temp.push("📊 Review weekly spending patterns");
    temp.push("💰 Try automating monthly savings");

    setTips(temp);
  };

  const card = {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "13px 15px",
    borderRadius: "var(--border-radius-md)",
    background: "var(--color-background-secondary)",
    border: "0.5px solid var(--color-border-tertiary)",
  };

  const sectionTitle = {
    margin: "0 0 0.9rem",
    fontSize: 12,
    color: "var(--color-text-tertiary)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 600,
  };

  const smallCard = {
    padding: "14px",
    borderRadius: "var(--border-radius-md)",
    background: "var(--color-background-secondary)",
    border: "0.5px solid var(--color-border-tertiary)",
  };

  const books = [
    {
      title: "Traction",
      author: "Gabriel Weinberg & Justin Mares",
      note: "Customer acquisition and repeatable growth channels.",
    },
    {
      title: "The Lean Startup",
      author: "Eric Ries",
      note: "Build, test, and improve faster with less waste.",
    },
    {
      title: "Talk Triggers",
      author: "Jay Baer & Daniel Lemin",
      note: "Create word-of-mouth growth through memorable customer experience.",
    },
    {
      title: "Break Through the Noise",
      author: "Tim Staples",
      note: "Improve messaging and stand out in a crowded market.",
    },
  ];

  const faqs = [
    {
      q: "How can I grow my business with a small budget?",
      a: "Start by controlling unnecessary expenses, validating demand early, and investing only in channels that bring measurable results.",
    },
    {
      q: "Should I focus on savings or marketing first?",
      a: "Build a basic emergency buffer first, then spend on low-cost marketing channels that you can track clearly.",
    },
    {
      q: "Is YouTube useful for business growth?",
      a: "Yes. It can build trust, attract leads, and help people discover your brand through searchable content.",
    },
    {
      q: "How often should I review performance?",
      a: "Track expenses daily, review spending weekly, and review business growth metrics every month.",
    },
  ];

  const videos = [
    {
      title: "How to Start a YouTube Channel for Your Business",
      url: "https://www.youtube.com/watch?v=3VTsTia4OKA",
    },
    {
      title: "Answering Your Shopify Questions: FAQ Edition",
      url: "https://www.youtube.com/watch?v=D3ftDkhzXLM",
    },
  ];

  return (
    <div
      style={{
        padding: "1.5rem",
        background: "radial-gradient(circle at top left, rgba(37,99,235,0.16), transparent 26%), radial-gradient(circle at top right, rgba(245,158,11,0.12), transparent 22%), linear-gradient(180deg, #0b1220 0%, #0f172a 100%)",
        borderRadius: "var(--border-radius-lg)",
        border: "0.5px solid var(--color-border-tertiary)",
        marginBottom: "1rem",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "var(--border-radius-md)",
            background: "var(--color-background-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i
            className="ti ti-rocket"
            style={{ fontSize: 16, color: "var(--color-text-secondary)" }}
            aria-hidden="true"
          />
        </div>

        <span
          style={{
            fontSize: 13,
            color: "var(--color-text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontWeight: 500,
          }}
        >
          Finance tips
        </span>

        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            padding: "3px 8px",
            borderRadius: 999,
            background: "var(--color-background-secondary)",
            color: "var(--color-text-tertiary)",
            border: "0.5px solid var(--color-border-tertiary)",
          }}
        >
          {tips.length} tips
        </span>
      </div>

      {/* Tips */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.25rem" }}>
        {tips.map((t, i) => {
          const { icon, color, text } = parseTip(t);
          return (
            <div key={i} style={card}>
              <i
                className={`ti ${icon}`}
                style={{ fontSize: 17, color, marginTop: 1, flexShrink: 0 }}
                aria-hidden="true"
              />
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "var(--color-text-primary)",
                  lineHeight: 1.5,
                }}
              >
                {text}
              </p>
            </div>
          );
        })}
      </div>

      {/* Books */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={sectionTitle}>Business growth books</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {books.map((book, i) => (
            <div key={i} style={smallCard}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <i
                  className="ti ti-book"
                  style={{ fontSize: 18, color: "var(--color-text-info)", marginTop: 2 }}
                  aria-hidden="true"
                />
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>
                    {book.title}
                  </p>
                  <p style={{ margin: "4px 0", fontSize: 12, color: "var(--color-text-secondary)" }}>
                    {book.author}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-tertiary)", lineHeight: 1.5 }}>
                    {book.note}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={sectionTitle}>Growth FAQ</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((item, i) => (
            <div key={i} style={smallCard}>
              <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>
                {item.q}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Videos */}
      <div>
        <p style={sectionTitle}>YouTube videos for business growth</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {videos.map((video, i) => (
            <a
              key={i}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...smallCard,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <i
                className="ti ti-brand-youtube"
                style={{ fontSize: 20, color: "var(--color-text-danger)" }}
                aria-hidden="true"
              />
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>
                  {video.title}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--color-text-tertiary)" }}>
                  Watch on YouTube
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceTips;