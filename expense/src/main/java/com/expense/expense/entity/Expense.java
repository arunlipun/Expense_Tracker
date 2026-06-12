package com.expense.expense.entity;

import com.expense.expense.enums.TransactionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



import java.time.LocalDateTime;

@Entity
@Table(name = "expense_tracker")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    private String title;


    private Double amount;


    private String category;


    private String description;

    @Column(nullable = false)
    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Column(updatable = false)
    private LocalDateTime createdAt;


    private LocalDateTime updatedAt;


    private boolean deleted = false;


    private LocalDateTime deletedAt;
}