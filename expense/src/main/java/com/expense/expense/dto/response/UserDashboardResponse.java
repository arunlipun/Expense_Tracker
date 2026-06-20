package com.expense.expense.dto.response;

import com.expense.expense.dto.analytics.CategorySummaryResponse;
import com.expense.expense.dto.analytics.RecentTransactionResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
public class UserDashboardResponse {

    private Double totalIncome;
    private Double totalExpense;
    private Double balance;

    private Long totalTransactions;

    private Long totalIncomeTransactions;
    private Long totalExpenseTransactions;

    private List<RecentTransactionResponse> recentTransactions;

    private List<CategorySummaryResponse> categoryWiseExpenses;
    private Double expensePercentage;
    private Boolean premiumUser;
    private String planType;
}