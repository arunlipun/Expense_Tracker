import React from "react";

const PdfReports = ({ expenses = [], income = 0 }) => {
  const downloadReport = () => {
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    const reportContent = `
      Monthly Expense Report

      Income: ₹${income}
      Total Expense: ₹${totalExpense}
      Remaining: ₹${income - totalExpense}

      Expense Breakdown:
      ${expenses
        .map((e) => `${e.title} - ₹${e.amount} (${e.category})`)
        .join("\n")}
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "expense-report.txt";
    link.click();
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-3">PDF Reports</h2>

      <p className="text-gray-600 mb-3">
        Download your monthly expense report
      </p>

      <button
        onClick={downloadReport}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Download Report
      </button>
    </div>
  );
};

export default PdfReports;