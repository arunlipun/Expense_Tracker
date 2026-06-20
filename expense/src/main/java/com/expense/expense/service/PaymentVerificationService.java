package com.expense.expense.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
//import java.util.Base64;

@Service
public class PaymentVerificationService {

    @Value("${razorpay.secret}")
    private String secret;

    public boolean verifySignature(String orderId, String paymentId, String signature) {

        try {
            String data = orderId + "|" + paymentId;

            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey =
                    new SecretKeySpec(secret.getBytes(), "HmacSHA256");

            sha256Hmac.init(secretKey);

            byte[] hash = sha256Hmac.doFinal(data.getBytes());

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString().equals(signature);

        } catch (Exception e) {
            throw new RuntimeException("Signature verification failed");
        }
    }
}