package com.expense.expense.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryResponse {
    private String userId;
    private String userName;
    private String email;
    private Double totalIncome;
    private Double totalExpense;
    private Double netBalance;
    private Long totalTransactions;

    private Boolean premiumUser;
    private String planType;
}