package com.expense.expense.service.impl;

import com.expense.expense.service.OtpService;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class OtpServiceImpl implements OtpService {

    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    public String generateOtp() {

        int otp = 100000 + RANDOM.nextInt(900000);

        return String.valueOf(otp);
    }
}