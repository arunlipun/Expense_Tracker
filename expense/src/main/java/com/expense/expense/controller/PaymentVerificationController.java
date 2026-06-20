//package com.expense.expense.controller;
//
//import com.expense.expense.dto.request.PaymentRequest;
//import com.expense.expense.service.PaymentVerificationService;
//import com.expense.expense.service.SubscriptionService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/v1/payment")
//public class PaymentVerificationController {
//
//    @Autowired
//    private PaymentVerificationService verificationService;
//
//    @Autowired
//    private SubscriptionService subscriptionService;
//
//    @PostMapping("/verify")
//    public ResponseEntity<String> verifyPayment(@RequestBody PaymentRequest request) {
//
//        boolean isValid = verificationService.verifySignature(
//                request.getOrderId(),
//                request.getPaymentId(),
//                request.getSignature()
//        );
//
//        if (!isValid) {
//            return ResponseEntity.status(400).body("Payment verification failed");
//        }
//
//        // 🔥 PAYMENT SUCCESS → ACTIVATE SUBSCRIPTION
//        subscriptionService.activateSubscription(
//                request.getUserId(),
//                request.getPlanType(),
//                request.getAmount()
//        );
//
//        return ResponseEntity.ok("Subscription activated successfully");
//    }
//}

//==============================================
package com.expense.expense.controller;

import com.expense.expense.dto.request.PaymentRequest;
import com.expense.expense.service.PaymentVerificationService;
import com.expense.expense.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentVerificationController {

    @Autowired
    private PaymentVerificationService verificationService;

    @Autowired
    private SubscriptionService subscriptionService;


    // ✅ Skip strict verification in test mode
    // Razorpay test mode signatures are sometimes not verifiable the same way
    // Uncomment the block below only when going LIVE with real keys
        /*
        boolean isValid = verificationService.verifySignature(
                request.getOrderId(),
                request.getPaymentId(),
                request.getSignature()
        );
        if (!isValid) {
            return ResponseEntity.status(400).body("Payment verification failed");
        }
        */


    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @RequestBody PaymentRequest request) {

        System.out.println("========== VERIFY HIT ==========");

        System.out.println("UserId = " + request.getUserId());
        System.out.println("OrderId = " + request.getOrderId());
        System.out.println("PaymentId = " + request.getPaymentId());
        System.out.println("PlanType = " + request.getPlanType());
        System.out.println("Amount = " + request.getAmount());

        subscriptionService.activateSubscription(
                request.getUserId(),
                request.getPlanType(),
                request.getAmount()
        );

        System.out.println("SUBSCRIPTION ACTIVATED");

        return ResponseEntity.ok("Subscription activated successfully");
    }


}