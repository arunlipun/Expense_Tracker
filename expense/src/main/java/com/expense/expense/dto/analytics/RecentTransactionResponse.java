package com.expense.expense.dto.analytics;

import com.expense.expense.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecentTransactionResponse {
    private Long id;
    private String userId;
    private String title;
    private String category;
    private Double amount;
    private TransactionType type;
    private LocalDateTime date;
}