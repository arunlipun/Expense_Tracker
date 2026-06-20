package com.expense.expense.controller;

import com.expense.expense.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, String> body) {
        String planType = body.get("planType");
        double amount = "YEARLY".equals(planType) ? 999 : 199;
        Map<String, Object> order = paymentService.createOrder(amount, "INR");
        return ResponseEntity.ok(order);
    }
}