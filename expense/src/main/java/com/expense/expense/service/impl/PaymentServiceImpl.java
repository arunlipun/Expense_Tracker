//package com.expense.expense.service.impl;
//
//import com.expense.expense.service.PaymentService;
//import com.razorpay.Order;
//import com.razorpay.RazorpayClient;
//import com.razorpay.RazorpayException;
//import org.json.JSONObject;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//@Service
//public class PaymentServiceImpl implements PaymentService {
//
//    @Autowired
//    private RazorpayClient razorpayClient;
//
//    @Override
//    public String createOrder(double amount, String currency) {
//
//        try {
//            JSONObject options = new JSONObject();
//
//            options.put("amount", amount * 100); // Razorpay uses paise
//            options.put("currency", currency);
//            options.put("receipt", "txn_" + System.currentTimeMillis());
//
//            Order order = razorpayClient.orders.create(options);
//
//            return order.toString();
//
//        } catch (RazorpayException e) {
//            throw new RuntimeException("Error creating Razorpay order");
//        }
//    }
//}
//======================//


package com.expense.expense.service.impl;

import com.expense.expense.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private RazorpayClient razorpayClient;

    @Override
    public Map<String, Object> createOrder(double amount, String currency) {
        try {
            JSONObject options = new JSONObject();
            options.put("amount", (int)(amount * 100)); // paise
            options.put("currency", currency);
            options.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(options);

            // ✅ Return as Map so Spring serializes it as proper JSON
            Map<String, Object> result = new HashMap<>();
            result.put("id", order.get("id"));           // Razorpay order id
            result.put("amount", order.get("amount"));   // amount in paise
            result.put("currency", order.get("currency"));
            result.put("receipt", order.get("receipt"));

            return result;

        } catch (RazorpayException e) {
            throw new RuntimeException("Error creating Razorpay order: " + e.getMessage());
        }
    }
}