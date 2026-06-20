import { createOrder, verifyPayment } from "../api/paymentApi";
import { toast } from "react-toastify";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');`;

const PremiumUpgradeModal = ({ user, onClose, onSuccess }) => {

  const storedUserId = localStorage.getItem("userId");

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (planType) => {
    console.log("FULL USER OBJECT:", JSON.stringify(user));
    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    try {
      console.log("USER OBJECT:", user);
console.log("USER ID:", user?.id);
      const orderRes = await createOrder(planType);
      const order = orderRes.data;

      console.log("Order received:", order);

      if (!order.id) {
        toast.error("Order creation failed — no order ID");
        return;
      }

      const options = {
        key: "rzp_test_SWgcF87G8agcf8",
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Expense Tracker Premium",
        order_id: order.id,

        handler: async function (response) {
          console.log("Payment success, verifying...", response);
          const payload = {
    orderId: response.razorpay_order_id,
    paymentId: response.razorpay_payment_id,
    signature: response.razorpay_signature,
    planType: planType,
      userId: Number(storedUserId),
    amount:  planType === "YEARLY" ? 999 : 199,
  };

  console.log("VERIFY PAYLOAD:", payload);
          try {
            const amount = planType === "YEARLY" ? 999 : 199;
            await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              planType: planType,
             userId: Number(storedUserId),
              amount: amount,
            });
           
            toast.success("🎉 Premium Activated!");
            localStorage.setItem("isPremium", "true");
localStorage.setItem("planType", planType);
              setTimeout(() => {
    onSuccess?.();
    onClose?.();
  }, 1000);
           
          } catch (err) {
            // console.error("Verify error full:", err?.response);
            // console.error("Verify status:", err?.response?.status);
            // console.error("Verify data:", err?.response?.data);
             console.log("FULL ERROR:", err);
    console.log("ERROR RESPONSE:", err?.response);
    console.log("ERROR STATUS:", err?.response?.status);
    console.log("ERROR DATA:", err?.response?.data);
            toast.error("Payment done but verification failed. Contact support.");
          }
        },

        theme: { color: "#2D5BE3" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast.error("Payment failed: " + response.error.description);
      });
      rzp.open();

    } catch (err) {
      console.error("Order error:", err?.response?.data || err.message);
      toast.error("Could not start payment. Try again.");
    }
  };

  return (
    <>
      <style>{`
        ${FONTS}
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .plan-card {
          flex: 1;
          border-radius: 16px;
          padding: 24px 18px;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
          position: relative;
          overflow: hidden;
        }
        .plan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.13);
        }
        .plan-btn {
          width: 100%;
          border: none;
          padding: 11px 0;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          margin-top: 18px;
          letter-spacing: 0.02em;
          transition: opacity 0.15s, transform 0.15s;
        }
        .plan-btn:hover { opacity: 0.88; transform: scale(0.98); }
        .close-btn {
          margin-top: 22px;
          background: transparent;
          border: 1.5px solid #E5E7EB;
          padding: 9px 28px;
          border-radius: 10px;
          cursor: pointer;
          color: #9CA3AF;
          font-weight: 600;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.15s, color 0.15s;
        }
        .close-btn:hover { border-color: #9CA3AF; color: #6B7280; }
      `}</style>

      {/* Backdrop */}
      <div style={{
        position: "fixed", inset: 0,
        background: "rgba(10, 10, 30, 0.72)",
        backdropFilter: "blur(6px)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 999,
      }}>

        {/* Modal */}
        <div style={{
          width: 460,
          background: "#fff",
          borderRadius: 24,
          padding: "36px 32px 28px",
          textAlign: "center",
          fontFamily: "'Inter', sans-serif",
          animation: "modalIn 0.28s cubic-bezier(.22,.68,0,1.2) both",
          boxShadow: "0 32px 80px rgba(0,0,0,0.22)",
          position: "relative",
        }}>

          {/* Top glow accent */}
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: 220, height: 4,
            background: "linear-gradient(90deg, #2D5BE3, #7C3AED, #2D5BE3)",
            backgroundSize: "400px 4px",
            animation: "shimmer 2.4s infinite linear",
            borderRadius: "0 0 4px 4px",
          }} />

          {/* Header */}
          <div style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 36 }}>💎</span>
          </div>
          <h2 style={{
            margin: "8px 0 6px",
            fontFamily: "'Sora', sans-serif",
            fontSize: 22, fontWeight: 800,
            color: "#1a1a2e", letterSpacing: "-0.4px",
          }}>
            Upgrade to Premium
          </h2>
          <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 28px", lineHeight: 1.6 }}>
            AI-powered insights, budget alerts &amp; unlimited tracking
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            {["🤖 AI Insights", "📊 Budget Alerts", "♾️ Unlimited Tracking"].map(f => (
              <span key={f} style={{
                background: "#F0F4FF", color: "#2D5BE3",
                fontSize: 11, fontWeight: 600, padding: "4px 12px",
                borderRadius: 20, fontFamily: "'Sora', sans-serif",
                letterSpacing: "0.02em",
              }}>{f}</span>
            ))}
          </div>

          {/* Plan cards */}
          <div style={{ display: "flex", gap: 14 }}>

            {/* MONTHLY */}
            <div className="plan-card" style={{
              background: "linear-gradient(145deg, #F0F4FF 0%, #E8EEFF 100%)",
              border: "2px solid #2D5BE3",
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#2D5BE3",
                fontFamily: "'Sora', sans-serif", marginBottom: 10,
              }}>Monthly</div>
              <div style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 32, fontWeight: 800, color: "#1a1a2e",
                letterSpacing: "-1px", lineHeight: 1,
              }}>₹199</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>per month</div>
              <button
                className="plan-btn"
                onClick={() => handlePayment("MONTHLY")}
                style={{ background: "#2D5BE3", color: "#fff" }}
              >
                Get Monthly
              </button>
            </div>

            {/* YEARLY */}
            <div className="plan-card" style={{
              background: "linear-gradient(145deg, #F0FDF4 0%, #DCFCE7 100%)",
              border: "2px solid #16A34A",
            }}>
              {/* Best value badge */}
              <div style={{
                position: "absolute", top: 12, right: 12,
                background: "#16A34A", color: "#fff",
                fontSize: 9, fontWeight: 800, padding: "3px 8px",
                borderRadius: 20, fontFamily: "'Sora', sans-serif",
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>BEST VALUE</div>

              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#16A34A",
                fontFamily: "'Sora', sans-serif", marginBottom: 10,
              }}>Yearly</div>
              <div style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 32, fontWeight: 800, color: "#1a1a2e",
                letterSpacing: "-1px", lineHeight: 1,
              }}>₹999</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                per year · <span style={{ color: "#16A34A", fontWeight: 600 }}>Save 58%</span>
              </div>
              <button
                className="plan-btn"
                onClick={() => handlePayment("YEARLY")}
                style={{ background: "#16A34A", color: "#fff" }}
              >
                Get Yearly
              </button>
            </div>

          </div>

          {/* Footer */}
          <div style={{ marginTop: 20, fontSize: 11, color: "#9CA3AF" }}>
            🔒 Secured by Razorpay · Cancel anytime
          </div>

          <button className="close-btn" onClick={onClose}>
            Maybe later
          </button>

        </div>
      </div>
    </>
  );
};

export default PremiumUpgradeModal;