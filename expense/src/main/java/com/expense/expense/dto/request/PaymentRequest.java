package com.expense.expense.dto.request;

import com.expense.expense.enums.PlanType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {
    private Long userId;
    private String orderId;
    private String paymentId;
    private String signature;
    private PlanType planType;
    private double amount;
}
