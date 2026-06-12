package com.expense.expense.dto.response;

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
public class ExpenseResponse {

    private Long id;
    private String title;
    private Double amount;
    private String category;
    private String description;
    private LocalDateTime date;
    private TransactionType type;
}