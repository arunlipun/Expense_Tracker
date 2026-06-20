package com.expense.expense.service;

import java.util.Map;

public interface PaymentService {
    Map<String, Object> createOrder(double amount, String currency); // ✅ return Map not String
}