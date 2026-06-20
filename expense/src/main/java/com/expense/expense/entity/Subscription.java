package com.expense.expense.entity;

import com.expense.expense.enums.PlanType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Enumerated(EnumType.STRING)
    private PlanType planType;

    private Double amount;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Boolean active;
}