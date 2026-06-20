export const dummyResponses = {
  "how much did i spend": {
    keywords: ["how much did i spend", "total expense", "expense"],
    answer:
      "Based on your records, your total expenses are displayed in the dashboard. Review your category breakdown to identify major spending areas."
  },

  "how much did i save": {
    keywords: ["saving", "saved", "how much did i save"],
    answer:
      "Your savings are calculated as Income - Expense. You can find your latest savings amount in the AI Insights section."
  },

  "highest spending category": {
    keywords: ["highest spending category", "top category", "most spending"],
    answer:
      "Your highest spending category appears under Spending Breakdown. Consider reducing expenses in this category."
  },

  "budget": {
    keywords: ["budget", "daily budget", "weekly budget"],
    answer:
      "A recommended budget is generated based on your income. Daily and weekly limits are available in Smart Budget Planner."
  },

  "income": {
    keywords: ["income", "salary", "earning"],
    answer:
      "Your income records are used to calculate spending percentages, savings rates, and financial health scores."
  },

  "financial health": {
    keywords: ["financial health", "health score"],
    answer:
      "Your financial health score is based on the percentage of income spent. Lower spending relative to income results in a higher score."
  },

  "80 percent": {
    keywords: ["80%", "80 percent"],
    answer:
      "When expenses exceed 80% of income, the system generates a warning alert to help you manage spending."
  },

  "95 percent": {
    keywords: ["95%", "95 percent"],
    answer:
      "When expenses exceed 95% of income, the system triggers a critical alert indicating financial risk."
  },

  "investment": {
    keywords: ["investment", "invest"],
    answer:
      "Consider building an emergency fund first, then explore fixed deposits, mutual funds, or SIP investments according to your risk profile."
  },

  "emergency fund": {
    keywords: ["emergency fund"],
    answer:
      "A healthy emergency fund should cover at least 3-6 months of essential expenses."
  },

  "subscription": {
    keywords: ["subscription", "subscriptions"],
    answer:
      "Review recurring subscriptions regularly. Unused subscriptions can silently reduce monthly savings."
  },

  "credit card": {
    keywords: ["credit card"],
    answer:
      "Use credit cards responsibly. Pay the full outstanding balance every month to avoid interest charges."
  }
};

export const fallbackResponse =
  "I apologize, but I currently don't have a verified answer for that question. Please ask something related to expenses, income, savings, budgeting, investments, spending analysis, or financial health.";