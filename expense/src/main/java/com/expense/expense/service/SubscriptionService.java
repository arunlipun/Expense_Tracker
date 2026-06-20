package com.expense.expense.service;

import com.expense.expense.enums.PlanType;

public interface SubscriptionService {
    void activateSubscription(Long userId, PlanType planType, double amount);
}
